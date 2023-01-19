<template>
  <LineChartWrapper>
    <sdCards v-if="linkdinOverviewState !== null" title="Linkedin Key Metrics">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="linkdinOverviewTabActive === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeLinkdin(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="linkdinOverviewTabActive === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeLinkdin(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="linkdinOverviewTabActive === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeLinkdin(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>

      <div v-if="liIsLoading" class="sd-spin">
        <a-spin />
      </div>

      <div v-else class="overview-container">
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-downward">
              <p>Clicks</p>
              <sdHeading as="h4">
                {{ linkdinOverviewState.post.data }}
                <sub>
                  <sdFeatherIcons type="arrow-down" :size="14" />
                  25%
                </sub>
              </sdHeading>
            </div>
          </a-col>
          <a-col :xxl="14" :xs="24">
            <div class="border-linechart">
              <sdChartContainer class="parentContainer">
                <Chart
                  type="line"
                  :height="48"
                  :style="{
                    marginBottom: '0',
                  }"
                  :datasets="[
                    {
                      data: linkdinOverviewState.post.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="Clicks"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>Like</p>
              <sdHeading as="h4">
                {{ linkdinOverviewState.like.data }}
                <sub>
                  <sdFeatherIcons type="arrow-up" size="14" />
                  108%
                </sub>
              </sdHeading>
            </div>
          </a-col>
          <a-col :xxl="14" :xs="24">
            <div class="border-linechart">
              <sdChartContainer class="parentContainer">
                <Chart
                  type="line"
                  :height="48"
                  :style="{
                    marginBottom: '0',
                  }"
                  :datasets="[
                    {
                      data: linkdinOverviewState.like.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="liLike"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-downward">
              <p>Comments</p>
              <sdHeading as="h4">
                {{ linkdinOverviewState.comments.data }}
                <sub>
                  <sdFeatherIcons icon="arrow-down" size="14" />
                  30%
                </sub>
              </sdHeading>
            </div>
          </a-col>
          <a-col :xxl="14" :xs="24">
            <div class="border-linechart">
              <sdChartContainer class="parentContainer">
                <Chart
                  type="line"
                  :height="48"
                  :style="{
                    marginBottom: '0',
                  }"
                  :datasets="[
                    {
                      data: linkdinOverviewState.comments.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="liRetweet"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>New Followers</p>
              <sdHeading as="h4">
                {{ linkdinOverviewState.rate.data }}
                <sub>
                  <sdFeatherIcons type="arrow-up" size="14" />
                  34%
                </sub>
              </sdHeading>
            </div>
          </a-col>
          <a-col :xxl="14" :xs="24">
            <div class="border-linechart">
              <sdChartContainer class="parentContainer">
                <Chart
                  type="line"
                  :height="48"
                  :style="{
                    marginBottom: '0',
                  }"
                  :datasets="[
                    {
                      data: linkdinOverviewState.rate.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="liRates"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>Following</p>
              <sdHeading as="h4">
                {{ linkdinOverviewState.followers.data }}
                <sub>
                  <sdFeatherIcons type="arrow-up" size="14" />
                  27%
                </sub>
              </sdHeading>
            </div>
          </a-col>
          <a-col :xxl="14" :xs="24">
            <div class="border-linechart">
              <sdChartContainer class="parentContainer">
                <Chart
                  type="line"
                  :height="48"
                  :style="{
                    marginBottom: '0',
                  }"
                  :datasets="[
                    {
                      data: linkdinOverviewState.followers.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="liFollower"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
      </div>
    </sdCards>
  </LineChartWrapper>
</template>
<script>
import { LineChartWrapper, ChartContainer } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { customTooltips } from '../../../../components/utilities/utilities';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const lineChartPointStyle = {
  borderColor: '#C6D0DC',
  borderWidth: 2,
  fill: false,
  pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
  pointBackgroundColor: [
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    '#20C997',
  ],
  pointHoverBackgroundColor: '#20C997',
  pointHoverRadius: 6,
  pointBorderColor: 'transparent',
};

const chartOptions = {
  tooltips: {
    yAlign: 'bottom',
    xAlign: 'center',
    mode: 'nearest',
    position: 'nearest',
    intersect: false,
    enabled: false,
    custom: customTooltips,
    callbacks: {
      labelColor() {
        return {
          backgroundColor: '#20C997',
        };
      },
    },
  },
  hover: {
    mode: 'nearest',
    intersect: false,
  },
  layout: {
    padding: {
      left: '0',
      right: 8,
      top: 15,
      bottom: -10,
    },
  },
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    display: false,
    labels: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0,
    },
  },
  scales: {
    yAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [8, 4],
          zeroLineColor: 'transparent',
          beginAtZero: true,
        },
        ticks: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [8, 4],
          zeroLineColor: 'transparent',
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};

const LinkedinKeyMetrics = {
  name: 'LinkedinKeyMetrics',
  components: {
    Chart,
    LineChartWrapper,
    ChartContainer,
  },
  setup() {
    const { state, dispatch } = useStore();
    const linkdinOverviewTabActive = ref('month');

    const linkdinOverviewState = computed(function () {
      return state.chartContent.linkdinOverviewData;
    });
    const liIsLoading = computed(function () {
      return state.chartContent.liLoading;
    });

    onMounted(function () {
      dispatch('linkdinOverviewGetData');
    });

    function handleActiveChangeLinkdin(event, value) {
      event.preventDefault();
      linkdinOverviewTabActive.value = value;
      return dispatch('linkdinOverviewFilterData', value);
    }

    return {
      chartOptions,
      lineChartPointStyle,
      linkdinOverviewTabActive,
      linkdinOverviewState,
      liIsLoading,
      handleActiveChangeLinkdin,
    };
  },
};

export default LinkedinKeyMetrics;
</script>
