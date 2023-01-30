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

