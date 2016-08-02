const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const ignore = require('ignore');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('lambda-bundler');

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
      debug('Unfiltered file list', options.files);
      const ignoreFile = path.resolve(process.cwd(), options.ignoreFile);
      return Promise.promisify(fs.readFile)(ignoreFile)
        .catch(e => {
          debug(`Failed to load ignore file from ${ignoreFile}`);
          return '';
        })
        .then((content) => {
          return ignore()
            .add(content.toString())
            .add('node_modules')
            .add(options.ignore)
            .filter(files);
        });
    })
    .then((files) => {
      debug('Filtered file list', files);
      options.files = files;
    });
}

module.exports = list;
