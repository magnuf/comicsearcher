const ajax = require('./ajax');

const BASE_URL = 'https://ht9cujhzb9.execute-api.eu-west-1.amazonaws.com/prod';

const url = {
  search: function (query) {
    return apiUrl('search/' + query);
  }
};

exports.search = function (q) {

  return new Promise(function (resolve, reject) {

    ajax.get(url.search(q), function (err, res) {
      if (err) {
        return reject(err);
      }

      return resolve(res.body);
    });
  });
};

function apiUrl (path) {
  return BASE_URL + '/' + path;
}
