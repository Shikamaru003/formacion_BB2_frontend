import axios from 'axios'
import authHeader from './auth-header';
import * as Constants from '../constants/AppConstants'

export function getAllProductsService(successCallback) {
    axios.get(Constants.API_URL + '/products/all', {
        headers: authHeader()
    })
        .then(
            response => {
                successCallback(response.data);
            }
        )
}

export function getProductsService(page, size, sortField, sortOrder, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + '/products', {
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
                    summary: 'Error loading products!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        )
}

export function getProductByIdService(id, successCallback, errorCallBack) {
    axios.get(Constants.API_URL + `/products/${id}`, {
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
                    summary: `Error loading product with id ${id}!`,
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function saveProductService(product, successCallback, errorCallBack) {
    axios.post(Constants.API_URL + `/products`, product, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response, {
                    severity: 'success', summary: `Product saved!`, detail: ''
                });
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error saving product! ',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function updateProductService(product, successCallback, errorCallBack) {
    axios.put(Constants.API_URL + `/products/${product.id}`, product, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response, {
                    severity: 'success',
                    summary: `Product updated!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error updating product!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function deleteProductService(id, successCallback, errorCallBack) {
    axios.delete(Constants.API_URL + `/products/${id}`, {
        headers: authHeader()
    })
        .then(
            () => {
                successCallback({
                    severity: 'success',
                    summary: `Product with id ${id} deleted!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error deleting product!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function deactivateProductService(id, reason, username, successCallback, errorCallBack) {
    axios.delete(Constants.API_URL + `/products/${id}/deactivate`, {
        params: {
            reason: reason,
            username: username
        },
        headers: authHeader()
    })
        .then(
            () => {
                successCallback({
                    severity: 'success',
                    summary: `Product with id ${id} deactivated!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                errorCallBack({
                    severity: 'error',
                    summary: 'Error deactivating product!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}
