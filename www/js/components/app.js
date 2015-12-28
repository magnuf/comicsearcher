const { connect } = require('react-redux');

const actions = require('../actions');

const Search = require('./search');
const ResultList = require('./result-list');
const Messages = require('./messages');

const styles = require('../styles');

const App = (props) => {

  const {
    query,
    results,
    selected,
    searching,
    error,
    ...actions
  } = props;

  const pickMessage = () => {

    if (error) {
      return error;
    }

    if (searching) {
      return "Searching..";
    }

    if (query && !results.length) {
      return "No hits, try another.";
    }

    return null;
  };

  const content = () => {

    const message = pickMessage();

    if (message) {
      return <Messages message={ message } />;
    }

    return <ResultList
      results={ results }
      selected={ selected }
      actions={ actions } />;
  };

  return <div style={ styles.app }>
    <Search query={ query }
            selected={ selected }
            actions={ actions }/>
    { content() }
  </div>;
};

const stateSelector = function (state) {
  return {
    error: state.search.get('error'),
    query: state.search.get('query'),
    results: state.search.get('results').toJS(),
    searching: state.search.get('searching'),
    selected: state.search.get('selected')
  };
};
module.exports = connect(stateSelector, actions)(App);
