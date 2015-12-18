const React = require('react');

var styles = require('../styles');

const Search = React.createClass({

  render: function () {
    const { query } = this.props;
    return <input
      style={ styles.input }
      value={ query }
      placeholder="Search.."
      onChange={ this.onSearchChange } />;
  },

  onSearchChange: function (e) {
    const { search } = this.props;
    var query = e.target.value;
    search(query);
  }
});

module.exports = Search;

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
