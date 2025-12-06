const crypto = require('crypto');

const demoHashing = (message) => {
  const hash = crypto.createHash('sha256');
  hash.update(message);
  const hashedPassword = hash.digest('hex');
  console.log(`Hashed (SHA-256): ${hashedPassword}`);
  return hashedPassword;
};

const password = 'This is a secret message';
const hashedPassword = demoHashing(password);
console.log(`Original password: ${password}`);
console.log(`Hashed password: ${hashedPassword}`);
