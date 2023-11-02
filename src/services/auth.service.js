import axios from "axios";
import { notification } from "ant-design-vue";


const API_URL = `${process.env.VUE_APP_BASE_URL}/`;
// const router = useRouter();

class AuthService {
  login(user) {
    // console.log(`user:`, user);

    return axios
      .post(API_URL + "login", {
        id_no: user.id_no,
        password: user.password,
      })
      .then((response) => {
        if (response.data.token) {
          sessionStorage.setItem(
            "user-config-token",
            JSON.stringify(response.data.token)
          );
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }
        const user = sessionStorage.getItem("user");
        console.log(user.s);
        return response;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
  }

  register(user) {
    // console.log(user);
    return axios
      .patch(API_URL + "set_users_password", {
        id_no: user.id_no,
        password: user.password,
        confirm_password: user.confirm_password,
        otp: user.otp,
        email: user.email,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 202) {
          notification.success({
            message: "Success! ",
            description: "You have successfully set your password",
          });
        }
        else if (response.message == "Request failed with status code 400") {
          notification.error({
            message: "Error",
            description: "Error setting your password, OTP mismatch",
          });
        }
        else {
          notification.error({
            message: "Error",
            description: "Error setting your password, OTP mismatch",
          });
        }
        // return router.push("/");
      });
  }
  getUser() {
    const user = sessionStorage.getItem("user-config-token");
    return user ? JSON.parse(user) : null;
  }
  hasPermission(permission) {
    const user = this.getUser();
    return user && user.permissions && user.permissions.includes(permission);
  }
}

export default new AuthService();
