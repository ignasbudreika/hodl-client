import axios from 'axios';

class AuthService {
  async registerUser(username: string, password: string, passwordConfirmation: string) {
    var axiosWithClientAuthorization = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic aG9kbC1jbGllbnQ6c2VjcmV0'
      }
    })

    return axiosWithClientAuthorization.post('/register', {'username': username, 'password': password, 'password_confirmation': passwordConfirmation});
  }

  retrieveAccessTokenFromAuthenticationCode(code: string) {
    var axiosInstance = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic aG9kbC1jbGllbnQ6c2VjcmV0'
      }
    })

    return axiosInstance
    .post("/oauth2/token?grant_type=authorization_code&redirect_uri=http://127.0.0.1:3000&code=" + code);
  }
}

export default new AuthService();