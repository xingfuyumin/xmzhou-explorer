const electronLog = require('electron-log');
const dayjs = require('dayjs');
const fs = require('fs');
/**
 * 日志记录器
 */
const loggerMap = new Map();
const fileNameNumRule = /.*?-[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]+)*.log/;

/**
 * 获取日志文件名
 */
const getFileName = (name, output, num) => `${output}${name}-${dayjs().format('YYYY-MM-DD')}${num === -1 ? '' : '-'}${num === -1 ? '' : num}.log`

/**
 * 计算字符串存储后的大小
 * @param {*} str 
 */
const getStringStorageLen = (str) => str.replace(/[\u0391-\uFFE5]/g, '111').replace(/[^\x00-\xff]/g, '11').length;

/**
 * 获取最新的文件后缀信息
 */
const getLastestFileNum = (name, output) => {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  let num = -1;
  const pathList = fs.readdirSync(output);
  pathList.forEach((path) => {
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const result = fileNameNumRule.exec(fileName);
    if (result) {
      let newNum = -1;
      if (result[1]) {
        newNum = Number(result[1].substring(1));
      }
      if (newNum > num) {
        num = newNum;
      }
    }
  });
  const path = getFileName(name, output, num);
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '');
  }
  const contentLength = getStringStorageLen(fs.readFileSync(path).toString());
  return { num, contentLength };
}

/**
 * 检查文件大小
 */
const checkFile = (name, len) => {
  const obj = loggerMap.get(name);
  if (!obj) {
    return;
  }
  const {
    maxSize, fileName, contentLength, output, num,
  } = obj;
  if ((contentLength + len) > maxSize) {
    obj.num += 1;
    obj.contentLength = 0;
    obj.fileName = getFileName(name, output, num);
    logger.transports.file.file = fileName;
  } else {
    obj.contentLength += len;
  }
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '');
  }
}

/**
 * 初始化日志配置
 */
exports.initLogger = (name, {
  file = true, console = true, debug = false,
  output = 'log/', maxSize = 10485740,
}) => {
  const logger = electronLog.create(name);
  const { num, contentLength } = getLastestFileNum(name, output);
  logger.transports.file.level = file;
  logger.transports.console.level = console;
  logger.transports.file.file = getFileName(name, output, num);
  logger.transports.file.maxSize = Number.MAX_SAFE_INTEGER;
  loggerMap.set(name, {
    logger, maxSize, debug,
    file, console, output,
    num, contentLength,
    fileName: logger.transports.file.file,
  });
};


/**
 * 信息日志
 */
exports.loggerInfo = (name, text) => {
  checkFile(name, getStringStorageLen(text));
  console.log(loggerMap, name, text);
  const obj = loggerMap.get(name);
  if (!obj) {
    return;
  }
  const {
    debug, logger,
  } = obj;
  if (debug) {
    logger.info(text);
  }
};

/**
 * 调试日志
 */
exports.loggerDebug = (name, text) => {
  checkFile(name, getStringStorageLen(text));
  const obj = loggerMap.get(name);
  if (!obj) {
    return;
  }
  const {
    debug, logger,
  } = obj;
  if (debug) {
    logger.debug(text);
  }
};

/**
 * 错误日志
 */
exports.loggerError = (name, text) => {
  checkFile(name, getStringStorageLen(text));
  const obj = loggerMap.get(name);
  if (!obj) {
    return;
  }
  const {
    logger,
  } = obj;
  logger.error(text);
};