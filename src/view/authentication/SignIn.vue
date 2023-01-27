<template>
  <div>
    <form @submit.prevent="login">
      <input type="text" v-model="user.id_no" placeholder="ID Number" />
      <input type="password" v-model="user.password" placeholder="Password" />
      <button type="submit">Sign In</button>
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

