<template>
  <PerformanceChartWrapper>
    <sdCards v-if="performanceState" more title="Average Sales Revenue">
      <template #more>
        <router-link to="#">
          <sdFeatherIcons size="16" type="printer" />
          <span>Printer</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="book-open" />
          <span>PDF</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file-text" />
          <span>Google Sheets</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="x" />
          <span>Excel (XLSX)</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file" />
          <span>CSV</span>
        </router-link>
      </template>
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="performance === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangePerformance(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="performance === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangePerformance(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="performance === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangePerformance(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>
      <Pstates>
        <div
          @click="(e) => onPerformanceTab(e, 'users')"
          :class="`growth-upward ${performanceTab === 'users' && 'active'}`"
          role="button"
        >
          <p>This Month Revenue</p>
          <sdHeading as="h1">
            {{ performanceState.users[0] }}
            <sub>
              <span> <sdFeatherIcons type="arrow-up" size="14" /> 25% </span>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="(e) => onPerformanceTab(e, 'sessions')"
          :class="`growth-upward ${performanceTab === 'sessions' && 'active'}`"
          role="button"
        >
          <p>Last Month Revenue</p>
          <sdHeading as="h1">
            {{ performanceState.sessions[0] }}
            <sub>
              <span> <sdFeatherIcons type="arrow-up" size="14" /> 47% </span>
            </sub>
          </sdHeading>
        </div>
      </Pstates>

      <div v-if="preIsLoading" class="sd-spin">
        <a-spin />
      </div>
      <div v-else class="performance-lineChart">
        <sdChartContainer class="parentContainer">
          <Chartjs
            class="performance"
            id="performance"
            type="line"
            :labels="performanceState.labels"
            :datasets="performanceDatasets"
            :options="chartOptions"
            :height="height"
          />
        </sdChartContainer>
        <ul v-if="performanceDatasets">
          <li v-for="(item, index) in performanceDatasets" :key="index + 1" class="custom-label">
            <span
              :style="{
                backgroundColor: item.borderColor,
              }"
            />
            {{ item.label }}
          </li>
        </ul>
      </div>
    </sdCards>
  </PerformanceChartWrapper>
</template>
<script>
import { PerformanceChartWrapper, Pstates } from '../../style';
import { chartLinearGradient, customTooltips } from '../../../../components/utilities/utilities';
import Chartjs from '../../../../components/utilities/chartjs';
import { useStore } from 'vuex';
import { computed, onMounted, ref, toRefs, defineComponent } from 'vue';
import VueTypes from 'vue-types';

const AverageSalesRevenue = defineComponent({
  name: 'AverageSalesRevenue',
  components: { PerformanceChartWrapper, Pstates, Chartjs },
  props: {
    chartHeights: VueTypes.number.def(100),
  },
  setup(props) {
    const { chartHeights } = toRefs(props);
    const { state, dispatch } = useStore();

    const performanceState = computed(() => state.chartContent.performanceData);
    const preIsLoading = computed(() => state.chartContent.perLoading);
    const performance = ref('year');
    const performanceTab = ref('users');

    const height = ref(window.innerWidth <= 575 ? 200 : chartHeights);

    onMounted(() => dispatch('performanceGetData'));
    const handleActiveChangePerformance = (event, value) => {
      event.preventDefault();
      performance.value = value;
      dispatch('performanceFilterData', value);
    };

    const onPerformanceTab = (event, value) => {
      event.preventDefault();
      performanceTab.value = value;
      return dispatch('setIsLoading');
    };

    const performanceDatasets = computed(() =>
      performanceState.value
        ? [
            {
              data: performanceState.value[performanceTab.value][1],
              borderColor: '#5F63F2',
              borderWidth: 4,
              fill: true,
              backgroundColor: () =>
                chartLinearGradient(document.getElementById('performance'), 300, {
                  start: '#5F63F230',
                  end: '#ffffff05',
                }),
              label: 'Current period',
              pointStyle: 'circle',
              pointRadius: '0',
              hoverRadius: '9',
              pointBorderColor: '#fff',
              pointBackgroundColor: '#5F63F2',
              hoverBorderWidth: 5,
            },
            {
              data: performanceState.value[performanceTab.value][2],
              borderColor: '#C6D0DC',
              borderWidth: 2,
              fill: false,
              backgroundColor: '#00173750',
              label: 'Previous period',
              borderDash: [3, 3],
              pointRadius: '0',
              hoverRadius: '0',
            },
          ]
        : [],
    );
    const chartOptions = {
      maintainAspectRatio: true,
      elements: {
        z: 9999,
      },
      legend: {
        display: false,
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
      tooltips: {
        mode: 'label',
        intersect: false,
        backgroundColor: '#ffffff',
        position: 'average',
        enabled: false,
        custom: customTooltips,
        callbacks: {
          title() {
            return performanceTab.value;
          },
          label(t, d) {
            const { yLabel, datasetIndex } = t;
            return `<span class="chart-data">${yLabel}k</span> <span class="data-label">${d.datasets[datasetIndex].label}</span>`;
          },
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              color: '#e5e9f2',
              borderDash: [3, 3],
              zeroLineColor: '#e5e9f2',
              zeroLineWidth: 1,
              zeroLineBorderDash: [3, 3],
            },
            ticks: {
              beginAtZero: true,
              fontSize: 13,
              fontColor: '#182b49',
              max: 80,
              stepSize: 20,
              callback(label) {
                return `${label}k`;
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: true,
              zeroLineWidth: 2,
              zeroLineColor: 'transparent',
              color: 'transparent',
              z: 1,
              tickMarkLength: 0,
            },
            ticks: {
              padding: 10,
            },
          },
        ],
      },
    };
    return {
      performanceDatasets,
      onPerformanceTab,
      handleActiveChangePerformance,
      preIsLoading,
      performance,
      performanceTab,
      performanceState,
      height,
      chartOptions,
    };
  },
});

export default AverageSalesRevenue;
</script>
