import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import ProductListView from './components/products/ProductListView';
import ProductDetailComponent from './components/products/ProductDetailComponent';
import HeaderComponent from './components/header/HeaderComponent';
import LoginView from './components/login/LoginView';
import UserListComponent from './components/UserListComponent';
import UserDetailComponent from './components/UserDetailComponet';
import AuthenticatedRoute from './components/AuthenticatedRoute';

import {isLoggedIn} from './services/authenticationService';

import './App.css';
import './primereact.css';

export default function App() {

  const [theme] = useState('saga-blue');

  useEffect(() => {
    require(`primereact/resources/themes/${theme}/theme.css`);
  }, [theme])

  return (
    <div className="main">
      <Router>
        <HeaderComponent></HeaderComponent>
        <Switch>
          <Route exact path="/login" component={LoginView} />
          <AuthenticatedRoute exact path="/products" component={ProductListView} />
          <AuthenticatedRoute exact path="/products/:id" component={ProductDetailComponent} />
          <AuthenticatedRoute exact path="/users" component={UserListComponent} />
          <AuthenticatedRoute exact path="/users/:id" component={UserDetailComponent} />
          <Redirect to={isLoggedIn() ? "/products" : "/login"} />
        </Switch>
      </Router>
    </div>
  );

}
