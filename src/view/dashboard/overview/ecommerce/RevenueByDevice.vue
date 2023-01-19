<template>
  <RevenueChartWrapper>
    <sdCards v-if="deviceState" title="Revenue By Device">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="device === 'today' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeDevice(e, 'today')" to="#"> Today </router-link>
            </li>
            <li :class="device === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeDevice(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="device === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeDevice(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="device === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeDevice(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>

      <div v-if="dvIsLoading" class="sd-spin">
        <a-spin />
      </div>

      <div v-else class="revenue-doughnut">
        <div>
          <Chartjs
            type="doughnut"
            class="revenue"
            :height="220"
            :style="{
              marginBottom: '0',
            }"
            :options="{
              cutoutPercentage: 60,
              maintainAspectRatio: false,
              responsive: false,
              legend: {
                display: false,
                position: 'bottom',
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
            }"
            :labels="labels"
            :datasets="datasets"
          />
          <div class="align-center-v justify-content-between rd-labels">
            <div class="revenue-chat-label">
              <div v-for="(label, key) in labels" :key="key + 1" class="chart-label">
                <span :class="`label-dot dot-${label}`" />
                {{ label }}
              </div>
            </div>
            <div class="revenue-chart-data">
              <div v-for="(item, key) in datasets" :key="key + 1">
                <p v-for="value in item.data" :key="value">
                  <strong>${{ value }}</strong>
                </p>
              </div>
            </div>
            <div class="revenue-chat-percentage">
              <span>45%</span>
              <span>45%</span>
              <span>45%</span>
            </div>
          </div>
        </div>
      </div>
    </sdCards>
  </RevenueChartWrapper>
</template>
<script>
import { computed, onMounted, ref, watchEffect, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { RevenueChartWrapper } from '../../style';
import Chartjs from '../../../../components/utilities/chartjs';

const RevenueByDevice = defineComponent({
  name: 'RevenueByDevice',
  components: { RevenueChartWrapper, Chartjs },
  setup() {
    const { state, dispatch } = useStore();
    const device = ref('year');
    const labels = ref(['Desktop', 'Mobile', 'Tablets']);

    const deviceState = computed(() => state.chartContent.deviceData);
    const dvIsLoading = computed(() => state.chartContent.dvLoading);
    const datasets = ref([]);

    const handleActiveChangeDevice = (event, value) => {
      event.preventDefault();
      device.value = value;
      dispatch('deviceFilterData', value);
    };

    onMounted(() => {
      dispatch('deviceGetData');
      datasets.value = [
        {
          data: deviceState.value,
          backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
        },
      ];
    });

    watchEffect(() => {
      datasets.value = [
        {
          data: deviceState.value,
          backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
        },
      ];
    });

    return {
      deviceState,
      dvIsLoading,
      device,
      handleActiveChangeDevice,
      labels,
      datasets,
    };
  },
});

export default RevenueByDevice;
</script>
