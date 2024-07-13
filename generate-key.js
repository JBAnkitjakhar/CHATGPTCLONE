const crypto = require("crypto");

const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString("base64");
};

console.log(generateEncryptionKey());
