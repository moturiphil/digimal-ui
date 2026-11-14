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
import { clearClientCaches } from "./services/maintenance-cache";

/**
 * Periodic APP_STATE probes. A live instance is checked every 30 seconds so
 * maintenance activation is picked up quickly; while in maintenance the probe
 * is also 30 seconds so the UI recovers as soon as the backend is back.
 */
const APP_STATE_POLL_SECONDS = 30;
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
        const environment = await loadAppEnvironment({ refresh });
        const wasInMaintenance = isMaintenance.value;

        // Entering maintenance (on boot or mid-session): wipe persisted
        // identity/data caches BEFORE the maintenance screen renders, so no
        // cached page, profile or API data can be reused. The recovery watcher
        // below sends the user to sign in again once maintenance ends.
        if (environment.maintenance && !wasInMaintenance) {
          await clearClientCaches();
        }

        // Leaving maintenance: the session was wiped on entry. Navigate to the
        // login screen BEFORE the gate lifts so the previously open protected
        // route can never mount even for one frame.
        if (wasInMaintenance && !environment.maintenance) {
          const hasSession = !!sessionStorage.getItem("user");
          if (!hasSession && router.currentRoute.value.name !== "login") {
            try {
              await router.replace("/auth/login");
            } catch (err) {
              // Navigation failure (e.g. superseded) — the router guard will
              // still bounce the protected route once the gate lifts.
            }
          }
        }

        appEnv.value = environment;
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

    // Returning to a tab (focus / visibility change / bfcache restore) must
    // not leave a stale page alive: re-read APP_STATE immediately so
    // maintenance activation and its cache purge happen as soon as the user
    // looks at the app again.
    const refreshIfVisible = () => {
      if (isBootstrapping.value) return;
      if (document.visibilityState === "hidden") return;
      resolveAppState({ refresh: true });
    };

    onMounted(async () => {
      // provide('apiEndpoint', apiEndpoint)
      dispatch("firebaseAuthGetUid");
      await resolveAppState();
      scheduleNextPoll();
      window.addEventListener("focus", refreshIfVisible);
      window.addEventListener("pageshow", refreshIfVisible);
      document.addEventListener("visibilitychange", refreshIfVisible);
    });

    onBeforeUnmount(() => {
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
      window.removeEventListener("focus", refreshIfVisible);
      window.removeEventListener("pageshow", refreshIfVisible);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    });

    // When maintenance ends the session was already wiped on entry, so never
    // let the pre-maintenance protected route mount again. Send the user to
    // sign in; if a session somehow survived, land them on the dashboard.
    watch(isMaintenance, (inMaintenance, wasInMaintenance) => {
      if (!wasInMaintenance || inMaintenance) {
        return;
      }

      const hasSession = !!sessionStorage.getItem("user");
      const currentRoute = router.currentRoute.value;

      if (!hasSession) {
        if (currentRoute.name !== "login") {
          router.replace("/auth/login");
        }
        return;
      }

      if (currentRoute.name === "maintenance") {
        router.replace("/");
      }
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
