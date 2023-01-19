<template>
  <SessionChartWrapper>
    <sdCards v-if="deviceState" title="Sessions By Device">
      <template #button>
        <div class="card-nav">
          <ul>
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

      <div v-else class="session-chart-inner">
        <div :style="{ position: 'relative' }">
          <p>
            <span>{{
              [
                {
                  data: deviceState,
                  backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
                  total: '9,283',
                },
              ][0].data.reduce((a, b) => a + b, 0)
            }}</span>
            Total visitors
          </p>
          <Chart
            class="device"
            type="doughnut"
            :labels="['Desktop', 'Mobiles', 'Tablets']"
            :datasets="[
              {
                data: deviceState,
                backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
                total: '9,283',
              },
            ]"
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
          />
        </div>
        <SessionState class="session-wrap d-flex justify-content-center">
          <div class="session-single">
            <div class="chart-label">
              <span class="label-dot dot-success" />
              Desktop
            </div>
            <span>{{ deviceState[0] }}</span>
            <sub>45%</sub>
          </div>
          <div class="session-single">
            <div class="chart-label">
              <span class="label-dot dot-info" />
              Mobile
            </div>
            <span>{{ deviceState[1] }}</span>
            <sub>30%</sub>
          </div>
          <div class="session-single">
            <div class="chart-label">
              <span class="label-dot dot-warning" />
              Tablets
            </div>
            <span>{{ deviceState[1] }}</span>
            <sub>25%</sub>
          </div>
        </SessionState>
      </div>
    </sdCards>
  </SessionChartWrapper>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { SessionChartWrapper, SessionState } from '../../style';
import Chart from '../../../../components/utilities/chartjs';

const SessionsByDevice = defineComponent({
  name: 'SessionsByDevice',
  components: { SessionChartWrapper, SessionState, Chart },
  setup() {
    const store = useStore();
    const deviceState = computed(() => store.state.chartContent.deviceData);
    const dvIsLoading = computed(() => store.state.chartContent.dvLoading);
    const device = ref('year');

    onMounted(() => {
      store.dispatch('deviceGetData');
    });

    const handleActiveChangeDevice = (event, value) => {
      event.preventDefault();

      device.value = value;
      store.dispatch('deviceFilterData', value);
    };

    return {
      deviceState,
      dvIsLoading,
      device,
      handleActiveChangeDevice,
    };
  },
});

export default SessionsByDevice;
</script>
