<template>
  <MainWrapper :darkMode="darkMode">
    <Layout class="layout" :class="rtl ? 'ant-layout-rtl' : ''">
      <Header
        :style="{
          position: 'fixed',
          width: '100%',
          top: 0,
          [!rtl ? 'left' : 'right']: 0,
          display: 'flex',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 'normal',
        }"
      >
        <a-row
          :class="rtl ? 'ant-row-rtl' : ''"
          style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 100%;"
        >
          <!-- Left-aligned content -->
          <a-col
            :lg="!topMenu ? 4 : 3"
            :sm="6"
            :xs="8"
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
            :xs="16"
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
              <p v-if="!collapsed" class="sidebar-nav-title">MAIN MENU</p>
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
  gap: 6px;
  padding: 0;
  background: transparent;
  border: none;
  transition: filter 0.15s ease, transform 0.15s ease;
}
.digimal-brand:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
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

/* ─── Mobile topbar: prevent overlap on narrow screens ── */
@media (max-width: 767px) {
  .ant-layout-header {
    padding: 0 12px !important;
  }
  .navbar-brand {
    min-width: 0;
  }
  /* Allow brand text to truncate instead of pushing into the right column */
  .navbar-brand .striking-logo {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
  }
  .navbar-brand .digimal-brand {
    min-width: 0;
    overflow: hidden;
  }
  .navbar-brand .digimal-brand-text {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 575px) {
  /* Tighter gaps between topbar items so they fit without overlap */
  .navbar-brand .ant-btn,
  .ant-layout-header .topbar-gradient-btn {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .ant-layout-header a[href="/search-hh"],
  .ant-layout-header a[href="/user/profile"] {
    margin-right: 6px !important;
  }
  /* Compact the gradient buttons to icon-only on very narrow screens */
  .topbar-gradient-btn {
    min-width: 32px !important;
    height: 32px !important;
    padding: 0 8px !important;
  }
  .topbar-gradient-btn svg {
    margin: 0 !important;
  }
  /* Compact the logout pill: keep red border + icon, drop label */
  .logout-btn {
    padding: 0 8px !important;
    min-width: 32px !important;
    justify-content: center !important;
  }
  .logout-btn .logout-btn-label {
    display: none !important;
  }
  /* Smaller bell footprint */
  .np-bell {
    margin: 0 4px !important;
  }
  /* Hide the DigiMal wordmark on the tiniest screens; show only the KE badge */
  .digimal-brand-name {
    display: none;
  }
}

@media (max-width: 360px) {
  .digimal-brand-ke {
    font-size: 11px;
    padding: 2px 5px;
  }
}
/* ════════════════════════════════════════════════════════════════════
   SIDEBAR — events-module aligned design
   Palette:  deep   #15693c · mid #1f9254 · bright #36b16f
   Tints:    #eff9f4 #f0f7f3 #daf4e4   Borders: #d9f0e2 #e1efe6
   Radius:   12px section pills · 10px child pills
   ════════════════════════════════════════════════════════════════════ */

/* 1 ── Sider surface ──────────────────────────────────────────────── */
.ant-layout-sider.ant-layout-sider-light {
  background: linear-gradient(180deg, #eff9f4 0%, #ffffff 50%, #f6fcf8 100%) !important;
  border-right: 1px solid #e1efe6;
  box-shadow: 2px 0 16px rgba(28, 122, 72, 0.06) !important;
}
.ant-layout-sider.ant-layout-sider-dark {
  background: linear-gradient(180deg, #141e18 0%, #272b41 120%) !important;
  border-right: 1px solid #16241c;
}
html[dir='rtl'] .ant-layout-sider.ant-layout-sider-light {
  border-right: 0 none;
  border-left: 1px solid #e1efe6;
}

/* 2 ── Menu base ───────────────────────────────────────────────────── */
.ant-layout-sider .ant-layout-sider-children .ant-menu {
  background: transparent !important;
  border-right: 0 none !important;
  border-left: 0 none !important;
  box-shadow: none !important;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* 3 ── Section label ("MAIN MENU") + group titles ──────────────────── */
.sidebar-nav-title {
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  color: #7a8a82 !important;
  padding: 16px 16px 8px !important;
}
.ant-layout-sider .ant-menu-item-group-title {
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  color: #7a8a82 !important;
  padding: 16px 14px 6px !important;
}
/* 4 ── Section headers (submenu titles) ────────────────────────────── */
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title {
  height: 44px !important;
  line-height: 44px !important;
  margin: 2px 0 !important;
  border-radius: 12px !important;
  padding: 0 30px 0 12px !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  color: #3c4b42 !important;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title:focus {
  outline: none;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-title-content {
  flex: 1;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title svg {
  color: #1f9254 !important;
  flex-shrink: 0;
  transition: color 0.2s ease;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu:hover > .ant-menu-submenu-title,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-active > .ant-menu-submenu-title,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-open > .ant-menu-submenu-title,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-selected > .ant-menu-submenu-title {
  background: #eaf7f0 !important;
  color: #15693c !important;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu:hover > .ant-menu-submenu-title svg,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-active > .ant-menu-submenu-title svg,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-open > .ant-menu-submenu-title svg,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-selected > .ant-menu-submenu-title svg {
  color: #15693c !important;
}
/* keep the expanded section readable */
.ant-layout-sider .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-open > .ant-menu-submenu-title {
  background: #f0f7f3 !important;
  font-weight: 700 !important;
}

/* nested submenu headers (e.g. GF / PMI under Payroll, MEDS / KEMSA under
   Supply Chain) — visually subordinate with a deeper indent */
.ant-layout-sider .ant-menu-sub .ant-menu-submenu > .ant-menu-submenu-title {
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 30px 0 24px !important;
  font-size: 12.5px !important;
  font-weight: 500 !important;
}
html[dir='rtl'] .ant-layout-sider .ant-menu-sub .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0 24px 0 30px !important;
}

/* 5 ── Submenu arrows (green) ──────────────────────────────────────── */
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-submenu-arrow {
  transition: transform 0.2s ease;
}
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-submenu-arrow::before,
.ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-submenu-arrow::after {
  background: #1f9254 !important;
  background-color: #1f9254 !important;
  border-radius: 2px;
}
/* 6 ── Child menu items ────────────────────────────────────────────── */
.ant-layout-sider .ant-menu-inline .ant-menu-item {
  height: 38px !important;
  line-height: 38px !important;
  margin: 2px 0 !important;
  border-radius: 10px !important;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item a {
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #5f7268 !important;
  transition: color 0.2s ease;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item a svg {
  color: #7cb596 !important;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item:not(.ant-menu-item-selected):hover {
  background: #f0f7f3 !important;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item:not(.ant-menu-item-selected):hover a {
  color: #15693c !important;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item:not(.ant-menu-item-selected):hover a svg {
  color: #15693c !important;
}
/* active pill */
.ant-layout-sider .ant-menu-inline .ant-menu-item.ant-menu-item-selected {
  background: linear-gradient(135deg, #15693c 0%, #1f9254 100%) !important;
  box-shadow: 0 4px 10px rgba(15, 105, 60, 0.18) !important;
  color: #fff !important;
}
.ant-layout-sider .ant-menu-inline .ant-menu-item.ant-menu-item-selected > .ant-menu-title-content,
.ant-layout-sider .ant-menu-inline .ant-menu-item.ant-menu-item-selected a,
.ant-layout-sider .ant-menu-inline .ant-menu-item.ant-menu-item-selected a span,
.ant-layout-sider .ant-menu-inline .ant-menu-item.ant-menu-item-selected a svg {
  color: #fff !important;
}

/* 7 ── Collapsed sidebar ───────────────────────────────────────────── */
.ant-layout-sider.ant-layout-sider-collapsed .ant-layout-sider-children .ant-menu {
  padding: 6px 9px;
}
.ant-layout-sider.ant-layout-sider-collapsed .ant-menu-inline-collapsed > .ant-menu-item,
.ant-layout-sider.ant-layout-sider-collapsed .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0 !important;
  border-radius: 12px !important;
  margin: 4px 0 !important;
}
.ant-layout-sider.ant-layout-sider-collapsed
  .ant-menu-inline-collapsed
  > .ant-menu-item.ant-menu-item-selected,
.ant-layout-sider.ant-layout-sider-collapsed
  .ant-menu-inline-collapsed
  > .ant-menu-submenu.ant-menu-submenu-selected
  > .ant-menu-submenu-title {
  background: linear-gradient(135deg, #15693c 0%, #1f9254 100%) !important;
  box-shadow: 0 4px 10px rgba(15, 105, 60, 0.18) !important;
  color: #fff !important;
}
.ant-layout-sider.ant-layout-sider-collapsed
  .ant-menu-inline-collapsed
  > .ant-menu-item.ant-menu-item-selected svg,
.ant-layout-sider.ant-layout-sider-collapsed
  .ant-menu-inline-collapsed
  > .ant-menu-submenu.ant-menu-submenu-selected
  > .ant-menu-submenu-title svg {
  color: #fff !important;
}
.ant-layout-sider.ant-layout-sider-collapsed .sidebar-nav-title {
  display: none !important;
}

/* collapsed tooltip */
.ant-tooltip.ant-menu-inline-collapsed-tooltip .ant-tooltip-inner {
  background: #15693c !important;
  border-radius: 8px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(15, 105, 60, 0.25) !important;
}
.ant-tooltip.ant-menu-inline-collapsed-tooltip .ant-tooltip-arrow-content {
  background-color: #15693c !important;
}
/* 8 ── Collapsed flyout popups (submenus) ──────────────────────────── */
.ant-menu-submenu-popup .ant-menu-sub {
  border: 1px solid #e1efe6 !important;
  border-radius: 12px !important;
  padding: 6px !important;
  box-shadow: 0 8px 24px rgba(28, 122, 72, 0.12) !important;
  background: #fff !important;
}
.ant-menu-submenu-popup .ant-menu-submenu-title {
  padding: 0 12px !important;
}
.ant-menu-submenu-popup .ant-menu-item {
  border-radius: 8px !important;
  margin: 2px 0 !important;
}
.ant-menu-submenu-popup .ant-menu-item a {
  color: #5f7268 !important;
}
.ant-menu-submenu-popup .ant-menu-item.ant-menu-item-selected {
  background: linear-gradient(135deg, #15693c, #1f9254) !important;
  color: #fff !important;
}
.ant-menu-submenu-popup .ant-menu-item.ant-menu-item-selected a {
  color: #fff !important;
}

/* 9 ── Dark theme variants ─────────────────────────────────────────── */
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title {
  color: rgba(255, 255, 255, 0.72) !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title svg {
  color: #36b16f !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu:hover > .ant-menu-submenu-title,
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-active > .ant-menu-submenu-title,
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-open > .ant-menu-submenu-title,
.ant-layout-sider-dark .ant-menu-inline .ant-menu-submenu.ant-menu-submenu-selected > .ant-menu-submenu-title {
  background: rgba(54, 177, 111, 0.16) !important;
  color: #ffffff !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-item a {
  color: rgba(255, 255, 255, 0.66) !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-item a svg {
  color: #36b16f !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-item:not(.ant-menu-item-selected):hover {
  background: rgba(54, 177, 111, 0.12) !important;
}
.ant-layout-sider-dark .ant-menu-inline .ant-menu-item:not(.ant-menu-item-selected):hover a {
  color: #ffffff !important;
}
.ant-layout-sider-dark .sidebar-nav-title {
  color: rgba(255, 255, 255, 0.42) !important;
}
.ant-layout-sider-dark .ps__thumb-y {
  background: rgba(255, 255, 255, 0.25) !important;
}

/* 10 ── Scrollbar (perfect-scrollbar) ──────────────────────────────── */
.ant-layout-sider .ps__rail-y {
  width: 5px !important;
  opacity: 0.7;
}
.ant-layout-sider .ps__thumb-y {
  background: rgba(31, 146, 84, 0.35) !important;
  border-radius: 4px !important;
  width: 5px !important;
}

/* RTL offset for section headers */
html[dir='rtl'] .ant-layout-sider .ant-menu-inline .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0 12px 0 30px !important;
}

@media (max-width: 991px) {
  .ant-layout-sider.ant-layout-sider-light {
    box-shadow: 2px 0 14px rgba(28, 122, 72, 0.1) !important;
  }
}
</style>
