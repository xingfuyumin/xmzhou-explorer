let config = {};
try {
  config = require('../../config.json');
} catch(err) {console.log(err)}

module.exports = config;