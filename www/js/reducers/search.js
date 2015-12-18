const { fromJS } = require('immutable');

module.exports = search;

const initialState = fromJS({
  error: null,
  loading: false,
  query: '',
  results: []
});

function search (state = initialState, action) {
  switch (action.type) {

  case "SET_QUERY":
    return state.merge({
      query: action.query
    });

  case "SEARCH_STARTED":
    return state.merge({
      error: null,
      loading: true,
      query: action.query
    });

  case "SEARCH_SUCCESS":
    return state.merge({
      error: null,
      loading: false,
      results: action.results
    });

  case "SEARCH_FAILED":
    return state.merge({
      loading: false,
      error: action.error && action.error.message || "Search failed..",
      results: []
    });

  default:
    return state;
  }

}
