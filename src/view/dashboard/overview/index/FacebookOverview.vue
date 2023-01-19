<template>
  <CardGroup>
    <div class="forcast-overview">
      <sdCards v-if="forcastOverviewState !== null" title="Facebook Overview">
        <template #button>
          <div class="card-radio">
            <a-radio-group @change="forcastOverview" v-model:value="value">
              <a-radio-button value="today">Today</a-radio-button>
              <a-radio-button value="week">Week</a-radio-button>
              <a-radio-button value="month">Month</a-radio-button>
              <a-radio-button value="year">Year</a-radio-button>
            </a-radio-group>
          </div>
        </template>

        <div v-if="foIsLoading" class="sd-spin">
          <a-spin />
        </div>

        <a-row v-else :gutter="25">
          <a-col :xl="12" :md="24">
            <a-row class="focard-wrapper focard-divider">
              <a-col :md="12" :sm="12" :xs="24">
                <Focard>
                  <div class="focard-details growth-upward">
                    <sdHeading as="h1">{{ forcastOverviewState.Engaged }}</sdHeading>
                    <p class="subtitle">Engaged Users</p>
                    <p class="focard-status">
                      <span class="focard-status__percentage">
                        <sdFeatherIcons type="trending-up" />
                        25%
                      </span>
                      <span> 20,641 (prev)</span>
                    </p>
                  </div>
                  <div class="focard-chart">
                    <sdChartContainer class="parentContainer">
                      <Chart
                        type="line"
                        :labels="forcastOverviewState.EnLabels"
                        :options="areaChartOption"
                        :style="{
                          marginBottom: '0',
                        }"
                        :datasets="[
                          {
                            label: '',
                            data: forcastOverviewState.EnData,
                            borderColor: '#20C997',
                            borderWidth: 3,
                            fill: true,
                            backgroundColor: () => chartMethods('engaged', ['#20C99710', '#20C99701']),
                            pointHoverRadius: 0,
                            pointHoverBorderColor: 'transparent',
                          },
                        ]"
                        :height="height"
                        class="engaged"
                        id="engaged"
                      />
                    </sdChartContainer>
                  </div>
                </Focard>
              </a-col>
              <a-col :md="12" :sm="12" :xs="24">
                <Focard>
                  <div class="focard-details growth-upward">
                    <sdHeading as="h1">{{ forcastOverviewState.Impressions }}</sdHeading>
                    <p class="subtitle">Page Impressions</p>
                    <p class="focard-status">
                      <span class="focard-status__percentage">
                        <sdFeatherIcons type="trending-up" />
                        14%
                      </span>
                      <span> 20,641 (prev)</span>
                    </p>
                  </div>
                  <div class="focard-chart">
                    <sdChartContainer class="parentContainer">
                      <Chart
                        type="line"
                        id="impression"
                        class="impression"
                        :labels="forcastOverviewState.ImLabels"
                        :options="areaChartOption"
                        :style="{
                          marginBottom: '0',
                        }"
                        :datasets="[
                          {
                            label: '',
                            data: forcastOverviewState.ImData,
                            borderColor: '#FF69A5',

                            borderWidth: 3,
                            fill: true,
                            backgroundColor: () => chartMethods('impression', ['#FF69A510', '#FF69A501']),
                            pointHoverRadius: 0,
                            pointHoverBorderColor: 'transparent',
                          },
                        ]"
                        :height="height"
                      />
                    </sdChartContainer>
                  </div>
                </Focard>
              </a-col>
            </a-row>
          </a-col>
          <a-col :xl="12" :xs="24">
            <a-row class="focard-wrapper">
              <a-col :md="12" :sm="12">
                <Focard>
                  <div class="focard-details growth-downward">
                    <sdHeading as="h1">{{ forcastOverviewState.Like }}</sdHeading>
                    <p class="subtitle">Total Page Likes</p>
                    <p class="focard-status">
                      <span class="focard-status__percentage">
                        <sdFeatherIcons type="trending-down" />
                        12%
                      </span>
                      <span> 20,641 (prev)</span>
                    </p>
                  </div>
                  <div class="focard-chart">
                    <sdChartContainer class="parentContainer">
                      <Chart
                        type="line"
                        :labels="forcastOverviewState.LiLabels"
                        id="likes"
                        class="likes"
                        :options="areaChartOption"
                        :style="{
                          marginBottom: '0',
                        }"
                        :datasets="[
                          {
                            data: forcastOverviewState.LiData,
                            label: '',
                            borderColor: '#5F63F2',
                            borderWidth: 3,
                            fill: true,

                            backgroundColor: () => chartMethods('likes', ['#5F63F210', '#5F63F201']),
                            pointHoverRadius: 0,
                            pointHoverBorderColor: 'transparent',
                          },
                        ]"
                        :height="height"
                      />
                    </sdChartContainer>
                  </div>
                </Focard>
              </a-col>
              <a-col :md="12" :sm="12" :xs="24">
                <Focard>
                  <div class="focard-details growth-upward">
                    <sdHeading as="h1">{{ forcastOverviewState.Impressions2 }}</sdHeading>
                    <p class="subtitle">Page Impressions</p>
                    <p class="focard-status">
                      <span class="focard-status__percentage">
                        <sdFeatherIcons type="trending-up" />
                        14%
                      </span>
                      <span> 20,641 (prev)</span>
                    </p>
                  </div>
                  <div class="focard-chart">
                    <sdChartContainer class="parentContainer">
                      <Chart
                        type="line"
                        :labels="forcastOverviewState.ImLabels2"
                        id="impression2"
                        class="impression2"
                        :options="areaChartOption"
                        :style="{
                          marginBottom: '0',
                        }"
                        :datasets="[
                          {
                            data: forcastOverviewState.ImData2,
                            label: '',
                            borderColor: '#FA8B0C',
                            borderWidth: 3,
                            fill: true,
                            backgroundColor: () => chartMethods('impression2', ['#FA8B0C10', '#FA8B0C01']),
                            pointHoverRadius: 0,
                            pointHoverBorderColor: 'transparent',
                          },
                        ]"
                        :height="height"
                      />
                    </sdChartContainer>
                  </div>
                </Focard>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </sdCards>
    </div>
  </CardGroup>
</template>

<script>
import { Focard, CardGroup } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { chartLinearGradient, customTooltips } from '../../../../components/utilities/utilities';
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'FacebookOverview',
  components: {
    Focard,
    CardGroup,
    Chart,
  },
  setup() {
    const value = ref('today');
    const height = ref(null);
    const { dispatch, state } = useStore();

    onMounted(() => {
      height.value = window.innerWidth <= 1199 ? 100 : 115;
      dispatch('forcastOverviewGetData');
    });

    const forcastOverviewState = computed(() => state.chartContent.forcastData);
    const foIsLoading = computed(() => state.chartContent.foLoading);

    const chartMethods = (elementId, color) => {
      return chartLinearGradient(document.querySelector(`.${elementId}`), 165, {
        start: color[0],
        end: color[1],
      });
    };

    const forcastOverview = (e) => {
      dispatch('forcastOverviewFilterData', e.target.value);
    };

    return {
      value,
      height,
      forcastOverviewState,
      foIsLoading,
      chartMethods,
      forcastOverview,
      areaChartOption: {
        maintainAspectRatio: true,
        responsive: false,
        hover: {
          mode: 'nearest',
          intersect: false,
        },
        layout: {
          padding: {
            left: -10,
            right: 0,
            top: 2,
            bottom: -10,
          },
        },
        legend: {
          display: false,
          labels: {
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
                color: '#e5e9f2',
              },
              ticks: {
                beginAtZero: true,
                fontSize: 10,
                display: false,
                stepSize: 20,
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },

              ticks: {
                beginAtZero: true,
                fontSize: 11,
                display: false,
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
                backgroundColor: dataset.borderColor,
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
</script>
