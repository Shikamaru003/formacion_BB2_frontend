import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { getCurrentUser } from '../services/authenticationService';

export default function AuthenticatedRoute(props) {

    if (getCurrentUser()) {
        return <Route {...props} />
    }
    else {
        return <Redirect to="/login" />
    }
}
