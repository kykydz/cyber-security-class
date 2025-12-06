const express = require('express');
const app = express();
const port = 80;
const crypto = require('crypto');

app.use(express.json());

app.use(express.static('public'));

const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

const RATE_LIMIT = 1; // max requests
// const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_MS = 5 * 1000; // 15 seconds

const ipRequests = new Map(); // store per-IP request data
function rateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip;

  const requestLog = ipRequests.get(ip) || [];
  // Remove old timestamps outside of window
  const recentRequests = requestLog.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentRequests.length >= RATE_LIMIT) {
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
    return;
  }

  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);
  next();
}

// app.get('/:params', (req, res) => {
//   const paramsValue = [];
//   for (const number of params) {
//     console.log(`${key}: ${value}`);
//     paramsValue.push(number);
//   }
//   console.log(`${new Date().toISOString()}: Request from ${req.ip}`),
//     res.send(`Congratualations! Your Express server is running. ${port}`);
// });

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

app.get('/dummy-get/:guestName', logger, validateGuestName, (req, res) => {
  const { guestName } = req.params;
  const { dresscode } = req.query;

  setTimeout(() => {
    const endTime = new Date();
    const duration = endTime - req.startTime;
    res.json({
      message: `This is a dummy GET API ${guestName}, processed in ${duration}ms`,
      dresscode,
    });
  }, 10000);
});

app.post('/dummy-post', checkAuth, (req, res) => {
  const { body } = req;
  console.log('Received body:', body);
  res.json({
    message: `This is a dummy POST API, you sent: ${JSON.stringify(body)}`,
  });
});

// API to encrypt message
app.post('/encrypt', (req, res) => {
  const { message } = req.body;
  const encryptedMessage = encrypt(message);

  // Encrypt with public key
  const encryptedData = crypto.publicEncrypt(
    publicKey,
    Buffer.from(message, 'utf-8')
  );
  console.log('\nEncrypted (base64):', encryptedData.toString('base64'));

  res.json({ encryptedMessage });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
