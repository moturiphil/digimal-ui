<template>
  <AuthWrapper>
    <p class="auth-notice">Don&rsquo;t have an account? Contact Admin</p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">
          Sign in to <span class="color-success">DigiMal KE Dashboard</span>
        </sdHeading>
        <a-form-item name="id_no" label="National ID No">
          <a-input
            type="number"
            v-model:value="formState.id_no"
            placeholder="Enter ID No"
          />
        </a-form-item>
        <a-form-item name="password" initialValue="" label="Password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
            :iconRender="getPasswordToggleIcon"
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
        <p class="form-divider"></p>
      </a-form>
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
              />
            </a-form-item>
            <a-form-item v-if="proceed" name="reset_code" label="Code">
              <a-input
                type="number"
                v-model:value="formState.r_code"
                placeholder="Enter Code"
              />
            </a-form-item>
            <a-form-item
              v-if="proceed"
              name="password"
              initialValue=""
              label="Password"
            >
              <a-input
                :type="showPassword ? 'text' : 'password'"
                v-model:value="formState.r_password"
                placeholder="Password"
                :iconRender="getPasswordToggleIcon"
              />
            </a-form-item>
            <a-form-item
              v-if="proceed"
              name="confPassword"
              initialValue=""
              label="Confirm Password"
            >
              <a-input
                :type="showPassword ? 'text' : 'password'"
                v-model:value="formState.r_confPassword"
                placeholder="Confirm Password"
                :iconRender="getPasswordToggleIcon"
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
import { computed, ref, reactive } from "vue";
import AuthService from "../../services/auth.service";
import { useRouter } from "vue-router";
import { AuthWrapper } from "./style";
import store from "../../vuex/store";
import { notification } from "ant-design-vue";

export default {
  name: "SignInPage",
  components: { AuthWrapper },
  setup() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const proceed = ref(false);
    const router = useRouter();
    let visible = ref(false);
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
    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value;
    };

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = () => {
      visible.value = false;
    };

    const handleCancel = () => {
      visible.value = false;
    };

    const handleSubmit = async () => {
      try {
        const response = await AuthService.login({
          id_no: formState.id_no,
          password: formState.password,
        });
        sessionStorage.setItem("auth-user", response.data.user);

        console.log(sessionStorage.getItem("auth-user"));

        if (response.status === 200) {
          store.commit("auth/setUser", response.data.user);
          const redirectUrl = sessionStorage.getItem("redirectUrl");
          console.log(redirectUrl);
          if (redirectUrl) {
            const url = redirectUrl.replace(/http:\/\/127\.0\.0\.1:8080\/auth\//, '');
            router.push(url);
          } else {
            // Default redirect if there is no stored redirectUrl
            router.push("/");
          }
          // router.push({ path: "/" });
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
          message: "Error",
          description: "An error occurred.",
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
          console.log(data);
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
                message: data.message,
                description: "Fail",
              });
            }
          }
        });
    };

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      showPassword,
      getPasswordToggleIcon,
      toggleShowPassword,
      proceed,
      resetPassword,
      visible,
      showModal,
      handleOk,
      handleCancel,
    };
  },
};
</script>
