<template>
  <RecordViewWrapper>
    <sdPageHeader title="Sub-County Profile" />
    <Main>
      <BudgetPageWrapper>
        <a-row :gutter="16">
          <!-- Profile Form -->
          <a-col :xl="14" :lg="14" :xs="24">
            <sdCards title="Demographic Details">
              <template #button>
                <sdButton v-if="!editing" type="primary" size="small" @click="editing = true">
                  <edit-outlined /> Edit
                </sdButton>
                <div v-else style="display:flex; gap:8px;">
                  <sdButton type="success" size="small" :loading="saving" @click="handleSave">Save</sdButton>
                  <sdButton size="small" @click="editing = false">Cancel</sdButton>
                </div>
              </template>

              <a-form layout="vertical" :model="form">
                <a-row :gutter="16">
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Sub-County">
                      <a-select v-model:value="form.sub_county_id" :disabled="!editing" placeholder="Select sub-county" show-search style="width:100%;">
                        <a-select-option v-for="sc in subCounties" :key="sc.id" :value="sc.id">{{ sc.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Total Population">
                      <a-input-number v-model:value="form.total_population" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Total Households">
                      <a-input-number v-model:value="form.total_households" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Households with Children &lt;5">
                      <a-input-number v-model:value="form.hh_children_under5" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Pregnant Women">
                      <a-input-number v-model:value="form.pregnant_women" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="Estimated LLIN Needs">
                      <a-input-number v-model:value="form.llin_needs" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="No. of Health Workers">
                      <a-input-number v-model:value="form.health_workers" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="12" :xs="24">
                    <a-form-item label="No. of CHPs">
                      <a-input-number v-model:value="form.chps" :disabled="!editing" :min="0" style="width:100%;" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </sdCards>
          </a-col>

          <!-- Computed Parameters -->
          <a-col :xl="10" :lg="10" :xs="24">
            <sdCards title="Computed Parameters">
              <template #button>
                <a-tooltip title="Auto-calculated from demographic data"><a-tag color="blue">Auto</a-tag></a-tooltip>
              </template>
              <div class="computed-grid">
                <div class="computed-row">
                  <span class="label">🦟 LLINs Required</span>
                  <span class="value" style="color:#5F63F2;">{{ computed_params.llins_required.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">📦 Bales (×50)</span>
                  <span class="value">{{ computed_params.bales.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">🏫 HW Sessions</span>
                  <span class="value">{{ computed_params.hw_sessions.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">👨‍⚕️ CHP Sessions</span>
                  <span class="value">{{ computed_params.chp_sessions.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">🗣️ Community Sessions</span>
                  <span class="value">{{ computed_params.community_sessions.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">📅 Distribution Days</span>
                  <span class="value">{{ computed_params.distribution_days.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">👤 Supervisors</span>
                  <span class="value">{{ computed_params.supervisors.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">🚗 Vehicles</span>
                  <span class="value">{{ computed_params.vehicles.toLocaleString() }}</span>
                </div>
                <div class="computed-row">
                  <span class="label">📝 Verification Teams</span>
                  <span class="value">{{ computed_params.verification_teams.toLocaleString() }}</span>
                </div>
              </div>
            </sdCards>

            <!-- Status Card -->
            <sdCards headless>
              <div style="display:flex; align-items:center; gap:16px; padding:4px 0;">
                <div style="font-size:36px;">{{ profileSaved ? '✅' : '🟡' }}</div>
                <div>
                  <div style="font-size:15px; font-weight:700; color:#272B41;">{{ profileSaved ? 'Profile Saved' : 'Unsaved Changes' }}</div>
                  <div style="font-size:12px; color:#9299b8; margin-top:2px;" v-if="profileSaved">Last updated: {{ lastUpdated }}</div>
                  <div style="font-size:12px; color:#FA8B0C; margin-top:2px;" v-else>Click Save to persist your data</div>
                </div>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { notification } from 'ant-design-vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

export default {
  name: 'SubCountyProfile',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, EditOutlined },
  setup() {
    const editing = ref(false);
    const saving = ref(false);
    const profileSaved = ref(true);
    const lastUpdated = ref('20 Apr 2026, 10:45 AM');

    const subCounties = ref([
      { id: 1, name: 'Kilifi North' }, { id: 2, name: 'Kilifi South' },
      { id: 3, name: 'Kwale' }, { id: 4, name: 'Kinango' },
      { id: 5, name: 'Mvita' }, { id: 6, name: 'Likoni' },
    ]);

    const form = reactive({
      sub_county_id: 1,
      total_population: 87500,
      total_households: 18200,
      hh_children_under5: 4300,
      pregnant_women: 1850,
      llin_needs: 22500,
      health_workers: 48,
      chps: 240,
    });

    const computed_params = computed(() => {
      const llins_required = Math.ceil(form.total_households * 1.8);
      const bales = Math.ceil(llins_required / 50);
      const hw_sessions = Math.ceil(form.health_workers / 25);
      const chp_sessions = Math.ceil(form.chps / 30);
      const community_sessions = Math.ceil(form.total_households / 500);
      const distribution_days = Math.ceil(form.total_households / 1200);
      const supervisors = Math.ceil(form.health_workers / 8);
      const vehicles = Math.ceil(supervisors / 4);
      const verification_teams = Math.ceil(form.total_households / 2000);
      return { llins_required, bales, hw_sessions, chp_sessions, community_sessions, distribution_days, supervisors, vehicles, verification_teams };
    });

    const handleSave = () => {
      saving.value = true;
      setTimeout(() => {
        saving.value = false;
        editing.value = false;
        profileSaved.value = true;
        lastUpdated.value = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
        notification.success({ message: 'Sub-county profile saved.' });
      }, 700);
    };

    return { editing, saving, profileSaved, lastUpdated, subCounties, form, computed_params, handleSave };
  },
};
</script>
