const path = require('path');
const fs = require('fs');

function copy (options) {
  return new Promise((resolve, reject) => {
    const filename = `index-${Date.now()}.js`;
    options.index = filename.replace(/\.js$/, '');
    const read = fs.createReadStream(path.resolve(__dirname, '../../src/index.js'));
    const write = fs.createWriteStream(path.resolve(options.tmpdir, filename));
    read.on('end', resolve);
    read.on('error', reject);
    read.pipe(write);
  });
}

module.exports = copy;
