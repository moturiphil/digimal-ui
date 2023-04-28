<template>
  <PerformanceChartWrapper>
    <sdCards v-if="performanceState !== null" more title="Campaign Performance">
      <Pstates>
        <div
          @click="() => onPerformanceTab('users')"
          :class="`growth-upward ${performanceTab === 'users' && 'active'}`"
          role="button"
        >
          <p>Bukengele Friends Church</p>
          <sdHeading as="h1">
            {{ bukengele_friends_church }}
            <sub>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('sessions')"
          :class="`growth-upward ${performanceTab === 'sessions' && 'active'}`"
          role="button"
        >
          <p>Bukengele SDA</p>
          <sdHeading as="h1">
            {{ bukengele_sda }}
            <sub>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('bounce')"
          :class="`growth-downward ${performanceTab === 'bounce' && 'active'}`"
          role="button"
        >
          <p>Mukholi Primary</p>
          <sdHeading as="h1">
            {{ mukholi_primary }}
            <sub>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('duration')"
          :class="`growth-upward ${performanceTab === 'duration' && 'active'}`"
          role="button"
        >
          <p>Renje Dispensery</p>
          <sdHeading as="h1">
            {{ ranje_dispensary }}
            <sub>
            </sub>
          </sdHeading>
        </div>
        <div
          @click="() => onPerformanceTab('duration')"
          :class="`growth-upward ${performanceTab === 'coverage' && 'active'}`"
          role="button"
        >
          <p>HouseHold Coverage</p>
          <sdHeading as="h1">
            {{ percentage_net_distribution}}
            <sub>
            </sub>
          </sdHeading>
        </div>
      </Pstates>
    </sdCards>
  </PerformanceChartWrapper>
</template>
<script>
import { useStore } from 'vuex';
import { computed, ref, onMounted, defineComponent } from 'vue';
import { PerformanceChartWrapper, Pstates } from '../../style';
import { chartLinearGradient, customTooltips } from '../../../../components/utilities/utilities';
import authHeader from "../../../../services/auth-header";


const WebsitePerformance = defineComponent({
  components: { PerformanceChartWrapper, Pstates },

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
    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);
    const bukengele_friends_church = ref(0);
    const bukengele_sda = ref(0);
    const mukholi_primary = ref(0);
    const ranje_dispensary = ref(0);
    const percentage_net_distribution = ref(0);
    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/dash_stats`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        active_events.value = data.active_events;
        nets_distributed.value = data.nets_distributed;
        registered_house_holds.value = data.registered_house_holds;
        registered_users.value = data.registered_users;
        household_population.value = data.all_hh_members;
        total_nets_required.value = data.sys_allocation;
        activities.value = data.active_activities;
        bukengele_friends_church.value = data.bukengele_friends_church;
        bukengele_sda.value = data.bukengele_sda;
        mukholi_primary.value = data.mukholi_primary;
        ranje_dispensary.value = data.ranje_dispensary;
        percentage_net_distribution.value = data.percentage_net_distribution;
      } catch (error) {
        console.error(error);
      }
    });

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
      active_events,
      nets_distributed,
      registered_house_holds,
      registered_users,
      household_population,
      total_nets_required,
      activities,
      bukengele_friends_church,
      bukengele_sda,
      mukholi_primary,
      ranje_dispensary,
      percentage_net_distribution
    };
  },
});

export default WebsitePerformance;
</script>
