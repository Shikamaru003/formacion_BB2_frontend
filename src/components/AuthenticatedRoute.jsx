import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService.js'

class AuthenticatedRoute extends Component {
    render() {

        if (AuthenticationService.getCurrentUser()) {
            return <Route {...this.props} />
        }
        else {
            return <Redirect to="/login" />
        }
    }
}

export default AuthenticatedRoute