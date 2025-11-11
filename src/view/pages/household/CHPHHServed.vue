<template>
  <Main>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <sdPageHeader ghost :title="`Households you have served`" />
      <sdButton
        type="warning"
        size="large"
        @click="navigateToIssueNets"
        style="border-radius: 6px; height: 40px; padding: 0 20px; font-weight: 500;"
      >
        <a-icon type="plus" style="margin-right: 8px;" />
        Issue Nets
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
                    title="Avg. Estimated Household Size"
                    :value="averageHouseholdSize"
                    :precision="1"
                    :value-style="{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }"
                  />
                  <div style="font-size: 12px; color: #8c8c8c; margin-top: 4px;">
                    Based on 1 net per 2 people
                  </div>
                </a-card>
              </a-col>
            </a-row>

            <!-- Search and Filter -->
            <a-card style="margin-bottom: 20px; border-radius: 8px;">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="12" :md="6">
                  <a-input
                    v-model:value="searchQuery"
                    placeholder="Search by household name"
                    size="large"
                    style="border-radius: 6px;"
                    @input="handleSearch"
                  >
                    <template #prefix>
                      <a-icon type="search" />
                    </template>
                  </a-input>
                </a-col>
                <a-col :xs="24" :sm="12" :md="5">
                  <a-date-picker
                    v-model:value="dateFilter"
                    placeholder="Filter by date"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    @change="handleDateFilter"
                  />
                </a-col>
                <a-col :xs="24" :sm="12" :md="5">
                  <a-select
                    v-model:value="subcountyFilter"
                    placeholder="Filter by Subcounty"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    allow-clear
                    @change="handleSubcountyFilter"
                  >
                    <a-select-option v-for="subcounty in uniqueSubcounties" :key="subcounty" :value="subcounty">
                      {{ subcounty }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :xs="24" :sm="12" :md="4">
                  <a-select
                    v-model:value="wardFilter"
                    placeholder="Filter by Ward"
                    size="large"
                    style="width: 100%; border-radius: 6px;"
                    allow-clear
                    @change="handleWardFilter"
                  >
                    <a-select-option v-for="ward in uniqueWards" :key="ward" :value="ward">
                      {{ ward }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :xs="24" :sm="12" :md="2">
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
                <a-col :xs="24" :sm="12" :md="2">
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
                  <template v-if="column.key === 'household_name'">
                    <div style="display: flex; align-items: center;">
                      <a-avatar 
                        :size="32" 
                        style="background-color: #1890ff; margin-right: 12px; flex-shrink: 0;"
                      >
                        {{ record.household_name?.charAt(0) }}
                      </a-avatar>
                      <div>
                        <div style="font-weight: 500; color: #262626;">
                          {{ record.household_name }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'location'">
                    <div>
                      <div style="font-weight: 500;">{{ record.subcounty_name !== 'N/A' ? record.subcounty_name : 'Not Specified' }}</div>
                      <div style="font-size: 12px; color: #8c8c8c;">
                        Ward: {{ record.ward_name !== 'N/A' ? record.ward_name : 'Not Specified' }}
                      </div>
                      <div style="font-size: 12px; color: #8c8c8c;">
                        CHU: {{ record.chu_area_name !== 'N/A' ? record.chu_area_name : 'Not Specified' }}
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'nets_issued'">
                    <a-tag color="green" style="border-radius: 12px; font-weight: 500;">
                      {{ record.no_of_nets }} nets
                    </a-tag>
                  </template>

                  <template v-if="column.key === 'issue_date'">
                    <div>
                      <div style="font-weight: 500;">{{ formatDate(record.issue_date) }}</div>
                    </div>
                  </template>

                  <template v-if="column.key === 'status'">
                    <a-tag 
                      color="green"
                      style="border-radius: 12px; font-weight: 500;"
                    >
                      Completed
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
          <a-descriptions-item label="Household Name">
            {{ selectedHousehold.household_name }}
          </a-descriptions-item>
          <a-descriptions-item label="Nets Issued">
            {{ selectedHousehold.no_of_nets }} nets
          </a-descriptions-item>
          <a-descriptions-item label="Issue Date">
            {{ formatDate(selectedHousehold.issue_date) }}
          </a-descriptions-item>
          <a-descriptions-item label="Subcounty">
            {{ selectedHousehold.subcounty_name !== 'N/A' ? selectedHousehold.subcounty_name : 'Not Specified' }}
          </a-descriptions-item>
          <a-descriptions-item label="Ward">
            {{ selectedHousehold.ward_name !== 'N/A' ? selectedHousehold.ward_name : 'Not Specified' }}
          </a-descriptions-item>
          <a-descriptions-item label="CHU Area">
            {{ selectedHousehold.chu_area_name !== 'N/A' ? selectedHousehold.chu_area_name : 'Not Specified' }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag color="green">
              Completed
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
    const subcountyFilter = ref(null);
    const wardFilter = ref(null);
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

    console.log(user.token);

    // Table columns
    const columns = [
      {
        title: 'Household Name',
        key: 'household_name',
        dataIndex: 'household_name',
        width: 250,
        fixed: 'left',
        sorter: (a, b) => a.household_name.localeCompare(b.household_name),
      },
      {
        title: 'Location',
        key: 'location',
        width: 200,
      },
      {
        title: 'Nets Issued',
        key: 'nets_issued',
        dataIndex: 'no_of_nets',
        width: 120,
        align: 'center',
        sorter: (a, b) => a.no_of_nets - b.no_of_nets,
      },
      {
        title: 'Issue Date',
        key: 'issue_date',
        dataIndex: 'issue_date',
        width: 150,
        sorter: (a, b) => moment(a.issue_date).unix() - moment(b.issue_date).unix(),
      },
      {
        title: 'Status',
        key: 'status',
        width: 100,
        align: 'center',
      },
    ];


    // Computed properties for filters
    const uniqueSubcounties = computed(() => {
      const subcounties = households.value
        .map(h => h.subcounty_name)
        .filter(s => s && s !== 'N/A');
      return [...new Set(subcounties)];
    });

    const uniqueWards = computed(() => {
      const wards = households.value
        .map(h => h.ward_name)
        .filter(w => w && w !== 'N/A');
      return [...new Set(wards)];
    });

    // Computed properties
    const filteredHouseholds = computed(() => {
      let filtered = households.value;

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(household => 
          household.household_name?.toLowerCase().includes(query)
        );
      }

      // Date filter
      if (dateFilter.value) {
        const selectedDate = moment(dateFilter.value).format('YYYY-MM-DD');
        filtered = filtered.filter(household => 
          moment(household.issue_date).format('YYYY-MM-DD') === selectedDate
        );
      }

      // Subcounty filter
      if (subcountyFilter.value) {
        filtered = filtered.filter(household => 
          household.subcounty_name === subcountyFilter.value
        );
      }

      // Ward filter
      if (wardFilter.value) {
        filtered = filtered.filter(household => 
          household.ward_name === wardFilter.value
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
        total + (household.no_of_nets || 0), 0
      )
    );

    const averageHouseholdSize = computed(() => {
      if (households.value.length === 0) return 0;
      // Since we don't have household size in the data, we'll estimate based on nets issued
      // Assuming 1 net per 2 people (standard recommendation)
      const totalEstimatedSize = households.value.reduce((total, household) => 
        total + ((household.no_of_nets || 0) * 2), 0
      );
      return totalEstimatedSize / households.value.length;
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
        
        const response = await axios.get(`/chp/${chp_id}/served_households`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          // Add index to each household for unique key
          households.value = (response.data.data || []).map((household, index) => ({
            ...household,
            id: index + 1
          }));
          
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

    const handleSubcountyFilter = () => {
      currentPage.value = 1; // Reset to first page when filtering
    };

    const handleWardFilter = () => {
      currentPage.value = 1; // Reset to first page when filtering
    };

    const resetFilters = () => {
      searchQuery.value = "";
      dateFilter.value = null;
      subcountyFilter.value = null;
      wardFilter.value = null;
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
        description: `Receipt for ${household.household_name} will be generated.`,
        duration: 3,
      });
    };

    const exportData = () => {
      try {
        // Create CSV content
        const headers = ['Household Name', 'Nets Issued', 'Issue Date', 'Subcounty', 'Ward', 'CHU Area'];
        const csvContent = [
          headers.join(','),
          ...filteredHouseholds.value.map(household => [
            `"${household.household_name}"`,
            household.no_of_nets,
            household.issue_date,
            `"${household.subcounty_name !== 'N/A' ? household.subcounty_name : 'Not Specified'}"`,
            `"${household.ward_name !== 'N/A' ? household.ward_name : 'Not Specified'}"`,
            `"${household.chu_area_name !== 'N/A' ? household.chu_area_name : 'Not Specified'}"`
          ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `households_served_${moment().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
          message: "Export Successful",
          description: "Households data has been exported successfully.",
          duration: 3,
        });
      } catch (error) {
        notification.error({
          message: "Export Failed",
          description: "An error occurred while exporting the data.",
          duration: 5,
        });
      }
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
      subcountyFilter,
      wardFilter,
      showDetailsModal,
      selectedHousehold,
      currentPage,
      pageSize,
      chp_village,
      emptyImage,
      columns,
      uniqueSubcounties,
      uniqueWards,
      filteredHouseholds,
      paginatedHouseholds,
      totalHouseholds,
      totalNetsIssued,
      averageHouseholdSize,
      paginationConfig,
      fetchServedHouseholds,
      handleSearch,
      handleDateFilter,
      handleSubcountyFilter,
      handleWardFilter,
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
