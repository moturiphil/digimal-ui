<template>
  <IncomeExpenseWrapper>
    <sdCards v-if="incomeState !== null" more>
      <template #title
        ><div>Income And Expenses <span>Nov 23, 2019 - Nov 29, 2019</span></div></template
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
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="incomeFlowActive === 'week' ? 'active' : 'regular'">
              <router-link @click="() => handleActiveChangeIncome('week')" to="#"> Week </router-link>
            </li>
            <li :class="incomeFlowActive === 'month' ? 'active' : 'regular'">
              <router-link @click="() => handleActiveChangeIncome('month')" to="#"> Month </router-link>
            </li>
            <li :class="incomeFlowActive === 'year' ? 'active' : 'regular'">
              <router-link @click="() => handleActiveChangeIncome('year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>

      <div v-if="isIcLoading" class="sd-spin">
        <a-spin />
      </div>

      <a-row v-else :gutter="25">
        <a-col :xxl="6" :sm="24">
          <ExList>
            <div>
              <p>Total income</p>
              <sdHeading as="h1">
                <span>${{ incomeState.total[0] }}</span>
                <sub>
                  <span> <sdFeatherIcons type="arrow-up" /> 37% </span>
                  Since last month
                </sub>
              </sdHeading>
            </div>
            <div>
              <p>Total expenses</p>
              <sdHeading as="h1">
                <span>${{ incomeState.sale[0] }}</span>
                <sub class="growth-downward">
                  <span> <sdFeatherIcons type="arrow-down" /> 25% </span>
                  Since last month
                </sub>
              </sdHeading>
            </div>
            <div>
              <p>Cost of goods sold</p>
              <sdHeading as="h1">
                <span>${{ incomeState.expense[0] }}</span>
                <sub>
                  <span> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  Since last month
                </sub>
              </sdHeading>
            </div>
            <div>
              <p>Net profit</p>
              <sdHeading as="h1">
                <span>${{ incomeState.profit[0] }}</span>
                <sub>
                  <span> <sdFeatherIcons icon="arrow-up" /> 25% </span>
                  Since last month
                </sub>
              </sdHeading>
            </div>
          </ExList>
        </a-col>
        <a-col :xxl="18" :xs="24">
          <sdChartContainer class="parentContainer">
            <Chart
              type="bar"
              class="incomeExpanse"
              :labels="incomeState.labels"
              :datasets="incomeDataset"
              :height="88"
              :style="{
                marginBottom: '0',
              }"
              :options="{
                maintainAspectRatio: true,
                responsive: true,
                legend: {
                  display: false,
                  position: 'bottom',
                  labels: {
                    boxWidth: 6,
                    display: true,
                    usePointStyle: true,
                  },
                  align: 'start',
                },
                layout: {
                  padding: {
                    left: '0',
                    right: 0,
                    top: 0,
                    bottom: '0',
                  },
                },
                ...toolTips,
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
                        max: Math.max(...incomeState.sale[1]),
                        stepSize: Math.max(...incomeState.sale[1]) / 5,
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
                        fontSize: 13,
                        fontColor: '#182b49',
                      },
                    },
                  ],
                },
              }"
            />
          </sdChartContainer>
          <ul v-if="incomeDataset" class="chart-dataIndicator">
            <li
              v-for="(item, index) in incomeDataset"
              :key="index + 1"
              :style="{ display: 'inline-flex', alignItems: 'center' }"
            >
              <span
                :style="{
                  width: '10px',
                  height: '10px',
                  display: 'flex',
                  backgroundColor: item.hoverBackgroundColor,
                  borderRadius: '50%',
                  margin: '0px 5px',
                }"
              />
              {{ item.label }}
            </li>
          </ul>
        </a-col>
      </a-row>
    </sdCards>
  </IncomeExpenseWrapper>
</template>
<script>
import { ExList, IncomeExpenseWrapper } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { customTooltips } from '../../../../components/utilities/utilities';
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';

const IncomeAndExpenses = defineComponent({
  name: 'IncomeAndExpenses',
  components: { ExList, IncomeExpenseWrapper, Chart },
  setup() {
    const { state, dispatch } = useStore();
    const incomeFlowActive = ref('year');
    onMounted(() => dispatch('incomeGetData'));
    const handleActiveChangeIncome = (value) => {
      incomeFlowActive.value = value;
      return dispatch('incomeFilterData', value);
    };
    const incomeState = computed(() => state.chartContent.incomeData);
    const isIcLoading = computed(() => state.chartContent.icLoading);
    const incomeDataset = computed(() => [
      {
        data: state.chartContent.incomeData.total[1],
        backgroundColor: '#5F63F250',
        hoverBackgroundColor: '#5F63F2',
        label: 'Total Income',
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.sale[1],
        backgroundColor: '#FF69A550',
        hoverBackgroundColor: '#FF69A5',
        label: 'Cost of goods sold',
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.expense[1],
        backgroundColor: '#FA8B0C40',
        hoverBackgroundColor: '#FA8B0C',
        label: 'Total expenses',
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.profit[1],
        backgroundColor: '#20C99740',
        hoverBackgroundColor: '#20C997',
        label: 'Net profit',
        barPercentage: 0.6,
      },
    ]);

    return {
      incomeState,
      isIcLoading,
      incomeFlowActive,
      incomeDataset,
      handleActiveChangeIncome,
      toolTips: {
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
      },
    };
  },
});

export default IncomeAndExpenses;
</script>
