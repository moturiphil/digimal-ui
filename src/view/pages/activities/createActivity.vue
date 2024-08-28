<template>
  <Main>
    <sdPageHeader title="Create an Activity" />
    <a-row :gutter="15">
      <a-col :xs="24">
        <div class="col-md-6 col-sm-12">
          <RecordFormWrapper>
            <sdCards headless>
              <a-row justify="center">
                <a-col :xl="10" :md="16" :xs="24" order="flex">
                  <BasicFormWrapper>
                    <a-form
                      class="add-record-form"
                      :style="{ width: '100%' }"
                      layout="vertical"
                      name="addactivity"
                      :model="formState"
                      @finish="onSubmit"
                    >
                      <a-form-item name="campaign_id" label="Campaign">
                        <a-select
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          placeholder="Select Campaign"
                          v-model:value="formState.campaign_id"
                          @blur="validate('campaign_id')"
                          @keypress="validate('campaign_id')"
                          show-search
                          option-filter-prop="label"
                        >
                          <a-select-option value="" disabled
                            >Select a campaign</a-select-option
                          >
                          <a-select-option
                            v-for="campaign in campaigns"
                            :value="campaign.id"
                            :key="campaign.id"
                            :label="campaign.name"
                            >{{ campaign.name }}</a-select-option
                          >
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.campaign_id"
                        >
                          {{ errors.campaign_id }}
                        </p>
                      </a-form-item>
                      <a-form-item name="activity_id" label="Activity Name">
                        <a-select
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          placeholder="Select Activity"
                          v-model:value="formState.activity_id"
                          show-search
                          option-filter-prop="label"
                          @blur="validate('activity_id')"
                          @keypress="validate('activity_id')"
                        >
                          <a-select-option value=""
                            >Select an Activity</a-select-option
                          >
                          <a-select-option
                            v-for="activity in activities"
                            :value="activity.id"
                            :key="activity.id"
                            :label="activity.name"
                            >{{ activity.name }}</a-select-option
                          >
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.activity_id"
                        >
                          {{ errors.activity_id }}
                        </p>
                      </a-form-item>

                      <a-form-item name="description" label="Description">
                        <a-textarea
                          v-model:value="formState.description"
                          placeholder="Write a narrative that describes the activity of the campaign"
                          :rows="4"
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.description"
                        >
                          {{ errors.description }}
                        </p>
                      </a-form-item>

                      <a-form-item
                        name="counties"
                        label="Counties"
                        v-if="isNational"
                      >
                        <a-select
                          mode="multiple"
                          v-model:value="formState.counties"
                          v-if="!loading"
                          placeholder="Select counties"
                          show-search
                          option-filter-prop="label"
                          @change="handleChange"
                        >
                          <a-select-option
                            v-for="county in counties"
                            :key="county.id"
                            :value="county.id"
                            :label="`${county.name}`"
                          >
                            {{ county.name }}
                          </a-select-option>
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.counties"
                        >
                          {{ errors.counties }}
                        </p>
                      </a-form-item>
                      <a-form-item
                        name="sub_county_id"
                        label="Sub County"
                        v-if="isCounty"
                      >
                        <a-select
                          mode="multiple"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          placeholder="Select Sub-County"
                          v-model:value="formState.sub_counties"
                          show-search
                          option-filter-prop="label"
                        >
                          <a-select-option
                            v-for="scounty in sub_counties"
                            :value="scounty.id"
                            :key="scounty.id"
                            :label="scounty.name"
                            >{{ scounty.name }}</a-select-option
                          >
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.sub_county_id"
                        >
                          {{ errors.sub_county_id }}
                        </p>
                      </a-form-item>

                      <a-form-item
                        name="start_date"
                        label="Activity Start Date"
                      >
                        <a-date-picker
                          :style="{ width: '100%' }"
                          v-model:value="formState.start_date"
                          :format="dateFormat"
                          :disabledDate="disabledDate"
                          @blur="validate('start_date')"
                          @keypress="validate('start_date')"
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.start_date"
                        >
                          {{ errors.start_date }}
                        </p>
                      </a-form-item>
                      <!-- no of days as number -->
                      <a-form-item name="number_of_days" label="No of Days">
                        <a-input
                          v-model:value="formState.number_of_days"
                          placeholder="No of Days"
                          type="number"
                          min="0"
                          :value="computedPayableTravelDays"
                          @blur="validate('number_of_days')"
                          @keypress="validate('number_of_days')"
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.number_of_days"
                        >
                          {{ errors.number_of_days }}
                        </p>
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
                          @blur="validate('number_of_officers')"
                          @keypress="validate('number_of_officers')"
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.number_of_officers"
                        >
                          {{ errors.number_of_officers }}
                        </p>
                      </a-form-item>

                      <a-form-item name="activity_facilitator" label="Officers">
                        <a-select
                          mode="multiple"
                          v-model:value="formState.activity_facilitator"
                          placeholder="Please select"
                          :disabled="isOfficerSelectionDisabled"
                          @blur="validate('activity_facilitator')"
                          @keypress="validate('activity_facilitator')"
                          show-search
                          @search="handleSearch"
                          option-filter-prop="label"
                          :options="
                            (() => {
                              return users.map(
                                ({ first_name, last_name, role_id, id }) => ({
                                  label: `${first_name} ${last_name} - ${role_id}`,
                                  value: id,
                                })
                              );
                            })()
                          "
                        >
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.activity_facilitator"
                        >
                          {{ errors.activity_facilitator }}
                        </p>
                      </a-form-item>

                      <div class="record-form-actions text-right">
                        &nbsp;&nbsp;&nbsp;
                        <sdButton
                          size="default"
                          htmlType="Save"
                          type="success"
                          :disabled="isSubmitting"
                        >
                          {{
                            isLoading
                              ? "Loading..."
                              : isSubmitting
                                ? "Processing ..."
                                : "Submit"
                          }}
                        </sdButton>
                      </div>
                    </a-form>
                  </BasicFormWrapper>
                </a-col>
              </a-row>
            </sdCards>
          </RecordFormWrapper>
        </div>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { RecordFormWrapper } from "../activities/style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";
import authHeader from "../../../services/auth-header";
import dayjs from "dayjs";
import * as Yup from "yup";
import store from "../../../vuex/store";

const dateFormat = "YYYY-MM-DD";
const AddActivity = defineComponent({
  name: "AddActivity",
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
      // console.log(activity);
      return activity ? activity.payable_travel_days : 1;
    },
  },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const router = useRouter();
    const join = ref("");
    const users = ref([]);
    const searchItem = ref("");
    const { activities, counties, campaigns, sub_counties } = reactive({
      activities: [],
      counties: [],
      campaigns: [],
      sub_counties: [],
    });
    const API_URL = `${process.env.VUE_APP_BASE_URL}/create_activity_with_facilitator`;
    const formState = reactive({
      activity_id: "",
      counties: "",
      sub_counties: "",
      campaign_id: "",
      start_date: "",
      number_of_officers: 0,
      number_of_days: 0,
      activity_facilitator: [],
      description: "",
    });
    const ArticleSchema = Yup.object().shape({
      activity_id: Yup.string().required("Name is required"),
      campaign_id: Yup.string().required("Campaign is required"),
      start_date: Yup.string().required("Start Date is required"),
      number_of_officers: Yup.number().required("Officers is required"),
      number_of_days: Yup.number().required("Days is required"),
      activity_facilitator: Yup.array()
        .min(1, "At least 1 facilitator required")
        .required(),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    // get users location
    // const level_id = ref("");
    const userData = JSON.parse(sessionStorage.getItem("user"));
    console.log(userData.user);

    const isNational = computed(() => {
      if (userData.user.level_id == 1) {
        return true;
      } else {
        return false;
      }
    });
    const isCounty = computed(() => {
      if (userData.user.level_id == 2) {
        return true;
      } else {
        return false;
      }
    });

    console.log(isCounty.value);

    const isSubCounty = computed(() => {
      if (userData.user.level_id == 3) {
        return true;
      } else {
        return false;
      }
    });

    console.log(isNational.value);

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
      // console.log(data.data);
      this.activities = data.data;
      // console.log(data);
    };
    //counties
    const getCounties = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_counties`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );

      const data = await response.json();
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      console.log(this.counties);
      this.loading = false;
    };
    const getUsers = async () => {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/users?query=${searchItem.value}`, { headers: authHeader() })
        .then(function ({ data }) {
          // console.log({ data: data.data });
          users.value = data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const handleSearch = (value) => {
      console.log(value);
      searchItem.value = value;
      getUsers();
    };

    //get sub_counties
    const getSubCounties = async (org_id) => {
      console.log(org_id);
      console.log(isNational.value);
      // if National, provide a fetch for county and subcounty
      if (isNational.value) {
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
      }
      // else list children org units of the logged in user
      else {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/list_users_subcounties`,
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
        this.sub_counties = data.data;
      }
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
    const onSubmit = () => {
      store.commit("setIsSubmitting", true);
      console.log("Checking the level of the user");
      console.log(isSubCounty.value);
      console.log(isCounty.value);
      if (isSubCounty.value) {
        const values = {
          campaign_id: formState.campaign_id,
          activity_list_id: formState.activity_id,
          counties: formState.counties,
          subcounties: userData.user.sub_counties,
          start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
          number_of_officers: formState.number_of_officers,
          number_of_days: formState.number_of_days,
          activity_facilitator: formState.activity_facilitator,
          description: formState.description,
        };
        console.log(JSON.stringify(values));
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            this.errors = {};
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
                // console.log(data);
                if (success) {
                  store.commit("setIsSubmitting", false);
                  router.push("activity-pending-approval");
                  notification["success"]({
                    message: "Activity Created",
                    description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
                    duration: 5.5,
                  });
                }
              })
              .catch((error) => {
                store.commit("setIsSubmitting", false);
                notification.error({
                  message: "Could not submit!",
                  description: "An error has occured. Please try again later.",
                });
                console.error("Error:", error);
              });
          })
          .catch((err) => {
            store.commit("setIsSubmitting", false);
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      } else if (isCounty.value) {
        const values = {
          campaign_id: formState.campaign_id,
          activity_list_id: formState.activity_id,
          counties: formState.counties,
          subcounties: formState.sub_counties.filter((sub_counties) => sub_counties !== ""),
          start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
          number_of_officers: formState.number_of_officers,
          number_of_days: formState.number_of_days,
          activity_facilitator: formState.activity_facilitator,
          description: formState.description,
        };
        console.log(JSON.stringify(values));
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            this.errors = {};
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
                // console.log(data);
                if (success) {
                  store.commit("setIsSubmitting", false);
                  router.push("activity-pending-approval");
                  notification["success"]({
                    message: "Activity Created",
                    description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
                    duration: 5.5,
                  });
                }
              })
              .catch((error) => {
                store.commit("setIsSubmitting", false);
                notification.error({
                  message: "Could not submit!",
                  description: "An error has occured. Please try again later.",
                });
                console.error("Error:", error);
              });
          })
          .catch((err) => {
            store.commit("setIsSubmitting", false);
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      } else {
        const values = {
          campaign_id: formState.campaign_id,
          activity_list_id: formState.activity_id,
          counties: formState.counties.filter((county) => county !== ""),
          subcounties: userData.user.sub_counties,
          start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
          number_of_officers: formState.number_of_officers,
          number_of_days: formState.number_of_days,
          activity_facilitator: formState.activity_facilitator,
          description: formState.description,
        };
        console.log(JSON.stringify(values));
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            this.errors = {};
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
                // console.log(data);
                if (success) {
                  store.commit("setIsSubmitting", false);
                  router.push("activity-pending-approval");
                  notification["success"]({
                    message: "Activity Created",
                    description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
                    duration: 5.5,
                  });
                }
              })
              .catch((error) => {
                store.commit("setIsSubmitting", false);
                notification.error({
                  message: "Could not submit!",
                  description: "An error has occured. Please try again later.",
                });
                console.error("Error:", error);
              });
          })
          .catch((err) => {
            store.commit("setIsSubmitting", false);
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      }
    };
    onMounted(() => {
      getCampaigns();
      getActivityList();
      getCounties();
      getSubCounties();
      getUsers();
    });
    return {
      isLoading,
      isSubmitting,
      apiUrl,
      users,
      isFileLoading,
      getSubCounties,
      activities,
      counties,
      sub_counties,
      campaigns,
      onSubmit,
      dateFormat,
      formState,
      join,
      participants: [],
      validate,
      isNational,
      isCounty,
      isSubCounty,
      handleSearch,
      errors: {
        activity_id: "",
        county_id: "",
        sub_county_id: "",
        campaign_id: "",
        start_date: "",
        number_of_officers: "",
        number_of_days: "",
        activity_facilitator: "",
      },
    };
  },
  methods: {
    disabledDate(date) {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Disable dates before today, but include today
      return date && date < today ? true : false;
    },

    showModal() {
      this.visible = true;
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
});
export default AddActivity;
</script>
