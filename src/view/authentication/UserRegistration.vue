<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">Registered as New User?</sdHeading>
        <p class="forgot-text">
          Enter your ID No you used to register via USSD and we’ll send you
          instructions to set your password and email.
        </p>
        <a-form-item label="ID No" name="id_no">
          <a-input
            type="number"
            v-model:value="formState.id_no"
            placeholder="34567890"
          />
        </a-form-item>
        <a-form-item v-if="showOtpInput" label="OTP" name="otp">
          <a-input
            type="text"
            v-model:value="formState.otp"
            placeholder="Enter OTP"
          />
        </a-form-item>
        <a-form-item>
          <sdButton
            class="btn-reset"
            htmlType="submit"
            type="success"
            size="large"
          >
            {{ showOtpInput ? "Verify OTP" : "Send OTP" }}
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
import { useRouter } from "vue-router";

export default {
  name: "Register",
  components: { AuthWrapper },
  setup() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generate_otp`;
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      otp: "",
    });
    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      if (!showOtpInput.value) {
        // Send request to backend to generate OTP
        const values = {
          id_no: formState.id_no,
        };

        console.log(sessionStorage.getItem("id_no"));

        const response = await axios.post(API_URL, values);

        console.log(response);

        if (response.status === 200 || response.status === 226 || response.status === 201) {
          // Remove id_no and otp then store generated OTP and id_no in session storage
          sessionStorage.removeItem("id_no", values.id_no);
          sessionStorage.removeItem("otp", response.data.OTP);

          sessionStorage.setItem("otp", response.data.OTP);
          sessionStorage.setItem("id_no", values.id_no);
          console.log(response.data);
        } else {
          throw new Error("Network response was not ok.");
        }
        showOtpInput.value = true;
      } else {
        // Verify user input against sessionly stored OTP
        const generatedOTP = sessionStorage.getItem("otp");
        const userOTP = formState.otp;
        if (generatedOTP === userOTP) {
          router.push("/auth/set-password");
        } else {
          console.log("OTP does not match");
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
