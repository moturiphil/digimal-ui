<template>
  <a-row :gutter="25">
    <a-col :md="12">
      <Focard>
        <div class="forcast-card-box">
          <sdCards headless title="Net Profit">
            <div class="focard-details growth-downward">
              <sdHeading as="h1">$25.3k</sdHeading>
              <p class="focard-status">
                <span class="focard-status__percentage"> <sdFeatherIcons type="arrow-down" /> 25% </span>
                <span>Since last month</span>
              </p>
            </div>
            <sdChartContainer class="parentContainer">
              <chartjs
                type="line"
                class="netProfit"
                id="netProfit"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'july', 'Aug', 'Sep', 'Oct']"
                :datasets="[
                  {
                    data: [30, 10, 20, 25, 20, 30, 15, 25, 15, 10],
                    label: 'Net',
                    borderColor: '#5F63F2',
                    borderWidth: 3,
                    fill: true,
                    pointHoverBackgroundColor: '#5F63F2',
                    pointHoverBorderWidth: 0,
                    pointHoverBorderColor: 'transparent',
                    backgroundColor: () => chartMethods('netProfit', ['#5F63F212', '#5F63F202']),
                  },
                ]"
                :options="areaChartOption"
                :height="80"
              />
            </sdChartContainer>
          </sdCards>
        </div>
      </Focard>
    </a-col>
    <a-col :md="12">
      <Focard>
        <div class="forcast-card-box">
          <sdCards headless title="Gross Profit">
            <div class="focard-details growth-upward">
              <sdHeading as="h1">$82.24k</sdHeading>
              <p class="focard-status">
                <span class="focard-status__percentage"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                <span>Since last month</span>
              </p>
            </div>
            <sdChartContainer class="parentContainer">
              <chartjs
                id="grossProfit"
                class="grossProfit"
                type="line"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'july', 'Aug', 'Sep', 'Oct']"
                :datasets="[
                  {
                    data: [30, 10, 20, 25, 20, 30, 15, 25, 15, 10],
                    label: 'Gross',
                    borderColor: '#20C997',
                    borderWidth: 3,
                    fill: true,
                    pointHoverBackgroundColor: '#20c997',
                    pointHoverBorderWidth: 0,
                    pointHoverBorderColor: 'transparent',
                    backgroundColor: () => chartMethods('grossProfit', ['#20C99712', '#20C99702']),
                  },
                ]"
                :height="80"
                :options="areaChartOption"
              />
            </sdChartContainer>
          </sdCards>
        </div>
      </Focard>
    </a-col>
    <a-col :md="12" :sm="12" :xs="24">
      <RatioCard>
        <sdCards headless title="Quick Ratio">
          <div class="ratio-content">
            <sdHeading as="h1">1.8</sdHeading>
            <a-progress :percent="80" class="progress-success" />
            <p><strong>1 or higher</strong> quick ratio target</p>
          </div>
        </sdCards>
      </RatioCard>
    </a-col>
    <a-col :md="12" :sm="12" :xs="24">
      <RatioCard>
        <sdCards headless title="Current Ratio">
          <div class="ratio-content">
            <sdHeading as="h1">2.4</sdHeading>
            <a-progress :percent="72" class="ant-progress-status-warning" />
            <p><strong>3 or higher</strong> current ratio target</p>
          </div>
        </sdCards>
      </RatioCard>
    </a-col>
  </a-row>
</template>
<script>
import { Focard, RatioCard } from '../../style';
import Chart from '../../../../components/utilities/chartjs';
import { chartLinearGradient, customTooltips } from '../../../../components/utilities/utilities';
import { defineComponent } from 'vue';

const CardGroup = defineComponent({
  name: 'CardGroup',
  components: { Focard, RatioCard, chartjs: Chart },
  methods: {
    chartMethods(elementId, color) {
      return chartLinearGradient(document.querySelector(`.${elementId}`), 80, {
        start: color[0],
        end: color[1],
      });
    },
  },
  data() {
    return {
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

export default CardGroup;
</script>
