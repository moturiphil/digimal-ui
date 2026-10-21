<template>
  <!--
    Full-screen, click-through watermark used to mark non-production
    instances (staging, development, training, ...). Rendered once from App.vue
    so it overlays EVERY page, including the auth screens and modals. It is
    only mounted when the backend reports a watermarked APP_STATE (see App.vue
    and services/app-environment.js).
  -->
  <div
    class="env-watermark"
    :class="[`is-${tone}`, { 'is-dark': dark }]"
    aria-hidden="true"
  >
    <div class="env-watermark__grid">
      <span v-for="n in 30" :key="n" class="env-watermark__text">
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnvironmentWatermark",
  props: {
    // The word/phrase stamped across the page, e.g. "STAGING" / "DEVELOPMENT".
    text: {
      type: String,
      default: "TRAINING",
    },
    // Environment colour key (training | staging | development | ...) so each
    // non-production environment is visually distinguishable. The value comes
    // from services/app-environment.js.
    tone: {
      type: String,
      default: "training",
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
.env-watermark {
  position: fixed;
  inset: 0;
  /* Above page content and Ant Design modals/dropdowns (z-index ~1000),
     but click-through so it never blocks interaction. */
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.env-watermark__grid {
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

.env-watermark__text {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 10px;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
}

/* One tint per environment, so the watermark identifies which non-production
   instance you are looking at. The colours mirror the env badges rendered on
   the auth pages (see view/authentication/*.vue). */
.env-watermark.is-training .env-watermark__text {
  color: rgba(21, 105, 60, 0.08); /* green */
}

.env-watermark.is-staging .env-watermark__text {
  color: rgba(9, 88, 217, 0.1); /* blue */
}

.env-watermark.is-development .env-watermark__text {
  color: rgba(83, 29, 171, 0.1); /* violet */
}

/* Keep the watermark subtle but legible in dark mode. Declared last so it wins
   over the per-environment tints (same specificity, later in source order). */
.env-watermark.is-dark .env-watermark__text,
.theme-dark .env-watermark__text {
  color: rgba(255, 255, 255, 0.08);
}
</style>
