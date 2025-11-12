<template>
  <AuthWrapper>
    <div class="auth-contents">
      <div class="header-section">
        <sdHeading as="h1">
          Welcome to <span class="color-success">DigiMal-KE</span>
        </sdHeading>
        <sdHeading as="h1">
          <span :class="envClass">{{ env }}</span>
        </sdHeading>
      </div>

      <p class="subtitle">Campaign User Sign In</p>

      <a-form @finish="handleSubmit" :model="formState" layout="vertical" class="signin-form">
        <a-form-item name="id_no" label="National ID No">
          <a-input
            type="number"
            v-model:value="formState.id_no"
            placeholder="Enter ID No"
            required
          />
        </a-form-item>
        <a-form-item name="password" initialValue="" label="Password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
            required
          />
        </a-form-item>

        <div class="auth-form-action">
          <a-checkbox v-model="checked" @change="onChange"
            >Keep me logged in</a-checkbox
          >
          <a class="forgot-pass-link" @click="showModal"> Reset Password </a>

          <router-link class="forgot-pass-link" to="/auth/register">
            New User?
          </router-link>
        </div>
        <a-form-item>
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
        <p class="return-text">
          <router-link to="/auth/login">← Back to User Selection</router-link>
        </p>
      </div>
      <div>
        <a-modal
          v-model="visible"
          title="Reset Password"
          :ok-button-props="{ props: { disabled: true } }"
          :cancel-button-props="{ props: { disabled: true } }"
          @ok="handleOk"
          centered="false"
          @cancel="handleCancel"
          :visible="visible"
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
      <!-- implement the notification if user is not authorized -->
      <a-notification
        v-if="isError"
        :message="errorMessage"
        type="error"
        :description="errorDescription"
        :showIcon="true"
        :duration="0"
        :style="{ width: '100%' }"
      />
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

export default {
  name: "SignInPage",
  components: { AuthWrapper },
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
    const showPassword = ref(false);

    const getPasswordToggleIcon = (visible) => {
      return visible ? "hide" : "show";
    };
    // const toggleShowPassword = () => {
    //   showPassword.value = !showPassword.value;
    // };

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
      // const API_URL = process.env.VUE_APP_API_URL;
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
      showPassword,
      getPasswordToggleIcon,
      // toggleShowPassword,
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
    // Check if the current URL is the training instance
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
  margin: 0 0 30px 0;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

/* Form Styling */
.signin-form {
  width: 100%;
  max-width: 450px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.signin-form .ant-form-item-label > label {
  font-size: 15px;
  font-weight: 500;
  color: #272b41;
}

.signin-form .ant-input,
.signin-form .ant-input-password {
  font-size: 15px;
  padding: 10px 12px;
  border-radius: 8px;
}

.auth-form-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.auth-form-action .ant-checkbox-wrapper {
  font-size: 15px;
}

.forgot-pass-link {
  color: #20c997;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.forgot-pass-link:hover {
  color: #17a589;
  text-decoration: underline;
}

.btn-signin {
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

/* Environment badges */
.pilot-badge {
  display: inline-block;
  background: linear-gradient(90deg, #fff7e6 0%, #fff1cc 100%);
  color: #ad4e00;
  border: 1px solid #ffd591;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(250, 173, 20, 0.12);
  font-size: 15px;
}

.training-badge {
  display: inline-block;
  background: linear-gradient(90deg, #f6ffed 0%, #eafff0 100%);
  color: #237804;
  border: 1px solid #b7eb8f;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
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

  .signin-form .ant-form-item-label > label {
    font-size: 14px;
  }

  .signin-form .ant-input,
  .signin-form .ant-input-password {
    font-size: 14px;
  }

  .btn-signin {
    height: 44px;
    font-size: 15px;
  }
}
</style>
