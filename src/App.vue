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
</template>
<script>
import { ThemeProvider } from "vue3-styled-components";
import { theme } from "./config/theme/themeVariables";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { provide } from "vue";

export default defineComponent({
  name: "App",
  components: {
    ThemeProvider,
  },
  setup() {
    const { state, dispatch } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const isLoading = computed(() => state.themeLayout.loading);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const isFbAuthLoading = computed(() => state.firebase.loading);

    const apiEndpoint = 'https://127.0.0.1:8000/api/'

    provide('apiEndpoint', apiEndpoint)

    onMounted(() => {
      // provide('apiEndpoint', apiEndpoint)
      dispatch("firebaseAuthGetUid");
    });

    return {
      theme,
      rtl,
      darkMode,
      topMenu,
      isLoading,
      isFbAuthLoading,
    };
  },
});
</script>
