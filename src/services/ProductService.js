import axios from 'axios'
import authHeader from './auth-header';

const API_URL = 'http://localhost:9090/api';

export function getAllProducts() {
    axios.get(API_URL + '/products/all', {
        headers: authHeader()
    }).then(
        response => {
            return (response.data);
        }
    )
}

export function getProductsService(page, size, sortField, sortOrder, messages, handleData) {
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
            response => {
                handleData(response.data)
            })
        .catch(
            error => {
                messages.current.show({
                    severity: 'error', summary: error, detail: 'Error loading products!'
                });
            }
        )
}

export function getProductByIdService(id) {
    return axios.get(API_URL + `/products/${id}`, {
        headers: authHeader()
    });
}

export function saveProductService(product) {
    return axios.post(API_URL + `/products`, product, {
        headers: authHeader()
    });
}

export function updateProductService(product) {
    return axios.put(API_URL + `/products/${product.id}`, product, {
        headers: authHeader()
    });
}

export function deleteProductService(id) {
    console.log('deleteProduct')
    return axios.delete(API_URL + `/products/${id}`, {
        headers: authHeader()
    });
}

export function deactivateProductService(id, reason, username, page, rows, sortField, sortOrder, messages, handleData) {
    axios.delete(API_URL + `/products/${id}/deactivate`, {
        params: {
            reason: reason,
            username: username
        },
        headers: authHeader()
    })
        .then(
            () => {
                this.getProducts(page, rows, sortField, sortOrder, messages, handleData);
                messages.current.show({
                    severity: 'success', summary: '', detail: `Product with id ${id} deactivated!`
                });
            }
        ).catch(
            () => {
                messages.current.show({
                    severity: 'error', summary: '', detail: 'Error deactivating product!'
                });
            }
        );
}
