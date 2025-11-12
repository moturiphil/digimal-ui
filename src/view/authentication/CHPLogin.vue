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
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeInDown 0.6s ease-out;
}

.subtitle {
  color: #868eae;
  font-size: 18px;
  margin: 0 0 15px 0;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.description {
  color: #868eae;
  font-size: 15px;
  margin: 0 0 30px 0;
  text-align: center;
  line-height: 1.6;
  max-width: 450px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

/* Form Styling */
.chp-form {
  width: 100%;
  max-width: 450px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.chp-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 500;
  color: #272b41;
}

.chp-form .ant-input {
  font-size: 15px;
  padding: 10px 12px;
  border-radius: 8px;
}

.btn-submit {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-top: 10px;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 30px 0 25px 0;
  width: 100%;
  max-width: 450px;
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
  padding: 0 15px;
  color: #868eae;
  font-size: 16px;
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
  font-weight: 500;
  transition: all 0.2s ease;
}

.return-text a:hover {
  color: #17a589;
  text-decoration: underline;
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
@media (max-width: 768px) {
  .subtitle {
    font-size: 16px;
  }

  .description {
    font-size: 14px;
  }

  .chp-form .ant-form-item-label > label {
    font-size: 14px;
  }

  .chp-form .ant-input {
    font-size: 14px;
  }

  .btn-submit {
    height: 44px;
    font-size: 15px;
  }
}
</style>
