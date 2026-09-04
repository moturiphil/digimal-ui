<template>
  <Main>
    <div class="activity-pageheader">
      <div class="activity-pageheader-text">
        <span class="activity-pageheader-icon">
          <sdFeatherIcons type="activity" size="18" />
        </span>
        <div>
          <h2 class="activity-pageheader-title">Create an Activity</h2>
          <p class="activity-pageheader-sub">
            Set up a new field activity under a campaign and assign the officers who will run it.
          </p>
        </div>
      </div>
      <router-link to="/activities/view-activities" class="activity-pageheader-link">
        <sdFeatherIcons type="list" size="14" />
        <span>View all activities</span>
      </router-link>
    </div>

    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="20" :md="20" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form activity-form-shell"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addactivity"
                    :model="formState"
                    @finish="onSubmit"
                  >
                    <!-- Section: Campaign & Activity -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="flag" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Campaign &amp; Activity</h4>
                          <p class="section-sub">
                            What campaign is this activity under and what type of activity is it?
                          </p>
                        </div>
                      </div>
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
                    </div>
                    <!-- /Campaign & Activity -->

                    <!-- Section: Location -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="map-pin" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Location</h4>
                          <p class="section-sub">
                            Where will this activity take place?
                          </p>
                        </div>
                      </div>

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

                      <p v-if="isSubCounty" class="facilitator-hint">
                        Your activity will be attached to your sub-county location automatically.
                      </p>
                    </div>
                    <!-- /Location -->

                    <!-- Section: Schedule & Team -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="calendar" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Schedule &amp; Team</h4>
                          <p class="section-sub">
                            Set the start date, duration and the officers assigned to run the activity.
                          </p>
                        </div>
                      </div>

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
                        <a-input-number
                          style="width: 100%"
                          v-model:value="formState.number_of_days"
                          placeholder="No of Days"
                          :min="1"
                          :precision="0"
                          @blur="validate('number_of_days')"
                          @change="validate('number_of_days')"
                          @keypress="validate('number_of_days')"
                        />
                        <p
                          class="facilitator-hint"
                          v-if="computedPayableTravelDays"
                        >
                          {{ computedPayableTravelDays }} payable travel day(s) set for the selected activity type.
                        </p>
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
                        <a-input-number
                          style="width: 100%"
                          v-model:value="formState.number_of_officers"
                          placeholder="No of Officers"
                          :min="1"
                          :precision="0"
                          @blur="validate('number_of_officers')"
                          @change="validate('number_of_officers')"
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
                          @blur="validate('activity_facilitator')"
                          @keypress="validate('activity_facilitator')"
                          @change="handleOfficerChange"
                          show-search
                          @search="handleSearch"
                          option-filter-prop="label"
                        >
                          <a-select-option
                            v-for="facilitator in users"
                            :key="facilitator.id"
                            :value="facilitator.id"
                            :label="`${facilitator.first_name} ${facilitator.last_name} - ${facilitator.role_id}`"
                            :disabled="
                              officerSelectionMaxed &&
                              !formState.activity_facilitator.includes(
                                facilitator.id
                              )
                            "
                          >
                            {{ facilitator.first_name }}
                            {{ facilitator.last_name }} -
                            {{ facilitator.role_id }}
                          </a-select-option>
                        </a-select>
                        <p class="facilitator-hint">
                          Select the officers who will run the activity.
                          <span v-if="formState.number_of_officers > 0">
                            Maximum {{ formState.number_of_officers }}
                            officer{{ formState.number_of_officers === 1 ? "" : "s" }}.
                          </span>
                        </p>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.activity_facilitator"
                        >
                          {{ errors.activity_facilitator }}
                        </p>
                      </a-form-item>
                    </div>
                    <!-- /Schedule & Team -->

                      <div class="activity-actions">
                        <router-link
                          to="/activities/view-activities"
                          class="btn-cancel"
                        >
                          Cancel
                        </router-link>
                        <sdButton
                          size="default"
                          class="btn-save"
                          htmlType="Save"
                          type="success"
                          :disabled="isSubmitting || submitted"
                        >
                          <sdFeatherIcons type="check" size="14" />
                          <span>{{
                            isLoading
                              ? "Loading..."
                              : isSubmitting
                                ? "Processing ..."
                                : submitted
                                  ? "Activity Created"
                                  : "Submit"
                          }}</span>
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
import { RecordFormWrapper } from "../activities/style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import {
  reactive,
  ref,
  defineComponent,
  computed,
  onMounted,
  nextTick,
  watch,
} from "vue";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";
import authHeader from "../../../services/auth-header";
import dayjs from "dayjs";
import * as Yup from "yup";
import store from "../../../vuex/store";

const dateFormat = "YYYY-MM-DD";

/**
 * Org-unit list endpoints (/get_counties, /get_sub_counties_list, ...) return a
 * plain array on some deployments and a wrapper object ({ success, data }) on
 * others. Normalize both shapes before consuming the response.
 */
const normalizeOrgUnitResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
};
const AddActivity = defineComponent({
  name: "AddActivity",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  computed: {
    officerSelectionMaxed() {
      return (
        this.formState.number_of_officers > 0 &&
        this.formState.activity_facilitator.length >=
          this.formState.number_of_officers
      );
    },
    computedPayableTravelDays() {
      const activity = this.activities.find(
        (activity) => activity.id === this.formState.activity_id
      );
      // console.log(activity);
      return activity ? activity.payable_travel_days : 0;
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
    const loading = ref(true);
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
      activity_id: Yup.string().required("Activity Name is required"),
      campaign_id: Yup.string().required("Campaign is required"),
      start_date: Yup.string().required("Activity Start Date is required"),
      number_of_officers: Yup.number()
        .typeError("No of officers must be a number")
        .integer("No of officers must be a whole number")
        .min(1, "No of officers must be at least 1")
        .required("No of officers is required"),
      number_of_days: Yup.number()
        .typeError("No of days must be a number")
        .integer("No of days must be a whole number")
        .min(1, "No of days must be greater than 0")
        .required("No of days is required"),
      activity_facilitator: Yup.array()
        .min(1, "At least 1 officer is required")
        .required("At least 1 officer is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    // Tracks whether the activity has been successfully submitted. Once true,
    // the submit button is disabled so users cannot create duplicate
    // activities by clicking submit again after a successful save.
    const submitted = ref(false);

    // Human-friendly labels used in error notifications so users can quickly
    // identify which field failed validation.
    const fieldLabels = {
      activity_id: "Activity Name",
      county_id: "Counties",
      sub_county_id: "Sub County",
      campaign_id: "Campaign",
      start_date: "Activity Start Date",
      number_of_officers: "No of Officers",
      number_of_days: "No of Days",
      activity_facilitator: "Officers",
      description: "Description",
    };

    // Scrolls to the first field that has an error so the user can see and
    // fix the issue immediately.
    const scrollToField = (fieldName) => {
      if (!fieldName) return;
      nextTick(() => {
        const el =
          document.querySelector(
            `.activity-form-shell [name="${fieldName}"]`
          ) ||
          document.querySelector(
            `.activity-form-shell [id$="_${fieldName}"]`
          );
        const target = el ? el.closest(".ant-form-item") || el : null;
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof el.focus === "function") {
            setTimeout(() => el.focus({ preventScroll: true }), 350);
          }
        }
      });
    };

    // Maps backend validation field names back to our form fields.
    const mapBackendField = {
      activity_list_id: "activity_id",
      number_of_days: "number_of_days",
      number_of_officers: "number_of_officers",
      activity_facilitator: "activity_facilitator",
      campaign_id: "campaign_id",
      start_date: "start_date",
      counties: "counties",
      subcounties: "sub_county_id",
    };

    // Some backend failures are reported only through a plain message string
    // (e.g. "Number of days must be greater than 0."). Infer the related form
    // field so it can still be highlighted and scrolled to.
    const inferErrorField = (msg = "") => {
      const m = String(msg).toLowerCase();
      if (m.includes("day")) return "number_of_days";
      if (m.includes("count")) return "counties";
      if (m.includes("officer") || m.includes("facilitator")) {
        return "activity_facilitator";
      }
      if (m.includes("campaign")) return "campaign_id";
      return null;
    };

    // Enforces the maximum number of officers on the officers picker. Any
    // selection beyond the officer count is trimmed and the user is warned.
    const handleOfficerChange = (value) => {
      const max = Number(formState.number_of_officers) || 0;
      if (Array.isArray(value) && max > 0 && value.length > max) {
        formState.activity_facilitator = value.slice(0, max);
        notification.warning({
          message: "Officer limit reached",
          description: `You can only select up to ${max} officers for this activity.`,
          duration: 4,
        });
      }
      validate("activity_facilitator");
    };

    // Auto-fill "No of Days" from the selected activity's payable travel days
    // when the user has not entered a value yet.
    watch(
      () => formState.activity_id,
      (newVal, oldVal) => {
        if (!newVal) return;
        const activity = activities.find((act) => act.id === newVal);
        if (!activity || !activity.payable_travel_days) return;
        if (
          oldVal == null ||
          formState.number_of_days == null ||
          formState.number_of_days <= 0
        ) {
          formState.number_of_days = activity.payable_travel_days;
        }
      }
    );

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
      // /get_counties returns { success: true, data: [...] } (and, on some
      // deployments, a plain array) - normalize before mapping.
      const countiesList = normalizeOrgUnitResponse(data);
      this.counties = countiesList.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      console.log(this.counties);
      loading.value = false;
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
        this.sub_counties = normalizeOrgUnitResponse(data);
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
        this.sub_counties = normalizeOrgUnitResponse(data);
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
    const submitActivity = (values) => {
      store.commit("setIsSubmitting", true);
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
            .then(async (response) => {
              const json = await response.json().catch(() => ({}));
              return { ok: response.ok, status: response.status, json };
            })
            .then(({ ok, status, json }) => {
              const { success, data, message, errors: apiErrors } = json || {};
              if (ok && success) {
                store.commit("setIsSubmitting", false);
                submitted.value = true;
                router.push("activity-pending-approval");
                notification["success"]({
                  message: "Activity Created",
                  description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
                  duration: 5.5,
                });
                return;
              }

              // Server responded with a failure - surface each field error
              // and point the user to the exact place where the error is.
              store.commit("setIsSubmitting", false);
              const fieldMessages = [];
              let firstErrorField = null;

              if (apiErrors && typeof apiErrors === "object") {
                Object.entries(apiErrors).forEach(([field, msgs]) => {
                  const formField = mapBackendField[field] || field;
                  const first = Array.isArray(msgs) ? msgs[0] : String(msgs);
                  if (this.errors && formField in this.errors) {
                    this.errors[formField] = first;
                  }
                  if (!firstErrorField) firstErrorField = formField;
                  const label = fieldLabels[formField] || formField;
                  fieldMessages.push(`• ${label}: ${first}`);
                });
              } else if (message) {
                // Some failures (e.g. "Number of days must be greater than 0.")
                // only come back as a plain message - infer the related field.
                const inferred = inferErrorField(message);
                if (inferred && this.errors && inferred in this.errors) {
                  this.errors[inferred] = message;
                }
                if (!firstErrorField) firstErrorField = inferred;
                fieldMessages.push(`• ${message}`);
              }

              notification["error"]({
                message: message
                  ? `Error: ${message}`
                  : `Failed to create activity${status ? ` (HTTP ${status})` : ""}`,
                description:
                  fieldMessages.length > 0
                    ? fieldMessages.join("\n")
                    : "The activity could not be created. Please review the form and try again.",
                duration: 7,
                style: { whiteSpace: "pre-line" },
              });
              scrollToField(firstErrorField);
            })
            .catch((error) => {
              store.commit("setIsSubmitting", false);
              notification["error"]({
                message: "Network Error",
                description: `Unable to reach the server: ${error}. Please check your connection and try again.`,
                duration: 7,
              });
            });
        })
        .catch((err) => {
          store.commit("setIsSubmitting", false);
          const fieldMessages = [];
          let firstErrorField = null;
          if (err && Array.isArray(err.inner)) {
            err.inner.forEach((e) => {
              if (this.errors && e.path in this.errors) {
                this.errors[e.path] = e.message;
              }
              if (!firstErrorField) firstErrorField = e.path;
              const label = fieldLabels[e.path] || e.path;
              fieldMessages.push(`• ${label}: ${e.message}`);
            });
          }
          notification.error({
            message: "Please fix the highlighted fields",
            description:
              fieldMessages.length > 0
                ? fieldMessages.join("\n")
                : "An error has occurred. Please try again later.",
            duration: 7,
            style: { whiteSpace: "pre-line" },
          });
          scrollToField(firstErrorField);
        });
    };

    const onSubmit = () => {
      // Guard against duplicate submissions.
      if (submitted.value || isSubmitting.value) {
        return;
      }
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
        submitActivity(values);
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
        submitActivity(values);
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
        submitActivity(values);
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
      submitted,
      loading,
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
      handleOfficerChange,
      errors: {
        activity_id: "",
        counties: "",
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

<style lang="less" scoped>
.activity-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 24px 4px 18px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eef2f5;
}
.activity-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.activity-pageheader-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.activity-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.activity-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 640px;
  line-height: 1.5;
}
.activity-pageheader-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e6ecef;
  color: #15693c !important;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: #eafff5;
    border-color: #c9e6d3;
  }
}

.activity-form-shell {
  padding: 4px 2px 0;
}
.section-card {
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 12px;
  padding: 18px 20px 6px;
  margin-bottom: 18px;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.04);
}
.section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eef2f5;
}
.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #15693c;
  letter-spacing: 0.3px;
}
.section-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.5;
}

.activity-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 4px 6px;
  margin-top: 4px;
  border-top: 1px solid #eef2f5;
}
.btn-cancel {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #e6ecef;
  background: #fff;
  color: #5a6470 !important;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: #f4f7fa;
    border-color: #d8dee3;
  }
}
.btn-save {
  border-radius: 999px !important;
  padding: 0 22px !important;
  height: 38px !important;
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(31, 146, 84, 0.25);
}

.facilitator-hint {
  margin: 6px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.4;
}
</style>
