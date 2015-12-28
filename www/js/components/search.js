const React = require('react');
const ReactDom = require('react-dom');
const navigateOnKey = require('../navigate-on-key');

const styles = require('../styles');

const Search = React.createClass({

  componentDidUpdate: function () {
    const { selected } = this.props;
    if (selected == null) {
      ReactDom.findDOMNode(this).focus();
    }
  },

  render: function () {
    const { query, actions } = this.props;

    return <input value={ query }
                  placeholder="Search.."
                  style={ styles.input }
                  onChange={ this.onSearchChange }
                  onKeyDown={ navigateOnKey(actions) }/>;
  },

  onSearchChange: function (e) {
    const { search } = this.props.actions;
    const query = e.target.value;
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
