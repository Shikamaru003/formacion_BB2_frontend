import axios from 'axios'
import authHeader from './auth-header';


const API_URL = 'http://localhost:9090/api';

class ProductService {

    getAllProducts() {
        return axios.get(API_URL + '/products/all', {
            headers: authHeader()
        });
    }

    getProducts(page, size, sortField, sortOrder) {
        return axios.get(API_URL + '/products', {
            params: {
                page: page,
                size: size,
                sortField: sortField,
                sortOrder: sortOrder
            },
            headers: authHeader()
        });
    }

    getProductById(id) {
        return axios.get(API_URL + `/products/${id}`, {
            headers: authHeader()
        });
    }

    saveProduct(product) {
        return axios.post(API_URL + `/products`, product, {
            headers: authHeader()
        });
    }

    updateProduct(product) {
        return axios.put(API_URL + `/products/${product.id}`, product, {
            headers: authHeader()
        });
    }

    deleteProduct(id) {
        return axios.delete(API_URL + `/products/${id}`, {
            headers: authHeader()
        });
    }

}

export default new ProductService();