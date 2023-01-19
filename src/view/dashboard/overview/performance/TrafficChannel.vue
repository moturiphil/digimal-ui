<template>
  <div class="full-width-table">
    <sdCards title="Traffic Channels" more>
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="traffic === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTraffic(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="traffic === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTraffic(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="traffic === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeTraffic(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>
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
      <TrafficTableWrapper>
        <div class="table-bordered table-responsive">
          <a-table :columns="locationColumns" :dataSource="locationData" :pagination="false" />
        </div>
      </TrafficTableWrapper>
    </sdCards>
  </div>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { TrafficTableWrapper } from '../../style';

const locationColumns = [
  {
    title: 'Channel',
    dataIndex: 'channel',
    key: 'channel',
  },
  {
    title: 'Sessions',
    dataIndex: 'sessions',
    key: 'sessions',
  },
  {
    title: 'Goal Conv. Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Goals Completions',
    dataIndex: 'completions',
    key: 'completions',
  },
  {
    title: 'Percentage of Traffic (%)',
    dataIndex: 'percentage',
    key: 'percentage',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

const TrafficChannel = defineComponent({
  name: 'TrafficChannel',
  components: {
    TrafficTableWrapper,
  },
  setup() {
    const store = useStore();
    const traffic = ref('year');
    const trafficState = computed(() => store.state.chartContent.trafficChanelData);

    const locationData = computed(() =>
      trafficState.value
        ? [
            {
              key: '1',
              channel: 'Direct',
              sessions: trafficState.value.direct.sessions,
              rate: `${trafficState.value.direct.rate}%`,
              completions: trafficState.value.direct.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.direct.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-dt progress-primary"
                />
              ),
              value: `${trafficState.value.direct.value}%`,
            },
            {
              key: '2',
              channel: 'Email',
              sessions: trafficState.value.email.sessions,
              rate: `${trafficState.value.email.rate}%`,
              completions: trafficState.value.email.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.email.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-et progress-secondary"
                />
              ),
              value: `${trafficState.value.email.value}%`,
            },
            {
              key: '3',
              channel: 'Organic Search',
              sessions: trafficState.value.search.sessions,
              rate: `${trafficState.value.search.rate}%`,
              completions: trafficState.value.search.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.search.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-ost progress-success"
                />
              ),
              value: `${trafficState.value.search.value}%`,
            },
            {
              key: '4',
              channel: 'Referral',
              sessions: trafficState.value.referral.sessions,
              rate: `${trafficState.value.referral.rate}%`,
              completions: trafficState.value.referral.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.referral.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-rt progress-info"
                />
              ),
              value: `${trafficState.value.referral.value}%`,
            },
            {
              key: '5',
              channel: 'Social Media',
              sessions: trafficState.value.media.sessions,
              rate: `${trafficState.value.media.rate}%`,
              completions: trafficState.value.media.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.media.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-smt progress-warning"
                />
              ),
              value: `${trafficState.value.media.value}%`,
            },
            {
              key: '6',
              channel: 'Other',
              sessions: trafficState.value.other.sessions,
              rate: `${trafficState.value.other.rate}%`,
              completions: trafficState.value.other.goals,
              percentage: (
                <a-progress
                  percent={parseInt(trafficState.value.other.percent)}
                  strokeWidth={5}
                  status="active"
                  showInfo={false}
                  class="progress-ot progress-danger"
                />
              ),
              value: `${trafficState.value.other.value}%`,
            },
          ]
        : [],
    );

    const handleActiveChangeTraffic = (event, value) => {
      event.preventDefault();
      traffic.value = value;
      return store.dispatch('trafficChanelFilterData', value);
    };

    onMounted(() => {
      store.dispatch('trafficChanelGetData');
    });
    return {
      trafficState,
      traffic,
      handleActiveChangeTraffic,
      locationColumns,
      locationData,
    };
  },
});

export default TrafficChannel;
</script>
