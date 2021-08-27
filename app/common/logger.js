const {
  initLogger, loggerDebug, loggerInfo, loggerError,
} = require('../lib/xmzhou-log');
const config = require('./config');
const { getProjectDir } = require('./utils');

const loggers = config.loggers || {};
console.log(config, loggers);
const obj = {};
Object.keys(loggers).forEach((key) => {
  loggers[key].output = `${getProjectDir()}/${loggers[key]?.output || 'log/'}`
  initLogger(key, loggers[key]);
  obj[`${key}LoggerDebug`] = (text) => loggerDebug(key, text);
  obj[`${key}LoggerInfo`] = (text) => loggerInfo(key, text);
  obj[`${key}LoggerError`] = (text) => loggerError(key, text);
});

module.exports = obj;