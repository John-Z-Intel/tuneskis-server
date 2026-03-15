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

app.listen(PORT, () => {
  console.log('Tune Skis server running on port ' + PORT);
});
