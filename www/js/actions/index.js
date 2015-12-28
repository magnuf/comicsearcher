const api = require('../api');

const debouncedSearch = debounce(150, function (query, dispatch) {
  api.search(query)
    .then(results => dispatch({ type: "SEARCH_SUCCESS", results }))
    .catch(error => dispatch({ type: "SEARCH_ERROR", error }));
});

exports.search = function (query) {
  return function (dispatch) {
    if (!query) {
      dispatch({ type: "SET_QUERY", query: '' });
      return;
    }
    dispatch({ type: "SEARCH_STARTED", query });
    debouncedSearch(query, dispatch);
  };
};

exports.cancel = function () {
  return { type: "SELECT_CANCEL" };
};

exports.prev = function () {
  return { type: "SELECT_PREV" };
};

exports.next = function () {
  return { type: "SELECT_NEXT" };
};

function debounce (ms, fn) {
  let timeout;
  const self = this;
  return function (...rest) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(function () {
      fn.apply(self, rest);
    }, ms);
  };
}
