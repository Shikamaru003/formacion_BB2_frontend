import axios from 'axios'
import authHeader from './auth-header';


const API_URL = 'http://localhost:9090/api/';

class priceReductionService {

    getAllPriceReductions() {
        return axios.get(API_URL + 'price_reductions', {
            headers: authHeader()
        });
    }

    getAvailablePriceReductions(id) {
        return axios.get(API_URL + `products/${id}/available_price_reductions`, {
            headers: authHeader()
        });
    }
}

export default new priceReductionService();