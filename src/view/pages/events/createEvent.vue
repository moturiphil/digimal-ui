<template>
  <Main>
    <div class="event-pageheader">
      <div class="event-pageheader-text">
        <span class="event-pageheader-icon">
          <sdFeatherIcons type="calendar" size="18" />
        </span>
        <div>
          <h2 class="event-pageheader-title">Create Event</h2>
        </div>
      </div>
      <router-link to="/events/gf" class="event-pageheader-link">
        <sdFeatherIcons type="list" size="14" />
        <span>View all events</span>
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
                    class="add-record-form event-form-shell"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- Section: Campaign & Event -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="flag" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Campaign &amp; Event</h4>
                          <p class="section-sub">What campaign is this event under and what type of activity is it?</p>
                        </div>
                      </div>
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
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.campaign_id"
                      >
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
                    <a-form-item
                      name="county_id"
                      label="County"
                      v-if="isLevelOne"
                    >
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
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
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
                    </div>
                    <!-- /Campaign & Event -->

                    <!-- Section: Host & Facilitators -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="users" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Host &amp; Facilitators</h4>
                          <p class="section-sub">Pick the host and the team that will run the event.</p>
                        </div>
                      </div>
                    <!-- Facilitator Select -->
                    <a-form-item name="facilitator_id" label="Host">
                      <a-select
                        placeholder="Selected Host"
                        v-model:value="formState.facilitator_id"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('facilitator_id')"
                        @keypress="validate('facilitator_id')"
                        @search="handleSearch"
                      >
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          :value="facilitator.id"
                          :label="facilitator.label"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} -
                          {{ facilitator.role_id }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.facilitator_id"
                      >
                        {{ errors.facilitator_id }}
                      </p>
                    </a-form-item>

                    <!-- Trainer Select -->
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
                        @search="handleSearch"
                      >
                        <a-select-option
                          v-for="trainer in facilitators"
                          :key="trainer.id"
                          :value="trainer.id"
                          :label="trainer.label"
                        >
                          {{ trainer.first_name }} {{ trainer.last_name }} -
                          {{ trainer.role_id }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.trainer_id"
                      >
                        {{ errors.trainer_id }}
                      </p>
                    </a-form-item>
                    </div>
                    <!-- /Host & Facilitators -->

                    <!-- Section: Schedule & Venue -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="map-pin" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Schedule &amp; Venue</h4>
                          <p class="section-sub">How long will the event run and where will it be held?</p>
                        </div>
                      </div>

                    <a-form-item name="no-of-days" label="No of Days">
                      <a-input-number
                        type="number"
                        v-model:value="formState.no_of_days"
                        placeholder="No of Days"
                        :min="0"
                        @blur="validate('no_of_days')"
                        @keypress="validate('no_of_days')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.no_of_days"
                      >
                        {{ errors.no_of_days }}
                      </p>
                    </a-form-item>

                    <!-- Procurement section (SCMCC + Super Admin) -->
                    <div v-if="showProcurementSection" class="procurement-block">
                      <div class="pb-head">
                        <span class="pb-icon">
                          <sdFeatherIcons type="shopping-bag" size="14" />
                        </span>
                        <div>
                          <h4 class="pb-title">Procurement</h4>
                          <p class="pb-sub">Link the order this event runs against and flag the resources being procured.</p>
                        </div>
                      </div>

                      <a-form-item label="LSO / LPO">
                        <a-select
                          v-model:value="formState.vendor_lso_id"
                          placeholder="Pick an open LSO/LPO"
                          allow-clear
                          show-search
                          option-filter-prop="label"
                          :loading="lsoLoading"
                          @change="onLsoChange"
                        >
                          <a-select-option
                            v-for="lso in openLsos"
                            :key="lso.id"
                            :value="lso.id"
                            :label="`${lso.lso_number || 'LSO'} — ${lso.vendor?.name || 'Unknown vendor'}${lso.event_description ? ' — ' + lso.event_description : ''}`"
                          >
                            <strong>{{ lso.lso_number || 'LSO' }}</strong>
                            <span> — {{ lso.vendor?.name || 'Unknown vendor' }}</span>
                            <span v-if="lso.event_description" class="lso-opt-venue">
                              <sdFeatherIcons type="map-pin" size="11" />
                              {{ lso.event_description }}
                            </span>
                          </a-select-option>
                        </a-select>
                        <p class="pb-hint">
                          <span v-if="lsoLoading">Loading open LSO/LPOs…</span>
                          <span v-else-if="openLsosTotal > 0">
                            Showing {{ openLsos.length }} of {{ openLsosTotal }} open LSO/LPOs available for linking.
                          </span>
                          <span v-else>No open LSO/LPOs found. Procurement must register one before linking it here.</span>
                        </p>
                      </a-form-item>

                      <div class="pb-checkboxes">
                        <label class="pb-check" :class="{ 'is-on': formState.requires_paid_venue }">
                          <a-checkbox v-model:checked="formState.requires_paid_venue">
                            <span class="pb-check-label">Venue</span>
                          </a-checkbox>
                          <span class="pb-check-hint">Tick if a paid venue is used (a venue invoice will be required at closure).</span>
                        </label>
                        <label class="pb-check" :class="{ 'is-on': formState.requires_fuel }">
                          <a-checkbox v-model:checked="formState.requires_fuel">
                            <span class="pb-check-label">Fuel</span>
                          </a-checkbox>
                          <span class="pb-check-hint">Tick if vehicle fuel is used (work ticket and ETR receipts will be required).</span>
                        </label>
                      </div>
                    </div>

                    <a-form-item
                      name="venue"
                      :label="showProcurementSection && formState.requires_paid_venue ? 'Venue name' : 'Venue'"
                      v-if="!showProcurementSection || formState.requires_paid_venue"
                    >
                      <a-auto-complete
                        v-model:value="formState.venue"
                        :options="venueAutoCompleteOptions"
                        placeholder="Select an existing venue or type a new one"
                        :filter-option="filterVenueOption"
                        allow-clear
                        :disabled="!!formState.vendor_lso_id"
                        @search="handleVenueSearch"
                        @blur="validate('venue')"
                      >
                        <template #notFoundContent>
                          <span v-if="venuesLoading">Loading…</span>
                          <span v-else>No saved venues yet — type to add a new one.</span>
                        </template>
                      </a-auto-complete>
                      <p class="venue-hint" v-if="formState.vendor_lso_id">
                        <sdFeatherIcons type="lock" size="11" />
                        <span>Venue auto-filled from the selected LSO/LPO. Clear the LSO/LPO to edit.</span>
                      </p>
                      <p class="venue-hint" v-else-if="!venuesLoading && venueOptions.length">
                        <sdFeatherIcons type="map-pin" size="11" />
                        <span>{{ venueOptions.length }} saved venue{{ venueOptions.length === 1 ? '' : 's' }} available — start typing to filter or add a new one.</span>
                      </p>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.venue"
                      >
                        {{ errors.venue }}
                      </p>
                    </a-form-item>
                    </div>
                    <!-- /Schedule & Venue -->

                    <div class="event-actions">
                      <router-link to="/events/gf" class="btn-cancel">Cancel</router-link>
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        class="btn-save"
                        :disabled="isSubmitting"
                      >
                        <sdFeatherIcons type="check" size="14" />
                        <span>{{
                          isLoading
                            ? "Loading..."
                            : isSubmitting
                            ? "Processing ..."
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
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import {
  reactive,
  ref,
  defineComponent,
  computed,
  onMounted,
} from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { useRouter } from "vue-router";
import * as Yup from "yup";
import store from "../../../vuex/store";
import { PROCUREMENT_ROLES } from "@/config/procurement-roles";

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

    const searchItem = ref("");

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

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
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users?query=${searchItem.value}`, {
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
      this.loading = false;
    };

    const fetchTrainer = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users?query=${searchItem.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      const transformedData = data.data.map((trainer) => ({
        ...trainer,
        label: `${trainer.first_name} ${trainer.last_name} - ${trainer.role_id}`,
      }));
      this.trainers = transformedData;
      this.loading = false;
    };

    const handleSearch = (value) => {
      console.log(value);
      searchItem.value = value;
      fetchTrainer();
      fetchFacilitators();
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
      fetchOpenLsos();
      fetchVenues();
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
      vendor_lso_id: null,
      requires_paid_venue: false,
      requires_fuel: false,
    });

    // Procurement: LSO/LPO picker visible to SCMCC + Super Admin
    const userRoleId = user?.user?.role_id ?? user?.user?.role ?? null;
    const showProcurementSection = computed(() =>
      [PROCUREMENT_ROLES.SCMCC, PROCUREMENT_ROLES.CMCC, PROCUREMENT_ROLES.SUPER_ADMIN].includes(Number(userRoleId))
    );

    const openLsos = ref([]);
    const openLsosTotal = ref(0);
    const lsoLoading = ref(false);
    const fetchOpenLsos = async () => {
      if (!showProcurementSection.value) return;
      lsoLoading.value = true;
      try {
        const res = await fetch(`${process.env.VUE_APP_BASE_URL}/open_vendor_lsos`, {
          method: "GET",
          headers: { "Content-Type": "application/json", ...authHeader() },
        });
        const json = await res.json();
        openLsos.value = json?.data || [];
        openLsosTotal.value = json?.meta?.total_count ?? openLsos.value.length;
      } catch (e) {
        openLsos.value = [];
        openLsosTotal.value = 0;
      } finally {
        lsoLoading.value = false;
      }
    };

    // Existing venues (autocomplete)
    const venueOptions = ref([]);
    const venuesLoading = ref(false);
    const venueAutoCompleteOptions = computed(() =>
      venueOptions.value.map((v) => ({ value: v, label: v }))
    );
    const fetchVenues = async () => {
      venuesLoading.value = true;
      try {
        const res = await fetch(`${process.env.VUE_APP_BASE_URL}/event_venues`, {
          method: "GET",
          headers: { "Content-Type": "application/json", ...authHeader() },
        });
        const json = await res.json();
        venueOptions.value = Array.isArray(json?.data) ? json.data : [];
      } catch (e) {
        venueOptions.value = [];
      } finally {
        venuesLoading.value = false;
      }
    };
    const filterVenueOption = (input, option) => {
      const haystack = String(option?.value ?? option?.label ?? "").toLowerCase();
      return haystack.indexOf(String(input).toLowerCase()) >= 0;
    };
    const handleVenueSearch = (val) => {
      formState.venue = val;
    };

    const onLsoChange = (lsoId) => {
      if (!lsoId) {
        // Clearing the LSO releases the venue field for manual edits.
        return;
      }
      const lso = openLsos.value.find((l) => l.id === lsoId);
      if (lso && lso.event_description) {
        formState.venue = lso.event_description;
        // Auto-tick paid venue so the venue field is shown when SCMCC.
        formState.requires_paid_venue = true;
      }
    };

    const ArticleSchema = Yup.object().shape({
      campaign_id: Yup.string().required("Campaign is required"),
      name: Yup.string().required("Name is required"),
      // county_id: Yup.string().required(),
      facilitator_id: Yup.string().required("Host is required"),
      trainer_id: Yup.array()
        .min(1, "At least 1 facilitator required")
        .required(),
      no_of_days: Yup.number().required("No of days is required"),
      venue: Yup.string().when([], {
        is: () => showProcurementSection.value && !formState.requires_paid_venue,
        then: (schema) => schema.notRequired().nullable(),
        otherwise: (schema) => schema.required("Venue is required"),
      }),
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
      if (showProcurementSection.value) {
        data.vendor_lso_id = formState.vendor_lso_id || null;
        data.requires_paid_venue = !!formState.requires_paid_venue;
        data.requires_fuel = !!formState.requires_fuel;
      }
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
      handleSearch,
      isLevelOne,
      showProcurementSection,
      openLsos,
      openLsosTotal,
      lsoLoading,
      venueOptions,
      venuesLoading,
      venueAutoCompleteOptions,
      filterVenueOption,
      handleVenueSearch,
      onLsoChange,
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

<style lang="less" scoped>
.event-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 24px 4px 18px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eef2f5;
}
.event-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.event-pageheader-icon {
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
.event-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.event-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 640px;
  line-height: 1.5;
}
.event-pageheader-link {
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

.event-form-shell {
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

.event-actions {
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

.procurement-block {
  background: #fafcfb;
  border: 1px solid #e6ecef;
  border-radius: 10px;
  padding: 14px 16px;
  margin: 4px 0 18px;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.04);
}
.venue-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 6px 0 0;
  font-size: 11px;
  color: #8a9399;
}
.lso-opt-venue {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  padding: 1px 8px;
  border-radius: 999px;
  background: #eafff5;
  color: #15693c;
  font-size: 11px;
  font-weight: 500;
}
.pb-head {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.pb-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pb-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #15693c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}
.pb-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.4;
}
.pb-hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: #8a9399;
}
.pb-checkboxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;
}
.pb-check {
  display: block;
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &.is-on {
    background: #f4fcf6;
    border-color: #c9e6d3;
  }
}
.pb-check-label {
  margin-left: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2437;
}
.pb-check-hint {
  display: block;
  margin-left: 24px;
  margin-top: 4px;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.4;
}
@media (max-width: 600px) {
  .pb-checkboxes { grid-template-columns: 1fr; }
}
</style>
