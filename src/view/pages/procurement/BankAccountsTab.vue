<template>
  <ProcurementPageWrapper class="bp-min">
    <div class="sub-head">
      <h4 class="panel-title">
        <span class="section-dot"></span>
        Bank Accounts
      </h4>
      <div class="sub-head-actions">
        <span v-if="accounts.length" class="count-pill">{{ accountCountLabel }}</span>
        <sdButton
          v-if="canManageVendors"
          size="small"
          class="pill-btn is-primary"
          @click="openCreate"
        >
          <sdFeatherIcons type="plus" size="13" /> Add Account
        </sdButton>
      </div>
    </div>

    <section v-if="!accounts.length" class="panel">
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
    </section>

    <div v-else class="bank-card-list">
      <article
        v-for="(account, index) in accounts"
        :key="account.id"
        class="bank-card"
        :class="{ 'is-primary': account.is_primary }"
      >
        <header class="bank-card-head">
          <span class="bank-index">#{{ index + 1 }}</span>
          <span v-if="account.is_primary" class="primary-chip">
            <sdFeatherIcons type="star" size="11" /> Primary
          </span>
          <div class="bank-card-actions">
            <a-tooltip v-if="canManageVendors" title="Edit account">
              <span class="action-icon" @click="openEdit(account)">
                <sdFeatherIcons type="edit-2" size="13" />
              </span>
            </a-tooltip>
            <a-popconfirm
              v-if="canManageVendors"
              :title="accounts.length <= 1 ? 'Cannot delete the only bank account' : 'Delete this bank account?'"
              :disabled="accounts.length <= 1"
              ok-text="Delete"
              @confirm="onDelete(account)"
            >
              <a-tooltip :title="accounts.length <= 1 ? 'At least one account is required' : 'Delete'">
                <span
                  class="action-icon danger"
                  :style="accounts.length <= 1 ? 'opacity:0.4;cursor:not-allowed' : ''"
                >
                  <sdFeatherIcons type="x" size="14" />
                </span>
              </a-tooltip>
            </a-popconfirm>
          </div>
        </header>

        <div class="bank-card-grid">
          <div class="bank-field">
            <label>Bank Name</label>
            <div class="bank-value">{{ bankNameOf(account) }}</div>
          </div>
          <div class="bank-field">
            <label>Branch</label>
            <div class="bank-value">{{ branchNameOf(account) }}</div>
          </div>
          <div class="bank-field">
            <label>Account #</label>
            <div class="bank-value bank-value-mono">{{ account.account_number || '—' }}</div>
          </div>
          <div class="bank-field">
            <label>Account Name</label>
            <div class="bank-value">{{ account.account_name || '—' }}</div>
          </div>
          <div class="bank-field bank-field-primary">
            <label>Primary</label>
            <a-switch
              :checked="!!account.is_primary"
              :disabled="!canManageVendors || !!account.is_primary"
              :loading="settingPrimaryId === account.id"
              @change="(checked) => onTogglePrimary(account, checked)"
            />
          </div>
        </div>

        <p v-if="account.is_primary" class="bank-card-note">
          Payments for this vendor default to this account.
        </p>
      </article>
    </div>

    <a-modal
      :visible="modalOpen"
      :title="null"
      :footer="null"
      :closable="false"
      :mask-closable="false"
      width="520px"
      @cancel="closeModal"
    >
      <div class="bm-shell">
        <header class="bm-head">
          <h3 class="bm-title">
            {{ editing ? 'Edit Bank Account' : 'Add Bank Account' }}
          </h3>
          <button type="button" class="bm-close" @click="closeModal">
            <sdFeatherIcons type="x" size="16" />
          </button>
        </header>

        <div class="bm-body">
          <a-form layout="vertical" class="bm-form">
            <a-form-item
              label="Bank Name"
              :validate-status="errors.bank_key ? 'error' : ''"
              :help="errors.bank_key"
            >
              <a-select
                v-model:value="form.bank_key"
                placeholder="Select bank"
                show-search
                :filter-option="optionFilter"
                @change="onBankNameChange"
              >
                <a-select-option
                  v-for="group in bankGroups"
                  :key="group.key"
                  :value="group.key"
                  :label="group.name"
                >{{ group.name }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-if="form.bank_key"
              label="Branch"
              :validate-status="errors.bank_id ? 'error' : ''"
              :help="errors.bank_id"
            >
              <a-select
                v-model:value="form.bank_id"
                placeholder="Select branch"
                show-search
                :filter-option="optionFilter"
              >
                <a-select-option
                  v-for="branch in branchOptions"
                  :key="branch.id"
                  :value="branch.id"
                  :label="branchLabelOf(branch)"
                >{{ branchLabelOf(branch) }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="Account Number"
              :validate-status="errors.account_number ? 'error' : ''"
              :help="errors.account_number"
            >
              <a-input
                v-model:value="form.account_number"
                maxlength="30"
                inputmode="numeric"
                placeholder="Digits only"
                @input="onAccountNumberInput"
              />
            </a-form-item>

            <a-form-item
              label="Account Name"
              :validate-status="errors.account_name ? 'error' : ''"
              :help="errors.account_name"
            >
              <a-input
                v-model:value="form.account_name"
                maxlength="255"
                placeholder="Name as it appears on the account"
              />
            </a-form-item>

            <a-form-item label="Mark as primary" class="bm-primary-item">
              <a-switch v-model:checked="form.is_primary" :disabled="isEditingPrimary" />
              <span class="bm-hint">
                {{ isEditingPrimary
                  ? 'Choose another account as primary before clearing this one.'
                  : 'Payments for this vendor will default to this account.' }}
              </span>
            </a-form-item>
          </a-form>
        </div>

        <footer class="bm-foot">
          <sdButton size="small" class="pill-btn" @click="closeModal">
            Cancel
          </sdButton>
          <sdButton
            size="small"
            class="pill-btn is-primary"
            :loading="submitting"
            @click="onSubmit"
          >
            OK
          </sdButton>
        </footer>
      </div>
    </a-modal>
  </ProcurementPageWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { ProcurementPageWrapper } from './style';

const blankForm = () => ({
  // `banks` rows combine a bank and a branch (bank_name + branch_name), so
  // the form picks the bank first (bank_key) and then the branch (bank_id).
  bank_key: null,
  bank_id: null,
  account_number: '',
  account_name: '',
  is_primary: false,
});

/**
 * Key that groups all branch rows belonging to the same bank.
 */
const bankKeyOf = (bank) => {
  if (!bank) return null;
  return `${bank.bank_code || ''}::${bank.bank_name || bank.name || ''}`;
};

const branchLabelOf = (bank) =>
  bank?.branch_name || bank?.branch_code || 'Main branch';

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
    const settingPrimaryId = ref(null);
    // The primary flag can only be moved to another account; the modal must
    // not let the user clear it from the current primary.
    const isEditingPrimary = computed(() => !!editing.value?.is_primary);

    const accountCountLabel = computed(() => {
      const count = accounts.value.length;
      return `${count} ACCOUNT${count === 1 ? '' : 'S'}`;
    });

    /**
     * Group the flat `banks` lookup (one row per bank + branch) into a list of
     * banks, each carrying its branches. Mirrors the create-vendor workflow.
     */
    const bankGroups = computed(() => {
      const map = new Map();

      (banks.value || []).forEach((bank) => {
        const key = bankKeyOf(bank);
        if (!map.has(key)) {
          map.set(key, {
            key,
            name: bank.bank_name || bank.name || 'Bank',
            branches: [],
          });
        }
        map.get(key).branches.push(bank);
      });

      return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    });

    const branchOptions = computed(() => {
      if (!form.bank_key) return [];
      const group = bankGroups.value.find((g) => g.key === form.bank_key);
      if (!group) return [];
      return [...group.branches].sort((a, b) =>
        branchLabelOf(a).localeCompare(branchLabelOf(b)),
      );
    });

    const bankOf = (account) =>
      account?.bank ||
      (banks.value || []).find((b) => b.id === account?.bank_id) ||
      null;

    const bankNameOf = (account) => {
      const bank = bankOf(account);
      return bank?.bank_name || bank?.name || account?.bank_name || '—';
    };

    const branchNameOf = (account) => {
      const bank = bankOf(account);
      return bank?.branch_name || '—';
    };

    onMounted(() => {
      store.dispatch('procurement/fetchBanks');
    });

    const optionFilter = (input, option) =>
      (option?.label || option?.children?.[0]?.children || option?.children || '')
        .toString()
        .toLowerCase()
        .includes((input || '').toLowerCase());

    /**
     * Pick the bank name: reset the branch and auto-select it when the bank
     * has a single branch.
     */
    const onBankNameChange = (bankKey) => {
      form.bank_key = bankKey;
      form.bank_id = null;
      delete errors.bank_id;

      const group = bankGroups.value.find((g) => g.key === bankKey);
      if (group && group.branches.length === 1) {
        form.bank_id = group.branches[0].id;
      }
    };

    // Account numbers are numeric — strip anything else as the user types.
    const onAccountNumberInput = (event) => {
      form.account_number = (event?.target?.value || '').replace(/\D/g, '');
      delete errors.account_number;
    };

    const reset = () => {
      Object.assign(form, blankForm());
      Object.keys(errors).forEach((k) => delete errors[k]);
      editing.value = null;
    };

    const openCreate = () => {
      reset();
      // The first account is always the primary one.
      form.is_primary = accounts.value.length === 0;
      modalOpen.value = true;
    };

    const openEdit = (record) => {
      reset();
      editing.value = record;
      form.bank_id = record.bank_id;
      form.bank_key = bankKeyOf(record.bank || bankOf(record));
      form.account_number = record.account_number || '';
      form.account_name = record.account_name || '';
      form.is_primary = !!record.is_primary;
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      reset();
    };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);

      if (!form.bank_key) errors.bank_key = 'Select a bank';
      if (!form.bank_id) errors.bank_id = 'Select a branch';
      if (!form.account_number?.trim()) errors.account_number = 'Required';
      else if (!/^\d+$/.test(form.account_number.trim())) errors.account_number = 'Digits only';
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

    /**
     * Toggle the primary flag straight from the account card.
     */
    const onTogglePrimary = async (record, checked) => {
      if (!checked || record.is_primary) return;

      settingPrimaryId.value = record.id;

      try {
        await store.dispatch('procurement/setPrimaryBankAccount', {
          vendorId: props.vendorId,
          id: record.id,
        });
      } finally {
        settingPrimaryId.value = null;
      }
    };

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
      settingPrimaryId,
      isEditingPrimary,
      accounts,
      banks,
      bankGroups,
      branchOptions,
      accountCountLabel,
      bankNameOf,
      branchNameOf,
      branchLabelOf,
      optionFilter,
      onBankNameChange,
      onAccountNumberInput,
      onTogglePrimary,
      openCreate,
      openEdit,
      closeModal,
      onSubmit,
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
  .panel-title { margin: 0; display: inline-flex; align-items: center; gap: 8px; }
}
.sub-head-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #2c99ff;
  display: inline-block;
}
.count-pill {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Account cards ─────────────────────────────────────────────────────── */
.bank-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bank-card {
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 12px;
  padding: 14px 18px 12px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.04);
  transition: border-color 0.15s, box-shadow 0.15s;

  &.is-primary {
    border-color: #b7e3c9;
    background: linear-gradient(180deg, #f5fcf8 0%, #ffffff 62%);
  }
  &:hover {
    box-shadow: 0 8px 18px rgba(28, 122, 72, 0.08);
  }
}
.bank-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.bank-index {
  font-size: 11px;
  font-weight: 800;
  color: #8a9399;
  letter-spacing: 0.4px;
}
.primary-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  padding: 2px 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.bank-card-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.bank-card-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.3fr) auto;
  gap: 10px 16px;
  align-items: end;
}
.bank-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  label {
    font-size: 10px;
    font-weight: 700;
    color: #4d5661;
    text-transform: uppercase;
    letter-spacing: 0.35px;
  }
}
.bank-value {
  display: flex;
  align-items: center;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid #e6ecef;
  border-radius: 8px;
  background: #fafcfb;
  color: #2f3742;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bank-value-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  letter-spacing: 0.6px;
}
.bank-field-primary {
  min-width: 64px;
  align-items: flex-start;
  padding-bottom: 8px;
}
.bank-card-note {
  margin: 10px 0 0;
  font-size: 11px;
  color: #7a8a82;
}
@media (max-width: 900px) {
  .bank-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .bank-field-primary { grid-column: 1 / -1; }
}
@media (max-width: 575px) {
  .bank-card-grid { grid-template-columns: 1fr; }
}

/* ── Add / Edit Bank Account modal ─────────────────────────────────────── */
.bm-shell {
  display: flex;
  flex-direction: column;
  background: #fff;
}
.bm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 0 14px;
  border-bottom: 1px solid #eef3f1;
}
.bm-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2437;
}
.bm-close {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8a9399;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover { background: #f3f7f5; color: #1f2437; }
}
.bm-body {
  padding: 18px 0 4px;
  max-height: 60vh;
  overflow-y: auto;
}
.bm-form {
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  :deep(.ant-form-item-label > label) {
    font-size: 13px;
    font-weight: 600;
    color: #2f3742;
    height: 24px;
  }
  :deep(.ant-input) {
    height: 40px;
    border-radius: 8px;
    border-color: #dde4e0;

    &:hover { border-color: #9ad8b4; }
    &:focus {
      border-color: #1f9254;
      box-shadow: 0 0 0 2px rgba(31, 146, 84, 0.12);
    }
  }
  :deep(.ant-select-selector) {
    min-height: 40px !important;
    border-radius: 8px !important;
    border-color: #dde4e0 !important;
  }
  :deep(.ant-select-focused .ant-select-selector) {
    border-color: #1f9254 !important;
    box-shadow: 0 0 0 2px rgba(31, 146, 84, 0.12) !important;
  }
  :deep(.ant-select-selection-item),
  :deep(.ant-select-selection-placeholder) {
    line-height: 38px !important;
  }
}
.bm-primary-item {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
}
.bm-hint {
  font-size: 11px;
  color: #8a9399;
}
.bm-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 0 0;
  border-top: 1px solid #eef3f1;
  background: #fff;
}
</style>
