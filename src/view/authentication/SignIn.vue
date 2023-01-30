<!-- <template>
  <div>
    <form @submit.prevent="login">
      <input type="text" v-model="user.id_no" placeholder="ID Number" />
      <input type="password" v-model="user.password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  </div>
</template> -->
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

<script>
import AuthService from '../../services/auth.service';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
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
          Sign in to <span class="color-success">Campaign Dashboard</span>
        </sdHeading>
        <a-form-item name="id_no" label="ID No">
          <a-input type="number" v-model.number="formState.id_no" />
        </a-form-item>
        <a-form-item name="password" label="Password">
          <a-input
            type="password"
            v-model="formState.password"
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
import { computed, ref, reactive, onMounted } from "vue";
import AuthService from "../../services/auth.service";
import { useRouter } from "vue-router";
import store from "../../vuex/store";

export default {
  name: "SignIn",
  setup() {
    const isLoading = computed(() => store.state.auth.loading);
    const checked = ref(null);
    const router = useRouter();
    const formState = reactive({
      id_no: "",
      password: "",
    });
    const handleSubmit = async () => {
      try {
        const response = await AuthService.login({
          id_no: formState.id_no,
          password: formState.password,
        });
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data.token));
          store.dispatch("auth/login", {
            user: {
              id_no: formState.id_no,
              password: formState.password,
            },
          });
          router.push({ path: "/" });
        }
      } catch (error) {
        console.log(error);
      }
    };
    const status = computed(() => store.state.auth.status);
    onMounted(() => {
      // if (status.value.loggedIn) {
        console.log(status.value.loggedIn);
      if (status.value.loggedIn) {
        console.log("logged in", status.value.loggedIn);
        router.push({ path: "/" });
      }
    });
    return {
      isLoading,
      checked,
      handleSubmit,
      formState,
    };
  },
};
</script> -->
