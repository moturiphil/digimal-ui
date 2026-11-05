<template>
  <Main>
    <div class="stakeholder-pageheader">
      <div class="stakeholder-pageheader-text">
        <span class="stakeholder-pageheader-icon">
          <sdFeatherIcons type="user-plus" size="18" />
        </span>
        <div>
          <h2 class="stakeholder-pageheader-title">Add User</h2>
          <p class="stakeholder-pageheader-sub">
            Register a County or Sub-County user and confirm their phone number
            with a one-time code before the record is added to the master list.
          </p>
        </div>
      </div>
      <router-link to="/registered-users" class="stakeholder-pageheader-link">
        <sdFeatherIcons type="list" size="14" />
        <span>View registered users</span>
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
                    name="adduser"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- Section: User details -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="user" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">User Details</h4>
                          <p class="section-sub">
                            Names as they appear on the user's identification
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
                        <a-col :xs="24" :md="12">
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
                              Digits only, up to 20 characters. Leading zeros
                              are kept.
                            </p>
                            <p class="errors" v-if="!!errors.id_no">
                              {{ errors.id_no }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
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
                      </a-row>
                    </div>

                    <!-- Section: Contact & assignment -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="briefcase" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">
                            Contact &amp; Assignment
                          </h4>
                          <p class="section-sub">
                            Only County and Sub-County organisations are
                            available — National organisations cannot be
                            assigned here.
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="phone_no" label="Phone No">
                            <a-input
                              v-model:value="formState.phone_no"
                              :maxlength="13"
                              inputmode="numeric"
                              placeholder="e.g. 0745 450 770"
                              @input="onPhoneInput"
                              @blur="onPhoneBlur"
                            />
                            <p class="field-hint">
                              Accepts 0745…, 745…, 254745… or +254745… — stored
                              as 254745450770.
                            </p>
                            <p class="errors" v-if="!!errors.phone_no">
                              {{ errors.phone_no }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item
                            name="organization"
                            label="Organisation"
                          >
                            <a-select
                              v-model:value="formState.organization"
                              placeholder="Select organisation"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingOrganizations"
                              @change="onOrganizationChange"
                              @blur="validate('organization')"
                            >
                              <a-select-option
                                v-for="org in organizations"
                                :key="org.id"
                                :value="org.id"
                                :label="org.name"
                              >
                                {{ org.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint">
                              County and Sub-County organisations only.
                            </p>
                            <p class="errors" v-if="!!errors.organization">
                              {{ errors.organization }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>


                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="role" label="Role">
                            <a-select
                              v-model:value="formState.role"
                              placeholder="Select role"
                              show-search
                              option-filter-prop="label"
                              :disabled="
                                !formState.organization || loadingRoles
                              "
                              :loading="loadingRoles"
                              @change="validate('role')"
                              @blur="validate('role')"
                            >
                              <a-select-option
                                v-for="role in roles"
                                :key="role.id"
                                :value="role.id"
                                :label="`${role.name}`"
                              >
                                {{ role.name }}
                              </a-select-option>
                            </a-select>
                            <p
                              class="field-hint"
                              v-if="!formState.organization"
                            >
                              Select an organisation first to load its roles.
                            </p>
                            <p
                              class="field-hint"
                              v-else-if="!loadingRoles && !roles.length"
                            >
                              No roles are linked to this organisation.
                            </p>
                            <p class="errors" v-if="!!errors.role">
                              {{ errors.role }}
                            </p>
                          </a-form-item>
                        </a-col>
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
                                :value="item.id"
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
                      </a-row>

                      <a-row :gutter="18" v-if="isSubCountyOrg">
                        <a-col :xs="24" :md="12">
                          <a-form-item name="subcounty" label="Sub-County">
                            <a-select
                              v-model:value="formState.subcounty"
                              placeholder="Select sub-county"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingSubCounties"
                              :disabled="
                                !formState.county || loadingSubCounties
                              "
                              @change="validate('subcounty')"
                              @blur="validate('subcounty')"
                            >
                              <a-select-option
                                v-for="item in subcounties"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                            <p class="field-hint" v-if="!formState.county">
                              Select a county first to load its sub-counties.
                            </p>
                            <p class="errors" v-if="!!errors.subcounty">
                              {{ errors.subcounty }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>


                      <!-- OTP panel appears once the code has been sent -->
                      <div class="otp-panel" v-if="otpSent">
                        <div class="otp-panel-head">
                          <span class="otp-panel-icon">
                            <sdFeatherIcons type="shield" size="14" />
                          </span>
                          <div>
                            <h5 class="otp-panel-title">
                              Confirm phone number
                            </h5>
                            <p class="otp-panel-sub">
                              Enter the 6-digit code sent to
                              <b>+{{ otpPhone }}</b>.
                            </p>
                          </div>
                        </div>
                        <a-row :gutter="18">
                          <a-col :xs="24" :md="10">
                            <a-form-item name="otp" label="OTP Code">
                              <a-input
                                ref="otpInputRef"
                                v-model:value="formState.otp"
                                :maxlength="6"
                                inputmode="numeric"
                                placeholder="e.g. 123456"
                                @input="onOtpInput"
                                @blur="validate('otp')"
                              />
                              <p class="errors" v-if="!!errors.otp">
                                {{ errors.otp }}
                              </p>
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <div class="otp-resend">
                          <button
                            type="button"
                            class="otp-resend-btn"
                            :disabled="sendingOtp"
                            @click="resendOtp"
                          >
                            <sdFeatherIcons type="refresh-cw" size="12" />
                            {{ sendingOtp ? "Sending..." : "Resend code" }}
                          </button>
                          <span class="otp-resend-hint">
                            The code is single-use and tied to this phone
                            number.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="event-actions">
                      <router-link to="/registered-users" class="btn-cancel">
                        Cancel
                      </router-link>
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        class="btn-save"
                        :disabled="sendingOtp || submitting"
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
                              ? "Create User"
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
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { notification } from "ant-design-vue";
import * as Yup from "yup";
import axios from "@/Axiosconfig";
import { RecordFormWrapper } from "../style";
import { Main, BasicFormWrapper } from "../../styled";

// Mirrors the API rules: a user can only be attached to a County (level 2) or
// Sub-County (level 3) organisation — National organisations are excluded.
const USER_ORG_LEVELS = [2, 3];
const ID_NO_REGEX = /^[0-9]{1,20}$/;
const PHONE_NO_REGEX = /^254[0-9]{9}$/;

const formState = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  id_no: "",
  confirm_id_no: "",
  phone_no: "",
  organization: null,
  role: null,
  county: null,
  subcounty: null,
  otp: "",
});

const errors = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  id_no: "",
  confirm_id_no: "",
  phone_no: "",
  organization: "",
  role: "",
  county: "",
  subcounty: "",
  otp: "",
});

const organizations = ref([]);
const roles = ref([]);
const counties = ref([]);
const subcounties = ref([]);
const loadingOrganizations = ref(false);
const loadingRoles = ref(false);
const loadingCounties = ref(false);
const loadingSubCounties = ref(false);
const sendingOtp = ref(false);
const submitting = ref(false);
const otpSent = ref(false);
const otpPhone = ref("");
const otpInputRef = ref(null);

const selectedOrganization = computed(
  () =>
    organizations.value.find(
      (org) => Number(org.id) === Number(formState.organization)
    ) || null
);

// Sub-County organisations need a sub-county duty station; County
// organisations stop at the county.
const isSubCountyOrg = computed(
  () => Number(selectedOrganization.value?.level_id) === 3
);

const selectedLocationId = computed(() =>
  isSubCountyOrg.value ? formState.subcounty : formState.county
);

const userSchema = Yup.object().shape({
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
  organization: Yup.number()
    .typeError("Organisation is required")
    .required("Organisation is required"),
  role: Yup.number().typeError("Role is required").required("Role is required"),
  county: Yup.number()
    .typeError("County is required")
    .required("County is required"),
  subcounty: Yup.number().nullable().notRequired(),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});


const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const clearErrors = () => {
  Object.keys(errors).forEach((field) => {
    errors[field] = "";
  });
};

const applyApiErrors = (payload) => {
  const apiErrors = payload?.errors || {};
  Object.entries(apiErrors).forEach(([field, messages]) => {
    if (field in errors) {
      errors[field] = Array.isArray(messages)
        ? messages[0]
        : String(messages);
    }
  });
};

// `otp` is declared in `otpSchema`, not in `userSchema` (the code is only
// required once one has been sent), so validate each field against the schema
// that actually owns it. Calling `validateAt()` with a path a schema does not
// define makes Yup throw an internal "schema does not contain the path" error.
const schemaForField = (field) => (field === "otp" ? otpSchema : userSchema);

const validate = async (field) => {
  try {
    await schemaForField(field).validateAt(field, formState);
    errors[field] = "";
  } catch (err) {
    // `subcounty` has no Yup rule beyond being optional — it is required only
    // for Sub-County organisations, so fall back to the manual check.
    if (field === "subcounty" && !isSubCountyOrg.value) {
      errors.subcounty = "";
      return;
    }
    // Only real validation messages belong in the form. Yup's internal errors
    // (unknown path, unresolved schema) are not user-facing.
    if (!(err instanceof Yup.ValidationError)) return;
    errors[err.path || field] = err.message;
  }
};

const validateAll = async () => {
  // Accept a bare 9-digit phone number (e.g. 712345678) even when the field
  // did not blur before submission.
  normalizePhone();
  clearErrors();

  try {
    await userSchema.validate(formState, { abortEarly: false });
  } catch (err) {
    (err.inner || [err]).forEach((item) => {
      if (item.path) errors[item.path] = item.message;
    });
  }

  // Sub-county duty station is required for Sub-County organisations only.
  if (isSubCountyOrg.value && !formState.subcounty) {
    errors.subcounty = "Sub-county is required for a Sub-County organisation.";
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

const fetchOrganizations = async () => {
  loadingOrganizations.value = true;
  try {
    const { data } = await axios.get("organizations", {
      params: { exclude_national: 1 },
    });
    const list = data?.data || [];
    // Belt and braces: drop any National entry that still slips through.
    organizations.value = list.filter((org) =>
      USER_ORG_LEVELS.includes(Number(org.level_id))
    );
  } catch (error) {
    organizations.value = [];
    notification.error({
      message: "Unable to load organisations",
      description: errorMessage(error, "Please refresh the page and try again."),
    });
  } finally {
    loadingOrganizations.value = false;
  }
};

const fetchRoles = async (organizationId) => {
  roles.value = [];
  formState.role = null;
  if (!organizationId) return;

  loadingRoles.value = true;
  try {
    const { data } = await axios.get("get_roles_given_the_org", {
      params: { organization_id: organizationId },
    });
    roles.value = data?.data || [];
  } catch (error) {
    roles.value = [];
    notification.error({
      message: "Unable to load roles",
      description: errorMessage(
        error,
        "Please select the organisation again."
      ),
    });
  } finally {
    loadingRoles.value = false;
  }
};


const fetchCounties = async () => {
  loadingCounties.value = true;
  try {
    const { data } = await axios.get("get_counties");
    counties.value = Array.isArray(data)
      ? data
      : data?.data || data?.message || [];
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

const fetchSubCounties = async (countyId) => {
  subcounties.value = [];
  formState.subcounty = null;

  const county = counties.value.find(
    (item) => Number(item.id) === Number(countyId)
  );
  if (!county?.org_id) return;

  loadingSubCounties.value = true;
  try {
    const { data } = await axios.get("get_sub_counties_list", {
      params: { parent_id: county.org_id },
    });
    subcounties.value = data?.message || [];
  } catch (error) {
    subcounties.value = [];
    notification.error({
      message: "Unable to load sub-counties",
      description: errorMessage(error, "Please select the county again."),
    });
  } finally {
    loadingSubCounties.value = false;
  }
};

const onOrganizationChange = (organizationId) => {
  errors.organization = "";
  errors.role = "";
  errors.subcounty = "";
  // The organisation level decides whether a sub-county is needed, so the
  // location selection starts over whenever it changes.
  formState.county = null;
  formState.subcounty = null;
  errors.county = "";
  subcounties.value = [];
  fetchRoles(organizationId);
};

const onCountyChange = (countyId) => {
  errors.county = "";
  errors.subcounty = "";
  subcounties.value = [];
  formState.subcounty = null;

  if (!countyId || !isSubCountyOrg.value) return;
  fetchSubCounties(countyId);
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


// Step 1: ask the API to send the new user a registration OTP.
const sendOtp = async () => {
  sendingOtp.value = true;
  try {
    const { data } = await axios.post("users/get_otp", {
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
        `A 6-digit code was sent to +${formState.phone_no}. Ask the user for the code to complete the registration.`,
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

// Step 2: create the user once the OTP has been confirmed.
const createUser = async () => {
  submitting.value = true;
  try {
    const { data } = await axios.post("users/store", {
      first_name: String(formState.first_name || "").trim(),
      middle_name: String(formState.middle_name || "").trim(),
      last_name: String(formState.last_name || "").trim(),
      id_no: String(formState.id_no || ""),
      confirm_id_no: String(formState.confirm_id_no || ""),
      phone_no: String(formState.phone_no || ""),
      organization: formState.organization,
      role: formState.role,
      location_id: selectedLocationId.value,
      otp: String(formState.otp || ""),
    });

    notification.success({
      message: "User Registered",
      description:
        data?.message || "The user was added to the master list successfully.",
      duration: 5.5,
    });

    resetForm();
  } catch (error) {
    applyApiErrors(error?.response?.data);
    notification.error({
      message: "Could not add user",
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
    organization: null,
    role: null,
    county: null,
    subcounty: null,
    otp: "",
  });
  roles.value = [];
  subcounties.value = [];
  clearErrors();
  resetOtp();
};

const handleSubmit = async () => {
  if (sendingOtp.value || submitting.value) return;

  const isValid = await validateAll();
  if (!isValid) return;

  if (!otpSent.value) {
    await sendOtp();
    return;
  }

  await createUser();
};

onMounted(() => {
  fetchOrganizations();
  fetchCounties();
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

