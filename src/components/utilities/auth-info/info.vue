<template>
  <InfoWraper>
    <!-- <Message /> -->
    <!-- <Notification /> -->
    <!-- <Settings /> -->
    <!-- <Support /> -->
    <div class="nav-author">
      <sdDropdown placement="bottomRight" :action="['click']">
        <template v-slot:overlay>
          <!-- <NavAuth>
            <router-link @click="() => onFlagChangeHandle('english')" to="#">
              <img
                :src="require('../../../static/img/flag/english.png')"
                alt=""
              />
              <span>English</span>
            </router-link>
            <router-link @click="() => onFlagChangeHandle('germany')" to="#">
              <img
                :src="require('../../../static/img/flag/germany.png')"
                alt=""
              />
              <span>Germany</span>
            </router-link>
            <router-link @click="() => onFlagChangeHandle('spain')" to="#">
              <img
                :src="require('../../../static/img/flag/spain.png')"
                alt=""
              />
              <span>Spain</span>
            </router-link>
            <router-link @click="() => onFlagChangeHandle('african')" to="#">
              <img
                :src="require('../../../static/img/flag/african.png')"
                alt=""
              />
              <span>Turky</span>
            </router-link>
          </NavAuth> -->
        </template>
        <!-- <a to="#" class="head-example">
          <img :src="require(`../../../static/img/flag/${flag}.png`)" alt="" />
        </a> -->
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
        <template>
          <a @click="signOut" class="user-dropdown__bottomAction" href="#">
            <i class="logout-icon"><LogoutOutlined /></i> Sign Out
          </a>
        </template>
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
