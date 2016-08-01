const lambda = require('./');

module.exports = {
  handler: function (event, context, callback) {
    lambda(event, context, callback);
  }
};
