const Promise = require('bluebird');
const cp = require('child_process');

function install (options) {
  return Promise.promisify(cp.exec)('npm install --production', { cwd: options.tmpdir });
}

module.exports = install;
