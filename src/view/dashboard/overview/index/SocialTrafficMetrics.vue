<template>
  <CardGroup>
    <div class="full-width-table">
      <sdCards more title="Social Traffic Metrics">
        <template #button>
          <div class="card-radio">
            <a-radio-group @change="socialTraffic" v-model:value="initValue">
              <a-radio-button value="today">Today</a-radio-button>
              <a-radio-button value="week">Week</a-radio-button>
              <a-radio-button value="month">Month</a-radio-button>
              <a-radio-button value="year">Year</a-radio-button>
            </a-radio-group>
          </div>
        </template>
        <template #more>
          <router-link to="#">
            <span>2 years</span>
          </router-link>
          <router-link to="#">
            <span>3 years</span>
          </router-link>
          <router-link to="#">
            <span>4 years</span>
          </router-link>
        </template>
        <div class="traffic-table table-responsive">
          <a-table :columns="trafficTableColumns" :dataSource="trafficTableData" :pagination="false" />
        </div>
      </sdCards>
    </div>
  </CardGroup>
</template>
<script>
import { useStore } from 'vuex';
import { CardGroup } from '../../style';
import { computed, onMounted, ref } from 'vue';

const trafficTableColumns = [
  {
    dataIndex: 'network',
    key: 'network',
  },
  {
    title: 'Acquisition',
    dataIndex: 'users',
    key: 'users',
  },
  {
    dataIndex: 'newUsers',
    key: 'newUsers',
  },
  {
    dataIndex: 'sessions',
    key: 'sessions',
  },
  {
    title: 'Behavior',
    dataIndex: 'bounceRate',
    key: 'bounceRate',
  },
  {
    dataIndex: 'pages',
    key: 'pages',
  },
  {
    dataIndex: 'avg',
    key: 'avg',
  },
];

const SocialTrafficMetrics = {
  name: 'SocialTrafficMetrics',
  components: { CardGroup },
  setup() {
    const { state, dispatch } = useStore();
    const initValue = ref('today');
    onMounted(() => dispatch('socialTrafficGetData'));

    const socialTrafficState = computed(() => state.chartContent.socialTrafficData);
    const trafficTableData = computed(() =>
      socialTrafficState.value !== null
        ? [
            {
              key: '1',
              network: <span class="traffic-title">Social Network</span>,
              users: <span class="traffic-title">Users</span>,
              newUsers: <span class="traffic-title">New Users</span>,
              sessions: <span class="traffic-title">Sessions</span>,
              bounceRate: <span class="traffic-title">Bounce Rate</span>,
              pages: <span class="traffic-title">Pages / Session</span>,
              avg: <span class="traffic-title">Avg. Session Duration</span>,
            },
            {
              key: '2',
              network: (
                <router-view to="#">
                  <span class="social-name">Facebook</span>
                </router-view>
              ),
              users: socialTrafficState.value.facebook.users,
              newUsers: socialTrafficState.value.facebook.newUsers,
              sessions: socialTrafficState.value.facebook.session,
              bounceRate: socialTrafficState.value.facebook.bounceRate,
              pages: socialTrafficState.value.facebook.pagesSession,
              avg: socialTrafficState.value.facebook.avg,
            },
            {
              key: '3',
              network: (
                <router-view to="#">
                  <span class="social-name">Twitter</span>
                </router-view>
              ),
              users: socialTrafficState.value.twitter.users,
              newUsers: socialTrafficState.value.twitter.newUsers,
              sessions: socialTrafficState.value.twitter.session,
              bounceRate: socialTrafficState.value.twitter.bounceRate,
              pages: socialTrafficState.value.twitter.pagesSession,
              avg: socialTrafficState.value.twitter.avg,
            },
            {
              key: '4',
              network: (
                <router-view to="#">
                  <span class="social-name">Linkdin</span>
                </router-view>
              ),
              users: socialTrafficState.value.linkdin.users,
              newUsers: socialTrafficState.value.linkdin.newUsers,
              sessions: socialTrafficState.value.linkdin.session,
              bounceRate: socialTrafficState.value.linkdin.bounceRate,
              pages: socialTrafficState.value.linkdin.pagesSession,
              avg: socialTrafficState.value.linkdin.avg,
            },
            {
              key: '5',
              network: (
                <router-view to="#">
                  <span class="social-name">Youtube</span>
                </router-view>
              ),
              users: socialTrafficState.value.youtube.users,
              newUsers: socialTrafficState.value.youtube.newUsers,
              sessions: socialTrafficState.value.youtube.session,
              bounceRate: socialTrafficState.value.youtube.bounceRate,
              pages: socialTrafficState.value.youtube.pagesSession,
              avg: socialTrafficState.value.youtube.avg,
            },
            {
              key: '6',
              network: (
                <router-view to="#">
                  <span class="social-name">Pinterest</span>
                </router-view>
              ),
              users: socialTrafficState.value.pinterest.users,
              newUsers: socialTrafficState.value.pinterest.newUsers,
              sessions: socialTrafficState.value.pinterest.session,
              bounceRate: socialTrafficState.value.pinterest.bounceRate,
              pages: socialTrafficState.value.pinterest.pagesSession,
              avg: socialTrafficState.value.pinterest.avg,
            },
            {
              key: '7',
              network: (
                <router-view to="#">
                  <span class="social-name">Google+</span>
                </router-view>
              ),
              users: socialTrafficState.value.google.users,
              newUsers: socialTrafficState.value.google.newUsers,
              sessions: socialTrafficState.value.google.session,
              bounceRate: socialTrafficState.value.google.bounceRate,
              pages: socialTrafficState.value.google.pagesSession,
              avg: socialTrafficState.value.google.avg,
            },
          ]
        : [],
    );

    const socialTraffic = (e) => {
      e.preventDefault();
      return dispatch('socialTrafficFilterData', e.target.value);
    };

    return {
      initValue,
      trafficTableColumns,
      trafficTableData,
      socialTraffic,
    };
  },
};

export default SocialTrafficMetrics;
</script>
