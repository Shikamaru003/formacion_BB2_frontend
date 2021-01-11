import axios from 'axios'
import * as Constants  from '../constants/AppConstants'

export function loginService(username, password, successCallback, messagesCallBack) {
    axios.get(Constants.API_URL + "/auth/login", {
        auth: {
            username: username,
            password: password
        }
    })
        .then(
            response => {
                if (response.headers.authorization) {
                    successCallback(response);
                }
            })
        .catch(
            error => {
                messagesCallBack({
                    severity: 'error',
                    summary: '',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            });
}

export function logout() {
    sessionStorage.removeItem('user');
}

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}

export function isLoggedIn() {
    return sessionStorage.getItem('user') !== null;
}

export function isAdmin() {
    return getCurrentUser().roles.includes("ROLE_ADMIN");
}
