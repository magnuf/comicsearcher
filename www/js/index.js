const ReactDom = require('react-dom');
const { combineReducers, createStore, applyMiddleware } = require('redux');
const { Provider } = require('react-redux');
const thunk = require('redux-thunk');

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(initReducers());

const App = require('./components/app');
ReactDom.render(
  <Provider store={ store }>
    <App />
  </Provider>, document.querySelector(".app-root"));

function initReducers () {
  const search = require('./reducers/search');
  return combineReducers({
    search
  });
}
