import app from "./config/configApp";
import router from "./routes/protectedRoute";
import store from "@/vuex/store";
import "./static/css/style.css";
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

app.config.productionTip = false;
app.use(store);
app.use(router);
app.use(HighchartsVue);
app.mount("#app");

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
