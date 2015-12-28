const React = require('react');

const navigateOnKey = require('../navigate-on-key');
const Comic = require('./comic');

const styles = require('../styles');

const ResultList = React.createClass({

  render: function () {
    const { results, selected, actions } = this.props;

    const images = results.map((comic, i) =>
      <li key={ i }
          style={ styles.resultItem }>
        <Comic url={ comic.image }
               selected={ i == selected } />
      </li>);

    return <ul style={ styles.resultList }
               onKeyDown={ navigateOnKey(actions) }>
      { images }
    </ul>;
  }
});

module.exports = ResultList;
