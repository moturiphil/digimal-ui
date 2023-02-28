import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = 'http://127.0.0.1:8000/api/';
const router = useRouter();

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
    console.log(user);
    return axios
    .patch(API_URL + 'set_users_password', {
      id_no: user.id_no,
      password: user.password,
      confirm_password: user.confirm_password,
      otp : user.otp,
      email : user.email
    })
    .then(
      response => {
        console.log(response);
        return router.push("/");
      }
    );
  }
}

export default new AuthService();