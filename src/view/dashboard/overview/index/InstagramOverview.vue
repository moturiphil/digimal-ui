<template>
  <LineChartWrapper>
    <sdCards v-if="instagramOverviewState !== null" title="Instagram Overview">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="instagramOverviewTabActive === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeInstagram(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="instagramOverviewTabActive === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeInstagram(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="instagramOverviewTabActive === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeInstagram(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>

      <div v-if="inIsLoading" class="sd-spin">
        <a-spin />
      </div>

      <div v-else class="overview-container">
        <a-row class="line-chart-row">
          <a-col :xxl="10" :xs="24">
            <div class="growth-downward">
              <p>Post</p>
              <sdHeading as="h4">
                {{ instagramOverviewState.post.data }}
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
                      data: instagramOverviewState.post.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="post"
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
                {{ instagramOverviewState.like.data }}
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
                      data: instagramOverviewState.like.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="like"
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
                {{ instagramOverviewState.comments.data }}
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
                      data: instagramOverviewState.comments.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="retweet"
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
                {{ instagramOverviewState.rate.data }}
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
                      data: instagramOverviewState.rate.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="rates"
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
                {{ instagramOverviewState.followers.data }}
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
                      data: instagramOverviewState.followers.chartValue,
                      ...lineChartPointStyle,
                    },
                  ]"
                  :options="chartOptions"
                  class="follower"
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
import { ref, onMounted, computed } from 'vue';
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

const InstagramOverview = {
  name: 'InstagramOverview',
  components: {
    Chart,
    LineChartWrapper,
    ChartContainer,
  },
  setup() {
    const { state, dispatch } = useStore();
    const instagramOverviewTabActive = ref('month');

    onMounted(() => dispatch('instagramOverviewGetData'));

    const handleActiveChangeInstagram = (event, value) => {
      event.preventDefault();
      instagramOverviewTabActive.value = value;
      return dispatch('instagramOverviewFilterData', value);
    };

    const instagramOverviewState = computed(() => state.chartContent.instagramOverviewData);
    const inIsLoading = computed(() => state.chartContent.inLoading);

    return {
      instagramOverviewTabActive,
      handleActiveChangeInstagram,
      instagramOverviewState,
      inIsLoading,
      chartOptions,
      lineChartPointStyle,
    };
  },
};

export default InstagramOverview;
</script>
