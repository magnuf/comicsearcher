const { connect } = require('react-redux');

const actions = require('../actions');

const Search = require('./search');
const ResultList = require('./result-list');

var styles = require('../styles');

const App = (props) =>
  <div style={ styles.app }>
    <Search query={ props.query } search={ props.search }/>
    <ResultList results={ props.results } loading={ props.loading }/>
  </div>;

const stateSelector = function (state) {
  return {
    query: state.search.get('query'),
    results: state.search.get('results').toJS(),
    loading: state.search.get('loading')
  };
};
module.exports = connect(stateSelector, actions)(App);
