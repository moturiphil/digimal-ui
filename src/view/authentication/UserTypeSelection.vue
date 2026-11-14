<template>
  <AuthWrapper>
    <div class="auth-contents">
      <div class="header-section">
        <sdHeading as="h1">
          Welcome to <span class="color-success">DigiMal-KE</span>
        </sdHeading>
        <sdHeading as="h5">
          <span :class="envClass">{{ env }}</span>
        </sdHeading>
      </div>

      <p class="subtitle">Choose your role to continue</p>

      <div class="mobile-brand">
        <h1 class="mobile-brand-title">DigiMal-KE</h1>
        <p class="mobile-brand-tagline">National Mass Net Distribution Campaign</p>
      </div>

      <div class="user-type-container">
        <div 
          class="user-type-card" 
          @click="handleCampaignUserLogin"
          @mouseenter="hoveredCard = 'campaign'"
          @mouseleave="hoveredCard = null"
          :class="{ 'card-hovered': hoveredCard === 'campaign' }"
        >
          <div class="card-content">
            <div class="card-icon-wrapper">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
            </div>
            <div class="card-text">
              <h4>Campaign User</h4>
              <p>Manage campaigns, distributions, and administrative tasks</p>
            </div>
            <div class="card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div 
          class="user-type-card" 
          @click="handleCHPLogin"
          @mouseenter="hoveredCard = 'chp'"
          @mouseleave="hoveredCard = null"
          :class="{ 'card-hovered': hoveredCard === 'chp' }"
        >
          <div class="card-content">
            <div class="card-icon-wrapper">
              <div class="card-icon chp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div class="card-text">
              <h4>Community Health Provider</h4>
              <p>Access household services and community health management</p>
            </div>
            <div class="card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="divider">
        <span>or</span>
      </div>

      <div class="footer-section">
        <router-link class="link-primary register-link" to="/auth/register">
          New User? Register here
        </router-link>
      </div>
    </div>
  </AuthWrapper>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AuthWrapper } from "./style";
import { notification } from "ant-design-vue";
import { loadAppEnvironment } from "../../services/app-environment";

export default {
  name: "UserTypeSelection",
  components: { AuthWrapper },
  setup() {
    const router = useRouter();
    const hoveredCard = ref(null);

    // Environment descriptor for the current instance. The badge label and its
    // colour class come from the APP_STATE map in
    // services/app-environment.js (staging, development, training, ...).
    const appEnv = ref(null);
    const env = computed(() => (appEnv.value ? appEnv.value.label : ""));
    const envClass = computed(() =>
      appEnv.value ? appEnv.value.badgeClass : ""
    );

    const handleCampaignUserLogin = () => {
      router.push("/auth/campaign-login");
    };

    const handleCHPLogin = () => {
      router.push("/auth/chp-login");
    };

    const get_env = async () => {
      try {
        const appEnvironment = await loadAppEnvironment();
        if (appEnvironment.maintenance) {
          router.push("/maintenance");
          return;
        }
        appEnv.value = appEnvironment;
      } catch (error) {
        notification.error({
          message: `Error!`,
          description: `${error}`,
        });
      }
    };

    onMounted(() => {
      get_env();
    });

    return {
      handleCampaignUserLogin,
      handleCHPLogin,
      env,
      envClass,
      hoveredCard,
    };
  },
};
</script>

<style scoped>
/* Header Section */

.auth-contents {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers vertically */
  align-items: center; /* Centers horizontally */
  min-height: 100vh; /* Makes it take the full screen height */
  padding: 20px; /* Prevents edge clipping on small screens */
  box-sizing: border-box;
  text-align: center;
}

.header-section {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeInDown 0.6s ease-out;
}

.header-section h1 {
  color: #272b41;
}

.subtitle {
  color: #868eae;
  font-size: 18px;
  margin: 0 0 30px 0;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

/* User Type Container */
.user-type-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 0 30px 0;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  width: 100%;
  max-width: 600px;
}

.user-type-card {
  border: 2px solid #e8e8e8;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;
}

.user-type-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #20c997 0%, #17a589 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.user-type-card:hover::before,
.card-hovered::before {
  transform: scaleX(1);
}

.user-type-card:hover,
.card-hovered {
  border-color: #20c997;
  box-shadow: 0 8px 24px rgba(32, 201, 151, 0.2);
  transform: translateY(-4px);
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf9 100%);
}

.user-type-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px;
}

.card-icon-wrapper {
  flex-shrink: 0;
}

.card-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #e6f9f4 0%, #d1f4ea 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #20c997;
  transition: all 0.3s ease;
}

.card-icon svg {
  width: 44px;
  height: 44px;
}

.user-type-card:hover .card-icon,
.card-hovered .card-icon {
  background: linear-gradient(135deg, #20c997 0%, #17a589 100%);
  color: #fff;
  transform: scale(1.05);
}

.card-text {
  flex: 1;
  text-align: left;
}

.card-text h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #272b41;
  transition: color 0.3s ease;
}

.user-type-card:hover .card-text h4,
.card-hovered .card-text h4 {
  color: #20c997;
}

.card-text p {
  margin: 0;
  font-size: 15px;
  color: #868eae;
  line-height: 1.6;
}

.card-arrow {
  flex-shrink: 0;
  color: #d1d5db;
  transition: all 0.3s ease;
}

.card-arrow svg {
  width: 24px;
  height: 24px;
}

.user-type-card:hover .card-arrow,
.card-hovered .card-arrow {
  color: #20c997;
  transform: translateX(4px);
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 30px 0 25px 0;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e8e8e8 20%, #e8e8e8 80%, transparent 100%);
}

.divider span {
  background: #fff;
  padding: 0 15px;
  color: #868eae;
  font-size: 16px;
  position: relative;
  font-weight: 500;
}

/* Footer Section */
.footer-section {
  text-align: center;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.help-text {
  color: #868eae;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.link-wrapper {
  margin: 0;
}

.link-primary {
  color: #20c997;
  text-decoration: none;
  font-weight: 600;
  font-size: 17px;
  transition: all 0.2s ease;
  display: inline-block;
}

.link-primary:hover {
  color: #17a589;
  text-decoration: underline;
}

/* Environment badges */
.pilot-badge {
  display: inline-block;
  background: linear-gradient(90deg, #fff7e6 0%, #fff1cc 100%);
  color: #ad4e00;
  border: 1px solid #ffd591;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(250, 173, 20, 0.12);
  font-size: 15px;
}

.training-badge {
  display: inline-block;
  background: linear-gradient(90deg, #f6ffed 0%, #eafff0 100%);
  color: #237804;
  border: 1px solid #b7eb8f;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
}

.staging-badge {
  display: inline-block;
  background: linear-gradient(90deg, #e6f4ff 0%, #d6eaff 100%);
  color: #0958d9;
  border: 1px solid #91caff;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
}

.development-badge {
  display: inline-block;
  background: linear-gradient(90deg, #f9f0ff 0%, #f0e6ff 100%);
  color: #531dab;
  border: 1px solid #d3adf7;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .card-text {
    text-align: center;
  }

  .card-arrow {
    display: none;
  }

  .card-icon {
    width: 64px;
    height: 64px;
  }

  .card-icon svg {
    width: 38px;
    height: 38px;
  }

  .card-text h4 {
    font-size: 18px;
  }

  .card-text p {
    font-size: 14px;
  }

  .header-section {
    margin-bottom: 25px;
  }

  .user-type-container {
    gap: 16px;
  }

  .subtitle {
    font-size: 16px;
  }
}

@media (min-width: 992px) {
  .user-type-container {
    gap: 24px;
  }

  .card-content {
    padding: 32px;
  }
}

/* Accessibility */
.user-type-card:focus {
  outline: 2px solid #20c997;
  outline-offset: 2px;
}

.user-type-card:focus:not(:focus-visible) {
  outline: none;
}

/* ---------- Mobile: clean white layout with platform title ---------- */
.mobile-brand {
  display: none;
}

@media (max-width: 767px) {
  .auth-contents {
    flex-direction: column;
    justify-content: center;
    min-height: 100dvh;
    padding: 28px 20px 32px;
    box-sizing: border-box;
    background-color: #ffffff;
    background-image: none !important;
  }

  .mobile-brand {
    display: block;
    text-align: center;
    margin: 0 auto 26px;
  }

  .mobile-brand-title {
    margin: 0;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.15;
    color: #0b6b3a;
  }

  .mobile-brand-tagline {
    margin: 8px auto 0;
    max-width: 320px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.4;
    color: #5f8572;
  }

  .header-section,
  .subtitle,
  .divider {
    display: none;
  }

  .user-type-container {
    width: 100%;
    gap: 14px;
  }

  .user-type-card {
    background: #ffffff;
    border: 1px solid #eef2f5;
    box-shadow: 0 8px 24px rgba(9, 45, 58, 0.08);
  }

  .card-content {
    padding: 18px 16px;
  }

  .card-icon {
    width: 54px;
    height: 54px;
  }

  .card-icon svg {
    width: 30px;
    height: 30px;
  }

  .card-text h4 {
    font-size: 18px;
  }

  .card-text p {
    font-size: 14px;
    margin: 6px 0 0;
  }

  .card-arrow {
    display: none;
  }

  .footer-section {
    margin-top: 24px;
    width: 100%;
  }

  .register-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 15px 16px;
    box-sizing: border-box;
    border-radius: 12px;
    background: #ffffff;
    border: 2px solid #20c997;
    color: #20c997;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.25s ease;
  }

  .register-link:hover,
  .register-link:active {
    background: #e9fbf3;
    border-color: #17a589;
  }
}

/* Short landscape phones: keep the content in view */
@media (max-width: 767px) and (max-height: 560px) {
  .auth-contents {
    justify-content: flex-start;
  }

  .mobile-brand {
    margin-bottom: 16px;
  }
}
</style>