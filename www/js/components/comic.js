const React = require('react');

var styles = require('../styles');

const Comic = (props) =>
  <img style={ styles.comic } src={ props.url } />

module.exports = Comic;
