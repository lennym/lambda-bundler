'use strict';
const lambda = require('./');
const pkg = require('./package.json')['lambda-bundler'] || {};

const middleware = pkg.middleware || [];

// normalise the middlewares into { inbound:<Function>, outbound:<Function> } objects
const stack = middleware.map((key) => {
  let layer = key;
  if (typeof key === 'string') {
    layer = require(key);
  }
  let inbound = (event, context, done) => done();
  let outbound = (err, response, done) => done(err);

  if (typeof layer === 'function') {
    inbound = layer;
  } else {
    inbound = typeof layer.inbound === 'function' ? layer.inbound : inbound;
    outbound = typeof layer.outbound === 'function' ? layer.outbound : outbound;
  }
  if (inbound.length !== 3 || outbound.length !== 3) {
    inbound = (e, c, callback) => callback(new Error(`Invalid middleware: ${key} - function is not a recognisable middleware`));
  }
  return { inbound, outbound };
});

// returns a function wrapped inside the inbound and outbound callbacks of a middleware layer
function wrap (inner, layer) {
  return (event, context, callback) => {
    layer.inbound(event, context, (inerr) => {
      if (inerr) {
        callback(inerr);
      } else {
        inner(event, context, (err, result) => {
          layer.outbound(err, result, (outerr) => {
            if (outerr) {
              callback(outerr);
            } else {
              callback(null, result);
            }
          });
        });
      }
    });
  };
}

function nest (inner) {
  return stack.reduceRight(wrap, inner);
}

module.exports = {
  handler: nest(lambda)
};
