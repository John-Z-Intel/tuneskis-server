// tuneskis-server — Stripe checkout + Gmail email notifications
const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const Stripe     = require('stripe');

const app    = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// ── Storefront script (served to Squarespace) ─────────────────
// The entire storefront JS lives in storefront.js next to this file.
// Squarespace's footer just loads it with:
//   <script src="https://tuneskis-server.onrender.com/storefront.js?v=1"></script>
// Bump the ?v= number whenever storefront.js changes so browsers refetch it.
const path = require('path');
app.get('/storefront.js', (req, res) => {
  res.set('Content-Type', 'application/javascript; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=60'); // 60s; ?v= bump forces an immediate refetch
  res.sendFile(path.join(__dirname, 'storefront.js'));
});
// Lets Squarespace show the hero instantly while the big script downloads
app.get('/ping', (req, res) => res.json({ ok: true }));

// ── Heartland config ──────────────────────────────────────────
const HL_TOKEN    = process.env.HL_TOKEN    || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE_URL = process.env.HL_BASE_URL || 'https://tuneskis.retail.heartland.us';

// ── Gmail transporter ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

// ── Heartland inventory decrement ────────────────────────────
async function hlDecrementInventory(items) {
  for (const item of items) {
    if (!item.hlId) continue;
    try {
      const r = await fetch(
        `${HL_BASE_URL}/api/inventory/adjustments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HL_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_id: item.hlId,
            location_id: 100005,
            adjustment_reason_id: 100003,
            qty: -(item.qty || 1),
            unit_cost: 0
          })
        }
      );
      console.log(`[inventory] decremented hlId:${item.hlId} qty:${item.qty||1} status:${r.status}`);
    } catch (err) {
      console.error(`[inventory] failed to decrement hlId:${item.hlId}:`, err.message);
    }
  }
}

// ── Shared: fetch Heartland qty-on-hand for every item ────────
async function hlFetchQtyMap() {
  let allValues = [], page = 1;
  while (true) {
    const r = await fetch(
      `${HL_BASE_URL}/api/inventory/values?group[]=item_id&per_page=250&page=${page}`,
      { headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Accept': 'application/json' } }
    );
    const data = await r.json();
    if (!data.results || !data.results.length) break;
    allValues = allValues.concat(data.results);
    if (page >= data.pages) break;
    page++;
  }
  const map = {};
  allValues.forEach(v => { map[v.item_id] = Math.max(0, v.qty_on_hand || 0); });
  return map;
}

// ── Deal of the Day sales counter (no Heartland item needed) ──
// Counts how many of each day's deal have actually been paid for, so a
// "1 available" deal really stops at 1. Keyed by deal + calendar date, so
// it resets on its own each day with nothing for you to do.
const fs = require('fs');
const DEAL_SALES_FILE = '/tmp/tuneskis-deal-sales.json';
let dealSales = {};
try { dealSales = JSON.parse(fs.readFileSync(DEAL_SALES_FILE, 'utf8')); } catch (e) { dealSales = {}; }
function saveDealSales() {
  try { fs.writeFileSync(DEAL_SALES_FILE, JSON.stringify(dealSales)); } catch (e) { /* best effort */ }
}
function dealDateKeyNY() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD
}
function dealSlot(dealKey) { return `${dealKey}:${dealDateKeyNY()}`; }
function dealSoldCount(dealKey) { return dealSales[dealSlot(dealKey)] || 0; }
function dealRecordSale(dealKey, n) {
  const slot = dealSlot(dealKey);
  dealSales[slot] = (dealSales[slot] || 0) + (n || 1);
  // prune anything older than a week so the file stays tiny
  const cutoff = new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString('en-CA', { timeZone:'America/New_York' });
  Object.keys(dealSales).forEach(k => { if ((k.split(':')[1] || '') < cutoff) delete dealSales[k]; });
  saveDealSales();
}

// ── GET /deal-status ──────────────────────────────────────────
// The storefront polls this to show "X left" and to flip to SOLD OUT.
app.get('/deal-status', (req, res) => {
  const key = String(req.query.key || '');
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 1);
  const sold = dealSoldCount(key);
  const held = reservedQty('DEAL:' + key);
  const left = Math.max(0, limit - sold - held);
  res.json({ success: true, key, limit, sold, left, soldOut: left <= 0 });
});

// ── Short-lived reservations ──────────────────────────────────
// Heartland isn't decremented until AFTER the card is charged (that happens
// in /send-order-email). That leaves a window where two shoppers could both
// pass a stock check and both get charged for the same single item. When we
// create a payment intent we reserve the units here, so a second buyer is
// refused immediately even though Heartland still shows them in stock.
// Reservations expire on their own in case a customer abandons checkout.
const RESERVATION_MS = 12 * 60 * 1000; // 12 minutes
const reservations = new Map(); // hlId -> [{ qty, expires }]

function reservedQty(hlId) {
  const now = Date.now();
  const list = (reservations.get(hlId) || []).filter(r => r.expires > now);
  if (list.length) reservations.set(hlId, list); else reservations.delete(hlId);
  return list.reduce((sum, r) => sum + r.qty, 0);
}
function reserve(hlId, qty) {
  const list = (reservations.get(hlId) || []).filter(r => r.expires > Date.now());
  list.push({ qty, expires: Date.now() + RESERVATION_MS });
  reservations.set(hlId, list);
}
function releaseOne(hlId, qty) {
  const list = (reservations.get(hlId) || []).filter(r => r.expires > Date.now());
  const i = list.findIndex(r => r.qty === qty);
  if (i !== -1) list.splice(i, 1);
  if (list.length) reservations.set(hlId, list); else reservations.delete(hlId);
}

// ── GET /inventory ────────────────────────────────────────────
app.get('/inventory', async (req, res) => {
  try {
    let allValues = [], page = 1;
    while (true) {
      const r = await fetch(
        `${HL_BASE_URL}/api/inventory/values?group[]=item_id&per_page=250&page=${page}`,
        { headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Accept': 'application/json' } }
      );
      const data = await r.json();
      if (!data.results || !data.results.length) break;
      allValues = allValues.concat(data.results);
      if (page >= data.pages) break;
      page++;
    }
    let allItems = [], ipage = 1;
    while (true) {
      const r = await fetch(
        `${HL_BASE_URL}/api/items?per_page=250&page=${ipage}`,
        { headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Accept': 'application/json' } }
      );
      const data = await r.json();
      if (!data.results || !data.results.length) break;
      allItems = allItems.concat(data.results);
      if (ipage >= data.pages) break;
      ipage++;
    }
    const priceMap = {};
    allItems.forEach(i => { priceMap[i.id] = i.price || 0; });
    const items = allValues.map(v => ({
      id:    v.item_id,
      qty:   Math.max(0, v.qty_on_hand || 0),
      price: priceMap[v.item_id] || 0,
    }));
    console.log(`[inventory] returned ${items.length} items`);
    res.json({ success: true, items });
  } catch (err) {
    console.error('[inventory]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /create-payment-intent ───────────────────────────────
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, items } = req.body;
  if (!amount || amount < 50) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // ── Stock guard: verify every tracked item is still available BEFORE
  // charging anyone. This is what makes a 1-of-1 deal truly 1-of-1 — even
  // if two people hit Buy in the same second, the second is refused here
  // and no card is charged.
  // Deal items are capped by our own counter (no Heartland item required)
  const dealItems = (items || []).filter(i => i && i.dealKey);
  for (const d of dealItems) {
    const limit = Math.max(1, parseInt(d.dealLimit, 10) || 1);
    const want = Math.max(1, d.qty || 1);
    const taken = dealSoldCount(d.dealKey) + reservedQty('DEAL:' + d.dealKey);
    if (taken + want > limit) {
      console.log(`[deal cap] REFUSED ${d.dealKey} want:${want} sold:${dealSoldCount(d.dealKey)} held:${reservedQty('DEAL:'+d.dealKey)} limit:${limit}`);
      return res.status(409).json({
        error: `Sorry — "${d.name || "today's deal"}" just sold out. Your card has not been charged.`,
        soldOut: true, dealKey: d.dealKey
      });
    }
  }

  const tracked = (items || []).filter(i => i && i.hlId);
  const claimed = [];
  // Hold the deal slots for this checkout
  dealItems.forEach(d => {
    const want = Math.max(1, d.qty || 1);
    reserve('DEAL:' + d.dealKey, want);
    claimed.push({ hlId: 'DEAL:' + d.dealKey, qty: want });
  });
  if (tracked.length) {
    let qtyMap;
    try {
      qtyMap = await hlFetchQtyMap();
    } catch (err) {
      console.error('[stock check] Heartland lookup failed:', err.message);
      return res.status(503).json({ error: 'Could not verify stock right now. Please try again in a moment.' });
    }
    for (const item of tracked) {
      const want = Math.max(1, item.qty || 1);
      const onHand = qtyMap[item.hlId] || 0;
      const available = onHand - reservedQty(item.hlId);
      if (available < want) {
        claimed.forEach(c => releaseOne(c.hlId, c.qty)); // roll back this request's holds
        console.log(`[stock check] REFUSED hlId:${item.hlId} want:${want} onHand:${onHand} reserved:${reservedQty(item.hlId)}`);
        return res.status(409).json({
          error: `Sorry — "${item.name || 'that item'}" just sold out. Your card has not been charged.`,
          soldOut: true, hlId: item.hlId
        });
      }
      reserve(item.hlId, want);
      claimed.push({ hlId: item.hlId, qty: want });
    }
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,          // in cents
      currency: currency || 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    claimed.forEach(c => releaseOne(c.hlId, c.qty)); // Stripe failed — free the holds
    console.error('[stripe]', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /send-order-email ────────────────────────────────────
app.post('/send-order-email', async (req, res) => {
  const { customer, order } = req.body;
  if (!customer || !order) return res.status(400).json({ success: false, error: 'Missing data' });

  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:'America/New_York' });
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', timeZoneName:'short', timeZone:'America/New_York' });

  const itemRows = (order.items || []).map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${i.size || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">$${Number(i.price).toFixed(2)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
    <div style="background:#1a1a2e;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🎿 New Order — Tune Skis LLC</h1>
    </div>
    <div style="background:#f9f9f9;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      <p style="margin:0 0 4px;color:#666;font-size:13px;">ORDER PLACED</p>
      <p style="margin:0 0 20px;font-size:16px;font-weight:bold;">${dateStr} at ${timeStr}</p>
      ${order.orderId ? `<p style="margin:0 0 20px;color:#888;font-size:13px;">Stripe Payment ID: ${order.orderId}</p>` : ''}
      ${order.fulfillment ? `<p style="margin:0 0 20px;font-size:14px;"><strong>Fulfillment:</strong> ${order.fulfillment}</p>` : ''}
      <hr style="border:none;border-top:1px solid #ddd;margin:0 0 20px;">
      <h3 style="margin:0 0 10px;font-size:14px;color:#666;">CUSTOMER</h3>
      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:3px 0;color:#888;width:80px;">Name</td><td><strong>${customer.name}</strong></td></tr>
        <tr><td style="padding:3px 0;color:#888;">Email</td><td><a href="mailto:${customer.email}">${customer.email}</a></td></tr>
        <tr><td style="padding:3px 0;color:#888;">Phone</td><td>${customer.phone || '—'}</td></tr>
      </table>
      <h3 style="margin:0 0 10px;font-size:14px;color:#666;">ADDRESS</h3>
      <p style="font-size:14px;margin:0 0 20px;line-height:1.7;">
        ${customer.address?.line1 || ''}<br>
        ${customer.address?.line2 ? customer.address.line2 + '<br>' : ''}
        ${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.zip || ''}
      </p>
      <h3 style="margin:0 0 10px;font-size:14px;color:#666;">ORDER ITEMS</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead><tr style="background:#e8e8e8;">
          <th style="padding:8px 12px;text-align:left;">Item</th>
          <th style="padding:8px 12px;text-align:center;">Size</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Price</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <table style="width:100%;font-size:14px;">
        <tr><td style="padding:3px 0;color:#888;">Subtotal</td><td style="text-align:right;">$${Number(order.subtotal||0).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;color:#888;">Shipping</td><td style="text-align:right;">${order.shipping === 0 ? 'FREE' : '$' + Number(order.shipping||0).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;color:#888;">Tax</td><td style="text-align:right;">$${Number(order.tax||0).toFixed(2)}</td></tr>
        <tr style="font-size:17px;font-weight:bold;border-top:2px solid #ddd;">
          <td style="padding:10px 0 0;">TOTAL</td>
          <td style="text-align:right;padding-top:10px;">$${Number(order.total||0).toFixed(2)}</td>
        </tr>
      </table>
    </div>
    <p style="text-align:center;color:#aaa;font-size:12px;margin-top:16px;">
      Tune Skis LLC · 272 Saratoga Rd, Schenectady NY 12302 · (888) 863-7547
    </p>
  </div>`;

  try {
    await transporter.sendMail({
      from:    `"Tune Skis Store" <${process.env.GMAIL_USER}>`,
      to:      'info@tuneskis.com',
      subject: `New Order — ${customer.name} — $${Number(order.total||0).toFixed(2)}`,
      html,
    });
    console.log(`[email] Sent — ${customer.name} $${order.total}`);
    // Payment went through — count any Deal of the Day items against the cap
    (order.items || []).forEach(i => {
      if (i && i.dealKey) {
        dealRecordSale(i.dealKey, i.qty || 1);
        releaseOne('DEAL:' + i.dealKey, i.qty || 1); // hold becomes a confirmed sale
        console.log(`[deal cap] SOLD ${i.dealKey} -> ${dealSoldCount(i.dealKey)} total today`);
      }
    });
    // Decrement inventory in Heartland
    if (order.items && order.items.length) {
      hlDecrementInventory(order.items).catch(err => console.error('[inventory decrement]', err));
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[email] Failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tune Skis server running on port ${PORT}`));
