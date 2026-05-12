<template>
  <ProcurementPageWrapper class="bp-min">
    <div class="sub-head">
      <h4 class="panel-title">
        <sdFeatherIcons type="credit-card" size="14" />
        Bank Accounts
        <span v-if="accounts.length" class="pt-count">{{ accounts.length }}</span>
      </h4>
      <sdButton
        v-if="canManageVendors"
        size="small"
        class="pill-btn is-primary"
        @click="openCreate"
      >
        <sdFeatherIcons type="plus" size="13" /> Add Account
      </sdButton>
    </div>

    <section class="panel flush">
      <a-table
        class="minimal-table"
        :data-source="accounts"
        :columns="columns"
        row-key="id"
        :pagination="false"
        size="small"
      >
        <template #emptyText>
          <div class="empty-state">
            <div class="empty-icon">▣</div>
            <div class="empty-title">No bank accounts</div>
            <div class="empty-desc">
              Add at least one bank account so this vendor can be paid.
            </div>
            <sdButton
              v-if="canManageVendors"
              size="small"
              class="pill-btn is-primary"
              @click="openCreate"
            >+ Add Account</sdButton>
          </div>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'is_primary'">
            <span v-if="record.is_primary" class="v-chip green">Primary</span>
            <span v-else class="muted">—</span>
          </template>
          <template v-else-if="column.key === 'bank'">
            <span class="vendor-link">
              {{ record.bank?.name || record.bank?.bank_name || record.bank_name || '—' }}
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
                :title="accounts.length <= 1 ? 'Cannot delete the only bank account' : 'Delete this bank account?'"
                :disabled="accounts.length <= 1"
                ok-text="Delete"
                @confirm="onDelete(record)"
              >
                <a-tooltip title="Delete">
                  <span
                    class="action-icon danger"
                    :style="accounts.length <= 1 ? 'opacity:0.4;cursor:not-allowed' : ''"
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
      :title="editing ? 'Edit Bank Account' : 'Add Bank Account'"
      :confirm-loading="submitting"
      :mask-closable="false"
      @ok="onSubmit"
      @cancel="closeModal"
      @update:visible="(v) => (modalOpen = v)"
    >
      <a-form layout="vertical">
        <a-form-item
          label="Bank"
          :validate-status="errors.bank_id ? 'error' : ''"
          :help="errors.bank_id"
        >
          <a-select
            v-model:value="form.bank_id"
            placeholder="Select bank"
            show-search
            :filter-option="optionFilter"
          >
            <a-select-option
              v-for="b in banks"
              :key="b.id"
              :value="b.id"
            >{{ b.name || b.bank_name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Account Number"
          :validate-status="errors.account_number ? 'error' : ''"
          :help="errors.account_number"
        >
          <a-input v-model:value="form.account_number" maxlength="30" />
        </a-form-item>
        <a-form-item
          label="Account Name"
          :validate-status="errors.account_name ? 'error' : ''"
          :help="errors.account_name"
        >
          <a-input v-model:value="form.account_name" />
        </a-form-item>
        <a-form-item label="Mark as primary">
          <a-switch v-model:checked="form.is_primary" />
        </a-form-item>
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
  bank_id: null,
  account_number: '',
  account_name: '',
  is_primary: false,
});

export default {
  name: 'BankAccountsTab',
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

    const accounts = computed(() => store.state.procurement.bankAccounts);
    const banks = computed(() => store.state.procurement.banks);

    const columns = [
      { title: 'Bank', key: 'bank' },
      { title: 'Account #', dataIndex: 'account_number', key: 'account_number' },
      { title: 'Account Name', dataIndex: 'account_name', key: 'account_name' },
      { title: 'Primary', key: 'is_primary', width: 110 },
      { title: 'Actions', key: 'actions', width: 280 },
    ];

    onMounted(() => {
      store.dispatch('procurement/fetchBanks');
    });

    const optionFilter = (input, option) =>
      (option?.children?.[0]?.children || '')
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase());

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
      form.bank_id = record.bank_id;
      form.account_number = record.account_number;
      form.account_name = record.account_name;
      form.is_primary = !!record.is_primary;
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      reset();
    };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!form.bank_id) errors.bank_id = 'Required';
      if (!form.account_number?.trim()) errors.account_number = 'Required';
      else if (form.account_number.length > 30) errors.account_number = 'Max 30 chars';
      if (!form.account_name?.trim()) errors.account_name = 'Required';
      return Object.keys(errors).length === 0;
    };

    const onSubmit = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        const payload = {
          bank_id: form.bank_id,
          account_number: form.account_number.trim(),
          account_name: form.account_name.trim(),
          is_primary: form.is_primary,
        };
        if (editing.value) {
          await store.dispatch('procurement/updateBankAccount', {
            vendorId: props.vendorId,
            id: editing.value.id,
            payload,
          });
        } else {
          await store.dispatch('procurement/createBankAccount', {
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
      store.dispatch('procurement/setPrimaryBankAccount', {
        vendorId: props.vendorId,
        id: record.id,
      });

    const onDelete = (record) =>
      store.dispatch('procurement/deleteBankAccount', {
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
      accounts,
      banks,
      columns,
      optionFilter,
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
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 10px;
  .panel-title { margin: 0; }
}
</style>
