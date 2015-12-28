const React = require('react');
const ReactDom = require('react-dom');

const styles = require('../styles');

const Comic = React.createClass({

  componentDidUpdate: function () {
    const { selected } = this.props;
    if (selected) {
      ReactDom.findDOMNode(this).focus();
    }
  },

  render: function () {
    const { url } = this.props;
    return <a href={ url } target="_blank">
      <img src={ url } style={ styles.comic } />
    </a>;
  }
});

module.exports = Comic;
