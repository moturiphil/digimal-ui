<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">Complete Profile?</sdHeading>
        <p class="forgot-text">
          Create Password and submit email for your account
        </p>
        <a-form-item label="ID NO">
          <a-input v-model:value="formState.id_no" disabled />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model:value="formState.email" placeholder="Enter Email" />
        </a-form-item>
        <a-form-item label="Password" name="password">
          <a-input
            type="password"
            v-model:value="formState.password"
            placeholder="Enter Password"
          />
        </a-form-item>
        <a-form-item label="Confirm Password" name="password">
          <a-input
            type="password"
            v-model:value="formState.confirm_password"
            placeholder="Confirm Password"
          />
        </a-form-item>
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
import { useRouter } from 'vue-router';
import AuthService from "../../services/auth.service";


export default {
  name: "Password",
  components: { AuthWrapper },
  setup() {
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
      router.replace('/');
      console.log(response);
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
      formattedId,
    };
  },
};
</script>
