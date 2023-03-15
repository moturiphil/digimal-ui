import axios from 'axios';
// import { useRouter } from 'vue-router';

// import { inject } from 'vue';

const API_URL = `${process.env.VUE_APP_BASE_URL}/`;
// const router = useRouter();

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
          sessionStorage.setItem('user', JSON.stringify(response.data.token));
        }
        // console.log(localStorage.getItem('user'));
        return response;
      });
  }

  logout() {
    sessionStorage.removeItem('user');
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
        // return router.push("/");
      }
    );
  }
}

export default new AuthService();