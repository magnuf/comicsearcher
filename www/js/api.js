const ajax = require('./ajax');

const BASE_URL = 'https://ht9cujhzb9.execute-api.eu-west-1.amazonaws.com/prod';

const url = {
  search: function (query) {
    return apiUrl('/search/' + query);
  }
};

exports.search = function (q) {

  return new Promise(function (resolve, reject) {

    ajax.post(url.search(q), function (err, res) {
      if (err) {
        return reject(err);
      }

      try {
        const obj = JSON.parse(res.body);
        return resolve(obj);
      }
      catch (e) {
        return reject(e);
      }
    });
  });
};

function apiUrl (path) {
  return BASE_URL + '/' + path;
}
