<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form
          @finish="handleSubmit"
          :model="formState"
          layout="vertical"
          class="setpass-form"
        >
        <sdHeading as="h3">Complete Profile?</sdHeading>
        <p class="forgot-text">
          Create Password and submit email for your account
        </p>
        <a-form-item label="ID NO">
          <!-- <a-input :value="formattedId" disabled /> -->
          <a-input v-model:value="formState.id_no" disabled />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model:value="formState.email" placeholder="Enter Email" />
        </a-form-item>
        <a-form-item name="password" initialValue="" label="Password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
            required
          />
          <div
            class="password-strength-indicator"
            :class="passwordStrengthClass"
          >
            Password Strength: {{ passwordStrength }}
          </div>
        </a-form-item>
        <a-form-item name="password" initialValue="" label="Confirm Password">
          <a-input-password
            v-model:value="formState.confirm_password"
            placeholder="Password"
            required
          />
          <div
            class="password-strength-indicator"
            :class="passwordStrengthClass"
          >
            Password Strength: {{ passwordStrength }}
          </div>
        </a-form-item>
        <!-- <a-form-item label="Confirm Password" name="password">
          <a-input
            type="password"
            v-model:value="formState.confirm_password"
            placeholder="Confirm Password"
          />
        </a-form-item> -->
        <a-form-item>
          <sdButton
            class="btn-reset"
            htmlType="submit"
            type="success"
            size="large"
          >
            <!-- {{ showOtpInput ? "Verify OTP" : "Send OTP" }} -->
            Create Account
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
// import axios from "axios";
// import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import AuthService from "../../services/auth.service";

export default {
  name: "Password",
  components: { AuthWrapper },
  setup() {
    // const id_no = props.route.params.id_no;
    // const otp = props.route.query.otp;

    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const route = useRoute();
    const router = useRouter();

    const formattedId = computed(() => {
      if (route.params?.id_no) {
        return route.params.id_no.toString().padStart(6, "0");
      } else {
        return "";
      }
    });

    const formState = reactive({
      id_no: sessionStorage.getItem("id_no") || "",
      otp: sessionStorage.getItem("otp") || "",
      email: "",
      password: "",
      confirm_password: "",
    });

    console.log(formState);

    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      // const response = await axios.post(API_URL, values);
      const response = await AuthService.register({
        id_no: formState.id_no,
        otp: formState.otp,
        password: formState.password,
        confirm_password: formState.confirm_password,
        email: formState.email,
      });
      // router.push("/");
      router.replace("/");
      console.log(response);
      // if (response.status == 200) {
      //   console.log(response);
      //   router.push("/auth/login");
      //   console.log("response successfully sent....");
      //   // router.push("/");
      // }
      // handle success response
      // handle error response
    };

    function checkPasswordStrength(password) {
      // Regular expression to check for a mix of uppercase and lowercase letters,
      // numbers, and special characters, and a minimum length of 10 characters
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

      if (passwordRegex.test(password)) {
        return "strong";
      } else if (password.length >= 8) {
        return "medium";
      } else {
        return "weak";
      }
    }
    const passwordStrength = computed(() => {
    return checkPasswordStrength(formState.password);
  });

    const passwordStrengthClass = computed(() => {
      const strength = checkPasswordStrength(formState.password);
      if (strength === "weak") {
        return "password-weak";
      } else if (strength === "medium") {
        return "password-medium";
      } else {
        return ""; // Default class for strong password
      }
    });

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      isError: computed(() => store.state.auth.isError),
      errorMessage: computed(() => store.state.auth.errorMessage),
      errorDescription: computed(() => store.state.auth.errorDescription),
      showOtpInput,
      formattedId,
      passwordStrength,
      passwordStrengthClass,
    };
  },
};
</script>
<style scoped>
/* Aligned with the other auth pages */
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

.forgot-text {
  margin: 0 auto 30px;
  max-width: 420px;
  color: #868eae;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
}

.setpass-form {
  width: 100%;
  max-width: 420px;
  min-width: 0;
  box-sizing: border-box;
  animation: spFadeInUp 0.6s ease-out 0.2s both;
}

.setpass-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 600;
  color: #272b41;
  text-align: left;
}

.setpass-form .ant-input,
.setpass-form .ant-input-affix-wrapper {
  font-size: 15px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  background: #ffffff;
  transition: all 0.3s ease;
}

.setpass-form .ant-input:hover,
.setpass-form .ant-input-affix-wrapper:hover {
  border-color: #20c997;
}

.setpass-form .ant-input:focus,
.setpass-form .ant-input-affix-wrapper-focused {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
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

.password-strength-indicator {
  color: #20c997;
  font-size: 13px;
  margin-top: 6px;
}

.password-weak {
  color: #e5484d;
}

.password-medium {
  color: #f5a623;
}

@keyframes spFadeInUp {
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
