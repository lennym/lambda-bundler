const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const rm = require('rimraf');

function makeDistDirectory (dir) {
  return Promise.promisify(fs.mkdir)(dir).then(() => dir);
}

function teardown (dir) {
  return Promise.promisify(rm)(dir);
}

module.exports = function () {
  const dir = path.resolve(__dirname, `../.tmp-${Date.now()}`);
  return makeDistDirectory(dir).disposer(() => teardown(dir));
};
