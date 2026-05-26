<template>
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
          <header class="bp-head">
            <div class="bp-head-main">
              <h3 class="bp-title">{{ vendor.name }}</h3>
              <div class="bp-meta">
                <span
                  class="v-chip"
                  :class="vendor.is_active ? 'green' : 'muted'"
                >
                  {{ vendor.is_active ? 'Active' : 'Inactive' }}
                </span>
                <span v-if="taxCertExpired" class="v-chip warn">Tax cert expired</span>
                <span v-if="vendor.physical_address" class="bp-sub">
                  {{ vendor.physical_address }}
                </span>
              </div>
            </div>
            <div class="bp-head-actions">
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
                      <span class="info-value">{{ (vendor.category || '—').toUpperCase() }}</span>
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
                        {{ vendor.sub_county?.name || vendor.sub_county?.sub_county_name || '—' }}
                      </span>
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
                      <span class="info-value">{{ vendor.tax_certificate_expiry || '—' }}</span>
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
</template>

<script>
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
import { ProcurementPageWrapper } from './style';

export default {
  name: 'VendorDetail',
  components: {
    Main,
    VendorFormModal,
    BankAccountsTab,
    ContactsTab,
    LsosTab,
    ProcurementPageWrapper,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const permissions = useProcurementPermissions();

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
    const taxCertExpired = computed(() => {
      const d = vendor.value?.tax_certificate_expiry;
      return d ? dayjs(d).isBefore(dayjs(), 'day') : false;
    });

    const bankAccountsCount = computed(() => bankAccounts.value.length);
    const contactsCount = computed(() => contacts.value.length);
    const totalLsosCount = computed(() => lsos.value.length);
    const expiredLsosCount = computed(
      () =>
        lsos.value.filter(
          (l) => l.expiry_date && dayjs(l.expiry_date).isBefore(dayjs(), 'day'),
        ).length,
    );
    const activeLsosCount = computed(
      () => totalLsosCount.value - expiredLsosCount.value,
    );
    const hasExpiredLso = computed(() => expiredLsosCount.value > 0);

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
      await store.dispatch(
        'procurement/toggleVendorStatus',
        vendorId.value,
      );
    };

    return {
      ...permissions,
      activeTab,
      editModalOpen,
      vendorId,
      vendor,
      loading,
      taxCertUrl,
      taxCertExpired,
      bankAccountsCount,
      contactsCount,
      totalLsosCount,
      activeLsosCount,
      expiredLsosCount,
      hasExpiredLso,
      goBack,
      openEdit,
      onEditSaved,
      onToggle,
    };
  },
};
</script>

<style lang="less" scoped>
.bp-min {
  padding-top: 24px;
}
.bp-head-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.bp-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  .bp-sub {
    color: #7a8a82;
    font-size: 13px;
    margin: 0;
  }
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 32px;
  padding: 6px 2px 4px;
}
@media (max-width: 768px) {
  .info-grid { grid-template-columns: 1fr; gap: 16px; }
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
</style>
