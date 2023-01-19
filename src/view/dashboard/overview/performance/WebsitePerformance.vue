<template>
  <PerformanceChartWrapper>
    <sdCards v-if="performanceState !== null" more title="Website Performance">
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
      <Pstates>
        <div
          @click="() => onPerformanceTab('users')"
          :class="`growth-upward ${performanceTab === 'users' && 'active'}`"
          role="button"
        >
          <p>Users</p>
          <sdHeading as="h1">
            {{ performanceState.users[0] }}
            <sub>
              <span> <sdFeatherIcons type="arrow-up" size="14" /> 25% </span>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('sessions')"
          :class="`growth-upward ${performanceTab === 'sessions' && 'active'}`"
          role="button"
        >
          <p>Sessions</p>
          <sdHeading as="h1">
            {{ performanceState.sessions[0] }}
            <sub>
              <span> <sdFeatherIcons type="arrow-up" size="14" /> 47% </span>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('bounce')"
          :class="`growth-downward ${performanceTab === 'bounce' && 'active'}`"
          role="button"
        >
          <p>Bounce Rate</p>
          <sdHeading as="h1">
            {{ performanceState.bounce[0] }}
            <sub>
              <span> <sdFeatherIcons type="arrow-down" size="14" /> 28% </span>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('duration')"
          :class="`growth-upward ${performanceTab === 'duration' && 'active'}`"
          role="button"
        >
          <p>Session Duration</p>
          <sdHeading as="h1">
            {{ performanceState.duration[0] }}
            <sub>
              <span> <sdFeatherIcons icon="arrow-up" size="14" /> 13% </span>
            </sub>
          </sdHeading>
        </div>
      </Pstates>

      <div v-if="preIsLoading" class="sd-spin">
        <a-spin />
      </div>
      <div v-else class="performance-lineChart">
        <sdChartContainer class="parentContainer">
          <Chart
            v-if="performanceState"
            class="performance"
            type="line"
            id="performance"
            :labels="performanceState.labels"
            :datasets="performanceDatasets"
            :options="chartOptions"
            :height="height"
          />
        </sdChartContainer>
        <ul>
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
import { useStore } from 'vuex';
import { computed, ref, onMounted, defineComponent } from 'vue';
import { PerformanceChartWrapper, Pstates } from '../../style';
import { chartLinearGradient, customTooltips } from '../../../../components/utilities/utilities';
import Chart from '../../../../components/utilities/chartjs';

const WebsitePerformance = defineComponent({
  components: { PerformanceChartWrapper, Pstates, Chart },

  setup() {
    const store = useStore();
    const performance = ref('year');
    const performanceTab = ref('users');
    const height = ref(window.innerWidth <= 575 ? 200 : 85);

    const performanceState = computed(() => store.state.chartContent.performanceData);
    const preIsLoading = computed(() => store.state.chartContent.perLoading);

    const performanceDatasets = computed(() => [
      {
        data: performanceState.value[performanceTab.value][1],
        borderColor: '#5F63F2',
        borderWidth: 4,
        fill: true,
        backgroundColor: () => chartMethods('performance', ['#5F63F230', '#ffffff05']),
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
    ]);

    const handleActiveChangePerformance = (event, value) => {
      event.preventDefault();
      performance.value = value;
      return store.dispatch('performanceFilterData', value);
    };

    function chartMethods(elementId, color) {
      return chartLinearGradient(document.querySelector(`.${elementId}`), 300, {
        start: color[0],
        end: color[1],
      });
    }

    const onPerformanceTab = (value) => {
      performanceTab.value = value;
      return store.dispatch('setIsLoading');
    };

    onMounted(() => {
      store.dispatch('performanceGetData');
    });

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
      performanceState,
      preIsLoading,
      performance,
      performanceTab,
      handleActiveChangePerformance,
      onPerformanceTab,
      height,
      chartOptions,
      chartLinearGradient,
      chartMethods,
      performanceDatasets,
    };
  },
});

export default WebsitePerformance;
</script>
