const express = require('express');
const app = express();
const port = 3001;
const crypto = require('crypto');
const fs = require('fs');

app.use(express.json());

const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.get('/', checkAuth, (req, res) =>
  res.send(`Congratualations! Your Express server is running. ${port}`)
);

const logger = (req, res, next) => {
  const startTime = new Date();
  req.startTime = startTime;
  const requestClean = {
    requestId: req.headers['x-request-id'] || 'N/A', // unique request ID
    userAgent: req.headers['user-agent'] || 'N/A', // who is making the request
    requestTime: new Date().toISOString(), // when the request was made
    requestMethod: req.method, // what method was used
    requestUrl: req.url, // which endpoint was hit
    requestHost: req.headers.host || 'N/A', // which host was targeted
    requestProtocol: req.protocol || 'N/A', // protocol used for the
    reqestHeaders: req.headers || {}, // all request headers
    requestQuery: req.query || {}, // query parameters
    requestParams: req.params || {}, // route parameters
    requestBody: req.body || {}, // body of the request
  };
  console.log(requestClean);
  next();
};

const validateGuestName = (req, res, next) => {
  const { guestName } = req.params;
  console.log('Validating guest name:', guestName);
  if (!/^[a-z]+$/i.test(guestName)) {
    console.log('Invalid guest name:', guestName);
    return res
      .status(400)
      .json({ message: 'Guest name should be alphabet small letter only' });
  }
  next();
};

// API to encrypt message
app.post('/encrypt', (req, res) => {
  const { message } = req.body;

  // Read public key from file
  const publicKeyPath = './public.pem';
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  // Encrypt with public keys
  const encryptedData = crypto.publicEncrypt(
    publicKey,
    Buffer.from(message, 'utf-8')
  );
  console.log('\nEncrypted (base64):', encryptedData.toString('base64'));

  res.json({ encryptedData: encryptedData.toString('utf-8') });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
