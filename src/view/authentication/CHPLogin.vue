<template>
  <AuthWrapper>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">Login as CHP?</sdHeading>
        <p class="forgot-text">
          Enter your ID No you used to register via USSD and we’ll send you OTP
          to complete login.
        </p>
        <a-form-item label="ID No" name="id_no">
          <a-input
            type="number"
            v-model:value="formState.id_no"
            placeholder="Enter ID number"
            required
          />
        </a-form-item>
        <a-form-item v-if="showOtpInput" label="OTP" name="otp">
          <a-input
            type="text"
            v-model:value="formState.otp"
            placeholder="Enter OTP"
            required
          />
        </a-form-item>
        <a-form-item>
          <sdButton
            class="btn-reset"
            htmlType="submit"
            type="success"
            size="small"
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
import { notification } from "ant-design-vue";

export default {
  name: "Register",
  components: { AuthWrapper },
  data() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/mobile_verify_id`;
    const VALIDATE_URL = `${process.env.VUE_APP_BASE_URL}/mobile_verify_otp`;
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      otp: "",
    });
    const showOtpInput = ref(false);

    const handleSubmit = async () => {
      if (!showOtpInput.value) {
        const values = {
          id_no: formState.id_no,
        };

        try {
          const response = await axios.post(API_URL, values);
          console.log(response);
          notification.info({
            message: "Confirmation",
            description: response.data.message,
          });

          if (
            response.status === 200 ||
            response.status === 226 ||
            response.status === 201
          ) {
            sessionStorage.setItem("id_no", values.id_no);
          } else {
            notification.error({
              message: "Error",
              description: response.data.message,
            });
            throw new Error("Network response was not ok.");
          }
          showOtpInput.value = true;
        } catch (error) {
          console.log(error.message);
          if (error.message == "Request failed with status code 403") {
            notification.error({
              message: "Error",
              description: "User not allowed to create portal account",
            });
          } else if (error.message == "Request failed with status code 401") {
            notification.info({
              message: "Info",
              description:
                "Your account is fully setup, please login using your ID number and password.",
            });
          } else {
            notification.info({
              message: "Info",
              description:
                "You are not a registered user, please contact the technical support team.",
            });
          }
        }
      } else {
        // Verify user input against sessionly stored OTP
        // const generatedOTP = sessionStorage.getItem("otp");
        const userOTP = formState.otp;
        sessionStorage.setItem("otp", userOTP);
        console.log(userOTP);
        // console.log(generatedOTP);
        if (userOTP) {
          console.log("executing");
          const values = {
            otp: formState.otp,
          };
          const response = await axios.post(VALIDATE_URL, values);
          sessionStorage.setItem("user", JSON.stringify(response.data));
           router.push("/add-household");
          console.log('Before Response'+ response);
          notification.info({
            message: "Log in successfully",
            description: response.message,
          });

         
        } else {
          console.log("OTP does not match");
          notification.info({
            message: "Info",
            description: "OTP mismatch",
          });
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
