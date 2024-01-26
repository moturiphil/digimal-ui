<template>
  <InfoWraper>
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
        <a @click="SignOut" class="user-dropdwon__bottomAction" href="#">
          <LogoutOutlined /> Log Out
        </a>
      </sdPopover>
    </div>
  </InfoWraper>
</template>

<script>
import { InfoWraper } from "./auth-info-style";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { LogoutOutlined } from "@ant-design/icons-vue";
import { defineComponent, computed } from "vue";
import authService from "../../../services/auth.service";

export default defineComponent({
  name: "AuthInfo",
  components: {
    InfoWraper,
    // Notification,
    LogoutOutlined,
  },
  data() {
    return {
      flag: "english",
    };
  },
  setup() {
    const { dispatch, state } = useStore();
    const { push } = useRouter();
    //const isAuthenticate = computed(() => state.firebase.uid);
    const isLoading = computed(() => state.firebase.loading);

    // const logOutRoot = () => {
    //   push("/auth/login");
    //   dispatch("logOut");
    // };

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
  },
});
</script>
