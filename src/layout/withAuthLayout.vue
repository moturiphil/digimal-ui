<template>
  <a-row class="professional-layout">
    <!-- Aside Section - ~60% width, full-bleed campaign photos -->
    <a-col :xxl="14" :xl="14" :lg="14" :md="9" :xs="24" class="aside-col">
      <Aside class="aside-container">
        <!-- Full-bleed beneficiary campaign photo slider -->
        <div
          class="photo-slider"
          @mouseenter="pauseSlider"
          @mouseleave="resumeSlider"
        >
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="slider-slide"
            :class="{ active: i === activeSlide }"
          >
            <img class="slider-img" :src="slide.src" :alt="slide.caption" />
          </div>
        </div>

        <!-- Overlaid content -->
        <div class="side-inner">
          <div class="brand-block">
            <h1 class="dashboard-heading">DigiMal-KE</h1>
            <p class="brand-tagline">National Mass Net Distribution Campaign</p>
          </div>

          <div class="partners-panel">
            <p class="partners-label">With appreciation to</p>
            <div class="logo-grid">
              <div class="logo-tile">
                <img class="logo-img" :src="coatOfArms" alt="The Government of Kenya" />
              </div>
              <div class="logo-tile">
                <img class="logo-img" :src="mohLogo" alt="Ministry of Health Kenya" />
              </div>
              <div class="logo-tile">
                <img class="logo-img" :src="gfLogo" alt="The Global Fund" />
              </div>
              <div class="logo-tile logo-tile-wide">
                <img
                  class="logo-img"
                  :src="dhaLogo"
                  alt="Digital Health Agency — Digital Health"
                />
              </div>
            </div>
            <div class="slider-dots">
              <button
                v-for="(s, i) in slides"
                :key="'dot-' + i"
                class="slider-dot"
                :class="{ on: i === activeSlide }"
                :aria-label="'View slide ' + (i + 1)"
                @click="goToSlide(i)"
              ></button>
            </div>
          </div>
        </div>
      </Aside>
    </a-col>

    <!-- Form Section -->
    <a-col :xxl="10" :xl="10" :lg="10" :md="15" :xs="24">
      <router-view class="router-view"></router-view>
    </a-col>
  </a-row>
</template>
<script>
import { Aside } from "./style";
import coatOfArms from "@/static/img/auth/kenya_coat_of_arms.png";
import mohLogo from "@/static/img/auth/GOK.png";
import nmcpLogo from "@/static/img/auth/dnmp.png";
import gfLogo from "@/static/img/auth/global-fund.png";
import dhaLogo from "@/static/img/auth/dha-logo.png";
import vihiga from "@/static/img/auth/campaign/campaign-vihiga.jpg";
import homabayBeneficiary from "@/static/img/auth/campaign/campaign-homabay-beneficiary.jpg";
import homabayLaunch from "@/static/img/auth/campaign/campaign-homabay-launch.jpg";
import beneficiaries1 from "@/static/img/auth/campaign/campaign-beneficiaries-1.jpg";
import beneficiaries2 from "@/static/img/auth/campaign/campaign-beneficiaries-2.jpg";

const AuthLayout = {
  name: "AuthLayout",
  components: { Aside },
  data() {
    return {
      activeSlide: 0,
      slideTimer: null,
      slides: [
        { src: vihiga, caption: "LLIN issuance — Vihiga County" },
        { src: homabayBeneficiary, caption: "Reaching every beneficiary — Homa Bay" },
        { src: homabayLaunch, caption: "Mass Net Distribution launch — Homa Bay" },
        { src: beneficiaries1, caption: "Communities at the heart of the campaign" },
        { src: beneficiaries2, caption: "From our recent mass campaign" },
      ],
      coatOfArms,
      mohLogo,
      nmcpLogo,
      gfLogo,
      dhaLogo,
    };
  },
  mounted() {
    this.startSlider();
  },
  beforeUnmount() {
    this.stopSlider();
  },
  methods: {
    startSlider() {
      this.stopSlider();
      this.slideTimer = setInterval(() => {
        this.activeSlide = (this.activeSlide + 1) % this.slides.length;
      }, 4500);
    },
    stopSlider() {
      if (this.slideTimer) {
        clearInterval(this.slideTimer);
        this.slideTimer = null;
      }
    },
    pauseSlider() {
      this.stopSlider();
    },
    resumeSlider() {
      this.startSlider();
    },
    goToSlide(i) {
      this.activeSlide = i;
      this.startSlider();
    },
  },
};

export default AuthLayout;
</script>
<style scoped>
.professional-layout {
  min-height: 100vh;
  overflow-x: hidden;
}

/* ---------- Left side panel: full-bleed photo slider ---------- */
.aside-container {
  position: relative;
  overflow: hidden !important;
  height: 100vh;
  background: #01c911 !important;
  border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Photos cover the entire panel */
.photo-slider {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.slider-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.9s ease;
  pointer-events: none;
}

.slider-slide.active {
  opacity: 1;
  pointer-events: auto;
}

.slider-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Blend photos subtly into the campaign green */
.slider-slide::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(1, 201, 17, 0.08);
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Scrim so the overlaid text stays readable over any photo */
.photo-slider::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 58, 4, 0.62) 0%,
    rgba(0, 0, 0, 0.16) 32%,
    rgba(0, 0, 0, 0.14) 55%,
    rgba(0, 46, 3, 0.72) 100%
  );
  pointer-events: none;
}

/* Overlaid content layers */
.side-inner {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 30px 26px;
  animation: sideIn 0.6s ease-out both;
}

/* Brand */
.brand-block {
  text-align: center;
  align-self: center;
  margin: 0 auto 36px;
}

.dashboard-heading {
  margin: 0 auto;
  display: block;
  font-size: 54px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;
  color: #ffffff;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.brand-tagline {
  margin: 8px auto 0;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.3px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.96);
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Partners panel (frosted white card for maximum logo visibility) */
.partners-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
  padding: 22px 24px 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
}

.partners-label {
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #0b6b3a;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  width: 100%;
}

.logo-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 120px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(13, 94, 50, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: logoIn 0.55s ease-out both;
}

.logo-tile:nth-child(2) {
  animation-delay: 0.08s;
}

.logo-tile:nth-child(3) {
  animation-delay: 0.16s;
}

.logo-tile:nth-child(4) {
  animation-delay: 0.24s;
}

.logo-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
}

.logo-tile .logo-img {
  max-width: 104px;
  max-height: 104px;
  object-fit: contain;
}

.logo-tile-wide {
  grid-column: 1 / -1;
  height: 104px;
}

.logo-tile-wide .logo-img {
  max-width: 440px;
  max-height: 86px;
}

.slider-dots {
  display: inline-flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.18);
}

.slider-dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.28);
  cursor: pointer;
  transition: all 0.25s ease;
}

.slider-dot.on {
  background: #0b6b3a;
  transform: scale(1.25);
}

@keyframes logoIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Animations */
@keyframes sideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Responsive */
@media (max-width: 1199px) {
  .side-inner {
    padding: 30px 28px 26px;
  }

  .dashboard-heading {
    font-size: 46px;
  }

  .brand-tagline {
    font-size: 16px;
  }
}

@media (max-width: 991px) {
  .side-inner {
    padding: 26px 22px 22px;
  }

  .dashboard-heading {
    font-size: 40px;
  }

  .brand-tagline {
    font-size: 15px;
  }

  .brand-block {
    margin-bottom: 24px;
  }

  .partners-panel {
    padding: 16px 16px 14px;
    max-width: 460px;
  }

  .logo-tile {
    height: 96px;
  }

  .logo-tile .logo-img {
    max-width: 84px;
    max-height: 84px;
  }

  .logo-tile-wide {
    height: 84px;
  }

  .logo-tile-wide .logo-img {
    max-width: 320px;
    max-height: 66px;
  }

  .slider-dots {
    margin-top: 12px;
  }
}

@media (max-width: 767px) {
  /* On phones the shared photo panel is replaced by the mobile
     "splash" experience on the user-type selection page. */
  .aside-col {
    display: none;
  }

  .router-view {
    padding: 12px 8px;
  }
}

@media (max-height: 720px) and (min-width: 769px) {
  .side-inner {
    padding-top: 22px;
    padding-bottom: 18px;
  }

  .brand-block {
    margin-bottom: 22px;
  }

  .partners-panel {
    margin-top: 24px;
    padding: 14px 14px 12px;
  }

  .logo-tile {
    height: 86px;
  }

  .logo-tile .logo-img {
    max-width: 74px;
    max-height: 74px;
  }

  .logo-tile-wide {
    height: 74px;
  }

  .logo-tile-wide .logo-img {
    max-width: 290px;
    max-height: 58px;
  }

  .slider-dots {
    margin-top: 12px;
  }

  .partners-label {
    margin-bottom: 8px;
  }
}

.router-view {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
</style>