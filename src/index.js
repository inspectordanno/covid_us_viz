import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider
} from 'react-redux';
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import 'normalize.css/normalize.css';
import './styles/styles.scss';

import configureStore from './store/configureStore';
import CovidApp from './components/CovidApp/CovidApp';

const store = configureStore();

//redux
const jsx = ( 
  <Provider store={store}>
    <Router>
      <Route>
        <CovidApp path={`/:state/:countyFips`}/>
      </Route>
    </Router>
  </Provider>
);

// const jsx = (
//   <h1>
//     js mounted
//   </h1>
// );

ReactDOM.render(jsx, document.getElementById('app'));