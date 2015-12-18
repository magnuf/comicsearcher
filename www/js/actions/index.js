const api = require('../api');

const debouncedSearch = debounce(150, function (query, dispatch) {
  dispatch({ type: "SEARCH_STARTED", query });
  api.search(query)
    .then(results => dispatch({ type: "SEARCH_SUCCESS", results }))
    .catch(error => dispatch({ type: "SEARCH_ERROR", error }));
});

exports.search = function (query) {
  return function (dispatch) {
    dispatch({ type: "SET_QUERY", query });
    debouncedSearch(query, dispatch);
  };
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
