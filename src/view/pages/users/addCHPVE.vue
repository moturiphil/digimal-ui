<template>
  <Main>
    <div class="stakeholder-pageheader">
      <div class="stakeholder-pageheader-text">
        <span class="stakeholder-pageheader-icon">
          <sdFeatherIcons type="user-plus" size="18" />
        </span>
        <div>
          <h2 class="stakeholder-pageheader-title">Add CHP / VE</h2>
          <p class="stakeholder-pageheader-sub">
            Register a Community Health Promoter (CHP) or Village Elder (VE) under
            the Community Unit organisation and confirm their phone number with a
            one-time code before the record is added to the master list.
          </p>
        </div>
      </div>
      <router-link to="/users/view-chp-ve" class="stakeholder-pageheader-link">
        <sdFeatherIcons type="list" size="14" />
        <span>View CHP &amp; VE</span>
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
                    class="add-record-form stakeholder-form-shell"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addchpve"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- Section: Personal details -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="user" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Personal Details</h4>
                          <p class="section-sub">
                            Names as they appear on the CHP / VE identification
                            document.
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="8">
                          <a-form-item name="first_name" label="First Name">
                            <a-input
                              v-model:value="formState.first_name"
                              :maxlength="50"
                              placeholder="Input first name"
                              @blur="validate('first_name')"
                            />
                            <p class="errors" v-if="!!errors.first_name">
                              {{ errors.first_name }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item
                            name="middle_name"
                            label="Middle Name (optional)"
                          >
                            <a-input
                              v-model:value="formState.middle_name"
                              :maxlength="50"
                              placeholder="Input middle name"
                              @blur="validate('middle_name')"
                            />
                            <p class="errors" v-if="!!errors.middle_name">
                              {{ errors.middle_name }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item name="last_name" label="Last Name">
                            <a-input
                              v-model:value="formState.last_name"
                              :maxlength="50"
                              placeholder="Input last name"
                              @blur="validate('last_name')"
                            />
                            <p class="errors" v-if="!!errors.last_name">
                              {{ errors.last_name }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="8">
                          <a-form-item name="id_no" label="ID No">
                            <a-input
                              v-model:value="formState.id_no"
                              :maxlength="20"
                              inputmode="numeric"
                              placeholder="e.g. 00123456"
                              @input="onIdNoInput"
                              @blur="validate('id_no')"
                            />
                            <p class="field-hint">
                              Digits only, up to 20 characters. Leading zeros are
                              kept.
                            </p>
                            <p class="errors" v-if="!!errors.id_no">
                              {{ errors.id_no }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item
                            name="confirm_id_no"
                            label="Confirm ID No"
                          >
                            <a-input
                              v-model:value="formState.confirm_id_no"
                              :maxlength="20"
                              inputmode="numeric"
                              placeholder="Re-enter the ID No"
                              @input="onConfirmIdNoInput"
                              @blur="validate('confirm_id_no')"
                            />
                            <p class="field-hint">
                              Must match the ID number above.
                            </p>
                            <p class="errors" v-if="!!errors.confirm_id_no">
                              {{ errors.confirm_id_no }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item name="gender" label="Gender">
                            <a-select
                              v-model:value="formState.gender"
                              placeholder="Select gender"
                              show-search
                              option-filter-prop="label"
                              @change="validate('gender')"
                              @blur="validate('gender')"
                            >
                              <a-select-option
                                v-for="g in genderOptions"
                                :key="g.id"
                                :value="g.id"
                                :label="g.name"
                              >
                                {{ g.name }}
                              </a-select-option>
                            </a-select>
                            <p class="errors" v-if="!!errors.gender">
                              {{ errors.gender }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>

                    <!-- Section: Contact & verification -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="phone" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">
                            Contact &amp; Verification
                          </h4>
                          <p class="section-sub">
                            The CHP / VE phone number is confirmed with a one-time
                            code before the record is saved.
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="phone_no" label="Phone No">
                            <a-input
                              v-model:value="formState.phone_no"
                              :maxlength="12"
                              inputmode="numeric"
                              placeholder="254712345678"
                              @input="onPhoneInput"
                              @blur="onPhoneBlur"
                            />
                            <p class="field-hint">
                              Starts with 254 and is exactly 12 digits — no "+"
                              (the + is added automatically).
                            </p>
                            <p class="errors" v-if="!!errors.phone_no">
                              {{ errors.phone_no }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <div v-if="otpSent" class="otp-panel">
                        <div class="otp-panel-head">
                          <span class="otp-panel-icon">
                            <sdFeatherIcons type="shield" size="14" />
                          </span>
                          <div>
                            <h4 class="otp-panel-title">
                              Confirm the CHP / VE phone
                            </h4>
                            <p class="otp-panel-sub">
                              A 6-digit code was sent to
                              <b>+{{ otpPhone }}</b>. Ask the CHP / VE to read
                              it out.
                            </p>
                          </div>
                        </div>
                        <a-row :gutter="18" align="bottom">
                          <a-col :xs="24" :md="10">
                            <a-form-item name="otp" label="CHP / VE OTP">
                              <a-input
                                ref="otpInputRef"
                                v-model:value="formState.otp"
                                :maxlength="6"
                                inputmode="numeric"
                                placeholder="Enter 6-digit code"
                                @input="onOtpInput"
                                @blur="validate('otp')"
                              />
                              <p class="errors" v-if="!!errors.otp">
                                {{ errors.otp }}
                              </p>
                            </a-form-item>
                          </a-col>
                          <a-col :xs="24" :md="14">
                            <div class="otp-resend">
                              <button
                                type="button"
                                class="otp-resend-btn"
                                :disabled="sendingOtp"
                                @click="resendOtp"
                              >
                                <sdFeatherIcons type="refresh-cw" size="12" />
                                <span>Resend code</span>
                              </button>
                              <span class="otp-resend-hint">
                                The number must be able to receive SMS.
                              </span>
                            </div>
                          </a-col>
                        </a-row>
                      </div>
                      <p class="field-hint" v-else>
                        <sdFeatherIcons type="info" size="11" />
                        Send an OTP first — you will then enter the code the
                        CHP / VE receives.
                      </p>
                    </div>

                    <!-- Section: Assignment -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="briefcase" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Assignment</h4>
                          <p class="section-sub">
                            CHP / VE records always belong to the Community Unit
                            organisation.
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item label="Organisation">
                            <a-input value="Community Unit" disabled />
                            <p class="field-hint">
                              Fixed for CHP / VE records.
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item name="role" label="Role">
                            <a-select
                              v-model:value="formState.role"
                              placeholder="Select role"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingRoles"
                              @change="validate('role')"
                              @blur="validate('role')"
                            >
                              <a-select-option
                                v-for="role in roles"
                                :key="role.id"
                                :value="role.id"
                                :label="role.name"
                              >
                                {{ role.name }}
                              </a-select-option>
                            </a-select>
                            <p
                              class="field-hint"
                              v-if="!loadingRoles && !roles.length"
                            >
                              No CHP / VE roles are linked to the Community Unit
                              organisation.
                            </p>
                            <p class="errors" v-if="!!errors.role">
                              {{ errors.role }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>

                    <!-- Section: Location -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="map-pin" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Location</h4>
                          <p class="section-sub">
                            Pick the CHP / VE duty station from county down to
                            village.
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="county" label="County">
                            <a-select
                              v-model:value="formState.county"
                              placeholder="Select county"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingCounties"
                              @change="onCountyChange"
                              @blur="validate('county')"
                            >
                              <a-select-option
                                v-for="item in counties"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="errors" v-if="!!errors.county">
                              {{ errors.county }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item name="sub_county" label="Sub-County">
                            <a-select
                              v-model:value="formState.sub_county"
                              placeholder="Select sub-county"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingSubCounties"
                              :disabled="!formState.county || loadingSubCounties"
                              @change="onSubCountyChange"
                              @blur="validate('sub_county')"
                            >
                              <a-select-option
                                v-for="item in subCounties"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.county">
                              Select a county first to load its sub-counties.
                            </p>
                            <p class="errors" v-if="!!errors.sub_county">
                              {{ errors.sub_county }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="ward" label="Ward">
                            <a-select
                              v-model:value="formState.ward"
                              placeholder="Select ward"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingWards"
                              :disabled="!formState.sub_county || loadingWards"
                              @change="onWardChange"
                              @blur="validate('ward')"
                            >
                              <a-select-option
                                v-for="item in wards"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.sub_county">
                              Select a sub-county first to load its wards.
                            </p>
                            <p class="errors" v-if="!!errors.ward">
                              {{ errors.ward }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item name="location" label="Location">
                            <a-select
                              v-model:value="formState.location"
                              placeholder="Select location"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingLocations"
                              :disabled="!formState.ward || loadingLocations"
                              @change="onLocationChange"
                              @blur="validate('location')"
                            >
                              <a-select-option
                                v-for="item in locations"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.ward">
                              Select a ward first to load its locations.
                            </p>
                            <p class="errors" v-if="!!errors.location">
                              {{ errors.location }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="sub_location" label="Sub-Location">
                            <a-select
                              v-model:value="formState.sub_location"
                              placeholder="Select sub-location"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingSubLocations"
                              :disabled="
                                !formState.location || loadingSubLocations
                              "
                              @change="onSubLocationChange"
                              @blur="validate('sub_location')"
                            >
                              <a-select-option
                                v-for="item in subLocations"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.location">
                              Select a location first to load its sub-locations.
                            </p>
                            <p class="errors" v-if="!!errors.sub_location">
                              {{ errors.sub_location }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item name="village" label="Village">
                            <a-select
                              v-model:value="formState.village"
                              placeholder="Select village"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingVillages"
                              :disabled="
                                !formState.sub_location || loadingVillages
                              "
                              @change="validate('village')"
                              @blur="validate('village')"
                            >
                              <a-select-option
                                v-for="item in villages"
                                :key="item.id"
                                :value="item.org_id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.sub_location">
                              Select a sub-location first to load its villages.
                            </p>
                            <p class="errors" v-if="!!errors.village">
                              {{ errors.village }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>

                    <div class="event-actions">
                      <router-link to="/users/view-chp-ve" class="btn-cancel">
                        Cancel
                      </router-link>
                      <sdButton
                        htmlType="button"
                        size="default"
                        type="success"
                        class="btn-save"
                        :disabled="sendingOtp || submitting"
                        @click="handleSubmit"
                      >
                        <sdFeatherIcons
                          :type="otpSent ? 'check' : 'send'"
                          size="14"
                        />
                        <span>
                          {{
                            sendingOtp
                              ? "Sending OTP..."
                              : submitting
                                ? "Processing ..."
                                : otpSent
                                  ? "Create CHP / VE"
                                  : "Send OTP"
                          }}
                        </span>
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

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { notification } from "ant-design-vue";
import * as Yup from "yup";
import axios from "@/Axiosconfig";
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";

// CHP / VE records always belong to the Community Unit organisation (org type
// id 15); the API stores the organisation and role by NAME on the master list.
const COMMUNITY_UNIT_ORG_TYPE_ID = 15;
const ID_NO_REGEX = /^[0-9]{1,20}$/;
const PHONE_NO_REGEX = /^254[0-9]{9}$/;

const genderOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];

const formState = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  id_no: "",
  confirm_id_no: "",
  phone_no: "",
  gender: null,
  role: null,
  county: null,
  sub_county: null,
  ward: null,
  location: null,
  sub_location: null,
  village: null,
  otp: "",
});

const errors = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  id_no: "",
  confirm_id_no: "",
  phone_no: "",
  gender: "",
  role: "",
  county: "",
  sub_county: "",
  ward: "",
  location: "",
  sub_location: "",
  village: "",
  otp: "",
});

const counties = ref([]);
const subCounties = ref([]);
const wards = ref([]);
const locations = ref([]);
const subLocations = ref([]);
const villages = ref([]);
const roles = ref([]);
const loadingCounties = ref(false);
const loadingSubCounties = ref(false);
const loadingWards = ref(false);
const loadingLocations = ref(false);
const loadingSubLocations = ref(false);
const loadingVillages = ref(false);
const loadingRoles = ref(false);
const sendingOtp = ref(false);
const submitting = ref(false);
const formBusy = ref(false);
const otpSent = ref(false);
const otpPhone = ref("");
const otpInputRef = ref(null);

// Mirrors the API rules in MasterListController::create_record().
const memberSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .required("First name is required")
    .max(50, "First name must be at most 50 characters"),
  middle_name: Yup.string()
    .trim()
    .nullable()
    .max(50, "Middle name must be at most 50 characters"),
  last_name: Yup.string()
    .trim()
    .required("Last name is required")
    .max(50, "Last name must be at most 50 characters"),
  id_no: Yup.string()
    .required("ID number is required")
    .matches(ID_NO_REGEX, "ID number must contain digits only (max 20)"),
  confirm_id_no: Yup.string()
    .required("Please confirm the ID number")
    .test(
      "id-numbers-match",
      "The ID numbers do not match",
      (value) => String(value || "") === String(formState.id_no || "")
    ),
  phone_no: Yup.string()
    .required("Phone number is required")
    .matches(
      PHONE_NO_REGEX,
      "Phone number must start with 254 and be exactly 12 digits"
    ),
  gender: Yup.string().required("Gender is required"),
  role: Yup.number().typeError("Role is required").required("Role is required"),
  county: Yup.string().required("County is required"),
  sub_county: Yup.string().required("Sub-county is required"),
  ward: Yup.string().required("Ward is required"),
  location: Yup.string().required("Location is required"),
  sub_location: Yup.string().required("Sub-location is required"),
  village: Yup.string().required("Village is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// List endpoints return a plain array, { data: [...] } or { message: [...] }
// (get_sub_counties_list) — normalize all three shapes.
const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
};

const clearErrors = () => {
  Object.keys(errors).forEach((field) => {
    errors[field] = "";
  });
};

const applyApiErrors = (payload) => {
  const apiErrors = payload?.errors || {};
  Object.entries(apiErrors).forEach(([field, messages]) => {
    // The API validates the village as `location_code`.
    const key = field === "location_code" ? "village" : field;
    if (key in errors) {
      errors[key] = Array.isArray(messages) ? messages[0] : String(messages);
    }
  });
};

const validate = async (field) => {
  try {
    await (field === "otp" ? otpSchema : memberSchema).validateAt(
      field,
      formState
    );
    errors[field] = "";
  } catch (err) {
    // Yup's internal errors (unknown path) are not user-facing.
    if (!(err instanceof Yup.ValidationError)) return;
    errors[err.path || field] = err.message;
  }
};

const validateAll = async () => {
  normalizePhone();
  clearErrors();

  try {
    await memberSchema.validate(formState, { abortEarly: false });
  } catch (err) {
    (err.inner || [err]).forEach((item) => {
      if (item.path) errors[item.path] = item.message;
    });
  }

  if (otpSent.value) {
    try {
      await otpSchema.validate(formState, { abortEarly: false });
    } catch (err) {
      (err.inner || [err]).forEach((item) => {
        if (item.path) errors[item.path] = item.message;
      });
    }
  }

  if (Object.values(errors).some(Boolean)) {
    notification.warning({
      message: "Check the form",
      description: "Please correct the highlighted fields and try again.",
    });
    return false;
  }

  return true;
};

const fetchCounties = async () => {
  loadingCounties.value = true;
  try {
    const { data } = await axios.get("get_counties");
    counties.value = normalizeList(data);
  } catch (error) {
    counties.value = [];
    notification.error({
      message: "Unable to load counties",
      description: errorMessage(error, "Please refresh the page and try again."),
    });
  } finally {
    loadingCounties.value = false;
  }
};

const fetchRoles = async () => {
  loadingRoles.value = true;
  try {
    const { data } = await axios.get("get_roles_given_the_org", {
      params: { organization_id: COMMUNITY_UNIT_ORG_TYPE_ID },
    });
    roles.value = normalizeList(data);
  } catch (error) {
    roles.value = [];
    notification.error({
      message: "Unable to load roles",
      description: errorMessage(error, "Please refresh the page and try again."),
    });
  } finally {
    loadingRoles.value = false;
  }
};

const fetchChildren = async (parentOrgId, target, loading) => {
  if (!parentOrgId) return;

  loading.value = true;
  try {
    const { data } = await axios.get("get_sub_counties_list", {
      params: { parent_id: parentOrgId },
    });
    target.value = normalizeList(data);
  } catch (error) {
    target.value = [];
    notification.error({
      message: "Unable to load locations",
      description: errorMessage(
        error,
        "Please select the parent location again."
      ),
    });
  } finally {
    loading.value = false;
  }
};

const resetLocationFrom = (level) => {
  const order = [
    "county",
    "sub_county",
    "ward",
    "location",
    "sub_location",
    "village",
  ];
  const listFor = {
    sub_county: subCounties,
    ward: wards,
    location: locations,
    sub_location: subLocations,
    village: villages,
  };

  order.slice(order.indexOf(level) + 1).forEach((name) => {
    formState[name] = null;
    errors[name] = "";
    if (listFor[name]) listFor[name].value = [];
  });
};

const onCountyChange = (orgId) => {
  errors.county = "";
  resetLocationFrom("county");
  fetchChildren(orgId, subCounties, loadingSubCounties);
};

const onSubCountyChange = (orgId) => {
  errors.sub_county = "";
  resetLocationFrom("sub_county");
  fetchChildren(orgId, wards, loadingWards);
};

const onWardChange = (orgId) => {
  errors.ward = "";
  resetLocationFrom("ward");
  fetchChildren(orgId, locations, loadingLocations);
};

const onLocationChange = (orgId) => {
  errors.location = "";
  resetLocationFrom("location");
  fetchChildren(orgId, subLocations, loadingSubLocations);
};

const onSubLocationChange = (orgId) => {
  errors.sub_location = "";
  resetLocationFrom("sub_location");
  fetchChildren(orgId, villages, loadingVillages);
};

// ID numbers are stored as strings, so strip everything that is not a digit.
// This keeps leading zeros (e.g. 00123456) intact.
const onIdNoInput = (event) => {
  formState.id_no = String(event?.target?.value || "")
    .replace(/\D/g, "")
    .slice(0, 20);
  errors.id_no = "";
  if (formState.confirm_id_no) validate("confirm_id_no");
};

const onConfirmIdNoInput = (event) => {
  formState.confirm_id_no = String(event?.target?.value || "")
    .replace(/\D/g, "")
    .slice(0, 20);
  errors.confirm_id_no = "";
};

// Keep only digits and drop the "+" prefix. A leading local zero is rewritten
// to the 254 country code, matching what the API expects.
const onPhoneInput = (event) => {
  let digits = String(event?.target?.value || "").replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `254${digits.slice(1)}`;
  }
  formState.phone_no = digits.slice(0, 12);
  errors.phone_no = "";

  // Editing the number after an OTP was issued invalidates that OTP.
  if (otpSent.value && formState.phone_no !== otpPhone.value) {
    resetOtp();
  }
};

// Accept a bare 9-digit number (712345678) and add the country code.
const normalizePhone = () => {
  let digits = String(formState.phone_no || "").replace(/\D/g, "");
  if (digits.length === 9) {
    digits = `254${digits}`;
  }
  formState.phone_no = digits.slice(0, 12);
};

const onPhoneBlur = () => {
  normalizePhone();
  validate("phone_no");
};

const onOtpInput = (event) => {
  formState.otp = String(event?.target?.value || "")
    .replace(/\D/g, "")
    .slice(0, 6);
  errors.otp = "";
};

const resetOtp = () => {
  otpSent.value = false;
  otpPhone.value = "";
  formState.otp = "";
  errors.otp = "";
};

// Step 1: ask the API to send the CHP / VE a registration OTP.
const sendOtp = async () => {
  sendingOtp.value = true;
  try {
    const { data } = await axios.post("registration/get_otp", {
      first_name: String(formState.first_name || "").trim(),
      last_name: String(formState.last_name || "").trim(),
      phone_no: String(formState.phone_no || ""),
    });

    otpSent.value = true;
    otpPhone.value = formState.phone_no;
    formState.otp = "";

    notification.success({
      message: "OTP sent",
      description:
        data?.message ||
        `A 6-digit code was sent to +${formState.phone_no}. Ask the CHP / VE for the code to complete the registration.`,
      duration: 6,
    });

    nextTick(() => otpInputRef.value?.focus?.());
    return true;
  } catch (error) {
    applyApiErrors(error?.response?.data);
    notification.error({
      message: "Could not send OTP",
      description: errorMessage(
        error,
        "Please check the phone number and try again."
      ),
    });
    return false;
  } finally {
    sendingOtp.value = false;
  }
};

const resendOtp = async () => {
  if (sendingOtp.value) return;
  await sendOtp();
};

// Step 2: create the CHP / VE once the OTP has been confirmed. id_no /
// confirm_id_no / phone_no are sent as strings so the API keeps leading zeros.
const createChpVe = async () => {
  submitting.value = true;
  try {
    const { data } = await axios.post("user/create", {
      first_name: String(formState.first_name || "").trim(),
      middle_name: String(formState.middle_name || "").trim(),
      last_name: String(formState.last_name || "").trim(),
      id_no: String(formState.id_no || ""),
      confirm_id_no: String(formState.confirm_id_no || ""),
      phone_no: String(formState.phone_no || ""),
      organization: COMMUNITY_UNIT_ORG_TYPE_ID,
      role: formState.role,
      gender: formState.gender,
      // The API validates the village as `location_code`.
      location_code: String(formState.village || ""),
      otp: String(formState.otp || ""),
    });

    notification.success({
      message: "CHP / VE Registered",
      description:
        data?.message ||
        "The CHP / VE was added to the master list successfully.",
      duration: 5.5,
    });

    resetForm();
  } catch (error) {
    applyApiErrors(error?.response?.data);
    notification.error({
      message: "Could not add CHP / VE",
      description: errorMessage(
        error,
        "Please check the details and try again."
      ),
      duration: 5.5,
    });
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  Object.assign(formState, {
    first_name: "",
    middle_name: "",
    last_name: "",
    id_no: "",
    confirm_id_no: "",
    phone_no: "",
    gender: null,
    role: null,
    county: null,
    sub_county: null,
    ward: null,
    location: null,
    sub_location: null,
    village: null,
    otp: "",
  });
  subCounties.value = [];
  wards.value = [];
  locations.value = [];
  subLocations.value = [];
  villages.value = [];
  clearErrors();
  resetOtp();
};

const handleSubmit = async () => {
  // `formBusy` is set synchronously so a double click / Enter + click cannot
  // send two OTPs or create the record twice.
  if (formBusy.value || sendingOtp.value || submitting.value) return;

  formBusy.value = true;
  try {
    const isValid = await validateAll();
    if (!isValid) return;

    if (!otpSent.value) {
      await sendOtp();
      return;
    }

    await createChpVe();
  } finally {
    formBusy.value = false;
  }
};

onMounted(() => {
  fetchCounties();
  fetchRoles();
});
</script>

<style lang="less" scoped>
.stakeholder-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 24px 4px 18px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eef2f5;
}
.stakeholder-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.stakeholder-pageheader-icon {
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
.stakeholder-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.stakeholder-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 640px;
  line-height: 1.5;
}
.stakeholder-pageheader-link {
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

.stakeholder-form-shell {
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
.field-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.45;
}
.errors {
  margin: 4px 0 0;
  font-size: 11px;
  color: #d4380d;
  line-height: 1.4;
}

.otp-panel {
  background: #f4fcf6;
  border: 1px solid #c9e6d3;
  border-radius: 10px;
  padding: 14px 16px 2px;
  margin: 4px 0 18px;
}
.otp-panel-head {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.otp-panel-icon {
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
.otp-panel-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #15693c;
  letter-spacing: 0.3px;
  line-height: 1.2;
}
.otp-panel-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #6f7d75;
  line-height: 1.45;
}
.otp-resend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-bottom: 24px;
}
.otp-resend-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid #c9e6d3;
  background: #fff;
  color: #15693c;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: #eafff5;
    border-color: #a9d8bb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
.otp-resend-hint {
  font-size: 11px;
  color: #8a9399;
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
@media (max-width: 600px) {
  .event-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .btn-cancel {
    justify-content: center;
  }
}
</style>











