const fs = require('fs');

let config = {};
try {
  config = JSON.parse(fs.readFileSync('./config.json').toString());
} catch(err) {
  throw new Error(err);
}

/**
 * 获取配置信息
 * @returns 
 */
exports.getConfig = () => config;
