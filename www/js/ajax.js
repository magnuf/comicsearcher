const request = require('superagent');

exports.get = function (url) {

  return new Promise(function (resolve, reject) {

    return request
      .get(url)
      .end(function (err, res) {
        if (err) {
          return reject(err);
        }

        const { body } = res;

        if (body && body.errorMessage) {
          return reject({ message: body.errorMessage });
        }

        return resolve(body);
      });
  });
};
