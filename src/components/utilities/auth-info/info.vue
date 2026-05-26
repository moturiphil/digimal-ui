<template>
  <InfoWraper>
    <Notification />

    <div class="nav-author">
      <sdDropdown placement="bottomRight" :action="['click']">
        <template v-slot:overlay> </template>
      </sdDropdown>
    </div>

    <div class="nav-author">
      <sdPopover
        placement="bottomRight"
        action="click"
        :class="rtl ? 'ant-popover-rtl' : ''"
      >
        <a @click="SignOut" class="logout-btn" href="#" aria-label="Log Out">
          <LogoutOutlined class="logout-btn-icon" />
          <span class="logout-btn-label">Log out</span>
        </a>
      </sdPopover>
    </div>
  </InfoWraper>
</template>

<script>
import { InfoWraper } from "./auth-info-style";
import Notification from "./Notification.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { LogoutOutlined } from "@ant-design/icons-vue";
import { defineComponent, computed } from "vue";
import authService from "../../../services/auth.service";

export default defineComponent({
  name: "AuthInfo",
  components: {
    InfoWraper,
    Notification,
    LogoutOutlined,
  },
  data() {
    return {
      flag: "english",
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  setup() {
    const { dispatch, state } = useStore();
    const { push } = useRouter();
    //const isAuthenticate = computed(() => state.firebase.uid);
    const isLoading = computed(() => state.firebase.loading);


    const SignOut = (e) => {
      e.preventDefault();
      authService.logout();
      push("/auth/login");
      dispatch("logOut");
    };
    const rtl = computed(() => state.themeLayout.rtlData);

    return {
      SignOut,
      isLoading,
      rtl,
    };
  },
  methods: {
    onFlagChangeHandle: function (value) {
      this.flag = value;
    },
    handleResize() {
      this.innerWidth = window.innerWidth;
    },
  },
});
</script>

<style scoped>
/* Override .nav-author > a { display:block } from auth-info-style */
.logout-btn {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 14px;
  margin: 0 !important;
  border-radius: 999px;
  background: #fff;
  color: #c0392b !important;
  font-weight: 600;
  font-size: 12px;
  line-height: 1 !important;
  letter-spacing: 0.2px;
  text-decoration: none;
  border: 1px solid #f1c4be;
  box-shadow: 0 1px 2px rgba(192, 57, 43, 0.08);
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease, transform 0.15s ease;
  white-space: nowrap;
  vertical-align: middle;
}
.logout-btn:hover,
.logout-btn:focus {
  background: linear-gradient(135deg, #c0392b 0%, #e0533f 100%);
  color: #fff !important;
  border-color: transparent;
  box-shadow: 0 4px 10px rgba(192, 57, 43, 0.25);
  transform: translateY(-1px);
}
.logout-btn .logout-btn-icon {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 0;
  margin: 0 !important;
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.logout-btn .logout-btn-icon :deep(svg) {
  display: block;
  width: 13px;
  height: 13px;
}
.logout-btn .logout-btn-label {
  display: inline-flex !important;
  align-items: center;
  margin: 0 !important;
  line-height: 1 !important;
  height: auto !important;
  color: inherit;
}
</style>
