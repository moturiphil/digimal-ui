<template>
  <AuthWrapper>
    <p class="auth-notice">
      Don&rsquo;t have an account?
      <router-link to="/auth/register">Sign up now</router-link>
    </p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">
          Sign in to <span class="color-secondary">Admin</span>
        </sdHeading>
        <a-form-item name="username" label="Username or Email Address">
          <a-input type="email" v-model:value="formState.email" />
        </a-form-item>
        <a-form-item name="password" initialValue="123456" label="Password">
          <a-input
            type="password"
            v-model:value="formState.password"
            placeholder="Password"
          />
        </a-form-item>
        <div class="auth-form-action">
          <a-checkbox @change="onChange">Keep me logged in</a-checkbox>
          <router-link class="forgot-pass-link" to="/auth/forgotPassword">
            Forgot password?
          </router-link>
        </div>
        <a-form-item>
          <sdButton
            class="btn-signin"
            htmlType="submit"
            type="primary"
            size="large"
          >
            {{ isLoading ? "Loading..." : "Sign In" }}
          </sdButton>
        </a-form-item>
        <p class="form-divider">
          <span>Or</span>
        </p>
        <ul class="social-login">
          <li>
            <a class="google-signup" href="#">
              <img :src="require('@/static/img/google.png')" alt="" />
              <span>Sign in with Google</span>
            </a>
          </li>
          <li>
            <a class="facebook-sign" href="#">
              <FacebookOutlined />
            </a>
          </li>
          <li>
            <a class="twitter-sign" href="#">
              <TwitterOutlined />
            </a>
          </li>
        </ul>
        <div class="auth0-login">
          <a href="#" @click="() => lock.show()"> Sign In with Auth0 </a>
          <router-link to="/auth/fb-login">Sign In With Firebase</router-link>
        </div>
      </a-form>
    </div>
  </AuthWrapper>
</template>
<script>
import { FacebookOutlined, TwitterOutlined } from "@ant-design/icons-vue";
import { computed, reactive, ref, defineComponent } from "vue";
import { useStore } from "vuex";
import { AuthWrapper } from "./style";
import { useRouter } from "vue-router";
import { Auth0Lock } from "auth0-lock";
import { auth0options } from "@/config/auth0";
const domain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientId = process.env.VUE_APP_AUTH0_CLIENT_ID;

const SignIn = defineComponent({
  name: "SignIn",
  components: { FacebookOutlined, TwitterOutlined, AuthWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.auth.loading);
    const checked = ref(null);
    const router = useRouter();
    const handleSubmit = () => {
      router.push("/");
      dispatch("login");
    };
    const onChange = (checked) => {
      checked.value = checked;
    };
    const formState = reactive({
      email: "example@email.com",
      password: "1234565",
    });
    const lock = new Auth0Lock(clientId, domain, auth0options);
    lock.on("authenticated", (authResult) => {
      lock.getUserInfo(authResult.accessToken, (error) => {
        if (error) {
          return;
        }
        handleSubmit();
        lock.hide();
      });
    });
    return {
      isLoading,
      checked,
      handleSubmit,
      onChange,
      formState,
      lock,
    };
  },
});

export default SignIn;
</script>
