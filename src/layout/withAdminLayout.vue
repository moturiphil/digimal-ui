<template>
  <MainWrapper :darkMode="darkMode">
    <Layout class="layout" :class="rtl ? 'ant-layout-rtl' : ''">
      <Header
        :style="{
          position: 'fixed',
          width: '100%',
          top: 0,
          [!rtl ? 'left' : 'right']: 0,
        }"
      >
        <a-row
          :class="rtl ? 'ant-row-rtl' : ''"
          style="display: flex; justify-content: space-between"
        >
          <!-- Left-aligned content -->
          <a-col
            :lg="!topMenu ? 4 : 3"
            :sm="6"
            :xs="12"
            class="align-left-v navbar-brand"
          >
            <sdButton
              v-if="!topMenu || innerWidth <= 991"
              @click="toggleCollapsed"
              type="white"
            >
              <img
                :src="
                  require(`../static/img/icon/${
                    collapsed ? 'right.svg' : 'left.svg'
                  }`)
                "
                alt="menu"
              />
            </sdButton>
            <router-link
              :class="
                topMenu && innerWidth > 991
                  ? 'striking-logo top-menu'
                  : 'striking-logo'
              "
              to="/"
            >
              <span class="digimal-brand">
                <span class="digimal-brand-text">
                  <span class="digimal-brand-name">DigiMal</span><span class="digimal-brand-ke">KE</span>
                </span>
              </span>
            </router-link>
          </a-col>

          <!-- Right-aligned content -->
           
          <a-col
            :lg="!topMenu ? 20 : 21"
            :md="16"
            :sm="18"
            :xs="12"
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
            "
          >
            <!-- <router-link to="/search-echis-hh" style="margin-right: 10px">
              <sdButton
                type="warning"
                size="extra-small"
                style="margin-right: 10px"
              >
                <sdFeatherIcons type="search" />
                <span v-if="innerWidth > 532">Search eCHIS</span>
              </sdButton>
            </router-link> -->
            <router-link to="/search-hh" style="margin-right: 10px">
              <sdButton
                type="success"
                size="extra-small"
                class="topbar-gradient-btn"
                style="margin-right: 10px"
              >
                <sdFeatherIcons type="search" />
                <span v-if="innerWidth > 532">Search Household</span>
              </sdButton>
            </router-link>
            <router-link to="/user/profile" style="margin-right: 10px">
              <sdButton type="success" size="extra-small" class="topbar-gradient-btn">
                <sdFeatherIcons type="user" />
                <span v-if="innerWidth > 532">My Account</span>
              </sdButton>
            </router-link>
            <AuthInfo />
          </a-col>
        </a-row>
      </Header>
      <div class="header-more">
        <a-row>
          <a-col :md="0" :sm="24" :xs="24">
            <div class="small-screen-headerRight">
              <SmallScreenSearch :hide="searchHide" :darkMode="darkMode">
                <!-- <HeaderSearch /> -->
              </SmallScreenSearch>
              <SmallScreenAuthInfo :hide="hide" :darkMode="darkMode">
                <AuthInfo :rtl="rtl" />
              </SmallScreenAuthInfo>
            </div>
          </a-col>
        </a-row>
      </div>
      <Layout :class="rtl ? 'ant-layout-rtl' : ''">
        <template v-if="!topMenu || innerWidth <= 991">
          <Sider
            :width="280"
            :style="{
              margin: '63px 0 0 0',
              padding: '15px 15px 155px 15px',
              overflowY: 'auto',
              height: '100vh',
              position: 'fixed',
              [!rtl ? 'left' : 'right']: 0,
              zIndex: 998,
            }"
            :collapsed="collapsed"
            :theme="!darkMode ? 'light' : 'dark'"
          >
            <perfect-scrollbar
              :options="{
                wheelSpeed: 1,
                swipeEasing: true,
                suppressScrollX: true,
              }"
            >
              <!-- <p class="sidebar-nav-title">MAIN MENU</p>  :toggleCollapsed="toggleCollapsedMobile" -->
              <AsideItems
                :toggleCollapsed="toggleCollapsedMobile"
                :topMenu="topMenu"
                :rtl="rtl"
                :darkMode="darkMode"
                :events="onEventChange"
                :class="rtl ? 'ant-menu-rtl' : ''"
              />
            </perfect-scrollbar>
          </Sider>
        </template>
        <Layout class="atbd-main-layout" :class="rtl ? 'ant-layout-rtl' : ''">
          <Content>
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

            <Footer
              class="admin-footer"
              :style="{
                padding: '20px 30px 18px',
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, .90)',
                width: '100%',
                boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
              }"
            >
              <a-row>
                <a-col :md="12" :xs="24">
                  <strong
                    ><span class="admin-footer__copyright"
                      >{{ currentYear }} © DigiMal-KE</span
                    ></strong
                  >
                </a-col>
                <a-col :md="12" :xs="24">
                  <div class="admin-footer__links">
                    <strong>V2.1.0</strong>
                  </div>
                </a-col>
              </a-row>
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </MainWrapper>
</template>
<script>
import { Layout } from "ant-design-vue";
import {
  MainWrapper,
  SmallScreenSearch,
  SmallScreenAuthInfo,
  // TopMenuSearch,
} from "./style";
// import HeaderSearch from "../components/header-search/HeaderSearch";

import AuthInfo from "../components/utilities/auth-info/info";
import AsideItems from "./Aside";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { computed, ref, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
const { Header, Footer, Sider, Content } = Layout;

export default defineComponent({
  name: "WithAdminLayout",
  components: {
    MainWrapper,
    Header,
    Layout,
    Footer,
    Sider,
    Content,
    SmallScreenSearch,
    SmallScreenAuthInfo,
    AuthInfo,
    AsideItems,
    PerfectScrollbar,
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.innerWidth = window.innerWidth;
    },
  },
  setup() {
    const collapsed = ref(true);
    const hide = ref(true);
    const searchHide = ref(true);
    const customizerAction = ref(false);
    const activeSearch = ref(false);
    const { dispatch, state } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const currentYear = ref("");
    const toggleCollapsed = (e) => {
      e.preventDefault();
      collapsed.value = !collapsed.value;
    };
    const handleSearchHide = (search) => {
      searchHide.value = !search;
      hide.value = true;
    };
    const onShowHide = (h) => {
      hide.value = !h;
      searchHide.value = true;
    };

    onMounted(() => {
      currentYear.value = new Date().getFullYear();
    });

    const toggleSearch = () => {
      activeSearch.value = !activeSearch.value;
    };

    const toggleCollapsedMobile = () => {
      if (innerWidth <= 990) {
        collapsed.value = !collapsed.value;
      }
    };

    const rtlInit = (dir, mode) => {
      const html = document.querySelector("html");
      html.setAttribute("dir", dir);
      dispatch("changeRtlMode", mode);
    };

    const onRtlChange = () => {
      rtlInit("rtl", true);
    };

    const onLtrChange = () => {
      rtlInit("ltr", false);
    };

    window.addEventListener("load", () => {
      const html = document.querySelector("html");
      state.themeLayout.rtlData == true
        ? html.setAttribute("dir", "rtl")
        : html.setAttribute("dir", "ltr");
    });

    const modeChangeDark = () => {
      dispatch("changeLayoutMode", true);
    };

    const modeChangeLight = () => {
      dispatch("changeLayoutMode", false);
    };

    const modeChangeTopNav = () => {
      dispatch("changeMenuMode", true);
    };

    const modeChangeSideNav = () => {
      dispatch("changeMenuMode", false);
    };

    const onEventChange = {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    };

    return {
      toggleCollapsed,
      handleSearchHide,
      toggleCollapsedMobile,
      onShowHide,
      collapsed,
      hide,
      searchHide,
      toggleSearch,
      customizerAction,
      activeSearch,
      innerWidth,
      rtl,
      darkMode,
      topMenu,
      onEventChange,
      ...onEventChange,
      currentYear,
    };
  },
});
</script>
<style>
.ps {
  height: calc(100vh - 100px);
}

/* Gradient buttons in the topbar (matches the New LSO hero gradient) */
.topbar-gradient-btn,
.topbar-gradient-btn.ant-btn {
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%) !important;
  border: none !important;
  color: #fff !important;
  box-shadow: 0 4px 10px rgba(20, 60, 38, 0.18) !important;
  transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease !important;
}
.topbar-gradient-btn:hover,
.topbar-gradient-btn:focus,
.topbar-gradient-btn.ant-btn:hover,
.topbar-gradient-btn.ant-btn:focus {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(20, 60, 38, 0.24) !important;
  color: #fff !important;
}
.topbar-gradient-btn svg {
  color: #fff !important;
  stroke: #fff !important;
}

/* DigiMal-KE brand mark in the topbar */
.digimal-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 1999px;
  background: linear-gradient(135deg, rgba(21, 105, 60, 0.08) 0%, rgba(54, 177, 111, 0.08) 100%);
  border: 2px solid rgba(21, 105, 60, 0.18);
  transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.digimal-brand:hover {
  filter: brightness(1.02);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(20, 60, 38, 0.12);
}
.digimal-brand-mark {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 6px rgba(20, 60, 38, 0.25);
  flex-shrink: 0;
}
.digimal-brand-mark svg {
  color: #fff !important;
  stroke: #fff !important;
}
.digimal-brand-text {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-weight: 800;
  font-size: 15px;
  line-height: 1;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 55%, #36b16f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #15693c; /* fallback */
}
.digimal-brand-sep {
  font-weight: 700;
  opacity: 0.55;
  -webkit-text-fill-color: initial;
  color: #1f9254;
}
.digimal-brand-ke {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1.2px;
  -webkit-text-fill-color: initial;
  color: #1f9254;
  background: rgba(31, 146, 84, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
