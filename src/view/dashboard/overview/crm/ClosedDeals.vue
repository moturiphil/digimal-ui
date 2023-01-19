<template>
  <sdCards v-if="closeDealState" title="Closed Deals Performance">
    <template #button>
      <div class="card-nav">
        <ul>
          <li :class="closeDealTabActive === 'week' ? 'active' : 'deactivate'">
            <router-link @click="(e) => handleActiveChangeYoutube(e, 'week')" to="#"> Week </router-link>
          </li>
          <li :class="closeDealTabActive === 'month' ? 'active' : 'deactivate'">
            <router-link @click="(e) => handleActiveChangeYoutube(e, 'month')" to="#"> Month </router-link>
          </li>
          <li :class="closeDealTabActive === 'year' ? 'active' : 'deactivate'">
            <router-link @click="(e) => handleActiveChangeYoutube(e, 'year')" to="#"> Year </router-link>
          </li>
        </ul>
      </div>
    </template>

    <div v-if="cdIsLoading" class="sd-spin">
      <a-spin />
    </div>

    <CardBarChart v-else>
      <div class="deals-barChart">
        <div v-for="(item, key) in closeDealDatasets" :key="key + 1" class="card-bar-top">
          <h4>
            {{ item.label }}
            <p :class="item.percent >= 50 ? 'growth-up' : 'growth-down'">
              <span class="deal-value">{{ item.average }}</span>
              <span class="deal-percentage">
                <sdFeatherIcons :icon="item.percent >= 50 ? 'arrow-up' : 'arrow-down'" size="14" />
                {{ item.percent }}%
              </span>
            </p>
          </h4>
        </div>
      </div>

      <Chartjs
        class="closeDeal"
        :labels="closeDealState.labels"
        :datasets="closeDealDatasets"
        :options="{
          maintainAspectRatio: true,
          responsive: true,
          layout: {
            padding: {
              top: 20,
            },
          },
          legend: {
            display: false,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 6,
              display: true,
              usePointStyle: true,
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
                  fontSize: 12,
                  fontColor: '#182b49',
                  max: Math.max(...closeDealState.won),
                  stepSize: Math.max(...closeDealState.won) / 5,
                  display: true,
                  min: 0,
                  padding: 10,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: true,
                  zeroLineWidth: 2,
                  zeroLineColor: '#fff',
                  color: 'transparent',
                  z: 1,
                },
                ticks: {
                  beginAtZero: true,
                  fontSize: 12,
                  fontColor: '#182b49',
                  min: 0,
                },
              },
            ],
          },
        }"
        :height="height"
      />
      <ul class="deals-list">
        <li v-for="(item, key) in closeDealDatasets" :key="key + 1" class="custom-label">
          <span
            :style="{
              backgroundColor: item.hoverBackgroundColor,
            }"
          />
          {{ item.label }}
        </li>
      </ul>
    </CardBarChart>
  </sdCards>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { CardBarChart } from '../../style';
import Chartjs from '../../../../components/utilities/chartjs';

const ClosedDeals = defineComponent({
  name: 'ClosedDeals',
  components: { CardBarChart, Chartjs },
  setup() {
    const { state, dispatch } = useStore();
    const closeDealTabActive = ref('year');
    const closeDealState = computed(() => state.chartContent.closeDealData);
    const cdIsLoading = computed(() => state.chartContent.cdLoading);
    const height = ref(window.innerWidth <= 575 ? 200 : 178);
    const closeDealDatasets = computed(() => [
      {
        data: closeDealState.value.won,
        backgroundColor: '#20C99780',
        hoverBackgroundColor: '#20C997',
        label: 'Won',
        average: '50.8',
        maxBarThickness: 10,
        barThickness: 12,
        percent: 49,
      },
      {
        data: closeDealState.value.amount,
        backgroundColor: '#5F63F280',
        hoverBackgroundColor: '#5F63F2',
        label: 'Amount',
        average: '$28k',
        maxBarThickness: 10,
        barThickness: 12,
        percent: 60,
      },
    ]);

    onMounted(() => {
      dispatch('closeDealGetData');
    });

    const handleActiveChangeYoutube = (e, value) => {
      e.preventDefault();

      closeDealTabActive.value = value;

      dispatch('closeDealFilterData', value);
    };

    return {
      closeDealState,
      cdIsLoading,
      closeDealTabActive,
      closeDealDatasets,
      handleActiveChangeYoutube,
      height,
    };
  },
});

export default ClosedDeals;
</script>
