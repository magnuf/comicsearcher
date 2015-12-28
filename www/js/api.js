const ajax = require('./ajax');

const BASE_URL = 'https://ht9cujhzb9.execute-api.eu-west-1.amazonaws.com/prod';

const url = {
  search: function (query) {
    return apiUrl('search/' + query);
  }
};

exports.search = function (q) {
  return ajax.get(url.search(q));
};

function apiUrl (path) {
  return `${BASE_URL}/${path}`;
}
