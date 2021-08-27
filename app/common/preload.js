/**
 * 将electron的一些函数内置给window对象
 */
const { ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
  window.ipcRenderer = ipcRenderer;
  window.a = a;
})