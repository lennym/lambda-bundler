const Promise = require('bluebird');
const cp = require('copy');

function copy (options) {
  return Promise.promisify(cp)(options.files, options.tmpdir);
}

module.exports = copy;
