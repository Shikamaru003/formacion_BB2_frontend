import axios from 'axios'
import authHeader from './auth-header';

const API_URL = 'http://localhost:9090/api';

class userService {

    getAllUsers() {
        return axios.get(API_URL + '/users/all', {
            headers: authHeader()
        });
    }

    getUsers(page, size, sortField, sortOrder) {
        return axios.get(API_URL + '/users', {
            params: {
                page: page,
                size: size,
                sortField: sortField,
                sortOrder: sortOrder
            },
            headers: authHeader()
        });
    }

    getUserById(id) {
        return axios.get(API_URL + `/users/${id}`, {
            headers: authHeader()
        });
    }

    saveUser(user) {
        return axios.post(API_URL + '/users', user, {
            headers: authHeader()
        });
    }

    updateUser(user) {
        return axios.put(API_URL + `/users/${user.id}`, user, {
            headers: authHeader()
        });
    }

    deleteUser(id) {
        return axios.delete(API_URL + `/users/${id}`, {
            headers: authHeader()
        });
    }

}

export default new userService();