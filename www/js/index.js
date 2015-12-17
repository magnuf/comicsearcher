const ReactDom = require('react-dom');

const App = require('./components/app');

const el = document.querySelector(".app-root");
ReactDom.render(<App />, el);
