const crypto = require('crypto');

const demoHashing = (message) => {
  const salt = 'test-salt';

  const hash = crypto.createHmac('sha256', salt);
  hash.update(message + salt);
  const hashedMessage = hash.digest('hex');
  console.log(`Hashed (SHA-256 with salt "${salt}")`);
  return hashedMessage;
};

const message = 'This is a secret message';
const hashedMessage = demoHashing(message);
console.log(`Original message: ${message}`);
console.log(`Hashed message: ${hashedMessage}`);

// function to check if message is valid
const verifyMessage = (message, hashedMessage) => {
  const salt = 'test-salt';
  const hash = crypto.createHmac('sha256', salt);
  hash.update(message);
  const calculatedHash = hash.digest('hex');
  console.log(`Calculated hash: ${calculatedHash}`);
  return hashedMessage === calculatedHash;
};

console.log(
  '\nImagine user try to login with password: "This is a secret message"'
);
const isValid = verifyMessage(message, hashedMessage);
console.log(`Message is valid: ${isValid}`);
