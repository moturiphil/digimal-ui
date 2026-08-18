<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form
          @finish="handleSubmit"
          :model="formState"
          layout="vertical"
          class="register-form"
        >
        <sdHeading as="h3">Registered as New User?</sdHeading>
        <p class="forgot-text">
          Enter your ID No you used to register via USSD and we’ll send you
          instructions to set your password and email.
        </p>
        <a-form-item label="ID No" name="id_no">
          <a-input
            type="number"
            v-model:value="formState.id_no"
            placeholder="Enter ID number"
            required
          />
        </a-form-item>
        <a-form-item v-if="showOtpInput" label="OTP" name="otp">
          <a-input
            type="text"
            v-model:value="formState.otp"
            placeholder="Enter OTP"
            required
          />
        </a-form-item>
        <a-form-item>
          <sdButton
            class="btn-reset"
            htmlType="submit"
            type="success"
            size="small"
          >
            {{ showOtpInput ? "Verify OTP" : "Send OTP" }}
          </sdButton>
        </a-form-item>
        <p class="return-text">
          Return to <router-link to="/auth/login">Sign In</router-link>
        </p>
      </a-form>
    </div>
  </AuthWrapper>
</template>
<script>
import { computed, ref, reactive } from "vue";
import { AuthWrapper } from "./style";
import store from "../../vuex/store";
import axios from "axios";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";

export default {
  name: "Register",
  components: { AuthWrapper },
  data() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generate_otp`;
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      otp: "",
    });
    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      if (!showOtpInput.value) {
        const values = {
          id_no: formState.id_no,
          // otp : formState.otp
        };

        try {
          const response = await axios.post(API_URL, values);
          console.log(response);
          notification.info({
            message: "Confirmation",
            description: response.data.message,
          });

          if (
            response.status === 200 ||
            response.status === 226 ||
            response.status === 201
          ) {
            sessionStorage.setItem("id_no", values.id_no);
          } else {
            notification.error({
              message: "Error",
              description: response.data.message,
            });
            throw new Error("Network response was not ok.");
          }
          showOtpInput.value = true;
        } catch (error) {
          console.log(error.message);
          if (error.message == "Request failed with status code 403") {
            notification.error({
              message: "Error",
              description: "User not allowed to create portal account",
            });
          } else if (error.message == "Request failed with status code 401") {
            notification.info({
              message: "Info",
              description: "Your account is fully setup, please login using your ID number and password.",
            });
          } else {
            notification.info({
              message: "Info",
              description:
                "You are not a registered user, please contact the technical support team.",
            });
          }
        }
      } else {
        // Verify user input against sessionly stored OTP
        // const generatedOTP = sessionStorage.getItem("otp");
        const userOTP = formState.otp;
        sessionStorage.setItem("otp", userOTP);
        console.log(userOTP);
        // console.log(generatedOTP);
        if (userOTP) {
          router.push("/auth/set-password");
        } else {
          console.log("OTP does not match");
          notification.info({
            message: "Info",
            description: "OTP mismatch",
          });
        }
      }
    };

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      isError: computed(() => store.state.auth.isError),
      errorMessage: computed(() => store.state.auth.errorMessage),
      errorDescription: computed(() => store.state.auth.errorDescription),
      showOtpInput,
    };
  },
};
</script>

<style scoped>
/* Center the register content like the other auth pages */
.auth-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 32px 24px;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.auth-contents h3 {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  color: #272b41;
}

.register-form {
  width: 100%;
  max-width: 420px;
  min-width: 0;
  box-sizing: border-box;
  animation: regFadeInUp 0.6s ease-out 0.2s both;
}

.register-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 600;
  color: #272b41;
  text-align: left;
}

.register-form .ant-input {
  font-size: 15px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.register-form .ant-input:hover {
  border-color: #20c997;
}

.register-form .ant-input:focus {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}

.forgot-text {
  margin: 0 auto 30px;
  max-width: 420px;
  color: #868eae;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
}

.return-text {
  margin: 22px 0 0;
  text-align: center;
  font-size: 15px;
}

.return-text a {
  color: #20c997;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.return-text a:hover {
  color: #17a589;
}

.btn-reset {
  width: 100%;
  height: 48px;
  font-size: 15.5px;
  font-weight: 600;
  border-radius: 10px;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  transition: all 0.3s ease;
}

.btn-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

@keyframes regFadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .auth-contents {
    padding: 24px 16px;
    min-height: 100dvh;
  }

  .auth-contents h3 {
    font-size: 23px;
  }
}
</style>
