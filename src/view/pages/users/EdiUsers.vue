<template>
  <a-form class="ue-form" layout="vertical" autocomplete="off" @finish="submit">
    <div class="ue-grid">
      <a-form-item
        label="First name"
        required
        :validate-status="errors.first_name ? 'error' : ''"
        :help="errors.first_name"
      >
        <a-input v-model:value="formState.first_name" placeholder="First name" />
      </a-form-item>

      <a-form-item label="Middle name">
        <a-input v-model:value="formState.middle_name" placeholder="Middle name (optional)" />
      </a-form-item>

      <a-form-item
        label="Last name"
        required
        :validate-status="errors.last_name ? 'error' : ''"
        :help="errors.last_name"
      >
        <a-input v-model:value="formState.last_name" placeholder="Last name" />
      </a-form-item>

      <a-form-item
        label="ID number"
        :validate-status="errors.id_no ? 'error' : ''"
        :help="errors.id_no"
      >
        <a-input
          v-model:value="formState.id_no"
          :placeholder="`Current: ${formFields.current_id_no || '—'}`"
          maxlength="8"
        />
        <template #extra>Leave blank to keep the current ID number.</template>
      </a-form-item>

      <a-form-item label="Phone number">
        <a-input v-model:value="formState.phone_no" disabled />
        <template #extra>Phone numbers are managed separately.</template>
      </a-form-item>

      <a-form-item label="Location">
        <a-input v-model:value="formState.location_id" disabled />
      </a-form-item>

      <a-form-item
        label="Organisation"
        required
        :validate-status="errors.org_types_id ? 'error' : ''"
        :help="errors.org_types_id"
      >
        <a-select
          v-model:value="formState.org_types_id"
          show-search
          option-filter-prop="label"
          placeholder="Select organisation"
          :loading="loadingOrganizations"
          :options="organizationOptions"
          @change="onOrganizationChange"
        />
      </a-form-item>

      <a-form-item
        label="Role"
        required
        :validate-status="errors.role_id ? 'error' : ''"
        :help="errors.role_id"
      >
        <a-select
          v-model:value="formState.role_id"
          show-search
          option-filter-prop="label"
          placeholder="Select role"
          :loading="loadingRoles"
          :options="roleOptions"
        />
      </a-form-item>
    </div>

    <div class="ue-note">
      <sdFeatherIcons type="info" size="13" />
      <span>
        Changes take effect immediately. Only users below national level can be
        edited from this page.
      </span>
    </div>

    <footer class="ue-foot">
      <sdButton size="small" class="pill-btn" @click="$emit('close-editmodal', false)">
        Cancel
      </sdButton>
      <sdButton
        size="small"
        class="pill-btn is-primary"
        html-type="submit"
        :loading="saving"
        @click="submit"
      >
        Save changes
      </sdButton>
    </footer>
  </a-form>
</template>

<script setup>
import { computed, defineEmits, defineProps, onMounted, reactive, ref } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';

const props = defineProps({
  formFields: { type: Object, required: true },
});

const emit = defineEmits(['close-editmodal', 'saved']);

const formState = reactive({
  first_name: props.formFields.first_name || '',
  middle_name: props.formFields.middle_name || '',
  last_name: props.formFields.last_name || '',
  location_id: props.formFields.location_id || '',
  org_types_id: props.formFields.org_types_id ?? null,
  role_id: props.formFields.role_id ?? null,
  id_no: '',
  phone_no: props.formFields.phone_no || '',
});

const errors = reactive({});
const organizations = ref([]);
const roles = ref([]);
const loadingOrganizations = ref(false);
const loadingRoles = ref(false);
const saving = ref(false);

const organizationOptions = computed(() =>
  organizations.value.map((org) => ({
    value: org.id,
    label: org.description ? `${org.name} — ${org.description}` : org.name,
  })),
);

const roleOptions = computed(() =>
  roles.value.map((role) => ({ value: role.id, label: role.name })),
);

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const fetchOrganizations = async () => {
  loadingOrganizations.value = true;
  try {
    const { data } = await axios.get('update_user_organizations');
    organizations.value = data?.data || [];
  } catch (error) {
    notification.error({
      message: 'Unable to load organisations',
      description: errorMessage(error, 'Please try again.'),
    });
  } finally {
    loadingOrganizations.value = false;
  }
};

const fetchRoles = async (organizationId) => {
  if (!organizationId) {
    roles.value = [];
    return;
  }

  loadingRoles.value = true;
  try {
    const { data } = await axios.get('get_roles_given_the_org', {
      params: { organization_id: organizationId },
    });
    roles.value = data?.data || [];
  } catch (error) {
    roles.value = [];
    notification.error({
      message: 'Unable to load roles',
      description: errorMessage(error, 'Please try again.'),
    });
  } finally {
    loadingRoles.value = false;
  }
};

const onOrganizationChange = (organizationId) => {
  formState.role_id = null;
  delete errors.org_types_id;
  delete errors.role_id;
  fetchRoles(organizationId);
};

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!formState.first_name?.trim()) errors.first_name = 'First name is required.';
  if (!formState.last_name?.trim()) errors.last_name = 'Last name is required.';
  if (!formState.org_types_id) errors.org_types_id = 'Organisation is required.';
  if (!formState.role_id) errors.role_id = 'Role is required.';

  if (formState.id_no && !/^\d{6,8}$/.test(formState.id_no)) {
    errors.id_no = 'ID number must be 6 to 8 digits.';
  }

  return Object.keys(errors).length === 0;
};

const submit = async () => {
  if (saving.value || !validate()) return;

  saving.value = true;
  try {
    const { data } = await axios.post(`update_user_details/${props.formFields.id}/`, {
      first_name: formState.first_name.trim(),
      middle_name: formState.middle_name?.trim() || null,
      last_name: formState.last_name.trim(),
      org_types_id: formState.org_types_id,
      role_id: formState.role_id,
    });

    // The ID number lives in the masterlist and has its own endpoint. Only
    // call it when the user actually typed a new value.
    if (formState.id_no) {
      await axios.post(
        `update_user_id_no/${props.formFields.id}/${formState.id_no}/`,
        { id: props.formFields.id, id_no: formState.id_no },
      );
    }

    notification.success({
      message: 'Success',
      description: data?.message || 'User details updated successfully.',
    });

    emit('saved');
    emit('close-editmodal', false);
  } catch (error) {
    notification.error({
      message: 'User update failed',
      description: errorMessage(error, 'Please try again.'),
    });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await fetchOrganizations();
  if (formState.org_types_id) await fetchRoles(formState.org_types_id);
});
</script>

<style lang="less" scoped>
.ue-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.ue-form :deep(.ant-form-item-label > label) {
  font-size: 12px;
  font-weight: 600;
  color: #4d5661;
}

.ue-form :deep(.ant-input),
.ue-form :deep(.ant-select-selector) {
  border-radius: 8px !important;
}

.ue-form :deep(.ant-form-item-extra) {
  font-size: 11px;
  color: #8a90a6;
  margin-top: 3px;
}

.ue-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 9px;
  background: #f3fcf6;
  border: 1px solid #d9f0e2;
  color: #2f6746;
  font-size: 12px;
  line-height: 1.5;
}

.ue-foot {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed #e1efe6;
}

/* The modal is rendered by the parent page; define the shared button look
   here too so the form's footer is styled when the form is used standalone. */
.pill-btn {
  border-radius: 999px !important;
  font-weight: 600;
  min-width: 110px;
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  &:hover, &:focus {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
  &.is-primary {
    background: #16a34a !important;
    border-color: #16a34a !important;
    color: #fff !important;
    &:hover, &:focus {
      background: #15803d !important;
      border-color: #15803d !important;
    }
  }
}

@media (max-width: 640px) {
  .ue-grid {
    grid-template-columns: 1fr;
  }
}
</style>
