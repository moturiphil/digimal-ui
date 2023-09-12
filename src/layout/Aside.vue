<template>
  <a-menu
    v-model:selectedKeys="current"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <a-menu-item-group key="pages">
      <a-menu-item key="widgetDashboard">
        <router-link to="/">
          <sdFeatherIcons type="menu" /> <span>Dashboard</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="campaigns">
        <template v-slot:title>
          <sdFeatherIcons type="globe" /><span>Campaigns</span>
        </template>
        <a-menu-item key="widgetCamp">
          <router-link to="/campaigns/create-campaign">
            Create Campaign
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetsList">
          <router-link to="/campaigns/view-campaign">
            List Campaigns
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="widgetsCampaignUsers">
          <router-link to="/households/chv"> Campaign Users </router-link>
        </a-menu-item> -->
        <!-- <a-menu-item  key="widgetlistCampaignUsers">
          <router-link to="/campaign/users"> List Campaign Users </router-link>
        </a-menu-item> -->
      </a-sub-menu>
      <a-sub-menu key="events" >
        <template v-slot:title>
          <sdFeatherIcons type="twitch" /><span>Events</span>
        </template>
        <a-menu-item key="widgetCreateEvent">
          <router-link to="/events/event-create"> Create Event </router-link>
        </a-menu-item>
        <a-menu-item key="widgetListevents">
          <router-link to="/events/event-view"> List Events </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="activities">
        <template v-slot:title>
          <sdFeatherIcons type="activity" /><span>Activities</span>
        </template>
        <a-menu-item key="widgetCreateActivity">
          <router-link to="/activities/activity-create">
            Create Activity
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetsListActivity">
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

        <a-menu-item key="widgetListOrgUnits">
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

        <a-menu-item key="widgetHouseholdReg">
          <router-link to="/households/list">
            HouseHolds Registered
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetHouseholdValidation">
          <router-link to="/household/validation">
            HouseHolds Validation
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetHouseholdNets">
          <router-link to="/hh-nets-distributed">
            Nets Distributed
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="drop-off-point">
        <template v-slot:title>
          <sdFeatherIcons type="map-pin" /><span>Drop-off Point</span>
        </template>
        <a-menu-item key="widgetDropOffPoint">
          <router-link to="/nets/distribution-point">
            Create Drop-off Point
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetListDropOffPoint">
          <router-link to="/nets/distribution-points">
            List Drop-off Point
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="nets-distribution">
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>Distribution Post</span>
        </template>
        <a-menu-item key="widgetCreatePost" >
          <router-link to="/nets/post-create"> Create Post </router-link>
        </a-menu-item>
        <a-menu-item key="widgetDistributionPost">
          <router-link to="/nets/distribution-post">
            Distribution Posts
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="inventory">
        <template v-slot:title>
          <sdFeatherIcons type="layers" /><span>Inventory</span>
        </template>
        <a-menu-item key="widgetNetsDropOff">
          <router-link to="/nets/distribution-point-nets">
            Dropoff-Point Nets
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetNetsReceived">
          <router-link to="/nets/nets-delivered"> Post Nets </router-link>
        </a-menu-item>
        <a-menu-item key="">
          <router-link to="/stock-status">Stock Status </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="payroll" v-if="canViewPayroll && isLevelOne">
        <template v-slot:title>
          <sdFeatherIcons type="credit-card" /><span>Payroll</span>
        </template>
        <!-- <a-menu-item  key="widgetPayrollDetails">
          <router-link to="/view-payroll">Payroll Details </router-link>
        </a-menu-item>  -->
        <a-menu-item key="activity-payroll">
          <router-link to="/activity-payroll">Activity Payroll </router-link>
        </a-menu-item>
        <a-menu-item key="payroll-payroll">
          <router-link to="/event-payroll">Event Payroll </router-link>
        </a-menu-item>
        <a-menu-item key="widgetTransactionDetails">
          <router-link to="/view-transactions"
            >Transaction Details
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="user-management" v-if="isAdmin || canViewUsers">
        <template v-slot:title>
          <sdFeatherIcons type="users" /><span>User Management</span>
        </template>
        <a-menu-item v-if="isAdmin" key="widgetMasterList">
          <router-link to="/masterlist">Masterlist </router-link>
        </a-menu-item>
        <a-menu-item key="widgetUsers" v-if="canViewUsers">
          <router-link to="/registered-users">Users </router-link>
        </a-menu-item>
        <a-menu-item v-if="isAdmin" key="widgetRoles">
          <router-link to="/user-roles">Roles </router-link>
        </a-menu-item>
      </a-sub-menu>
      <!-- <a-menu-item  key="review_excel">
        <router-link to="/review_excel">
          <sdFeatherIcons type="users" />&nbsp; &nbsp; Review Excel
        </router-link>
      </a-menu-item> -->
      <a-menu-item v-if="isAdmin" key="logs">
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
import { useRoute, useRouter } from "vue-router";
import { fetchUserData, hasRole } from "../services/user-role";

const adminRoles = [53];
const createCampaignRoles = [53, 5];
const viewCampaignRoles = [53, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 14, 15, 16, 56, 60];
const createEventRoles = [53, 5, 3, 21, 37, 39];
const viewEventRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];
const createActivityRoles = [53, 5, 3, 21, 37];
const viewActivitiesRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];
const viewOrgUnitsRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];
const viewRegHHRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59,60
];

const viewHHValidationRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59,60
];

const viewNetsDistributedRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59,60
];

const viewDropoffPointsRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];

const createDistributionPostRoles = [
  53, 5, 3, 7, 8, 10, 11, 14, 15, 16, 21, 34, 36, 37, 39, 42, 44,
];

const viewDistributionPostRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];

const viewInventoryRoles = [
  53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59, 60
];

const viewPayrollRoles = [53, 1, 2, 3, 4,];

const viewUsersRoles = [
  53, 1, 2, 3, 5, 7, 8, 11, 15, 16, 19, 20, 24, 26, 23, 22, 21, 34, 36, 37, 39,
  42, 60
];

const createDropOffPoint = [53, 1, 2, 3, 4, 5, 7, 8, 10, 11, 14, 15, 16, 18, 19, 21, 22, 23, 24, 26, 34,
  36, 37, 39, 42, 44, 56, 57, 59];

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
    const rt = useRouter();

    // user roles
    const isAIEHolder = hasRole(1);
    const isAdmin = hasRole(adminRoles);
    const canCreateCampaign = hasRole(createCampaignRoles);
    const canViewCampaign = hasRole(viewCampaignRoles);
    const canCreateEvent = hasRole(createEventRoles);
    const canViewEvent = hasRole(viewEventRoles);
    const canCreateActivity = hasRole(createActivityRoles);
    const canViewActivities = hasRole(viewActivitiesRoles);
    const canViewOrgUnits = hasRole(viewOrgUnitsRoles);
    const canViewRegHH = hasRole(viewRegHHRoles);
    const canValidateHH = hasRole(viewHHValidationRoles);
    const canViewNetsDistributed = hasRole(viewNetsDistributedRoles);
    const canCreateDropOffPoint = hasRole(createDropOffPoint);
    const canViewDropOffPoint = hasRole(viewDropoffPointsRoles);
    const canCreateDistributionPost = hasRole(createDistributionPostRoles);
    const canViewDistributitionPostRole = hasRole(viewDistributionPostRoles);
    const canViewInventory = hasRole(viewInventoryRoles);
    const canViewPayroll = hasRole(viewPayrollRoles);
    const canViewUsers = hasRole(viewUsersRoles);

    onMounted(() => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      fetchUserData();
      if (!user) {
        rt.push({ path: "/auth/login" });
      } else {
        level_id.value = user.user.level_id;
        role_id.value = user.user.role_id;
      }
    });

    const isLevelOne = computed(() => {
      return level_id.value === 1 || role_id.value === 27;
    });

    // const isAdmin = computed(() => {
    //   return role_id.value === 53;
    // });

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
      canCreateCampaign,
      level_id,
      current,
      role_id,
      isLevelOne,
      isAdmin,
      isAIEHolder,
      canViewCampaign,
      canCreateEvent,
      canViewEvent,
      canCreateActivity,
      canViewOrgUnits,
      canViewActivities,
      canViewRegHH,
      canValidateHH,
      canViewNetsDistributed,
      canCreateDropOffPoint,
      canViewDropOffPoint,
      canCreateDistributionPost,
      canViewDistributitionPostRole,
      canViewInventory,
      canViewPayroll,
      canViewUsers,
    };
  },
});
</script>
