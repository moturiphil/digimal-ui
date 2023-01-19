<template>
  <div>
    <sdPageHeader title="Chart Js">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <sdCalendarButton />
          <sdExportButton />
          <sdShareButton />
          <sdButton size="small" type="primary">
            <sdFeatherIcons type="plus" size="14" />
            Add New
          </sdButton>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Bar Chart">
            <Chart class="bar" />
          </sdCards>
          <sdCards title="Stacked Chart">
            <Chart class="stacked" :options="stackedOption" />
          </sdCards>
          <sdCards title="Area Chart">
            <sdChartContainer class="parentContainer">
              <Chart type="line" :options="areaChartOption" :datasets="areaChartData" class="areaChart" />
            </sdChartContainer>
          </sdCards>
          <sdCards title="Donut Chart">
            <sdChartContainer class="parentContainer">
              <Chart
                type="doughnut"
                :label="['Jan', 'Feb', 'Mar', 'Apr', 'May']"
                :options="{
                  cutoutPercentage: 70,
                  maintainAspectRatio: true,
                  responsive: true,
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                  },
                }"
                :datasets="[
                  {
                    data: [20, 20, 30, 5, 25],
                    backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
                  },
                ]"
                class="donutChart"
              />
            </sdChartContainer>
          </sdCards>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Horizontal Chart">
            <Chart type="horizontalBar" class="horizontalChart" :options="horizontalOption" />
          </sdCards>
          <sdCards title="Line Chart">
            <sdChartContainer class="parentContainer">
              <Chart type="line" class="lineChart" :options="lineChartOption" :datasets="lineChartData" />
            </sdChartContainer>
          </sdCards>
          <sdCards title="Transparent Chart">
            <sdChartContainer class="parentContainer">
              <Chart
                type="bar"
                class="transparentChart"
                :options="transparentChartOption"
                :datasets="transparentChartData"
              />
            </sdChartContainer>
          </sdCards>
          <sdCards title="Pie Chart">
            <sdChartContainer class="parentContainer">
              <Chart
                type="pie"
                :label="['Jan', 'Feb', 'Mar', 'Apr', 'May']"
                :options="{
                  maintainAspectRatio: true,
                  responsive: true,
                  legend: {
                    display: false,
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                  },
                }"
                :datasets="[
                  {
                    data: [20, 20, 30, 5, 25],
                    backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
                  },
                ]"
                class="pieChart"
              />
            </sdChartContainer>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import Chart from '../../components/utilities/chartjs';
import { customTooltips } from '../../components/utilities/utilities';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Chartjs',
  components: {
    Main,
    Chart,
  },
  data() {
    return {
      stackedOption: {
        maintainAspectRatio: true,
        responsive: true,
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
                color: '#e5e9f2',
              },
              ticks: {
                beginAtZero: true,
                fontSize: 10,
                fontColor: '#182b49',
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
                fontColor: '#182b49',
              },
            },
          ],
        },
      },
      horizontalOption: {
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: false,
          labels: {
            display: false,
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 10,
                fontColor: '#182b49',
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                color: '#e5e9f2',
              },

              ticks: {
                beginAtZero: true,
                fontSize: 11,
                fontColor: '#182b49',
                max: 100,
              },
            },
          ],
        },
      },
      lineChartOption: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: '-10',
            right: 0,
            top: 0,
            bottom: '-10',
          },
        },
        legend: {
          display: false,
          labels: {
            display: false,
          },
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
      lineChartData: [
        {
          data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
          borderColor: '#001737',
          borderWidth: 1,
          fill: false,
          label: 'Lose',
        },
        {
          data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
          borderColor: '#1ce1ac',
          borderWidth: 1,
          fill: false,
          label: 'Profit',
        },
      ],
      areaChartData: [
        {
          data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
          borderColor: '#001737',
          borderWidth: 1,
          fill: true,
          label: 'Lose',
          backgroundColor: '#00173750',
          pointHoverBorderColor: 'transparent',
        },
        {
          data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
          borderColor: '#1ce1ac',
          borderWidth: 1,
          fill: true,
          label: 'Profit',
          backgroundColor: '#1ce1ac50',
          pointHoverBorderColor: 'transparent',
        },
      ],
      areaChartOption: {
        maintainAspectRatio: true,
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
      transparentChartData: [
        {
          data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
          backgroundColor: 'rgba(0,23,55, .5)',
          label: 'Profit',
          barPercentage: 0.6,
        },
        {
          data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
          backgroundColor: 'rgba(28,225,172, .5)',
          label: 'Lose',
          barPercentage: 0.6,
        },
      ],
      transparentChartOption: {
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            boxWidth: 6,
            display: true,
            usePointStyle: true,
          },
        },
        layout: {
          padding: {
            left: '0',
            right: 0,
            top: 0,
            bottom: '0',
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color: '#e5e9f2',
              },
              ticks: {
                beginAtZero: true,
                fontSize: 13,
                fontColor: '#182b49',
                max: 80,
                stepSize: 20,
                callback(value) {
                  return `${value}k`;
                },
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 13,
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
                backgroundColor: dataset.backgroundColor,
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
