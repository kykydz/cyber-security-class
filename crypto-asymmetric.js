const crypto = require('crypto');
const fs = require('fs');

function generateKeyPairSync() {
  // Generate RSA key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // key size
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  // Write key pair to file
  fs.writeFileSync('public.pem', publicKey);
  fs.writeFileSync('private.pem', privateKey);
}

function demoAsymmetricEncryption() {
  // console.log('Public Key:\n', publicKey);
  // console.log('Private Key:\n', privateKey);

  // Message to encrypt
  const message = '2f6e18ab46032f806a6d,Doi0FezfSQmzd91DD1eqsA';
  console.log('\nOriginal Message:', message);

  // Encrypt with public key
  const encryptedData = crypto.publicEncrypt(
    publicKey,
    Buffer.from(message, 'utf-8')
  );
  console.log('\nEncrypted (base64):', encryptedData.toString('base64'));

  // Decrypt with private key

  const decryptedData = crypto.privateDecrypt(
    privateKey,
    "Xf9nTvvV4UUA4u5ZyNm4OkEnNCuSGCd6D8Z+pSHETKsyFf0CunkeBh27irI1ZgOTskD32WsUQCgzDSx72jmiMD2aOZFFTKPixuIDFj6ML0oYln+wpW5LgIBIjbNb6ZPP0W5wdm48i3TTrdmo/MB7LC+21pMHztxpl0XSzqngpsKz88VIrCWoCDo/qwwaX5Sl07eY8i9bFsZ+Vg2m58UAf0EztYWeR0SKh3mvHEX0F7hj7saEnxRgconVLcbdi3ZBd0wuT5QgxzM8/QinrqCiqVeXFvn7SdpJPFSdNQ/4xiXCntNHWhXL6KZxparsQ9wSyTp6KEy01/CM5QtzYGlN/A=='OR 1=1'"
  );
  console.log('\nDecrypted Message:', decryptedData.toString('utf-8'));
}

// verify certificate demo

// Run the demo
// demoAsymmetricEncryption();
generateKeyPairSync();
