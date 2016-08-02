const Promise = require('bluebird');

const defaultOptions = require('./default-options');
const tmpdir = require('./tmpdir');
const loadenv = require('env2');
const path = require('path');

const steps = [
  'check-aws-credentials',
  'get-file-list',
  'copy-files',
  'create-index-file',
  'npm-install',
  'save-envvars',
  'create-zip',
  'upload'
];

function bundler (options) {
  if (options.env) {
    loadenv(path.resolve(process.cwd(), options.env));
  }
  const opts = defaultOptions(options);
  return Promise.using(tmpdir(), (path) => {
    opts.tmpdir = path;
    return chain(steps, opts);
  });
}

function chain (steps, options) {
  return steps.reduce((p, step) => {
    return p.then(() => {
      console.log(`Executing step: ${step}`);
      return require(`./workflow/${step}`)(options);
    });
  }, Promise.resolve());
}

module.exports = bundler;
