<template>
  <sdCards v-if="cashFlowState !== null" more>
    <template #title>
      <div>Cash Flow <span>Nov 23, 2019 - Nov 29, 2019</span></div>
    </template>
    <template #button
      ><div class="card-nav">
        <ul>
          <li :class="cashFlowActive === 'week' ? 'active' : 'regular'">
            <router-link @click="(e) => handleActiveChangeCash(e, 'week')" to="#"> Week </router-link>
          </li>
          <li :class="cashFlowActive === 'month' ? 'active' : 'regular'">
            <router-link @click="(e) => handleActiveChangeCash(e, 'month')" to="#"> Month </router-link>
          </li>
          <li :class="cashFlowActive === 'year' ? 'active' : 'regular'">
            <router-link @click="(e) => handleActiveChangeCash(e, 'year')" to="#"> Year </router-link>
          </li>
        </ul>
      </div></template
    >

    <template #more>
      <router-link to="#">
        <sdFeatherIcons :size="16" type="printer" />
        <span>Printer</span>
      </router-link>
      <router-link to="#">
        <sdFeatherIcons :size="16" type="book-open" />
        <span>PDF</span>
      </router-link>
      <router-link to="#">
        <sdFeatherIcons :size="16" type="file-text" />
        <span>Google Sheets</span>
      </router-link>
      <router-link to="#">
        <sdFeatherIcons :size="16" type="x" />
        <span>Excel (XLSX)</span>
      </router-link>
      <router-link to="#">
        <sdFeatherIcons :size="16" type="file" />
        <span>CSV</span>
      </router-link>
    </template>

    <div v-if="cfIsLoading" class="sd-spin">
      <a-spin />
    </div>

    <CardBarChart v-else>
      <div class="card-bar-top d-flex flex-grid">
        <div class="flex-grid-child">
          <p>Current Balance</p>
          <sdHeading as="h3" class="color-primary"> ${{ cashFlowState.current }} </sdHeading>
        </div>
        <div class="flex-grid-child">
          <p>Cash In</p>
          <sdHeading as="h3">${{ cashFlowState.in }}</sdHeading>
        </div>
        <div class="flex-grid-child">
          <p>Cash Out</p>
          <sdHeading as="h3">${{ cashFlowState.out }}</sdHeading>
        </div>
      </div>
      <sdChartContainer v-if="cashFlowDataset" class="parentContainer">
        <Chart
          class="cashFlow"
          type="bar"
          :labels="cashFlowState.labels"
          :datasets="cashFlowDataset"
          :height="106"
          :options="chartOptions"
        />
      </sdChartContainer>
      <ul v-if="cashFlowDataset" class="chart-dataIndicator">
        <li
          v-for="(item, key) in cashFlowDataset"
          :key="key + 1"
          :style="{ display: 'inline-flex', alignItems: 'center' }"
        >
          <span
            :style="{
              width: '10px',
              height: '10px',
              display: 'flex',
              backgroundColor: item.hoverBackgroundColor,
              borderRadius: '50%',
              margin: '0px 6.5px',
            }"
          />
          {{ item.label }}
        </li>
      </ul>
    </CardBarChart>
  </sdCards>
</template>
<script>
import { CardBarChart } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { customTooltips } from '../../../../components/utilities/utilities';
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';

const CashFlow = defineComponent({
  name: 'CashFlow',
  components: { CardBarChart, Chart },
  setup() {
    const { state, dispatch } = useStore();
    const cashFlowActive = ref('year');

    onMounted(() => dispatch('cashFlowGetData'));

    const handleActiveChangeCash = (event, value) => {
      event.preventDefault();
      cashFlowActive.value = value;
      dispatch('cashFlowFilterData', value);
    };

    const cashFlowState = computed(() => state.chartContent.cashFlowData);
    const cfIsLoading = computed(() => state.chartContent.cfLoading);
    const chartOptions = computed(() => {
      return {
        maintainAspectRatio: true,
        responsive: true,
        layout: {
          padding: {
            top: 20,
          },
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
                fontSize: 12,
                fontColor: '#182b49',
                max: Math.max(...state.chartContent.cashFlowData.dataIn),
                stepSize: Math.floor(Math.max(...state.chartContent.cashFlowData.dataIn) / 5),
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
                zeroLineColor: '#fff',
                color: 'transparent',
                z: 1,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: '#182b49',
              },
            },
          ],
        },
        tooltips: {
          mode: 'label',
          intersect: false,
          position: 'average',
          enabled: false,
          custom: customTooltips,
          callbacks: {
            label(t, d) {
              const dstLabel = d.datasets[t.datasetIndex].label;
              const { yLabel } = t;
              return `<span class="chart-data">${yLabel}</span> <span class="data-label">${dstLabel}</span>`;
            },
            labelColor(tooltipItem, chart) {
              const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                backgroundColor: dataset.hoverBackgroundColor,
                borderColor: 'transparent',
                usePointStyle: true,
              };
            },
          },
        },
      };
    });
    const cashFlowDataset = ref(false);

    onMounted(() => {
      cashFlowDataset.value = cashFlowState.value
        ? [
            {
              data: cashFlowState.value.dataIn,
              backgroundColor: '#20C99770',
              hoverBackgroundColor: '#20C997',
              label: 'Cash in',
              maxBarThickness: 10,
              barThickness: 12,
            },
            {
              data: cashFlowState.value.dataOut,
              backgroundColor: '#FF4D4F70',
              hoverBackgroundColor: '#FF4D4F',
              label: 'Cash out',
              maxBarThickness: 10,
              barThickness: 12,
            },
          ]
        : false;
    });

    return {
      cashFlowState,
      cfIsLoading,
      cashFlowActive,
      customTooltips,
      chartOptions,
      handleActiveChangeCash,
      cashFlowDataset,
    };
  },
});

export default CashFlow;
</script>
