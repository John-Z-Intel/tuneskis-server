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
  res.set('Cache-Control', 'public, max-age=300'); // 5 min; ?v= handles hard refreshes
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
  const { amount, currency } = req.body;
  if (!amount || amount < 50) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,          // in cents
      currency: currency || 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
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
