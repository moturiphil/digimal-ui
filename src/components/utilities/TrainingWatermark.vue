<template>
  <!--
    Full-screen, click-through watermark used to mark non-production
    (training) instances. Rendered once from App.vue so it overlays EVERY
    page, including the auth screens and modals. It is only mounted when the
    backend reports APP_STATE=training (see App.vue / GET /app_env).
  -->
  <div class="training-watermark" :class="{ 'is-dark': dark }" aria-hidden="true">
    <div class="training-watermark__grid">
      <span
        v-for="n in 30"
        :key="n"
        class="training-watermark__text"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingWatermark",
  props: {
    // The word/phrase stamped across the page.
    text: {
      type: String,
      default: "TRAINING",
    },
    // Whether the platform is in dark mode, so the watermark stays visible.
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.training-watermark {
  position: fixed;
  inset: 0;
  /* Above page content and Ant Design modals/dropdowns (z-index ~1000),
     but click-through so it never blocks interaction. */
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.training-watermark__grid {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220vmax;
  display: flex;
  flex-wrap: wrap;
  gap: 48px 72px;
  transform: translate(-50%, -50%) rotate(-30deg);
  justify-content: center;
  align-content: center;
}

.training-watermark__text {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 10px;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(21, 105, 60, 0.08);
  user-select: none;
}

/* Keep the watermark subtle but legible in dark mode. */
.theme-dark .training-watermark__text {
  color: rgba(255, 255, 255, 0.08);
}
</style>
