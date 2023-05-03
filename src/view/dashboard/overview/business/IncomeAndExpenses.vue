<template>
  <IncomeExpenseWrapper>
    <sdCards v-if="incomeState !== null" more>
      <template #title
        ><div>HouseHolds MassNet <span>Bungoma Pilot</span></div></template
      >
      <div v-if="isIcLoading" class="sd-spin">
        <a-spin />
      </div>

      <a-row v-else :gutter="25">
        <a-col :xxl="6" :sm="24">
          <ExList>
            <div>
              <p>Bukengele Coverage Per Capita</p>
              <sdHeading as="h1">
                <span>59.8 %</span>
              </sdHeading>
            </div>
            <div>
              <p>Mufungu Coverage Per Capita</p>
              <sdHeading as="h1">
                <span>40.2 %</span>
              </sdHeading>
            </div>
          </ExList>
        </a-col>
        <a-col :xxl="24" :xs="24">
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
                        max: Math.max(...incomeState.population[1]),
                        stepSize: Math.max(...incomeState.population[1]) / 5,
                        callback(label) {
                          return `${label}`;
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
import { IncomeExpenseWrapper, ExList, } from "../../style";
import Chart from "../../../../components/utilities/chartjs";
import { customTooltips } from "../../../../components/utilities/utilities";
import { computed, onMounted, ref, defineComponent } from "vue";
import { useStore } from "vuex";
import authHeader from "../../../../services/auth-header";


const IncomeAndExpenses = defineComponent({
  name: "HouseHolds Registration",
  components: {  IncomeExpenseWrapper, Chart, ExList },
  setup() {
    const { state, dispatch } = useStore();
    const incomeFlowActive = ref("year");
    // onMounted(() => dispatch('incomeGetData'));

    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);


    onMounted(async () => {
      dispatch("incomeGetData");
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/dash_stats`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        console.log("Endpoint working...............");
        const data = await response.json();
        console.log(data);
        active_events.value = data.active_events;
        nets_distributed.value = data.nets_distributed;
        registered_house_holds.value = data.registered_house_holds;
        registered_users.value = data.registered_users;
        household_population.value = data.all_hh_members;
        total_nets_required.value = data.sys_allocation;
        activities.value = data.active_activities;
      } catch (error) {
        console.error(error);
      }
    });
    const handleActiveChangeIncome = (value) => {
      incomeFlowActive.value = value;
      return dispatch("incomeFilterData", value);
    };
    const incomeState = computed(() => state.chartContent.incomeData);
    const isIcLoading = computed(() => state.chartContent.icLoading);
    const incomeDataset = computed(() => [
      {
        data: state.chartContent.incomeData.hh[1],
        backgroundColor: "#5F63F250",
        hoverBackgroundColor: "#5F63F2",
        label: "Total Registered HouseHolds",
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.population[1],
        backgroundColor: "#FF69A550",
        hoverBackgroundColor: "#FF69A5",
        label: "Total Population",
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.nets_req[1],
        backgroundColor: "#FA8B0C40",
        hoverBackgroundColor: "#FA8B0C",
        label: "Total Nets Required",
        barPercentage: 0.6,
      },
      {
        data: state.chartContent.incomeData.nets_dist[1],
        backgroundColor: "#20C99740",
        hoverBackgroundColor: "#20C997",
        label: "Total Nets Distributed",
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
          mode: "label",
          intersect: false,
          position: "average",
          enabled: false,
          custom: customTooltips,
          callbacks: {
            label(t, d) {
              const dstLabel = d.datasets[t.datasetIndex].label;
              const { yLabel } = t;
              return `<span class="chart-data">${yLabel}</span> <span class="data-label">${dstLabel}</span>`;
            },
            labelColor(tooltipItem, chart) {
              const dataset =
                chart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                backgroundColor: dataset.hoverBackgroundColor,
                borderColor: "transparent",
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
