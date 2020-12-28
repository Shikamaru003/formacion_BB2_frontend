import axios from 'axios'

const API_URL = "http://localhost:9090/api/auth/";

class AuthenticationService {

    async login(username, password) {
        const response = await axios
            .post(API_URL + "login", { username, password });
        if (response.data.accessToken) {
            sessionStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
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

    isAdmin(){
       return this.getCurrentUser().roles.includes("ROLE_ADMIN");
    }

}

export default new AuthenticationService();