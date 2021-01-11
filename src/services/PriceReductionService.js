import axios from 'axios'
import authHeader from './auth-header';

import * as Constants from '../constants/AppConstants'

export function getAllPriceReductionsService(successCallback, errorCallBack) {
    axios.get(Constants.API_URL + 'price_reductions', {
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
                    summary: `Error loading price reductions`,
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function getAvailablePriceReductionsService(id, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + `products/${id}/available_price_reductions`, {
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
                    summary: `Error loading price reductions of product with id ${id}`,
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}
