const { fromJS } = require('immutable');

module.exports = search;

const initialState = fromJS({
  error: null,
  searching: false,
  query: '',
  results: [],
  selected: null
});

function search (state = initialState, action) {
  switch (action.type) {

  case "SELECT_CANCEL":
    return state.merge({
      query: '',
      selected: null,
      results: []
    });

  case "SELECT_NEXT":
    return state.update('selected', n => {

      if (!state.get('results').count()) {
        return null;
      }

      if (n == null) {
        return 0;
      }

      if (n >= state.get('results').count() - 1) {
        return null;
      }

      return n + 1;
    });

  case "SELECT_PREV":
    return state.update('selected', n => {

      if (!state.get('results').count()) {
        return null;
      }

      if (n == null) {
        return state.get('results').count() - 1;
      }

      if (n <= 0) {
        return null;
      }

      return n - 1;
    });
  case "SET_QUERY":
    return state.merge({
      query: action.query,
      error: null
    });

  case "SEARCH_STARTED":
    return state.merge({
      error: null,
      searching: true,
      query: action.query
    });

  case "SEARCH_SUCCESS":
    return state.merge({
      error: null,
      searching: false,
      results: action.results || []
    });

  case "SEARCH_ERROR":
    return state.merge({
      searching: false,
      error: action.error && action.error.message || "Search failed..",
      results: []
    });

  default:
    return state;
  }

}
