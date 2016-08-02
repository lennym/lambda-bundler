const path = require('path');

function defaults (options) {
  options = options || {};
  options.root = options.root || process.cwd();
  const pkg = require(path.resolve(options.root, './package.json'))
  const bundler = pkg['lambda-bundler'] || {};
  if (!options.files && (!bundler.files || !bundler.files.length)) {
    throw new Error('files option must be defined');
  }
  options.files = options.files || bundler.files || ['**/*.js'];
  options.files.push('package.json');
  options.ignore = options.ignore || bundler.ignore || [];
  options.name = options.name || pkg.name;
  options.description = options.description || pkg.description;
  options.region = options.region || process.env.AWS_REGION;
  options.role = options.role || process.env.AWS_IAM_ROLE;
  options.ignoreFile = options.ignoreFile || bundler.ignoreFile || '.lambdaignore';
  return options;
}

module.exports = defaults;
