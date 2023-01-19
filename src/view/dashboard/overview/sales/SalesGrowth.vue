<template>
  <SalesGrowthWrap>
    <sdCards more title="Monthly Sales Growth">
      <template #more>
        <router-link to="#">
          <sdFeatherIcons size="16" type="printer" />
          <span>Printer</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="book-open" />
          <span>PDF</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file-text" />
          <span>Google Sheets</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="x" />
          <span>Excel (XLSX)</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file" />
          <span>CSV</span>
        </router-link>
      </template>
      <a-row>
        <a-col :xs="24">
          <div class="growth-list d-flex justify-content-between">
            <div class="growth-list__item">
              <h2>70%</h2>
              <p>Progress</p>
            </div>
            <div class="growth-list__item">
              <h2>20%</h2>
              <p>Target</p>
            </div>
          </div>
          <div class="growth-chart-wrap">
            <Chartjs
              class="growth"
              type="bar"
              :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
              :datasets="[
                {
                  data: [20, 60, 50, 45, 50, 60, 70, 60, 65, 75, 70, 80],
                  backgroundColor: '#5F63F250',
                  hoverBackgroundColor: '#5F63F2',
                  maxBarThickness: 10,
                  barThickness: 12,
                  label: 'Orders',
                  barPercentage: 1,
                },
              ]"
              :options="chartOptions"
              :height="180"
            />
          </div>
        </a-col>
      </a-row>
    </sdCards>
  </SalesGrowthWrap>
</template>
<script>
import { SalesGrowthWrap } from '../../style';
import Chartjs from '../../../../components/utilities/chartjs';
import { defineComponent } from 'vue';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
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
          display: true,
        },
      },
    ],
  },
};

const SalesGrowth = defineComponent({
  name: 'SalesGrowth',
  components: { SalesGrowthWrap, Chartjs },
  data() {
    return {
      chartOptions,
    };
  },
});

export default SalesGrowth;
</script>
