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
    whenever the backend reports APP_STATE=training via GET /app_env.
  -->
  <TrainingWatermark v-if="isTraining" :dark="darkMode" />
</template>
<script>
import { ThemeProvider } from "vue3-styled-components";
import { theme } from "./config/theme/themeVariables";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import TrainingWatermark from "./components/utilities/TrainingWatermark.vue";

export default defineComponent({
  name: "App",
  components: {
    ThemeProvider,
    TrainingWatermark,
  },
  setup() {
    const { state, dispatch } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const isLoading = computed(() => state.themeLayout.loading);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const isFbAuthLoading = computed(() => state.firebase.loading);

    // Training watermark flag — driven by the backend APP_STATE env var.
    const isTraining = ref(false);

    const loadAppState = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/app_env`
        );
        const appState = String(data ?? "").trim().toLowerCase();
        isTraining.value = appState === "training";
      } catch (err) {
        // Never block the app if the env probe fails — default to no watermark.
        isTraining.value = false;
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
      isTraining,
    };
  },
});
</script>
