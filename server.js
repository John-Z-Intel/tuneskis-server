// tuneskis-server — with Gmail email notifications
// Deploy to Render.com as server.js

const express      = require('express');
const cors         = require('cors');
const nodemailer   = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ── Gmail transporter ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ── Heartland config ──────────────────────────────────────────
const HL_TOKEN    = process.env.HL_TOKEN    || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE_URL = process.env.HL_BASE_URL || 'https://tuneskis.retail.heartland.us';

// ── GET /inventory ────────────────────────────────────────────
app.get('/inventory', async (req, res) => {
  try {
    let allItems = [], page = 1;
    while (true) {
      const r = await fetch(`${HL_BASE_URL}/api/items?page=${page}&per_page=250`, {
        headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Accept': 'application/json' },
      });
      const data = await r.json();
      if (!data.results) break;
      allItems = allItems.concat(data.results);
      if (page >= data.pages) break;
      page++;
    }
    const items = allItems
      .filter(i => i['track_inventory?'])
      .map(i => ({ id: i.id, qty: i.qty_on_hand || 0, price: i.price || 0 }));
    res.json({ success: true, items });
  } catch (err) {
    console.error('[inventory]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /send-order-email ────────────────────────────────────
app.post('/send-order-email', async (req, res) => {
  const { customer, order } = req.body;
  if (!customer || !order) {
    return res.status(400).json({ success: false, error: 'Missing customer or order data' });
  }

  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:'America/New_York' });
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', timeZoneName:'short', timeZone:'America/New_York' });

  const itemRows = (order.items || []).map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.size || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">$${Number(item.price).toFixed(2)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
    <div style="background:#1a1a2e;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🎿 New Order — Tune Skis LLC</h1>
    </div>
    <div style="background:#f9f9f9;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">

      <p style="margin:0 0 4px;color:#666;font-size:13px;">ORDER PLACED</p>
      <p style="margin:0 0 4px;font-size:16px;font-weight:bold;">${dateStr} at ${timeStr}</p>
      ${order.orderId ? `<p style="margin:0 0 24px;color:#888;font-size:13px;">Order ID: ${order.orderId}</p>` : '<br>'}

      <hr style="border:none;border-top:1px solid #ddd;margin:0 0 20px;">

      <h3 style="margin:0 0 10px;font-size:14px;color:#666;letter-spacing:1px;">CUSTOMER</h3>
      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:3px 0;color:#888;width:80px;">Name</td><td><strong>${customer.name}</strong></td></tr>
        <tr><td style="padding:3px 0;color:#888;">Email</td><td><a href="mailto:${customer.email}" style="color:#1a1a2e;">${customer.email}</a></td></tr>
        <tr><td style="padding:3px 0;color:#888;">Phone</td><td>${customer.phone || '—'}</td></tr>
      </table>

      <h3 style="margin:0 0 10px;font-size:14px;color:#666;letter-spacing:1px;">SHIPPING ADDRESS</h3>
      <p style="font-size:14px;margin:0 0 20px;line-height:1.7;">
        ${customer.address?.line1 || ''}<br>
        ${customer.address?.line2 ? customer.address.line2 + '<br>' : ''}
        ${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.zip || ''}
      </p>

      <h3 style="margin:0 0 10px;font-size:14px;color:#666;letter-spacing:1px;">ORDER ITEMS</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr style="background:#e8e8e8;">
            <th style="padding:8px 12px;text-align:left;">Item</th>
            <th style="padding:8px 12px;text-align:center;">Size</th>
            <th style="padding:8px 12px;text-align:center;">Qty</th>
            <th style="padding:8px 12px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <table style="width:100%;font-size:14px;">
        <tr><td style="padding:3px 0;color:#888;">Subtotal</td><td style="text-align:right;">$${Number(order.subtotal||0).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;color:#888;">Tax</td><td style="text-align:right;">$${Number(order.tax||0).toFixed(2)}</td></tr>
        <tr style="font-size:17px;font-weight:bold;border-top:2px solid #ddd;">
          <td style="padding:10px 0 0;">TOTAL</td>
          <td style="text-align:right;padding-top:10px;">$${Number(order.total||0).toFixed(2)}</td>
        </tr>
      </table>

    </div>
    <p style="text-align:center;color:#aaa;font-size:12px;margin-top:16px;">
      Tune Skis LLC &nbsp;·&nbsp; 272 Saratoga Rd, Schenectady NY 12302 &nbsp;·&nbsp; (888) 863-7547
    </p>
  </div>`;

  const text = `
NEW ORDER — TUNE SKIS LLC
${dateStr} at ${timeStr}
${order.orderId ? 'Order ID: ' + order.orderId : ''}

CUSTOMER
Name:  ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone || '—'}

SHIPPING ADDRESS
${customer.address?.line1 || ''}${customer.address?.line2 ? '\n' + customer.address.line2 : ''}
${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.zip || ''}

ORDER ITEMS
${(order.items||[]).map(i => `  ${i.name} | Size: ${i.size||'—'} | Qty: ${i.qty} | $${Number(i.price).toFixed(2)}`).join('\n')}

Subtotal: $${Number(order.subtotal||0).toFixed(2)}
Tax:      $${Number(order.tax||0).toFixed(2)}
TOTAL:    $${Number(order.total||0).toFixed(2)}
  `.trim();

  try {
    await transporter.sendMail({
      from:    `"Tune Skis Store" <${process.env.GMAIL_USER}>`,
      to:      'info@tuneskis.com',
      subject: `New Order — ${customer.name} — $${Number(order.total||0).toFixed(2)}`,
      html,
      text,
    });
    console.log(`[email] Sent — ${customer.name} $${order.total}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[email] Failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /checkout ────────────────────────────────────────────
// Add your existing Portico SOAP checkout logic here
app.post('/checkout', async (req, res) => {
  res.json({ success: false, error: 'Add your Portico checkout logic here' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tune Skis server running on port ${PORT}`));
