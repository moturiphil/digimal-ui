import app from "./config/configApp";
import router from "./routes/protectedRoute";
import store from "@/vuex/store";
import { startAccessSync } from "./services/access-sync";
import "./static/css/style.css";
import "./static/css/org-units-theme.css";
// Vue 3rd party plugins
import "@/core/plugins/ant-design";
import "@/core/plugins/fonts";
import "@/core/plugins/maps";
import "@/core/plugins/masonry";
import "@/core/plugins/apexcharts";
import "@/core/components/custom";
import "@/core/components/style";
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import highcharts3d from 'highcharts/highcharts-3d'; // Import the 3D module
import exporting from 'highcharts/modules/exporting'; // Import the exporting module
import exportData from 'highcharts/modules/export-data'; // Import the export-data module
import accessibility from 'highcharts/modules/accessibility'; // Import the accessibility module


// Initialize the additional modules
highcharts3d(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
accessibility(Highcharts);

// Suppress ResizeObserver errors globally (benign warnings from UI libraries)
// This must be done before mounting the app
const resizeObserverErrorHandler = (event) => {
  if (
    event.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    event.message === 'ResizeObserver loop limit exceeded' ||
    event.reason?.message === 'ResizeObserver loop completed with undelivered notifications.'
  ) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
};

// Capture in both error and unhandledrejection
window.addEventListener('error', resizeObserverErrorHandler, true);
window.addEventListener('unhandledrejection', resizeObserverErrorHandler, true);

// Override ResizeObserver to catch errors at the source
const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
};

// Also suppress unhandled errors of the same type
const originalConsoleError = console.error;
console.error = function(...args) {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('ResizeObserver') || args[0].includes('ResizeObserver loop'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

app.config.productionTip = false;
app.use(store);
app.use(router);
app.use(HighchartsVue);
app.mount("#app");

// Keep the cached RBAC snapshot (role + permissions) in sync with the backend
// so permission grants/revocations apply without a forced re-login.
startAccessSync();

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
