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
              Mark which counties and sub-counties are Special Area Cost areas. Each unit has a single
              switch — when on, the unit's budget shows a Special Area Cost section after the standard
              budget categories, and its totals roll into the budget grand total.
            </p>
          </div>
        </div>

        <sdCards headless class="bp-table-shell sac-shell">
          <a-tabs v-model:activeKey="activeTab" class="bp-tabs sac-tabs">
            <a-tab-pane key="county" tab="County Mapping" />
            <a-tab-pane key="sub_county" tab="Sub-County Mapping" />
          </a-tabs>

          <!-- ============================== COUNTY MAPPING ============================== -->
          <div v-if="activeTab === 'county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> County applicability</h4>
                <span class="sac-section-note">
                  Check "Is Special Area Cost Applicable" to enable the SAC section on the
                  county's budgeting page.
                </span>
              </div>
              <div class="sac-actions-row">
                <a-input
                  v-model:value="countyFilters.search"
                  size="small"
                  placeholder="Search counties…"
                  allow-clear
                  class="sac-search"
                />
                <sdButton :disabled="loading" @click="fetchCounties">Refresh</sdButton>
              </div>
            </sdCards>

            <div v-if="loading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!filteredCounties.length" class="sac-empty">
              No county profiles found.
            </div>

            <sdCards headless class="sac-list-card">
              <div class="sac-map-grid sac-map-head">
                <div>County</div>
                <div>Special Area Cost Applicable</div>
              </div>
              <div
                v-for="row in filteredCounties"
                :key="row.id"
                class="sac-map-grid sac-map-row"
              >
                <div class="sac-unit">
                  <span class="sac-unit-icon">▦</span>
                  <span class="sac-unit-name">{{ row.name }}</span>
                  <a-tag v-if="row.is_special_area_cost" class="sac-on-tag">Active</a-tag>
                </div>
                <div class="sac-switch-cell">
                  <a-checkbox
                    :checked="row.is_special_area_cost"
                    :disabled="isCellBusy(row.id)"
                    @change="(e) => toggleRow(row, e)"
                  >
                    Is Special Area Cost Applicable
                  </a-checkbox>
                </div>
              </div>
            </sdCards>
          </div>
<!-- ============================== SUB-COUNTY MAPPING ============================== -->
          <div v-if="activeTab === 'sub_county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> Sub-county applicability</h4>
                <span class="sac-section-note">
                  A sub-county's SAC section is controlled independently of its county — check the box
                  only where the sub-county itself is a Special Area Cost area.
                </span>
              </div>
              <div class="sac-actions-row">
                <a-select
                  v-model:value="subCountyFilters.county_id"
                  size="small"
                  placeholder="All counties"
                  allow-clear
                  class="sac-filter"
                  :options="countyFilterOptions"
                />
                <a-input
                  v-model:value="subCountyFilters.search"
                  size="small"
                  placeholder="Search sub-counties…"
                  allow-clear
                  class="sac-search"
                />
                <sdButton :disabled="loading" @click="fetchSubCounties">Refresh</sdButton>
              </div>
            </sdCards>

            <div v-if="loading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!filteredSubCountyRows.length" class="sac-empty">
              No sub-county profiles found.
            </div>

            <sdCards headless class="sac-list-card">
              <div class="sac-map-grid sac-map-head">
                <div>Sub-County</div>
                <div>County</div>
                <div>Special Area Cost Applicable</div>
              </div>
              <div
                v-for="row in filteredSubCountyRows"
                :key="row.id"
                class="sac-map-grid sac-map-row"
              >
                <div class="sac-unit">
                  <span class="sac-unit-icon">◔</span>
                  <span class="sac-unit-name">{{ row.name }}</span>
                  <a-tag v-if="row.is_special_area_cost" class="sac-on-tag">Active</a-tag>
                </div>
                <div class="sac-county">{{ row.county_name }}</div>
                <div class="sac-switch-cell">
                  <a-checkbox
                    :checked="row.is_special_area_cost"
                    :disabled="isCellBusy(row.id)"
                    @change="(e) => toggleRow(row, e, true)"
                  >
                    Is Special Area Cost Applicable
                  </a-checkbox>
                </div>
              </div>
            </sdCards>
          </div>
        </sdCards>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/*
 * Special Area Cost — County & Sub-County Mapping (redesigned).
 *
 * Removed: the SAC catalogue and the per-activity mapping. Applicability is
 * now a single flag per administrative unit, stored on
 * county_profiles.is_special_area_cost and toggled here. The budgeting pages
 * (CountyBudgeting.vue / Budgeting.vue) read the same flag to decide whether
 * to render their SAC section.
 */
export default {
  name: 'SpecialAreaCosts',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const activeTab = ref('county');
    const loading = ref(false);

    // ── Shared busy map (one in-flight toggle per row) ────────────────
    const busyCells = reactive({});
    const isCellBusy = (id) => Boolean(busyCells[id]);

    // ── County rows ───────────────────────────────────────────────────
    const counties = ref([]);
    const countyFilters = reactive({ search: '' });

    const normalizeCounty = (p) => ({
      id: p.id,
      name: p?.county?.name || p?.county_name || `County ${p.county_id}`,
      county_id: p.county_id,
      is_special_area_cost: Boolean(p.is_special_area_cost),
    });

    const fetchCounties = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { level: 'county' },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : data?.message || [];
        counties.value = rows.map(normalizeCounty);
      } catch (err) {
        notification.error({
          message: 'Failed to load counties',
          description: err?.response?.data?.message || err.message,
        });
        counties.value = [];
      } finally {
        loading.value = false;
      }
    };

const filteredCounties = computed(() => {
      const q = (countyFilters.search || '').trim().toLowerCase();
      let rows = counties.value.slice().sort((a, b) => a.name.localeCompare(b.name));
      if (q) rows = rows.filter((c) => c.name.toLowerCase().includes(q));
      return rows;
    });

    // ── Sub-county rows ───────────────────────────────────────────────
    const subCounties = ref([]);
    const subCountyFilters = reactive({ search: '', county_id: null });

    const normalizeSubCounty = (p) => ({
      id: p.id,
      name: p?.subCounty?.name || p?.sub_county_name || `Sub-County ${p.sub_county_id}`,
      county_id: p.county_id,
      county_name: p?.county?.name || p?.county_name || '—',
      is_special_area_cost: Boolean(p.is_special_area_cost),
    });

    const fetchSubCounties = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { level: 'sub_county' },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : data?.message || [];
        subCounties.value = rows.map(normalizeSubCounty);
      } catch (err) {
        notification.error({
          message: 'Failed to load sub-counties',
          description: err?.response?.data?.message || err.message,
        });
        subCounties.value = [];
      } finally {
        loading.value = false;
      }
    };

    const countyFilterOptions = computed(() => {
      const seen = {};
      return subCounties.value
        .filter((r) => (seen[r.county_id] = !seen[r.county_id]))
        .map((r) => ({ value: r.county_id, label: r.county_name }));
    });

    const filteredSubCountyRows = computed(() => {
      const q = (subCountyFilters.search || '').trim().toLowerCase();
      const cid = subCountyFilters.county_id;
      let rows = subCounties.value.slice().sort((a, b) => {
        const byCounty = a.county_name.localeCompare(b.county_name);
        return byCounty !== 0 ? byCounty : a.name.localeCompare(b.name);
      });
      if (cid) rows = rows.filter((r) => r.county_id === cid);
      if (q) {
        rows = rows.filter((r) =>
          r.name.toLowerCase().includes(q) ||
          r.county_name.toLowerCase().includes(q),
        );
      }
      return rows;
    });

    // ── Toggle ────────────────────────────────────────────────────────
    const toggleRow = async (row, e, isSubCounty = false) => {
      const checked = e?.target?.checked ?? !row.is_special_area_cost;
      if (busyCells[row.id]) return;
      busyCells[row.id] = true;
      try {
        const { data } = await axios.put(`update_special_area_cost/${row.id}`, {
          is_special_area_cost: checked,
        });
        const saved = data?.data || data || {};
        row.is_special_area_cost = Boolean(saved.is_special_area_cost ?? checked);
        notification.success({
          message: `${isSubCounty ? 'Sub-county' : 'County'} updated`,
          description: `Special Area Cost ${row.is_special_area_cost ? 'enabled' : 'disabled'} for ${row.name}.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to update Special Area Cost mapping',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        busyCells[row.id] = false;
      }
    };

    // Switching tabs lazily loads the matching list.
    watch(activeTab, (tab) => {
      if (tab === 'county' && !counties.value.length) fetchCounties();
      if (tab === 'sub_county' && !subCounties.value.length) fetchSubCounties();
    });

    // Load the county list on page mount (the default tab).
    onMounted(() => {
      fetchCounties();
    });

    return {
      activeTab,
      loading,
      counties,
      countyFilters,
      filteredCounties,
      subCounties,
      subCountyFilters,
      countyFilterOptions,
      filteredSubCountyRows,
      isCellBusy,
      toggleRow,
      fetchCounties,
      fetchSubCounties,
    };
  },
};
</script>
<style lang="less" scoped>
.sac-shell {
  margin-top: 4px;
}
.sac-tabs {
  margin-bottom: 14px;
}
.sac-pane {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sac-section {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
  padding: 12px 16px;
  .sac-section-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #3a3f5e;
    }
    .sac-section-note {
      font-size: 12px;
      color: #7a8599;
    }
  }
  .sac-actions-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
}
.sac-search {
  width: 240px;
}
.sac-filter {
  width: 200px;
}
.sac-loading {
  padding: 24px;
  text-align: center;
}
.sac-empty {
  padding: 28px;
  text-align: center;
  color: #7a8599;
  background: #fff;
  border: 1px dashed #e2e6ef;
  border-radius: 10px;
}
.sac-list-card {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
}
.sac-map-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  padding: 10px 16px;
  align-items: center;
  border-bottom: 1px solid #eef0f5;
  &:last-child {
    border-bottom: none;
  }
}
.sac-map-head {
  font-size: 12px;
  font-weight: 700;
  color: #8a93a8;
  background: #f6f8fc;
}
.sac-map-row:hover {
  background: #fafbfe;
}
.sac-unit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  .sac-unit-icon {
    color: #9aa4b8;
    font-size: 14px;
  }
  .sac-unit-name {
    font-weight: 600;
    color: #3a3f5e;
  }
}
.sac-on-tag {
  background: #fdeee7;
  color: #b3402a;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-county {
  font-size: 13px;
  color: #5a6277;
}
.sac-switch-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #3a3f5e;
  white-space: nowrap;
}
</style>