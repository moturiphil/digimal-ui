<template>
  <AuthWrapper>
    <p class="auth-notice">Don&rsquo;t have an account? Contact Admin</p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">
          Sign in to <span class="color-success">DigiMal KE Dashboard</span>
        </sdHeading>
        <a-form-item name="id_no" label="National ID No">
          <a-input type="number" v-model:value="formState.id_no"  placeholder="Enter ID No"/>
        </a-form-item>
        <a-form-item name="password" initialValue="" label="Password">
          <a-input
            type="password"
            v-model:value="formState.password"
            placeholder="Password"
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
// import { mapState } from 'vuex'
import AuthService from "../../services/auth.service";
import { useRouter } from "vue-router";
// import { useStore } from 'vuex';
import { AuthWrapper } from "./style";
import store from "../../vuex/store";
import { notification } from "ant-design-vue";
export default {
  name: "SignIn",
  components: { AuthWrapper },
  setup() {
    // console.log(store.state.auth);
    const isLoading = computed(() => store.state.auth.loading);
    // console.log(isLoading);
    const checked = ref(null);
    const router = useRouter();
    // console.log(store.state);
    const formState = reactive({
      id_no: "",
      password: "",
    });
    
    const handleSubmit = async () => {
      const response = await AuthService.login({
        id_no: formState.id_no,
        password: formState.password,
      });
      console.log(response.status, response.data);
      if (response.status == 200) {
        console.log(response.status);
        console.log("response successful.................");

        try {
          store.commit("auth/setUser", response.data.user);
          router.push({ path: "/" });
          notification.success({
            message: "Login Successful",
            description: "Welcome to Campaign Dashboard",
          });
        } catch (e) {
          console.log(e);
        }
      } else if (response.status == 401) {
        // new code to display error notification
        // console.log(response.status);
        console.log('other error responses');
        notification.error({
          message: "Login Failed",
          description: "Invalid Credentials",
        });
      }
    };

    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
      // new computed properties to access the error state from the store
      isError: computed(() => store.state.auth.isError),
      errorMessage: computed(() => store.state.auth.errorMessage),
      errorDescription: computed(() => store.state.auth.errorDescription),
    };
  },
};
</script>
