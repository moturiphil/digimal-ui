<template>
  <a-modal
    :visible="open"
    :title="null"
    :footer="null"
    :closable="false"
    width="820px"
    :mask-closable="false"
    wrap-class-name="vendor-modal-wrap"
    @cancel="close"
    @update:visible="(v) => $emit('update:open', v)"
  >
    <div class="vm-shell">
      <!-- Header banner -->
      <header class="vm-head">
        <div class="vm-head-left">
          <span class="vm-icon">
            <sdFeatherIcons :type="isEdit ? 'edit-3' : 'plus-circle'" size="18" />
          </span>
          <div>
            <h3 class="vm-title">{{ isEdit ? 'Edit Vendor' : 'New Vendor' }}</h3>
            <p class="vm-sub">
              {{ isEdit
                ? 'Update vendor profile, tax compliance and bank account details.'
                : 'Register a supplier with their location, tax info and bank accounts.' }}
            </p>
          </div>
        </div>
        <button class="vm-close" type="button" @click="close">
          <sdFeatherIcons type="x" size="16" />
        </button>
      </header>

      <div class="vm-body">
        <a-form layout="vertical" class="vm-form">
          <!-- Section: Basics -->
          <div class="vm-section">
            <h4 class="vm-section-title">
              <span class="vm-dot"></span> Vendor details
            </h4>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Vendor Name"
                  :validate-status="errors.name ? 'error' : ''"
                  :help="errors.name"
                >
                  <a-input v-model:value="form.name" placeholder="e.g. Acme Suppliers Ltd" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Method of Procurement"
                  :validate-status="errors.method_of_procurement ? 'error' : ''"
                  :help="errors.method_of_procurement"
                >
                  <a-select
                    v-model:value="form.method_of_procurement"
                    placeholder="Select method of procurement"
                    @change="onMethodChange"
                  >
                    <a-select-option value="rfq">Request for Quotation (RFQ)</a-select-option>
                    <a-select-option value="direct">Direct</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-if="form.method_of_procurement === 'direct'" :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Category"
                  :validate-status="errors.category ? 'error' : ''"
                  :help="errors.category"
                >
                  <a-select v-model:value="form.category" placeholder="Select category">
                    <a-select-option value="public">Public Institute</a-select-option>
                    <a-select-option value="fbo">Faith-Based Organization (FBO)</a-select-option>
                    <a-select-option value="cbo">Community-Based Organization (CBO)</a-select-option>
                    <a-select-option value="ngo">Non-Governmental Organization (NGO)</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item
              label="Physical Address"
              :validate-status="errors.physical_address ? 'error' : ''"
              :help="errors.physical_address"
            >
              <a-textarea
                v-model:value="form.physical_address"
                :rows="2"
                placeholder="Street, town, postal code"
              />
            </a-form-item>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="County"
                  :validate-status="errors.county_id ? 'error' : ''"
                  :help="errors.county_id"
                >
                  <a-select
                    v-model:value="form.county_id"
                    placeholder="Select county"
                    show-search
                    option-filter-prop="label"
                    :filter-option="optionFilter"
                    @change="onCountyChange"
                  >
                    <a-select-option
                      v-for="c in counties"
                      :key="c.id"
                      :value="c.id"
                      :label="c.name || c.county_name"
                    >{{ c.name || c.county_name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Sub-County"
                  :validate-status="errors.subcounty_id ? 'error' : ''"
                  :help="errors.subcounty_id"
                >
                  <a-select
                    v-model:value="form.subcounty_id"
                    placeholder="Select sub-county"
                    show-search
                    option-filter-prop="label"
                    :filter-option="optionFilter"
                    :disabled="!form.county_id"
                  >
                    <a-select-option
                      v-for="s in subcountiesForCounty"
                      :key="s.id"
                      :value="s.id"
                      :label="s.name || s.sub_county_name"
                    >{{ s.name || s.sub_county_name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- Section: Tax Compliance (private only) -->
          <div v-if="form.category === 'private'" class="vm-section">
            <h4 class="vm-section-title">
              <span class="vm-dot warn"></span> Tax compliance
              <span class="vm-section-tag">Private vendors</span>
            </h4>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="KRA PIN"
                  :validate-status="errors.kra_pin ? 'error' : ''"
                  :help="errors.kra_pin || 'Format: A123456789B'"
                >
                  <a-input
                    v-model:value="form.kra_pin"
                    placeholder="A123456789B"
                    style="text-transform: uppercase"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Tax Cert. Expiry"
                  :validate-status="errors.tax_certificate_expiry ? 'error' : ''"
                  :help="errors.tax_certificate_expiry"
                >
                  <a-date-picker
                    v-model:value="form.tax_certificate_expiry"
                    style="width: 100%"
                    :disabled-date="disablePastDates"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
              label="Tax Compliance Certificate"
              :validate-status="errors.tax_compliance_certificate ? 'error' : ''"
              :help="errors.tax_compliance_certificate || 'PDF, JPG, JPEG, or PNG · max 5MB'"
            >
              <a-upload
                :file-list="taxCertFileList"
                :before-upload="onPickTaxCert"
                :max-count="1"
                accept=".pdf,.jpg,.jpeg,.png"
                @remove="clearTaxCert"
              >
                <sdButton class="upload-btn">
                  <sdFeatherIcons type="upload" size="13" /> Choose File
                </sdButton>
              </a-upload>
              <div
                v-if="isEdit && existingTaxCertUrl && !form.tax_compliance_certificate"
                class="existing-file"
              >
                <sdFeatherIcons type="file" size="12" />
                Current:
                <a :href="existingTaxCertUrl" target="_blank" rel="noopener">
                  View existing certificate
                </a>
              </div>
            </a-form-item>
          </div>

          <!-- Section: Bank Accounts -->
          <div class="vm-section">
            <h4 class="vm-section-title">
              <span class="vm-dot info"></span> Bank accounts
              <span class="vm-section-tag">{{ form.bank_accounts.length }} account{{ form.bank_accounts.length === 1 ? '' : 's' }}</span>
            </h4>

            <div v-if="errors.bank_accounts" class="form-error-banner">
              <sdFeatherIcons type="alert-triangle" size="13" />
              {{ errors.bank_accounts }}
            </div>

            <div
              v-for="(account, idx) in form.bank_accounts"
              :key="idx"
              class="bank-row"
              :class="{ 'is-primary': account.is_primary }"
            >
              <div class="bank-row-head">
                <span class="bank-row-index">#{{ idx + 1 }}</span>
                <span v-if="account.is_primary" class="bank-primary-pill">
                  <sdFeatherIcons type="star" size="11" /> Primary
                </span>
                <button
                  type="button"
                  class="bank-remove"
                  :disabled="form.bank_accounts.length <= 1"
                  :title="form.bank_accounts.length <= 1 ? 'At least one account required' : 'Remove'"
                  @click="removeBankRow(idx)"
                >
                  <sdFeatherIcons type="x" size="13" />
                </button>
              </div>
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-form-item
                    label="Bank Name"
                    :validate-status="bankErrors[idx]?.bank_key ? 'error' : ''"
                    :help="bankErrors[idx]?.bank_key"
                  >
                    <a-select
                      v-model:value="account.bank_key"
                      placeholder="Select bank"
                      show-search
                      option-filter-prop="label"
                      :filter-option="optionFilter"
                      @change="(v) => onBankNameChange(idx, v)"
                    >
                      <a-select-option
                        v-for="bankOption in bankNameOptions"
                        :key="bankOption.key"
                        :value="bankOption.key"
                        :label="bankOption.label"
                      >{{ bankOption.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="Branch"
                    :validate-status="bankErrors[idx]?.bank_id ? 'error' : ''"
                    :help="bankErrors[idx]?.bank_id"
                  >
                    <a-select
                      v-model:value="account.bank_id"
                      placeholder="Select branch"
                      show-search
                      option-filter-prop="label"
                      :filter-option="optionFilter"
                      :disabled="!account.bank_key"
                    >
                      <a-select-option
                        v-for="branch in branchesForBank(account.bank_key)"
                        :key="branch.id"
                        :value="branch.id"
                        :label="branch.branch_name || branch.name"
                      >{{ branch.branch_name || branch.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="9">
                  <a-form-item
                    label="Account #"
                    :validate-status="bankErrors[idx]?.account_number ? 'error' : ''"
                    :help="bankErrors[idx]?.account_number"
                  >
                    <a-input v-model:value="account.account_number" maxlength="30" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="Account Name"
                    :validate-status="bankErrors[idx]?.account_name ? 'error' : ''"
                    :help="bankErrors[idx]?.account_name"
                  >
                    <a-input v-model:value="account.account_name" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item label="Primary">
                    <a-switch
                      :checked="account.is_primary"
                      @change="(v) => setPrimary(idx, v)"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <button type="button" class="add-bank-btn" @click="addBankRow">
              <sdFeatherIcons type="plus" size="13" /> Add bank account
            </button>
          </div>

          <!-- Section: Contacts -->
          <div class="vm-section">
            <h4 class="vm-section-title">
              <span class="vm-dot info"></span> Contact persons
              <span class="vm-section-tag">{{ form.contacts.length }} contact{{ form.contacts.length === 1 ? '' : 's' }}</span>
            </h4>
            <p v-if="!isEdit" class="vm-section-hint">
              Optional. Add the people we should reach out to for this vendor (e.g. bank contact / accounts payable).
            </p>

            <div v-if="errors.contacts" class="form-error-banner">
              <sdFeatherIcons type="alert-triangle" size="13" />
              {{ errors.contacts }}
            </div>

            <div
              v-for="(contact, idx) in form.contacts"
              :key="idx"
              class="bank-row"
              :class="{ 'is-primary': contact.is_primary }"
            >
              <div class="bank-row-head">
                <span class="bank-row-index">#{{ idx + 1 }}</span>
                <span v-if="contact.is_primary" class="bank-primary-pill">
                  <sdFeatherIcons type="star" size="11" /> Primary
                </span>
                <button
                  type="button"
                  class="bank-remove"
                  title="Remove"
                  @click="removeContactRow(idx)"
                >
                  <sdFeatherIcons type="x" size="13" />
                </button>
              </div>
              <a-row :gutter="12">
                <a-col :span="8">
                  <a-form-item
                    label="First Name"
                    :validate-status="contactErrors[idx]?.first_name ? 'error' : ''"
                    :help="contactErrors[idx]?.first_name"
                  >
                    <a-input v-model:value="contact.first_name" maxlength="100" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="Middle Name"
                    :validate-status="contactErrors[idx]?.middle_name ? 'error' : ''"
                    :help="contactErrors[idx]?.middle_name"
                  >
                    <a-input v-model:value="contact.middle_name" maxlength="100" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="Last Name"
                    :validate-status="contactErrors[idx]?.last_name ? 'error' : ''"
                    :help="contactErrors[idx]?.last_name"
                  >
                    <a-input v-model:value="contact.last_name" maxlength="100" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="9">
                  <a-form-item
                    label="Phone"
                    :validate-status="contactErrors[idx]?.phone_number ? 'error' : ''"
                    :help="contactErrors[idx]?.phone_number"
                  >
                    <a-input v-model:value="contact.phone_number" maxlength="20" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="Email"
                    :validate-status="contactErrors[idx]?.email ? 'error' : ''"
                    :help="contactErrors[idx]?.email"
                  >
                    <a-input v-model:value="contact.email" maxlength="255" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item label="Primary">
                    <a-switch
                      :checked="contact.is_primary"
                      @change="(v) => setPrimaryContact(idx, v)"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <button type="button" class="add-bank-btn" @click="addContactRow">
              <sdFeatherIcons type="plus" size="13" /> Add contact person
            </button>
          </div>

          <!-- Section: LSO / LPO (create-mode only, optional) -->
          <div v-if="!isEdit" class="vm-section">
            <h4 class="vm-section-title">
              <span class="vm-dot"></span> LSO/LPO details
              <span class="vm-section-tag">Optional</span>
            </h4>
            <p class="vm-section-hint">
              Add this only when an LSO/LPO has already been issued for the vendor.
            </p>

            <label class="lso-toggle" :class="{ 'is-on': includeLsoDetails }">
              <a-checkbox :checked="includeLsoDetails" @change="onLsoToggleChange">
                <span class="lso-toggle-label">Add LSO/LPO details</span>
              </a-checkbox>
              <span class="lso-toggle-hint">
                Enable to open LSO/LPO fields and attach the order document.
              </span>
            </label>

            <div v-if="includeLsoDetails" class="lso-fields">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item
                    label="LSO/LPO reference number"
                    :validate-status="errors['lsos.0.lso_number'] ? 'error' : ''"
                    :help="errors['lsos.0.lso_number']"
                  >
                    <a-input v-model:value="form.lso.lso_number" placeholder="e.g. LPO/2026/0421" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="Date of LSO/LPO"
                    :validate-status="errors['lsos.0.issue_date'] ? 'error' : ''"
                    :help="errors['lsos.0.issue_date']"
                  >
                    <a-date-picker
                      v-model:value="form.lso.issue_date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item
                label="Event the LSO/LPO is issued for"
                :validate-status="errors['lsos.0.event_description'] ? 'error' : ''"
                :help="errors['lsos.0.event_description']"
              >
                <a-input
                  v-model:value="form.lso.event_description"
                  placeholder="e.g. Stakeholder Meeting – CHP Training Session 3"
                />
              </a-form-item>
              <a-form-item
                label="Payment notes / additional details"
                :validate-status="errors['lsos.0.notes'] ? 'error' : ''"
                :help="errors['lsos.0.notes']"
              >
                <a-textarea
                  v-model:value="form.lso.notes"
                  :rows="3"
                  placeholder="Amount, payment terms, budget line, or any detail relevant to processing payment"
                />
              </a-form-item>
              <a-form-item
                label="Scanned LSO/LPO document (PDF/JPG/PNG)"
                :validate-status="errors['lsos.0.file'] ? 'error' : ''"
                :help="errors['lsos.0.file']"
              >
                <a-upload
                  :file-list="lsoFileList"
                  :before-upload="onPickLsoFile"
                  :max-count="1"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @remove="clearLsoFile"
                  :class="{ 'has-error': errors['lsos.0.file'] }"
                >
                  <sdButton class="upload-btn">
                    <sdFeatherIcons type="upload" size="13" /> Choose File
                  </sdButton>
                </a-upload>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>

      <!-- Footer -->
      <footer class="vm-foot">
        <span class="vm-foot-hint">
          <sdFeatherIcons type="info" size="12" />
          Fields marked are required to create a vendor record.
        </span>
        <div class="vm-foot-actions">
          <sdButton size="small" class="pill-btn" @click="close">Cancel</sdButton>
          <sdButton
            size="small"
            class="pill-btn is-primary"
            :loading="saving"
            @click="onSubmit"
          >
            {{ isEdit ? 'Save Changes' : 'Create Vendor' }}
          </sdButton>
        </div>
      </footer>
    </div>
  </a-modal>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

const KRA_REGEX = /^[A-Z]\d{9}[A-Z]$/i;

const blankBankAccount = (isPrimary = false) => ({
  id: undefined,
  bank_key: null,
  bank_id: null,
  account_number: '',
  account_name: '',
  is_primary: isPrimary,
});

const blankContact = (isPrimary = false) => ({
  id: undefined,
  first_name: '',
  middle_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  is_primary: isPrimary,
  is_active: true,
});

const blankForm = () => ({
  name: '',
  method_of_procurement: null,
  category: null,
  physical_address: '',
  county_id: null,
  subcounty_id: null,
  kra_pin: '',
  tax_certificate_expiry: null,
  tax_compliance_certificate: null, // File
  bank_accounts: [blankBankAccount(true)],
  contacts: [],
  lso: {
    lso_number: '',
    issue_date: null,
    event_description: '',
    notes: '',
    file: null,
  },
});

export default {
  name: 'VendorFormModal',
  props: {
    open: { type: Boolean, default: false },
    vendor: { type: Object, default: null },
  },
  emits: ['update:open', 'saved'],
  setup(props, { emit }) {
    const store = useStore();
    const form = reactive(blankForm());
    const errors = reactive({});
    const bankErrors = ref([]);
    const contactErrors = ref([]);
    const taxCertFileList = ref([]);
    const lsoFileList = ref([]);
    const includeLsoDetails = ref(false);

    const banks = computed(() => store.state.procurement.banks);
    const bankNameOptions = computed(() => {
      const map = new Map();
      (banks.value || []).forEach((bank) => {
        const key = bankKeyOf(bank);
        if (!key || map.has(key)) return;
        const name = bank.bank_name || bank.name || '';
        const code = bank.bank_code ? ` (${bank.bank_code})` : '';
        map.set(key, { key, label: `${name}${code}` });
      });
      return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
    });
    const counties = computed(() => store.state.procurement.counties);
    const subcountiesForCounty = computed(() =>
      store.getters['procurement/subcountiesFor'](form.county_id)
    );
    const saving = computed(() => store.state.procurement.saving);

    const isEdit = computed(() => !!props.vendor?.id);

    const existingTaxCertUrl = computed(() => {
      const v = props.vendor;
      return v?.tax_certificate_url || v?.tax_compliance_certificate_url || null;
    });

    const resetForm = () => {
      Object.assign(form, blankForm());
      Object.keys(errors).forEach((k) => delete errors[k]);
      bankErrors.value = [];
      contactErrors.value = [];
      taxCertFileList.value = [];
      lsoFileList.value = [];
      includeLsoDetails.value = false;
    };

    const populateFromVendor = (v) => {
      resetForm();
      if (!v) return;
      form.name = v.name || '';
      form.method_of_procurement = v.method_of_procurement || null;
      form.category = v.category || null;
      form.physical_address = v.physical_address || '';
      form.county_id = v.county_id || v.county?.id || null;
      form.subcounty_id = v.subcounty_id || v.sub_county_id || v.sub_county?.id || null;
      form.kra_pin = v.kra_pin || '';
      form.tax_certificate_expiry = v.tax_certificate_expiry
        ? dayjs(v.tax_certificate_expiry).format('YYYY-MM-DD')
        : null;
      const accs = v.bank_accounts || v.active_bank_accounts || [];
      form.bank_accounts = accs.length
        ? accs.map((a) => ({
            id: a.id,
            bank_key: null,
            bank_id: a.bank_id,
            account_number: a.account_number,
            account_name: a.account_name,
            is_primary: !!a.is_primary,
          }))
        : [blankBankAccount(true)];
      syncBankKeys();
      const cts = v.contacts || v.active_contacts || [];
      form.contacts = cts.map((c) => ({
        id: c.id,
        first_name: c.first_name || '',
        middle_name: c.middle_name || '',
        last_name: c.last_name || '',
        phone_number: c.phone_number || '',
        email: c.email || '',
        is_primary: !!c.is_primary,
        is_active: c.is_active !== false,
      }));
      // ensure subcounties cached
      if (form.county_id) {
        store.dispatch('procurement/fetchSubcounties', { countyId: form.county_id });
      }
    };

    watch(
      () => props.open,
      (o) => {
        if (o) {
          store.dispatch('procurement/fetchBanks');
          store.dispatch('procurement/fetchCounties');
          if (props.vendor) populateFromVendor(props.vendor);
          else resetForm();
        }
      },
      { immediate: true }
    );

    const onCountyChange = (id) => {
      form.subcounty_id = null;
      if (id) store.dispatch('procurement/fetchSubcounties', { countyId: id });
    };

    const onMethodChange = (val) => {
      // RFQ vendors are all treated as 'private' on the backend
      // (KRA/tax compliance branch). Direct vendors must explicitly pick a category.
      if (val === 'rfq') {
        form.category = 'private';
      } else {
        form.category = null;
      }
      delete errors.category;
      delete errors.method_of_procurement;
    };

    const bankKeyOf = (bank) => {
      if (!bank) return null;
      const code = bank.bank_code || '';
      const name = bank.bank_name || bank.name || '';
      return `${code}::${name}`;
    };

    const optionFilter = (input, option) => {
      const text = (
        option?.label
        || option?.children?.[0]?.children
        || option?.children
        || ''
      ).toString().toLowerCase();
      return text.includes((input || '').toLowerCase());
    };

    const branchesForBank = (bankKey) => (banks.value || [])
      .filter((bank) => bankKeyOf(bank) === bankKey)
      .sort((a, b) => (a.branch_name || '').localeCompare(b.branch_name || ''));

    const onBankNameChange = (idx, bankKey) => {
      if (!form.bank_accounts[idx]) return;
      form.bank_accounts[idx].bank_key = bankKey;
      form.bank_accounts[idx].bank_id = null;
      if (bankErrors.value[idx]) {
        delete bankErrors.value[idx].bank_key;
        delete bankErrors.value[idx].bank_id;
      }
    };

    const syncBankKeys = () => {
      if (!Array.isArray(form.bank_accounts) || !banks.value?.length) return;
      form.bank_accounts.forEach((account) => {
        if (account.bank_key || !account.bank_id) return;
        const selected = banks.value.find((bank) => bank.id === account.bank_id);
        if (selected) account.bank_key = bankKeyOf(selected);
      });
    };

    watch(banks, () => {
      syncBankKeys();
    });

    const disablePastDates = (current) =>
      current && current.valueOf() <= dayjs().endOf('day').valueOf();

    const onPickTaxCert = (file) => {
      const okType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const okSize = file.size <= 5 * 1024 * 1024;
      if (!okType) {
        notification.error({ message: 'Invalid file type', description: 'PDF, JPG, JPEG or PNG only.' });
        return false;
      }
      if (!okSize) {
        notification.error({ message: 'File too large', description: 'Max size 5MB.' });
        return false;
      }
      form.tax_compliance_certificate = file;
      taxCertFileList.value = [{ uid: file.uid, name: file.name, status: 'done' }];
      return false; // prevent auto upload
    };

    const clearTaxCert = () => {
      form.tax_compliance_certificate = null;
      taxCertFileList.value = [];
    };

    const onPickLsoFile = (file) => {
      const okType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const okSize = file.size <= 10 * 1024 * 1024;
      if (!okType) {
        notification.error({ message: 'Invalid file type', description: 'PDF, JPG, JPEG or PNG only.' });
        return false;
      }
      if (!okSize) {
        notification.error({ message: 'File too large', description: 'Max size 10MB.' });
        return false;
      }
      form.lso.file = file;
      lsoFileList.value = [{ uid: file.uid, name: file.name, status: 'done' }];
      return false;
    };

    const clearLsoFile = () => {
      form.lso.file = null;
      lsoFileList.value = [];
    };

    const onLsoToggleChange = (event) => {
      includeLsoDetails.value = !!event?.target?.checked;
      if (!includeLsoDetails.value) {
        delete errors['lsos.0.lso_number'];
        delete errors['lsos.0.issue_date'];
        delete errors['lsos.0.event_description'];
        delete errors['lsos.0.notes'];
        delete errors['lsos.0.file'];
      }
    };

    const setPrimary = (idx, value) => {
      form.bank_accounts.forEach((a, i) => {
        a.is_primary = value ? i === idx : a.is_primary && i !== idx;
      });
      if (value && !form.bank_accounts.some((a) => a.is_primary)) {
        form.bank_accounts[idx].is_primary = true;
      }
    };

    const addBankRow = () => form.bank_accounts.push(blankBankAccount(false));
    const removeBankRow = (idx) => {
      const removed = form.bank_accounts.splice(idx, 1)[0];
      if (removed?.is_primary && form.bank_accounts.length) {
        form.bank_accounts[0].is_primary = true;
      }
    };

    const setPrimaryContact = (idx, value) => {
      form.contacts.forEach((c, i) => {
        c.is_primary = value ? i === idx : c.is_primary && i !== idx;
      });
      if (value && !form.contacts.some((c) => c.is_primary) && form.contacts[idx]) {
        form.contacts[idx].is_primary = true;
      }
    };

    const addContactRow = () => {
      const isFirst = form.contacts.length === 0;
      form.contacts.push(blankContact(isFirst));
    };
    const removeContactRow = (idx) => {
      const removed = form.contacts.splice(idx, 1)[0];
      if (removed?.is_primary && form.contacts.length) {
        form.contacts[0].is_primary = true;
      }
    };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);
      bankErrors.value = form.bank_accounts.map(() => ({}));
      contactErrors.value = form.contacts.map(() => ({}));

      if (!form.name?.trim()) errors.name = 'Name is required';
      else if (form.name.length > 255) errors.name = 'Max 255 characters';

      if (!form.method_of_procurement) {
        errors.method_of_procurement = 'Method of procurement is required';
      }

      if (form.method_of_procurement === 'direct' && !form.category) {
        errors.category = 'Category is required';
      }
      if (form.method_of_procurement && !form.category) {
        // safety net (RFQ should auto-set to private via watcher)
        if (form.method_of_procurement === 'rfq') form.category = 'private';
      }

      if (!form.physical_address?.trim()) errors.physical_address = 'Address is required';
      if (!form.county_id) errors.county_id = 'County is required';
      if (!form.subcounty_id) errors.subcounty_id = 'Sub-County is required';

      if (form.category === 'private') {
        if (!form.kra_pin?.trim()) errors.kra_pin = 'KRA PIN required for private vendors';
        else if (!KRA_REGEX.test(form.kra_pin.trim())) errors.kra_pin = 'Invalid KRA PIN format';

        if (!form.tax_certificate_expiry) {
          errors.tax_certificate_expiry = 'Expiry date required';
        } else if (dayjs(form.tax_certificate_expiry).isBefore(dayjs().endOf('day'))) {
          errors.tax_certificate_expiry = 'Must be after today';
        }

        if (!isEdit.value && !form.tax_compliance_certificate) {
          errors.tax_compliance_certificate = 'Certificate file required';
        }
      }

      if (!form.bank_accounts.length) {
        errors.bank_accounts = 'At least one bank account is required';
      } else if (!form.bank_accounts.some((a) => a.is_primary)) {
        errors.bank_accounts = 'One bank account must be marked primary';
      }

      form.bank_accounts.forEach((a, i) => {
        const e = {};
        if (!a.bank_key) e.bank_key = 'Required';
        if (!a.bank_id) e.bank_id = 'Required';
        if (!a.account_number?.trim()) e.account_number = 'Required';
        else if (a.account_number.length > 30) e.account_number = 'Max 30 chars';
        if (!a.account_name?.trim()) e.account_name = 'Required';
        bankErrors.value[i] = e;
      });

      if (form.contacts.length && !form.contacts.some((c) => c.is_primary)) {
        errors.contacts = 'One contact must be marked primary';
      }
      form.contacts.forEach((c, i) => {
        const e = {};
        if (!c.first_name?.trim()) e.first_name = 'Required';
        if (!c.last_name?.trim()) e.last_name = 'Required';
        if (!c.phone_number?.trim()) e.phone_number = 'Required';
        else if (c.phone_number.length > 20) e.phone_number = 'Max 20 chars';
        if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) e.email = 'Invalid email';
        contactErrors.value[i] = e;
      });

      if (!isEdit.value && includeLsoDetails.value) {
        if (!form.lso.lso_number?.trim()) {
          errors['lsos.0.lso_number'] = 'Reference number is required';
        }
        if (!form.lso.issue_date) {
          errors['lsos.0.issue_date'] = 'Date of LSO/LPO is required';
        }
        if (!form.lso.event_description?.trim()) {
          errors['lsos.0.event_description'] = 'Event description is required';
        }
        if (!form.lso.notes?.trim()) {
          errors['lsos.0.notes'] = 'Payment notes / additional details are required';
        }
        if (!form.lso.file) {
          errors['lsos.0.file'] = 'LSO/LPO document is required';
        }
      }

      const hasFieldErrors = Object.keys(errors).length > 0;
      const hasBankErrors = bankErrors.value.some((e) => Object.keys(e).length);
      const hasContactErrors = contactErrors.value.some((e) => Object.keys(e).length);
      return !hasFieldErrors && !hasBankErrors && !hasContactErrors;
    };

    const buildPayload = () => {
      const payload = {
        name: form.name.trim(),
        method_of_procurement: form.method_of_procurement,
        category: form.category,
        physical_address: form.physical_address.trim(),
        county_id: form.county_id,
        subcounty_id: form.subcounty_id,
        bank_accounts: form.bank_accounts.map((a) => ({
          ...(a.id ? { id: a.id } : {}),
          bank_id: a.bank_id,
          account_number: a.account_number.trim(),
          account_name: a.account_name.trim(),
          is_primary: !!a.is_primary,
        })),
      };
      if (form.contacts.length) {
        payload.contacts = form.contacts.map((c) => ({
          ...(c.id ? { id: c.id } : {}),
          first_name: c.first_name.trim(),
          middle_name: c.middle_name?.trim() || null,
          last_name: c.last_name.trim(),
          phone_number: c.phone_number.trim(),
          email: c.email?.trim() || null,
          is_primary: !!c.is_primary,
          is_active: c.is_active !== false,
        }));
      }
      if (form.category === 'private') {
        payload.kra_pin = form.kra_pin.trim().toUpperCase();
        payload.tax_certificate_expiry = form.tax_certificate_expiry;
        if (form.tax_compliance_certificate) {
          payload.tax_compliance_certificate = form.tax_compliance_certificate;
        }
      }
      if (!isEdit.value && includeLsoDetails.value) {
        const lsoEntry = {
          lso_number: form.lso.lso_number.trim(),
          issue_date: form.lso.issue_date,
          event_description: form.lso.event_description.trim(),
          notes: form.lso.notes.trim(),
        };
        if (form.lso.file) lsoEntry.file = form.lso.file;
        payload.lsos = [lsoEntry];
      }
      return payload;
    };

    const onSubmit = async () => {
      if (!validate()) {
        notification.warning({ message: 'Please fix the highlighted fields' });
        return;
      }
      const payload = buildPayload();
      try {
        if (isEdit.value) {
          await store.dispatch('procurement/updateVendor', {
            id: props.vendor.id,
            payload,
            withFile: !!form.tax_compliance_certificate,
          });
        } else {
          await store.dispatch('procurement/createVendor', payload);
        }
        emit('saved');
      } catch (e) {
        const data = e?.response?.data || {};
        const topMessage = data.message || e?.message || 'Unable to save vendor';
        const fieldErrors = data.errors;
        const descriptionLines = [];
        if (fieldErrors && typeof fieldErrors === 'object') {
          Object.entries(fieldErrors).forEach(([key, msgs]) => {
            const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
            errors[key] = msg;
            descriptionLines.push(msg);
          });
        }
        notification.error({
          message: topMessage,
          description: descriptionLines.length ? descriptionLines.join('\n') : undefined,
          duration: 8,
        });
      }
    };

    const close = () => emit('update:open', false);

    return {
      form,
      errors,
      bankErrors,
      contactErrors,
      taxCertFileList,
      lsoFileList,
      includeLsoDetails,
      banks,
      bankNameOptions,
      counties,
      subcountiesForCounty,
      saving,
      isEdit,
      existingTaxCertUrl,
      onCountyChange,
      onMethodChange,
      optionFilter,
      branchesForBank,
      onBankNameChange,
      disablePastDates,
      onPickTaxCert,
      clearTaxCert,
      onPickLsoFile,
      clearLsoFile,
      onLsoToggleChange,
      setPrimary,
      addBankRow,
      removeBankRow,
      setPrimaryContact,
      addContactRow,
      removeContactRow,
      onSubmit,
      close,
    };
  },
};
</script>

<style lang="less">
.vendor-modal-wrap .ant-modal-body {
  padding: 0;
}
.vendor-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
</style>

<style lang="less" scoped>
.vm-shell {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

/* Header */
.vm-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: linear-gradient(95deg, #15693c 0%, #1f9254 55%, #36b16f 100%);
  color: #fff;
  position: relative;
}
.vm-head-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}
.vm-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.32);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.vm-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.vm-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.4;
}
.vm-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
}

/* Body */
.vm-body {
  padding: 18px 22px 4px;
  overflow-y: auto;
  flex: 1 1 auto;
  background: #fafcfb;
}
.vm-form :deep(.ant-form-item) {
  margin-bottom: 14px;
}
.vm-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
  > label {
    font-size: 12px;
    font-weight: 600;
    color: #4d5661;
    height: 22px;
  }
}
.vm-form :deep(.ant-input),
.vm-form :deep(.ant-input-affix-wrapper),
.vm-form :deep(.ant-select-selector),
.vm-form :deep(.ant-picker) {
  border-radius: 6px;
  border-color: #dde4e0;
  &:hover, &:focus {
    border-color: #9ad8b4;
  }
}
.vm-form :deep(.ant-input:focus),
.vm-form :deep(.ant-input-affix-wrapper-focused),
.vm-form :deep(.ant-picker-focused) {
  box-shadow: 0 0 0 2px rgba(31, 146, 84, 0.12);
  border-color: #1f9254;
}

/* Sections */
.vm-section {
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 10px;
  padding: 14px 16px 4px;
  margin-bottom: 14px;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.04);
}
.vm-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #2f6746;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.vm-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #1f9254;
  &.warn { background: #FA8B0C; }
  &.info { background: #2C99FF; }
}
.vm-section-tag {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  padding: 1px 8px;
  border-radius: 10px;
}
.vm-section-hint {
  font-size: 12px;
  color: #6b7682;
  margin: -4px 0 12px;
}

/* Reinforce error state — Ant defaults are subtle on some fields */
.vm-form :deep(.ant-form-item-has-error) {
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-select-selector,
  .ant-picker,
  textarea.ant-input {
    border-color: #ff4d4f !important;
    box-shadow: 0 0 0 1px rgba(255, 77, 79, 0.12);
  }
}
.vm-form :deep(.ant-upload.has-error .upload-btn),
.vm-form :deep(.ant-upload-list-picture .ant-upload-list-item-error) {
  border-color: #ff4d4f !important;
}

/* Bank rows */
.bank-row {
  position: relative;
  border: 1px solid #e6ecef;
  border-radius: 10px;
  padding: 10px 12px 0;
  margin-bottom: 10px;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  &:hover { border-color: #c9e6d3; }
  &.is-primary {
    border-color: #1f9254;
    background: linear-gradient(90deg, #f4fcf6 0%, #fff 100%);
    box-shadow: 0 2px 10px rgba(28, 122, 72, 0.08);
  }
}
.bank-row-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.bank-row-index {
  font-size: 11px;
  font-weight: 700;
  color: #8a9399;
  letter-spacing: 0.3px;
}
.bank-primary-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  padding: 1px 7px;
  border-radius: 10px;
}
.bank-remove {
  margin-left: auto;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #8a9399;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  &:hover:not(:disabled) {
    background: #fff1f1;
    color: #c43d3d;
    border-color: #ffd1d1;
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}
.add-bank-btn {
  width: 100%;
  border: 1px dashed #c9d1d6;
  background: #fafcfb;
  border-radius: 8px;
  padding: 8px 10px;
  color: #4d5661;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  &:hover {
    border-color: #9ad8b4;
    color: #15693c;
    background: #f4fcf6;
  }
}

.upload-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 6px;
  font-weight: 600;
  &:hover {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
}

/* LSO/LPO toggle + fields */
.lso-toggle {
  display: block;
  background: #f4f7fa;
  border: 1px solid #e6ecef;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &.is-on {
    background: #f4fcf6;
    border-color: #c9e6d3;
  }
  :deep(.ant-checkbox-wrapper) {
    font-size: 13px;
    font-weight: 600;
    color: #1f2437;
  }
  .lso-toggle-label {
    margin-left: 4px;
  }
  .lso-toggle-hint {
    display: block;
    font-size: 11px;
    color: #8a9399;
    margin-top: 4px;
    margin-left: 24px;
    line-height: 1.4;
  }
}
.lso-fields {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed #e6ecef;
}

.form-error-banner {
  background: #fff1f0;
  border: 1px solid #ffa39e;
  color: #a8071a;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}
.existing-file {
  font-size: 12px;
  color: #4d8a63;
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  a { color: #15693c; font-weight: 600; }
}

/* Footer */
.vm-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 22px;
  background: #fff;
  border-top: 1px solid #eaf0ee;
}
.vm-foot-hint {
  font-size: 11px;
  color: #8a9399;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.vm-foot-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 6px;
  font-weight: 600;
  &:hover, &:focus {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
  &.is-primary {
    background: #1f9254 !important;
    border-color: #1f9254 !important;
    color: #fff !important;
    &:hover, &:focus {
      background: #167a45 !important;
      border-color: #167a45 !important;
      color: #fff !important;
    }
  }
}
</style>
