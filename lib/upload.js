const Promise = require('bluebird');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

function upload (options) {
  AWS.config.region = options.region;
  const Lambda = new AWS.Lambda();
  const createParams = {
    FunctionName: options.name,
    Description: options.description,
    Handler: `${options.index}.handler`,
    Role: options.role,
    Runtime: 'nodejs4.3'
  };
  const updateParams = {
    FunctionName: options.name,
    Publish: true
  };
  return Promise.resolve()
    .then(() => {
      return Promise.promisify(fs.readFile)(path.resolve(options.tmpdir, `${options.index}.zip`));
    })
    .then((code) => {
      const params = Object.assign({}, createParams, { Code: { ZipFile: code } });
      return Promise.promisify(Lambda.createFunction, { context: Lambda })(params)
        .catch((err) => {
          // if error is not caused by lambda already existing then throw
          if (err.code !== 'ResourceConflictException') {
            throw err;
          }
          // else update the existing lambda
          const params = Object.assign({}, updateParams, { ZipFile: code });
          return Promise.promisify(Lambda.updateFunctionCode, { context: Lambda })(params)
            .then(() => {
              const params = Object.assign({}, createParams);
              return Promise.promisify(Lambda.updateFunctionConfiguration, { context: Lambda })(params);
            });
        });
    });
}

module.exports = upload;
