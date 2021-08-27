/**
 * 将electron的一些函数内置给window对象
 */
const logger = require('./logger');
const a = require('./logger');
window.addEventListener('DOMContentLoaded', () => {
  window.logger = logger;
})