const express  = require('express');
const cors     = require('cors');
const https    = require('https');
const path     = require('path');
const app      = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const HL_TOKEN  = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE   = 'https://tuneskis.retail.heartland.us/api';
const HP_SECRET = 'skapi_cert_MQHEBgBab3MAXnAvBsEAjGG1kodvydyhsewNMnU69Q';
const HP_HOST   = 'cert.api2.heartlandportico.com';

function hlGet(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(HL_BASE + endpoint);
    https.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({ raw: data }); } });
    }).on('error', reject);
  });
}

async function fetchAll(endpoint, perPage = 250) {
  let all = [];
  let page = 1;
  while (true) {
    const sep = endpoint.includes('?') ? '&' : '?';
    const data = await hlGet(`${endpoint}${sep}per_page=${perPage}&page=${page}`);
    const results = data.results || [];
    if (!results.length) break;
    all = all.concat(results);
    if (page >= (data.pages || 1) || results.length < perPage) break;
    page++;
  }
  return all;
}

// ── Debug: probe qty endpoints for item 101483 ────────────────────
app.get('/debug-inventory', async (req, res) => {
  const endpoints = [
    '/items/101483/quantities',
    '/items/101483/inventory_levels',
    '/inventory/levels?item_id=101483',
    '/inventory/items?item_id=101483',
    '/items?per_page=1&page=1&include[]=quantity',
    '/items/101483?include[]=quantity',
    '/items?ids[]=101483',
  ];
  const results = {};
  for (const ep of endpoints) {
    try {
      const d = await hlGet(ep);
      results[ep] = JSON.stringify(d).substring(0, 200);
    } catch(e) {
      results[ep] = 'ERROR: ' + e.message;
    }
  }
  // Also get the raw item to see all fields
  const item = await hlGet('/items/101483').catch(e => ({ error: e.message }));
  res.json({ item, endpoints: results });
});

// ── Inventory endpoint ────────────────────────────────────────────
app.get('/inventory', async (req, res) => {
  try {
    const items = await fetchAll('/items');
    if (!items.length) {
      return res.json({ success: false, error: 'No items returned' });
    }

    // Map items — size in custom.size, qty will be 0 until we find the right endpoint
    const mapped = items.map(item => ({
      id:    item.id,
      name:  item.description || '',
      size:  (item.custom && item.custom.size) ? String(item.custom.size) : '',
      qty:   item.quantity || item.qty || item['quantity_on_hand'] || item['qty_on_hand'] || 0,
      price: item.price || 0,
      sku:   item.public_id || ''
    }));

    // Log a sample to see what qty fields are available
    if (mapped.length > 0) {
      const sample = items.find(i => i.id === 101483) || items[0];
      console.log('Sample item keys:', Object.keys(sample));
      console.log('Sample qty fields:', {
        quantity: sample.quantity,
        qty: sample.qty,
        quantity_on_hand: sample['quantity_on_hand'],
        qty_on_hand: sample['qty_on_hand'],
        stock: sample.stock
      });
    }

    res.json({ success: true, items: mapped, total: mapped.length });
  } catch (e) {
    console.error('Inventory error:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Heartland Portico charge ──────────────────────────────────────
function heartlandCharge(token, amount, billingZip, desc) {
  const soap = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <PosRequest xmlns="http://Hps.Exchange.PosGateway">
      <Ver1.0>
        <Header><SecretAPIKey>${HP_SECRET}</SecretAPIKey></Header>
        <Transaction>
          <CreditSale>
            <Block1>
              <AllowDup>Y</AllowDup>
              <Amt>${parseFloat(amount).toFixed(2)}</Amt>
              <CardData><TokenData><TokenValue>${token}</TokenValue></TokenData></CardData>
              <CardHolderData><CardHolderZip>${billingZip || '00000'}</CardHolderZip></CardHolderData>
              <AdditionalTxnFields><Description>${String(desc).substring(0,17)}</Description></AdditionalTxnFields>
            </Block1>
          </CreditSale>
        </Transaction>
      </Ver1.0>
    </PosRequest>
  </soap:Body>
</soap:Envelope>`;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: HP_HOST, port: 443,
      path: '/Hps.Exchange.PosGateway/PosGatewayService.asmx',
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': Buffer.byteLength(soap),
        'SOAPAction': 'http://Hps.Exchange.PosGateway/PosGatewayService/PosRequest'
      }
    }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
    });
    req.on('error', reject); req.write(soap); req.end();
  });
}

function parseHP(xml) {
  return {
    gatewayCode: xml.match(/<GatewayRspCode>([^<]+)<\/GatewayRspCode>/)?.[1],
    rspCode:     xml.match(/<RspCode>([^<]+)<\/RspCode>/)?.[1],
    rspText:     xml.match(/<RspText>([^<]+)<\/RspText>/)?.[1],
    txnId:       xml.match(/<GatewayTxnId>([^<]+)<\/GatewayTxnId>/)?.[1],
    authCode:    xml.match(/<AuthCode>([^<]+)<\/AuthCode>/)?.[1],
  };
}

app.post('/checkout', async (req, res) => {
  const { token, billingZip, name, email, phone, address, city, state, zip, items, total, shipping, shippingLabel } = req.body;
  if (!token || !total || !items?.length) return res.status(400).json({ success: false, error: 'Missing required fields' });
  try {
    const desc = items[0]?.name?.substring(0,17) || 'Tune Skis Order';
    const xmlResp = await heartlandCharge(token, total, billingZip || zip, desc);
    const charge  = parseHP(xmlResp);
    console.log('Charge result:', JSON.stringify(charge));
    if (charge.gatewayCode !== '0') return res.json({ success: false, error: charge.rspText || 'Payment declined' });
    const itemLines = items.map(i => `• ${i.name}${i.size?' ('+i.size+')':''} x${i.qty||1} — $${i.total||i.price}`).join('\n');
    console.log(`\n=== NEW ORDER ===\nCustomer: ${name} | ${email} | ${phone}\nShip to: ${address}, ${city}, ${state} ${zip}\nItems:\n${itemLines}\nShipping: ${shippingLabel||'N/A'} ($${shipping||0})\nTotal: $${total}\nTransaction: ${charge.txnId} | Auth: ${charge.authCode}\n=================`);
    res.json({ success: true, txnId: charge.txnId, authCode: charge.authCode, message: "Payment successful! We'll be in touch shortly with shipping details." });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, error: 'Server error. Please try again or call us.' });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', service: 'tuneskis-server' }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
