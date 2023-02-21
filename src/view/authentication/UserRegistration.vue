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
    const API_URL = "http://127.0.0.1:8000/api/generate_otp";
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      otp: "",
    });
    const showOtpInput = ref(false);

    // const handleSubmit = async () => {
    //   const values = {
    //     id_no: formState.id_no,
    //     otp: formState.otp,
    //   };
    //   const response = await axios.post(API_URL, values);
    //   // store the id_no and otp in the local storage
    //   localStorage.setItem("id_no", values.id_no);
    //   localStorage.setItem("otp", values.otp);

    //   console.log(localStorage.getItem("id_no"), localStorage.getItem("otp"));

    //   try {
    //     if (response.status === 200) {
    //       const data = response.data;
    //       console.log(data);
    //       showOtpInput.value = true;
    //     } else {
    //       throw new Error("Network response was not ok.");
    //     }
    //   } catch (error) {
    //     console.log("Error:", error);
    //   }

    //   if (formState.otp !== "") {
    //     // Check if user has input an OTP
    //     const generatedOTP = response.data.OTP;
    //     const userOTP = formState.otp;

    //     console.log(generatedOTP, userOTP);

    //     if (generatedOTP === userOTP) {
    //       router.push("/auth/set-password");
    //     } else {
    //       console.log("OTP does not match");
    //     }
    //   }
    // };

    const handleSubmit = async () => {
      if (!showOtpInput.value) {
        // Send request to backend to generate OTP
        const values = {
          id_no: formState.id_no,
        };
        const response = await axios.post(API_URL, values);
        if (response.status === 200) {
          // Store generated OTP in local storage
          localStorage.setItem("otp", response.data.OTP);
          console.log(response.data);
        } else {
          throw new Error("Network response was not ok.");
        }
        showOtpInput.value = true;
      } else {
        // Verify user input against locally stored OTP
        const generatedOTP = localStorage.getItem("otp");
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
