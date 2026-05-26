<template>
  <ProcurementPageWrapper class="bp-min">
    <div class="sub-head">
      <h4 class="panel-title">
        <sdFeatherIcons type="users" size="14" />
        Contacts
        <span v-if="contacts.length" class="pt-count">{{ contacts.length }}</span>
      </h4>
      <sdButton
        v-if="canManageVendors"
        size="small"
        class="pill-btn is-primary"
        @click="openCreate"
      >
        <sdFeatherIcons type="plus" size="13" /> Add Contact
      </sdButton>
    </div>

    <section class="panel flush">
      <a-table
        class="minimal-table"
        :data-source="contacts"
        :columns="columns"
        row-key="id"
        :pagination="false"
        size="small"
      >
        <template #emptyText>
          <div class="empty-state">
            <div class="empty-icon">☺</div>
            <div class="empty-title">No contacts</div>
            <div class="empty-desc">
              Add at least one contact person for this vendor.
            </div>
            <sdButton
              v-if="canManageVendors"
              size="small"
              class="pill-btn is-primary"
              @click="openCreate"
            >+ Add Contact</sdButton>
          </div>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span class="vendor-link">{{ fullName(record) }}</span>
          </template>
          <template v-else-if="column.key === 'is_primary'">
            <span v-if="record.is_primary" class="v-chip green">Primary</span>
            <span v-else class="muted">—</span>
          </template>
          <template v-else-if="column.key === 'is_active'">
            <span
              class="v-chip"
              :class="record.is_active === false ? 'muted' : 'green'"
            >
              {{ record.is_active === false ? 'Inactive' : 'Active' }}
            </span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space :size="2">
              <a-tooltip
                v-if="canManageVendors && !record.is_primary"
                title="Set as primary"
              >
                <span class="action-icon success" @click="setPrimary(record)">
                  <sdFeatherIcons type="star" size="13" />
                </span>
              </a-tooltip>
              <a-tooltip v-if="canManageVendors" title="Edit">
                <span class="action-icon" @click="openEdit(record)">
                  <sdFeatherIcons type="edit-2" size="13" />
                </span>
              </a-tooltip>
              <a-popconfirm
                v-if="canManageVendors"
                :title="contacts.length <= 1 ? 'Cannot delete the only contact' : 'Delete this contact?'"
                :disabled="contacts.length <= 1"
                ok-text="Delete"
                @confirm="onDelete(record)"
              >
                <a-tooltip title="Delete">
                  <span
                    class="action-icon danger"
                    :style="contacts.length <= 1 ? 'opacity:0.4;cursor:not-allowed' : ''"
                  >
                    <sdFeatherIcons type="trash-2" size="13" />
                  </span>
                </a-tooltip>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </section>

    <a-modal
      :visible="modalOpen"
      :title="editing ? 'Edit Contact' : 'Add Contact'"
      :confirm-loading="submitting"
      :mask-closable="false"
      @ok="onSubmit"
      @cancel="closeModal"
      @update:visible="(v) => (modalOpen = v)"
    >
      <a-form layout="vertical">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item
              label="First Name"
              :validate-status="errors.first_name ? 'error' : ''"
              :help="errors.first_name"
            >
              <a-input v-model:value="form.first_name" maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="Last Name"
              :validate-status="errors.last_name ? 'error' : ''"
              :help="errors.last_name"
            >
              <a-input v-model:value="form.last_name" maxlength="100" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          label="Middle Name"
          :validate-status="errors.middle_name ? 'error' : ''"
          :help="errors.middle_name"
        >
          <a-input v-model:value="form.middle_name" maxlength="100" />
        </a-form-item>
        <a-form-item
          label="Phone Number"
          :validate-status="errors.phone_number ? 'error' : ''"
          :help="errors.phone_number"
        >
          <a-input v-model:value="form.phone_number" maxlength="20" />
        </a-form-item>
        <a-form-item
          label="Email"
          :validate-status="errors.email ? 'error' : ''"
          :help="errors.email"
        >
          <a-input v-model:value="form.email" maxlength="255" />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Mark as primary">
              <a-switch v-model:checked="form.is_primary" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Active">
              <a-switch v-model:checked="form.is_active" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </ProcurementPageWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { ProcurementPageWrapper } from './style';

const blankForm = () => ({
  first_name: '',
  middle_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  is_primary: false,
  is_active: true,
});

export default {
  name: 'ContactsTab',
  components: { ProcurementPageWrapper },
  props: {
    vendorId: { type: Number, required: true },
  },
  setup(props) {
    const store = useStore();
    const permissions = useProcurementPermissions();

    const modalOpen = ref(false);
    const editing = ref(null);
    const form = reactive(blankForm());
    const errors = reactive({});
    const submitting = ref(false);

    const contacts = computed(() => store.state.procurement.contacts);

    const columns = [
      { title: 'Name', key: 'name' },
      { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Primary', key: 'is_primary', width: 110 },
      { title: 'Status', key: 'is_active', width: 110 },
      { title: 'Actions', key: 'actions', width: 280 },
    ];

    onMounted(() => {
      store.dispatch('procurement/fetchContacts', props.vendorId);
    });

    const fullName = (r) =>
      [r.first_name, r.middle_name, r.last_name].filter(Boolean).join(' ');

    const reset = () => {
      Object.assign(form, blankForm());
      Object.keys(errors).forEach((k) => delete errors[k]);
      editing.value = null;
    };

    const openCreate = () => {
      reset();
      modalOpen.value = true;
    };

    const openEdit = (record) => {
      reset();
      editing.value = record;
      form.first_name = record.first_name || '';
      form.middle_name = record.middle_name || '';
      form.last_name = record.last_name || '';
      form.phone_number = record.phone_number || '';
      form.email = record.email || '';
      form.is_primary = !!record.is_primary;
      form.is_active = record.is_active !== false;
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      reset();
    };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!form.first_name?.trim()) errors.first_name = 'Required';
      if (!form.last_name?.trim()) errors.last_name = 'Required';
      if (!form.phone_number?.trim()) errors.phone_number = 'Required';
      else if (form.phone_number.length > 20) errors.phone_number = 'Max 20 chars';
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
        errors.email = 'Invalid email';
      }
      return Object.keys(errors).length === 0;
    };

    const onSubmit = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        const payload = {
          first_name: form.first_name.trim(),
          middle_name: form.middle_name?.trim() || null,
          last_name: form.last_name.trim(),
          phone_number: form.phone_number.trim(),
          email: form.email?.trim() || null,
          is_primary: form.is_primary,
          is_active: form.is_active,
        };
        if (editing.value) {
          await store.dispatch('procurement/updateContact', {
            vendorId: props.vendorId,
            id: editing.value.id,
            payload,
          });
        } else {
          await store.dispatch('procurement/createContact', {
            vendorId: props.vendorId,
            payload,
          });
        }
        modalOpen.value = false;
        reset();
      } catch (e) {
        const fe = e?.response?.data?.errors;
        if (fe) {
          Object.entries(fe).forEach(([k, v]) => {
            errors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
      } finally {
        submitting.value = false;
      }
    };

    const setPrimary = (record) =>
      store.dispatch('procurement/setPrimaryContact', {
        vendorId: props.vendorId,
        id: record.id,
      });

    const onDelete = (record) =>
      store.dispatch('procurement/deleteContact', {
        vendorId: props.vendorId,
        id: record.id,
      });

    return {
      ...permissions,
      modalOpen,
      editing,
      form,
      errors,
      submitting,
      contacts,
      columns,
      fullName,
      openCreate,
      openEdit,
      closeModal,
      onSubmit,
      setPrimary,
      onDelete,
    };
  },
};
</script>

<style lang="less" scoped>
.sub-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
</style>
