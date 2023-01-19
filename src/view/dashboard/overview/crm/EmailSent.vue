<template>
  <SentEmailWrapper>
    <sdCards v-if="deviceState" title="Email Sent">
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

      <div v-else class="sent-emial-chart">
        <Chartjs
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
          type="doughnut"
          class="sentMail"
          :labels="labels"
          :datasets="datasets"
          :height="180"
        />

        <div class="sent-emial-data">
          <div v-for="(item, key) in datasets" class="sent-emial-box align-center-v" :key="key + 1">
            <div v-for="(value, index) in item.data" class="sent-emial-item" :key="value">
              <div :class="`sent-emial-icon icon-${types[index]}`">
                <img :src="require(`../../../../static/img/icon/${icons[index]}.svg`)" alt="" />
              </div>
              <div class="sent-emial-content">
                <h4>
                  <strong>{{ value }}</strong>
                </h4>
                <p>{{ labels[index] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </sdCards>
  </SentEmailWrapper>
</template>
<script>
import { onMounted, ref, computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { SentEmailWrapper } from '../../style';
import Chartjs from '../../../../components/utilities/chartjs';

const labels = ['Total Sent', 'Opened', 'Not Opened'];
const icons = ['Sent', 'Opened', 'NotOpen'];
const types = ['success', 'primary', 'warning'];

const EmailSent = defineComponent({
  name: 'EmailSent',
  components: { SentEmailWrapper, Chartjs },
  setup() {
    const { state, dispatch } = useStore();
    const deviceState = computed(() => state.chartContent.deviceData);
    const dvIsLoading = computed(() => state.chartContent.dvLoading);
    const device = ref('year');

    const datasets = computed(() => [
      {
        data: deviceState.value,
        backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
      },
    ]);

    onMounted(() => {
      dispatch('deviceGetData');
      // return (datasets.value = [
      //   {
      //     data: deviceState.value,
      //     backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
      //   },
      // ]);
    });

    const handleActiveChangeDevice = (event, value) => {
      event.preventDefault();
      device.value = value;
      dispatch('deviceFilterData', value);
    };

    return {
      deviceState,
      dvIsLoading,
      device,
      handleActiveChangeDevice,
      labels,
      icons,
      types,
      datasets,
    };
  },
});

export default EmailSent;
</script>
