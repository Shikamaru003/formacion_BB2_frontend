import axios from 'axios'
import authHeader from './auth-header';

const API_URL = 'http://localhost:9090/api';

export function getAllProductsService(successCallback) {
    axios.get(API_URL + '/products/all', {
        headers: authHeader()
    })
        .then(
            response => {
                successCallback(response.data);
            }
        )
}

export function getProductsService(page, size, sortField, sortOrder, successCallback, messagesCallBack) {
    axios.get(API_URL + '/products', {
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
                messagesCallBack({
                    severity: 'error',
                    summary: 'Error loading products!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        )
}

export function getProductByIdService(id, successCallback, messagesCallBack) {
    axios.get(API_URL + `/products/${id}`, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response)
            })
        .catch(
            (error) => {
                messagesCallBack({
                    severity: 'error',
                    summary: `Error loading product with id ${id}!`,
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function saveProductService(product, successCallback, messagesCallBack) {
    axios.post(API_URL + `/products`, product, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response);
                messagesCallBack({
                    severity: 'success', summary: `Product updated!`, detail: ''
                });
            })
        .catch(
            (error) => {
                messagesCallBack({
                    severity: 'error',
                    summary: 'Error saving product! ',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function updateProductService(product, successCallback, messagesCallBack) {
    axios.put(API_URL + `/products/${product.id}`, product, {
        headers: authHeader()
    })
        .then(
            (response) => {
                successCallback(response);
                messagesCallBack({
                    severity: 'success',
                    summary: `Product updated!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                messagesCallBack({
                    severity: 'error',
                    summary: 'Error updating product!',
                    detail: `(${(error.response && error.response.data && error.response.data.message) || error.message || error.toString()})`
                });
            }
        );
}

export function deleteProductService(id, successCallback, messagesCallBack) {
    axios.delete(API_URL + `/products/${id}`, {
        headers: authHeader()
    })
        .then(
            () => {
                successCallback();
                messagesCallBack({
                    severity: 'success',
                    summary: `Product with id ${id} deleted!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                messagesCallBack({
                    severity: 'error',
                    summary: 'Error deleting product!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}

export function deactivateProductService(id, reason, username, successCallback, messagesCallBack) {
    axios.delete(API_URL + `/products/${id}/deactivate`, {
        params: {
            reason: reason,
            username: username
        },
        headers: authHeader()
    })
        .then(
            () => {
                successCallback();
                messagesCallBack({
                    severity: 'success',
                    summary: `Product with id ${id} deactivated!`,
                    detail: ''
                });
            })
        .catch(
            (error) => {
                messagesCallBack({
                    severity: 'error',
                    summary: 'Error deactivating product!',
                    detail: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
}
