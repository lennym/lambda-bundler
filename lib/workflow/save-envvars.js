const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');

function saveEnvvars (options) {
  if (options.envfile) {
    const arr = Object.keys(process.env).map((key) => `export ${key}=${process.env[key]}`);
    const file = typeof options.envfile === 'string' ? options.envfile : '.env';
    return Promise.promisify(fs.writeFile)(path.resolve(options.tmpdir, file), arr.join('\n'));
  }
}

module.exports = saveEnvvars;
