const React = require('react');

const Search = React.createClass({

  render: function () {
    const { query } = this.props;
    return <input
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
