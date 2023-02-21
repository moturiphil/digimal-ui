<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">Complete Profile?</sdHeading>
        <p class="forgot-text">Create Password and submit email for your account</p>
        <a-form-item label="ID NO">
          <!-- <a-input :value="formattedId" disabled /> -->
          <a-input v-model:value="formState.id_no" disabled />
        </a-form-item>
        <a-form-item label="Password" name="password">
          <a-input
            type="number"
            v-model:value="formState.password"
            placeholder="Enter Password"
          />
        </a-form-item>
        <a-form-item label="Confirm Password" name="password">
          <a-input
            type="text"
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
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "Password",
  components: { AuthWrapper },
  setup() {
    // const id_no = props.route.params.id_no;
    // const otp = props.route.query.otp;
    
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const router = useRouter();
    const route = useRoute();

    const formattedId = computed(() => {
      if (route.params?.id_no) {
        return route.params.id_no.toString().padStart(6, "0");
      } else {
        return "";
      }
    });

    const API_URL = "http://127.0.0.1:8000/api/set_users_password";
    const formState = reactive({
      id_no: localStorage.getItem("id_no") || "",
      otp: localStorage.getItem("otp") || "",
      password: "",
      confirm_password: "",
    });

    console.log(formState);

    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      const values = {
        id_no: formState.id_no,
        password: formState.password,
        confirm_password: formState.confirm_password,
      };

      try {
        const response = await axios.post(API_URL, values);
        console.log(response);
        if (response.status === 200) {
          const data = response.data;
          console.log(data);
          showOtpInput.value = true;

          store.commit("setOtp", response.data.otp);
          router.push({ path: "/" });
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error:", error);
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
      formattedId,
    };
  },
};
</script>

