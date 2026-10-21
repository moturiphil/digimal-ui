<template>
  <div v-if="isLoading" class="spin">
    <a-spin />
  </div>
  <ThemeProvider
    v-else
    :theme="{
      ...theme,
      rtl,
      topMenu,
      darkMode,
    }"
  >
    <Suspense>
      <template #default>
        <router-view></router-view>
      </template>
      <template #fallback>
        <div class="spin">
          <a-spin />
        </div>
      </template>
    </Suspense>
  </ThemeProvider>

  <!--
    Non-production watermark. Rendered on EVERY page (this is the app root)
    whenever the backend reports a watermarked APP_STATE via GET /app_env
    (staging, development, training, ...) — see services/app-environment.js.
  -->
  <EnvironmentWatermark
    v-if="watermarkText"
    :text="watermarkText"
    :tone="watermarkTone"
    :dark="darkMode"
  />
</template>
<script>
import { ThemeProvider } from "vue3-styled-components";
import { theme } from "./config/theme/themeVariables";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import EnvironmentWatermark from "./components/utilities/EnvironmentWatermark.vue";
import { fetchAppEnvironment } from "./services/app-environment";

export default defineComponent({
  name: "App",
  components: {
    ThemeProvider,
    EnvironmentWatermark,
  },
  setup() {
    const { state, dispatch } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const isLoading = computed(() => state.themeLayout.loading);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const isFbAuthLoading = computed(() => state.firebase.loading);

    // Environment descriptor for the current instance (see the service for the
    // APP_STATE -> { watermark, tone, ... } mapping). Falls back to production
    // so a failed probe simply renders no watermark.
    const appEnv = ref(null);

    // Only non-production environments (staging, development, training, ...)
    // carry a watermark word; everything else resolves to an empty string.
    const watermarkText = computed(() =>
      appEnv.value ? appEnv.value.watermark : ""
    );
    const watermarkTone = computed(() =>
      appEnv.value ? appEnv.value.tone : "training"
    );

    const loadAppState = async () => {
      try {
        appEnv.value = await fetchAppEnvironment();
      } catch (err) {
        // Never block the app if the env probe fails — default to no watermark.
        appEnv.value = null;
      }
    };

    onMounted(() => {
      // provide('apiEndpoint', apiEndpoint)
      dispatch("firebaseAuthGetUid");
      loadAppState();
    });

    return {
      theme,
      rtl,
      darkMode,
      topMenu,
      isLoading,
      isFbAuthLoading,
      appEnv,
      watermarkText,
      watermarkTone,
    };
  },
});
</script>
