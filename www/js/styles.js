const font = {
  fontFamily: 'Helvetica Neue, Helvetica',
  fontWeight: 100
};

exports.app = {
  ...font,
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem'
};

exports.comic = {
  width: '100%'
};

exports.input = {
  ...font,
  fontSize: '3rem',
  marginBottom: '1rem',
  color: '#ccc',
  border: 'none',
  outline: 'none',
  textAlign: 'center'
};

exports.message = {
  textAlign: 'center'
};

exports.resultItem = {
  listStyle: 'none'
};

exports.resultList = {
  padding: 0,
  margin: '0 auto',
  maxWidth: '50rem'
};
