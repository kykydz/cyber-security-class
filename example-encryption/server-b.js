const express = require('express');
const app = express();
const port = 3002;
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

const decrypt = (req, res, next) => {
  try {
    const { guestName } = req.params;
    const encryptedParams = Buffer.from(guestName, 'base64');

    // Read private key from file
    const privateKeyPath = './private.pem';
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    const decryptedData = crypto.privateDecrypt(privateKey, encryptedParams);
    console.log('Decrypted message:', decryptedData);
    req.encryptedParams = encryptedParams;
    req.decrypted = decryptedData;
    next();
  } catch (error) {
    console.log(error);
  }
};

app.get('/hello', (req, res) => res.send('Hello World!'));

app.get('/dummy-get/:guestName', decrypt, logger, (req, res) => {
  const endTime = new Date();
  const duration = endTime - req.startTime;
  res.json({
    message: `This is a dummy GET API /dummy-get, processed in ${duration}ms`,
    data: {
      encrypted: req.encryptedParams.toString('base64'),
      decrypted: req.decrypted.toString('utf-8'),
    },
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
