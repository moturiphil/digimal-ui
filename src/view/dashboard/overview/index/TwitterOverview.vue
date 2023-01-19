<template>
  <LineChartWrapper>
    <sdCards v-if="twitterOverviewState !== null" title="Twitter Overview">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="twitterOverviewTabActive === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTwitter(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="twitterOverviewTabActive === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTwitter(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="twitterOverviewTabActive === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTwitter(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>

      <div v-if="twIsLoading" class="sd-spin">
        <a-spin />
      </div>

      <div v-else class="overview-container">
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-downward">
              <p>Tweets</p>
              <sdHeading as="h4">
                {{ twitterOverviewState.twist.data }}
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
                      data: twitterOverviewState.twist.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="twist"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>Tweet impressions</p>
              <sdHeading as="h4">
                {{ twitterOverviewState.impressions.data }}
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
                      data: twitterOverviewState.impressions.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="impressions"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-downward">
              <p>Retweets</p>
              <sdHeading as="h4">
                {{ twitterOverviewState.retweets.data }}
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
                      data: twitterOverviewState.retweets.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="retweets"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>Engagement rate</p>
              <sdHeading as="h4">
                {{ twitterOverviewState.rate.data }}
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
                      data: twitterOverviewState.rate.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="rate"
                />
              </sdChartContainer>
            </div>
          </a-col>
        </a-row>
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-upward">
              <p>New followers</p>
              <sdHeading as="h4">
                {{ twitterOverviewState.followers.data }}
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
                      data: twitterOverviewState.followers.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="followers"
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

const TwitterOverview = {
  name: 'TwitterOverview',
  components: {
    Chart,
    LineChartWrapper,
    ChartContainer,
  },
  setup() {
    const { state, dispatch } = useStore();
    const twitterOverviewTabActive = ref('month');
    onMounted(() => dispatch('twitterOverviewGetData'));

    const twitterOverviewState = computed(() => state.chartContent.twitterOverviewData);
    const twIsLoading = computed(() => state.chartContent.twLoading);

    const handleActiveChangeTwitter = (event, value) => {
      event.preventDefault();
      twitterOverviewTabActive.value = value;
      return dispatch('twitterOverviewFilterData', value);
    };

    return {
      twitterOverviewTabActive,
      twitterOverviewState,
      twIsLoading,
      chartOptions,
      lineChartPointStyle,
      handleActiveChangeTwitter,
    };
  },
};

export default TwitterOverview;
</script>
