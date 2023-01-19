<template>
  <a-col :lg="12" :md="12" :sm="24" :xs="24">
    <div class="account-card">
      <sdCards title="Account Receivable" more>
        <template #more>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="printer" />
            <span>Printer</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="book-open" />
            <span>PDF</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="file-text" />
            <span>Google Sheets</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="x" />
            <span>Excel (XLSX)</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="file" />
            <span>CSV</span>
          </router-link>
        </template>
        <Chart
          type="line"
          class="account"
          :labels="['Current', '1-30', '30-60', '60-90', '91+']"
          :datasets="[
            {
              data: [105, 145, 95, 149, 90],
              borderColor: '#FA8B0C',
              borderWidth: 3,
              fill: false,
              pointBackgroundColor: '#FA8B0C',
              pointBorderColor: '#fff',
              pointHoverBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverBorderWidth: 3,
              pointHoverRadius: 5,
              z: 5,
              label: 'Net',
            },
          ]"
          :height="height"
          :options="{
            legend: {
              display: false,
            },
            elements: {
              point: {
                radius: 5,
                z: 5,
              },
            },
            tooltips: { ...tooltips },
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
                    max: 200,
                    stepSize: 50,
                    padding: 10,
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
                  },
                },
              ],
            },
          }"
        />
      </sdCards>
    </div>
  </a-col>
  <a-col :lg="12" :md="12" :sm="24" :xs="24">
    <div class="account-card">
      <sdCards title="Account Payable" more>
        <template #more>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="printer" />
            <span>Printer</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="book-open" />
            <span>PDF</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="file-text" />
            <span>Google Sheets</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="x" />
            <span>Excel (XLSX)</span>
          </router-link>
          <router-link to="#">
            <sdFeatherIcons :size="16" type="file" />
            <span>CSV</span>
          </router-link>
        </template>
        <Chart
          type="line"
          class="payable"
          :labels="['Current', '1-30', '30-60', '60-90', '91+']"
          :datasets="[
            {
              data: [80, 160, 105, 140, 107],
              borderColor: '#2C99FF',
              borderWidth: 3,
              fill: false,
              pointBackgroundColor: '#2C99FF',
              pointBorderColor: '#fff',
              pointHoverBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverBorderWidth: 3,
              pointHoverRadius: 5,
              z: 5,
              label: 'Gross',
            },
          ]"
          :height="height"
          :options="{
            legend: {
              display: false,
            },
            elements: {
              point: {
                radius: 5,
                z: 5,
              },
            },

            tooltips: { ...tooltips },

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
                    max: 200,
                    stepSize: 50,
                    padding: 10,
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
                  },
                },
              ],
            },
          }"
        />
      </sdCards>
    </div>
  </a-col>
</template>
<script>
import Chart from '../../../../components/utilities/chartjs';
import { ref, defineComponent } from 'vue';

const AccountGroup = defineComponent({
  name: 'AccountGroup',
  components: { Chart },
  setup() {
    const height = ref(window.innerWidth <= 575 ? 230 : 100);
    return {
      tooltips: {
        mode: 'label',
        intersect: false,
        backgroundColor: '#ffffff',
        position: 'average',
        titleFontColor: '#5A5F7D',
        titleFontSize: 13,
        titleSpacing: 15,
        bodyFontColor: '#868EAE',
        bodyFontSize: 12,
        borderColor: '#F1F2F6',
        borderWidth: 2,
        bodySpacing: 15,
        xPadding: 15,
        yPadding: 15,
        z: 999999,
        custom(tooltip) {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
        callbacks: {
          title() {
            return `Account Receivable`;
          },
          label(t) {
            const { yLabel, xLabel } = t;
            return `${xLabel}: $${yLabel}k`;
          },
          labelColor() {
            return {
              backgroundColor: '#000',
              borderColor: 'transparent',
            };
          },
        },
      },
      height,
    };
  },
});

export default AccountGroup;
</script>
