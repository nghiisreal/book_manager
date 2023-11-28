/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import AddItem from './pages/AddItem/AddItem';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import './App.css';
import UpdateItem from './pages/UpdateItem/UpdateItem';
import PrintItem from './components/PrintItem/PrintItem';
import jwt_decode from 'jwt-decode';
import UserManager from './pages/UserManager/UserManager';
import Register from './pages/Register/Register';
import VerifyBox from './pages/Register/VerifyBox';
import Footer from './components/Home/Footer/Footer';

const history = createBrowserHistory();

function App() {
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/verify-box" component={VerifyBox} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/home/:types" component={Home} />
          <Route exact path="/home/:types/:type" component={AddItem} />
          <Route exact path="/home/:types/:type/:id" component={UpdateItem} />
          <Route exact path="/home/:types/print/:type/:id" component={PrintItem} />
          <Route exact path="/user-manager" component={UserManager} />
          <Route exact path="*" component={PageNotFound} />
        </Switch>
      </Router>
      <Footer location={history.location} />
    </div>
  );
}

export default App;
