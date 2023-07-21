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

app.config.productionTip = false;
app.use(store);
app.use(router);
app.mount("#app");

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
