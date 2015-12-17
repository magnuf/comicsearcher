const request = require('superagent');

exports.get = function (url, fn) {
  const get = request.get(url);
  return get.end(fn);
};
