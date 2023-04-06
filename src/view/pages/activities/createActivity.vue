<template>
  <sdPageHeader title="Create an Activity">
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
              <a-col :xl="10" :md="16" :xs="24" order="flex">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item name="activity_id" label="Activity Name">
                      <a-select
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Activity"
                        v-model:value="formState.activity_id"
                      >
                        <a-select-option value=""
                          >Select an Activity</a-select-option
                        >
                        <a-select-option
                          v-for="activity in activities"
                          :value="activity.id"
                          :key="activity.id"
                          >{{ activity.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>

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

                    <a-form-item name="campaign_id" label="Campaign">
                      <a-select
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-model:value="formState.campaign_id"
                      >
                        <a-select-option value="" disabled
                          >Select a campaign</a-select-option
                        >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :value="campaign.id"
                          :key="campaign.id"
                          >{{ campaign.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>

                    <a-form-item name="start_date" label="Activity Start Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.start_date"
                        :format="dateFormat"
                        :disabledDate="disabledDate"
                      />
                    </a-form-item>

                    <!-- <a-form-item name="end_date" label="Activity End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.end_date"
                        :format="dateFormat"
                      />
                    </a-form-item> -->
                    <a-form-item
                      name="payable_travel_days"
                      label="Payable Travel Days"
                    >
                      <a-input
                        v-model:value="formState.payable_travel_days"
                        placeholder="Payable Travel Days"
                        type="number"
                        default-value="1"
                        min="0"
                      />
                    </a-form-item>
                    <!-- no of officers as number -->
                    <a-form-item
                      name="number_of_officers"
                      label="No of Officers"
                    >
                      <a-input
                        v-model:value="formState.number_of_officers"
                        placeholder="No of Officers"
                        type="number"
                        min="0"
                        :value="computedPayableTravelDays"
                      />
                    </a-form-item>

                    <a-form-item name="activity_facilitator" label="Officers">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.activity_facilitator"
                        placeholder="Please select"
                        :disabled="isOfficerSelectionDisabled"
                        :options="
                          (() => {
                            return users.map(
                              ({ first_name, last_name, id }) => ({
                                label: `${first_name} ${last_name}`,
                                value: id,
                              })
                            );
                          })()
                        "
                      >
                      </a-select>
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <!-- <sdButton
                        @click="
                          showConfirmModal(formState.activity_facilitator)
                        "
                        size="small"
                        type="success"
                      >
                        <sdFeatherIcons type="check-square" size="17" />
                        &nbsp;&nbsp; Confirm Officers
                      </sdButton> -->
                      &nbsp;&nbsp;&nbsp;
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
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";
import authHeader from "../../../services/auth-header";
import { Modal } from "ant-design-vue";
const dateFormat = "YYYY-MM-DD";
const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  computed: {
    isOfficerSelectionDisabled() {
      return (
        this.formState.activity_facilitator.length >=
        this.formState.number_of_officers
      );
    },
    computedPayableTravelDays() {
      const activity = this.activities.find(
        (activity) => activity.id === this.formState.activity_id
      );
      console.log(activity);
      return activity ? activity.payable_travel_days : 1;
    },
  },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const router = useRouter();
    const join = ref("");
    const users = ref([]);
    const { activities, counties, campaigns, sub_counties } = reactive({
      activities: [],
      counties: [],
      campaigns: [],
      sub_counties: [],
    });
    const API_URL = `${process.env.VUE_APP_BASE_URL}/create_activity_with_facilitator`;
    const formState = reactive({
      activity_id: "",
      county_id: "",
      campaign_id: "",
      start_date: "",
      end_date: "",
      payable_travel_days: "",
      number_of_officers: "",
      activity_facilitator: [],
    });

    //get activities list

    const getActivityList = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/activity_list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      this.activities = data.data;
      // console.log(data);
    };
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
      console.log(this.counties);
      this.loading = false;
    };

    //get sub_counties
    const getSubCounties = async (org_id) => {
      console.log(org_id);
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
      console.log(data);
      this.sub_counties = data.message;
    };
    //campaigns
    const getCampaigns = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/campaign_all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      this.campaigns = data.data;
    };
    // const handleSelect = (values)
    const handleSubmit = (values) => {
      values = {
        activity_list_id: values.activity_id,
        county_id: 1,
        // sub_county_id: values.sub_county_id,
        campaign_id: values.campaign_id,
        start_date: new Date(values.start_date.$d).toISOString().substr(0, 10),
        // end_date: new Date(values.end_date.$d).toISOString().substr(0, 10),
        // payable_travel_days: values.payable_travel_days,
        number_of_officers: values.number_of_officers,
        activity_facilitator: values.activity_facilitator,
      };
      console.log({ values });

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(({ success, data }) => {
          console.log(data);
          if (success) {
            router.push("activity-view");
            notification["success"]({
              message: "Activity Created",
              description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    onMounted(() => {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/users`, { headers: authHeader() })
        .then(function ({ data }) {
          console.log({ data: data.data });
          users.value = data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      getCounties();
      getCampaigns();
      getSubCounties();
      getActivityList();
    });
    return {
      isLoading,
      apiUrl,
      users,
      isFileLoading,
      getSubCounties,
      activities,
      counties,
      sub_counties,
      campaigns,
      handleSubmit,
      dateFormat,
      formState,
      join,
      participants: [],
    };
  },
  methods: {
    disabledDate(date) {
      // Get today's date
      const today = new Date();
      // Disable dates before today
      return date && date < today;
    },
    showModal() {
      this.visible = true;
    },
    showConfirmModal(activity_facilitator) {
      console.log(activity_facilitator);
      Modal.success({
        title: "Activity Officers",
        content: (
          <div>
            <p>Confirm Officers Participating</p>
            <ul>
              {activity_facilitator.map((facilitator) => (
                <li key={facilitator}>{facilitator}</li>
              ))}
            </ul>
          </div>
        ),
        okText: "Register",
        onOk: async () => {
          // handle form submission here rk
        },
        style: {
          float: "center",
          display: "grid",
          placeContent: "center",
        },
      });
    },
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.colorVisible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
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
