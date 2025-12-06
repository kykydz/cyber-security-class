const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // key size
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

function basicDataSignature(payload) {
  const stringDeterminedPlainData = JSON.stringify(payload);

  const signature = crypto
    .sign('SHA256', new Uint8Array(Buffer.from(stringDeterminedPlainData)), {
      key: privateKey,
      padding: 1,
    })
    .toString('hex');

  const encryptedBase64Data = Buffer.from(
    `${stringDeterminedPlainData}|${signature}`
  ).toString('base64');

  return encryptedBase64Data;
}

function basicVerifyDataSignature(signedPayload) {
  const rawPayloadSignedData = Buffer.from(signedPayload, 'base64').toString(
    'utf8'
  );
  const [determinedStringPlainDataFromPayload, signature] =
    rawPayloadSignedData.split('|');

  return crypto.verify(
    'SHA256',
    new Uint8Array(Buffer.from(determinedStringPlainDataFromPayload)),
    {
      key: publicKey,
      padding: 1,
    },
    new Uint8Array(Buffer.from(signature, 'hex'))
  );
}

function basicVerifyDataSignature2(signedPayload, payload) {
  const rawPayloadSignedData = Buffer.from(signedPayload, 'base64').toString(
    'utf8'
  );
  const [rawPayload, signature] = rawPayloadSignedData.split('|');
  // payload = payload + 'hacker_infiltrrate' + signature

  return crypto.verify(
    'SHA256',
    new Uint8Array(Buffer.from(payload)),
    {
      key: publicKey,
      padding: 1,
    },
    new Uint8Array(Buffer.from(signature, 'hex'))
  );
}

// demo usage
const payload = 'This is a secret message';
const signedPayload = basicDataSignature(payload);
console.log(`Signed payload: `, { payload, signedPayload });

const payload2 = 'This is a secret message';
const signedPayload2 = basicDataSignature(payload2);
console.log(`\n Signed payload2: `, { payload2, signedPayload2 });

const isValid = basicVerifyDataSignature(signedPayload);
console.log(`\nSignature is valid: ${isValid}`);

const isValid2 = basicVerifyDataSignature2(signedPayload2, 'data tidak sah');
console.log(`\nSignature is valid: ${isValid2}`);
