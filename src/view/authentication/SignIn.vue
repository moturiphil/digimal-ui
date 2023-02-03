<template>
  <AuthWrapper>
    <p class="auth-notice">
      Don&rsquo;t have an account?
      <router-link to="/auth/register">Sign up now</router-link>
    </p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">
          Sign in to <span class="color-success">Campaign Dashboard</span>
        </sdHeading>
        <a-form-item name="id_no" label="ID No">
          <a-input type="number" v-model:value="formState.id_no" />
        </a-form-item>
        <a-form-item name="password" initialValue="admin123" label="Password">
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
          <router-link class="forgot-pass-link" to="/auth/forgotPassword">
            Forgot password?
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
    </div>
  </AuthWrapper>
</template>
<script>
import { computed, ref, reactive } from "vue";
// import { mapState } from 'vuex'
import AuthService from "../../services/auth.service";
import { useRouter } from "vue-router";
import { AuthWrapper } from "./style";
import store from "../../vuex/store";
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
      
      // console.log("****************Sign In ")
      // console.log(formState.id_no);
      // console.log(formState.password);
      
      const response = await AuthService.login({
        id_no: formState.id_no,
        password: formState.password,
      });
      if (response.status == 200) {
          console.log(response.status);
          console.log("res ............................");
      
      try{
          router.push({path:"/"});
      }catch(e){
          console.log(e);
      }
      
      }else{
          router.push('/auth/login')
      }
    };
  //   const status = computed(() => store.state.auth.status);
  //   onMounted(() => {
  //     if (status.value.loggedIn) {
  //       console.log("logged in", status.value.loggedIn);
  //       router.push({ path: "/" });
  //     }
  //   });
    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
    };
  },
};
</script>