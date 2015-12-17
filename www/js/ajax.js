const request = require('superagent');

exports.post = function (url, fn) {
  const post = request.post(url);
  return post.end(fn);
};
