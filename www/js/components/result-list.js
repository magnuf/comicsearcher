const React = require('react');
const Comic = require('./comic');

const ResultList = React.createClass({

  render: function () {
    const { results, loading } = this.props;

    if (loading) {
      return <div>Loading..</div>;
    }


    var images = results.map((comic, i) =>
      <Comic key={ i } url={ comic.image } />);

    return <div>
      { images }
    </div>;
  }
});

module.exports = ResultList;
