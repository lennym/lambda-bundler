const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');

function saveEnvvars (options) {
  if (options.envfile) {
    const arr = Object.keys(process.env).map((key) => `export ${key}=${process.env[key]}`);
    return Promise.promisify(fs.writeFile)(path.resolve(options.tmpdir, '.env'), arr.join('\n'));
  }
}

module.exports = saveEnvvars;
