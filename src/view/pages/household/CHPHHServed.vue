<template>
  <Main>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <sdPageHeader ghost :title="`Households Served in ${chp_village}`" />
      <sdButton
        type="primary"
        size="large"
        @click="navigateToIssueNets"
        style="border-radius: 6px; height: 40px; padding: 0 20px; font-weight: 500;"
      >
        <a-icon type="plus" style="margin-right: 8px;" />
        Issue New Nets
      </sdButton>
    </div>

    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
            <!-- Summary Cards -->
            <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
              <a-col :xs="24" :sm="8">
                <a-card style="border-radius: 8px; text-align: center; border-left: 4px solid #1890ff;">
                  <a-statistic
                    title="Total Households Served"
                    :value="totalHouseholds"
                    :value-style="{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }"
                  />
                </a-card>
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-card style="border-radius: 8px; text-align: center; border-left: 4px solid #52c41a;">
                  <a-statistic
                    title="Total Nets Issued"
                    :value="totalNetsIssued"
                    :value-style="{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }"
                  />
                </a-card>
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-card style="border-radius: 8px; text-align: center; border-left: 4px solid #722ed1;">
                  <a-statistic
                    title="Average Household Size"
                    :value="averageHouseholdSize"
                    :precision="1"
                    :value-style="{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }"
                  />
                </a-card>
              </a-col>
            </a-row>

            <!-- Search and Filter -->
            <a-card style="margin-bottom: 20px; border-radius: 8px;">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="12" :md="8">
                  <a-input
                    v-model:value="searchQuery"
                    placeholder="Search by name or ID number"
                    size="large"
                    style="border-radius: 6px;"
                    @input="handleSearch"
                  >
                    <template #prefix>
                      <a-icon type="search" />
                    </template>
                  </a-input>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8">
                  <a-date-picker
                    v-model:value="dateFilter"
                    placeholder="Filter by date"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    @change="handleDateFilter"
                  />
                </a-col>
                <a-col :xs="24" :sm="12" :md="4">
                  <sdButton
                    type="default"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    @click="resetFilters"
                  >
                    <a-icon type="reload" />
                    Reset
                  </sdButton>
                </a-col>
                <a-col :xs="24" :sm="12" :md="4">
                  <sdButton
                    type="success"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    @click="exportData"
                  >
                    <a-icon type="download" />
                    Export
                  </sdButton>
                </a-col>
              </a-row>
            </a-card>

            <!-- Households Table -->
            <a-card style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <template #title>
                <div style="display: flex; align-items: center;">
                  <a-icon type="table" style="margin-right: 8px; color: #1890ff;" />
                  Served Households List
                  <a-badge 
                    :count="filteredHouseholds.length" 
                    :number-style="{ backgroundColor: '#52c41a' }"
                    style="margin-left: 12px;"
                  />
                </div>
              </template>

              <a-table
                :columns="columns"
                :data-source="paginatedHouseholds"
                :pagination="paginationConfig"
                :loading="isLoading"
                row-key="id"
                size="middle"
                :scroll="{ x: 800 }"
                @change="handleTableChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'name'">
                    <div style="display: flex; align-items: center;">
                      <a-avatar 
                        :size="32" 
                        style="background-color: #1890ff; margin-right: 12px; flex-shrink: 0;"
                      >
                        {{ record.first_name?.charAt(0) }}{{ record.last_name?.charAt(0) }}
                      </a-avatar>
                      <div>
                        <div style="font-weight: 500; color: #262626;">
                          {{ record.first_name }} {{ record.middle_name }} {{ record.last_name }}
                        </div>
                        <div style="font-size: 12px; color: #8c8c8c;">
                          ID: {{ record.id_no }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'contact'">
                    <div>
                      <div style="font-weight: 500;">{{ record.phone_no }}</div>
                    </div>
                  </template>

                  <template v-if="column.key === 'household_info'">
                    <div>
                      <div style="font-weight: 500;">{{ record.hh_size }} members</div>
                      <div style="font-size: 12px; color: #8c8c8c;">
                        Allocated: {{ record.actual_allocation }} nets
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'nets_issued'">
                    <a-tag color="green" style="border-radius: 12px; font-weight: 500;">
                      {{ record.nets_issued || record.actual_allocation }} nets
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'date_served'">
                    <div>
                      <div style="font-weight: 500;">{{ formatDate(record.date_served) }}</div>
                      <div style="font-size: 12px; color: #8c8c8c;">
                        {{ formatTime(record.date_served) }}
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'status'">
                    <a-tag 
                      :color="record.status === 'Completed' ? 'green' : 'blue'"
                      style="border-radius: 12px; font-weight: 500;"
                    >
                      {{ record.status || 'Completed' }}
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'actions'">
                    <a-dropdown>
                      <a-button type="link" style="padding: 0;">
                        <a-icon type="more" />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="viewDetails(record)">
                            <a-icon type="eye" /> View Details
                          </a-menu-item>
                          <a-menu-item @click="printReceipt(record)">
                            <a-icon type="printer" /> Print Receipt
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </template>
                </template>

                <template #emptyText>
                  <a-empty
                    :image="emptyImage"
                    description="No households served yet"
                  >
                    <sdButton
                      type="primary"
                      @click="navigateToIssueNets"
                      style="border-radius: 6px;"
                    >
                      Issue First Nets
                    </sdButton>
                  </a-empty>
                </template>
              </a-table>
            </a-card>
        </RecordFormWrapper>
      </a-col>
    </a-row>

    <!-- Details Modal -->
    <a-modal
      v-model:visible="showDetailsModal"
      title="Household Details"
      width="600px"
      :footer="null"
    >
      <div v-if="selectedHousehold">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="Name">
            {{ selectedHousehold.first_name }} {{ selectedHousehold.middle_name }} {{ selectedHousehold.last_name }}
          </a-descriptions-item>
          <a-descriptions-item label="ID Number">
            {{ selectedHousehold.id_no }}
          </a-descriptions-item>
          <a-descriptions-item label="Phone Number">
            {{ selectedHousehold.phone_no }}
          </a-descriptions-item>
          <a-descriptions-item label="Household Size">
            {{ selectedHousehold.hh_size }} members
          </a-descriptions-item>
          <a-descriptions-item label="Nets Issued">
            {{ selectedHousehold.nets_issued || selectedHousehold.actual_allocation }} nets
          </a-descriptions-item>
          <a-descriptions-item label="Date Served">
            {{ formatDate(selectedHousehold.date_served) }} at {{ formatTime(selectedHousehold.date_served) }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="selectedHousehold.status === 'Completed' ? 'green' : 'blue'">
              {{ selectedHousehold.status || 'Completed' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </Main>
</template>

<script>
import { RecordFormWrapper } from "./style";
import { Main } from "../../styled";
import { ref, defineComponent, computed, onMounted } from "vue";
import { notification, Empty } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/Axiosconfig";
import authHeader from "../../../services/auth-header";
import moment from "moment";

const CHPHHServed = defineComponent({
  name: "CHPHHServed",
  components: { RecordFormWrapper, Main },

  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const isLoading = ref(false);
    const households = ref([]);
    const searchQuery = ref("");
    const dateFilter = ref(null);
    const showDetailsModal = ref(false);
    const selectedHousehold = ref(null);
    
    // Pagination
    const currentPage = ref(1);
    const pageSize = ref(10);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const chp = user.user;
    const chp_village = chp.location.name;
    const chp_id = route.params.chp_id || chp.id;

    const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

    // Table columns
    const columns = [
      {
        title: 'Household Head',
        key: 'name',
        dataIndex: 'name',
        width: 250,
        fixed: 'left',
      },
      {
        title: 'Contact',
        key: 'contact',
        dataIndex: 'phone_no',
        width: 150,
      },
      {
        title: 'Household Info',
        key: 'household_info',
        width: 150,
      },
      {
        title: 'Nets Issued',
        key: 'nets_issued',
        dataIndex: 'nets_issued',
        width: 120,
        align: 'center',
      },
      {
        title: 'Date Served',
        key: 'date_served',
        dataIndex: 'date_served',
        width: 150,
        sorter: (a, b) => moment(a.date_served).unix() - moment(b.date_served).unix(),
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        width: 100,
        align: 'center',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        align: 'center',
        fixed: 'right',
      },
    ];

    // Computed properties
    const filteredHouseholds = computed(() => {
      let filtered = households.value;

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(household => 
          household.first_name?.toLowerCase().includes(query) ||
          household.middle_name?.toLowerCase().includes(query) ||
          household.last_name?.toLowerCase().includes(query) ||
          household.id_no?.toLowerCase().includes(query) ||
          household.phone_no?.includes(query)
        );
      }

      // Date filter
      if (dateFilter.value) {
        const selectedDate = moment(dateFilter.value).format('YYYY-MM-DD');
        filtered = filtered.filter(household => 
          moment(household.date_served).format('YYYY-MM-DD') === selectedDate
        );
      }

      return filtered;
    });

    const paginatedHouseholds = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredHouseholds.value.slice(start, end);
    });

    const totalHouseholds = computed(() => households.value.length);
    
    const totalNetsIssued = computed(() => 
      households.value.reduce((total, household) => 
        total + (household.nets_issued || household.actual_allocation || 0), 0
      )
    );

    const averageHouseholdSize = computed(() => {
      if (households.value.length === 0) return 0;
      const totalSize = households.value.reduce((total, household) => 
        total + (household.hh_size || 0), 0
      );
      return totalSize / households.value.length;
    });

    const paginationConfig = computed(() => ({
      current: currentPage.value,
      pageSize: pageSize.value,
      total: filteredHouseholds.value.length,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} households`,
      pageSizeOptions: ['10', '20', '50', '100'],
    }));

    // Methods
    const fetchServedHouseholds = async () => {
      try {
        isLoading.value = true;
        
        const response = await axios.get(`/chp/${chp_id}/hh_served`, {
          headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          households.value = response.data.data || [];
          
          if (households.value.length === 0) {
            notification.info({
              message: "No Records Found",
              description: "No households have been served yet.",
              duration: 3,
            });
          }
        } else {
          notification.error({
            message: "Error Loading Data",
            description: response.data.message || "Failed to load served households.",
            duration: 5,
          });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        notification.error({
          message: "Error",
          description: "An error occurred while loading the data.",
          duration: 5,
        });
      } finally {
        isLoading.value = false;
      }
    };

    const handleSearch = () => {
      currentPage.value = 1; // Reset to first page when searching
    };

    const handleDateFilter = () => {
      currentPage.value = 1; // Reset to first page when filtering
    };

    const resetFilters = () => {
      searchQuery.value = "";
      dateFilter.value = null;
      currentPage.value = 1;
    };

    const handleTableChange = (pagination) => {
      currentPage.value = pagination.current;
      pageSize.value = pagination.pageSize;
    };

    const viewDetails = (household) => {
      selectedHousehold.value = household;
      showDetailsModal.value = true;
    };

    const printReceipt = (household) => {
      // Implement print functionality
      notification.info({
        message: "Print Receipt",
        description: `Receipt for ${household.first_name} ${household.last_name} will be generated.`,
        duration: 3,
      });
    };

    const exportData = () => {
      // Implement export functionality
      notification.info({
        message: "Export Data",
        description: "Data export functionality will be implemented.",
        duration: 3,
      });
    };

    const navigateToIssueNets = () => {
      router.push('/issue-nets');
    };

    const formatDate = (dateString) => {
      return moment(dateString).format('MMM DD, YYYY');
    };

    const formatTime = (dateString) => {
      return moment(dateString).format('HH:mm');
    };

    // Lifecycle
    onMounted(() => {
      fetchServedHouseholds();
    });

    return {
      isLoading,
      households,
      searchQuery,
      dateFilter,
      showDetailsModal,
      selectedHousehold,
      currentPage,
      pageSize,
      chp_village,
      emptyImage,
      columns,
      filteredHouseholds,
      paginatedHouseholds,
      totalHouseholds,
      totalNetsIssued,
      averageHouseholdSize,
      paginationConfig,
      fetchServedHouseholds,
      handleSearch,
      handleDateFilter,
      resetFilters,
      handleTableChange,
      viewDetails,
      printReceipt,
      exportData,
      navigateToIssueNets,
      formatDate,
      formatTime,
    };
  },
});

export default CHPHHServed;
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply animations */
.ant-card {
  animation: fadeIn 0.6s ease-out;
}

/* Hover effects */
.ant-btn:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Table row hover */
.ant-table-tbody > tr:hover > td {
  background-color: #f5f5f5 !important;
}

/* Custom table styling */
.ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
  color: #262626;
}

/* Card hover effects */
.ant-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  transition: box-shadow 0.3s ease;
}

/* Statistic styling */
.ant-statistic-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .ant-table {
    font-size: 12px;
  }
  
  .ant-descriptions {
    font-size: 14px;
  }
}
</style>
