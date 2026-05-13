<template>
  <div class="sub-county-access-gate">
    <!-- Picker panel: shown when the active user level needs to choose a
         county (super admin) or a sub-county (super admin / county
         officer). Sub-county officers go straight to the slot. -->
    <section v-if="showCountyPicker || showSubCountyPicker" class="scag-picker-panel">
      <div class="scag-picker-row">
        <!-- County picker — super admin only -->
        <template v-if="showCountyPicker">
          <div class="scag-picker-label">
            <span class="scag-picker-icon">▦</span>
            County
          </div>
          <a-select
            v-model:value="selectedCountyId"
            show-search
            option-filter-prop="label"
            placeholder="Choose a county..."
            class="scag-picker-select"
            :loading="loadingCounties"
            :options="countyOptions"
            @change="onCountyChange"
          />
        </template>

        <!-- Sub-county picker — super admin (after county pick) and county officer -->
        <template v-if="showSubCountyPicker">
          <div class="scag-picker-label">
            <span class="scag-picker-icon">◔</span>
            Sub-County
          </div>
          <a-select
            v-model:value="selectedSubCountyId"
            show-search
            option-filter-prop="label"
            placeholder="Choose a sub-county..."
            class="scag-picker-select"
            :loading="loadingSubCounties"
            :options="subCountyOptions"
            :disabled="!effectiveCountyId"
          />
        </template>
      </div>
      <p v-if="!resolvedSubCountyProfileId" class="scag-picker-hint">
        {{ pickerHint }}
      </p>
    </section>

    <!-- Resolved scope -->
    <slot
      v-if="resolvedSubCountyProfileId"
      :countyProfileId="resolvedSubCountyProfileId"
      :countyId="effectiveCountyId"
      :subCountyId="resolvedSubCountyId"
      :countyName="resolvedCountyName"
      :subCountyName="resolvedSubCountyName"
    />
    <div v-else-if="bootstrapping" class="scag-skeleton">
      <a-skeleton-input style="width: 240px" active size="default" />
      <a-skeleton active :paragraph="{ rows: 4 }" />
      <a-skeleton active :paragraph="{ rows: 3 }" />
    </div>
    <div v-else-if="isSubCountyLevel && !resolvedSubCountyProfileId" class="scag-empty">
      <span class="scag-empty-icon">⚠</span>
      <span>
        Your account is set as a sub-county officer but no sub-county profile
        is linked to it. Please contact an administrator.
      </span>
    </div>

    <!-- Unauthorized: full-page modal -->
    <a-modal
      :open="showAccessModal"
      :closable="false"
      :mask-closable="false"
      :keyboard="false"
      :footer="null"
      :width="480"
      wrap-class-name="scag-access-modal"
      centered
    >
      <div class="scag-modal-body">
        <div class="scag-modal-icon">🔒</div>
        <h3 class="scag-modal-title">Sub-county access required</h3>
        <p class="scag-modal-text">
          This page is only available to sub-county officers, county officers,
          and super admins. Please log in with an authorised account.
        </p>
        <div class="scag-modal-actions">
          <sdButton type="primary" @click="goToLogin">Log in</sdButton>
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
const SUB_COUNTY_LEVEL = 3;

const cleanName = (name, suffix) => {
  if (!name) return '';
  const re = new RegExp(`\\s+${suffix}\\s*$`, 'i');
  return String(name).replace(re, '').trim() || String(name);
};

export default {
  name: 'SubCountyAccessGate',
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
    const isSubCountyLevel = computed(() => levelId === SUB_COUNTY_LEVEL);
    const showAccessModal = computed(
      () => !isLevelOne.value && !isCountyLevel.value && !isSubCountyLevel.value,
    );

    /* County picker (super admin) ------------------------------ */
    const counties = ref([]);
    const loadingCounties = ref(false);
    // True while the gate is still doing its first resolution pass
    // (fetching counties / sub-counties / own profile). Used to render
    // a skeleton instead of the "no profile linked" empty state.
    const bootstrapping = ref(true);
    const selectedCountyId = ref(null);
    const countyOptions = computed(() =>
      counties.value.map((c) => ({
        value: c.id,
        label: cleanName(c.name, 'county') || c.name,
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

    /* Own county (level 2 — county officer) -------------------- */
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
        cleanName(
          user?.user?.county?.name ||
            user?.user?.county_name ||
            user?.user?.location?.name ||
            '',
          'county',
        ) || 'Your county',
    );

    /* The county whose sub-counties we should list --------------- */
    const effectiveCountyId = computed(() => {
      if (isLevelOne.value) return selectedCountyId.value || null;
      if (isCountyLevel.value) return ownCountyId.value;
      // Sub-county level — auto resolved from get_my_county_profile below
      return null;
    });

    /* Sub-county picker -------------------------------------------- */
    // Each row corresponds to a sub-county-level county_profiles row
    // for the effective county. We show the sub-county name as the
    // option label and use the row's id (= county_profile_id) as the
    // value, so the slot consumer gets a ready-to-use profile id.
    const subCountyProfiles = ref([]);
    const loadingSubCounties = ref(false);
    const selectedSubCountyId = ref(null);

    const subCountyOptions = computed(() =>
      subCountyProfiles.value.map((p) => ({
        value: p.id,
        label: cleanName(p.subCountyName, 'sub county') || p.subCountyName,
        subCountyId: p.subCountyId,
        subCountyName: p.subCountyName,
      })),
    );

    const fetchSubCountiesForCounty = async (countyId) => {
      if (!countyId) {
        subCountyProfiles.value = [];
        return;
      }
      loadingSubCounties.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { county_id: countyId, level: 'sub_county' },
        });
        const rows = Array.isArray(data) ? data : data?.data || [];
        subCountyProfiles.value = rows
          .map((r) => ({
            id: r.id, // = county_profile_id
            subCountyId: r.sub_county_id,
            subCountyName:
              r.sub_county?.name || r.sub_county_name || `Sub-county ${r.sub_county_id}`,
          }))
          .filter((r) => r.id && r.subCountyId)
          .sort((a, b) => a.subCountyName.localeCompare(b.subCountyName));
      } catch (e) {
        subCountyProfiles.value = [];
      } finally {
        loadingSubCounties.value = false;
      }
    };

    const onCountyChange = () => {
      // Clear any prior sub-county pick when the county changes.
      selectedSubCountyId.value = null;
      subCountyProfiles.value = [];
      if (effectiveCountyId.value) {
        fetchSubCountiesForCounty(effectiveCountyId.value);
      }
    };

    /* Sub-county officer auto-resolution (level 3) ----------------- */
    const ownSubCountyProfileId = ref(null);
    const ownSubCountyId = ref(null);
    const ownSubCountyName = ref('');
    const ownDerivedCountyId = ref(null);
    const ownDerivedCountyName = ref('');

    const fetchOwnProfile = async () => {
      try {
        const { data } = await axios.get('get_my_county_profile');
        ownSubCountyProfileId.value =
          data?.county_profile_id || data?.profile?.id || null;
        ownSubCountyId.value =
          data?.sub_county_id || data?.sub_county?.id || null;
        ownSubCountyName.value =
          data?.sub_county?.name || data?.sub_county_name || '';
        ownDerivedCountyId.value =
          data?.county_id || data?.county?.id || null;
        ownDerivedCountyName.value =
          data?.county?.name || data?.county_name || '';
      } catch (e) {
        // Modal will handle unauthenticated state.
      }
    };

    /* Resolved scope ----------------------------------------------- */
    const resolvedSubCountyProfileId = computed(() => {
      if (isSubCountyLevel.value) return ownSubCountyProfileId.value;
      return selectedSubCountyId.value || null;
    });

    const resolvedSubCountyId = computed(() => {
      if (isSubCountyLevel.value) return ownSubCountyId.value;
      const opt = subCountyOptions.value.find(
        (o) => o.value === selectedSubCountyId.value,
      );
      return opt ? opt.subCountyId : null;
    });

    const resolvedSubCountyName = computed(() => {
      if (isSubCountyLevel.value) return ownSubCountyName.value;
      const opt = subCountyOptions.value.find(
        (o) => o.value === selectedSubCountyId.value,
      );
      return opt ? opt.subCountyName : '';
    });

    const resolvedCountyName = computed(() => {
      if (isSubCountyLevel.value) {
        return cleanName(ownDerivedCountyName.value, 'county');
      }
      if (isCountyLevel.value) return ownCountyName.value;
      // Super admin
      const opt = countyOptions.value.find(
        (o) => o.value === selectedCountyId.value,
      );
      return opt ? opt.label : '';
    });

    /* Picker visibility -------------------------------------------- */
    const showCountyPicker = computed(() => isLevelOne.value);
    const showSubCountyPicker = computed(
      () => isLevelOne.value || isCountyLevel.value,
    );
    const pickerHint = computed(() => {
      if (isLevelOne.value && !selectedCountyId.value) {
        return 'Pick a county above to choose a sub-county.';
      }
      if (!selectedSubCountyId.value) {
        return 'Pick a sub-county above to load its data.';
      }
      return '';
    });

    /* Emit scope-change whenever the resolved profile changes ------ */
    watch(
      [
        resolvedSubCountyProfileId,
        resolvedSubCountyId,
        resolvedSubCountyName,
        resolvedCountyName,
        effectiveCountyId,
      ],
      ([profileId, scId, scName, countyName, countyId]) => {
        if (profileId) {
          emit('scope-change', {
            countyProfileId: profileId,
            countyId,
            subCountyId: scId,
            countyName,
            subCountyName: scName,
          });
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      // Track initial scope resolution so the page can render a skeleton
      // (instead of flashing the "no profile linked" empty state) while
      // the auto-resolution / fetch is still in flight.
      bootstrapping.value = true;
      const done = () => {
        bootstrapping.value = false;
      };
      if (isLevelOne.value) {
        fetchCounties().finally(done);
      } else if (isCountyLevel.value && ownCountyId.value) {
        fetchSubCountiesForCounty(ownCountyId.value).finally(done);
      } else if (isSubCountyLevel.value) {
        fetchOwnProfile().finally(done);
      } else {
        done();
      }
    });

    const goToLogin = () => {
      router.push({ path: '/auth/login' });
    };

    return {
      isLevelOne,
      isCountyLevel,
      isSubCountyLevel,
      showAccessModal,
      showCountyPicker,
      showSubCountyPicker,
      loadingCounties,
      loadingSubCounties,
      selectedCountyId,
      selectedSubCountyId,
      countyOptions,
      subCountyOptions,
      effectiveCountyId,
      resolvedSubCountyProfileId,
      resolvedSubCountyId,
      resolvedSubCountyName,
      resolvedCountyName,
      pickerHint,
      onCountyChange,
      goToLogin,
      bootstrapping,
    };
  },
};
</script>

<style lang="less" scoped>
.sub-county-access-gate {
  position: relative;
}

.scag-picker-panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}

.scag-picker-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.scag-picker-label {
  font-size: 13px;
  font-weight: 700;
  color: #2f6746;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  .scag-picker-icon { color: #4d8a63; }
}

.scag-picker-select {
  min-width: 240px;
  flex: 1;
  max-width: 360px;
}

.scag-picker-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #7a8a82;
}

.scag-empty {
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
  .scag-empty-icon { color: #d8a89a; font-size: 16px; }
}

.scag-skeleton {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>

<style lang="less">
.scag-access-modal {
  .ant-modal-content { border-radius: 14px; }
}
.scag-modal-body {
  text-align: center;
  padding: 8px 4px;
  .scag-modal-icon {
    font-size: 38px;
    margin-bottom: 12px;
  }
  .scag-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #15693c;
    margin-bottom: 8px;
  }
  .scag-modal-text {
    font-size: 13px;
    color: #5a5f7d;
    margin-bottom: 18px;
    line-height: 1.5;
  }
  .scag-modal-actions {
    display: flex;
    justify-content: center;
  }
}
</style>
