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
      <router-link to="/events/event-view" class="event-pageheader-link">
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
                      <p
                        class="venue-hint"
                        v-if="!loading && !errors.campaign_id && campaigns.length"
                      >
                        <span>Only campaigns active today (start/end date covering today) can be selected.</span>
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
                        @change="onEventTypeChange"
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
                    <a-form-item name="trainer_id" label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.trainer_id"
                        v-if="!loading"
                        placeholder="Select facilitators (min 1, max 5)"
                        show-search
                        option-filter-prop="label"
                        :max-tag-count="5"
                        @change="handleTrainerChange"
                        @blur="validate('trainer_id')"
                        @keypress="validate('trainer_id')"
                        @search="handleSearch"
                      >
                        <a-select-option
                          v-for="trainer in facilitators"
                          :key="trainer.id"
                          :value="trainer.id"
                          :label="trainer.label"
                          :disabled="
                            formState.trainer_id.length >= 5 &&
                            !formState.trainer_id.includes(trainer.id)
                          "
                        >
                          {{ trainer.first_name }} {{ trainer.last_name }} -
                          {{ trainer.role_id }}
                        </a-select-option>
                      </a-select>
                      <p class="facilitator-hint">
                        Select between 1 and 5 facilitators.
                        <span v-if="formState.trainer_id.length">
                          ({{ formState.trainer_id.length }}/5 selected)
                        </span>
                      </p>
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

                    <a-form-item name="start_date" label="Start Date">
                      <a-date-picker
                        v-model:value="formState.start_date"
                        type="date"
                        name="start_date"
                        placeholder="Select Start Date"
                        :format="'YYYY-MM-DD'"
                        :disabled-date="disabledStartDate"
                        style="width: 100%"
                        @change="onStartDateChange"
                        @blur="validate('start_date')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.start_date"
                      >
                        {{ errors.start_date }}
                      </p>
                    </a-form-item>

                    <a-form-item name="no_of_days" label="No of Days">
                      <a-input-number
                        type="number"
                        v-model:value="formState.no_of_days"
                        placeholder="No of Days"
                        :min="1"
                        :precision="0"
                        @blur="validate('no_of_days')"
                        @change="validate('no_of_days')"
                        @keypress="validate('no_of_days')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.no_of_days"
                      >
                        {{ errors.no_of_days }}
                      </p>
                      <p v-if="eventEndDate" class="pb-hint schedule-hint">
                        <sdFeatherIcons type="calendar" size="11" />
                        <span>
                          The event runs from
                          <b>{{ formatDisplayDate(formState.start_date) }}</b>
                          to <b>{{ eventEndDate }}</b>
                          ({{ formState.no_of_days }}
                          {{ formState.no_of_days === 1 ? "day" : "days" }}).
                        </span>
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
                          placeholder="Pick an LSO/LPO"
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
                            :label="`${lso.lso_number || 'LSO'} — ${lso.vendor?.name || 'Unknown vendor'}${lso.event_description ? ' — ' + lso.event_description : ''}${isExpiredLso(lso) ? ' — Expired' : ''}`"
                            :disabled="isExpiredLso(lso)"
                          >
                            <strong>{{ lso.lso_number || 'LSO' }}</strong>
                            <span> — {{ lso.vendor?.name || 'Unknown vendor' }}</span>
                            <span v-if="lso.event_description" class="lso-opt-venue">
                              <sdFeatherIcons type="map-pin" size="11" />
                              {{ lso.event_description }}
                            </span>
                            <span v-if="isExpiredLso(lso)" class="lso-opt-expired">
                              <sdFeatherIcons type="x-circle" size="11" /> Expired
                            </span>
                          </a-select-option>
                        </a-select>
                        <p class="pb-hint">
                          <span v-if="lsoLoading">Loading LSO/LPOs…</span>
                          <span v-else-if="openLsosTotal > 0">
                            Showing {{ openLsos.length }} of {{ openLsosTotal }} LSO/LPOs within your area — expired ones are disabled.
                          </span>
                          <span v-else>No LSO/LPOs found. Procurement must register one before linking it here.</span>
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
                      <a-select
                        v-model:value="formState.venue"
                        :options="venueAutoCompleteOptions"
                        placeholder="Select a saved venue"
                        show-search
                        allow-clear
                        :loading="venuesLoading"
                        :filter-option="filterVenueOption"
                        :disabled="!!formState.vendor_lso_id"
                        @change="validate('venue')"
                        @blur="validate('venue')"
                      >
                        <template #notFoundContent>
                          <span v-if="venuesLoading">Loading…</span>
                          <span v-else>No venues available yet.</span>
                        </template>
                      </a-select>
                      <p class="venue-hint" v-if="formState.vendor_lso_id">
                        <sdFeatherIcons type="lock" size="11" />
                        <span>Venue auto-filled from the selected LSO/LPO. Clear the LSO/LPO to edit.</span>
                      </p>
                      <p class="venue-hint" v-else-if="!venuesLoading && venueOptions.length">
                        <sdFeatherIcons type="map-pin" size="11" />
                        <span>{{ venueOptions.length }} saved venue{{ venueOptions.length === 1 ? '' : 's' }} available — start typing to filter.</span>
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
                      <router-link to="/events/event-view" class="btn-cancel">Cancel</router-link>
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        class="btn-save"
                        :disabled="isSubmitting || submitted"
                      >
                        <sdFeatherIcons type="check" size="14" />
                        <span>{{
                          isLoading
                            ? "Loading..."
                            : isSubmitting
                            ? "Processing ..."
                            : submitted
                            ? "Event Created"
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
  nextTick,
} from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import dayjs from "dayjs";
import store from "../../../vuex/store";
import { PROCUREMENT_LSO_PERMISSIONS } from "@/config/procurement-roles";
import { canAny, fetchUserData } from "@/services/user-role";
import { encrypt } from "@/cryptoHelper";

// testing app

/**
 * List-type API endpoints return a plain array on some deployments, a wrapper
 * object ({ success, data }) on others, or an error payload { message } when
 * the caller lacks the permission / scope for the request. Normalize all of
 * those shapes so pages degrade to an empty list instead of crashing with
 * "data.data is undefined".
 */
const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data; // paginator
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
};

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    // Populate the cached RBAC snapshot (role + permission NAMES) before any
    // permission-based gate below is derived — `canAny` reads a module-level
    // ref that is only filled once this runs.
    fetchUserData();

    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    // Router is used to redirect the user to the newly created event's
    // details page immediately after a successful save.
    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/with_facilitator`;

    const searchItem = ref("");

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all?active=1`;

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
      trainers: [],
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
      const transformedData = normalizeListResponse(data).map((fac) => ({
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
      const transformedData = normalizeListResponse(data).map((trainer) => ({
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
      start_date: null,
      no_of_days: null,
      venue: "",
      vendor_lso_id: null,
      requires_paid_venue: false,
      requires_fuel: false,
    });

    // Tracks whether the event has been successfully submitted. Used to
    // disable the submit button so users cannot create duplicate events by
    // clicking submit again after a successful save.
    const submitted = ref(false);

    // Human-friendly labels used in error notifications so users can quickly
    // identify which field failed validation.
    const fieldLabels = {
      campaign_id: "Campaign Name",
      name: "Event Type",
      county_id: "County",
      facilitator_id: "Host",
      trainer_id: "Facilitators",
      start_date: "Start Date",
      no_of_days: "No of Days",
      venue: "Venue",
    };

    // Scrolls to the first field that has an error so the user can see and
    // fix the issue immediately.
    const scrollToField = (fieldName) => {
      if (!fieldName) return;
      nextTick(() => {
        const el =
          document.querySelector(
            `.event-form-shell [name="${fieldName}"]`
          ) ||
          document.querySelector(
            `.event-form-shell [id$="_${fieldName}"]`
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

    // Enforces the maximum of 5 facilitators. Any selection beyond 5 is
    // silently trimmed and the user is warned.
    const handleTrainerChange = (value) => {
      if (Array.isArray(value) && value.length > 5) {
        formState.trainer_id = value.slice(0, 5);
        notification.warning({
          message: "Facilitator limit reached",
          description: "You can only select up to 5 facilitators.",
          duration: 4,
        });
      }
      validate("trainer_id");
    };

    // Procurement: the LSO/LPO picker is shown to whoever may read the
    // cross-vendor LSO/LPO register. The endpoint this section calls
    // (`GET /open_vendor_lsos`, routes/api.php) is enforced server-side with
    // `role_permission:get_vendor_lsos`, so gating on the matching permission
    // NAME — rather than a numeric role id, which drifts between deployments
    // (see src/config/procurement-roles.js) — keeps the UI in lockstep with the
    // API. In practice this yields the same audience as the previous
    // SCMCC / CMCC / Super Admin role-id check.
    const showProcurementSection = canAny(PROCUREMENT_LSO_PERMISSIONS);

    const openLsos = ref([]);
    const openLsosTotal = ref(0);
    const lsoLoading = ref(false);
    const fetchOpenLsos = async () => {
      if (!showProcurementSection.value) return;
      lsoLoading.value = true;
      try {
        const res = await fetch(`${process.env.VUE_APP_BASE_URL}/open_vendor_lsos?include_expired=1`, {
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

    // An LSO is expired once its expiry date is before today. Every LSO within
    // the user's hierarchy is listed in the picker, but expired entries are
    // disabled so they can never be linked to a new event.
    const isExpiredLso = (lso) => {
      const d = lso?.expiry_date;
      return d ? dayjs(d).isBefore(dayjs(), "day") : false;
    };

    const onLsoChange = (lsoId) => {
      if (!lsoId) {
        // Clearing the LSO releases the venue field for manual edits.
        return;
      }

      // Selecting an LSO/LPO implies a paid venue, so always tick the venue
      // checkbox. For procurement users this also reveals the venue field.
      formState.requires_paid_venue = true;

      // Match loosely so an id type mismatch (string vs number) coming from
      // the select does not prevent the lookup.
      const lso = openLsos.value.find(
        (l) => String(l.id) === String(lsoId)
      );

      // Safety net — disabled options cannot normally be selected.
      if (lso && isExpiredLso(lso)) {
        formState.vendor_lso_id = null;
        notification.error({
          message: "Expired LSO/LPO",
          description:
            "This LSO/LPO has expired and can no longer be linked to an event.",
        });
        return;
      }

      if (lso) {
        // Use the vendor (e.g. the hotel) name as the venue for now, falling
        // back to the LSO event description when no vendor name is present.
        const venueName = lso.vendor?.name || lso.event_description || "";
        if (venueName) {
          // The venue field only renders once requires_paid_venue is true, so
          // defer the assignment until after that render to guarantee the
          // input reflects the auto-filled venue.
          nextTick(() => {
            formState.venue = venueName;
          });
        }
      }
    };

    // Event types carry their template's default fuel requirement (`has_fuel`).
    // Mirror it onto the Fuel checkbox when the type changes so procurement
    // users see from the start that fuel documents (fuel receipt + work
    // ticket) will be required at closure. The checkbox can still be
    // unticked before saving when the event will not use fuel.
    const onEventTypeChange = (eventListId) => {
      if (!showProcurementSection.value) return;
      const list = Array.isArray(this.events_list) ? this.events_list : [];
      const selected = list.find(
        (event) => String(event.id) === String(eventListId)
      );
      if (
        selected &&
        Object.prototype.hasOwnProperty.call(selected, "has_fuel")
      ) {
        formState.requires_fuel = !!Number(selected.has_fuel);
      }
    };

    // ── Schedule: start date + computed end date ──
    // The event's end date is derived from the start date plus the number of
    // days (e.g. a 3-day event starting 2026-09-04 ends 2026-09-06). This is
    // the same rule the backend uses at closing (Event::finalDay()).
    const disabledStartDate = (current) =>
      current && current < dayjs().startOf("day");

    const onStartDateChange = () => {
      validate("start_date");
    };

    const formatDisplayDate = (value) =>
      value && dayjs(value).isValid()
        ? dayjs(value).format("DD MMM YYYY")
        : null;

    const eventEndDate = computed(() => {
      if (!formState.start_date || !formState.no_of_days) return null;
      if (!dayjs(formState.start_date).isValid()) return null;
      const days = Math.max(1, Math.floor(Number(formState.no_of_days) || 1));
      return formatDisplayDate(
        dayjs(formState.start_date).add(days - 1, "day")
      );
    });

    const ArticleSchema = Yup.object().shape({
      campaign_id: Yup.string().required("Campaign is required"),
      name: Yup.string().required("Event Type is required"),
      // county_id: Yup.string().required(),
      facilitator_id: Yup.string().required("Host is required"),
      trainer_id: Yup.array()
        .min(1, "At least 1 facilitator is required")
        .max(5, "You can select a maximum of 5 facilitators")
        .required("At least 1 facilitator is required"),
      start_date: Yup.mixed()
        .required("Start date is required")
        .test("valid-date", "Start date must be a valid date", (value) =>
          !value || dayjs(value).isValid()
        ),
      no_of_days: Yup.number()
        .typeError("No of days must be a number")
        .integer("No of days must be a whole number")
        .min(1, "No of days must be greater than 0")
        .required("No of days is required"),
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
      // Guard against duplicate submissions.
      if (submitted.value || isSubmitting.value) {
        return;
      }
      store.commit("setIsSubmitting", true);
      if (formState.county_id == "") {
        formState.county_id = user_data.user.location_id;
      }

      // Safety net: the LSO picker disables expired entries, but reject a
      // stale selection anyway so an expired LSO/LPO is never submitted.
      const selectedLso = openLsos.value.find(
        (l) => String(l.id) === String(formState.vendor_lso_id)
      );
      if (selectedLso && isExpiredLso(selectedLso)) {
        store.commit("setIsSubmitting", false);
        formState.vendor_lso_id = null;
        notification.error({
          message: "Expired LSO/LPO",
          description:
            "The selected LSO/LPO has expired and can no longer be linked to an event. Please pick another.",
        });
        return;
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
        start_date: formState.start_date
          ? dayjs(formState.start_date).format("YYYY-MM-DD")
          : null,
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
            .then(async (response) => {
              const json = await response.json().catch(() => ({}));
              return { ok: response.ok, status: response.status, json };
            })
            .then(({ ok, status, json }) => {
              const { success, data, message, errors: apiErrors } = json || {};
              if (ok && success) {
                store.commit("setIsSubmitting", false);
                submitted.value = true;

                const createdEvent = (data && data.event) || {};
                const createdHost = (data && data.facilitator) || {};

                notification["success"]({
                  message: "Event Created",
                  description: `Event Created successfully. Your event code is ${createdEvent.event_code}. Redirecting to event details...`,
                  duration: 4,
                });

                // Build the encrypted payload the way viewEvents.vue does so
                // eventDetails.vue can decrypt it on arrival.
                try {
                  const encryptedData = encodeURIComponent(
                    encrypt({
                      id: createdEvent.id,
                      name: createdEvent.name,
                      event_code: createdEvent.event_code,
                      event_host_id:
                        createdHost.id || createdEvent.user_id || null,
                      funding_id: createdEvent.funding_id,
                      start_date: createdEvent.start_date,
                      event_list_id: createdEvent.event_list_id,
                      location: createdEvent.location_id,
                      payroll_status: createdEvent.payroll_status || "Pending",
                      status: createdEvent.status,
                      payroll_submitted:
                        createdEvent.payroll_submitted || false,
                    })
                  );

                  // Delay slightly so the success toast is visible before the
                  // route change.
                  setTimeout(() => {
                    router.push({
                      name: "view-details",
                      params: { id: createdEvent.id },
                      query: { encryptedData },
                    });
                  }, 1200);
                } catch (redirectError) {
                  // If anything goes wrong building the redirect, fall back to
                  // the events list so the user can locate their new event.
                  console.error("Redirect after create failed:", redirectError);
                  setTimeout(() => {
                    router.push("/events/event-view");
                  }, 1200);
                }
                return;
              }

              // Server responded with a failure — surface each field error
              // and point the user to the exact place where the error is.
              store.commit("setIsSubmitting", false);
              const fieldMessages = [];
              let firstErrorField = null;

              if (apiErrors && typeof apiErrors === "object") {
                Object.entries(apiErrors).forEach(([field, msgs]) => {
                  // Map backend field names to our form field names.
                  const mapBackToForm = {
                    number_of_days: "no_of_days",
                    event_list_id: "name",
                    location_id: "county_id",
                    facilitator: "facilitator_id",
                    trainers: "trainer_id",
                  };
                  const formField = mapBackToForm[field] || field;
                  const first = Array.isArray(msgs) ? msgs[0] : String(msgs);
                  if (this.errors && formField in this.errors) {
                    this.errors[formField] = first;
                  }
                  if (!firstErrorField) firstErrorField = formField;
                  const label = fieldLabels[formField] || formField;
                  fieldMessages.push(`• ${label}: ${first}`);
                });
              }

              notification["error"]({
                message: message
                  ? `Error: ${message}`
                  : `Failed to create event${status ? ` (HTTP ${status})` : ""}`,
                description:
                  fieldMessages.length > 0
                    ? fieldMessages.join("\n")
                    : "The event could not be created. Please review the form and try again.",
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

    return {
      isLoading,
      isSubmitting,
      submitted,
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
      handleTrainerChange,
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
      onLsoChange,
      onEventTypeChange,
      isExpiredLso,
      disabledStartDate,
      onStartDateChange,
      formatDisplayDate,
      eventEndDate,
      errors: {
        campaign_id: null,
        name: null,
        county_id: "",
        location_type: null,
        facilitator_id: "",
        trainer_id: null,
        start_date: null,
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
.facilitator-hint {
  margin: 6px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.4;
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
/* Rich LSO/LPO option content inside the procurement picker */
.lso-opt-venue {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #15693c;
}
.lso-opt-expired {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  background: #fff1f1;
  color: #c43d3d;
  border: 1px solid #ffd1d1;
  border-radius: 999px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
}
.pb-hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: #8a9399;
}
.schedule-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
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
