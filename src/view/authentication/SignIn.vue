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
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      password: "",
    });
    const showPassword = ref(false);

    const getPasswordToggleIcon = (visible) => {
      return visible ? "hide" : "show";
    };
    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value;
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
          router.push({ path: "/" });
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
          description: error.response.data.message || "An error occurred.",
        });
      }
    };

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      showPassword,
      getPasswordToggleIcon,
      toggleShowPassword,
    };
  },
};
</script>
