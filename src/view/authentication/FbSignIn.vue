<template>
  <AuthWrapper>
    <p class="auth-notice">
      Don&rsquo;t have an account? <router-link to="/auth/fb-register">Sign up now</router-link>
    </p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3"> Sign in to <span class="color-secondary">Admin</span> </sdHeading>
        <a-form-item name="username" label="Username or Email Address">
          <a-input type="email" v-model:value="formState.username" />
        </a-form-item>
        <a-form-item name="password" initialValue="123456" label="Password">
          <a-input type="password" v-model:value="formState.password" placeholder="Password" />
        </a-form-item>
        <div class="auth-form-action">
          <a-checkbox @change="onChange">Keep me logged in</a-checkbox>
          <router-link class="forgot-pass-link" to="/auth/forgotPassword">
            Forgot password?
          </router-link>
        </div>
        <a-form-item>
          <sdButton class="btn-signin" htmlType="submit" type="primary" size="large">
            {{ isLoading ? 'Loading...' : 'Sign In' }}
          </sdButton>
        </a-form-item>
        <p class="form-divider">
          <span>Or</span>
        </p>
        <ul class="social-login">
          <li>
            <a @click="() => dispatch('firebaseAuthLoginWithGoogle')" class="google-signup" href="#">
              <img :src="require('@/static/img/google.png')" alt="" />
              <span>Sign in with Google</span>
            </a>
          </li>
          <li>
            <a @click="() => dispatch('firebaseAuthLoginWithFacebook')" class="facebook-sign" href="#">
              <FacebookOutlined />
            </a>
          </li>
          <li>
            <a class="twitter-sign" href="#">
              <TwitterOutlined />
            </a>
          </li>
        </ul>
      </a-form>
    </div>
  </AuthWrapper>
</template>
<script>
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons-vue';
import { computed, reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { AuthWrapper } from './style';
import { useRouter } from 'vue-router';

const SignIn = {
  name: 'SignIn',
  components: { FacebookOutlined, TwitterOutlined, AuthWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.firebase.loading);
    const uid = computed(() => state.firebase.uid);
    const checked = ref(null);
    const router = useRouter();

    const handleSubmit = value => {
      dispatch('firebaseAuthLogin', { data: value });
    };

    const handleFbLogin = () => {
      router.push('/');
      dispatch('login');
    };

    watchEffect(() => {
      if (uid.value) {
        handleFbLogin();
      }
    });

    const onChange = checked => {
      checked.value = checked;
    };

    const formState = reactive({
      username: '',
      password: '',
    });

    return {
      isLoading,
      checked,
      handleSubmit,
      onChange,
      formState,
      dispatch,
    };
  },
};

export default SignIn;
</script>
