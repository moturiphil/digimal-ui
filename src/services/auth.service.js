import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        id_no: user.id_no,
        password: user.password
      })
      .then(response => {
        console.log(response);
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data.token));
        }
        // console.log(localStorage.getItem('user'));
        return response;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'auth/signup', {
      id_no: user.id_no,
      password: user.password
    });
  }
}

export default new AuthService();