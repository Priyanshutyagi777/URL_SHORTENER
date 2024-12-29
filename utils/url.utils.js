const crypto = require('crypto');

exports.generateShortUrl = () => {
  return crypto.randomBytes(4).toString('hex');
};