<template>
  <div class="full-width-table region-list-table">
    <sdCards title="Sessions by Region" bodypadding="0px">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="region === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRegion(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="region === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRegion(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="region === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRegion(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>
      <a-row>
        <a-col :xxl="10" :md="11" :xs="24">
          <RegionList>
            <perfect-scrollbar
              :options="{
                wheelSpeed: 1,
                swipeEasing: true,
                suppressScrollX: true,
              }"
            >
              <a-table :columns="regionColumns" :dataSource="regionData" :pagination="false" />
            </perfect-scrollbar>
          </RegionList>
        </a-col>
        <a-col :xxl="14" :md="13" :xs="24">
          <RegionMap>
            <WorldMap :options="{ ...svgMapDataGPD }" />
          </RegionMap>
        </a-col>
      </a-row>
    </sdCards>
  </div>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { RegionList, RegionMap } from '../../style';
import WorldMap from '@/components/utilities/VectorMap.vue';
import { useStore } from 'vuex';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import svgMapDataGPD from '@/demoData/vectorMap.js';

const regionColumns = [
  {
    title: 'Top Region',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Sessions',
    dataIndex: 'sessions',
    key: 'sessions',
  },
];

const SessionsbyRegion = defineComponent({
  name: 'SessionsbyRegion',
  components: { RegionList, RegionMap, WorldMap, PerfectScrollbar },
  setup() {
    const { state, dispatch } = useStore();
    const sessionByRegionState = computed(() => state.chartContent.regionData);
    const region = ref('year');

    const handleActiveChangeRegion = (event, value) => {
      event.preventDefault();
      region.value = value;
      dispatch('topRegionFilterData', value);
    };

    const regionData = computed(() =>
      sessionByRegionState.value
        ? sessionByRegionState.value.map((value, index) => {
            return { key: index + 1, region: value[0], sessions: value[1] };
          })
        : [],
    );

    onMounted(() => dispatch('topRegionGetData'));

    return {
      sessionByRegionState,
      handleActiveChangeRegion,
      regionColumns,
      regionData,
      region,
      svgMapDataGPD,
      options: {
        width: 492,
        height: 188,
        zoom: true,
        hideAntarctic: true,
        landsColor: '#ddd',
        landsBorder: '#fff',
      },
    };
  },
});

export default SessionsbyRegion;
</script>
<style scoped>
.ps {
  height: 200px;
}
</style>
