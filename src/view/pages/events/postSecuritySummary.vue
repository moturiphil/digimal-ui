<template>
  <div>
    <sdPageHeader ghost title="Post Security Summary">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by user, event, or IP address..."
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <div class="summary-section">
        <div class="summary-item">
          <strong>Total Posts:</strong> {{ totalPosts }} ||
          <strong>Total Day Security:</strong> {{ totalDaySecurity }} ||
          <strong>Total Night Security:</strong> {{ totalNightSecurity }}
        </div>
      </div>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="tableColumns"
                            :rowClassName="
                              (record) =>
                                record.hasBothShifts ? '' : 'highlight-row'
                            "
                          >
                            <template #bodyCell="{ column, record }">
                              <td>
                                <div v-if="column.key === 'securities'">
                                  <ul>
                                    <li
                                      v-for="(
                                        security, secIndex
                                      ) in record.securities"
                                      :key="secIndex"
                                    >
                                      <strong>{{ secIndex + 1 }}.</strong>
                                      <!-- Auto-incrementing number -->
                                      &nbsp;
                                      <strong>Name:</strong>
                                      {{ security.firstname }}
                                      {{ security.lastname }}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong
                                        >Phone No:</strong
                                      >
                                      {{ security.phone }} ||
                                      <strong>ID No:</strong>
                                      {{ security.id_number }} ||
                                      <strong>Shift:</strong>
                                      {{ security.shift }}
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  v-else-if="column.key === 'day_shift_count'"
                                >
                                  {{ record.day_shift_count }}
                                </div>
                                <div
                                  v-else-if="column.key === 'night_shift_count'"
                                >
                                  {{ record.night_shift_count }}
                                </div>
                                <div v-else-if="column.key === 'delivery_date'">
                                  <ul>
                                    <li
                                      v-for="(
                                        delivery, index
                                      ) in record.delivery_date"
                                      :key="index"
                                    >
                                      {{ formatDate(delivery.date_received) }}
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  v-else-if="column.key === 'distribution_date'"
                                >
                                  {{ formatDate(record.distribution_date) }}
                                </div>

                                <div v-else-if="column.key === 'date_diff'">
                                  <ul>
                                    <li
                                      v-for="(
                                        delivery, index
                                      ) in record.delivery_date"
                                      :key="index"
                                    >
                                      {{
                                        calculateDateDiff(
                                          delivery.date_received,
                                          record.distribution_date
                                        )
                                      }}
                                      days
                                    </li>
                                  </ul>
                                </div>

                                <div v-else-if="column.key === 'action'">
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    v-if="!record.hasBothShifts"
                                  >
                                    <router-link
                                      :to="{
                                        path: `/view-worker`,
                                        query: {
                                          id: record.post_id,
                                          name: record.post_name,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="success"
                                      shape="circle"
                                    >
                                      View More
                                    </router-link>
                                  </sdButton>
                                </div>
                                <div v-else>{{ record[column.dataIndex] }}</div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { format } from "date-fns"; // Import date-fns for formatting

export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      payroll: [],
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
    viewMore(record) {
      // Implement your logic for "View More" here
      console.log("Viewing more for record:", record);
    },
    formatDate(dateStr) {
      return format(new Date(dateStr), "do MMMM yyyy");
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");
    const { query } = useRoute();

    const location = query.event_location_id;

    const API_URL = `${process.env.VUE_APP_BASE_URL}/get_post_security?subcounty_id=${location}`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    const calculateDateDiff = (date1, date2) => {
      const dateReceived = new Date(date1);
      const distributionDate = new Date(date2);
      const diffTime = Math.abs(distributionDate - dateReceived);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const tableColumns = [
      {
        title: "Post Name",
        dataIndex: "post_name",
        key: "post_name",
      },
      {
        title: "Day Shift Count",
        key: "day_shift_count",
      },
      {
        title: "Night Shift Count",
        key: "night_shift_count",
      },
      {
        title: "Date Received",
        key: "delivery_date",
      },
      {
        title: "Distribution Start Date",
        key: "distribution_date",
      },
      {
        title: "Date Diff",
        key: "date_diff",
      },
      {
        title: "Action",
        key: "action",
      },
    ];

    // Computed properties for totals
    const totalPosts = computed(() => dataSource.value.length);
    const totalDaySecurity = computed(() =>
      dataSource.value.reduce((acc, post) => acc + post.day_shift_count, 0)
    );
    const totalNightSecurity = computed(() =>
      dataSource.value.reduce((acc, post) => acc + post.night_shift_count, 0)
    );

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data.map((post) => {
            const distribution_date = post.distribution_date;
            const dayShiftCount = post.securities.filter(
              (security) => security.shift === "Day"
            ).length;
            const nightShiftCount = post.securities.filter(
              (security) => security.shift === "Night"
            ).length;
            return {
              ...post,
              day_shift_count: dayShiftCount,
              night_shift_count: nightShiftCount,
              hasBothShifts: dayShiftCount ==1 && nightShiftCount == 1,
              distribution_date: distribution_date,
            };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      tableColumns,
      handleChange,
      activeClass,
      totalPosts,
      totalDaySecurity,
      totalNightSecurity,
      calculateDateDiff,
    };
  },
});
</script>

<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}

.card-wrapper {
  margin-bottom: 20px;
}

.post-card {
  background-color: #f9f9f9;
  border-radius: 4px;
}

.security-card {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.highlight-row {
  background-color: #fa8b0b !important;
  /* Change to your preferred highlight color */
}
</style>
