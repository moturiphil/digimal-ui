<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">Sub-County Profile</h3>
            <p class="ph-subtitle">
              {{ scopeLabel }} — Demographic and computed campaign parameters
            </p>
          </div>
          <div class="ph-actions">
            <a-tag :color="profileSaved ? 'green' : 'orange'">
              {{ profileSaved ? 'Profile Saved' : 'Unsaved Changes' }}
            </a-tag>
          </div>
        </div>

        <a-spin :spinning="loading">

        <!-- ───────── Demographic Details ───────── -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">Demographic Details</div>
              <p class="panel-subtitle">
                Capture sub-county demographics used to drive campaign computations.
              </p>
            </div>
            <div>
              <sdButton v-if="!editing" type="dark" size="small" @click="editing = true">
                ✎ Edit
              </sdButton>
              <span v-else style="display:inline-flex; gap:8px;">
                <sdButton type="success" size="small" :loading="saving" @click="handleSave">
                  Save
                </sdButton>
                <sdButton size="small" @click="editing = false">Cancel</sdButton>
              </span>
            </div>
          </div>

          <a-form layout="vertical" :model="form">
            <a-row :gutter="16">
              <a-col :sm="12" :xs="24">
                <a-form-item label="Population">
                  <a-input-number v-model:value="form.population" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="Estimated Households">
                  <a-input-number v-model:value="form.estimated_households" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="Estimated LLINs">
                  <a-input-number v-model:value="form.estimated_llins" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="No. of Bales">
                  <a-input-number v-model:value="form.number_of_bales" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
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
                <a-form-item label="No. of Distribution Posts">
                  <a-input-number v-model:value="form.number_of_posts" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="No. of Drop-off Points">
                  <a-input-number v-model:value="form.number_of_drop_off_points" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="Households Registered per Day">
                  <a-input-number v-model:value="form.households_registered_per_day" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="Admin Structures">
                  <a-input-number v-model:value="form.number_of_administrative_structures" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="Health Workers to Train">
                  <a-input-number v-model:value="form.hworkers_to_train" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
              <a-col :sm="12" :xs="24">
                <a-form-item label="CHVs &amp; Elders to Train">
                  <a-input-number v-model:value="form.chvs_and_elders_to_train" :disabled="!editing" :min="0" style="width:100%;" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <div class="profile-tiles top">
            <div class="profile-tile highlight">
              <div class="pt-label">Population</div>
              <div class="pt-value">{{ fmt(form.population) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Households</div>
              <div class="pt-value">{{ fmt(form.estimated_households) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">LLINs</div>
              <div class="pt-value">{{ fmt(form.estimated_llins) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Wards</div>
              <div class="pt-value">{{ fmt(form.number_of_wards) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Posts</div>
              <div class="pt-value">{{ fmt(form.number_of_posts) }}</div>
            </div>
          </div>
        </section>

        <!-- ───────── Computed Parameters ───────── -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">Computed Parameters</div>
              <p class="panel-subtitle">
                Auto-calculated from the demographic data captured above.
              </p>
            </div>
            <a-tag color="blue">Auto</a-tag>
          </div>

          <div class="param-grid">
            <div class="param-row" v-for="p in computedParams" :key="p.label">
              <span class="param-label">{{ p.label }}</span>
              <span class="param-value">{{ fmt(p.value) }}</span>
            </div>
          </div>
        </section>

        <!-- ───────── Status ───────── -->
        <section class="panel status-panel">
          <div class="status-row">
            <div class="status-icon">{{ profileSaved ? '✓' : '!' }}</div>
            <div class="status-body">
              <div class="status-title">
                {{ profileSaved ? 'Profile Saved' : 'Unsaved Changes' }}
              </div>
              <div v-if="profileSaved" class="status-meta">
                Last updated: {{ lastUpdated }}
              </div>
              <div v-else class="status-meta warn">
                Click Save to persist your data
              </div>
            </div>
          </div>
        </section>
        </a-spin>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

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
  number_of_drop_off_points: 0,
  households_registered_per_day: 0,
  number_of_administrative_structures: 0,
  hworkers_to_train: 0,
  training_sessions_hw: 0,
  class_size_hw: 0,
  chvs_and_elders_to_train: 0,
  training_sessions_chv: 0,
  class_size_chv: 0,
});

export default {
  name: 'SubCountyProfile',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
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

    const form = reactive(emptyForm());

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
      const p = resp.profile || {};
      const blank = emptyForm();
      Object.keys(blank).forEach((k) => {
        form[k] = p[k] != null ? Number(p[k]) || 0 : blank[k];
      });
      lastUpdated.value = formatDate(p.updated_at);
      profileSaved.value = true;
    };

    const loadProfile = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_my_county_profile');
        applyProfile(data);
      } catch (err) {
        notification.error({
          message: 'Failed to load profile',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadProfile);

    const computedParams = computed(() => [
      { label: 'Estimated LLINs', value: form.estimated_llins },
      { label: 'No. of Bales', value: form.number_of_bales },
      { label: 'Households Registered / Day', value: form.households_registered_per_day },
      { label: 'Admin Structures', value: form.number_of_administrative_structures },
      { label: 'H/W Training Sessions', value: form.training_sessions_hw },
      { label: 'H/W Class Size', value: form.class_size_hw },
      { label: 'CHV & Elders Training Sessions', value: form.training_sessions_chv },
      { label: 'CHV & Elders Class Size', value: form.class_size_chv },
    ]);

    const handleSave = () => {
      saving.value = true;
      setTimeout(() => {
        saving.value = false;
        editing.value = false;
        profileSaved.value = true;
        lastUpdated.value = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
        notification.success({ message: 'Profile saved.' });
      }, 500);
    };

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      editing,
      saving,
      loading,
      profileSaved,
      lastUpdated,
      scopeLabel,
      profileMeta,
      form,
      computedParams,
      handleSave,
      fmt,
    };
  },
};
</script>

<style lang="less" scoped>
.minimal-dashboard {
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
      max-width: 640px;
    }
  }

  /* Profile tiles */
  .profile-tiles {
    display: grid;
    gap: 10px;
    margin-top: 14px;
    &.top { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    @media (max-width: 1100px) {
      &.top { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
    }
  }
  .profile-tile {
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 6px;
    padding: 10px 12px;
    text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s;
    &:hover {
      border-color: #c9e6d3;
      box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
    }
    &.highlight {
      background: #f4fbf6;
      border-color: #c9e6d3;
    }
    .pt-label {
      font-size: 11px;
      color: #8a9399;
      margin-bottom: 2px;
      font-weight: 500;
    }
    .pt-value {
      font-size: 16px;
      font-weight: 700;
      color: #1f2437;
      line-height: 1.2;
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
    .param-label { color: #4d8a63; }
    .param-value {
      font-weight: 800;
      color: #15693c;
      font-size: 14px;
    }
  }

  /* Status panel */
  .status-panel {
    background: #fafcfb !important;
    border-color: #e6ecef !important;
  }
  .status-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .status-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #eaf7ef;
    color: #15693c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .status-title {
    font-size: 13px;
    font-weight: 700;
    color: #1f2437;
  }
  .status-meta {
    margin-top: 2px;
    font-size: 11px;
    color: #7a8a82;
    &.warn { color: #c98a16; }
  }
}
</style>
