<template>
  <Main>
    <ProcurementPageWrapper class="bp-min">
      <a-spin :spinning="loading">
        <div v-if="lso">
          <!-- Breadcrumb -->
          <div class="bp-crumb">
            <span class="crumb-link" @click="goBack">Procurement · LSOs</span>
            <span class="crumb-sep">›</span>
            <span class="crumb-here">{{ lso.lso_number || 'LSO' }}</span>
          </div>

          <!-- Header -->
          <header class="bp-head">
            <div class="bp-head-main">
              <h3 class="bp-title">{{ lso.lso_number || 'Local Service Order' }}</h3>
              <div class="bp-meta">
                <span
                  class="v-chip"
                  :class="isDelinked ? 'purple' : (isExpired ? 'warn' : 'green')"
                >
                  {{ isDelinked ? 'Delinked' : (isExpired ? 'Expired' : 'Active') }}
                </span>
                <span v-if="lso.service_type?.name" class="bp-sub">
                  {{ lso.service_type.name }}
                </span>
              </div>
            </div>
            <div class="bp-head-actions">
              <sdButton size="small" class="pill-btn" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="13" /> Back
              </sdButton>
              <sdButton size="small" class="pill-btn" @click="onDownload">
                <sdFeatherIcons type="download" size="13" /> Download
              </sdButton>
              <sdButton size="small" class="pill-btn" @click="openPreview">
                <sdFeatherIcons type="eye" size="13" /> Preview
              </sdButton>
            </div>
          </header>

          <!-- Body -->
          <div class="lso-grid">
            <!-- Order info -->
            <section class="panel">
              <h4 class="panel-title">Order details</h4>
              <div class="info-row">
                <span class="info-label">LSO / LPO Number</span>
                <span class="info-value">{{ lso.lso_number || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Service Type</span>
                <span class="info-value">{{ lso.service_type?.name || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Issue Date</span>
                <span class="info-value">{{ lso.issue_date || '—' }}</span>
              </div>
              <div class="info-row" :class="isExpired ? 'danger' : ''">
                <span class="info-label">Expiry Date</span>
                <span class="info-value">{{ lso.expiry_date || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value">
                  <span class="v-chip" :class="isExpired ? 'warn' : 'green'">
                    {{ isExpired ? 'Expired' : 'Active' }}
                  </span>
                </span>
              </div>
              <div v-if="lso.notes" class="info-row notes-row">
                <span class="info-label">Notes</span>
                <span class="info-value">{{ lso.notes }}</span>
              </div>
            </section>

            <!-- Vendor info -->
            <section class="panel">
              <h4 class="panel-title">
                Vendor
                <router-link
                  v-if="lso.vendor_id"
                  :to="`/procurement/vendors/${lso.vendor_id}`"
                  class="vendor-link panel-link"
                >View vendor →</router-link>
              </h4>
              <a-spin :spinning="vendorLoading">
                <div class="info-row">
                  <span class="info-label">Name</span>
                  <span class="info-value">{{ vendor?.name || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Category</span>
                  <span class="info-value">{{ vendorCategoryLabel(vendor?.category) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">KRA PIN</span>
                  <span class="info-value">{{ vendor?.kra_pin || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Physical Address</span>
                  <span class="info-value">{{ vendor?.physical_address || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">County</span>
                  <span class="info-value">
                    {{ vendor?.county?.name || vendor?.county?.county_name || '—' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Sub-County</span>
                  <span class="info-value">
                    {{ vendor?.subcounty?.name || vendor?.subcounty?.sub_county_name || vendor?.sub_county?.name || vendor?.sub_county?.sub_county_name || '—' }}
                  </span>
                </div>
                <div v-if="primaryContact" class="info-row">
                  <span class="info-label">Primary Contact</span>
                  <span class="info-value">
                    {{ primaryContact.first_name }} {{ primaryContact.last_name }}
                    <span class="muted">· {{ primaryContact.phone_number }}</span>
                  </span>
                </div>
                <div v-if="primaryBank" class="info-row">
                  <span class="info-label">Primary Bank</span>
                  <span class="info-value">
                    {{ primaryBank.bank?.name || primaryBank.bank_name || '—' }}
                    <span class="muted">· {{ primaryBank.account_number }}</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status</span>
                  <span class="info-value">
                    <span class="v-chip" :class="vendor?.is_active ? 'green' : 'muted'">
                      {{ vendor?.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </span>
                </div>
              </a-spin>
            </section>
          </div>
        </div>

        <div v-else-if="!loading" class="panel">
          <div class="empty-state">
            <div class="empty-icon">▤</div>
            <div class="empty-title">LSO not found</div>
            <div class="empty-desc">
              The LSO you are looking for has been removed or never existed.
            </div>
            <sdButton size="small" class="pill-btn is-primary" @click="goBack">
              Back to LSOs
            </sdButton>
          </div>
        </div>
      </a-spin>

      <!-- Preview Modal -->
      <a-modal
        :visible="previewOpen"
        :title="`Preview · ${lso?.lso_number || 'LSO'}`"
        :footer="null"
        width="880px"
        :body-style="{ padding: '0', background: '#1f2329' }"
        wrap-class-name="lso-preview-modal"
        @cancel="closePreview"
        @update:visible="(v) => (previewOpen = v)"
      >
        <a-spin :spinning="previewLoading" wrapper-class-name="lso-preview-spin">
          <div class="lso-preview-body">
            <iframe
              v-if="previewUrl && previewMime === 'application/pdf'"
              :src="previewUrl"
              class="lso-preview-frame"
            />
            <img
              v-else-if="previewUrl"
              :src="previewUrl"
              class="lso-preview-image"
            />
            <a-empty
              v-else-if="!previewLoading"
              description="No preview available"
              style="padding: 40px; color: #d6dde2"
            />
          </div>
          <div v-if="previewUrl" class="lso-preview-foot">
            <sdButton size="small" class="pill-btn" @click="onDownload">
              <sdFeatherIcons type="download" size="13" /> Download
            </sdButton>
            <a :href="previewUrl" target="_blank" rel="noopener">
              <sdButton size="small" class="pill-btn">
                <sdFeatherIcons type="external-link" size="13" /> Open in new tab
              </sdButton>
            </a>
          </div>
        </a-spin>
      </a-modal>
    </ProcurementPageWrapper>
  </Main>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import vendorService from '@/services/procurement/vendor.service';
import lsoService from '@/services/procurement/vendor-lso.service';
import { ProcurementPageWrapper } from './style';
import { vendorCategoryLabel } from '@/config/vendor-categories';

export default {
  name: 'LsoDetail',
  components: { Main, ProcurementPageWrapper },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const lso = ref(null);
    const vendor = ref(null);
    const loading = ref(false);
    const vendorLoading = ref(false);

    const previewOpen = ref(false);
    const previewLoading = ref(false);
    const previewUrl = ref(null);
    const previewMime = ref(null);
    let lastBlobUrl = null;

    const vendorId = computed(() => Number(route.params.vendorId));
    const lsoId = computed(() => Number(route.params.id));

    const isExpired = computed(
      () => lso.value?.expiry_date &&
        dayjs(lso.value.expiry_date).isBefore(dayjs(), 'day'),
    );
    // Delinked LSOs stay visible for history but can no longer be used.
    const isDelinked = computed(() => !!lso.value?.is_delinked);
    const primaryContact = computed(() => {
      const list = vendor.value?.contacts || vendor.value?.active_contacts || [];
      return list.find((c) => c.is_primary) || list[0] || null;
    });
    const primaryBank = computed(() => {
      const list = vendor.value?.bank_accounts || vendor.value?.active_bank_accounts || [];
      return list.find((b) => b.is_primary) || list[0] || null;
    });

    const unwrap = (response) => {
      const payload = response?.data;
      if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
        return payload.data;
      }
      return payload;
    };

    const loadLso = async () => {
      if (!vendorId.value || !lsoId.value) return;
      loading.value = true;
      try {
        const res = await lsoService.show(vendorId.value, lsoId.value);
        lso.value = unwrap(res);
      } catch (e) {
        lso.value = null;
        notification.error({ message: 'Unable to load LSO' });
      } finally {
        loading.value = false;
      }
    };

    const loadVendor = async () => {
      if (!vendorId.value) return;
      vendorLoading.value = true;
      try {
        const res = await vendorService.show(vendorId.value);
        vendor.value = unwrap(res);
      } catch (e) {
        vendor.value = null;
      } finally {
        vendorLoading.value = false;
      }
    };

    const fetchAll = () => Promise.all([loadLso(), loadVendor()]);

    onMounted(fetchAll);
    watch([vendorId, lsoId], fetchAll);

    const goBack = () => router.push('/procurement/lsos');

    // Derive a usable mime type for the preview. The download endpoint
    // sometimes returns `application/octet-stream`, which would prevent the
    // iframe / img branches from rendering. Fall back to the original
    // filename's extension so PDFs still preview in the iframe.
    const resolvePreviewMime = (blob) => {
      const mime = (blob && blob.type) || '';
      if (mime && mime !== 'application/octet-stream') return mime;
      const name = (lso.value?.original_filename || lso.value?.file_path || '').toLowerCase();
      if (name.endsWith('.pdf')) return 'application/pdf';
      if (name.endsWith('.png')) return 'image/png';
      if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
      if (name.endsWith('.gif')) return 'image/gif';
      if (name.endsWith('.webp')) return 'image/webp';
      return mime || 'application/octet-stream';
    };

    const openPreview = async () => {
      previewOpen.value = true;
      previewLoading.value = true;
      previewUrl.value = null;
      previewMime.value = null;
      try {
        const response = await lsoService.download(vendorId.value, lsoId.value);
        const raw = response.data;
        const resolvedMime = resolvePreviewMime(raw);
        // Re-wrap the blob with the resolved mime so the iframe/img tags
        // pick up the right content type from the object URL.
        const blob = raw.type === resolvedMime ? raw : new Blob([raw], { type: resolvedMime });
        previewMime.value = resolvedMime;
        if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = URL.createObjectURL(blob);
        previewUrl.value = lastBlobUrl;
      } catch (e) {
        notification.error({ message: 'Unable to load preview' });
        previewOpen.value = false;
      } finally {
        previewLoading.value = false;
      }
    };
    const closePreview = () => {
      previewOpen.value = false;
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = null;
      }
      previewUrl.value = null;
    };

    const onDownload = async () => {
      try {
        const response = await lsoService.download(vendorId.value, lsoId.value);
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const ext = blob.type === 'application/pdf' ? 'pdf'
          : blob.type === 'image/png' ? 'png' : 'jpg';
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lso.value?.lso_number || 'lso'}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        notification.error({ message: 'Unable to download LSO' });
      }
    };

    onBeforeUnmount(() => {
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = null;
      }
    });

    return {
      lso,
      vendor,
      loading,
      vendorLoading,
      vendorCategoryLabel,
      isExpired,
      isDelinked,
      primaryContact,
      primaryBank,
      previewOpen,
      previewLoading,
      previewUrl,
      previewMime,
      goBack,
      openPreview,
      closePreview,
      onDownload,
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
.lso-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .lso-grid { grid-template-columns: 1fr; }
}
.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.panel-link {
  font-size: 12px;
  font-weight: 600;
}
.notes-row .info-value {
  white-space: pre-wrap;
}
.lso-preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  max-height: 78vh;
  overflow: auto;
  background: #1f2329;
}
.lso-preview-frame {
  width: 100%;
  height: 78vh;
  border: 0;
  background: #fff;
}
.lso-preview-image {
  max-width: 100%;
  max-height: 78vh;
  object-fit: contain;
}
.lso-preview-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 14px;
  background: #2a3036;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>

<style lang="less">
.lso-preview-modal .ant-modal-content {
  overflow: hidden;
  border-radius: 10px;
}
.lso-preview-modal .ant-modal-header {
  background: #2a3036;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.lso-preview-modal .ant-modal-title {
  color: #f0f2f4;
  font-weight: 600;
}
.lso-preview-modal .ant-modal-close-x {
  color: #d6dde2;
}
</style>
