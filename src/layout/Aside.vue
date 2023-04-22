<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <a-menu-item-group key="pages">
      <a-menu-item @click="toggleCollapsed" key="widgetDashboard">
        <router-link to="/">
          <sdFeatherIcons type="menu" />&nbsp; &nbsp; Dashboard
        </router-link>
      </a-menu-item>
      <a-sub-menu key="campaigns">
        <template v-slot:title>
          <sdFeatherIcons type="globe" /><span>Campaigns</span>
        </template>
        <a-menu-item @click="toggleCollapsed" key="widgetCamp">
          <router-link to="/campaigns/create-campaign"> Create Campaign </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsList">
          <router-link to="/campaigns/view-campaign"> List Campaigns </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="events">
        <template v-slot:title>
          <sdFeatherIcons type="twitch" /><span>Events</span>
        </template>
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/events/event-create"> Create Event </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsCard">
          <router-link to="/events/event-view"> List Events </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="activities">
        <template v-slot:title>
          <sdFeatherIcons type="activity" /><span>Activities</span>
        </template>
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/activities/activity-create">
            Create Activity
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsCard">
          <router-link to="/activities/activity-view">
            List Activity
          </router-link>
        </a-menu-item>
      </a-sub-menu>


      <a-sub-menu key="drop-off-point">
        <template v-slot:title>
          <sdFeatherIcons type="map-pin" /><span>Distribution Point</span>
        </template>
        <a-menu-item @click="toggleCollapsed" key="post-create">
          <router-link to="/nets/distribution-point"> Create Distribution Point </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="post-create">
          <router-link to="/nets/distribution-points"> List Distribution Point </router-link>
        </a-menu-item>
      </a-sub-menu>


      <a-sub-menu key="nets-distribution">
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>Nets Distribution</span>
        </template>
        <a-menu-item @click="toggleCollapsed" key="post-create">
          <router-link to="/nets/post-create"> Create Post </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="net-distribution">
          <router-link to="/nets/distribution">
            Distribution Posts
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="receive-nets">
          <router-link to="/nets/receive-nets"> Receive Nets </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetChart">
          <router-link to="/nets/delivered"> Nets Received </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="administrative-units">
        <template v-slot:title>
          <sdFeatherIcons type="cpu" />
          <!-- <sdFeatherIcons type="DeploymentUnitOutlined" />  -->
          <span>Organization Units</span></template
        >

        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/org-units/view">
            List Orgranization Units
          </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/org-units/location-create">
            Create Location
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/org-units/sub-location-create">
            Create Sub-Location
          </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/org-units/village-create">
            Create Village
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="house-holds">
        <template v-slot:title>
          <sdFeatherIcons type="home" />
          <span>HouseHolds</span></template
        >

        <a-menu-item @click="toggleCollapsed" key="house-hold-list">
          <router-link to="/households/list">
            Registered HouseHolds
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="house-hold-chv">
          <router-link to="/households/chv">
            Campaign Users
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="house-hold-chv">
          <router-link to="/campaign/users">
            List Campaign Users
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item @click="toggleCollapsed" key="">
        <router-link to="/stock-status"
          ><sdFeatherIcons type="bar-chart-2" />&nbsp; &nbsp; Stock Status
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="registered-users">
        <router-link to="/registered-users">
          <sdFeatherIcons type="users" />&nbsp; &nbsp; Users
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
