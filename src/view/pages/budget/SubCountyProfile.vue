<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">◉</span>
              <template v-if="subCountyName">{{ subCountyName }} Sub-County Profile</template>
              <template v-else>Sub-County Profile</template>
            </h3>
            <p class="ph-subtitle">
              {{ scopeLabel }} — Demographic and computed campaign parameters
            </p>
          </div>
          <div class="ph-actions">
            <a-tag :class="['stage-tag', profileSaved ? 'ok' : 'warn']">
              {{ profileSaved ? '✓ Profile Saved' : '● Unsaved Changes' }}
            </a-tag>
          </div>
        </div>

        <a-spin :spinning="loading">
        <SubCountyAccessGate @scope-change="onScopeChange">
          <template #default="{ countyProfileId: gatedProfileId }">
            <span v-if="gatedProfileId" style="display:none;">{{ gatedProfileId }}</span>

        <!-- ───────── Sticky summary / save bar ───────── -->
        <div class="summary-bar" v-if="!loading">
          <div class="sb-left">
            <div class="sb-stat">
              <div class="sb-label">Last updated</div>
              <div class="sb-value muted">{{ lastUpdated }}</div>
            </div>
            <div class="sb-stat" v-if="!profileSaved">
              <div class="sb-label">Status</div>
              <div class="sb-value warn">Unsaved edits</div>
            </div>
          </div>
          <div class="sb-right">
            <a-tag v-if="readOnly" color="purple" class="stage-tag">
              {{ readOnlyLabel }}
            </a-tag>
            <template v-else-if="!editing">
              <sdButton type="dark" size="small" class="pill-btn" @click="startEdit">
                ✎ Edit profile
              </sdButton>
            </template>
            <template v-else>
              <sdButton size="small" class="pill-btn" :disabled="saving" @click="cancelEdit">
                Cancel
              </sdButton>
              <a-tooltip :title="profileSaved ? 'Make a change to enable saving.' : ''">
                <sdButton
                  type="success"
                  size="small"
                  class="pill-btn save-btn"
                  :loading="saving"
                  :disabled="profileSaved"
                  @click="handleSave"
                >
                  ✓ Save changes
                </sdButton>
              </a-tooltip>
            </template>
          </div>
        </div>

        <!-- ───────── KPI tiles ───────── -->
        <div class="kpi-grid">
          <div class="kpi-tile primary">
            <div class="kpi-icon">👥</div>
            <div class="kpi-body">
              <div class="kpi-label">Population</div>
              <div class="kpi-value">{{ fmt(form.population) }}</div>
            </div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-icon">🏠</div>
            <div class="kpi-body">
              <div class="kpi-label">Households</div>
              <div class="kpi-value">{{ fmt(form.estimated_households) }}</div>
            </div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-icon">▦</div>
            <div class="kpi-body">
              <div class="kpi-label">Estimated LLINs</div>
              <div class="kpi-value">{{ fmt(form.estimated_llins) }}</div>
            </div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-icon">▤</div>
            <div class="kpi-body">
              <div class="kpi-label">Wards</div>
              <div class="kpi-value">{{ fmt(form.number_of_wards) }}</div>
            </div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-icon">⚑</div>
            <div class="kpi-body">
              <div class="kpi-label">Distribution Posts</div>
              <div class="kpi-value">{{ fmt(form.number_of_posts) }}</div>
            </div>
          </div>
        </div>

        <br>
        <br>

        <!-- ───────── Demographic Details ───────── -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title strong">
                <span class="step-pill">Step 1</span> Demographic Details
              </div>
            </div>
          </div>

          <a-form layout="vertical" :model="form">
            <!-- Group 1: Population -->
            <div class="form-group">
              <div class="fg-head">
                <span class="fg-icon">👥</span>
                <div>
                  <div class="fg-title">Population &amp; Coverage</div>
                  <div class="fg-sub">Core figures that drive household and LLIN estimates.</div>
                </div>
              </div>
              <a-row :gutter="16">
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Population
                      <a-tooltip title="Total resident population in this sub-county.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.population" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Estimated Households
                      <a-tooltip title="Estimated number of households in the sub-county.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.estimated_households" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <!-- <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Estimated LLINs
                      <a-tooltip title="Estimated long-lasting insecticidal nets needed for full coverage.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.estimated_llins" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      No. of Bales
                      <a-tooltip title="Number of LLIN bales required for distribution.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.number_of_bales" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col> -->
              </a-row>
            </div>

            <!-- Group 2: Administrative geography -->
            <div class="form-group">
              <div class="fg-head">
                <span class="fg-icon">▤</span>
                <div>
                  <div class="fg-title">Administrative Geography</div>
                  <div class="fg-sub">Sub-county sub-divisions used for planning.</div>
                </div>
              </div>
              <a-row :gutter="16">
                <a-col :sm="12" :xs="24">
                  <a-form-item label="No. of Wards">
                    <a-input-number v-model:value="form.number_of_wards" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item label="No. of Locations">
                    <a-input-number v-model:value="form.number_of_locations" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item label="No. of Sub-Locations">
                    <a-input-number v-model:value="form.number_of_sub_locations" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item label="No. of Villages">
                    <a-input-number v-model:value="form.number_of_villages" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Admin Structures
                      <a-tag class="status-tag info auto">Auto</a-tag>
                      <a-tooltip title="Auto-computed from administrative geography. Not directly editable.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.number_of_administrative_structures" disabled :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <!-- Group 3: Distribution logistics -->
            <div class="form-group">
              <div class="fg-head">
                <span class="fg-icon">⚑</span>
                <div>
                  <div class="fg-title">Distribution Logistics</div>
                  <div class="fg-sub">Posts, drop-offs, and registration throughput.</div>
                </div>
              </div>
              <a-row :gutter="16">
                <a-col :sm="12" :xs="24">
                  <a-form-item label="No. of Distribution Posts">
                    <a-input-number v-model:value="form.number_of_posts" :disabled="!editing" :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      No. of Drop-off Points
                      <a-tag class="status-tag muted auto">Fixed</a-tag>
                      <a-tooltip title="Currently fixed at 1 per sub-county.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.number_of_drop_off_points" disabled :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Households Registered / Day
                      <a-tag class="status-tag info auto">Auto</a-tag>
                      <a-tooltip title="Auto-computed from registration capacity. Not directly editable.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.households_registered_per_day" disabled :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <!-- Group 4: Training -->
            <div class="form-group">
              <div class="fg-head">
                <span class="fg-icon">🎓</span>
                <div>
                  <div class="fg-title">Training Requirements</div>
                  <div class="fg-sub">Personnel to be trained ahead of the campaign.</div>
                </div>
              </div>
              <a-row :gutter="16">
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      Health Workers to Train
                      <a-tag class="status-tag info auto">Auto</a-tag>
                      <a-tooltip title="Auto-computed from health worker policy ratios. Not directly editable.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.hworkers_to_train" disabled :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
                <a-col :sm="12" :xs="24">
                  <a-form-item>
                    <template #label>
                      CHVs &amp; Elders to Train
                      <a-tag class="status-tag info auto">Auto</a-tag>
                      <a-tooltip title="Auto-computed from CHV/Elder policy ratios. Not directly editable.">
                        <span class="hint-mark">?</span>
                      </a-tooltip>
                    </template>
                    <a-input-number v-model:value="form.chvs_and_elders_to_train" disabled :min="0" style="width:100%;" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </section>

        <!-- ───────── Computed Parameters ───────── -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title strong">
                <span class="step-pill">Step 2</span> Computed Parameters
              </div>
              <p class="panel-subtitle">
                Auto-calculated from the demographic data above. These values feed
                directly into the campaign budget.
              </p>
            </div>
            <a-tag class="status-tag info">Auto</a-tag>
          </div>

          <div class="param-grid">
            <div class="param-row" v-for="p in computedParams" :key="p.label">
              <span class="param-label">
                {{ p.label }}
                <a-tooltip v-if="p.hint" :title="p.hint">
                  <span class="hint-mark">?</span>
                </a-tooltip>
              </span>
              <span class="param-value">{{ fmt(p.value) }}</span>
            </div>
          </div>
        </section>

        <!-- ───────── Step 3: Save & continue ───────── -->
        <section v-if="!readOnly" class="panel submit-panel">
          <div class="panel-head">
            <div>
              <div class="panel-title strong">
                <span class="step-pill">Step 3</span> Save &amp; Continue
              </div>
              <p class="panel-subtitle">
                Save your profile, then move on to building the sub-county budget.
              </p>
            </div>
          </div>

          <div v-if="!profileSaved" class="submit-warning">
            <span class="sw-icon">!</span>
            You have unsaved changes. Save them now so they're included in the budget.
          </div>

          <div class="submit-grid">
            <div :class="['submit-card', { primary: profileSaved }]">
              <div class="sc-icon save-ic">✓</div>
              <div class="sc-body">
                <div class="sc-title">
                  1. Save Profile
                  <a-tag v-if="profileSaved" class="status-tag ok">Saved</a-tag>
                  <a-tag v-else class="status-tag warn">Pending</a-tag>
                </div>
                <div class="sc-desc">
                  {{ profileSaved
                    ? 'Profile is saved. You can edit again at any time.'
                    : 'Persist the demographic values you entered.' }}
                </div>
              </div>
              <a-tooltip :title="!editing ? 'Click Edit profile to make changes.' : ''">
                <sdButton
                  type="success"
                  size="small"
                  class="pill-btn"
                  :loading="saving"
                  :disabled="!editing || profileSaved"
                  @click="handleSave"
                >
                  Save
                </sdButton>
              </a-tooltip>
            </div>

            <div :class="['submit-card', { primary: profileSaved, locked: !profileSaved }]">
              <div class="sc-icon next-ic">→</div>
              <div class="sc-body">
                <div class="sc-title">
                  2. Continue to Budgeting
                  <a-tag v-if="!profileSaved" class="status-tag muted">Locked</a-tag>
                </div>
                <div class="sc-desc">
                  {{ profileSaved
                    ? 'Use this profile to generate the sub-county budget.'
                    : 'Save the profile first to unlock budgeting.' }}
                </div>
              </div>
              <a-tooltip :title="!profileSaved ? 'Save the profile first.' : ''">
                <sdButton
                  type="dark"
                  size="small"
                  class="pill-btn"
                  :disabled="!profileSaved"
                  @click="goToBudgeting"
                >
                  Open Budgeting →
                </sdButton>
              </a-tooltip>
            </div>
          </div>
        </section>
          </template>
        </SubCountyAccessGate>
        </a-spin>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { hasRoleByName } from '@/services/user-role';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import SubCountyAccessGate from './SubCountyAccessGate.vue';

const emptyForm = () => ({
  population: 0,
  estimated_households: 0,
  estimated_llins: 0,
  number_of_bales: 0,
  number_of_wards: 0,
  number_of_locations: 0,
  number_of_sub_locations: 0,
  number_of_villages: 0,
  number_of_posts: 0,
  number_of_drop_off_points: 1,
  households_registered_per_day: 0,
  number_of_administrative_structures: 0,
  hworkers_to_train: 0,
  training_sessions_hw: 0,
  class_size_hw: 0,
  chvs_and_elders_to_train: 0,
  training_sessions_chv: 0,
  class_size_chv: 0,
});

// Fields the user is expected to fill (used for the completion %).
const USER_INPUT_FIELDS = [
  'population',
  'estimated_households',
  'estimated_llins',
  'number_of_bales',
  'number_of_wards',
  'number_of_locations',
  'number_of_sub_locations',
  'number_of_villages',
  'number_of_posts',
  'number_of_drop_off_points',
  'households_registered_per_day',
  'number_of_administrative_structures',
  'hworkers_to_train',
  'chvs_and_elders_to_train',
];

export default {
  name: 'SubCountyProfile',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, SubCountyAccessGate },
  setup() {
    // Level 1 (National / Super Admin) users get a strict view-only mode
    // — no Edit, no Save, no Continue. Additionally, once a sub-county
    // budget has been APPROVED, the sub-county profile becomes view-only
    // for every role EXCEPT the Super Admin (updates_locked is surfaced by
    // the backend county-profile API).
    const currentUser = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    })();
    const currentLevelId = Number(currentUser?.user?.level_id);
    const isSuperAdmin = hasRoleByName(['Super Admin']);

    // Set from the profile API (updates_locked) — true only for a sub-county
    // profile whose budget has already been approved.
    const updatesLocked = ref(false);

    // A profile is read-only when:
    //   • the user is not Super Admin AND
    //   • either they are a National-level (1) user, OR the sub-county
    //     profile has an approved budget (updatesLocked).
    // Super Admin can always edit, even a locked profile.
    const readOnly = computed(() => {
      if (isSuperAdmin.value) return false;
      if (currentLevelId === 1) return true;
      return updatesLocked.value;
    });

    const readOnlyLabel = computed(() => {
      if (isSuperAdmin.value) return 'Super Admin — editable';
      if (updatesLocked.value) return 'Profile locked — budget approved';
      if (currentLevelId === 1) return 'National view — read only';
      return '';
    });

    const router = useRouter();
    const editing = ref(false);
    const saving = ref(false);
    const loading = ref(false);
    const profileSaved = ref(true);
    const lastUpdated = ref('—');

    const profileMeta = ref({
      level: null,
      county_profile_id: null,
      county_id: null,
      sub_county_id: null,
      profile_id: null,
    });

    // Resolve sub-county name from session for the page header.
    const resolveSubCountyName = () => {
      try {
        const raw = sessionStorage.getItem('user');
        if (!raw) return '';
        const parsed = JSON.parse(raw);
        const u = parsed?.user || parsed;
        const sc = u?.sub_county || u?.subCounty || null;
        return sc?.name || u?.sub_county_name || '';
      } catch (e) {
        return '';
      }
    };
    const subCountyName = ref(resolveSubCountyName());

    const form = reactive(emptyForm());
    // Snapshot used to revert on Cancel and to detect dirty state.
    let savedSnapshot = JSON.stringify(emptyForm());
    let suppressDirty = false;

    const scopeLabel = computed(() => {
      if (!profileMeta.value.level) return 'Profile';
      if (profileMeta.value.level === 'county') return 'County-level Profile';
      if (profileMeta.value.level === 'sub_county') return 'Sub-County Profile';
      return profileMeta.value.level;
    });

    const formatDate = (s) => {
      if (!s) return '—';
      const d = new Date(s.replace(' ', 'T'));
      if (Number.isNaN(d.getTime())) return s;
      return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
    };

    const applyProfile = (resp) => {
      if (!resp) return;
      profileMeta.value = {
        level: resp.level || null,
        county_profile_id: resp.county_profile_id || null,
        county_id: resp.county_id || null,
        sub_county_id: resp.sub_county_id || null,
        profile_id: resp.profile?.id || null,
      };
      // Backend surfaces updates_locked = true when this sub-county profile
      // has an approved budget (view-only except for Super Admin).
      updatesLocked.value =
        !!resp.profile?.updates_locked || !!resp.updates_locked;
      // Prefer name from API when available.
      const apiName =
        resp.sub_county?.name || resp.sub_county_name || resp.profile?.sub_county?.name;
      if (apiName) subCountyName.value = apiName;
      const p = resp.profile || {};
      const blank = emptyForm();
      suppressDirty = true;
      Object.keys(blank).forEach((k) => {
        form[k] = p[k] != null ? Number(p[k]) || 0 : blank[k];
      });
      // Drop-off points are fixed at 1 per sub-county.
      form.number_of_drop_off_points = 1;
      lastUpdated.value = formatDate(p.updated_at);
      profileSaved.value = true;
      savedSnapshot = JSON.stringify({ ...form });
      // Allow watcher to settle before re-enabling dirty tracking.
      setTimeout(() => { suppressDirty = false; }, 0);
    };

    /* Load the sub-county profile by id. The id comes from
     * SubCountyAccessGate — either the user's own profile (level-3) or
     * one chosen by a level-1/2 user from the gate's selectors. */
    const loadProfileById = async (profileId) => {
      if (!profileId) return;
      loading.value = true;
      try {
        const { data } = await axios.get(`get_county_profile/${profileId}`);
        // The single-profile endpoint returns a flat profile row — wrap
        // it so applyProfile() can read both shapes consistently.
        applyProfile({
          level: data?.sub_county_id ? 'sub_county' : 'county',
          county_profile_id: data?.id,
          county_id: data?.county_id,
          sub_county_id: data?.sub_county_id,
          sub_county: data?.sub_county || data?.subCounty,
          county: data?.county,
          profile: data,
        });

        // If the loaded profile is read-only for this user (e.g. its budget
        // has been approved), close any previous edit session so no inputs
        // stay enabled.
        if (readOnly.value) {
          editing.value = false;
          profileSaved.value = true;
        }
      } catch (err) {
        notification.error({
          message: 'Failed to load profile',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    const onScopeChange = ({ countyProfileId, subCountyName: scName }) => {
      if (scName) subCountyName.value = scName;
      loadProfileById(countyProfileId);
    };

    // Mark profile dirty whenever any tracked field changes.
    watch(
      () => ({ ...form }),
      (next) => {
        if (suppressDirty) return;
        profileSaved.value = JSON.stringify(next) === savedSnapshot;
      },
      { deep: true },
    );

    const completionPercent = computed(() => {
      const filled = USER_INPUT_FIELDS.filter((k) => Number(form[k]) > 0).length;
      return Math.round((filled / USER_INPUT_FIELDS.length) * 100);
    });

    const currentStep = computed(() => {
      if (editing.value || !profileSaved.value) return 1;
      if (completionPercent.value >= 100) return 3;
      if (completionPercent.value > 0) return 2;
      return 1;
    });

    const computedParams = computed(() => [
      {
        label: 'Estimated LLINs',
        value: form.estimated_llins,
        hint: 'Total nets needed for full coverage of the sub-county.',
      },
      {
        label: 'No. of Bales',
        value: form.number_of_bales,
        hint: 'Bales of LLINs required for distribution.',
      },
      {
        label: 'Households Registered / Day',
        value: form.households_registered_per_day,
        hint: 'Average households a registration team can process per day.',
      },
      {
        label: 'Admin Structures',
        value: form.number_of_administrative_structures,
        hint: 'Total administrative structures supporting the campaign.',
      },
      {
        label: 'H/W Training Sessions',
        value: form.training_sessions_hw,
        hint: 'Auto-computed health worker training sessions.',
      },
      {
        label: 'H/W Class Size',
        value: form.class_size_hw,
        hint: 'Auto-computed class size per health worker session.',
      },
      {
        label: 'CHV & Elders Training Sessions',
        value: form.training_sessions_chv,
        hint: 'Auto-computed CHV/Elder training sessions.',
      },
      {
        label: 'CHV & Elders Class Size',
        value: form.class_size_chv,
        hint: 'Auto-computed class size per CHV/Elder session.',
      },
    ]);

    const startEdit = () => {
      savedSnapshot = JSON.stringify({ ...form });
      editing.value = true;
    };

    const cancelEdit = () => {
      try {
        const snap = JSON.parse(savedSnapshot);
        suppressDirty = true;
        Object.keys(snap).forEach((k) => { form[k] = snap[k]; });
        setTimeout(() => { suppressDirty = false; }, 0);
      } catch (e) { /* noop */ }
      editing.value = false;
      profileSaved.value = true;
    };

    const handleSave = async () => {
      const id = profileMeta.value.county_profile_id;
      if (!id) {
        notification.error({
          message: 'Cannot save profile',
          description: 'Missing county profile id. Please reload the page and try again.',
        });
        return;
      }
      saving.value = true;
      try {
        const payload = { ...form };
        const { data } = await axios.put(`update_county_profile/${id}`, payload);
        // If the API returns the updated profile shape, re-apply it; otherwise
        // just snapshot the current form values.
        if (data && (data.profile || data.level)) {
          applyProfile(data);
        } else {
          savedSnapshot = JSON.stringify({ ...form });
          lastUpdated.value = new Date().toLocaleString('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
        }
        editing.value = false;
        profileSaved.value = true;
        notification.success({ message: 'Profile saved.' });
      } catch (err) {
        notification.error({
          message: 'Failed to save profile',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        saving.value = false;
      }
    };

    const goToBudgeting = () => {
      router.push('/budget/budgeting');
    };

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      editing,
      saving,
      loading,
      readOnly,
      readOnlyLabel,
      updatesLocked,
      onScopeChange,
      profileSaved,
      lastUpdated,
      scopeLabel,
      subCountyName,
      profileMeta,
      form,
      computedParams,
      completionPercent,
      currentStep,
      startEdit,
      cancelEdit,
      handleSave,
      goToBudgeting,
      fmt,
    };
  },
};
</script>

<style lang="less" scoped>
.minimal-dashboard {
  .stage-tag {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid transparent;
    &.ok {
      background: #e3faf3;
      color: #15693c;
      border-color: #c9e6d3;
    }
    &.warn {
      background: #fff8eb;
      color: #b35a00;
      border-color: #f3c97c;
    }
  }

  .panel-title.strong {
    color: #1f2437;
    font-size: 13px;
    font-weight: 700;
  }
  .step-pill {
    display: inline-block;
    background: #15693c;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 10px;
    padding: 2px 8px;
    margin-right: 8px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .hint-inline {
    display: inline-block;
    margin-left: 6px;
    color: #9aa6ad;
    strong { color: #15693c; }
  }
  .hint-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px; height: 14px;
    background: #eef3fb;
    color: #2f6dcf;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    margin-left: 4px;
    cursor: help;
    line-height: 1;
  }

  .pill-btn {
    border-radius: 6px;
    font-weight: 600;
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
    .panel-title { margin-bottom: 4px; }
    .panel-subtitle {
      margin: 0;
      font-size: 12px;
      color: #7a8a82;
      max-width: 720px;
    }
  }

  /* ===== Workflow stepper ===== */
  .workflow-stepper {
    list-style: none;
    margin: 4px 0 16px;
    padding: 14px 18px;
    display: flex;
    align-items: stretch;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #e6ecef;
    border-radius: 12px;
    overflow-x: auto;
  }
  .ws-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex: 1 1 0;
    min-width: 180px;
    padding: 4px 6px;
    border-radius: 8px;
    .ws-num {
      width: 26px; height: 26px;
      border-radius: 50%;
      background: #eef1f5;
      color: #7a8a82;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ws-text { line-height: 1.2; }
    .ws-title { font-size: 12px; font-weight: 700; color: #5a6470; }
    .ws-sub { font-size: 11px; color: #9aa6ad; margin-top: 2px; }
    &.active {
      background: #f3fcf6;
      .ws-num { background: #15693c; color: #fff; }
      .ws-title { color: #15693c; }
    }
    &.done {
      .ws-num { background: #c9e6d3; color: #15693c; }
      .ws-title { color: #2f6746; }
    }
  }
  .ws-sep {
    align-self: center;
    flex: 0 0 28px;
    height: 1px;
    background: #e1e6ec;
  }

  /* ===== Sticky summary / save bar ===== */
  .summary-bar {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 14px;
    margin-bottom: 12px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(6px);
    border: 1px solid #e6ecef;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.04);
    .sb-left {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      align-items: center;
    }
    .sb-stat .sb-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #9aa6ad;
      font-weight: 600;
    }
    .sb-stat .sb-value {
      font-size: 13px;
      font-weight: 700;
      color: #1f2437;
      &.muted { color: #7a8a82; font-weight: 600; }
      &.warn { color: #b35a00; }
    }
    .sb-progress-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .sb-progress {
      width: 160px;
      height: 6px;
      background: #eef1f5;
      border-radius: 6px;
      overflow: hidden;
    }
    .sb-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1f9254, #15693c);
      transition: width 0.25s ease-out;
    }
    .sb-progress-text {
      font-size: 12px;
      font-weight: 700;
      color: #15693c;
    }
    .sb-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .save-btn:not([disabled]) {
      box-shadow: 0 1px 2px rgba(31, 146, 84, 0.25);
    }
  }

  /* ===== KPI tiles ===== */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 12px;
    @media (max-width: 1100px) {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }
  }
  .kpi-tile {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
    padding: 12px 14px;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    &:hover {
      border-color: #c9e6d3;
      box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
      transform: translateY(-1px);
    }
    &.primary {
      background: linear-gradient(135deg, #f3fcf6 0%, #ffffff 100%);
      border-color: #c9e6d3;
    }
    .kpi-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: #eef3fb;
      color: #2f6dcf;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    &.primary .kpi-icon { background: #15693c; color: #fff; }
    .kpi-body { min-width: 0; }
    .kpi-label {
      font-size: 11px;
      color: #9aa6ad;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-weight: 600;
    }
    .kpi-value {
      font-size: 18px;
      font-weight: 800;
      color: #1f2437;
      line-height: 1.15;
    }
  }

  /* ===== Form groups ===== */
  .form-group {
    background: #fafcfb;
    border: 1px solid #eef1f0;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 14px;
    &:last-child { margin-bottom: 0; }
    .fg-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .fg-icon {
      width: 30px; height: 30px;
      background: #fff;
      border: 1px solid #e1e6ec;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .fg-title {
      font-size: 12px;
      font-weight: 700;
      color: #1f2437;
    }
    .fg-sub {
      font-size: 11px;
      color: #9aa6ad;
      margin-top: 1px;
    }
  }

  /* Computed parameters – two-column grid */
  .param-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 16px;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }
  .param-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    transition: border-color 0.15s, background 0.15s;
    &:hover { background: #f7faf8; border-color: #c9e6d3; }
    .param-label { color: #4d8a63; display: inline-flex; align-items: center; }
    .param-value {
      font-weight: 800;
      color: #15693c;
      font-size: 14px;
    }
  }

  /* ===== Step 3 — submit panel ===== */
  .submit-panel .panel-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: #7a8a82;
    max-width: 640px;
  }
  .submit-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background: #fff8eb;
    border: 1px solid #f3c97c;
    border-radius: 8px;
    color: #8a4a00;
    font-size: 12px;
    .sw-icon {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #f3c97c;
      color: #fff;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  }
  .status-tag {
    margin-left: 8px;
    border-radius: 10px;
    font-size: 10px;
    line-height: 18px;
    padding: 0 8px;
    border: 1px solid transparent;
    &.auto {
      margin-left: 6px;
      font-size: 9px;
      line-height: 16px;
      padding: 0 6px;
      vertical-align: middle;
    }
    &.ok {
      background: #e3faf3;
      color: #15693c;
      border-color: #c9e6d3;
    }
    &.warn {
      background: #fff8eb;
      color: #b35a00;
      border-color: #f3c97c;
    }
    &.muted {
      background: #f0f2f5;
      color: #7a8a82;
      border-color: #e1e6ec;
    }
    &.info {
      background: #eef3fb;
      color: #2f6dcf;
      border-color: #d7e3f5;
    }
  }
  .submit-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 14px;
    @media (max-width: 780px) { grid-template-columns: 1fr; }
  }
  .submit-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
    padding: 14px 16px;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    &:hover {
      border-color: #c9e6d3;
      box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
      transform: translateY(-1px);
    }
    &.primary {
      background: linear-gradient(90deg, #f3fcf6 0%, #eaf7ef 100%);
      border-color: #c9e6d3;
    }
    &.locked {
      background: #fafbfc;
      border-style: dashed;
      .sc-title, .sc-desc { color: #9aa6ad; }
      .sc-icon.next-ic { background: #c9cfd8; color: #fff; }
    }
    .sc-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
      &.save-ic { background: #15693c; color: #fff; }
      &.next-ic { background: #2f6dcf; color: #fff; }
    }
    .sc-body { flex: 1; min-width: 0; }
    .sc-title {
      font-size: 13px;
      font-weight: 700;
      color: #1f2437;
      display: inline-flex;
      align-items: center;
    }
    .sc-desc {
      margin-top: 2px;
      font-size: 11px;
      color: #7a8a82;
      line-height: 1.35;
    }
  }
}
</style>
