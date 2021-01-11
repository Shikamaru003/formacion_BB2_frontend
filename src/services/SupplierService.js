import axios from 'axios'
import authHeader from './auth-header';
import * as Constants from '../constants/Constants'

export function getAllSuppliersService(successCallback, errorCallBack) {
    axios.get(Constants.API_URL + '/suppliers/all', {
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
                    summary: 'Error loading products!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function getAvailableSuppliersService(id, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + `/products/${id}/available_suppliers`, {
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
                    summary: 'Error loading products!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}