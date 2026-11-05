<template>
  <RecordViewWrapper>
    <Main>
      <ProcurementPageWrapper class="bp-min">
        <a-spin :spinning="loading">
          <div v-if="vendor">
            <!-- Breadcrumb -->
            <div class="bp-crumb">
              <span class="crumb-link" @click="goBack">Procurement · Vendors</span>
              <span class="crumb-sep">›</span>
              <span class="crumb-here">{{ vendor.name }}</span>
            </div>

            <!-- Header -->
            <header class="page-heading">
              <div class="ph-left">
                <h3 class="ph-title">
                  <span class="ph-icon">🏢</span> {{ vendor.name }}
                </h3>
                <p class="ph-subtitle">
                  {{ vendor.physical_address || '—' }}
                  <span
                    class="v-chip"
                    :class="vendor.is_active ? 'green' : 'muted'"
                  >
                    {{ vendor.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span v-if="taxCertExpired" class="v-chip warn">Tax cert expired</span>
                  <span class="v-cat" :class="vendor.category || 'public'">
                    {{ vendorCategoryShortLabel(vendor.category) }}
                  </span>
                  <span v-if="vendor.method_of_procurement" class="v-chip">
                    {{ methodLabel }}
                  </span>
                  <span v-if="vendor.erp_id" class="v-chip muted">
                    ERP: {{ vendor.erp_id }}
                  </span>
                </p>
              </div>
              <div class="ph-actions">
                <sdButton size="small" class="pill-btn" @click="goBack">
                  <sdFeatherIcons type="arrow-left" size="13" /> Back
                </sdButton>
              <sdButton
                v-if="canApproveVendor"
                size="small"
                class="pill-btn"
                @click="onToggle"
              >
                <sdFeatherIcons
                  :type="vendor.is_active ? 'pause-circle' : 'play-circle'"
                  size="13"
                />
                {{ vendor.is_active ? 'Deactivate' : 'Activate' }}
              </sdButton>
              <sdButton
                v-if="canManageVendors"
                size="small"
                class="pill-btn is-primary"
                @click="openEdit"
              >
                <sdFeatherIcons type="edit-2" size="13" /> Edit
              </sdButton>
            </div>
          </header>

          <!-- Summary strip (same visual language as the Vendors list) -->
          <div class="sum-row">
            <div class="sum-card">
              <span class="sum-label">Status</span>
              <span class="sum-value" :class="vendor.is_active ? 'active' : 'muted'">
                {{ vendor.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="sum-card">
              <span class="sum-label">Bank Accounts</span>
              <span class="sum-value">{{ bankAccountsCount }}</span>
            </div>
            <div class="sum-card">
              <span class="sum-label">Contacts</span>
              <span class="sum-value">{{ contactsCount }}</span>
            </div>
            <div class="sum-card">
              <span class="sum-label">LSOs</span>
              <span class="sum-value" :class="{ warn: delinkedLsosCount }">
                {{ totalLsosCount }}
              </span>
              <span v-if="delinkedLsosCount" class="sum-note">
                {{ delinkedLsosCount }} delinked
              </span>
            </div>
          </div>

          <!-- Tabs -->
          <section class="panel">
            <a-tabs v-model:activeKey="activeTab" class="vendor-tabs">
              <a-tab-pane key="profile" tab="Overview">
                <div class="info-grid">
                  <div>
                    <h4 class="panel-title">Vendor Information</h4>
                    <div class="info-row">
                      <span class="info-label">Vendor Name</span>
                      <span class="info-value">{{ vendor.name }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Category</span>
                      <span class="info-value">{{ vendorCategoryLabel(vendor.category) }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Physical Address</span>
                      <span class="info-value">{{ vendor.physical_address || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">County</span>
                      <span class="info-value">
                        {{ vendor.county?.name || vendor.county?.county_name || '—' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Sub-County</span>
                      <span class="info-value">
                        {{ subCounty?.name || subCounty?.sub_county_name || '—' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Procurement</span>
                      <span class="info-value">{{ methodLabel }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ERP ID</span>
                      <span class="info-value">{{ vendor.erp_id || '—' }}</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="panel-title">Tax Compliance</h4>
                    <div class="info-row">
                      <span class="info-label">KRA PIN</span>
                      <span class="info-value">{{ vendor.kra_pin || '—' }}</span>
                    </div>
                    <div class="info-row" :class="taxCertExpired ? 'danger' : ''">
                      <span class="info-label">Tax Cert. Expiry</span>
                      <span class="info-value">{{ taxCertExpiryLabel || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Tax Certificate</span>
                      <span class="info-value">
                        <a v-if="taxCertUrl" :href="taxCertUrl" target="_blank" rel="noopener">
                          View certificate
                        </a>
                        <span v-else>—</span>
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Status</span>
                      <span class="info-value">
                        <span class="v-chip" :class="vendor.is_active ? 'green' : 'muted'">
                          {{ vendor.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Primary Bank</span>
                      <span class="info-value">{{ primaryBankLabel }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Primary Contact</span>
                      <span class="info-value">{{ primaryContactLabel }}</span>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="bank">
                <template #tab>
                  <span class="vendor-tab-label">
                    Bank Accounts<span v-if="bankAccountsCount" class="vendor-tab-count">({{ bankAccountsCount }})</span>
                  </span>
                </template>
                <BankAccountsTab :vendor-id="vendorId" />
              </a-tab-pane>

              <a-tab-pane key="contacts">
                <template #tab>
                  <span class="vendor-tab-label">
                    Contacts<span v-if="contactsCount" class="vendor-tab-count">({{ contactsCount }})</span>
                  </span>
                </template>
                <ContactsTab :vendor-id="vendorId" />
              </a-tab-pane>

              <a-tab-pane key="lso">
                <template #tab>
                  <span class="vendor-tab-label">
                    Local Service Orders<span v-if="totalLsosCount" class="vendor-tab-count">({{ totalLsosCount }})</span>
                  </span>
                </template>
                <LsosTab :vendor-id="vendorId" />
              </a-tab-pane>
            </a-tabs>
          </section>

          <VendorFormModal
            v-model:open="editModalOpen"
            :vendor="vendor"
            @saved="onEditSaved"
          />
        </div>

        <div v-else-if="!loading" class="panel">
          <div class="empty-state">
            <div class="empty-icon">▦</div>
            <div class="empty-title">Vendor not found</div>
            <div class="empty-desc">
              The vendor you are looking for has been removed or never existed.
            </div>
            <sdButton size="small" class="pill-btn is-primary" @click="goBack">
              Back to Vendors
            </sdButton>
          </div>
        </div>
      </a-spin>
    </ProcurementPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import VendorFormModal from './VendorFormModal.vue';
import BankAccountsTab from './BankAccountsTab.vue';
import ContactsTab from './ContactsTab.vue';
import LsosTab from './LsosTab.vue';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { RecordViewWrapper, ProcurementPageWrapper } from './style';
import {
  vendorCategoryLabel,
  vendorCategoryShortLabel,
} from '@/config/vendor-categories';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { canManageVendors, canApproveVendor } = useProcurementPermissions();

const activeTab = ref('profile');
const editModalOpen = ref(false);

const vendorId = computed(() => Number(route.params.id));
const vendor = computed(() => store.state.procurement.currentVendor);
const loading = computed(() => store.state.procurement.loading);
const bankAccounts = computed(() => store.state.procurement.bankAccounts);
const contacts = computed(() => store.state.procurement.contacts);
const lsos = computed(() => store.state.procurement.lsos);

const taxCertUrl = computed(
  () =>
    vendor.value?.tax_certificate_url ||
    vendor.value?.tax_compliance_certificate_url ||
    null,
);
const subCounty = computed(() => vendor.value?.subcounty || vendor.value?.sub_county || null);
const taxCertExpired = computed(() => {
  const d = vendor.value?.tax_compliance_expiry_date || vendor.value?.tax_certificate_expiry;
  return d ? dayjs(d).isBefore(dayjs(), 'day') : false;
});
const taxCertExpiryLabel = computed(() => {
  const d = vendor.value?.tax_compliance_expiry_date || vendor.value?.tax_certificate_expiry;
  return d ? dayjs(d).format('YYYY-MM-DD') : null;
});

const bankAccountsCount = computed(() => bankAccounts.value.length);
const contactsCount = computed(() => contacts.value.length);
const totalLsosCount = computed(() => lsos.value.length);
const delinkedLsosCount = computed(
  () => lsos.value.filter((l) => l.is_delinked).length,
);

const methodLabel = computed(() => {
  const method = vendor.value?.method_of_procurement;
  if (method === 'direct') return 'Direct procurement';
  if (method === 'rfq') return 'RFQ';
  return '—';
});

const primaryBankLabel = computed(() => {
  const account = bankAccounts.value.find((a) => a.is_primary);
  if (!account) return '—';

  const bank = account.bank?.bank_name || account.bank?.name || 'Bank';
  const digits = account.account_number || '';
  const masked = digits.length > 4 ? `••••${digits.slice(-4)}` : digits;

  return masked ? `${bank} · ${masked}` : bank;
});

const primaryContactLabel = computed(() => {
  const contact = contacts.value.find((c) => c.is_primary);
  if (!contact) return '—';

  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ');
  return contact.phone_number ? `${name} · ${contact.phone_number}` : name;
});

const fetchVendor = () =>
  store.dispatch('procurement/fetchVendor', vendorId.value);

onMounted(fetchVendor);
watch(vendorId, (id) => {
  if (id) fetchVendor();
});

const goBack = () => router.push('/procurement/vendors');
const openEdit = () => {
  editModalOpen.value = true;
};
const onEditSaved = () => {
  editModalOpen.value = false;
  fetchVendor();
};
const onToggle = async () => {
  await store.dispatch('procurement/toggleVendorStatus', vendorId.value);
};
</script>

<style lang="less" scoped>
.bp-min {
  padding-top: 24px;
}

/* Summary strip — mirrors the Vendors list cards */
.sum-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 14px;
}
.sum-card {
  background: linear-gradient(135deg, #f3fcf6 0%, #f9fffb 55%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
    transform: translateY(-1px);
  }
}
.sum-label {
  font-size: 10px;
  color: #7a8a82;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.sum-value {
  font-size: 22px;
  font-weight: 800;
  color: #15693c;
  line-height: 1.15;

  &.active { color: #20c997; }
  &.muted { color: #8a9399; }
  &.warn { color: #b35a00; }
}
.sum-note {
  font-size: 10px;
  font-weight: 700;
  color: #6f3fcc;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
@media (max-width: 768px) {
  .sum-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 420px) {
  .sum-row { grid-template-columns: 1fr; }
}

.vendor-tabs {
  :deep(.ant-tabs-tab) {
    white-space: nowrap;
  }
}
.vendor-tab-label {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
}
.vendor-tab-count {
  color: #7a8a82;
  font-weight: 500;
}
.v-cat {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 2px 10px;
  border-radius: 999px;
  &.private {
    background: #eafff5;
    color: #15693c;
    border: 1px solid #c9e6d3;
  }
  &.public {
    background: #e8effb;
    color: #335ec7;
    border: 1px solid #c7d8f3;
  }
  &.fbo {
    background: #f3ebff;
    color: #6f3fcc;
    border: 1px solid #d8c5f5;
  }
  &.cbo {
    background: #fff6e5;
    color: #a86400;
    border: 1px solid #f1d59b;
  }
  &.ngo {
    background: #fdecf3;
    color: #a83262;
    border: 1px solid #f4c7d9;
  }
}
</style>
