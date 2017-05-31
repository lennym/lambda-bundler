const path = require('path');

function defaults (options) {
  options = options || {};
  options.root = options.root || process.cwd();

  const pkg = require(path.resolve(options.root, './package.json'));
  const bundler = pkg['lambda-bundler'] || {};

  const defaults = {
    files: ['**/*.js'],
    ignore: [],
    ignoreFile: '.lambdaignore',
    region: process.env.AWS_REGION,
    role: process.env.AWS_IAM_ROLE,
    name: pkg.name,
    description: pkg.description,
    runtime: 'nodejs'
  };

  options = Object.assign({}, defaults, bundler, options);

  if (!options.files.length) {
    throw new Error('files option must be defined');
  }
  if (typeof options.files === 'string') {
    options.files = [options.files];
  }
  options.files.push('package.json');
  return options;
}

module.exports = defaults;
