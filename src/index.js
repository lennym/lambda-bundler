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

// create a recursive function which iterates through our middleware stack
const inbound = stack.reduce((fn, layer) => {
  return (event, context, done) => {
    fn(event, context, (err) => {
      if (err) {
        done(err);
      } else {
        layer.inbound(event, context, done);
      }
    });
  };
}, (e, c, done) => done());

// and a second recursive function to iterate back through outbound middleware when complete
const outbound = stack.reduceRight((fn, layer) => {
  return (err, response, done) => {
    fn(err, response, (e) => {
      layer.outbound(e, response, done);
    });
  };
}, (err, response, done) => done(err));

module.exports = {
  handler: (event, context, callback) => {
    inbound(event, context, (err) => {
      if (err) {
        callback(err);
      } else {
        lambda(event, context, (err, response) => {
          outbound(err, response, (err) => {
            if (err) {
              callback(err);
            } else {
              callback(null, response);
            }
          });
        });
      }
    });
  }
};
