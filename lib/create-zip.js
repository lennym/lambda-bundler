const Promise = require('bluebird');
const cp = require('child_process');
const path = require('path');

function zip (options) {
  const out = path.resolve(options.tmpdir, `${options.index}.zip`);
  return Promise.promisify(cp.exec)(`zip -qr -X ${out} .`, { cwd: options.tmpdir });
}

module.exports = zip;
