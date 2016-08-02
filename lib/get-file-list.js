const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const ignore = require('ignore');
const fs = require('fs');
const path = require('path');

function flatten (arr) {
  return [].concat.apply([], arr);
}

function list (options) {
  if (options.ignoreFile === 'git') {
    options.ignoreFile = '.gitignore';
  } else if (options.ignoreFile === 'npm') {
    options.ignoreFile = '.npmignore';
  }

  return Promise.resolve()
    .then(() => {
      return Promise.map(options.files, (file) => glob(file));
    })
    .then((files) => {
      return flatten(files);
    })
    .then((files) => {
      return Promise.promisify(fs.readFile)(path.resolve(process.cwd(), options.ignoreFile)).catch(e => '')
        .then((content) => {
          const filter = ignore().add(content.toString());
          return filter.filter(files);
        });
    })
    .then((files) => {
      options.files = files;
    });
}

module.exports = list;
