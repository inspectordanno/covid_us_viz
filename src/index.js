import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider
} from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'normalize.css/normalize.css';
import './styles/styles.scss';

import configureStore from './store/configureStore';
import CovidApp from './components/CovidApp/CovidApp';

const store = configureStore();

//redux
const jsx = ( 
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <CovidApp />
        </Route>
        <Route path="/:state/:county">
          <CovidApp />
        </Route>
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));