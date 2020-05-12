import { createStore, compose, applyMiddleware } from 'redux';
import reducer from '../reducers/reducer';

export default () => {
  const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION
  );
  return store;
}

