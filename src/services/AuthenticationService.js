import axios from 'axios'

const API_URL = "http://localhost:9090/api/auth/";

class authenticationService {

    async login(username, password) {
        const response = await axios
            .get(API_URL + "login", {
                auth: {
                    username: username,
                    password: password
                }
            });

        if (response.headers.authorization) {
            const user = { username: username, password: password, roles: response.data, accessToken: response.headers.authorization }
            sessionStorage.setItem('user', JSON.stringify(user));
        }
        return response;
    }


    logout() {
        sessionStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }

    isLoggedIn() {
        return sessionStorage.getItem('user') !== null;
    }

    isAdmin() {
        return this.getCurrentUser().roles.includes("ROLE_ADMIN");
    }

}

export default new authenticationService();