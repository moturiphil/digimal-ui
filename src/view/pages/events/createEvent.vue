<template>
  <Main>
    <sdPageHeader title="Create Event">
      <sdButton class="btn-add_new" size="default" key="1" type="success">
        <router-link to="/crud/axios-view">View All</router-link>
      </sdButton>
    </sdPageHeader>
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
                    <a-form-item name="campaign_id" label="Campaign Name">
                      <a-select
                        v-model:value="formState.campaign_id"
                        v-if="!loading"
                        placeholder="Select Campaign Name"
                        @blur="validate('campaign_id')"
                        @keypress="validate('campaign_id')"
                        show-search
                        option-filter-prop="label"
                      >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :key="campaign.id"
                          :value="campaign.id"
                          :label="`${campaign.name}`"
                        >
                          {{ campaign.name }}
                        </a-select-option>
                      </a-select>
                      <p class="errors" style="color: red" v-if="!!errors.campaign_id">
                        {{ errors.campaign_id }}
                      </p>
                    </a-form-item>
                    <a-form-item label="Event Type">
                      <a-select
                        size="large"
                        name="event_list_id"
                        class="sDash_fullwidth-select"
                        placeholder="Select Event Type"
                        show-search
                        option-filter-prop="label"
                        v-model:value="formState.name"
                        @blur="validate('name')"
                        @keypress="validate('name')"
                      >
                        <a-select-option
                          v-for="event in events_list"
                          :key="event.id"
                          :value="event.id"
                          :label="`${event.name} `"
                        >
                          {{ event.name }}
                        </a-select-option>
                      </a-select>
                      <p class="errors" style="color: red" v-if="!!errors.name">
                        {{ errors.name }}
                      </p>
                    </a-form-item>
                    <a-form-item name="county_id" label="County" v-if="isLevelOne">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-on:change="getSubCounties($event)"
                        v-model:value="formState.county_id"
                        show-search
                        option-filter-prop="label"
                        v-if="!loading"
                      >
                        <a-select-option value="">Select an option</a-select-option>
                        <a-select-option
                          v-for="county in counties"
                          :value="county.id"
                          :key="county.id"
                          :org_id="county.org_id"
                          :label="`${county.name}`"
                        >
                          {{ county.name }}
                        </a-select-option>
                      </a-select>
                      <!-- <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.county_id"
                      >
                        {{ errors.county_id }}
                      </p> -->
                    </a-form-item>
                    <a-form-item name="facilitator_id" label="Host">
                      <a-select
                        placeholder="Selected Host"
                        v-model:value="formState.facilitator_id"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('facilitator_id')"
                        @keypress="validate('facilitator_id')"
                      >
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          v-model:value="facilitator.id"
                          :label="`${facilitator.first_name} ${facilitator.last_name} -${facilitator.role_id} `"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} -
                          {{ facilitator.role_id }}
                        </a-select-option>
                      </a-select>
                      <p class="errors" style="color: red" v-if="!!errors.facilitator_id">
                        {{ errors.facilitator_id }}
                      </p>
                    </a-form-item>

                    <a-form-item label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.trainer_id"
                        v-if="!loading"
                        placeholder="Select facilitators"
                        show-search
                        option-filter-prop="label"
                        @change="handleChange"
                        @blur="validate('trainer_id')"
                        @keypress="validate('trainer_id')"
                      >
                        <a-select-option
                          v-for="trainer in facilitators"
                          :key="trainer.id"
                          :value="trainer.id"
                          :label="`${trainer.first_name} ${trainer.last_name} -${trainer.role_id} `"
                        >
                          {{ trainer.first_name }}
                          {{ trainer.last_name }} - {{ trainer.role_id }}
                        </a-select-option>
                      </a-select>
                      <p class="errors" style="color: red" v-if="!!errors.trainer_id">
                        {{ errors.trainer_id }}
                      </p>
                    </a-form-item>

                    <a-form-item name="no-of-days" label="No of Days">
                      <a-input-number
                        type="number"
                        v-model:value="formState.no_of_days"
                        placeholder="No of Days"
                        :min="0"
                        @blur="validate('no_of_days')"
                        @keypress="validate('no_of_days')"
                      />
                      <p class="errors" style="color: red" v-if="!!errors.no_of_days">
                        {{ errors.no_of_days }}
                      </p>
                    </a-form-item>

                    <a-form-item name="venue" label="Venue">
                      <a-input
                        v-model:value="formState.venue"
                        placeholder="Input Venue"
                        @blur="validate('venue')"
                        @keypress="validate('venue')"
                      />
                      <p class="errors" style="color: red" v-if="!!errors.venue">
                        {{ errors.venue }}
                      </p>
                    </a-form-item>
                    <div class="record-form-actions text-right">
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
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { useRouter } from "vue-router";
import * as Yup from "yup";
import store from "../../../vuex/store";

// testing app

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    // const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/with_facilitator`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const facilitator_url = `${process.env.VUE_APP_BASE_URL}/activity_officers`;

    const trainer_url = `${process.env.VUE_APP_BASE_URL}/activity_officers`;

    const events_url = `${process.env.VUE_APP_BASE_URL}/events_list`;

    const logged_in_user = sessionStorage.getItem("user");

    const user_data = JSON.parse(logged_in_user);

    const {
      campaigns,
      facilitators,
      loading,
      counties,
      sub_counties,
      events_list,
      funding_agencies,
    } = reactive({
      campaigns: "",
      loading: true,
      facilitators: [],
      counties: [],
      sub_county_id: "",
      events_list: [],
      funding_agencies: [
        { id: 1, name: "Global Fund" },
        { id: 2, name: "PMI" },
      ],
    });

    const fetchEvents = async () => {
      const response = await fetch(events_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.events_list = data.data;
      console.log(this.events_list);
      this.loading = false;
    };

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
    const fetchFacilitators = async () => {
      const response = await fetch(facilitator_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      const transformedData = data.data.map((fac) => ({
        ...fac,
        label: `${fac.first_name} ${fac.last_name} - ${fac.role_id}`,
      }));
      this.facilitators = transformedData;
      // console.log(data.data);
      this.loading = false;
    };
    const fetchTrainer = async () => {
      const response = await fetch(trainer_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.facilitators = data.data;
      // console.log(data.data);
      this.loading = false;
    };

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
      this.sub_counties = data.message;
    };

    function handleChange(request, response, value) {
      console.log(value);
      getSubCounties(value);
    }

    onMounted(() => {
      getCounties();
      getSubCounties();
      fetchTrainer();
      fetchFacilitators();
      fetchCampaigns();
      fetchEvents();
    });

    const user = JSON.parse(sessionStorage.getItem("user"));

    const user_level_id = user.user.level_id;

    const isLevelOne = user_level_id === 1;

    console.log(isLevelOne);

    const formState = reactive({
      campaign_id: null,
      name: null,
      county_id: "",
      facilitator_id: "",
      trainer_id: [],
      no_of_days: null,
      venue: "",
    });

    const ArticleSchema = Yup.object().shape({
      campaign_id: Yup.string().required("Campaign is required"),
      name: Yup.string().required("Name is required"),
      // county_id: Yup.string().required(),
      facilitator_id: Yup.string().required("Host is required"),
      trainer_id: Yup.array().min(1, "At least 1 facilitator required").required(),
      no_of_days: Yup.number().required("No of days is required"),
      venue: Yup.string().required("Venue is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    console.log(user_data.user.location_id);

    const handleSubmit = () => {
      store.commit("setIsSubmitting", true);
      if (formState.county_id == "") {
        formState.county_id = user_data.user.location_id;
      }
      const data = {
        // name: formState.name,
        campaign_id: formState.campaign_id,
        venue: formState.venue,
        location_id: formState.county_id,
        facilitator: formState.facilitator_id,
        trainers: formState.trainer_id,
        number_of_days: formState.no_of_days,
        event_list_id: formState.name,
      };
      console.log(data);
      ArticleSchema.validate(this.formState, { abortEarly: false })
        .then(() => {
          fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then(({ success, data }) => {
              if (success) {
                store.commit("setIsSubmitting", false);
                // router.push("event-create");
                notification["success"]({
                  message: "Event Created",
                  description: `Event Created successfully. Your event code is ${data.event.event_code}`,
                  duration: 5.5,
                });
              }
              // show error message from the api response
              else {
                store.commit("setIsSubmitting", false);
                notification["error"]({
                  message: "Error!",
                  description: "Fail to create event",
                  duration: 5.5,
                });
              }
            })
            .catch((error) => {
              store.commit("setIsSubmitting", false);
              notification["error"]({
                message: "Error!",
                description: `${error}`,
                duration: 5.5,
              });
            });
        })
        .catch((err) => {
          store.commit("setIsSubmitting", false);
          notification.error({
            message: "Could not submit!",
            description: "An error has occured. Please try again later.",
          });
          err.inner.forEach((e) => {
            this.errors[e.path] = e.message;
          });
        });
    };

    return {
      isLoading,
      isSubmitting,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      campaigns,
      funding_agencies,
      facilitators,
      loading,
      counties,
      sub_counties,
      getSubCounties,
      handleChange,
      events_list,
      validate,
      isLevelOne,
      errors: {
        campaign_id: null,
        name: null,
        county_id: "",
        location_type: null,
        facilitator_id: "",
        trainer_id: null,
        no_of_days: null,
        venue: "",
      },
    };
  },
});

export default AddNew;
</script>
