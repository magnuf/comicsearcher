const React = require('react');
const Comic = require('./comic');

const ResultList = React.createClass({

  render: function () {
    const { results, loading } = this.props;

    if (loading) {
      return <div>Loading..</div>;
    }

    var images = results.map(comic => <Comic url={comic.image} />);

    return <div>
      {images}
    </div>;
  }
});

module.exports = ResultList;
