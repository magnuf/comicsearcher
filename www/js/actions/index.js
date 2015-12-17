const api = require('../api');

exports.search = function (query) {
  return function (dispatch) {
    dispatch({ type: "SEARCH_STARTED", query });
    api.search(query)
      .then(results => dispatch({ type: "SEARCH_SUCCESS", results }))
      .catch(error => dispatch({ type: "SEARCH_ERROR", error }));
  };
};
