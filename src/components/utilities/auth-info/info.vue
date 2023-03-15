<template>
  <InfoWraper>
    <!-- <Message /> -->
    <Notification />
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
        <template v-slot:content>
          <UserDropDwon>
            <div class="user-dropdwon">
              <figure class="user-dropdwon__info">
                <!-- <img
                  :src="require('../../../static/img/avatar/chat-auth.png')"
                  alt=""
                /> -->
                <figcaption>
                  <sdHeading as="h5">User Profile</sdHeading>
                  <p>
                    
                  </p>
                </figcaption>
                <br>
              </figure>
              <ul class="user-dropdwon__links">
                <router-link to="/user/profile"
                      ><sdFeatherIcons type="user" />Profile</router-link
                    >
                <!-- <li>
                  <a to="#"> <sdFeatherIcons type="settings" /> Settings </a>
                </li>
                <li>
                  <a to="#"> <sdFeatherIcons type="dollar-sign" /> Billing </a>
                </li>
                <li>
                  <a to="#"> <sdFeatherIcons type="users" /> Activity </a>
                </li>
                <li>
                  <a to="#"> <sdFeatherIcons type="bell" /> Help </a>
                </li> -->
              </ul>
              <a @click="SignOut" class="user-dropdwon__bottomAction" href="#">
                <LogoutOutlined /> Sign Out
              </a>
            </div>
          </UserDropDwon>
        </template>
        <a to="#" class="head-example">
          <a-avatar
            src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png"
          />
        </a>
      </sdPopover>
    </div>
  </InfoWraper>
</template>

<script>
import { InfoWraper, UserDropDwon } from "./auth-info-style";
// import Support from "./Support";
// import Settings from "./Settings";
import Notification from "./Notification";
// import Message from "./Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { LogoutOutlined } from "@ant-design/icons-vue";
import { defineComponent, computed } from "vue";
import authService from "../../../services/auth.service";

export default defineComponent({
  name: "AuthInfo",
  components: {
    InfoWraper,
    UserDropDwon,
    Notification,
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
      rtl
    };
  },
  methods: {
    onFlagChangeHandle: function (value) {
      this.flag = value;
    },
  },
});
</script>
