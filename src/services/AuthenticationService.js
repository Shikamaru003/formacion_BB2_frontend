import axios from 'axios'
import * as Constants from '../constants/Constants'

export function loginService(username, password, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + "/auth/login", {
        auth: {
            username: username,
            password: password
        }
    })
        .then(
            (response) => {
                sessionStorage.setItem('user', JSON.stringify({ username: username, password: password, roles: response.data, accessToken: response.headers.authorization }));
                successCallback(response);
            })
        .catch(
            (error) => {
                errorCallBack({
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
