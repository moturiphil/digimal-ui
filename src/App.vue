<template>
  <!--
    Boot gate: hold the UI until APP_STATE has been resolved, so a maintenance
    instance never flashes the login screen before it is redirected.
  -->
  <div v-if="isBootstrapping" class="spin">
    <a-spin />
  </div>

  <!--
    Maintenance takeover. When APP_STATE resolves to `maintenance` the router
    view is NEVER rendered: every page, form, modal and login screen stays
    unmounted, so there is nothing a user could interact with until the
    backend reports a different state. Re-checked periodically (see setup).
  -->
  <Maintenance
    v-else-if="isMaintenance"
    :checking="isCheckingAppState"
    :poll-seconds="MAINTENANCE_RECHECK_SECONDS"
  />

  <template v-else>
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
</template>
<script>
import { ThemeProvider } from "vue3-styled-components";
import { theme } from "./config/theme/themeVariables";
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import EnvironmentWatermark from "./components/utilities/EnvironmentWatermark.vue";
import Maintenance from "./view/pages/Maintenance.vue";
import {
  getCachedAppEnvironment,
  loadAppEnvironment,
  resolveAppEnvironment,
} from "./services/app-environment";

/**
 * Periodic APP_STATE probes. Live instances are checked once a minute (the
 * value only changes when an operator switches mode); a maintenance instance
 * is rechecked every 30 seconds so the UI recovers as soon as the backend is
 * back.
 */
const APP_STATE_POLL_SECONDS = 60;
const MAINTENANCE_RECHECK_SECONDS = 30;

export default defineComponent({
  name: "App",
  components: {
    ThemeProvider,
    EnvironmentWatermark,
    Maintenance,
  },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const rtl = computed(() => state.themeLayout.rtlData);
    const isLoading = computed(() => state.themeLayout.loading);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const isFbAuthLoading = computed(() => state.firebase.loading);

    // Environment descriptor for the current instance (see the service for the
    // APP_STATE -> { watermark, tone, maintenance } mapping). Starts from the
    // shared cache so consumers agree on one value.
    const appEnv = ref(getCachedAppEnvironment());

    // Hold the router view back until the first APP_STATE probe has resolved:
    // a maintenance instance must never flash a login form it would then hide.
    const isBootstrapping = ref(true);
    const isCheckingAppState = ref(false);
    const isMaintenance = computed(
      () => !!(appEnv.value && appEnv.value.maintenance)
    );

    let pollTimer = null;

    // Only non-production environments (staging, development, training, ...)
    // carry a watermark word; everything else resolves to an empty string.
    const watermarkText = computed(() =>
      appEnv.value ? appEnv.value.watermark : ""
    );
    const watermarkTone = computed(() =>
      appEnv.value ? appEnv.value.tone : "training"
    );

    /**
     * Resolve APP_STATE. A failed probe must never lock users out: keep the
     * last known state, or behave like production on a cold boot — matching
     * the previous watermark behaviour.
     */
    const resolveAppState = async ({ refresh = false } = {}) => {
      isCheckingAppState.value = true;
      try {
        appEnv.value = await loadAppEnvironment({ refresh });
      } catch (err) {
        if (!appEnv.value) {
          appEnv.value = resolveAppEnvironment("");
        }
      } finally {
        isCheckingAppState.value = false;
        isBootstrapping.value = false;
      }
    };

    // setTimeout chain instead of setInterval so the cadence can react to the
    // resolved state (fast while in maintenance, relaxed otherwise).
    const scheduleNextPoll = () => {
      const seconds = isMaintenance.value
        ? MAINTENANCE_RECHECK_SECONDS
        : APP_STATE_POLL_SECONDS;

      pollTimer = setTimeout(async () => {
        if (document.visibilityState !== "hidden") {
          await resolveAppState({ refresh: true });
        }
        scheduleNextPoll();
      }, seconds * 1000);
    };

    onMounted(async () => {
      // provide('apiEndpoint', apiEndpoint)
      dispatch("firebaseAuthGetUid");
      await resolveAppState();
      scheduleNextPoll();
    });

    onBeforeUnmount(() => {
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    });

    // If maintenance ends while the user is parked on the standalone
    // /maintenance route (e.g. an auth screen redirected them there), move on
    // to the real landing page. When App.vue itself took over, the route was
    // never changed, so the user simply lands back on the page they opened.
    watch(isMaintenance, (inMaintenance, wasInMaintenance) => {
      if (!wasInMaintenance || inMaintenance) {
        return;
      }
      if (router.currentRoute.value.name !== "maintenance") {
        return;
      }
      const hasSession = !!sessionStorage.getItem("user");
      router.replace(hasSession ? "/" : "/auth/login");
    });

    return {
      theme,
      rtl,
      darkMode,
      topMenu,
      isLoading,
      isFbAuthLoading,
      appEnv,
      isBootstrapping,
      isCheckingAppState,
      isMaintenance,
      watermarkText,
      watermarkTone,
      MAINTENANCE_RECHECK_SECONDS,
    };
  },
});
</script>
