<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">✦</span> Special Area Costs
            </h3>
            <p class="ph-subtitle">
              Map special-cost templates to counties, sub-counties, and activities. Officers see a special-cost
              template only when it is mapped to BOTH their area AND the activity they are budgeting.
            </p>
          </div>
        </div>

        <sdCards headless class="bp-table-shell sac-shell">
          <a-tabs v-model:activeKey="activeTab" class="bp-tabs sac-tabs">
            <a-tab-pane key="catalogue" tab="Catalogue" />
            <a-tab-pane key="county" tab="County Mapping" />
            <a-tab-pane key="sub_county" tab="Sub-County Mapping" />
            <a-tab-pane key="activity" tab="Activity Mapping" />
          </a-tabs>

          <!-- ============================== CATALOGUE ============================== -->
          <div v-if="activeTab === 'catalogue'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> Special-cost categories</h4>
              </div>
              <div class="sac-actions-row">
                <sdButton :disabled="loading" @click="fetchCatalogue">Refresh</sdButton>
              </div>
            </sdCards>

            <a-collapse
              v-model:activeKey="openCategoryKeys"
              class="sac-cat-list"
              expand-icon-position="left"
            >
              <a-collapse-panel
                v-for="cat in categories"
                :key="cat.id"
                class="sac-cat-panel"
              >
                <template #header>
                  <span class="sac-cat-title">
                    <strong>{{ cat.name }}</strong>
                    <a-tag class="sac-pill">{{ cat.items.length }} item{{ cat.items.length === 1 ? '' : 's' }}</a-tag>
                  </span>
                  <span v-if="cat.description" class="sac-cat-desc">{{ cat.description }}</span>
                </template>

                <!-- existing items -->
                <div class="sac-items-grid sac-items-header">
                  <div>Special cost</div>
                  <div>Budget parameter</div>
                  <div class="num">Default units</div>
                  <div class="num">Days</div>
                  <div class="num">Unit cost (KES)</div>
                  <!-- <div class="num">Sort</div> -->
                  <div></div>
                </div>
                <div v-if="!cat.items.length" class="sac-expand-empty">
                  No templates yet — use the form below to add one.
                </div>
                <div
                  v-for="item in cat.items"
                  :key="item.id"
                  class="sac-items-grid sac-item-row"
                >
                  <div class="sac-item-text">
                    <a-input
                      v-model:value="item.label"
                      :placeholder="item.parameter_label || 'Special cost label'"
                      @blur="saveItem(item)"
                    />
                    <span class="sac-item-meta">
                      <a-switch
                        size="small"
                        v-model:checked="item.is_active"
                        @change="saveItem(item)"
                      />
                      <span class="sac-meta-label">{{ item.is_active ? 'Active' : 'Inactive' }}</span>
                    </span>
                  </div>
                  <div class="sac-item-param">
                    <a-tag class="bp-key-tag">{{ item.parameter_key || '—' }}</a-tag>
                    <span class="sac-meta-label">{{ item.unit_definition || '—' }}</span>
                  </div>
                  <div class="num">
                    <a-input-number
                      v-model:value="item.default_units"
                      :min="1"
                      @blur="saveItem(item)"
                    />
                  </div>
                  <div class="num">
                    <a-input-number
                      v-model:value="item.default_days"
                      :min="1"
                      @blur="saveItem(item)"
                    />
                  </div>
                  <div class="num sac-money-cell">
                    <strong>{{ formatMoney(item.unit_cost) }}</strong>
                  </div>
                  <div>
                    <a-button
                      type="text"
                      danger
                      size="small"
                      :loading="item._deleting"
                      @click="removeItem(cat, item)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </div>
                </div>

                <!-- add new item -->
                <div class="sac-add-item">
                  <div class="sac-add-item-title">Add a special cost to this category</div>
                  <a-row :gutter="12">
                    <a-col :xs="24" :md="10">
                      <label class="sac-field-label">Budget parameter</label>
                      <a-select
                        v-model:value="cat._draft.parameter_id"
                        placeholder="Select linked budget parameter"
                        :options="parameterOptions"
                        :loading="parametersLoading"
                        show-search
                        :filter-option="filterParamOption"
                        style="width: 100%"
                      />
                    </a-col>
                    <a-col :xs="24" :md="14">
                      <label class="sac-field-label">Special cost label (optional, overrides parameter label)</label>
                      <a-input
                        v-model:value="cat._draft.label"
                        :placeholder="`e.g. ${cat.example_label}`"
                      />
                    </a-col>
                  </a-row>
                  <a-row :gutter="12" style="margin-top: 8px">
                    <a-col :xs="12" :md="4">
                      <label class="sac-field-label">Default units</label>
                      <a-input-number
                        v-model:value="cat._draft.default_units"
                        :min="1"
                        style="width: 100%"
                      />
                    </a-col>
                    <a-col :xs="12" :md="4">
                      <label class="sac-field-label">Days</label>
                      <a-input-number
                        v-model:value="cat._draft.default_days"
                        :min="1"
                        style="width: 100%"
                      />
                    </a-col>
                    <a-col :xs="12" :md="4">
                      <label class="sac-field-label">Sort order</label>
                      <a-input-number
                        v-model:value="cat._draft.sort_order"
                        :min="0"
                        style="width: 100%"
                      />
                    </a-col>
                    <a-col :xs="24" :md="12" class="sac-add-action">
                      <sdButton
                        type="dark"
                        block
                        :disabled="!cat._draft.parameter_id"
                        :loading="cat._adding"
                        @click="addItem(cat)"
                      >
                        + Add template
                      </sdButton>
                    </a-col>
                  </a-row>
                </div>
              </a-collapse-panel>
            </a-collapse>

            <a-spin v-if="loading" class="sac-loading" />
          </div>

          <!-- ============================== COUNTY MAPPING ============================== -->
          <div v-else-if="activeTab === 'county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head sac-flags-head">
                <div>
                  <h4>Map templates to counties</h4>
                </div>
                <div class="sac-flags-actions">
                  <a-input
                    v-model:value="countyFilters.search"
                    placeholder="Search county…"
                    allow-clear
                    style="width: 220px"
                  />
                  <sdButton :disabled="flagsLoading" @click="fetchFlags">Refresh</sdButton>
                </div>
              </div>

              <a-spin v-if="flagsLoading || loading" class="sac-loading" />
              <div v-else-if="!templateColumns.length" class="sac-empty-state">
                <div class="sac-empty-illustration">📋</div>
                <h4>No templates in the catalogue yet</h4>
                <p>Add special-cost templates in the <strong>Catalogue</strong> tab to start mapping them to counties.</p>
              </div>
              <div v-else class="sac-table-scroll">
                <table class="sac-mapping-table sac-matrix-table">
                  <thead>
                    <tr>
                      <th class="sac-th-name">County</th>
                      <th
                        v-for="col in templateColumns"
                        :key="col.id"
                        class="sac-th-template"
                      >
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="county in filteredCountyRows" :key="county.id">
                      <td class="sac-td-name">{{ county.name }}</td>
                      <td
                        v-for="col in templateColumns"
                        :key="col.id"
                        class="sac-td-check"
                      >
                        <a-checkbox
                          :checked="hasCountyFlag(county.id, col.special_type)"
                          :disabled="isCellBusy(`c:${county.id}:${col.special_type}`)"
                          @change="toggleCountyFlag(county, col, $event)"
                        />
                      </td>
                    </tr>
                    <tr v-if="!filteredCountyRows.length">
                      <td :colspan="templateColumns.length + 1" class="sac-empty-row">
                        No counties match your search.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </sdCards>
          </div>

          <!-- ============================== SUB-COUNTY MAPPING ============================== -->
          <div v-else-if="activeTab === 'sub_county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head sac-flags-head">
                <div>
                  <h4><span class="sac-ico">📍</span> Map templates to sub-counties</h4>
                </div>
                <div class="sac-flags-actions">
                  <a-input
                    v-model:value="subCountyFilters.search"
                    placeholder="Search sub-county or county…"
                    allow-clear
                    style="width: 240px"
                  />
                  <a-select
                    v-model:value="subCountyFilters.county_id"
                    placeholder="All counties"
                    allow-clear
                    style="width: 200px"
                    :options="counties.map(c => ({ value: c.id, label: c.name }))"
                  />
                  <sdButton :disabled="flagsLoading" @click="fetchFlags">Refresh</sdButton>
                </div>
              </div>

              <a-spin v-if="flagsLoading || loading" class="sac-loading" />
              <div v-else-if="!templateColumns.length" class="sac-empty-state">
                <div class="sac-empty-illustration">📋</div>
                <h4>No templates in the catalogue yet</h4>
                <p>Add special-cost templates in the <strong>Catalogue</strong> tab to start mapping them to sub-counties.</p>
              </div>
              <div v-else class="sac-table-scroll">
                <table class="sac-mapping-table sac-matrix-table">
                  <thead>
                    <tr>
                      <th class="sac-th-name">Sub-County</th>
                      <th class="sac-th-name">County</th>
                      <th
                        v-for="col in templateColumns"
                        :key="col.id"
                        class="sac-th-template"
                      >
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sc in filteredSubCountyRows" :key="sc.id">
                      <td class="sac-td-name">{{ sc.name }}</td>
                      <td class="sac-td-county">{{ sc.county_name }}</td>
                      <td
                        v-for="col in templateColumns"
                        :key="col.id"
                        class="sac-td-check"
                      >
                        <a-checkbox
                          :checked="hasSubCountyFlag(sc.id, col.special_type)"
                          :disabled="isCellBusy(`sc:${sc.id}:${col.special_type}`)"
                          @change="toggleSubCountyFlag(sc, col, $event)"
                        />
                      </td>
                    </tr>
                    <tr v-if="!filteredSubCountyRows.length">
                      <td :colspan="templateColumns.length + 2" class="sac-empty-row">
                        No sub-counties match your search.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </sdCards>
          </div>

          <!-- ============================== ACTIVITY MAPPING ============================== -->
          <div v-else-if="activeTab === 'activity'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4><span class="sac-ico">⇄</span> Map special-cost templates to activities</h4>
                <p class="sac-section-sub">
                  Tick the templates that are applicable to each activity. Officers will only see a template
                  under an activity if it is also mapped to their county / sub-county.
                </p>
              </div>
              <div class="sac-table-scroll">
                <table class="sac-mapping-table">
                  <thead>
                    <tr>
                      <th class="sac-th-name">Activity</th>
                      <th v-for="cat in categories" :key="cat.id">{{ cat.name }}</th>
                    </tr>
                  </thead>
                  <tbody v-for="grp in activityGroups" :key="grp.scope">
                    <tr class="sac-group-row">
                      <td :colspan="categories.length + 1">
                        {{ grp.label }} ({{ grp.items.length }})
                      </td>
                    </tr>
                    <tr v-for="(act, idx) in grp.items" :key="act.id">
                      <td class="sac-td-name">{{ idx + 1 }}. {{ act.name }}</td>
                      <td v-for="cat in categories" :key="cat.id" class="sac-td-check">
                        <a-checkbox
                          :checked="isMapped(activityMap, act.id, cat.id)"
                          @change="toggleMap(activityMap, act.id, cat.id, $event)"
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-if="!activities.length">
                    <tr>
                      <td :colspan="categories.length + 1" class="sac-empty-row">No activities available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </sdCards>
          </div>
        </sdCards>
      </BudgetPageWrapper>
    </Main>

    <!-- Add / Edit flag modal -->
    <a-modal
      v-model:visible="flagModal.visible"
      :title="flagModalTitle"
      :confirm-loading="flagModal.saving"
      :ok-text="flagModal.id ? 'Save changes' : 'Create flag'"
      :ok-button-props="{ disabled: !flagModalValid }"
      @ok="submitFlagModal"
      @cancel="closeFlagModal"
      width="560px"
    >
      <div class="sac-modal-body">
        <div class="sac-field">
          <label>County <span class="sac-req">*</span></label>
          <a-select
            v-model:value="flagModal.county_id"
            placeholder="Select county"
            show-search
            :filter-option="filterParamOption"
            :options="counties.map(c => ({ value: c.id, label: c.name }))"
            style="width: 100%"
            :disabled="!!flagModal.id"
          />
        </div>

        <div v-if="flagModal.scope === 'sub_county'" class="sac-field">
          <label>Sub-County <span class="sac-req">*</span></label>
          <a-select
            v-model:value="flagModal.sub_county_id"
            placeholder="Select sub-county"
            show-search
            :filter-option="filterParamOption"
            :options="modalSubCountyOptions"
            style="width: 100%"
            :disabled="!!flagModal.id || !flagModal.county_id"
          />
          <span v-if="!flagModal.county_id" class="sac-help">Pick a county first.</span>
        </div>

        <div class="sac-field">
          <label>Special-cost type <span class="sac-req">*</span></label>
          <a-radio-group v-model:value="flagModal.special_type" class="sac-type-radio">
            <a-radio-button
              v-for="t in SPECIAL_TYPES"
              :key="t.id"
              :value="t.id"
              :disabled="!!flagModal.id"
            >
              {{ t.name }}
            </a-radio-button>
          </a-radio-group>
        </div>

        <div class="sac-field">
          <label>Notes</label>
          <a-textarea
            v-model:value="flagModal.notes"
            placeholder="e.g. Offshore island — ferry required for all distribution posts"
            :rows="3"
            :maxlength="500"
            show-count
          />
        </div>

        <div class="sac-field sac-active-field">
          <a-switch v-model:checked="flagModal.is_active" />
          <span>{{ flagModal.is_active ? 'Active — visible to officers' : 'Inactive — hidden from officers' }}</span>
        </div>
      </div>
    </a-modal>
  </RecordViewWrapper>
</template>

<script>
/* eslint-disable no-empty */
import { ref, reactive, computed, onMounted } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

// Friendly labels / descriptions for known special_type values.
// Anything not in this map will fall back to a humanized version of the key
// (e.g. "boat_hire" → "Boat Hire").
const TYPE_META = {
  boat_hire:          { name: 'Boat Hire',                   description: 'Templates for boat hire used to access islands and water-bound posts.', example_label: 'Boat hire — island transport to posts' },
  enhanced_transport: { name: 'Enhanced Transport',          description: 'Top-up transport for hard-to-reach posts and last-mile travel.',         example_label: 'Enhanced transport — hard-to-reach areas' },
  security:           { name: 'Security',                    description: 'Lunch, fuel and other costs for security personnel accompanying teams.', example_label: 'Lunch allowance — security personnel' },
  dsa:                { name: 'Daily Subsistence Allowance', description: 'Daily subsistence allowance for special-area deployments.',              example_label: 'DSA — special area deployment' },
};

const humanizeTypeKey = (id) =>
  String(id || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const buildTypeDef = (id) => {
  const meta = TYPE_META[id] || {};
  return {
    id,
    name: meta.name || humanizeTypeKey(id),
    description: meta.description || '',
    example_label: meta.example_label || '',
  };
};

const SEED_COUNTIES = [
  'Baringo','Bungoma','Busia','Homa Bay','Kakamega','Kericho','Kilifi','Kisii','Kisumu',
  'Kwale','Migori','Nandi','Siaya','Trans Nzoia','Turkana','Vihiga','West Pokot',
];

const SEED_SUB_COUNTIES = [
  ['Aldai','Nandi'],['Alego Usonga','Siaya'],['Awendo','Migori'],['Bonchari','Kisii'],
  ['Bondo','Siaya'],['Bumula','Bungoma'],['Bunyala','Busia'],['Butere','Kakamega'],
  ['Butula','Busia'],['Cheptais','Bungoma'],['Emuhaya','Vihiga'],['Gem','Siaya'],
  ['Hamisi','Vihiga'],['Homa Bay Town','Homa Bay'],['Ikolomani','Kakamega'],
  ['Kabondo Kasipul','Homa Bay'],['Kabuchai','Bungoma'],['Kacheliba','West Pokot'],
];

const SEED_ACTIVITIES = {
  sub_county: [
    'Stakeholders meeting for Senistization',
    'Data Bundles for Officers Stage 1',
    'Trainings of Health workers',
    'Mobilization of Villages Elders and CHPs by Chiefs asst chiefs and health workers',
    'Trainings of Village Elders and CHPs',
    'Health Workers participating in CHP and Village Elder Training',
    'Supervision of Village Elder and CHP training',
    'CHA and CHP Household Data validation',
    'CHA and NGAO Data validation',
    'SC and NGAO Data validation',
    'Household Data Report writing',
    'Interpersonal Social Mobilisation- Chief Barazas',
    'Social Mobilisation by Health Workers',
    'Data Bundles for Officers Stage 3',
    'Distribution of LLIN at posts',
    'Supervision for Distribution - Sub- Location',
    'Supervision of Distribution location level',
    'Supervision of Distribution sub-county level',
    'Post Distribution review meeting',
    'Sub County Reporting',
    'Data Bundles for Officers Stage 5',
  ],
  county: [
    'County Coordination Meeting',
    'County Training of Trainers',
    'County Supervision of Distribution',
    'County Post Distribution Review',
  ],
};

export default {
  name: 'SpecialAreaCosts',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, DeleteOutlined },
  setup() {
    const activeTab = ref('catalogue');
    const loading = ref(false);

    const buildEmptyDraft = () => ({
      parameter_id: null,
      label: '',
      default_units: 1,
      default_days: 1,
      sort_order: 0,
    });

    const buildCategory = (def) => ({
      ...def,
      items: [],
      _draft: buildEmptyDraft(),
      _adding: false,
    });

    // Populated dynamically from `get_special_cost_parameters` — keeps
    // categories/columns in sync with whatever the backend defines.
    const SPECIAL_TYPES = ref([]);
    const categories = ref([]);
    const openCategoryKeys = ref([]);
    // Flat list of every template returned by `get_special_cost_parameters`.
    // The County/Sub-County mapping matrices use this directly so their
    // column headers always reflect the live API response.
    const templates = ref([]);

    const parameterOptions = ref([]);
    const parametersLoading = ref(false);
    const filterParamOption = (input, option) =>
      String(option.label || '').toLowerCase().includes(String(input).toLowerCase());

    const counties = ref([]);
    const subCounties = ref([]);
    const activities = ref([]);

    // ----- Special county/sub-county flags (rich model with notes) -----
    const flags = ref([]);
    const flagsLoading = ref(false);

    const countyFilters = reactive({ search: '', county_id: null, special_type: null, status: null });
    const subCountyFilters = reactive({ search: '', county_id: null, sub_county_id: null, special_type: null, status: null });
    const openSubCountyKeys = ref([]);

    const flagModal = reactive({
      visible: false,
      saving: false,
      id: null,
      scope: 'county',
      county_id: null,
      sub_county_id: null,
      special_type: null,
      notes: '',
      is_active: true,
    });

    // Activity mapping (still uses the simple grid)
    const activityMap = reactive({});

    const activityGroups = computed(() => {
      const groups = {};
      activities.value.forEach(a => {
        const k = a.scope || 'sub_county';
        if (!groups[k]) groups[k] = [];
        groups[k].push(a);
      });
      return Object.entries(groups).map(([scope, items]) => ({
        scope,
        label: scope === 'sub_county' ? 'SUB-COUNTY ACTIVITIES' : 'COUNTY ACTIVITIES',
        items,
      }));
    });

    const formatMoney = (val) => {
      const n = Number(val || 0);
      return `KES ${n.toLocaleString()}`;
    };

    const normalizeItem = (raw) => ({
      id: raw.id,
      special_type: raw.special_type,
      parameter_id: raw.parameter_id,
      parameter_key: raw.parameter_key || '',
      parameter_label: raw.parameter_label || '',
      unit_definition: raw.unit_definition || '',
      unit_cost: Number(raw.unit_cost || 0),
      label: raw.label || raw.effective_label || '',
      effective_label: raw.effective_label || raw.label || '',
      default_days: Number(raw.default_days ?? 1),
      default_units: Number(raw.default_units ?? 1),
      sort_order: Number(raw.sort_order ?? 0),
      is_active: Boolean(raw.is_active),
      _deleting: false,
    });

    const fetchCatalogue = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_special_cost_parameters');
        const rows = Array.isArray(data?.data) ? data.data
          : Array.isArray(data?.message) ? data.message
          : Array.isArray(data) ? data : [];

        const items = rows.map(normalizeItem);
        templates.value = items;

        // Derive the unique set of special_types from the catalogue itself.
        // Order: by lowest sort_order seen for the type, then by name.
        const order = new Map();
        items.forEach(it => {
          if (!it.special_type) return;
          const existing = order.get(it.special_type);
          const so = Number.isFinite(it.sort_order) ? it.sort_order : 9999;
          if (existing === undefined || so < existing) order.set(it.special_type, so);
        });

        // Preserve any existing categories' draft state where possible.
        const previous = new Map(categories.value.map(c => [c.id, c]));
        const typeIds = Array.from(order.keys()).sort((a, b) => {
          const da = order.get(a) ?? 9999;
          const db = order.get(b) ?? 9999;
          if (da !== db) return da - db;
          return buildTypeDef(a).name.localeCompare(buildTypeDef(b).name);
        });

        SPECIAL_TYPES.value = typeIds.map(buildTypeDef);
        categories.value = SPECIAL_TYPES.value.map(def => {
          const prev = previous.get(def.id);
          const cat = prev || buildCategory(def);
          // Refresh metadata from the latest type def
          cat.name = def.name;
          cat.description = def.description;
          cat.example_label = def.example_label;
          cat.items = [];
          return cat;
        });

        items.forEach(item => {
          const cat = categories.value.find(c => c.id === item.special_type);
          if (cat) cat.items.push(item);
        });
        categories.value.forEach(c => {
          c.items.sort((a, b) => (a.sort_order - b.sort_order) || a.id - b.id);
        });

        if (!openCategoryKeys.value.length && categories.value.length) {
          openCategoryKeys.value = [categories.value[0].id];
        }
      } catch (err) {
        notification.error({
          message: 'Unable to load special cost parameters',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        loading.value = false;
      }
    };

    const fetchBudgetParameters = async () => {
      parametersLoading.value = true;
      try {
        const { data } = await axios.get('get_budget_parameters');
        const rows = Array.isArray(data?.data) ? data.data
          : Array.isArray(data?.message) ? data.message
          : Array.isArray(data) ? data : [];
        parameterOptions.value = rows
          .filter(r => r && r.id)
          .map(r => ({
            value: r.id,
            label: `${r.label || r.key} — KES ${Number(r.unit_cost || 0).toLocaleString()} (${r.unit_definition || '—'})`,
            raw: r,
          }));
      } catch (err) {
        parameterOptions.value = [];
      } finally {
        parametersLoading.value = false;
      }
    };

    const fetchCounties = async () => {
      try {
        const { data } = await axios.get('get_counties');
        const rows = Array.isArray(data) ? data
          : Array.isArray(data?.data) ? data.data
          : Array.isArray(data?.message) ? data.message : [];
        if (rows.length) {
          counties.value = rows
            .map(r => ({
              id: r.id ?? r.org_id ?? r.uuid ?? r.name,
              org_id: r.org_id || null,
              name: r.name || r.county || r.title,
            }))
            .filter(c => c.name)
            .sort((a, b) => a.name.localeCompare(b.name));
          return;
        }
      } catch (err) {
        // fall through to seed
      }
      counties.value = SEED_COUNTIES.map((n, i) => ({ id: `c-${i + 1}`, name: n }));
    };

    const fetchSubCounties = async () => {
      try {
        const { data } = await axios.get('sub_counties_list');
        const rows = Array.isArray(data) ? data
          : Array.isArray(data?.data) ? data.data
          : Array.isArray(data?.message) ? data.message : [];
        if (rows.length) {
          subCounties.value = rows
            .map(r => ({
              id: r.id ?? r.org_id ?? r.uuid ?? r.name,
              name: r.name || r.title,
              county_id: r.county_id ?? r.parent_id ?? null,
              county_name: r.county_name || r.parent_name || '',
            }))
            .filter(s => s.name)
            .sort((a, b) => a.name.localeCompare(b.name));
          return;
        }
      } catch (err) {
        // fall through to seed
      }
      subCounties.value = SEED_SUB_COUNTIES.map(([n, c], i) => ({
        id: `sc-${i + 1}`,
        name: n,
        county_id: null,
        county_name: c,
      }));
    };

    const fetchActivities = async () => {
      try {
        const { data } = await axios.get('activity_list');
        const rows = Array.isArray(data?.data) ? data.data
          : Array.isArray(data) ? data
          : Array.isArray(data?.message) ? data.message : [];
        if (rows.length) {
          activities.value = rows.map(r => {
            const scopeRaw = (r.scope || r.level || 'sub_county').toString().toLowerCase();
            const scope = scopeRaw.includes('sub') ? 'sub_county'
              : scopeRaw.includes('county') ? 'county' : 'sub_county';
            return {
              id: r.id ?? r.activity_id ?? r.uuid ?? r.name,
              name: r.name || r.title || r.activity_name,
              scope,
            };
          });
          return;
        }
      } catch (err) {
        // fall through to seed
      }
      activities.value = [
        ...SEED_ACTIVITIES.sub_county.map((n, i) => ({ id: `act-sc-${i + 1}`, name: n, scope: 'sub_county' })),
        ...SEED_ACTIVITIES.county.map((n, i) => ({ id: `act-c-${i + 1}`, name: n, scope: 'county' })),
      ];
    };

    const fetchMappings = async () => {
      const tryLoad = async (url, target) => {
        try {
          const { data } = await axios.get(url);
          const rows = Array.isArray(data?.data) ? data.data
            : Array.isArray(data) ? data
            : Array.isArray(data?.message) ? data.message : [];
          rows.forEach(r => {
            const eid = r.entity_id ?? r.county_id ?? r.sub_county_id ?? r.activity_id;
            const cid = r.category_id ?? r.special_type ?? r.special_cost_category_id;
            if (eid != null && cid != null) target[`${eid}:${cid}`] = true;
          });
        } catch (err) {
          // mapping endpoints not yet implemented — ignore
        }
      };
      await Promise.all([
        tryLoad('special_cost_activity_mappings', activityMap),
      ]);
    };

    // ---- Special county/sub-county flags ----
    const TYPE_COLORS = {
      boat_hire: 'blue',
      enhanced_transport: 'geekblue',
      security: 'volcano',
      dsa: 'purple',
    };
    const typeColor = (id) => TYPE_COLORS[id] || 'default';
    const typeName = (id) => (SPECIAL_TYPES.value.find(t => t.id === id) || {}).name || humanizeTypeKey(id);

    const normalizeFlag = (raw) => ({
      id: raw.id,
      county_id: raw.county_id,
      sub_county_id: raw.sub_county_id ?? null,
      special_type: raw.special_type,
      notes: raw.notes || '',
      is_active: Boolean(raw.is_active),
      county_name: (raw.county && raw.county.name) || raw.county_name || '',
      sub_county_name: (raw.sub_county && raw.sub_county.name) || raw.sub_county_name || '',
      _deleting: false,
    });

    const fetchFlags = async () => {
      flagsLoading.value = true;
      try {
        const { data } = await axios.get('get_special_county_flags');
        const rows = Array.isArray(data?.data) ? data.data
          : Array.isArray(data?.message) ? data.message
          : Array.isArray(data) ? data : [];
        flags.value = rows.map(normalizeFlag);
      } catch (err) {
        flags.value = [];
        notification.error({
          message: 'Unable to load special-area flags',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        flagsLoading.value = false;
      }
    };

    const countyFlags = computed(() => flags.value.filter(f => f.sub_county_id == null));
    const subCountyFlags = computed(() => flags.value.filter(f => f.sub_county_id != null));

    const countyTypeCounts = computed(() => {
      const out = {};
      SPECIAL_TYPES.value.forEach(t => { out[t.id] = 0; });
      countyFlags.value.forEach(f => { if (f.is_active) out[f.special_type] = (out[f.special_type] || 0) + 1; });
      return out;
    });
    const subCountyTypeCounts = computed(() => {
      const out = {};
      SPECIAL_TYPES.value.forEach(t => { out[t.id] = 0; });
      subCountyFlags.value.forEach(f => { out[f.special_type] = (out[f.special_type] || 0) + 1; });
      return out;
    });

    const matchFilter = (flag, f) => {
      if (f.county_id && flag.county_id !== f.county_id) return false;
      if (f.sub_county_id && flag.sub_county_id !== f.sub_county_id) return false;
      if (f.special_type && flag.special_type !== f.special_type) return false;
      if (f.status === 'active' && !flag.is_active) return false;
      if (f.status === 'inactive' && flag.is_active) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        const hay = `${flag.county_name} ${flag.sub_county_name} ${flag.notes}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    };

    const groupByCounty = (list) => {
      const map = new Map();
      list.forEach(flag => {
        const key = flag.county_id;
        if (!map.has(key)) {
          map.set(key, {
            county_id: flag.county_id,
            county_name: flag.county_name || '—',
            flags: [],
            _subSet: new Set(),
          });
        }
        const g = map.get(key);
        g.flags.push(flag);
        if (flag.sub_county_id != null) g._subSet.add(flag.sub_county_id);
      });
      return Array.from(map.values())
        .map(g => ({ ...g, subCountyCount: g._subSet.size }))
        .sort((a, b) => a.county_name.localeCompare(b.county_name));
    };

    const filteredCountyFlagGroups = computed(() =>
      groupByCounty(countyFlags.value.filter(f => matchFilter(f, countyFilters)))
    );
    const filteredSubCountyFlagGroups = computed(() =>
      groupByCounty(subCountyFlags.value.filter(f => matchFilter(f, subCountyFilters)))
    );

    // ---- Matrix view (county × template, sub-county × template) ----
    // Source the columns directly from the live `get_special_cost_parameters`
    // response so the header always matches what the backend exposes.
    const templateColumns = computed(() => {
      return templates.value
        .filter(it => it.is_active)
        .slice()
        .sort((a, b) => (a.sort_order - b.sort_order) || a.id - b.id)
        .map(it => ({
          id: it.id,
          special_type: it.special_type,
          label: it.label || it.effective_label || it.parameter_label || humanizeTypeKey(it.special_type),
          category_name: typeName(it.special_type),
        }));
    });

    const subCountyRows = computed(() => {
      // Resolve each sub-county's parent county to its INTEGER id so the
      // create_special_county_flag payload always sends an integer county_id.
      // The API returns sub-counties with `parent_id` set to the county's
      // `org_id` (a string), so we look the county up by id OR org_id.
      const byKey = new Map();
      counties.value.forEach(c => {
        if (c.id != null) byKey.set(String(c.id), c);
        if (c.org_id) byKey.set(String(c.org_id), c);
      });
      return subCounties.value
        .map(sc => {
          const cty = byKey.get(String(sc.county_id))
            || counties.value.find(c => c.id === sc.county_id);
          return {
            id: sc.id,
            name: sc.name,
            county_id: cty?.id ?? null,
            county_name: cty?.name || sc.county_name || '—',
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    });

    const filteredCountyRows = computed(() => {
      const q = (countyFilters.search || '').trim().toLowerCase();
      let rows = counties.value.slice().sort((a, b) => a.name.localeCompare(b.name));
      if (q) rows = rows.filter(c => c.name.toLowerCase().includes(q));
      return rows;
    });

    const filteredSubCountyRows = computed(() => {
      const q = (subCountyFilters.search || '').trim().toLowerCase();
      const cid = subCountyFilters.county_id;
      let rows = subCountyRows.value;
      if (cid) rows = rows.filter(s => s.county_id === cid);
      if (q) rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.county_name || '').toLowerCase().includes(q)
      );
      return rows;
    });

    const hasCountyFlag = (county_id, special_type) =>
      flags.value.some(f =>
        f.county_id === county_id &&
        f.sub_county_id == null &&
        f.special_type === special_type &&
        f.is_active
      );

    const hasSubCountyFlag = (sub_county_id, special_type) =>
      flags.value.some(f =>
        f.sub_county_id === sub_county_id &&
        f.special_type === special_type &&
        f.is_active
      );

    const busyCells = reactive({});
    const isCellBusy = (key) => Boolean(busyCells[key]);

    const findCountyFlag = (county_id, special_type) =>
      flags.value.find(f =>
        f.county_id === county_id &&
        f.sub_county_id == null &&
        f.special_type === special_type
      );

    const findSubCountyFlag = (sub_county_id, special_type) =>
      flags.value.find(f =>
        f.sub_county_id === sub_county_id &&
        f.special_type === special_type
      );

    const createFlagRequest = async (payload) => {
      const { data } = await axios.post('create_special_county_flag', payload);
      const saved = data?.data || data?.message || data;
      if (saved && saved.id) {
        flags.value.push(normalizeFlag(saved));
      } else {
        await fetchFlags();
      }
    };

    const removeFlagRequest = async (flag) => {
      try {
        await axios.delete(`delete_special_county_flag/${flag.id}`);
        flags.value = flags.value.filter(f => f.id !== flag.id);
      } catch (err) {
        // Soft-delete fallback: deactivate
        await axios.put(`update_special_county_flag/${flag.id}`, { is_active: false });
        flags.value = flags.value.filter(f => f.id !== flag.id);
      }
    };

    const toggleCountyFlag = async (county, col, e) => {
      const checked = e?.target?.checked ?? !hasCountyFlag(county.id, col.special_type);
      const key = `c:${county.id}:${col.special_type}`;
      if (busyCells[key]) return;
      busyCells[key] = true;
      try {
        const existing = findCountyFlag(county.id, col.special_type);
        if (checked) {
          if (existing && !existing.is_active) {
            await axios.put(`update_special_county_flag/${existing.id}`, { is_active: true });
            existing.is_active = true;
          } else if (!existing) {
            await createFlagRequest({
              county_id: county.id,
              sub_county_id: null,
              special_type: col.special_type,
              notes: null,
              is_active: true,
            });
          }
        } else if (existing) {
          await removeFlagRequest(existing);
        }
      } catch (err) {
        notification.error({
          message: 'Could not update mapping',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        delete busyCells[key];
      }
    };

    const toggleSubCountyFlag = async (sc, col, e) => {
      const checked = e?.target?.checked ?? !hasSubCountyFlag(sc.id, col.special_type);
      const key = `sc:${sc.id}:${col.special_type}`;
      if (busyCells[key]) return;
      if (checked && !Number.isInteger(sc.county_id)) {
        notification.error({
          message: 'Could not update mapping',
          description: 'This sub-county is not linked to a county yet, so the flag cannot be created.',
        });
        return;
      }
      busyCells[key] = true;
      try {
        const existing = findSubCountyFlag(sc.id, col.special_type);
        if (checked) {
          if (existing && !existing.is_active) {
            await axios.put(`update_special_county_flag/${existing.id}`, { is_active: true });
            existing.is_active = true;
          } else if (!existing) {
            await createFlagRequest({
              county_id: sc.county_id,
              sub_county_id: sc.id,
              special_type: col.special_type,
              notes: null,
              is_active: true,
            });
          }
        } else if (existing) {
          await removeFlagRequest(existing);
        }
      } catch (err) {
        notification.error({
          message: 'Could not update mapping',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        delete busyCells[key];
      }
    };

    const filteredSubCountyOptions = computed(() => {
      const cid = subCountyFilters.county_id;
      const list = cid
        ? subCounties.value.filter(s => s.county_id === cid || s.parent_id === cid)
        : subCounties.value;
      return list.map(s => ({ value: s.id, label: s.name }));
    });

    const modalSubCountyOptions = computed(() => {
      const cid = flagModal.county_id;
      const list = cid
        ? subCounties.value.filter(s => s.county_id === cid || s.parent_id === cid)
        : [];
      return list.map(s => ({ value: s.id, label: s.name }));
    });

    const flagModalTitle = computed(() => {
      const action = flagModal.id ? 'Edit' : 'Add';
      const scope = flagModal.scope === 'county' ? 'county-wide flag' : 'sub-county flag';
      return `${action} ${scope}`;
    });

    const flagModalValid = computed(() => {
      if (!flagModal.county_id) return false;
      if (!flagModal.special_type) return false;
      if (flagModal.scope === 'sub_county' && !flagModal.sub_county_id) return false;
      return true;
    });

    const openFlagModal = (scope, flag = null) => {
      flagModal.visible = true;
      flagModal.saving = false;
      if (flag) {
        flagModal.id = flag.id;
        flagModal.scope = flag.sub_county_id ? 'sub_county' : 'county';
        flagModal.county_id = flag.county_id;
        flagModal.sub_county_id = flag.sub_county_id;
        flagModal.special_type = flag.special_type;
        flagModal.notes = flag.notes || '';
        flagModal.is_active = flag.is_active;
      } else {
        flagModal.id = null;
        flagModal.scope = scope;
        flagModal.county_id = scope === 'sub_county' ? subCountyFilters.county_id : countyFilters.county_id;
        flagModal.sub_county_id = null;
        flagModal.special_type = null;
        flagModal.notes = '';
        flagModal.is_active = true;
      }
    };

    const closeFlagModal = () => {
      flagModal.visible = false;
      flagModal.id = null;
    };

    const submitFlagModal = async () => {
      if (!flagModalValid.value) return;
      flagModal.saving = true;
      const payload = {
        county_id: flagModal.county_id,
        sub_county_id: flagModal.scope === 'sub_county' ? flagModal.sub_county_id : null,
        special_type: flagModal.special_type,
        notes: (flagModal.notes || '').trim() || null,
        is_active: flagModal.is_active,
      };
      try {
        if (flagModal.id) {
          const { data } = await axios.put(`update_special_county_flag/${flagModal.id}`, {
            notes: payload.notes,
            is_active: payload.is_active,
          });
          const saved = data?.data || data?.message || data;
          const idx = flags.value.findIndex(f => f.id === flagModal.id);
          if (idx >= 0 && saved && saved.id) {
            flags.value.splice(idx, 1, normalizeFlag(saved));
          } else if (idx >= 0) {
            flags.value[idx].notes = payload.notes || '';
            flags.value[idx].is_active = payload.is_active;
          }
          notification.success({ message: 'Flag updated' });
        } else {
          const { data } = await axios.post('create_special_county_flag', payload);
          const saved = data?.data || data?.message || data;
          if (saved && saved.id) {
            flags.value.push(normalizeFlag(saved));
          } else {
            await fetchFlags();
          }
          notification.success({ message: 'Flag created' });
        }
        closeFlagModal();
      } catch (err) {
        notification.error({
          message: 'Could not save flag',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        flagModal.saving = false;
      }
    };

    const saveFlag = async (flag) => {
      try {
        await axios.put(`update_special_county_flag/${flag.id}`, {
          notes: (flag.notes || '').trim() || null,
          is_active: flag.is_active,
        });
      } catch (err) {
        notification.error({
          message: 'Could not save flag',
          description: err?.response?.data?.message || 'Please try again.',
        });
      }
    };

    const deleteFlag = async (flag) => {
      flag._deleting = true;
      try {
        await axios.delete(`delete_special_county_flag/${flag.id}`);
        flags.value = flags.value.filter(f => f.id !== flag.id);
        notification.success({ message: 'Flag removed' });
      } catch (err) {
        try {
          await axios.put(`update_special_county_flag/${flag.id}`, { is_active: false });
          flag.is_active = false;
          notification.info({
            message: 'Flag deactivated',
            description: 'Delete endpoint not available; the flag has been marked inactive instead.',
          });
        } catch (innerErr) {
          notification.error({
            message: 'Could not remove flag',
            description: innerErr?.response?.data?.message || 'Please try again.',
          });
        }
      } finally {
        flag._deleting = false;
      }
    };

    // ---- Catalogue actions ----
    const addItem = async (cat) => {
      if (!cat._draft.parameter_id) return;
      cat._adding = true;
      const payload = {
        special_type: cat.id,
        parameter_id: cat._draft.parameter_id,
        label: (cat._draft.label || '').trim() || null,
        default_days: Number(cat._draft.default_days || 1),
        default_units: Number(cat._draft.default_units || 1),
        sort_order: Number(cat._draft.sort_order || 0),
        is_active: true,
      };
      try {
        const { data } = await axios.post('create_special_cost_parameter', payload);
        const saved = data?.data || data?.message || data;
        if (saved && saved.id) {
          cat.items.push(normalizeItem(saved));
        } else {
          // backend created but didn't return record — refresh
          await fetchCatalogue();
        }
        cat._draft = buildEmptyDraft();
        notification.success({ message: 'Special cost template added' });
      } catch (err) {
        notification.error({
          message: 'Could not add template',
          description: err?.response?.data?.message || 'Please try again.',
        });
      } finally {
        cat._adding = false;
      }
    };

    const saveItem = async (item) => {
      if (!item || !item.id) return;
      const payload = {
        label: (item.label || '').trim() || null,
        default_days: Number(item.default_days || 1),
        default_units: Number(item.default_units || 1),
        sort_order: Number(item.sort_order || 0),
        is_active: Boolean(item.is_active),
      };
      try {
        await axios.put(`update_special_cost_parameter/${item.id}`, payload);
      } catch (err) {
        notification.error({
          message: 'Could not save changes',
          description: err?.response?.data?.message || 'Please try again.',
        });
      }
    };

    const removeItem = async (cat, item) => {
      item._deleting = true;
      try {
        await axios.delete(`delete_special_cost_parameter/${item.id}`);
        cat.items = cat.items.filter(i => i.id !== item.id);
      } catch (err) {
        // Soft-delete fallback: deactivate.
        try {
          await axios.put(`update_special_cost_parameter/${item.id}`, { is_active: false });
          item.is_active = false;
          notification.info({
            message: 'Template deactivated',
            description: 'Delete endpoint not available; the template has been marked inactive instead.',
          });
        } catch (innerErr) {
          notification.error({
            message: 'Could not remove template',
            description: innerErr?.response?.data?.message || 'Please try again.',
          });
        }
      } finally {
        item._deleting = false;
      }
    };

    // ---- Mapping actions ----
    const isMapped = (map, eid, cid) => Boolean(map[`${eid}:${cid}`]);

    const toggleMap = async (map, eid, cid, e) => {
      const checked = e?.target?.checked ?? !map[`${eid}:${cid}`];
      const key = `${eid}:${cid}`;
      if (checked) map[key] = true; else delete map[key];
      try {
        await axios.post('special_cost_activity_mappings', {
          activity_id: eid,
          special_type: cid,
          mapped: checked,
        });
      } catch (err) {
        if (!toggleMap._warned) {
          toggleMap._warned = true;
          notification.warning({
            message: 'Mapping not persisted',
            description: 'Could not reach the server. Changes are kept locally for this session.',
          });
        }
      }
    };

    onMounted(async () => {
      await Promise.all([
        fetchCatalogue(),
        fetchBudgetParameters(),
        fetchCounties(),
        fetchSubCounties(),
        fetchActivities(),
        fetchFlags(),
      ]);
      await fetchMappings();
    });

    return {
      SPECIAL_TYPES,
      activeTab,
      loading,
      categories,
      openCategoryKeys,
      parameterOptions,
      parametersLoading,
      filterParamOption,
      counties,
      subCounties,
      activities,
      activityGroups,
      activityMap,
      // flags
      flags,
      flagsLoading,
      countyFilters,
      subCountyFilters,
      openSubCountyKeys,
      countyTypeCounts,
      subCountyTypeCounts,
      subCountyFlags,
      filteredCountyFlagGroups,
      filteredSubCountyFlagGroups,
      filteredSubCountyOptions,
      modalSubCountyOptions,
      flagModal,
      flagModalTitle,
      flagModalValid,
      typeColor,
      typeName,
      fetchFlags,
      openFlagModal,
      closeFlagModal,
      submitFlagModal,
      saveFlag,
      deleteFlag,
      // matrix
      templateColumns,
      filteredCountyRows,
      filteredSubCountyRows,
      hasCountyFlag,
      hasSubCountyFlag,
      isCellBusy,
      toggleCountyFlag,
      toggleSubCountyFlag,
      // shared
      formatMoney,
      fetchCatalogue,
      addItem,
      saveItem,
      removeItem,
      isMapped,
      toggleMap,
    };
  },
};
</script>

<style lang="less" scoped>
.sac-shell { padding: 0; }
.sac-tabs { padding: 0 16px; }
.sac-pane { padding: 16px; }

.sac-section {
  margin-bottom: 16px;
  border: 1px solid #eef0f4;
  border-radius: 10px;
}
.sac-section-head {
  padding: 4px 4px 12px;
  h4 { margin: 0; font-size: 15px; font-weight: 600; }
  .sac-section-sub {
    margin: 4px 0 0;
    color: #8a8f99;
    font-size: 12.5px;
    code {
      background: #f3f4f7;
      padding: 0 4px;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  .sac-ico { margin-right: 6px; }
}
.sac-actions-row {
  display: flex;
  justify-content: flex-end;
}

.sac-cat-list { background: transparent; border: none; }
.sac-cat-panel {
  background: #fff;
  border: 1px solid #eef0f4 !important;
  border-radius: 10px !important;
  margin-bottom: 12px;
  overflow: hidden;
}
.sac-cat-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.sac-cat-desc {
  display: block;
  margin-top: 4px;
  margin-left: 4px;
  color: #8a8f99;
  font-size: 12px;
}
.sac-pill {
  background: #f3f4f7;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  color: #5a6172;
}

.sac-items-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1.6fr) minmax(180px, 1fr) 110px 90px 140px 90px 48px;
  gap: 12px;
  align-items: start;
  padding: 8px 4px;
}
.sac-items-header {
  color: #8a8f99;
  font-size: 12px;
  border-bottom: 1px solid #f0f1f4;
  padding-bottom: 6px;
  .num { text-align: right; }
}
.sac-item-row { border-bottom: 1px dashed #f3f4f7; }
.sac-item-row:last-child { border-bottom: none; }
.sac-item-text { display: flex; flex-direction: column; gap: 6px; }
.sac-item-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.sac-meta-label {
  color: #8a8f99;
  font-size: 12px;
}
.sac-item-param {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
}
.num { text-align: right; }
.num :deep(.ant-input-number) { width: 100%; }
.sac-money-cell { padding-top: 6px; color: #1f2937; }

.sac-add-item {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f1f4;
  .sac-add-item-title {
    color: #8a8f99;
    font-size: 12.5px;
    margin-bottom: 8px;
  }
}
.sac-field-label {
  display: block;
  font-size: 11.5px;
  color: #8a8f99;
  margin-bottom: 4px;
}
.sac-add-action {
  display: flex;
  align-items: flex-end;
}

.sac-expand-empty {
  padding: 12px;
  color: #8a8f99;
  font-size: 13px;
  text-align: center;
}

.sac-loading {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* Mapping tables */
.sac-table-scroll {
  overflow-x: auto;
  border: 1px solid #eef0f4;
  border-radius: 8px;
}
.sac-mapping-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  th, td {
    padding: 12px 14px;
    border-bottom: 1px solid #f0f1f4;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
  }
  thead th {
    background: #fafbfc;
    color: #6b7280;
    font-weight: 500;
    text-align: center;
    position: sticky;
    top: 0;
  }
  .sac-th-name { text-align: left; }
  .sac-td-name { text-align: left; color: #1f2937; }
  .sac-td-county { text-align: left; color: #6b7280; }
  .sac-td-check { width: 1%; }
  .sac-group-row td {
    background: #fafbfc;
    color: #6b7280;
    font-size: 11.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: left;
    font-weight: 600;
  }
  .sac-empty-row {
    text-align: center;
    color: #8a8f99;
    padding: 24px;
  }
  tbody tr:hover td { background: #fafbfc; }
}

/* Matrix view (county/sub-county × template) */
.sac-matrix-table {
  th, td {
    text-align: left;
    white-space: nowrap;
  }
  .sac-th-template {
    text-align: left;
    color: #8a8f99;
    font-weight: 500;
    font-size: 12.5px;
    min-width: 140px;
    max-width: 220px;
    white-space: normal;
    line-height: 1.35;
    padding: 12px 14px;
  }
  .sac-td-check {
    text-align: left;
    width: 1%;
    padding-left: 14px;
    padding-right: 14px;
  }
  .sac-td-name { font-weight: 500; }
  .sac-td-county { color: #6b7280; font-size: 12.5px; }
  tbody tr td { border-bottom: 1px solid #f4f5f8; }
}

@media (max-width: 768px) {
  .sac-items-grid {
    grid-template-columns: 1fr;
  }
  .sac-items-header { display: none; }
  .num { text-align: left; }
}

/* ============================== Flags UI ============================== */
.sac-flags-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.sac-flags-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.sac-stat-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin: 4px 0 16px;
}
.sac-stat-tile {
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border: 1px solid #eef0f4;
  border-radius: 10px;
  padding: 12px 14px;
  &.is-zero { opacity: 0.55; }
  .sac-stat-label {
    font-size: 11.5px;
    color: #8a8f99;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .sac-stat-value {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.2;
    margin-top: 2px;
  }
  .sac-stat-foot {
    font-size: 11.5px;
    color: #8a8f99;
  }
}

.sac-filter-row { margin-bottom: 12px; }

.sac-chip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  .sac-chip-label {
    color: #8a8f99;
    font-size: 12.5px;
  }
  .sac-quick-chip {
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 500;
    user-select: none;
    transition: transform 0.1s ease;
    &:hover { transform: translateY(-1px); }
    .sac-chip-count {
      margin-left: 6px;
      font-weight: 400;
      opacity: 0.8;
    }
  }
}

.sac-empty-state {
  text-align: center;
  padding: 36px 16px;
  color: #6b7280;
  .sac-empty-illustration {
    font-size: 40px;
    margin-bottom: 8px;
  }
  h4 { margin: 0 0 4px; font-weight: 600; color: #1f2937; }
  p { margin: 0; font-size: 13px; color: #8a8f99; }
}

/* County card grid */
.sac-county-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 14px;
}
.sac-county-card {
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  &:hover {
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
  }
}
.sac-county-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fafbfc;
  border-bottom: 1px solid #eef0f4;
}
.sac-county-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
}
.sac-county-icon { font-size: 14px; }
.sac-flag-list {
  display: flex;
  flex-direction: column;
}
.sac-flag-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px dashed #f0f1f4;
  &:last-child { border-bottom: none; }
  &.is-inactive { opacity: 0.55; }
}
.sac-flag-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 0;
}
.sac-type-tag {
  align-self: flex-start;
  font-weight: 500;
  border-radius: 6px;
}
.sac-flag-notes {
  font-size: 12.5px;
  color: #4b5563;
  line-height: 1.45;
  word-break: break-word;
  &.is-muted {
    color: #b0b6c0;
    font-style: italic;
  }
}
.sac-flag-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

/* Sub-county collapsed groups */
.sac-sc-table { padding: 4px 0; }
.sac-sc-grid {
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) 160px minmax(220px, 2fr) 80px 140px;
  gap: 12px;
  align-items: center;
  padding: 10px 8px;
}
.sac-sc-head {
  color: #8a8f99;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #f0f1f4;
}
.sac-sc-row {
  border-bottom: 1px dashed #f3f4f7;
  &:last-child { border-bottom: none; }
  &:hover { background: #fafbfc; }
  &.is-inactive { opacity: 0.55; }
}
.sac-sc-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1f2937;
}
.sac-sc-icon { font-size: 13px; }
.sac-sc-notes {
  font-size: 12.5px;
  color: #4b5563;
  line-height: 1.45;
  word-break: break-word;
}
.sac-sc-actions {
  display: inline-flex;
  gap: 4px;
  justify-content: flex-end;
}

/* Modal */
.sac-modal-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sac-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 12.5px;
    color: #4b5563;
    font-weight: 500;
  }
  .sac-req { color: #ef4444; }
  .sac-help {
    font-size: 11.5px;
    color: #8a8f99;
  }
}
.sac-active-field {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  span {
    font-size: 12.5px;
    color: #4b5563;
  }
}
.sac-type-radio {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 768px) {
  .sac-sc-grid {
    grid-template-columns: 1fr;
  }
  .sac-sc-head { display: none; }
  .sac-sc-actions { justify-content: flex-start; }
}
</style>
