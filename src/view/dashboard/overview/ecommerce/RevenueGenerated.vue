<template>
  <RevenueTableWrapper>
    <div class="full-width-table">
      <sdCards more title="Source Of Revenue Generated">
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

        <template #button>
          <div class="card-nav">
            <ul>
              <li :class="generated === 'week' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeGenerated(e, 'week')" to="#"> Week </router-link>
              </li>
              <li :class="generated === 'month' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeGenerated(e, 'month')" to="#"> Month </router-link>
              </li>
              <li :class="generated === 'year' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeGenerated(e, 'year')" to="#"> Year </router-link>
              </li>
            </ul>
          </div>
        </template>
        <div class="table-bordered revenue-table table-responsive">
          <a-table :columns="revenueColumns" :dataSource="revenueData" :pagination="false" />
        </div>
      </sdCards>
    </div>
  </RevenueTableWrapper>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { RevenueTableWrapper } from '../../style';
import Chart from '../../../../components/utilities/chartjs';

const revenueColumns = [
  {
    title: 'Name of Source',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Visitors',
    dataIndex: 'visitors',
    key: 'visitors',
  },
  {
    title: 'Page View',
    dataIndex: 'page_View',
    key: 'page_View',
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    key: 'trend',
    width: 120,
  },
];

const RevenueGenerated = {
  name: 'RevenueGenerated',
  components: { RevenueTableWrapper, Chart },
  setup() {
    const store = useStore();
    const revenueData = computed(() =>
      generatedState.value
        ? generatedState.value.map((value) => {
            const { key, name, visitors, page_View, revenue, trend } = value;
            return {
              key,
              name,
              visitors,
              page_View,
              revenue,
              trend: (
                <Chart
                  class={'generate' + key}
                  type="line"
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                  datasets={[
                    {
                      data: trend.data,
                      borderColor: trend.borderColor,
                      borderWidth: 2,
                      fill: false,
                    },
                  ]}
                  height={30}
                  width={120}
                  options={{
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
                          barPercentage: 1,
                          gridLines: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      ],
                    },
                    elements: {
                      point: {
                        radius: 0,
                      },
                    },
                  }}
                />
              ),
            };
          })
        : [],
    );
    const generatedState = computed(() => store.state.chartContent.generatedData);
    const generated = ref('year');

    onMounted(() => {
      store.dispatch('generatedGetData');
    });

    const handleActiveChangeGenerated = (event, value) => {
      event.preventDefault();
      generated.value = value;
      return store.dispatch('generatedFilterData', value);
    };

    return {
      generatedState,
      revenueColumns,
      handleActiveChangeGenerated,
      revenueData,
      generated,
    };
  },
};

export default RevenueGenerated;
</script>
