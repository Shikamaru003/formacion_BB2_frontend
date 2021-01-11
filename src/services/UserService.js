import axios from 'axios'
import authHeader from './auth-header';
import * as Constants from '../constants/AppConstants'

export function getAllUsersService() {
    axios.get(Constants.API_URL + '/users/all', {
        headers: authHeader()
    });
}

export function getUsersService(page, size, sortField, sortOrder, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + '/users', {
        params: {
            page: page,
            size: size,
            sortField: sortField,
            sortOrder: sortOrder
        },
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response)
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error loading users!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function getUserService(id, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + `/users/${id}`, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response)
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: `Error loading user with id ${id}`,
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function saveUserService(user, successCallback, errorCallBack) {
    axios.post(Constants.API_URL + '/users', user, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response, {
                    severity: 'success',
                    summary: 'User saved!',
                    detail: ''
                })
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error saving user',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function deleteUserService(id, successCallback, errorCallBack) {
    axios.delete(Constants.API_URL + `/users/${id}`, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response, {
                    severity: 'success',
                    summary: `User with id ${id} deleted!`,
                    detail: ''
                })
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error deleting user',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}
