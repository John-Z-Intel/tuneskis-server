const express = require('express');
const cors    = require('cors');
const https   = require('https');
const path    = require('path');
const app     = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const HL_TOKEN  = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE   = 'https://tuneskis.retail.heartland.us/api';
const HP_SECRET = 'skapi_cert_MQHEBgBab3MAXnAvBsEAjGG1kodvydyhsewNMnU69Q';
const HP_HOST   = 'cert.api2.heartlandportico.com';

// ── Heartland Retail GET ──────────────────────────────────────────
function hlGet(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(HL_BASE + endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ raw: data }); }
      });
    }).on('error', reject);
  });
}

// ── Heartland Retail POST ─────────────────────────────────────────
function hlPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'tuneskis.retail.heartland.us',
      path: '/api' + endpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HL_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch(e) { resolve({ raw: d }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Inventory endpoint ────────────────────────────────────────────
app.get('/inventory', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 200;
    const offset = (page - 1) * limit;

    // Correct endpoint is /items (plural)
    const data = await hlGet(`/items?per_page=${limit}&page=${page}`);

    if (!data || (!data.results && !data.items)) {
      return res.json({ success: false, error: 'No data', raw: data });
    }

    const results = data.results || data.items || [];

    const items = results.map(item => ({
      id:    item.id,
      name:  item.description || item.name || '',
      size:  item.custom_size || item['custom@size'] || item.size || '',
      qty:   item.quantity !== undefined ? item.quantity :
             (item.qty !== undefined ? item.qty : 0),
      price: item.price_1 || item.price || 0,
      sku:   item.public_id || item.sku || ''
    }));

    res.json({ success: true, items, total: data.total || items.length });
  } catch (e) {
    console.error('Inventory error:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Debug endpoint to see raw Heartland data ──────────────────────
app.get('/debug-inventory', async (req, res) => {
  try {
    const data = await hlGet('/items?per_page=10&page=1');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
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
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(soap);
    req.end();
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

// ── Checkout endpoint ─────────────────────────────────────────────
app.post('/checkout', async (req, res) => {
  const { token, billingZip, name, email, phone,
          address, city, state, zip,
          items, total, shipping, shippingLabel } = req.body;

  if (!token || !total || !items?.length) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const desc    = items[0]?.name?.substring(0,17) || 'Tune Skis Order';
    const xmlResp = await heartlandCharge(token, total, billingZip || zip, desc);
    const charge  = parseHP(xmlResp);

    console.log('Charge result:', JSON.stringify(charge));

    if (charge.gatewayCode !== '0') {
      return res.json({ success: false, error: charge.rspText || 'Payment declined' });
    }

    // Log full order
    const itemLines = items.map(i =>
      `• ${i.name}${i.size ? ' ('+i.size+')' : ''} x${i.qty||1} — $${i.total||i.price}`
    ).join('\n');

    console.log(`
=== NEW ORDER ===
Customer: ${name} | ${email} | ${phone}
Ship to: ${address}, ${city}, ${state} ${zip}
Items:\n${itemLines}
Shipping: ${shippingLabel || 'N/A'} ($${shipping || 0})
Total: $${total}
Transaction: ${charge.txnId} | Auth: ${charge.authCode}
=================`);

    res.json({
      success:  true,
      txnId:    charge.txnId,
      authCode: charge.authCode,
      message:  "Payment successful! We'll be in touch shortly with shipping details."
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, error: 'Server error. Please try again or call us.' });
  }
});

// ── Health ────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'tuneskis-server' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
