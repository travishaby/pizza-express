const crypto = require('crypto');

module.exports = function() {
  return crypto.randomBytes(10).toString('hex');
};
