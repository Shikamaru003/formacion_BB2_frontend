import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import ProductListView from './components/products/ProductListView';
import ProductDetailView from './components/products/ProductDetailView';
import Header from './components/header/HeaderComponent';
import LoginView from './components/login/LoginView';
import UserListView from './components/users/UserListView';
import UserDetailView from './components/users/UserDetailView';
import AuthenticatedRoute from './components/authentication/AuthenticatedRoute';

import { isLoggedIn } from './services/authenticationService';

import './App.css';
import './primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css'

export default function App() {

  return (
    <div className="main">
      <Router>
        <Header></Header>
        <Switch>
          <Route exact path="/login" component={LoginView} />
          <AuthenticatedRoute exact path="/products" component={ProductListView} />
          <AuthenticatedRoute exact path="/products/:id" component={ProductDetailView} />
          <AuthenticatedRoute exact path="/users" component={UserListView} />
          <AuthenticatedRoute exact path="/users/:id" component={UserDetailView} />
          <Redirect to={isLoggedIn() ? "/products" : "/login"} />
        </Switch>
      </Router>
    </div>
  );

}
