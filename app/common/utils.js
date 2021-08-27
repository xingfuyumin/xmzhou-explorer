const path = require("path");

exports.getProjectDir = () => {
  return __dirname.split('app/common')[0];
}