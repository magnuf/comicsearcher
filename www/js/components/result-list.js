const React = require('react');

const ResultList = React.createClass({

  render: function () {
    const { results, loading } = this.props;

    if (loading) {
      return <div>Loading..</div>;
    }

    return <div>
      {JSON.stringify(results)}
    </div>;
  }
});

module.exports = ResultList;
