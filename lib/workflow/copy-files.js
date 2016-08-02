const Promise = require('bluebird');
const cp = Promise.promisify(require('copy'));

function copy (options) {
  return cp(options.files, options.tmpdir);
}

module.exports = copy;
