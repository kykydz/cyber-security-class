const crypto = require('crypto');

// --- Configuration ---
// The algorithm for symmetric encryption (must support 256-bit key for 'aes-256-cbc')
const algorithm = 'aes-256-cbc';
// A secret key - must be 32 bytes (256 bits) for aes-256
// In a real application, you would generate and manage this key securely.
// For demonstration, we use a fixed 32-byte key:
const secretKey = crypto.randomBytes(32);

// Function to encrypt text
function encrypt(text) {
  // Initialization Vector (IV) - must be 16 bytes (128 bits) for AES.
  // IV must be unique for every encryption for security, but it does NOT need to be secret.
  const iv = crypto.randomBytes(16);

  // Create a Cipher object
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  console.log('buffer data: ', Buffer.from(encrypted));

  // Return the IV and the encrypted text, separated by a colon (IV is needed for decryption)
  return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt text
function decrypt(encryptedText) {
  // Split the text to retrieve the IV and the actual encrypted message
  const textParts = encryptedText.split(':');

  // The first part is the IV (in hex format)
  const iv = Buffer.from(textParts.shift(), 'hex');
  // The rest is the encrypted message (in hex format)
  const encryptedMessage = textParts.join(':');

  // Create a Decipher object
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  // Decrypt the message
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// --- Demo Usage ---
const originalText = 'This is a secret message.';
console.log('Key: ', secretKey.toString('hex'));

// 1. Encrypt the data
const encryptedData = encrypt(originalText);
console.log('Original Text:', originalText);
console.log('Encrypted Data (IV:Ciphertext):', encryptedData);

// 2. Decrypt the data
const decryptedText = decrypt(encryptedData);
console.log('Decrypted Text:', decryptedText);

// 3. Verification
if (originalText === decryptedText) {
  console.log('\nEncryption/Decryption successful!');
} else {
  console.log('\nEncryption/Decryption FAILED!');
}

// Note on Security: In a real-world scenario, the secretKey should be loaded
// from a secure source (like environment variables or a key management system)
// and should *not* be hardcoded or checked into source control.
