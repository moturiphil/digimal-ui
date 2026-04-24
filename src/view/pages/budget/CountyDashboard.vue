<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              County Profile
            </h3>
            <p class="ph-subtitle">
              {{ county.name }} County — {{ county.sub_counties.length }} sub-counties
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green">{{ profileStatus }}</a-tag>
          </div>
        </div>

        <!-- ───────── County Budgeting Profile ───────── -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">County Budgeting Profile</div>
              <p class="panel-subtitle">
                County budgeting is based on the number of sub-counties. Demographics
                below are auto-filled from sub-county profiles.
              </p>
            </div>
            <sdButton type="dark" @click="refreshProfile" :loading="refreshing">
              ↻ Refresh Profile
            </sdButton>
          </div>

          <div class="profile-tiles top">
            <div class="profile-tile highlight">
              <div class="pt-label">No. of Sub-Counties</div>
              <div class="pt-value">{{ fmt(profile.subCounties) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Population</div>
              <div class="pt-value">{{ fmt(profile.population) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Households</div>
              <div class="pt-value">{{ fmt(profile.households) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Wards</div>
              <div class="pt-value">{{ fmt(profile.wards) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Locations</div>
              <div class="pt-value">{{ fmt(profile.locations) }}</div>
            </div>
          </div>
          <div class="profile-tiles bottom">
            <div class="profile-tile">
              <div class="pt-label">Sub-Locations</div>
              <div class="pt-value">{{ fmt(profile.subLocations) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Villages</div>
              <div class="pt-value">{{ fmt(profile.villages) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Distribution Posts</div>
              <div class="pt-value">{{ fmt(profile.posts) }}</div>
            </div>
            <div class="profile-tile">
              <div class="pt-label">Drop-off Points</div>
              <div class="pt-value">{{ fmt(profile.dropOffPoints) }}</div>
            </div>
          </div>
        </section>

        <!-- ───────── Computed Parameters ───────── -->
        <section class="panel">
          <div class="panel-title">Computed Parameters</div>
          <div class="param-grid">
            <div class="param-row" v-for="p in computedParams" :key="p.label">
              <span class="param-label">{{ p.label }}</span>
              <span class="param-value">{{ fmt(p.value) }}</span>
            </div>
          </div>
        </section>

        <!-- ───────── Sub-County Breakdown ───────── -->
        <section class="panel">
          <div class="panel-title">Sub-County Breakdown</div>
          <a-table
            :dataSource="county.sub_counties"
            :columns="scColumns"
            :pagination="false"
            row-key="id"
            size="small"
            class="minimal-table breakdown-table"
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'population'">{{ fmt(record.population) }}</span>
              <span v-else-if="column.key === 'households'">{{ fmt(record.households) }}</span>
              <span v-else-if="column.key === 'wards'">{{ fmt(record.wards) }}</span>
              <span v-else-if="column.key === 'locations'">{{ fmt(record.locations) }}</span>
              <span v-else-if="column.key === 'villages'">{{ fmt(record.villages) }}</span>
              <span v-else-if="column.key === 'posts'">{{ fmt(record.posts) }}</span>
            </template>
            <template #summary>
              <a-table-summary fixed>
                <a-table-summary-row class="total-row">
                  <a-table-summary-cell :index="0"><strong>TOTAL</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="1" align="right"><strong>{{ fmt(totals.population) }}</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="2" align="right"><strong>{{ fmt(totals.households) }}</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="3" align="right"><strong>{{ fmt(totals.wards) }}</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="4" align="right"><strong>{{ fmt(totals.locations) }}</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="5" align="right"><strong>{{ fmt(totals.villages) }}</strong></a-table-summary-cell>
                  <a-table-summary-cell :index="6" align="right"><strong>{{ fmt(totals.posts) }}</strong></a-table-summary-cell>
                </a-table-summary-row>
              </a-table-summary>
            </template>
          </a-table>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/* Strip trailing " County"/" Sub County" on display names */
const cleanName = (n, suffix) =>
  (n || '').replace(new RegExp(`\\s+${suffix}\\s*$`, 'i'), '').trim() || n || '';

/* Map an API record → sub-county row for the breakdown table */
const toSubCountyRow = (r) => ({
  id: r.id,
  name: cleanName(r.sub_county?.name || '', 'Sub County'),
  population: r.population || 0,
  households: r.estimated_households || 0,
  wards: r.number_of_wards || 0,
  locations: r.number_of_locations || 0,
  villages: r.number_of_villages || 0,
  posts: r.number_of_posts || 0,
});

export default {
  name: 'CountyDashboard',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const route = useRoute();

    const loading = ref(false);
    const refreshing = ref(false);
    const profileStatus = ref('Profile Saved');

    const countyRecord = ref(null);      // the row where sub_county_id === null
    const subCountyRows = ref([]);       // rows with sub_county_id !== null
    const county = ref({ id: null, name: '—', subCounties: 0 });

    const resolveCountyId = () => {
      if (route.query.county_id) return Number(route.query.county_id);
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        return user?.user?.county_id || user?.user?.county?.id || 4;
      } catch (e) {
        return 4;
      }
    };

    const loadProfile = async () => {
      const countyId = resolveCountyId();
      loading.value = true;
      try {
        const { data } = await axios.get(`get_county_profiles?county_id=${countyId}`);
        const records = Array.isArray(data) ? data : data?.data || [];
        const countyLevel = records.find((r) => !r.sub_county_id) || null;
        const subs = records.filter((r) => r.sub_county_id);

        countyRecord.value = countyLevel;
        subCountyRows.value = subs.map(toSubCountyRow);

        const countyMeta = countyLevel?.county || subs[0]?.county || {};
        county.value = {
          id: countyMeta.id || countyId,
          name: cleanName(countyMeta.name || '—', 'County'),
          subCounties: subs.length,
        };
      } catch (err) {
        notification.error({
          message: 'Failed to load county profile',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadProfile);

    /* Totals computed from sub-county rows for the breakdown footer */
    const totals = computed(() =>
      subCountyRows.value.reduce(
        (acc, sc) => ({
          population: acc.population + sc.population,
          households: acc.households + sc.households,
          wards: acc.wards + sc.wards,
          locations: acc.locations + sc.locations,
          villages: acc.villages + sc.villages,
          posts: acc.posts + sc.posts,
        }),
        { population: 0, households: 0, wards: 0, locations: 0, villages: 0, posts: 0 },
      ),
    );

    /* Profile tiles — prefer county-level record, fall back to sub-county sums */
    const profile = computed(() => {
      const c = countyRecord.value;
      return {
        subCounties: county.value.subCounties,
        population: c?.population ?? totals.value.population,
        households: c?.estimated_households ?? totals.value.households,
        wards: c?.number_of_wards ?? totals.value.wards,
        locations: c?.number_of_locations ?? totals.value.locations,
        subLocations: c?.number_of_sub_locations ?? 0,
        villages: c?.number_of_villages ?? totals.value.villages,
        posts: c?.number_of_posts ?? totals.value.posts,
        dropOffPoints: c?.number_of_drop_off_points ?? 0,
      };
    });

    /* Computed parameters panel — sourced directly from API fields */
    const computedParams = computed(() => {
      const c = countyRecord.value || {};
      return [
        { label: 'LLINs Required (Pop ÷ 1.8)', value: c.estimated_llins ?? 0 },
        { label: 'Bales (LLINs ÷ 50)', value: c.number_of_bales ?? 0 },
        { label: 'Admin Structures', value: c.number_of_administrative_structures ?? 0 },
        { label: 'Health Workers to Train', value: c.hworkers_to_train ?? 0 },
        { label: 'H/W Training Sessions (÷45)', value: c.training_sessions_hw ?? 0 },
        { label: 'H/W Class Size', value: c.class_size_hw ?? 0 },
        { label: 'CHP & V/E to Train', value: c.chvs_and_elders_to_train ?? 0 },
        { label: 'CHP & V/E Sessions (÷65)', value: c.training_sessions_chv ?? 0 },
        { label: 'CHP & V/E Class Size', value: c.class_size_chv ?? 0 },
      ];
    });

    const scColumns = [
      { title: 'Sub-County', dataIndex: 'name', key: 'name' },
      { title: 'Population', key: 'population', align: 'right' },
      { title: 'Households', key: 'households', align: 'right' },
      { title: 'Wards', key: 'wards', align: 'right' },
      { title: 'Locations', key: 'locations', align: 'right' },
      { title: 'Villages', key: 'villages', align: 'right' },
      { title: 'Posts', key: 'posts', align: 'right' },
    ];

    const refreshProfile = async () => {
      refreshing.value = true;
      await loadProfile();
      refreshing.value = false;
      profileStatus.value = 'Profile Saved';
      notification.success({ message: 'County profile refreshed.' });
    };

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      loading,
      county: computed(() => ({
        ...county.value,
        sub_counties: subCountyRows.value,
      })),
      profile,
      totals,
      computedParams,
      scColumns,
      refreshing,
      profileStatus,
      refreshProfile,
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

  .tile.highlight {
    background: #f4fbf6;
    border-color: #c9e6d3;
  }

  /* Compact profile tiles (match screenshot) */
  .profile-tiles {
    display: grid;
    gap: 10px;
    &.top    { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    &.bottom {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 10px;
    }
    @media (max-width: 1100px) {
      &.top, &.bottom {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }
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
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
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

  /* Breakdown table – total row */
  :deep(.breakdown-table) {
    .ant-table-summary {
      background: #f4fbf6;
      .ant-table-cell {
        border-top: 1px solid #d9f0e2;
        color: #15693c;
        font-weight: 800;
      }
    }
  }
}
</style>
