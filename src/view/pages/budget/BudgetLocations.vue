<template>
  <RecordViewWrapper>
    <sdPageHeader title="Implementation Locations" />
    <Main>
      <a-row :gutter="15">
        <a-col :xs="24">
          <sdCards headless>
            <a-tabs v-model:activeKey="activeTab">
              <!-- New Location Tab -->
              <a-tab-pane key="new" tab="Add New Location">
                <a-row justify="center">
                  <a-col :xl="14" :md="18" :xs="24">
                    <div style="margin-bottom:24px;">
                      <a-steps :current="step" size="small" style="margin-bottom:28px;">
                        <a-step title="County" />
                        <a-step title="Sub-County" />
                        <a-step title="Implementation Area" />
                        <a-step title="Confirm" />
                      </a-steps>

                      <!-- Step 0: County -->
                      <div v-if="step === 0">
                        <p class="section-hint">Select the county for this implementation location.</p>
                        <a-form layout="vertical">
                          <a-form-item label="County" required>
                            <a-select v-model:value="wizardForm.county_id" placeholder="Select county" show-search style="width:100%;">
                              <a-select-option v-for="c in counties" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-form>
                      </div>

                      <!-- Step 1: Sub-County -->
                      <div v-if="step === 1">
                        <p class="section-hint">Select the sub-county under <strong>{{ selectedCountyName }}</strong>.</p>
                        <a-form layout="vertical">
                          <a-form-item label="Sub-County" required>
                            <a-select v-model:value="wizardForm.sub_county_id" placeholder="Select sub-county" show-search style="width:100%;">
                              <a-select-option v-for="sc in filteredSubCounties" :key="sc.id" :value="sc.id">{{ sc.name }}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-form>
                      </div>

                      <!-- Step 2: Implementation Area -->
                      <div v-if="step === 2">
                        <p class="section-hint">Enter the implementation area details under <strong>{{ selectedSubCountyName }}</strong>.</p>
                        <a-form layout="vertical">
                          <a-form-item label="Area Name" required>
                            <a-input v-model:value="wizardForm.area_name" placeholder="e.g. Kisauni Ward" />
                          </a-form-item>
                          <a-form-item label="Area Type">
                            <a-select v-model:value="wizardForm.area_type" style="width:100%;">
                              <a-select-option value="ward">Ward</a-select-option>
                              <a-select-option value="village">Village</a-select-option>
                              <a-select-option value="zone">Zone</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item label="Estimated Population">
                            <a-input-number v-model:value="wizardForm.population" :min="0" style="width:100%;" />
                          </a-form-item>
                          <a-form-item label="Estimated Households">
                            <a-input-number v-model:value="wizardForm.households" :min="0" style="width:100%;" />
                          </a-form-item>
                        </a-form>
                      </div>

                      <!-- Step 3: Confirm -->
                      <div v-if="step === 3">
                        <a-descriptions title="Review Details" :column="1" bordered>
                          <a-descriptions-item label="County">{{ selectedCountyName }}</a-descriptions-item>
                          <a-descriptions-item label="Sub-County">{{ selectedSubCountyName }}</a-descriptions-item>
                          <a-descriptions-item label="Area Name">{{ wizardForm.area_name }}</a-descriptions-item>
                          <a-descriptions-item label="Area Type">{{ wizardForm.area_type }}</a-descriptions-item>
                          <a-descriptions-item label="Population">{{ (wizardForm.population || 0).toLocaleString() }}</a-descriptions-item>
                          <a-descriptions-item label="Households">{{ (wizardForm.households || 0).toLocaleString() }}</a-descriptions-item>
                        </a-descriptions>
                      </div>

                      <!-- Navigation -->
                      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:24px;">
                        <sdButton v-if="step > 0" @click="step--">Back</sdButton>
                        <sdButton v-if="step < 3" type="primary" @click="nextStep">Next</sdButton>
                        <sdButton v-if="step === 3" type="success" :loading="saving" @click="handleSubmit">Save Location</sdButton>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-tab-pane>

              <!-- List Tab -->
              <a-tab-pane key="list" tab="Location List">
                <div style="margin-bottom:14px; display:flex; gap:10px; flex-wrap:wrap;">
                  <a-input v-model:value="searchText" placeholder="Search locations..." style="width:240px; border-radius:6px;" />
                  <a-select v-model:value="filterCounty" placeholder="Filter by county" allow-clear style="width:180px;">
                    <a-select-option v-for="c in counties" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
                  </a-select>
                </div>
                <TableWrapper class="table-data-view table-responsive">
                  <a-table :dataSource="filteredLocations" :columns="columns" :pagination="{pageSize:10}" row-key="id" />
                </TableWrapper>
              </a-tab-pane>
            </a-tabs>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { notification } from 'ant-design-vue';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper } from './style';

const countiesData = [
  { id: 1, name: 'Kilifi' }, { id: 2, name: 'Kwale' }, { id: 3, name: 'Mombasa' },
  { id: 4, name: 'Taita Taveta' }, { id: 5, name: 'Lamu' },
];

const subCountiesData = [
  { id: 1, name: 'Kilifi North', county_id: 1 }, { id: 2, name: 'Kilifi South', county_id: 1 },
  { id: 3, name: 'Kwale', county_id: 2 }, { id: 4, name: 'Kinango', county_id: 2 },
  { id: 5, name: 'Mvita', county_id: 3 }, { id: 6, name: 'Likoni', county_id: 3 },
  { id: 7, name: 'Voi', county_id: 4 }, { id: 8, name: 'Lamu East', county_id: 5 },
];

const locationsData = [
  { id: 1, area_name: 'Kilifi Town Ward', area_type: 'ward', county: 'Kilifi', sub_county: 'Kilifi North', population: 12500, households: 2800 },
  { id: 2, area_name: 'Chasimba Zone', area_type: 'zone', county: 'Kilifi', sub_county: 'Kilifi South', population: 8900, households: 1960 },
  { id: 3, area_name: 'Kwale Town', area_type: 'ward', county: 'Kwale', sub_county: 'Kwale', population: 11200, households: 2450 },
  { id: 4, area_name: 'Shimba Hills Village', area_type: 'village', county: 'Kwale', sub_county: 'Kinango', population: 4500, households: 980 },
  { id: 5, area_name: 'Old Town Ward', area_type: 'ward', county: 'Mombasa', sub_county: 'Mvita', population: 21000, households: 5100 },
];

export default {
  name: 'BudgetLocations',
  components: { Main, TableWrapper, RecordViewWrapper },
  setup() {
    const activeTab = ref('list');
    const step = ref(0);
    const saving = ref(false);
    const searchText = ref('');
    const filterCounty = ref(null);
    const locations = ref([...locationsData]);

    const wizardForm = reactive({
      county_id: null, sub_county_id: null, area_name: '', area_type: 'ward', population: 0, households: 0,
    });

    const counties = ref(countiesData);
    const subCounties = ref(subCountiesData);

    const filteredSubCounties = computed(() =>
      subCounties.value.filter(sc => sc.county_id === wizardForm.county_id)
    );

    const selectedCountyName = computed(() =>
      counties.value.find(c => c.id === wizardForm.county_id)?.name || ''
    );

    const selectedSubCountyName = computed(() =>
      subCounties.value.find(sc => sc.id === wizardForm.sub_county_id)?.name || ''
    );

    const filteredLocations = computed(() => {
      return locations.value.filter(l => {
        const matchSearch = !searchText.value ||
          l.area_name.toLowerCase().includes(searchText.value.toLowerCase()) ||
          l.sub_county.toLowerCase().includes(searchText.value.toLowerCase());
        const matchCounty = !filterCounty.value ||
          counties.value.find(c => c.id === filterCounty.value)?.name === l.county;
        return matchSearch && matchCounty;
      });
    });

    const nextStep = () => {
      if (step.value === 0 && !wizardForm.county_id) {
        notification.warning({ message: 'Please select a county.' }); return;
      }
      if (step.value === 1 && !wizardForm.sub_county_id) {
        notification.warning({ message: 'Please select a sub-county.' }); return;
      }
      if (step.value === 2 && !wizardForm.area_name) {
        notification.warning({ message: 'Please enter the area name.' }); return;
      }
      step.value++;
    };

    const handleSubmit = () => {
      saving.value = true;
      setTimeout(() => {
        locations.value.push({
          id: Date.now(),
          area_name: wizardForm.area_name,
          area_type: wizardForm.area_type,
          county: selectedCountyName.value,
          sub_county: selectedSubCountyName.value,
          population: wizardForm.population,
          households: wizardForm.households,
        });
        saving.value = false;
        step.value = 0;
        Object.assign(wizardForm, { county_id: null, sub_county_id: null, area_name: '', area_type: 'ward', population: 0, households: 0 });
        activeTab.value = 'list';
        notification.success({ message: 'Location saved successfully.' });
      }, 700);
    };

    const columns = [
      { title: 'Area Name', dataIndex: 'area_name', key: 'area_name' },
      { title: 'Type', dataIndex: 'area_type', key: 'area_type' },
      { title: 'County', dataIndex: 'county', key: 'county' },
      { title: 'Sub-County', dataIndex: 'sub_county', key: 'sub_county' },
      { title: 'Population', dataIndex: 'population', key: 'population' },
      { title: 'Households', dataIndex: 'households', key: 'households' },
    ];

    return {
      activeTab, step, saving, searchText, filterCounty,
      locations, wizardForm, counties, subCounties,
      filteredSubCounties, selectedCountyName, selectedSubCountyName,
      filteredLocations, nextStep, handleSubmit, columns,
    };
  },
};
</script>

<style scoped>
.section-hint { color: #5a5f7d; margin-bottom: 16px; }
</style>
