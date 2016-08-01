const path = require('path');

function defaults (options) {
  options = options || {};
  options.root = options.root || process.cwd();
  const pkg = require(path.resolve(options.root, './package.json'));
  options.files = options.files || pkg.files_to_deploy || ['./*.js', './package.json'];
  options.name = options.name || pkg.name;
  options.description = options.description || pkg.description;
  options.region = options.region || process.env.AWS_REGION || 'eu-west-1';
  options.role = options.role || process.env.AWS_IAM_ROLE;
  return options;
}

module.exports = defaults;
