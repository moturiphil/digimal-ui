<template>
  <a-row class="professional-layout">
    <a-col :xxl="8" :xl="9" :lg="12" :md="8" :xs="24">
      <Aside class="aside-container">
        <div class="auth-side-content">
          <br />
          <br />
          <h1 class="dashboard-heading">DigiMal-KE</h1>
          <Content class="content-container">
            <img
              class="auth-content-figure"
              :src="require('@/static/img/auth/kenya_coat_of_arms.png')"
              alt="Coat of Arms"
            />
            <br />
            <br />
            <br />
            <br />
            <img
              :style="{ width: '200px' }"
              :src="require('@/static/img/PMI_logo.svg')"
              alt="PMI Logo"
              class="logo"
            />
            &nbsp;
            &nbsp;
            <img
              :style="{ width: '200px' }"
              :src="require('@/static/img/auth/global-fund.png')"
              alt="GF Logo"
              class="logo"
            />
            <br />
            <br />
            <br />
            <br />
            <img
              :style="{ width: '400px' }"
              :src="require('@/static/img/auth/dnmp.png')"
              alt="DNMP Logo"
              class="logo"
            />
          </Content>
        </div>
      </Aside>
    </a-col>

    <a-col :xxl="16" :xl="15" :lg="12" :md="16" :xs="24">
      <router-view class="router-view"></router-view>
    </a-col>
  </a-row>
</template>
<script>
import { Aside, Content } from "./style";

const AuthLayout = {
  name: "AuthLayout",
  components: { Aside, Content },
};

export default AuthLayout;
</script>

<style scoped>
.professional-layout {
  /* Add any layout-specific styles here */
}

.aside-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
}

.auth-side-content {
  text-align: center;
}

/* .topShape,
.bottomShape {
  display: block;
  margin: 0 auto;
} */

.content-container {
  margin-top: 20px;
}

.logo {
  margin-bottom: 20px;
}

.heading {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.auth-content-figure {
  max-width: 100%;
  height: auto;
}

.router-view {
  padding: 20px;
}

.dashboard-heading {
  font-size: 36px; /* Larger font size for emphasis */
  font-weight: 700; /* Bold font weight */
  color: #333; /* Dark color for contrast */
  text-align: center; /* Center-align the heading */
  margin: 20px 0; /* Add vertical spacing */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-family: 'Arial', sans-serif; /* Clean and professional font */
}

</style>
