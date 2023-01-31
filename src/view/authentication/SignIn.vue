<template>
  <div>
    <form @submit.prevent="login" class="auth-contents">
      <p class="auth-notice">
        Don&rsquo;t have an account?
        <router-link to="/auth/register">Sign up now</router-link>
      </p>
      <h3>
        Sign in to <span class="color-success">Campaign Dashboard</span>
      </h3>
      <label>ID No</label>
      <input type="number" v-model.number="user.id_no" class="a-input" />
      <label>Password</label>
      <input
        type="password"
        v-model="user.password"
        placeholder="Password"
        class="a-input"
      />
      <div class="auth-form-action">
        <input type="checkbox" v-model="checked" @change="onChange" />
        Keep me logged in
        <router-link class="forgot-pass-link" to="/auth/forgotPassword">
          Forgot password?
        </router-link>
      </div>
      <button class="btn-signin" :loading="isLoading" type="submit">
        Sign In
      </button>
      <p class="form-divider"></p>
    </form>
  </div>
</template>

<!-- <template>
  <div>
    <form @submit.prevent="login" class="auth-contents">
      <p class="auth-notice">
        Don&rsquo;t have an account?
        <router-link to="/auth/register">Sign up now</router-link>
      </p>
      <h3>
        Sign in to <span class="color-success">Campaign Dashboard</span>
      </h3>
      <label>ID No</label>
      <a-input type="number" v-model.number="user.id_no" class="a-input" />
      <label>Password</label>
      <a-input
        type="password"
        v-model="user.password"
        placeholder="Password"
        class="a-input"
      />
      <div class="auth-form-action">
        <a-checkbox v-model="checked" @change="onChange">Keep me logged in</a-checkbox>
        <router-link class="forgot-pass-link" to="/auth/forgotPassword">
          Forgot password?
        </router-link>
      </div>
      <a-button class="btn-signin" :loading="isLoading" type="submit">
        Sign In
      </a-button>
      <p class="form-divider"></p>
    </form>
  </div>
</template> -->


<script>
import AuthService from '../../services/auth.service';
import { mapActions } from 'vuex';
// import { computed, reactive, ref, defineComponent } from "vue";
// import { useStore } from "vuex";
// import { AuthWrapper } from "./style";
// import { useRouter } from "vue-router";
// import { Auth0Lock } from "auth0-lock";
// import { auth0options } from "@/config/auth0";

export default {
  data() {
    return {
      isLoading: false,
      user: {
        id_no: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions(['setUser']),
    async login() {
      try {
        AuthService.login(this.user)
        .then(response => {
            console.log(response.data.token);
            this.setUser(response.data.user);
            this.$router.push('/');
        })
        .catch(error => {
            console.log(error);
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>



<!-- <template>
  <AuthWrapper>
    <p class="auth-notice">
      Don&rsquo;t have an account?
      <router-link to="/auth/register">Sign up now</router-link>
    </p>
    <div class="auth-contents">
      <a-form @finish="handleSubmit" :model="formState" layout="vertical">
        <sdHeading as="h3">
          Sign in to <span class="color-secondary">Campaign Dashboard</span>
        </sdHeading>
        <a-form-item name="username" label="Id No">
          <a-input type="number" v-model:value="formState.email" />
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
        <div class="auth0-login">
          <a href="#" @click="() => lock.show()"> Sign In with Auth0 </a>
          <router-link to="/auth/fb-login">Sign In With Firebase</router-link>
        </div>
      </a-form>
    </div>
  </AuthWrapper>
</template>
<script>
// import { FacebookOutlined, TwitterOutlined } from "@ant-design/icons-vue";
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
  components: {  AuthWrapper },
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
      email: "34401122",
      password: "admin123",
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
</script> -->

