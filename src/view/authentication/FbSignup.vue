<template>
  <AuthWrapper>
    <p class="auth-notice">Already have an account? <router-link to="/auth/fb-login">Sign In</router-link></p>
    <div class="auth-contents">
      <a-form name="register" :model="formState" @finish="handleSubmit" layout="vertical">
        <sdHeading as="h3"> Sign Up to <span class="color-secondary">Admin</span> </sdHeading>
        <a-form-item label="Name" name="name">
          <a-input v-model:value="formState.name" placeholder="Full name" />
        </a-form-item>
        <a-form-item name="username" label="Username">
          <a-input v-model:value="formState.username" placeholder="Username" />
        </a-form-item>
        <a-form-item name="email" label="Email Address">
          <a-input type="email" v-model:value="formState.email" placeholder="name@example.com" />
        </a-form-item>
        <a-form-item label="Password" name="password">
          <a-input type="password" v-model:value="formState.password" placeholder="Password" />
        </a-form-item>
        <div class="auth-form-action">
          <a-checkbox v-model:checked="checked" @change="onChange">
            Creating an account means you’re okay with our Terms of Service and Privacy Policy
          </a-checkbox>
        </div>
        <a-form-item>
          <sdButton class="btn-create" htmlType="submit" type="primary" size="large">
            {{ isLoading ? 'Loading...' : 'Create Account' }}
          </sdButton>
        </a-form-item>
        <p class="form-divider">
          <span>Or</span>
        </p>
        <ul class="social-login signin-social">
          <li>
            <a @click="() => dispatch('firebaseAuthLoginWithGoogle')" class="google-signup" href="#">
              <img :src="require('@/static/img/google.png')" alt="" />
              <span>Sign up with Google</span>
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
import { AuthWrapper } from './style';
import { computed, reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const SignUp = {
  name: 'SignUp',
  components: { FacebookOutlined, TwitterOutlined, AuthWrapper },
  setup() {
    const values = ref(null);
    const checked = ref(null);
    const router = useRouter();
    const uid = computed(() => state.firebase.uid);
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.firebase.loading);

    const handleFbLogin = () => {
      router.push('/');
      dispatch('login');
    };

    watchEffect(() => {
      if (uid.value) {
        handleFbLogin();
      }
    });

    const handleSubmit = value => {
      values.value = value;
      dispatch('firebaseAuthSignUp', { ...values.value, terms: checked.value });
    };

    const onChange = e => {
      checked.value = e.target.checked;
    };
    const formState = reactive({
      name: '',
      username: '',
      email: '',
      password: '',
    });
    return {
      onChange,
      handleSubmit,
      formState,
      checked,
      isLoading,
    };
  },
};

export default SignUp;
</script>
