import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import AuthenticationService from '../services/AuthenticationService'
import ProductListComponent from './products/list/ProductListComponent';
import ProductDetailComponent from './products/detail/ProductDetailComponent';
import HeaderComponent from './header/HeaderComponent';
import LoginComponent from './login/LoginComponent';
import UserListComponent from './users/list/UserListComponent';
import UserDetailComponent from './users/detail/UserDetailComponet';
import AuthenticatedRoute from './route/AuthenticatedRoute';

import './MainComponent.css';

class MainComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme:'saga-blue'
        }
    }
    
    componentDidMount(){
        this.importTheme(this.state.theme)
    }

    importTheme(theme){
        require(`primereact/resources/themes/${theme}/theme.css`);
    }

    render() {
        return (
            <div className="main">
                <Router>
                    <HeaderComponent></HeaderComponent>
                    <Switch>
                        <Route exact path="/login" component={LoginComponent} />
                        <AuthenticatedRoute exact path="/products" component={ProductListComponent} />
                        <AuthenticatedRoute exact path="/products/:id" component={ProductDetailComponent} />
                        <AuthenticatedRoute exact path="/users" component={UserListComponent} />
                        <AuthenticatedRoute exact path="/users/:id" component={UserDetailComponent} />
                        <Redirect to={AuthenticationService.isLoggedIn() ? "/products" : "/login"} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default MainComponent