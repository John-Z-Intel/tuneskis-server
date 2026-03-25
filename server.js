const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3000;

const HL_TOKEN = process.env.HL_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE  = 'https://tuneskis.retail.heartland.us/api';

app.use(cors());
app.use(express.json());
app.use('/images', express.static(__dirname + '/images'));

app.get('/', (req, res) => {
  res.json({ status: 'Tune Skis server running', time: new Date().toISOString() });
});

app.get('/inventory', async (req, res) => {
  try {
    let allResults = [];
    let page = 1;
    const perPage = 500;

    while (true) {
      const invResp = await fetch(
        `${HL_BASE}/inventory/values?group[]=item_id&per_page=${perPage}&page=${page}`,
        { headers: { Authorization: `Bearer ${HL_TOKEN}` } }
      );
      const invData = await invResp.json();
      const results = invData.results || [];
      allResults = allResults.concat(results);
      if (results.length < perPage) break;
      page++;
      if (page > 10) break;
    }

    console.log(`Fetched ${allResults.length} inventory records across ${page} page(s)`);

    const inStock = allResults.filter(r => r.qty_on_hand > 0);
    const ids = inStock.map(r => r.item_id);
    const items = {};

    for (let i = 0; i < ids.length; i += 50) {
      const batch  = ids.slice(i, i + 50);
      const filter = encodeURIComponent(JSON.stringify({ id: { $in: batch } }));
      const iResp  = await fetch(
        `${HL_BASE}/items?per_page=50&_filter=${filter}`,
        { headers: { Authorization: `Bearer ${HL_TOKEN}` } }
      );
      const iData  = await iResp.json();
      (iData.results || []).forEach(item => { items[item.id] = item; });
    }

    const combined = inStock.map(r => {
      const item = items[r.item_id] || {};
      return {
        id:       r.item_id,
        name:     item.description || '',
        price:    item.price || 0,
        size:     (item.custom && item.custom.size) || '',
        category: (item.custom && item.custom.category) || '',
        qty:      r.qty_on_hand,
        active:   item['active?'] !== false,
      };
    });

    res.json({ success: true, count: combined.length, items: combined });
  } catch (err) {
    console.error('GET /inventory error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/order', async (req, res) => {
  const { customer, items, total } = req.body;
  if (!items || !items.length) return res.status(400).json({ success: false, error: 'No items' });

  console.log(`New order from ${customer?.email} — ${items.length} items — $${total}`);
  const errors = [], updated = [];

  for (const orderItem of items) {
    if (!orderItem.hlId) { console.log(`  ⚠ No hlId for ${orderItem.name}`); continue; }
    try {
      const adjReasonsResp = await fetch(`${HL_BASE}/inventory/adjustment_reasons?per_page=50`, { headers: { Authorization: `Bearer ${HL_TOKEN}` } });
      const adjReasons = await adjReasonsResp.json();
      const reasons = adjReasons.results || adjReasons || [];
      const reason = reasons.find(r => (r.name||'').toLowerCase().includes('sale') || (r.name||'').toLowerCase().includes('sold') || (r.name||'').toLowerCase().includes('web')) || reasons[0];
      if (!reason) { errors.push(`No adjustment reason for ${orderItem.name}`); continue; }

      const locResp = await fetch(`${HL_BASE}/locations?per_page=5`, { headers: { Authorization: `Bearer ${HL_TOKEN}` } });
      const locData = await locResp.json();
      const location = (locData.results || locData)[0];
      if (!location) { errors.push('No location found'); continue; }

      const adjSetResp = await fetch(`${HL_BASE}/inventory/adjustment_sets`, {
        method: 'POST', headers: { Authorization: `Bearer ${HL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment_reason_id: reason.id, location_id: location.id, status: 'pending', note: `Web order — ${customer?.firstName} ${customer?.lastName} — ${customer?.email}` }),
      });
      const adjSetId = (adjSetResp.headers.get('location') || '').split('/').pop();
      if (!adjSetId) { errors.push(`Failed to create adjustment set for ${orderItem.name}`); continue; }

      await fetch(`${HL_BASE}/inventory/adjustment_sets/${adjSetId}/lines`, {
        method: 'POST', headers: { Authorization: `Bearer ${HL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment_set_id: parseInt(adjSetId), item_id: orderItem.hlId, qty: -(orderItem.qty||1), unit_cost: orderItem.price||0 }),
      });
      await fetch(`${HL_BASE}/inventory/adjustment_sets/${adjSetId}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${HL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' }),
      });

      updated.push(`${orderItem.name} (${orderItem.size}) -${orderItem.qty}`);
      console.log(`  ✓ Decremented ${orderItem.name} ${orderItem.size}`);
    } catch (err) {
      errors.push(`${orderItem.name}: ${err.message}`);
    }
  }

  const orderId = 'TS-' + Date.now().toString(36).toUpperCase();
  res.json({ success: true, orderId, updated, errors: errors.length ? errors : undefined, message: `Order ${orderId} received. ${updated.length} items updated.` });
});

app.listen(PORT, () => console.log(`Tune Skis server running on port ${PORT}`));
