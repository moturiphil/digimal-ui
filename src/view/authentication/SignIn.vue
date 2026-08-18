<template>
  <AuthWrapper>
    <div class="auth-contents">
      <div class="header-section">
        <sdHeading as="h1">
          Welcome to <span class="color-success">DigiMal-KE</span>
        </sdHeading>
        <p class="subtitle">Campaign User Sign In</p>
        <span v-if="env" :class="['env-badge', envClass]">{{ env }}</span>
        <p class="description">
          Enter your National ID number and password to access the campaign
          dashboard.
        </p>
      </div>

      <a-form
        @finish="handleSubmit"
        :model="formState"
        layout="vertical"
        class="signin-form"
      >
        <a-form-item name="id_no" label="National ID No">
          <a-input
            v-model:value="formState.id_no"
            type="number"
            placeholder="Enter ID No"
            required
          >
            <template #prefix>
              <IdcardOutlined class="prefix-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" label="Password" initialValue="">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
            required
          >
            <template #prefix>
              <LockOutlined class="prefix-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="auth-form-action">
          <a-checkbox v-model:checked="checked">Keep me logged in</a-checkbox>
          <a class="forgot-pass-link" @click="showModal"> Reset Password </a>
        </div>

        <a-form-item class="submit-item">
          <sdButton
            class="btn-signin"
            htmlType="submit"
            :loading="isLoading"
            type="success"
            size="large"
          >
            Sign In
          </sdButton>
        </a-form-item>
      </a-form>

      <div class="divider">
        <span>or</span>
      </div>

      <div class="footer-section">
        <router-link class="register-link" to="/auth/register">
          New User? Create an account
        </router-link>
        <p class="return-text">
          <router-link to="/auth/login">← Back to User Selection</router-link>
        </p>
      </div>

      <div>
        <a-modal
          v-model:visible="visible"
          title="Reset Password"
          wrap-class-name="reset-password-modal"
          :ok-button-props="{ props: { disabled: true } }"
          :cancel-button-props="{ props: { disabled: true } }"
          @ok="handleOk"
          centered="false"
          @cancel="handleCancel"
        >
          <a-form
            v-on:submit="resetPassword"
            :model="formState"
            layout="vertical"
          >
            <a-form-item name="id_no" label="National ID No">
              <a-input
                type="number"
                v-model:value="formState.r_id_no"
                placeholder="Enter ID No"
                required
              />
            </a-form-item>
            <a-form-item v-if="proceed" name="reset_code" label="Code">
              <a-input
                type="number"
                v-model:value="formState.r_code"
                placeholder="Enter Code"
                required
              />
            </a-form-item>
            <a-form-item
              v-if="proceed"
              name="password"
              initialValue=""
              label="Password"
            >
              <a-input
                v-model:value="formState.r_password"
                placeholder="Password"
                :iconRender="getPasswordToggleIcon"
                required
              />
            </a-form-item>
            <a-form-item
              v-if="proceed"
              name="confPassword"
              initialValue=""
              label="Confirm Password"
            >
              <a-input
                v-model:value="formState.r_confPassword"
                placeholder="Confirm Password"
                :iconRender="getPasswordToggleIcon"
                required
              />
            </a-form-item>

            <a-form-item>
              <sdButton
                class="btn-signin"
                htmlType="submit"
                :loading="isLoading"
                type="success"
                size="large"
              >
                {{ proceed ? "Reset" : "Proceed" }}
              </sdButton>
            </a-form-item>
            <p class="form-divider"></p>
          </a-form>
          <template #footer></template>
        </a-modal>
      </div>
    </div>
  </AuthWrapper>
</template>

<script>
import { computed, ref, reactive, onMounted } from "vue";
import AuthService from "../../services/auth.service";
import { useRouter } from "vue-router";
import { AuthWrapper } from "./style";
import store from "../../vuex/store";
import { notification } from "ant-design-vue";
import axios from "axios";
import { IdcardOutlined, LockOutlined } from "@ant-design/icons-vue";

export default {
  name: "SignInPage",
  components: { AuthWrapper, IdcardOutlined, LockOutlined },
  setup() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const proceed = ref(false);
    const router = useRouter();
    let visible = ref(false);
    const env = ref("");
    const envClass = computed(() => {
      if (!env.value) return '';
      if (env.value.toLowerCase().includes('pilot')) return 'pilot-badge';
      if (env.value.toLowerCase().includes('training')) return 'training-badge';
      return 'color-success';
    });

    const formState = reactive({
      id_no: "",
      password: "",
      r_id_no: "",
      r_code: "",
      r_password: "",
      r_confPassword: "",
    });

    const getPasswordToggleIcon = (visible) => {
      return visible ? "hide" : "show";
    };

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = () => {
      visible.value = false;
    };

    const handleCancel = () => {
      visible.value = false;
      (formState.r_id_no = ""),
        (formState.r_code = ""),
        (formState.r_password = ""),
        (formState.r_confPassword = "");
      proceed.value = false;
    };

    const handleSubmit = async () => {
      try {
        const response = await AuthService.login({
          id_no: formState.id_no,
          password: formState.password,
        });
        sessionStorage.setItem("auth-user", response.data.user);

        if (response.status === 200) {
          store.commit("auth/setUser", response.data.user);
          const redirectUrl = sessionStorage.getItem("redirectUrl");
          if (redirectUrl) {
            const url = redirectUrl.replace(
              /http:\/\/127\.0\.0\.1:8080\/auth\//,
              ""
            );
            router.push(url);
          } else {
            // Default redirect if there is no stored redirectUrl
            router.push("/");
          }
          notification.success({
            message: "Login Successful",
            description: "Welcome to Campaign Dashboard",
          });
        } else {
          notification.error({
            message: "Login Failed",
            description: "Invalid Credentials",
          });
        }
      } catch (error) {
        notification.error({
          message: "Login Failed!",
          description: "Wrong username or password",
        });
      }
    };

    const resetPassword = async (e) => {
      e.preventDefault();
      let url = "";
      let data = {};

      if (proceed.value) {
        (url = `${process.env.VUE_APP_BASE_URL}/reset_new_pass`),
          (data = {
            id_no: formState.r_id_no,
            reset_code: formState.r_code,
            password: formState.r_password,
            confirm: formState.r_confPassword,
          });
      } else {
        (url = `${process.env.VUE_APP_BASE_URL}/pass_reset_request`),
          (data = {
            id_no: formState.r_id_no,
          });
      }
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == true && url.includes("pass_reset_request")) {
            data = {};
            proceed.value = true;
          } else {
            if (data.status == true) {
              notification.success({
                message: "Password Reset Successful",
                description: "You can now login",
              });
              visible.value = false;
            } else {
              notification.error({
                message: "Error",
                description: data.message,
              });
            }
          }
        });
    };

    const get_env = async () => {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/app_env`)
        .then((response) => {
          if (response.data == "training") {
            env.value = "Training Platform";
          } else if (response.data == "maintenance") {
            router.push("/maintenance");
          } else if (response.data == "pilot") {
            env.value = "Pilot Environment";
          }
        })
        .catch((error) => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
        });
    };

    onMounted(() => {
      get_env();
    });

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      getPasswordToggleIcon,
      proceed,
      resetPassword,
      visible,
      showModal,
      handleOk,
      handleCancel,
      env,
      envClass,
    };
  },
  computed: {
    isTrainingInstance() {
      return this.currentHostname === "training.digimal.uonbi.ac.ke";
    },
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
  margin: 12px 0 0 0;
  text-align: center;
  font-weight: 600;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.env-badge {
  display: inline-block;
  margin-top: 12px;
}

.pilot-badge {
  background: linear-gradient(90deg, #fff7e6 0%, #fff1cc 100%);
  color: #ad4e00;
  border: 1px solid #ffd591;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
}

.training-badge {
  background: linear-gradient(90deg, #f6ffed 0%, #eafff0 100%);
  color: #237804;
  border: 1px solid #b7eb8f;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
}

.description {
  color: #868eae;
  font-size: 15px;
  margin: 12px 0 32px 0;
  text-align: center;
  line-height: 1.6;
  max-width: 500px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

/* Form Styling */
.signin-form {
  width: 100%;
  max-width: 500px;
  min-width: 0;
  box-sizing: border-box;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.signin-form .ant-form-item {
  margin-bottom: 18px;
}

.signin-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 600;
  color: #272b41;
}

.signin-form .ant-input,
.signin-form .ant-input-affix-wrapper {
  font-size: 15px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
  background: #ffffff;
}

.signin-form .ant-input:hover,
.signin-form .ant-input-affix-wrapper:hover {
  border-color: #20c997;
}

.signin-form .ant-input:focus,
.signin-form .ant-input:focused,
.signin-form .ant-input-affix-wrapper-focused {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}

.signin-form .ant-input-affix-wrapper {
  padding: 0 12px;
}

.signin-form .ant-input-affix-wrapper .ant-input {
  border: 0 none;
  box-shadow: none;
  padding: 12px 0;
}

.prefix-icon {
  color: #9cabb6;
  font-size: 16px;
  margin-right: 6px;
}

.auth-form-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin: -4px 0 10px;
}

.auth-form-action .ant-checkbox-wrapper {
  font-size: 14px;
  color: #555e7d;
}

.forgot-pass-link {
  color: #20c997;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.forgot-pass-link:hover {
  color: #17a589;
  text-decoration: underline;
}

.btn-signin {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  transition: all 0.3s ease;
  background: #20c997 !important;
  border-color: #20c997 !important;
  color: #ffffff !important;
}

.btn-signin:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
  background: #17a589 !important;
  border-color: #17a589 !important;
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
  background: linear-gradient(
    90deg,
    transparent 0%,
    #e8e8e8 20%,
    #e8e8e8 80%,
    transparent 100%
  );
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
  width: 100%;
  max-width: 500px;
  min-width: 0;
  box-sizing: border-box;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 13px 16px;
  border: 2px solid #20c997;
  border-radius: 10px;
  background: #ffffff;
  color: #20c997;
  font-size: 15.5px;
  font-weight: 700;
  text-decoration: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.register-link:hover {
  background: #e9fbf3;
  border-color: #17a589;
  color: #17a589;
}

.return-text {
  margin: 18px 0 0;
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
    min-height: 100dvh;
  }

  .header-section {
    margin-bottom: 20px;
  }

  .header-section h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 17px;
  }

  .description {
    font-size: 14px;
    margin: 12px 0 28px 0;
    max-width: 100%;
    padding: 0 10px;
  }

  .auth-form-action {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .auth-contents {
    padding: 20px 12px;
  }

  .register-link {
    font-size: 14.5px;
    padding: 12px 12px;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .auth-contents {
    justify-content: flex-start;
    padding-top: 16px;
  }

  .header-section {
    margin-bottom: 14px;
  }

  .description {
    margin-bottom: 20px;
  }
}
</style>

<style>
/* The ant-design-vue Modal is teleported to <body>, so these
   styles must live outside the scoped block. */
.reset-password-modal .ant-modal {
  max-width: 95vw;
}

.reset-password-modal .ant-modal-content {
  border-radius: 16px;
}

.reset-password-modal .ant-modal-header {
  border-bottom: 1px solid #eef3f6;
  border-radius: 16px 16px 0 0;
}

.reset-password-modal .ant-modal-title {
  font-size: 17px;
  font-weight: 700;
  color: #18212e;
}

.reset-password-modal .ant-modal-body {
  padding: 20px;
}

.reset-password-modal .ant-modal .ant-form-item {
  margin-bottom: 12px;
}

.reset-password-modal .btn-signin {
  width: 100%;
  height: 44px;
  font-size: 14.5px;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  background: #20c997;
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(32, 201, 151, 0.32);
}

.reset-password-modal .form-divider {
  display: none;
}
</style>