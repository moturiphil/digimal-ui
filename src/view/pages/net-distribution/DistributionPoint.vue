<template>
  <sdPageHeader title="Create Distribution Point">
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
                    <a-form-item name="Campaign" label="Select Campaign">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        v-model:value="formState.campaign"
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
                    <a-form-item name="name" label="Distribution Point Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Enter name of the distribution point"
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
                    <a-form-item name="county_id" label="County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-on:change="getSubCounties($event)"
                        v-model:value="formState.county_id"
                        v-if="!loading"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="county in counties"
                          :value="county.org_id"
                          :key="county.id"
                          :org_id="county.org_id"
                        >
                          {{ county.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item name="sub_county" label="Sub County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Sub-County"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="scounty in sub_counties"
                          :value="scounty.org_id"
                          :key="scounty.id"
                          >{{ scounty.name }}</a-select-option
                        >
                      </a-select>
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

    const { villages, loading, isFacility, users, campaigns } = reactive({
      campaigns: [],
      counties: [],
      sub_counties: [],
      loading: true,
      isFacility: false,
    });

    const formState = reactive({
      name: "",
      campaigns: "",
      county_id: "",
      sub_county: "",
    });

    //campaigns
    const getCampaigns = async () => {
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

    //counties
    //counties
    const getCounties = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/counties`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      const data = await response.json();
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      // console.log(this.counties);
      this.loading = false;
    };

    //get sub_counties
    const getSubCounties = async (org_id) => {
      // console.log(org_id);
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${org_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      this.sub_counties = data.message;
    };

    onMounted(() => {
      getCounties();
      getCampaigns();
      getSubCounties();
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
      let post_code = values.post_code;
      values = {
        name: values.name,
        distribution_start_date: "2023-01-01",
        distribution_end_date: "2023-01-01",
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
      campaigns
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
