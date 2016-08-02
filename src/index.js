'use strict';
const lambda = require('./');
const pkg = require('./package.json')['lambda-bundler'] || {};

const middleware = pkg.middleware || [];
middleware.push(lambda);

const stack = middleware.reduce((fn, key) => {
  let layer = key;
  if (typeof key === 'string') {
    layer = require(key);
  }
  if (typeof layer !== 'function' || layer.length !== 3) {
    throw new Error(`Invalid middleware: ${key}`);
  }
  return (event, context, callback) => {
    fn(event, context, (err, data) => {
      if (err) {
        callback(err);
      } else {
        layer(event, context, callback);
      }
    });
  };
}, (e, c, callback) => { callback(); });

module.exports = {
  handler: stack
};
