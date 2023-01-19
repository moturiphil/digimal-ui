<template>
  <a-row :gutter="25">
    <a-col :xxl="8" :lg="12" :md="24" :sm="12" :xs="24">
      <sdCards headless>
        <EChartCard>
          <div class="card-chunk">
            <CardBarChart2>
              <sdHeading as="h1">7,461</sdHeading>
              <span>Orders</span>
              <p>
                <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                <span>Since last week</span>
              </p>
            </CardBarChart2>
          </div>
          <div class="card-chunk">
            <Chart
              :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
              :height="180"
              class="card-chunk4"
              :style="{
                marginBottom: '-5',
              }"
              :datasets="[
                {
                  data: [20, 60, 50, 45, 50, 60, 70],
                  backgroundColor: '#EFEFFE',
                  hoverBackgroundColor: '#5F63F2',
                  label: 'Orders',
                  barPercentage: 1,
                },
              ]"
              :options="chartOptions"
            />
          </div>
        </EChartCard>
      </sdCards>
    </a-col>
    <a-col :xxl="8" :lg="12" :md="24" :sm="12" :xs="24">
      <sdCards headless>
        <EChartCard>
          <div class="card-chunk">
            <CardBarChart2>
              <sdHeading as="h1">$28,947</sdHeading>
              <span>Revenue</span>
              <p>
                <span class="growth-downward"> <sdFeatherIcons type="arrow-down" /> 25% </span>
                <span>Since last week</span>
              </p>
            </CardBarChart2>
          </div>
          <div class="card-chunk">
            <Chart
              class="cardChunk2"
              :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
              :height="180"
              :style="{
                marginBottom: '-5',
              }"
              :datasets="[
                {
                  data: [20, 60, 50, 45, 50, 60, 70],
                  backgroundColor: '#FFF0F6',
                  hoverBackgroundColor: '#FF69A5',
                  label: 'Revenue',
                  barPercentage: 1,
                },
              ]"
              :options="chartOptions"
            />
          </div>
        </EChartCard>
      </sdCards>
    </a-col>
    <a-col :xxl="8" :lg="12" :md="24" :sm="12" :xs="24">
      <sdCards headless>
        <EChartCard>
          <div class="card-chunk">
            <CardBarChart2>
              <sdHeading as="h1">$3,241</sdHeading>
              <span>Avg. order value</span>
              <p>
                <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                <span>Since last week</span>
              </p>
            </CardBarChart2>
          </div>
          <div class="card-chunk">
            <Chart
              class="card-chunk3"
              :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
              :height="180"
              :style="{
                marginBottom: '-5',
              }"
              :datasets="[
                {
                  data: [20, 60, 50, 45, 50, 60, 70],
                  backgroundColor: '#E8FAF4',
                  hoverBackgroundColor: '#20C997',
                  label: 'Avg Orders',
                  barPercentage: 1,
                },
              ]"
              :options="chartOptions"
            />
          </div>
        </EChartCard>
      </sdCards>
    </a-col>
    <a-col :xs="24">
      <PerformanceChartWrapper v-if="performanceState !== null">
        <sdCards more title="General Statistics">
          <template #more>
            <a to="#">
              <sdFeatherIcons size="16" type="printer" />
              <span>Printer</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="book-open" />
              <span>PDF</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="file-text" />
              <span>Google Sheets</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="x" />
              <span>Excel (XLSX)</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="file" />
              <span>CSV</span>
            </a>
          </template>
          <div class="performance-lineChart">
            <sdChartContainer class="parentContainer">
              <Chart
                type="line"
                id="performance"
                class="performance"
                :labels="performanceState.labels"
                :datasets="performanceDatasets"
                :options="performanceOption"
                :height="height"
              />
            </sdChartContainer>
          </div>
        </sdCards>
      </PerformanceChartWrapper>
    </a-col>
    <a-col :xs="24">
      <ProductOverviewTable>
        <sdCards more title="My Products">
          <template #more>
            <a to="#">
              <sdFeatherIcons size="16" type="printer" />
              <span>Printer</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="book-open" />
              <span>PDF</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="file-text" />
              <span>Google Sheets</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="x" />
              <span>Excel (XLSX)</span>
            </a>
            <a to="#">
              <sdFeatherIcons size="16" type="file" />
              <span>CSV</span>
            </a>
          </template>
          <a-table class="table-responsive" :pagination="false" :dataSource="dataSource" :columns="columns" />
        </sdCards>
      </ProductOverviewTable>
    </a-col>
  </a-row>
</template>
<script>
import { ProductOverviewTable } from './style';
import { CardBarChart2, EChartCard, PerformanceChartWrapper } from '../../../dashboard/style';
import { chartLinearGradient, customTooltips } from '@/components/utilities/utilities';

import { computed, onMounted, defineComponent } from 'vue';
import Chart from '@/components/utilities/chartjs';
import { useStore } from 'vuex';

const chartOptions = {
  legend: {
    display: false,
    labels: {
      display: false,
    },
  },
  scales: {
    yAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
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
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};

const dataSource = [
  {
    key: '1',
    name: 'Samsung Galaxy S8 256GB',
    price: '$280',
    sold: 126,
    revenue: '$38,536',
  },
  {
    key: '2',
    name: 'Half Sleeve Shirt',
    price: '$25',
    sold: 80,
    revenue: '$38,536',
  },
  {
    key: '3',
    name: 'Marco Shoes',
    price: '$32',
    sold: 58,
    revenue: '$38,536',
  },
  {
    key: '4',
    name: '15" Mackbook Pro        ',
    price: '$950',
    sold: 36,
    revenue: '$38,536',
  },
  {
    key: '5',
    name: 'Apple iPhone X',
    price: '$985',
    sold: 24,
    revenue: '$38,536',
  },
];

const columns = [
  {
    title: 'Products Name',
    dataIndex: 'name',
    key: 'name',
    class: 'p_name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    class: 'p_price',
  },
  {
    title: 'Sold',
    dataIndex: 'sold',
    key: 'sold',
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];

const Overview = defineComponent({
  name: 'Overview',
  components: { CardBarChart2, EChartCard, PerformanceChartWrapper, ProductOverviewTable, Chart },
  setup() {
    const { state, dispatch } = useStore();

    const performanceState = computed(() => state.chartContent.performanceData);
    onMounted(() => dispatch('performanceGetData'));

    const performanceDatasets = computed(
      () =>
        performanceState.value !== null && [
          {
            data: performanceState.value.users[1],
            borderColor: '#5F63F2',
            borderWidth: 4,
            fill: true,
            backgroundColor: () =>
              chartLinearGradient(document.getElementById('performance'), 300, {
                start: '#5F63F230',
                end: '#ffffff05',
              }),
            label: 'Revenue',
            pointStyle: 'circle',
            pointRadius: '0',
            hoverRadius: '9',
            pointBorderColor: '#fff',
            pointBackgroundColor: '#5F63F2',
            hoverBorderWidth: 5,
          },
        ],
    );
    const performanceOption = {
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
            return 'General Statistics';
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
      chartOptions,
      dataSource,
      columns,
      performanceDatasets,
      customTooltips,
      height: window.innerWidth <= 575 ? 200 : 86,
      performanceOption,
    };
  },
});

export default Overview;
</script>
