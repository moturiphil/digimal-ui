<template>
  <RevenueWrapper>
    <sdCards v-if="performanceState" more :title="title">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="revenue === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRevenue(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="revenue === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRevenue(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="revenue === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeRevenue(e, 'year')" to="#"> Year </router-link>
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

      <div v-if="preIsLoading" class="sd-spin">
        <a-spin />
      </div>

      <div v-else class="performance-lineChart">
        <ul>
          <li v-for="(item, key) in performanceDatasets" :key="key + 1" class="custom-label">
            <strong :class="item.amountClass">{{ item.amount }}</strong>
            <div>
              <span
                :style="{
                  backgroundColor: item.borderColor,
                }"
              />
              {{ item.label }}
            </div>
          </li>
        </ul>
        <sdChartContainer class="parentContainer">
          <Chart
            class="perform"
            type="line"
            id="perform"
            :labels="performanceState.labels"
            :datasets="performanceDatasets"
            :options="chartOptions"
            :height="height"
          />
        </sdChartContainer>
      </div>
    </sdCards>
  </RevenueWrapper>
</template>

<script>
import { RevenueWrapper } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { customTooltips, chartLinearGradient } from '../../../../components/utilities/utilities';
import { useStore } from 'vuex';
import { computed, onMounted, ref, toRefs, defineComponent } from 'vue';
import VueTypes from 'vue-types';

const TotalRevenue = defineComponent({
  name: 'TotalRevenue',
  components: { RevenueWrapper, Chart },
  props: {
    title: VueTypes.string.def('Total Revenue'),
    chartHeight: VueTypes.number.def(120),
  },
  setup(props) {
    const { chartHeight } = toRefs(props);
    const store = useStore();
    const performanceState = computed(() => store.state.chartContent.performanceData);
    const preIsLoading = computed(() => store.state.chartContent.perLoading);
    const revenue = ref('year');
    const height = ref(window.innerWidth <= 575 ? 200 : chartHeight);

    const handleActiveChangeRevenue = (event, value) => {
      event.preventDefault();
      revenue.value = value;
      return store.dispatch('performanceFilterData', value);
    };
    function chartMethods(elementId, color) {
      return chartLinearGradient(document.querySelector(`.${elementId}`), 300, {
        start: color[0],
        end: color[1],
      });
    }

    const performanceDatasets = computed(() => [
      {
        data: performanceState.value.users[1],
        borderColor: '#5F63F2',
        borderWidth: 4,
        fill: true,
        backgroundColor: () => chartMethods('perform', ['#5F63F230', '#ffffff05']),
        label: 'Current period',
        pointStyle: 'circle',
        pointRadius: '0',
        hoverRadius: '9',
        pointBorderColor: '#fff',
        pointBackgroundColor: '#5F63F2',
        hoverBorderWidth: 5,
        amount: '$7,596',
        amountClass: 'current-amount',
      },
      {
        data: performanceState.value.users[2],
        borderColor: '#C6D0DC',
        borderWidth: 2,
        fill: false,
        backgroundColor: '#00173750',
        label: 'Previous period',
        borderDash: [3, 3],
        pointStyle: 'circle',
        pointRadius: '0',
        hoverRadius: '0',
        amount: '$3,258',
        amountClass: 'prev-amount',
      },
    ]);

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
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 6,
          display: false,
          usePointStyle: true,
        },
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
            return `Total Revenue`;
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
              suggestedMin: 50,
              suggestedMax: 80,
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
      revenue,
      chartOptions,
      height,
      handleActiveChangeRevenue,
      chartLinearGradient,
      performanceDatasets,
    };
  },
});

export default TotalRevenue;
</script>
