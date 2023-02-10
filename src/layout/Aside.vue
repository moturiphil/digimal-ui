<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <a-menu-item-group key="pages">
      <a-sub-menu key="widgets">
        <template v-slot:title
          ><sdFeatherIcons type="server" /><span>Campagins</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/campaigns/create-campaign"> Create Campaign </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsCard">
          <router-link to="/campaigns/view-campaign"> List Campaigns </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="widgets">
        <template v-slot:title
          ><sdFeatherIcons type="server" /><span>Events</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/events/event-create"> Create Event </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsCard">
          <router-link to="/events/event-view"> List Events </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item @click="toggleCollapsed" key="net-distribution">
          <router-link to="/net/distribution/national">
            Nets Distribution
          </router-link>
        </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="registered-users">
          <router-link to="/registered-users">
            Users
          </router-link>
        </a-menu-item>
    </a-menu-item-group>
  </a-menu>
</template>
<script>
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  defineComponent,
} from "vue";
import VueTypes from "vue-types";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import versions from "../demoData/changelog.json";

export default defineComponent({
  name: "AsideItems",
  props: {
    toggleCollapsed: VueTypes.func,
    events: VueTypes.object,
  },
  setup(props) {
    const store = useStore();
    const darkMode = computed(() => store.state.themeLayout.data);
    const mode = ref("inline");
    const { events } = toRefs(props);
    const {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    } = events.value;

    const router = computed(() => useRoute());
    const state = reactive({
      selectedKeys: ["home"],
      openKeys: ["dashboard"],
      preOpenKeys: ["dashboard"],
    });

    watchEffect(() => {
      if (router.value.matched.length) {
        if (router.value.matched.length > 2) {
          state.selectedKeys = [router.value.matched[2].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else if (router.value.matched.length > 3) {
          state.selectedKeys = [router.value.matched[3].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else {
          state.selectedKeys = [router.value.matched[1].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        }
      }
    });

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    return {
      mode,
      ...toRefs(state),
      darkMode,
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
      versions,
    };
  },
});
</script>
