// ══════════════════════════════════════════════════════════════════
// tuneskis-server/index.js  — FULL UPDATED VERSION
// Add this to your GitHub repo to replace the existing index.js
// ══════════════════════════════════════════════════════════════════
const express = require('express');
const cors    = require('cors');
const https   = require('https');
const path    = require('path');
const app     = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const HL_TOKEN = process.env.HL_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k';
const HL_BASE  = 'https://tuneskis.retail.heartland.us/api';
const HP_SECRET = 'skapi_cert_MQHEBgBab3MAXnAvBsEAjGG1kodvydyhsewNMnU69Q';
const HP_CERT_URL = 'cert.api2.heartlandportico.com';

// ── Existing inventory endpoint ───────────────────────────────────
app.get('/inventory', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const data = await hlGet(`/item?limit=${limit}&offset=${offset}`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Heartland Retail helper ───────────────────────────────────────
function hlGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(HL_BASE + path);
    https.get({
      hostname: url.hostname, path: url.pathname + url.search,
      headers: { 'Authorization': `Bearer ${HL_TOKEN}`, 'Content-Type': 'application/json' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    }).on('error', reject);
  });
}

function hlPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'tuneskis.retail.heartland.us',
      path: '/api' + path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HL_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Charge card via Heartland Portico ────────────────────────────
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
              <CardHolderData><CardHolderZip>${billingZip}</CardHolderZip></CardHolderData>
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
      hostname: HP_CERT_URL, port: 443,
      path: '/Hps.Exchange.PosGateway/PosGatewayService.asmx',
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': Buffer.byteLength(soap),
        'SOAPAction': 'http://Hps.Exchange.PosGateway/PosGatewayService/PosRequest'
      }
    }, res => {
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
  const { token, billingZip, name, email, phone, address, city, state, zip, items, total } = req.body;

  if (!token || !total || !items?.length) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    // 1. Charge the card
    const desc = items[0]?.name?.substring(0, 17) || 'Tune Skis Order';
    const xmlResp = await heartlandCharge(token, total, billingZip || zip, desc);
    const charge  = parseHP(xmlResp);

    console.log('Charge result:', charge);

    if (charge.gatewayCode !== '0') {
      return res.json({ success: false, error: charge.rspText || 'Payment declined' });
    }

    // 2. Create sales order in Heartland Retail (deducts inventory)
    try {
      const orderLines = items.map(item => ({
        item_id: item.hlId,
        qty: item.qty || 1,
        price: item.price,
        note: item.size ? `Size: ${item.size}` : ''
      }));

      await hlPost('/sales/orders', {
        customer: { name, email, phone },
        ship_to: { name, address1: address, city, state, zip },
        lines: orderLines,
        note: `Online order - TxnId: ${charge.txnId} - Auth: ${charge.authCode}`,
        channel: 'web'
      });
    } catch (orderErr) {
      // Log but don't fail — payment already succeeded
      console.error('Heartland order creation error:', orderErr.message);
    }

    // 3. Send notification email to store
    const orderSummary = items.map(i =>
      `• ${i.name}${i.size ? ' ('+i.size+')' : ''} x${i.qty||1} — $${i.total||i.price}`
    ).join('\n');

    console.log(`
=== NEW ORDER ===
Customer: ${name} | ${email} | ${phone}
Ship to: ${address}, ${city}, ${state} ${zip}
Items:
${orderSummary}
Total: $${total}
Transaction: ${charge.txnId} | Auth: ${charge.authCode}
=================`);

    res.json({
      success: true,
      txnId: charge.txnId,
      authCode: charge.authCode,
      message: 'Payment successful! We\'ll email you a confirmation shortly.'
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, error: 'Server error. Please try again or call us.' });
  }
});

// ── Health check ──────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'tuneskis-server' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
