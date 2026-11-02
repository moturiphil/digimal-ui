<template>
  <div class="tm-wrap">
    <div v-if="notConfigured" class="tm-notice">
      <sdFeatherIcons type="info" size="18" />
      <div>
        <strong>Training materials are not set up yet.</strong>
        <p>Please contact your administrator to connect the Google Drive training folder.</p>
      </div>
    </div>

    <div v-else-if="errorMessage && !materials.length" class="tm-notice is-error">
      <sdFeatherIcons type="alert-circle" size="18" />
      <div>
        <strong>We could not load training materials.</strong>
        <p>{{ errorMessage }}</p>
        <button class="tm-btn is-primary" @click="load(false)">Try again</button>
      </div>
    </div>

    <template v-else>
      <div class="tm-head">
        <div class="tm-head-text">
          <h3 class="tm-title">Training Materials</h3>
          <p class="tm-sub">{{ subtitle }}</p>
        </div>
        <button class="tm-btn" :disabled="loading || refreshing" @click="load(true)">
          <sdFeatherIcons type="refresh-cw" size="13" :class="{ 'tm-spin': refreshing }" />
          Refresh
        </button>
      </div>

      <div class="tm-toolbar">
        <a-input
          v-model:value="search"
          allow-clear
          placeholder="Search materials"
          class="tm-search"
        >
          <template #prefix><sdFeatherIcons type="search" size="14" /></template>
        </a-input>
        <a-select
          v-model:value="activeCategory"
          :options="categoryOptions"
          class="tm-category"
        />
      </div>

      <div v-if="tierTabs.length > 1" class="tm-pills">
        <button
          v-for="tier in tierTabs"
          :key="tier.key"
          class="tm-pill"
          :class="{ 'is-active': activeTier === tier.key }"
          @click="activeTier = tier.key"
        >
          {{ tier.label }} <span class="tm-pill-count">{{ tier.count }}</span>
        </button>
      </div>

      <a-spin :spinning="loading || refreshing">
        <div v-if="!loading && !materials.length" class="tm-empty">
          <sdFeatherIcons type="folder" size="34" class="tm-empty-icon" />
          <p>No training materials are available for your level yet.</p>
        </div>
        <div v-else-if="!filteredMaterials.length" class="tm-empty">
          <sdFeatherIcons type="search" size="34" class="tm-empty-icon" />
          <p>No materials match your filters.</p>
          <button class="tm-btn" @click="clearFilters">Clear filters</button>
        </div>
        <div v-else class="tm-groups">
          <section v-for="group in groups" :key="group.key" class="tm-group">
            <h4 class="tm-group-title">
              {{ group.label }} <span class="tm-group-count">{{ group.count }}</span>
            </h4>
            <div
              v-for="category in group.categories"
              :key="category.key"
              class="tm-category-block"
            >
              <h5 class="tm-category-title">{{ category.label }}</h5>
              <div class="tm-grid">
                <article
                  v-for="material in category.materials"
                  :key="material.id"
                  class="tm-card"
                >
                  <div class="tm-card-icon" :class="'is-' + material.kind">
                    <sdFeatherIcons :type="iconForKind(material.kind)" size="18" />
                  </div>
                  <div class="tm-card-body">
                    <h6 class="tm-card-title" :title="material.name">{{ material.name }}</h6>
                    <p class="tm-card-path">{{ material.folder_path }}</p>
                    <div class="tm-card-meta">
                      <span>{{ kindLabel(material.kind) }}</span>
                      <span v-if="material.size">{{ formatSize(material.size) }}</span>
                      <span v-if="material.modified_time">{{ formatDate(material.modified_time) }}</span>
                    </div>
                  </div>
                  <div class="tm-card-actions">
                    <button
                      v-if="material.previewable"
                      class="tm-btn"
                      @click="openPreview(material)"
                    >
                      <sdFeatherIcons type="eye" size="13" /> Preview
                    </button>
                    <button
                      class="tm-btn is-primary"
                      :disabled="downloadingId === material.id"
                      @click="download(material)"
                    >
                      <sdFeatherIcons type="download" size="13" />
                      {{ downloadingId === material.id ? 'Downloading…' : 'Download' }}
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </a-spin>

      <p v-if="syncedAt" class="tm-synced">Updated {{ formatDate(syncedAt, true) }}</p>
    </template>

    <a-modal
      :visible="preview.open"
      :title="preview.material ? preview.material.name : 'Preview'"
      :footer="null"
      :width="920"
      :destroy-on-close="true"
      wrap-class-name="tm-preview-modal"
      @cancel="closePreview"
    >
      <a-spin :spinning="preview.loading">
        <div v-if="preview.url" class="tm-preview">
          <img
            v-if="preview.isImage"
            :src="preview.url"
            :alt="preview.material.name"
          />
          <iframe v-else :src="preview.url" :title="preview.material.name"></iframe>
          <div class="tm-preview-actions">
            <button class="tm-btn" @click="openPreviewInNewTab">
              <sdFeatherIcons type="external-link" size="13" /> Open in new tab
            </button>
            <button class="tm-btn is-primary" @click="download(preview.material)">
              <sdFeatherIcons type="download" size="13" /> Download
            </button>
          </div>
        </div>
      </a-spin>
    </a-modal>

  </div>
</template>

<script setup>
/* global defineEmits */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { notification } from 'ant-design-vue';
import { saveAs } from 'file-saver';
import trainingMaterialService, {
  trainingMaterialErrorMessage,
} from '@/services/training/training-material.service';

const emit = defineEmits(['loaded']);

const loading = ref(false);
const refreshing = ref(false);
const notConfigured = ref(false);
const errorMessage = ref('');
const materials = ref([]);
const tiers = ref([]);
const viewer = ref(null);
const syncedAt = ref(null);
const search = ref('');
const activeTier = ref('all');
const activeCategory = ref('all');
const downloadingId = ref(null);

let disposed = false;
let previewRequest = 0;

const preview = reactive({
  open: false,
  loading: false,
  material: null,
  url: '',
  isImage: false,
});

const load = async (refresh = false) => {
  if (loading.value || refreshing.value) return;
  if (refresh) {
    refreshing.value = true;
  } else {
    loading.value = true;
  }
  errorMessage.value = '';
  notConfigured.value = false;

  try {
    const response = await trainingMaterialService.list(refresh ? { refresh: 1 } : {});
    if (disposed) return;

    const data = response?.data || {};
    materials.value = Array.isArray(data.materials) ? data.materials : [];
    tiers.value = Array.isArray(data.tiers) ? data.tiers : [];
    viewer.value = data.viewer || null;
    syncedAt.value = data.synced_at || null;
    emit('loaded', Number(data.total ?? materials.value.length));
  } catch (error) {
    if (disposed) return;

    if (error?.response?.status === 503) {
      notConfigured.value = true;
      return;
    }

    const message = await trainingMaterialErrorMessage(error);
    if (refresh && materials.value.length) {
      notification.error({ message: 'Refresh failed', description: message });
    } else {
      errorMessage.value = message;
    }
  } finally {
    if (!disposed) {
      loading.value = false;
      refreshing.value = false;
    }
  }
};

const subtitle = computed(() => {
  const labels = tiers.value.map((tier) => tier.label);
  if (!labels.length) return 'Resources shared with your account.';
  return `Showing ${labels.join(', ')} materials for your ${viewer.value?.level_label || ''} access.`;
});

const tierTabs = computed(() => {
  if (!tiers.value.length) return [];
  return [
    { key: 'all', label: 'All', count: materials.value.length },
    ...tiers.value.map((tier) => ({ key: tier.key, label: tier.label, count: tier.count })),
  ];
});

const categoryOptions = computed(() => {
  const pool = activeTier.value === 'all'
    ? materials.value
    : materials.value.filter((material) => material.tier === activeTier.value);
  const categories = [...new Set(pool.map((material) => material.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  return [
    { value: 'all', label: 'All categories' },
    ...categories.map((category) => ({ value: category, label: category })),
  ];
});

const filteredMaterials = computed(() => {
  const term = search.value.trim().toLowerCase();
  return materials.value.filter((material) => {
    if (activeTier.value !== 'all' && material.tier !== activeTier.value) return false;
    if (activeCategory.value !== 'all' && material.category !== activeCategory.value) return false;
    if (!term) return true;
    return `${material.name} ${material.category} ${material.folder_path}`
      .toLowerCase()
      .includes(term);
  });
});

const groups = computed(() => tiers.value
  .map((tier) => {
    const items = filteredMaterials.value.filter((material) => material.tier === tier.key);
    const categoryMap = new Map();
    items.forEach((material) => {
      const key = material.category || 'General';
      if (!categoryMap.has(key)) {
        categoryMap.set(key, { key, label: key, materials: [] });
      }
      categoryMap.get(key).materials.push(material);
    });
    return { ...tier, categories: [...categoryMap.values()] };
  })
  .filter((group) => group.categories.length));

watch(activeTier, () => {
  activeCategory.value = 'all';
});

const clearFilters = () => {
  search.value = '';
  activeTier.value = 'all';
  activeCategory.value = 'all';
};

onMounted(() => load(false));

onBeforeUnmount(() => {
  disposed = true;
  previewRequest += 1;
  revokePreviewUrl();
});

const revokePreviewUrl = () => {
  if (preview.url && typeof URL !== 'undefined') {
    URL.revokeObjectURL(preview.url);
  }
  preview.url = '';
  preview.isImage = false;
};

const closePreview = () => {
  previewRequest += 1;
  preview.open = false;
  preview.loading = false;
  preview.material = null;
  revokePreviewUrl();
};

const openPreview = async (material) => {
  if (!material?.previewable) return;

  const requestId = ++previewRequest;
  revokePreviewUrl();
  preview.open = true;
  preview.loading = true;
  preview.material = material;

  try {
    const response = await trainingMaterialService.preview(material.id);
    if (disposed || requestId !== previewRequest) return;

    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], {
          type: response.headers?.['content-type'] || 'application/octet-stream',
        });

    preview.url = URL.createObjectURL(blob);
    preview.isImage = (blob.type || '').startsWith('image/');
  } catch (error) {
    if (disposed || requestId !== previewRequest) return;

    preview.open = false;
    preview.loading = false;
    preview.material = null;
    notification.error({
      message: 'Preview failed',
      description: await trainingMaterialErrorMessage(
        error,
        'This material could not be previewed.',
      ),
    });
  } finally {
    if (!disposed && requestId === previewRequest) {
      preview.loading = false;
    }
  }
};

const openPreviewInNewTab = () => {
  if (preview.url) {
    window.open(preview.url, '_blank', 'noopener');
  }
};

const download = async (material) => {
  if (!material || downloadingId.value) return;

  downloadingId.value = material.id;

  try {
    const response = await trainingMaterialService.download(material.id);
    if (disposed) return;

    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data]);
    saveAs(blob, material.download_name || material.name || 'training-material');
  } catch (error) {
    if (disposed) return;

    notification.error({
      message: 'Download failed',
      description: await trainingMaterialErrorMessage(
        error,
        'This material could not be downloaded.',
      ),
    });

    if (error?.response?.status === 404) {
      load(true);
    }
  } finally {
    if (!disposed) {
      downloadingId.value = null;
    }
  }
};

const formatSize = (bytes) => {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = size;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (value, withTime = false) => {
  if (!value) return '';
  const date = dayjs(value);
  if (!date.isValid()) return '';
  return withTime ? date.format('DD MMM YYYY, HH:mm') : date.format('DD MMM YYYY');
};

const KIND_ICONS = {
  pdf: 'file-text',
  image: 'image',
  document: 'file-text',
  spreadsheet: 'grid',
  presentation: 'monitor',
  video: 'video',
  audio: 'music',
  archive: 'archive',
  other: 'file',
};

const KIND_LABELS = {
  pdf: 'PDF',
  image: 'Image',
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  presentation: 'Presentation',
  video: 'Video',
  audio: 'Audio',
  archive: 'Archive',
  other: 'File',
};

const iconForKind = (kind) => KIND_ICONS[kind] || KIND_ICONS.other;

const kindLabel = (kind) => KIND_LABELS[kind] || KIND_LABELS.other;

</script>

<style scoped>
.tm-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0 8px;
}
.tm-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.tm-head-text {
  min-width: 0;
}
.tm-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1d2226;
}
.tm-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
}
.tm-toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.tm-search {
  max-width: 340px;
}
.tm-category {
  min-width: 190px;
  max-width: 260px;
}
.tm-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tm-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d9e7df;
  border-radius: 999px;
  background: #fff;
  color: #4a5560;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
}
.tm-pill:hover {
  border-color: #9fd4b7;
  color: #15693c;
}
.tm-pill.is-active {
  background: #15693c;
  border-color: #15693c;
  color: #fff;
  box-shadow: 0 4px 10px rgba(21, 105, 60, 0.16);
}
.tm-pill-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 17px;
  padding: 0 5px;
  border-radius: 999px;
  background: #eff9f4;
  color: #15693c;
  font-size: 10px;
  font-weight: 700;
}
.tm-pill.is-active .tm-pill-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.tm-groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.tm-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tm-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: #15693c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tm-group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: #eff9f4;
  color: #15693c;
  font-size: 10px;
  font-weight: 700;
}
.tm-category-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tm-category-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #4a5560;
}
.tm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
.tm-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
  transition: box-shadow 0.16s ease, border-color 0.16s ease;
}
.tm-card:hover {
  border-color: #c9e6d3;
  box-shadow: 0 6px 16px rgba(20, 60, 38, 0.07);
}
.tm-card-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
}
.tm-card-icon.is-pdf {
  background: #fff0f0;
  color: #c0392b;
  border-color: #f3d1d1;
}
.tm-card-icon.is-image {
  background: #eef6ff;
  color: #2b6cb0;
  border-color: #d3e5f7;
}
.tm-card-icon.is-video,
.tm-card-icon.is-audio {
  background: #f5f0ff;
  color: #6b46c1;
  border-color: #e1d7f7;
}
.tm-card-icon.is-spreadsheet {
  background: #effaf3;
  color: #1f9254;
  border-color: #c9e6d3;
}
.tm-card-icon.is-presentation {
  background: #fff7ed;
  color: #c05621;
  border-color: #f7dfc7;
}
.tm-card-icon.is-archive,
.tm-card-icon.is-other {
  background: #f5f6f8;
  color: #6b7480;
  border-color: #e6ecef;
}
.tm-card-body {
  min-width: 0;
  flex: 1;
}
.tm-card-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1d2226;
  line-height: 1.3;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tm-card-path {
  margin: 4px 0 0;
  font-size: 11px;
  color: #7a8a82;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tm-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-top: 7px;
  font-size: 10px;
  color: #8a9399;
}
.tm-card-meta span + span::before {
  content: '·';
  margin-right: 6px;
  color: #c9d4cd;
}
.tm-card-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}
.tm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 10px;
  border: 1px solid #d9e7df;
  border-radius: 999px;
  background: #fff;
  color: #15693c;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;
}
.tm-btn:hover:not(:disabled) {
  background: #eafff5;
  border-color: #9fd4b7;
}
.tm-btn.is-primary {
  background: #15693c;
  border-color: #15693c;
  color: #fff;
}
.tm-btn.is-primary:hover:not(:disabled) {
  background: #1f9254;
  border-color: #1f9254;
}
.tm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.tm-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 44px 20px;
  text-align: center;
  color: #7a8a82;
}
.tm-empty p {
  margin: 0;
  font-size: 13px;
}
.tm-empty-icon {
  color: #c9e6d3;
}
.tm-synced {
  margin: 2px 0 0;
  text-align: right;
  font-size: 10px;
  color: #9aa6a0;
}
.tm-notice {
  display: flex;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid #c9e6d3;
  border-radius: 12px;
  background: #eafff5;
  color: #15693c;
}
.tm-notice.is-error {
  border-color: #f3d1d1;
  background: #fff5f5;
  color: #9b2c2c;
}
.tm-notice strong {
  display: block;
  font-size: 13px;
}
.tm-notice p {
  margin: 4px 0 10px;
  font-size: 12px;
  color: inherit;
}
.tm-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tm-preview img {
  display: block;
  max-width: 100%;
  max-height: 70vh;
  margin: 0 auto;
  border-radius: 8px;
}
.tm-preview iframe {
  width: 100%;
  height: 70vh;
  border: 0;
  border-radius: 8px;
  background: #f5f6f8;
}
.tm-preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}
.tm-spin {
  animation: tm-spin 1s linear infinite;
}
@keyframes tm-spin {
  to {
    transform: rotate(360deg);
  }
}
:deep(.ant-spin-dot-item) {
  background-color: #1f9254;
}
:deep(.tm-search.ant-input-affix-wrapper),
:deep(.tm-category .ant-select-selector) {
  border-radius: 10px;
  border-color: #e6ecef;
}
:deep(.tm-search.ant-input-affix-wrapper-focused),
:deep(.tm-category.ant-select-focused .ant-select-selector) {
  border-color: #9fd4b7;
  box-shadow: 0 0 0 2px rgba(31, 146, 84, 0.1);
}
@media (max-width: 900px) {
  .tm-card {
    flex-wrap: wrap;
  }
  .tm-card-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}
@media (max-width: 700px) {
  .tm-toolbar {
    flex-direction: column;
  }
  .tm-search,
  .tm-category {
    max-width: none;
    width: 100%;
  }
  .tm-grid {
    grid-template-columns: 1fr;
  }
  .tm-card {
    flex-wrap: nowrap;
  }
  .tm-card-actions {
    flex-direction: column;
    width: auto;
  }
  .tm-preview iframe {
    height: 62vh;
  }
}

</style>
