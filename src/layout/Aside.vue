<template>
  <a-menu
    v-model:selectedKeys="current"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <a-menu-item-group key="pages">
      <a-menu-item  key="widgetDashboard" >
        <router-link to="/">
          <sdFeatherIcons type="menu" /> <span>Dashboard</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="campaigns">
        <template v-slot:title>
          <sdFeatherIcons type="globe" /><span>Campaigns</span>
        </template>
        <a-menu-item  key="widgetCamp">
          <router-link to="/campaigns/create-campaign">
            Create Campaign
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetsList">
          <router-link to="/campaigns/view-campaign">
            List Campaigns
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetsCampaignUsers">
          <router-link to="/households/chv"> Campaign Users </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetlistCampaignUsers">
          <router-link to="/campaign/users"> List Campaign Users </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="events">
        <template v-slot:title>
          <sdFeatherIcons type="twitch" /><span>Events</span>
        </template>
        <a-menu-item  key="widgetCreateEvent">
          <router-link to="/events/event-create"> Create Event </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetListevents">
          <router-link to="/events/event-view"> List Events </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="activities">
        <template v-slot:title>
          <sdFeatherIcons type="activity" /><span>Activities</span>
        </template>
        <a-menu-item  key="widgetCreateActivity">
          <router-link to="/activities/activity-create">
            Create Activity
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetsListActivity">
          <router-link to="/activities/activity-view">
            List Activity
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="administrative-units">
        <template v-slot:title>
          <sdFeatherIcons type="cpu" />
          <!-- <sdFeatherIcons type="DeploymentUnitOutlined" />  -->
          <span>Organization Units</span></template
        >

        <a-menu-item  key="widgetListOrgUnits">
          <router-link to="/org-units/view">
            List Orgranization Units
          </router-link>
        </a-menu-item>

        <!-- <a-menu-item  key="widgetCreateLocation">
          <router-link to="/org-units/location-create">
            Create Location
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetCreateSubLocation">
          <router-link to="/org-units/sub-location-create">
            Create Sub-Location
          </router-link>
        </a-menu-item>

        <a-menu-item  key="widgetCreateVillage">
          <router-link to="/org-units/village-create">
            Create Village
          </router-link>
        </a-menu-item>  -->
      </a-sub-menu>

      <a-sub-menu key="house-holds">
        <template v-slot:title>
          <sdFeatherIcons type="home" />
          <span>HouseHolds</span></template
        >

        <a-menu-item  key="widgetHouseholdReg">
          <router-link to="/households/list">
            HouseHolds Registered
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetHouseholdValidation">
          <router-link to="/household/validation">
            HouseHolds Validation
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetHouseholdNets">
          <router-link to="/hh-nets-distributed"> HouseHolds Nets </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="drop-off-point">
        <template v-slot:title>
          <sdFeatherIcons type="map-pin" /><span>Dropoff Point</span>
        </template>
        <a-menu-item  key="widgetDropOffPoint">
          <router-link to="/nets/distribution-point">
            Create Dropoff Point
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetListDropOffPoint">
          <router-link to="/nets/distribution-points">
            List Dropoff Point
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetNetsDropOff">
          <router-link to="/nets/distribution-point-nets">
            Nets at Dropoff
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="nets-distribution">
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>Nets Distribution</span>
        </template>
        <a-menu-item  key="widgetCreatePost">
          <router-link to="/nets/post-create"> Create Post </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetDistributionPost">
          <router-link to="/nets/distribution">
            Distribution Posts
          </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetReceiveNets">
          <router-link to="/nets/receive-nets"> Receive Nets </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetNetsReceived">
          <router-link to="/nets/delivered"> Nets Received </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item  key="">
        <router-link to="/stock-status"
          ><sdFeatherIcons type="bar-chart-2" /><span>Stock Status</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu v-if="isLevelOne" key="payroll">
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>Payroll</span>
        </template>
        <a-menu-item  key="widgetPayrollDetails">
          <router-link to="/view-payroll">Payroll Details </router-link>
        </a-menu-item> 
        <a-menu-item  key="activity-payroll">
          <router-link to="/activity-payroll">Activity Payroll </router-link>
        </a-menu-item>
        <a-menu-item  key="payroll-payroll">
          <router-link to="/event-payroll">Event Payroll </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetTransactionDetails">
          <router-link to="/view-transactions"
            >Transaction Details
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="user-management">
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>User Management</span>
        </template>
        <a-menu-item  key="widgetUsers" >
          <router-link to="/registered-users">Users </router-link>
        </a-menu-item>
        <a-menu-item  key="widgetRoles" >
          <router-link to="/user-roles">Roles </router-link>
        </a-menu-item>
      </a-sub-menu>
      <!-- <a-menu-item  key="registered-users">
        <router-link to="/registered-users">
          <sdFeatherIcons type="users" />&nbsp; &nbsp; Users
        </router-link>
      </a-menu-item> -->
      <a-menu-item  key="logs">
        <router-link to="/logs">
          <sdFeatherIcons type="clipboard" /><span> Audit Logs </span>
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
  onMounted,
} from "vue";
import VueTypes from "vue-types";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import versions from "../demoData/changelog.json";
// import authHeader from "../services/auth-header";
// import { AuthService } from "../services/auth.service";

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

    const level_id = ref("");
    const role_id = ref("");
    const current = ref("");

    onMounted(() => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      level_id.value = user.user[0].level_id;
      role_id.value = user.user[0].role_id;
      console.log(level_id.value);
    });

    const isLevelOne = computed(() => {
      return level_id.value === 1 || role_id.value === 27;
    });

    const router = computed(() => useRoute());
    const state = reactive({
      selectedKeys: ["home"],
      openKeys: ["dashboard"],
      preOpenKeys: ["dashboard"],
    });

    // const authService = new AuthService();

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

    // onMounted(() => {
    //   console.log(authService.getUser());
    // });

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
      level_id,
      current,
      role_id,
      isLevelOne,
    };
  },
});
</script>

