<template>
  <sdPageHeader title="Create Post">
    <sdButton class="btn-add_new" size="default" key="1" type="sucess">
      <router-link to="/crud/axios-view">View All</router-link>
    </sdButton>
  </sdPageHeader>
  <Main>
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="10" :md="16" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                  <a-form-item name="campaign_id" label="Select Campaign">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        v-model:value="formState.campaign_id"
                        v-if="!loading"
                        placeholder="Select Campaign"
                      >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :value="campaign.id"
                          :key="campaign.id"
                          >{{ campaign.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <a-form-item name="name" label="Post Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Enter post name"
                      />
                    </a-form-item>
                    <!-- <a-form-item
                      name="distribution_start_date"
                      label="Start Date"
                    >
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.distribution_start_date"
                        :format="dateFormat"
                      />
                    </a-form-item>
                    <a-form-item name="distribution_end_date" label="End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.distribution_end_date"
                        :format="dateFormat"
                      />
                    </a-form-item> -->
                    <a-form-item
                      name="post_supervisor_user_id"
                      label="Post Admin"
                    >
                      <a-select
                        size="medium"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        v-model:value="formState.post_supervisor_user_id"
                        placeholder="Select Post Admin"
                      >
                        <a-select-option
                          v-for="user in users"
                          :value="user.id"
                          :key="user.id"
                          >{{
                            user.first_name + " " + user.last_name + "-" +  user.role_id
                          }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <a-form-item name="villages" label="Select villages">
                      <a-select
                        mode="multiple"
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        v-model:value="formState.villages"
                        v-if="!loading"
                        placeholder="Select villages"
                      >
                        <a-select-option
                          v-for="village in villages"
                          :value="village.id"
                          :key="village.id"
                          >{{ village.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <a-form-item name="isFacility">
                      <a-checkbox v-model:checked="isFacility"
                        >Is Post a Facility?</a-checkbox
                      >
                    </a-form-item>
                    <!-- label = {{ !isFacility ? `fyufuyfuy`: `jjkhkjhkj` }} -->
                    <a-form-item name="post_code">
                      <label>{{
                        !isFacility ? " " : `Facility MFL code`
                      }}</label>
                      <br />
                      <a-input
                        v-if="isFacility"
                        v-model:value="formState.post_code"
                        placeholder="Enter facility mfl code"
                      />
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-col>
            </a-row>
          </sdCards>
        </RecordFormWrapper>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { RecordFormWrapper } from "../style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { useRouter } from "vue-router";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const API_URL = `${process.env.VUE_APP_BASE_URL}/distribution_post`;
    const router = useRouter();
    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const formState = reactive({
      campaign_id: "",
      name: "",
      post_supervisor_user_id: "",
      villages: [],
      post_code: "",
      isFacility: 0,
    });

    const { villages, loading, isFacility, users } = reactive({
      campaigns: [],
      villages: [],
      users: [],
      loading: true,
      isFacility: false,
    });

    //campaigns
    const fetchCampaigns = async () => {
      const response = await fetch(campaign_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.campaigns = data.data;
      console.log(this.campaigns);
      this.loading = false;
    };
    fetchCampaigns();


    //counties
    const getVillages = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/villages/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      console.log(response);
      const data = await response.json();
      this.villages = data.data;
      this.loading = false;
    };

    //users
    const getUsers = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.users = data.data;
    };

    onMounted(() => {
      getUsers();
      getVillages();
    });

    // notification
    // const openNotification = (type) => {
    //   notification[type]({
    //     message: "Notification Title",
    //     description:
    //       type == "success"
    //         ? "Post created successfully"
    //         : "Post creation failed",
    //   });
    // };

    // distribution_start_date: new Date(values.distribution_start_date)
    //       .toISOString()
    //       .substr(0, 10),
    //     distribution_end_date: new Date(values.distribution_end_date)
    //       .toISOString()
    //       .substr(0, 10),

    const handleSubmit = (values) => {
      console.log(JSON.stringify(values))
      let post_code = values.post_code;
      values = {
        campaign_id: values.campaign_id,
        name: values.name,
        post_supervisor_user_id: values.post_supervisor_user_id,
        villages: values.villages,
        isFacility: values.isFacility,
      };
      console.log(values);

      if (post_code) {
        values.post_code = post_code;
      }
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log(".......... ");
          console.log(API_URL);
          if (data.success == true) {
            router.push("/nets/distribution");
            notification["success"]({
              message: "Post Created",
              description: `Post Created successfully.`,
              duration: 5.5,
            });
          } else {
            notification["error"]({
              message: "Post Creation Failed",
              description: `Post Creation failed.`,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    return {
      isLoading,
      loading,
      apiUrl,
      isFileLoading,
      isFacility,
      handleSubmit,
      dateFormat,
      formState,
      join,
      villages,
      users,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default AddNew;
</script>
