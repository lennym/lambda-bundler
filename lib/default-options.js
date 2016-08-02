const path = require('path');

function defaults (options) {
  options = options || {};
  options.root = options.root || process.cwd();
  const pkg = require(path.resolve(options.root, './package.json'))['lambda-bundler'] || {};
  if (!options.files && (!pkg.files || !pkg.files.length)) {
    throw new Error('files option must be defined');
  }
  options.files = options.files || pkg.files || ['**/*.js'];
  options.files.push('package.json');
  options.ignore = options.ignore || pkg.ignore || [];
  options.name = options.name || pkg.name;
  options.description = options.description || pkg.description;
  options.region = options.region || process.env.AWS_REGION || 'eu-west-1';
  options.role = options.role || process.env.AWS_IAM_ROLE;
  options.ignoreFile = options.ignoreFile || pkg.ignoreFile || '.lambdaignore';
  return options;
}

module.exports = defaults;
