<template>
  <AuthWrapper>
    <div class="auth-contents">
      <div class="header-section">
        <sdHeading as="h1">
          Welcome to <span class="color-success">DigiMal-KE</span>
        </sdHeading>
      </div>

      <p class="subtitle">Community Health Provider Sign In</p>
      <p class="description">
        Enter your ID No you used to register via USSD and we'll send you OTP
        to complete login.
      </p>

      <a-form @finish="handleSubmit" :model="formState" layout="vertical" class="chp-form">
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
            class="btn-submit"
            htmlType="submit"
            type="success"
            size="large"
          >
            {{ showOtpInput ? "Verify OTP" : "Send OTP" }}
          </sdButton>
        </a-form-item>
      </a-form>

      <div class="divider">
        <span>or</span>
      </div>

      <div class="footer-section">
        <p class="return-text">
          <router-link to="/auth/login">← Back to User Type Selection</router-link>
        </p>
      </div>
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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/mobile_verify_id`;
    const VALIDATE_URL = `${process.env.VUE_APP_BASE_URL}/mobile_verify_otp`;
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      otp: "",
    });
    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      //*********************************
      //  Send CHP OTP ******************
      //*********************************
      if (!showOtpInput.value) {
        const values = {
          id_no: formState.id_no,
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
          } else if (response.status === 422) {
            console.log("Status 422");
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
              description:
                "Your account is fully setup, please login using your ID number and password.",
            });
          } else {
            notification.info({
              message: "Info",
              description:
                "You are not a registered chp, please contact the technical support team.",
            });
          }
        }
      } else {
        // Verify user input against sessionly stored OTP
        //*********************************
        //  Verify OTP input **************
        //*********************************
        const userOTP = formState.otp;
        sessionStorage.setItem("otp", userOTP);
        // console.log(generatedOTP);
        if (userOTP) {
          const values = {
            otp: formState.otp,
          };
          const response = await axios.post(VALIDATE_URL, values);
          console.log(response);
          if (response.status === 200) {
            sessionStorage.setItem("user", JSON.stringify(response.data));
            console.log(response.data.user.id);
            router.push(`/chp/${response.data.user.id}/hh-served`);
            notification.success({
              message: "Confirmation",
              description: response.data.message,
            });
          }
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
/* Auth Contents Layout */
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

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 24px;
  animation: fadeInDown 0.6s ease-out;
}

.header-section h1 {
  font-size: 32px;
  margin: 0;
  color: #272b41;
}

.subtitle {
  color: #868eae;
  font-size: 20px;
  margin: 0 0 16px 0;
  text-align: center;
  font-weight: 600;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.description {
  color: #868eae;
  font-size: 15px;
  margin: 0 0 32px 0;
  text-align: center;
  line-height: 1.6;
  max-width: 500px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

/* Form Styling */
.chp-form {
  width: 100%;
  max-width: 500px;
  min-width: 0;
  box-sizing: border-box;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.chp-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 600;
  color: #272b41;
}

.chp-form .ant-input {
  font-size: 15px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.chp-form .ant-input:hover {
  border-color: #20c997;
}

.chp-form .ant-input:focus {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}

.btn-submit {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 32px 0 28px 0;
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e8e8e8 20%, #e8e8e8 80%, transparent 100%);
}

.divider span {
  background: #fff;
  padding: 0 16px;
  color: #868eae;
  font-size: 15px;
  position: relative;
  font-weight: 500;
}

/* Footer Section */
.footer-section {
  text-align: center;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.return-text {
  margin: 0;
  font-size: 15px;
}

.return-text a {
  color: #20c997;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.return-text a:hover {
  color: #17a589;
  transform: translateX(-4px);
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 992px) {
  .auth-contents {
    padding: 28px 20px;
  }

  .header-section h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 18px;
  }

  .description {
    font-size: 14px;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  .auth-contents {
    padding: 24px 16px;
  }

  .header-section {
    margin-bottom: 20px;
  }

  .header-section h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 17px;
    margin: 0 0 12px 0;
  }

  .description {
    font-size: 14px;
    margin: 0 0 28px 0;
    max-width: 100%;
    padding: 0 10px;
  }

  .chp-form {
    max-width: 100%;
  }

  .chp-form .ant-form-item-label > label {
    font-size: 14px;
  }

  .chp-form .ant-input {
    font-size: 14px;
    padding: 11px 12px;
  }

  .btn-submit {
    height: 48px;
    font-size: 15px;
  }

  .divider {
    margin: 28px 0 24px 0;
  }

  .divider span {
    font-size: 14px;
  }

  .return-text {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .auth-contents {
    padding: 20px 12px;
    min-height: 100vh;
  }

  .header-section {
    margin-bottom: 16px;
  }

  .header-section h1 {
    font-size: 22px;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 16px;
    margin: 0 0 10px 0;
  }

  .description {
    font-size: 13px;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .chp-form .ant-form-item-label > label {
    font-size: 13px;
  }

  .chp-form .ant-input {
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 8px;
  }

  .btn-submit {
    height: 46px;
    font-size: 14px;
    border-radius: 8px;
  }

  .divider {
    margin: 24px 0 20px 0;
  }

  .divider span {
    font-size: 13px;
    padding: 0 12px;
  }

  .return-text {
    font-size: 13px;
  }
}

@media (max-width: 400px) {
  .auth-contents {
    padding: 16px 10px;
  }

  .header-section h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 15px;
  }

  .description {
    font-size: 12px;
  }

  .chp-form .ant-input {
    font-size: 13px;
  }

  .btn-submit {
    height: 44px;
    font-size: 13px;
  }
}
</style>
