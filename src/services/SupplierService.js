import axios from 'axios'
import authHeader from './auth-header';


const API_URL = 'http://localhost:9090/api/';

class SupplierService {

    getAllSuppliers() {
        return axios.get(API_URL + 'suppliers/all', {
            headers: authHeader()
        });
    }

    getAvailableSuppliers(id) {
        return axios.get(API_URL + `products/${id}/available_suppliers`, {
            headers: authHeader()
        });
    }
}

export default new SupplierService();