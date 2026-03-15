const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3000;

const HL_TOKEN = process.env.HL_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE  = 'https://tuneskis.retail.heartland.us/api';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Tune Skis server running', time: new Date().toISOString() });
});

app.get('/inventory', async (req, res) => {
  try {
    const invResp = await fetch(
      HL_BASE + '/inventory/values?group[]=item_id&per_page=500',
      { headers: { Authorization: 'Bearer ' + HL_TOKEN } }
    );
    const invData = await invResp.json();
    const results = invData.results || [];
    const inStock = results.filter(function(r) { return r.qty_on_hand > 0; });
    const ids = inStock.map(function(r) { return r.item_id; });
    const items = {};
    for (var i = 0; i < ids.length; i += 50) {
      var batch  = ids.slice(i, i + 50);
      var filter = encodeURIComponent(JSON.stringify({ id: { $in: batch } }));
      var iResp  = await fetch(
        HL_BASE + '/items?per_page=50&_filter=' + filter,
        { headers: { Authorization: 'Bearer ' + HL_TOKEN } }
      );
      var iData  = await iResp.json();
      (iData.results || []).forEach(function(item) { items[item.id] = item; });
    }
    const combined = inStock.map(function(r) {
      var item = items[r.item_id] || {};
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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/order', async (req, res) => {
  var body     = req.body;
  var customer = body.customer || {};
  var items    = body.items || [];
  var total    = body.total || 0;

  if (!items.length) {
    return res.status(400).json({ success: false, error: 'No items in order' });
  }

  var errors  = [];
  var updated = [];

  for (var i = 0; i < items.length; i++) {
    var orderItem = items[i];
    if (!orderItem.hlId) continue;
    try {
      var locResp = await fetch(
        HL_BASE + '/locations?per_page=5',
        { headers: { Authorization: 'Bearer ' + HL_TOKEN } }
      );
      var locData  = await locResp.json();
      var location = (locData.results || locData)[0];
      if (!location) { errors.push('No location found'); continue; }

      var adjReasonsResp = await fetch(
        HL_BASE + '/inventory/adjustment_reasons?per_page=50',
        { headers: { Authorization: 'Bearer ' + HL_TOKEN } }
      );
      var adjReasons = await adjReasonsResp.json();
      var reasons    = adjReasons.results || adjReasons || [];
      var reason     = reasons[0];
      if (!reason) { errors.push('No adjustment reason'); continue; }

      var adjSetResp = await fetch(HL_BASE + '/inventory/adjustment_sets', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + HL_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment_reason_id: reason.id, location_id: location.id, status: 'pending' }),
      });
      var adjSetLoc = adjSetResp.headers.get('location');
      var adjSetId  = adjSetLoc ? adjSetLoc.split('/').pop() : null;
      if (!adjSetId) { errors.push('Failed to create adjustment set'); continue; }

      await fetch(HL_BASE + '/inventory/adjustment_sets/' + adjSetId + '/lines', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + HL_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment_set_id: parseInt(adjSetId), item_id: orderItem.hlId, qty: -(orderItem.qty || 1), unit_cost: orderItem.price || 0 }),
      });

      await fetch(HL_BASE + '/inventory/adjustment_sets/' + adjSetId, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + HL_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' }),
      });

      updated.push(orderItem.name + ' -' + (orderItem.qty || 1));
    } catch (err) {
      errors.push(orderItem.name + ': ' + err.message);
    }
  }

  var orderId = 'TS-' + Date.now().toString(36).toUpperCase();
  res.json({ success: true, orderId: orderId, updated: updated, errors: errors.length ? errors : undefined });
});

app.listen(PORT, function() {
  console.log('Tune Skis server running on port ' + PORT);
});
