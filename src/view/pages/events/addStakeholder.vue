<template>
  <Main>
    <div class="stakeholder-pageheader">
      <div class="stakeholder-pageheader-text">
        <span class="stakeholder-pageheader-icon">
          <sdFeatherIcons type="user-plus" size="18" />
        </span>
        <div>
          <h2 class="stakeholder-pageheader-title">Add Stakeholder</h2>
          <p class="stakeholder-pageheader-sub" v-if="eventName">
            Registering a stakeholder for <b>{{ eventName }}</b>
            <template v-if="eventCode"> ({{ eventCode }})</template>.
          </p>
          <p class="stakeholder-pageheader-sub" v-else>
            Register a stakeholder and confirm their phone number with a
            one-time code before the record is saved.
          </p>
        </div>
      </div>
      <router-link to="/stakeholders" class="stakeholder-pageheader-link">
        <sdFeatherIcons type="list" size="14" />
        <span>View all stakeholders</span>
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
                    name="addstakeholder"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- Section: Stakeholder details -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="user" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Stakeholder Details</h4>
                          <p class="section-sub">
                            Names as they appear on the stakeholder's
                            identification document.
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
                              Digits only, up to 20 characters. Leading zeros
                              are kept.
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


                    <!-- Section: Contact & OTP verification -->
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
                            The stakeholder's phone number is confirmed with a
                            one-time code before the record is saved.
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
                              Confirm the stakeholder's phone
                            </h4>
                            <p class="otp-panel-sub">
                              A 6-digit code was sent to
                              <b>+{{ otpPhone }}</b>. Ask the stakeholder to
                              read it out.
                            </p>
                          </div>
                        </div>
                        <a-row :gutter="18" align="bottom">
                          <a-col :xs="24" :md="10">
                            <a-form-item name="otp" label="Stakeholder OTP">
                              <a-input
                                ref="otpInputRef"
                                v-model:value="formState.otp"
                                :maxlength="6"
                                inputmode="numeric"
                                placeholder="Enter 6-digit code"
                                @input="onOtpInput"
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
                        stakeholder receives.
                      </p>
                    </div>


                    <!-- Section: Organization & role -->
                    <div class="section-card">
                      <div class="section-head">
                        <span class="section-icon">
                          <sdFeatherIcons type="briefcase" size="14" />
                        </span>
                        <div>
                          <h4 class="section-title">Organization &amp; Role</h4>
                          <p class="section-sub">
                            Which organization does the stakeholder belong to
                            and what role do they hold?
                          </p>
                        </div>
                      </div>

                      <a-row :gutter="18">
                        <a-col :xs="24" :md="12">
                          <a-form-item label="Organization">
                            <a-select
                              v-model:value="formState.organization"
                              placeholder="Select organization"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingOrganizations"
                              :disabled="loadingOrganizations"
                              @change="onOrganizationChange"
                              @blur="validate('organization')"
                            >
                              <a-select-option
                                v-for="organization in organizations"
                                :key="organization.id"
                                :value="organization.id"
                                :label="`${organization.name}`"
                              >
                                {{ organization.name }}
                              </a-select-option>
                            </a-select>
                            <p class="errors" v-if="!!errors.organization">
                              {{ errors.organization }}
                            </p>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item label="Role">
                            <a-select
                              v-model:value="formState.role"
                              placeholder="Select role"
                              show-search
                              option-filter-prop="label"
                              :loading="loadingRoles"
                              :disabled="
                                !formState.organization || loadingRoles
                              "
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
                              Select an organization first to load its roles.
                            </p>
                            <p
                              class="field-hint"
                              v-else-if="!loadingRoles && !roles.length"
                            >
                              No roles are linked to this organization.
                            </p>
                            <p class="errors" v-if="!!errors.role">
                              {{ errors.role }}
                            </p>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>

                    <div class="event-actions">
                      <router-link to="/stakeholders" class="btn-cancel">
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
                              ? "Create Stakeholder"
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
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";
import * as Yup from "yup";
import authHeader from "../../../services/auth-header";
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";

const API_URL = process.env.VUE_APP_BASE_URL;
const route = useRoute();

// The event details page links here with the event name/code when the
// stakeholder is being registered from a stakeholder event. Both are optional:
// this page also works as a standalone "Add Stakeholder" screen.
const eventName = computed(() =>
  route.query.event ? String(route.query.event) : ""
);
const eventCode = computed(() =>
  route.query.event_code ? String(route.query.event_code) : ""
);

const genderOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];

// Mirrors the API rules: id_no is digits only (max 20) and phone_no starts
// with 254 and is exactly 12 digits. Both travel as strings so leading zeros
// in an ID number are preserved.
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
  gender: null,
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
  gender: "",
  otp: "",
});

const organizations = ref([]);
const roles = ref([]);
const loadingOrganizations = ref(false);
const loadingRoles = ref(false);
const sendingOtp = ref(false);
const submitting = ref(false);
const otpSent = ref(false);
const otpPhone = ref("");
const otpInputRef = ref(null);

// Yup runs in non-strict mode, so a numeric select value is accepted for the
// organization/role ids even though the API receives them as numbers.
const stakeholderSchema = Yup.object().shape({
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
    .typeError("Organization is required")
    .required("Organization is required"),
  role: Yup.number().typeError("Role is required").required("Role is required"),
  gender: Yup.string().required("Gender is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

// List endpoints sometimes return a plain array and sometimes a
// { success, data } wrapper. Normalize both so the page never crashes on
// `data.data is undefined`.
const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

// Stakeholders may only be linked to a County (level 2) or Sub-County
// (level 3) organisation — National organisations are filtered out here and
// by the API (?exclude_national=1) so only County / Sub-County roles load.
const STAKEHOLDER_ORG_LEVELS = [2, 3];
const isCountyOrSubCountyOrg = (org) =>
  STAKEHOLDER_ORG_LEVELS.includes(Number(org?.level_id));

const clearErrors = () => {
  Object.keys(errors).forEach((field) => {
    errors[field] = "";
  });
};

const validate = async (field) => {
  try {
    await stakeholderSchema.validateAt(field, formState);
    errors[field] = "";
  } catch (err) {
    errors[err.path || field] = err.message;
  }
};

const validateAll = async () => {
  // Accept a bare 9-digit phone number (e.g. 712345678) even when the field
  // did not blur before submission.
  normalizePhone();
  clearErrors();
  try {
    await stakeholderSchema.validate(formState, { abortEarly: false });
    if (otpSent.value) {
      await otpSchema.validate(formState, { abortEarly: false });
    }
    return true;
  } catch (err) {
    (err.inner || [err]).forEach((item) => {
      if (item.path) errors[item.path] = item.message;
    });
    notification.warning({
      message: "Check the form",
      description: "Please correct the highlighted fields and try again.",
    });
    return false;
  }
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


const fetchOrganizations = async () => {
  loadingOrganizations.value = true;
  try {
    const response = await fetch(`${API_URL}/organizations?exclude_national=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    const payload = await response.json().catch(() => ({}));
    // Belt and braces: drop any National entry that still slips through.
    organizations.value = normalizeListResponse(payload).filter(
      isCountyOrSubCountyOrg
    );
  } catch (error) {
    organizations.value = [];
    notification.error({
      message: "Could not load organizations",
      description: "Please refresh the page and try again.",
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
    const response = await fetch(
      `${API_URL}/get_roles_given_the_org?organization_id=${organizationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    );
    const payload = await response.json().catch(() => ({}));
    roles.value = normalizeListResponse(payload);
  } catch (error) {
    roles.value = [];
    notification.error({
      message: "Could not load roles",
      description:
        "Please check your connection, then select the organization again.",
    });
  } finally {
    loadingRoles.value = false;
  }
};

const onOrganizationChange = (organizationId) => {
  errors.organization = "";
  fetchRoles(organizationId);
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

// Step 1: ask the API to send the stakeholder a registration OTP.
const sendOtp = async () => {
  sendingOtp.value = true;
  try {
    const response = await fetch(`${API_URL}/stakeholder/get_otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({
        first_name: String(formState.first_name || "").trim(),
        last_name: String(formState.last_name || "").trim(),
        phone_no: String(formState.phone_no || ""),
      }),
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok && payload.success !== false) {
      otpSent.value = true;
      otpPhone.value = formState.phone_no;
      formState.otp = "";
      notification.success({
        message: "OTP sent",
        description:
          payload.message ||
          `A 6-digit code was sent to +${formState.phone_no}. Ask the stakeholder for the code to complete the registration.`,
        duration: 6,
      });
      nextTick(() => otpInputRef.value?.focus?.());
      return true;
    }

    notification.error({
      message: "Could not send OTP",
      description:
        payload.message || "Please check the phone number and try again.",
    });
    return false;
  } catch (error) {
    notification.error({
      message: "Could not send OTP",
      description: "An error has occurred. Please try again later.",
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


// Step 2: create the stakeholder. id_no / confirm_id_no / phone_no are sent as
// strings so the API validates them as strings and keeps leading zeros.
const createStakeholder = async () => {
  submitting.value = true;
  try {
    const payload = {
      first_name: String(formState.first_name || "").trim(),
      middle_name: String(formState.middle_name || "").trim(),
      last_name: String(formState.last_name || "").trim(),
      id_no: String(formState.id_no || ""),
      confirm_id_no: String(formState.confirm_id_no || ""),
      phone_no: String(formState.phone_no || ""),
      organization: formState.organization,
      role: formState.role,
      gender: formState.gender,
      otp: String(formState.otp || ""),
    };

    const response = await fetch(`${API_URL}/stakeholder/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success === true) {
      notification.success({
        message: "Stakeholder Created",
        description:
          result.message || "The stakeholder record was created successfully.",
        duration: 5.5,
      });
      resetForm();
      return;
    }

    // 422 responses carry a per-field error map; surface it next to the
    // matching inputs and show the first message in the notification.
    applyApiErrors(result);
    notification.error({
      message: "Could not add stakeholder",
      description:
        result.message || "Please check the details and try again.",
      duration: 5.5,
    });
  } catch (error) {
    notification.error({
      message: "Could not add stakeholder",
      description: "An error has occurred. Please try again later.",
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
    gender: null,
    otp: "",
  });
  roles.value = [];
  clearErrors();
  otpSent.value = false;
  otpPhone.value = "";
};

const handleSubmit = async () => {
  if (sendingOtp.value || submitting.value) return;

  const isValid = await validateAll();
  if (!isValid) return;

  if (!otpSent.value) {
    await sendOtp();
    return;
  }

  await createStakeholder();
};

onMounted(() => {
  fetchOrganizations();
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


