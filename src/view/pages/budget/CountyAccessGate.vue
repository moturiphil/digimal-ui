<template>
  <div class="county-access-gate">
    <!-- Super Admin: county picker -->
    <section v-if="isLevelOne" class="cag-picker-panel">
      <div class="cag-picker-row">
        <div class="cag-picker-label">
          <span class="cag-picker-icon">▦</span>
          Select a county to view
        </div>
        <a-select
          v-model:value="selectedCountyId"
          show-search
          option-filter-prop="label"
          placeholder="Choose a county..."
          class="cag-picker-select"
          :loading="loadingCounties"
          :options="countyOptions"
        />
      </div>
      <p v-if="!selectedCountyId" class="cag-picker-hint">
        Pick a county above to load its data.
      </p>
    </section>

    <!-- Resolved scope (super admin after pick OR county-level user) -->
    <slot
      v-if="resolvedCountyId"
      :countyId="resolvedCountyId"
      :countyName="resolvedCountyName"
    />
    <div v-else-if="isLevelOne" class="cag-empty">
      <span class="cag-empty-icon">◎</span>
      <span>No county selected yet.</span>
    </div>
    <div v-else-if="isCountyLevel" class="cag-empty">
      <span class="cag-empty-icon">⚠</span>
      <span>
        Your account is set as a county officer but no county is linked to it.
        Please contact an administrator.
      </span>
    </div>

    <!-- Unauthorized: full-page modal -->
    <a-modal
      :visible="showAccessModal"
      :closable="false"
      :mask-closable="false"
      :keyboard="false"
      :footer="null"
      :width="480"
      wrap-class-name="cag-access-modal"
      centered
    >
      <div class="cag-modal-body">
        <div class="cag-modal-icon">🔒</div>
        <h3 class="cag-modal-title">County access required</h3>
        <p class="cag-modal-text">
          This page is only available to county officers and super admins.
          Please log in with a county officer account to continue.
        </p>
        <div class="cag-modal-actions">
          <sdButton type="primary" @click="goToLogin">Log in as County Officer</sdButton>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/Axiosconfig';

const SUPER_ADMIN_LEVEL = 1;
const COUNTY_LEVEL = 2;

const cleanCountyName = (name) => {
  if (!name) return '';
  return String(name)
    .replace(/\s+county$/i, '')
    .trim();
};

export default {
  name: 'CountyAccessGate',
  emits: ['scope-change'],
  setup(_, { emit }) {
    const router = useRouter();
    const user = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    })();
    const levelId = Number(user?.user?.level_id) || null;

    const isLevelOne = computed(() => levelId === SUPER_ADMIN_LEVEL);
    const isCountyLevel = computed(() => levelId === COUNTY_LEVEL);
    const showAccessModal = computed(
      () => !isLevelOne.value && !isCountyLevel.value,
    );

    /* County picker (super admin) ------------------------------ */
    const counties = ref([]);
    const loadingCounties = ref(false);
    const selectedCountyId = ref(null);

    const countyOptions = computed(() =>
      counties.value.map((c) => ({
        value: c.id,
        label: cleanCountyName(c.name) || c.name,
      })),
    );

    const fetchCounties = async () => {
      loadingCounties.value = true;
      try {
        const { data } = await axios.get('get_counties');
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.message)
              ? data.message
              : [];
        counties.value = rows
          .map((r) => ({
            id: r.id ?? r.org_id ?? r.uuid ?? null,
            name: r.name || r.county || r.title || '',
          }))
          .filter((c) => c.id && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) {
        counties.value = [];
      } finally {
        loadingCounties.value = false;
      }
    };

    /* Resolved scope ------------------------------------------- */
    const ownCountyId = computed(
      () =>
        user?.user?.county_id ||
        user?.user?.county?.id ||
        user?.user?.location_id ||
        user?.user?.location?.id ||
        null,
    );
    const ownCountyName = computed(
      () =>
        cleanCountyName(
          user?.user?.county?.name ||
            user?.user?.county_name ||
            user?.user?.location?.name ||
            '',
        ) || 'Your county',
    );

    const resolvedCountyId = computed(() => {
      if (isLevelOne.value) return selectedCountyId.value || null;
      if (isCountyLevel.value) return ownCountyId.value;
      return null;
    });

    const resolvedCountyName = computed(() => {
      if (isLevelOne.value) {
        const opt = countyOptions.value.find(
          (o) => o.value === selectedCountyId.value,
        );
        return opt ? opt.label : '';
      }
      if (isCountyLevel.value) return ownCountyName.value;
      return '';
    });

    watch(
      [resolvedCountyId, resolvedCountyName],
      ([id, name]) => {
        if (id) emit('scope-change', { countyId: id, countyName: name });
      },
      { immediate: true },
    );

    onMounted(() => {
      if (isLevelOne.value) fetchCounties();
    });

    const goToLogin = () => {
      router.push({ path: '/auth/login' });
    };

    return {
      isLevelOne,
      isCountyLevel,
      showAccessModal,
      loadingCounties,
      selectedCountyId,
      countyOptions,
      resolvedCountyId,
      resolvedCountyName,
      goToLogin,
    };
  },
};
</script>

<style lang="less" scoped>
.county-access-gate {
  position: relative;
}

.cag-picker-panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}

.cag-picker-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cag-picker-label {
  font-size: 13px;
  font-weight: 700;
  color: #2f6746;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  .cag-picker-icon { color: #4d8a63; }
}

.cag-picker-select {
  min-width: 280px;
  flex: 1;
  max-width: 420px;
}

.cag-picker-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #7a8a82;
}

.cag-empty {
  background: #fff;
  border: 1px dashed #d9f0e2;
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  color: #7a8a82;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  .cag-empty-icon { color: #9ad8b4; font-size: 16px; }
}
</style>

<style lang="less">
.cag-access-modal {
  .ant-modal-content { border-radius: 14px; }
}
.cag-modal-body {
  text-align: center;
  padding: 8px 4px;
  .cag-modal-icon {
    font-size: 38px;
    margin-bottom: 12px;
  }
  .cag-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #15693c;
    margin-bottom: 8px;
  }
  .cag-modal-text {
    font-size: 13px;
    color: #5a5f7d;
    margin-bottom: 18px;
    line-height: 1.5;
  }
  .cag-modal-actions {
    display: flex;
    justify-content: center;
  }
}
</style>
