<template>
  <Main>
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <a-icon type="check-circle" class="header-icon" />
          <div>
            <h2 class="page-title">Households Served</h2>
            <p class="page-subtitle">Track and manage net distribution</p>
          </div>
        </div>
        <sdButton
          type="warning"
          size="large"
          @click="navigateToIssueNets"
          class="issue-nets-btn"
        >
          <a-icon type="plus" />
          Issue Nets
        </sdButton>
      </div>
    </div>

    <!-- Summary Statistics Cards -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon-wrapper blue">
            <a-icon type="check-circle" class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Households Served</p>
            <h3 class="stat-value">{{ totalHouseholds }}</h3>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card-green">
          <div class="stat-icon-wrapper green">
            <a-icon type="gift" class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Nets Issued</p>
            <h3 class="stat-value">{{ totalNetsIssued }}</h3>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card-purple">
          <div class="stat-icon-wrapper purple">
            <a-icon type="team" class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg. Household Size</p>
            <h3 class="stat-value">{{ averageHouseholdSize.toFixed(1) }}</h3>
            <p class="stat-note">Based on 1 net per 2 people</p>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Served Households Section -->
    <a-card class="main-card" :bordered="false">
      <div class="section-header">
        <h3 class="section-title">
          <a-icon type="check-circle" />
          Served Households
        </h3>
        <p class="section-description">View and manage households that have received nets</p>
      </div>

          <!-- Search and Filter -->
          <div class="filters-section">
            <a-row :gutter="[12, 12]">
              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-input
                  v-model:value="searchQuery"
                  placeholder="Search household name..."
                  size="large"
                  class="filter-input"
                  allow-clear
                  @input="handleSearch"
                >
                  <template #prefix>
                    <a-icon type="search" />
                  </template>
                </a-input>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="5">
                <a-date-picker
                  v-model:value="dateFilter"
                  placeholder="Filter by date"
                  size="large"
                  class="filter-input"
                  style="width: 100%;"
                  @change="handleDateFilter"
                />
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="5">
                <a-select
                  v-model:value="subcountyFilter"
                  placeholder="Subcounty"
                  size="large"
                  class="filter-input"
                  style="width: 100%;"
                  allow-clear
                  @change="handleSubcountyFilter"
                >
                  <a-select-option v-for="subcounty in uniqueSubcounties" :key="subcounty" :value="subcounty">
                    {{ subcounty }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="4">
                <a-select
                  v-model:value="wardFilter"
                  placeholder="Ward"
                  size="large"
                  class="filter-input"
                  style="width: 100%;"
                  allow-clear
                  @change="handleWardFilter"
                >
                  <a-select-option v-for="ward in uniqueWards" :key="ward" :value="ward">
                    {{ ward }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="12" :sm="6" :md="4" :lg="2">
                <sdButton
                  type="default"
                  size="large"
                  class="action-btn"
                  block
                  @click="resetFilters"
                >
                  <a-icon type="reload" />
                  <span class="btn-text-desktop">Reset</span>
                </sdButton>
              </a-col>
              <a-col :xs="12" :sm="6" :md="4" :lg="2">
                <sdButton
                  type="success"
                  size="large"
                  class="action-btn"
                  block
                  @click="exportData"
                >
                  <a-icon type="download" />
                  <span class="btn-text-desktop">Export</span>
                </sdButton>
              </a-col>
            </a-row>
          </div>

          <!-- Served Households Table -->
          <div class="table-container">
            <a-table
              :columns="servedColumns"
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
                  <div class="household-cell">
                    <a-avatar 
                      :size="40" 
                      class="household-avatar"
                    >
                      {{ record.household_name?.charAt(0) }}
                    </a-avatar>
                    <div class="household-info">
                      <div class="household-name">{{ record.household_name }}</div>
                    </div>
                  </div>
                </template>

                <template v-if="column.key === 'location'">
                  <div class="location-cell">
                    <div class="location-main">{{ record.subcounty_name !== 'N/A' ? record.subcounty_name : 'Not Specified' }}</div>
                    <div class="location-sub">Ward: {{ record.ward_name !== 'N/A' ? record.ward_name : 'Not Specified' }}</div>
                    <div class="location-sub">CHU: {{ record.chu_area_name !== 'N/A' ? record.chu_area_name : 'Not Specified' }}</div>
                  </div>
                </template>

                <template v-if="column.key === 'nets_issued'">
                  <a-tag color="green" class="nets-tag">
                    <a-icon type="gift" />
                    {{ record.no_of_nets }} nets
                  </a-tag>
                </template>

                <template v-if="column.key === 'issue_date'">
                  <div class="date-cell">
                    <div class="date-main">{{ formatDate(record.issue_date) }}</div>
                    <div class="date-time">{{ formatTime(record.issue_date) }}</div>
                  </div>
                </template>

                <template v-if="column.key === 'status'">
                  <a-tag color="green" class="status-tag">
                    <a-icon type="check-circle" />
                    Completed
                  </a-tag>
                </template>

                <template v-if="column.key === 'actions'">
                  <a-dropdown>
                    <a-button type="link" class="action-menu-btn">
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
                    type="warning"
                    @click="navigateToIssueNets"
                    class="empty-action-btn"
                  >
                    <a-icon type="plus" />
                    Issue First Nets
                  </sdButton>
                </a-empty>
              </template>
            </a-table>
          </div>
    </a-card>

    <!-- Details Modal -->
    <a-modal
      v-model:visible="showDetailsModal"
      title="Household Details"
      width="600px"
      :footer="null"
      class="details-modal"
    >
      <div v-if="selectedHousehold" class="modal-content">
        <a-descriptions bordered :column="1" size="middle">
          <a-descriptions-item label="Household Name">
            <strong>{{ selectedHousehold.household_name }}</strong>
          </a-descriptions-item>
          <a-descriptions-item label="Nets Issued">
            <a-tag color="green">
              <a-icon type="gift" />
              {{ selectedHousehold.no_of_nets }} nets
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Issue Date">
            {{ formatDate(selectedHousehold.issue_date) }} at {{ formatTime(selectedHousehold.issue_date) }}
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
              <a-icon type="check-circle" />
              Completed
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </Main>
</template>

<script>
import { Main } from "../../styled";
import { ref, defineComponent, computed, onMounted } from "vue";
import { notification, Empty } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/Axiosconfig";
import moment from "moment";

const CHPHHServed = defineComponent({
  name: "CHPHHServed",
  components: { Main },

  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const isLoading = ref(false);
    const isUnservedLoading = ref(false);
    const households = ref([]);
    const unservedHouseholds = ref([]);
    const searchQuery = ref("");
    const dateFilter = ref(null);
    const subcountyFilter = ref(null);
    const wardFilter = ref(null);
    const showDetailsModal = ref(false);
    const selectedHousehold = ref(null);
    const activeTab = ref("served");
    
    // Unserved filters
    const unservedSearchQuery = ref("");
    const unservedSubcountyFilter = ref(null);
    const unservedWardFilter = ref(null);
    
    // Pagination
    const currentPage = ref(1);
    const pageSize = ref(10);
    const unservedCurrentPage = ref(1);
    const unservedPageSize = ref(10);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const chp = user.user;
    const chp_village = chp.location.name;
    const chp_id = route.params.chp_id || chp.id;

    const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

    // Served households table columns
    const servedColumns = [
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
        width: 220,
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
        width: 120,
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

    // Unserved households table columns
    const unservedColumns = [
      {
        title: 'Household Head',
        key: 'household_name',
        width: 280,
        fixed: 'left',
      },
      {
        title: 'Location',
        key: 'location',
        width: 220,
      },
      {
        title: 'Household Size',
        key: 'household_size',
        dataIndex: 'hh_size',
        width: 140,
        align: 'center',
        sorter: (a, b) => a.hh_size - b.hh_size,
      },
      {
        title: 'Nets Allocated',
        key: 'nets_allocation',
        dataIndex: 'actual_allocation',
        width: 140,
        align: 'center',
        sorter: (a, b) => a.actual_allocation - b.actual_allocation,
      },
      {
        title: 'Phone',
        key: 'phone',
        width: 150,
      },
      {
        title: 'Status',
        key: 'status',
        width: 120,
        align: 'center',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 130,
        align: 'center',
        fixed: 'right',
      },
    ];

    // Computed properties for served households filters
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

    // Computed properties for unserved households filters
    const unservedUniqueSubcounties = computed(() => {
      const subcounties = unservedHouseholds.value
        .map(h => h.subcounty_name)
        .filter(s => s && s !== '' && s !== null);
      return [...new Set(subcounties)];
    });

    const unservedUniqueWards = computed(() => {
      const wards = unservedHouseholds.value
        .map(h => h.ward_name)
        .filter(w => w && w !== '' && w !== null);
      return [...new Set(wards)];
    });

    // Filtered served households
    const filteredHouseholds = computed(() => {
      let filtered = households.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(household => 
          household.household_name?.toLowerCase().includes(query)
        );
      }

      if (dateFilter.value) {
        const selectedDate = moment(dateFilter.value).format('YYYY-MM-DD');
        filtered = filtered.filter(household => 
          moment(household.issue_date).format('YYYY-MM-DD') === selectedDate
        );
      }

      if (subcountyFilter.value) {
        filtered = filtered.filter(household => 
          household.subcounty_name === subcountyFilter.value
        );
      }

      if (wardFilter.value) {
        filtered = filtered.filter(household => 
          household.ward_name === wardFilter.value
        );
      }

      return filtered;
    });

    // Filtered unserved households
    const filteredUnservedHouseholds = computed(() => {
      let filtered = unservedHouseholds.value;

      if (unservedSearchQuery.value) {
        const query = unservedSearchQuery.value.toLowerCase();
        filtered = filtered.filter(household => 
          `${household.first_name} ${household.middle_name} ${household.last_name}`.toLowerCase().includes(query)
        );
      }

      if (unservedSubcountyFilter.value) {
        filtered = filtered.filter(household => 
          household.subcounty_name === unservedSubcountyFilter.value
        );
      }

      if (unservedWardFilter.value) {
        filtered = filtered.filter(household => 
          household.ward_name === unservedWardFilter.value
        );
      }

      return filtered;
    });

    const paginatedHouseholds = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredHouseholds.value.slice(start, end);
    });

    const paginatedUnservedHouseholds = computed(() => {
      const start = (unservedCurrentPage.value - 1) * unservedPageSize.value;
      const end = start + unservedPageSize.value;
      return filteredUnservedHouseholds.value.slice(start, end);
    });

    const totalHouseholds = computed(() => households.value.length);
    const totalUnservedHouseholds = computed(() => unservedHouseholds.value.length);
    
    const totalNetsIssued = computed(() => 
      households.value.reduce((total, household) => 
        total + (household.no_of_nets || 0), 0
      )
    );

    const averageHouseholdSize = computed(() => {
      if (households.value.length === 0) return 0;
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

    const unservedPaginationConfig = computed(() => ({
      current: unservedCurrentPage.value,
      pageSize: unservedPageSize.value,
      total: filteredUnservedHouseholds.value.length,
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

    // const fetchUnservedHouseholds = async () => {
    //   try {
    //     isUnservedLoading.value = true;
        
    //     // Get the post_id from the CHP's location
    //     const post_id = chp.location?.id || chp.post_id;
        
    //     if (!post_id) {
    //       notification.error({
    //         message: "Error",
    //         description: "Unable to determine post location.",
    //         duration: 5,
    //       });
    //       isUnservedLoading.value = false;
    //       return;
    //     }
        
    //     const response = await axios.get(`/hh_per_post_pending_collection`, {
    //       params: {
    //         post_id: post_id
    //       },
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //         'Content-Type': 'application/json'
    //       }
    //     });

    //     if (response.data.success) {
    //       // Use requestAnimationFrame to defer update and prevent ResizeObserver errors
    //       requestAnimationFrame(() => {
    //         nextTick(() => {
    //           unservedHouseholds.value = (response.data.data || []).map((household, index) => ({
    //             ...household,
    //             id: index + 1
    //           }));
    //         });
    //       });
    //     } else {
    //       notification.error({
    //         message: "Error Loading Data",
    //         description: response.data.message || "Failed to load pending households.",
    //         duration: 5,
    //       });
    //     }
    //   } catch (error) {
    //     console.error('Fetch pending households error:', error);
    //     notification.error({
    //       message: "Error",
    //       description: "An error occurred while loading pending households.",
    //       duration: 5,
    //     });
    //   } finally {
    //     // Defer loading state update
    //     setTimeout(() => {
    //       isUnservedLoading.value = false;
    //     }, 100);
    //   }
    // };

    const handleSearch = () => {
      currentPage.value = 1;
    };

    const handleDateFilter = () => {
      currentPage.value = 1;
    };

    const handleSubcountyFilter = () => {
      currentPage.value = 1;
    };

    const handleWardFilter = () => {
      currentPage.value = 1;
    };

    const resetFilters = () => {
      searchQuery.value = "";
      dateFilter.value = null;
      subcountyFilter.value = null;
      wardFilter.value = null;
      currentPage.value = 1;
    };

    const handleUnservedSearch = () => {
      unservedCurrentPage.value = 1;
    };

    const handleUnservedSubcountyFilter = () => {
      unservedCurrentPage.value = 1;
    };

    const handleUnservedWardFilter = () => {
      unservedCurrentPage.value = 1;
    };

    const resetUnservedFilters = () => {
      unservedSearchQuery.value = "";
      unservedSubcountyFilter.value = null;
      unservedWardFilter.value = null;
      unservedCurrentPage.value = 1;
    };

    const handleTableChange = (pagination) => {
      currentPage.value = pagination.current;
      pageSize.value = pagination.pageSize;
    };

    const handleUnservedTableChange = (pagination) => {
      unservedCurrentPage.value = pagination.current;
      unservedPageSize.value = pagination.pageSize;
    };

    const viewDetails = (household) => {
      selectedHousehold.value = household;
      showDetailsModal.value = true;
    };

    const printReceipt = (household) => {
      notification.info({
        message: "Print Receipt",
        description: `Receipt for ${household.household_name} will be generated.`,
        duration: 3,
      });
    };

    const exportData = () => {
      try {
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
          description: "Served households data has been exported.",
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

    const exportUnservedData = () => {
      try {
        const headers = ['Household Head', 'ID Number', 'Phone', 'Household Size', 'Nets Allocated', 'Subcounty', 'Ward', 'CHU Area'];
        const csvContent = [
          headers.join(','),
          ...filteredUnservedHouseholds.value.map(household => [
            `"${household.first_name} ${household.middle_name} ${household.last_name}"`,
            household.id_no,
            household.phone_no || 'N/A',
            household.hh_size,
            household.actual_allocation,
            `"${household.subcounty_name || 'Not Specified'}"`,
            `"${household.ward_name || 'Not Specified'}"`,
            `"${household.chu_area_name || 'Not Specified'}"`
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `unserved_households_${moment().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
          message: "Export Successful",
          description: "Unserved households data has been exported.",
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

    const navigateToIssueNetsForHousehold = (household) => {
      // Navigate to issue nets page with pre-filled household data
      router.push({
        path: '/issue-nets',
        query: { id_number: household.id_no }
      });
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
      // fetchUnservedHouseholds();
    });

    return {
      isLoading,
      isUnservedLoading,
      households,
      unservedHouseholds,
      searchQuery,
      dateFilter,
      subcountyFilter,
      wardFilter,
      unservedSearchQuery,
      unservedSubcountyFilter,
      unservedWardFilter,
      showDetailsModal,
      selectedHousehold,
      activeTab,
      currentPage,
      pageSize,
      unservedCurrentPage,
      unservedPageSize,
      chp_village,
      emptyImage,
      servedColumns,
      unservedColumns,
      uniqueSubcounties,
      uniqueWards,
      unservedUniqueSubcounties,
      unservedUniqueWards,
      filteredHouseholds,
      filteredUnservedHouseholds,
      paginatedHouseholds,
      paginatedUnservedHouseholds,
      totalHouseholds,
      totalUnservedHouseholds,
      totalNetsIssued,
      averageHouseholdSize,
      paginationConfig,
      unservedPaginationConfig,
      fetchServedHouseholds,
      // fetchUnservedHouseholds,
      handleSearch,
      handleDateFilter,
      handleSubcountyFilter,
      handleWardFilter,
      resetFilters,
      handleUnservedSearch,
      handleUnservedSubcountyFilter,
      handleUnservedWardFilter,
      resetUnservedFilters,
      handleTableChange,
      handleUnservedTableChange,
      viewDetails,
      printReceipt,
      exportData,
      exportUnservedData,
      navigateToIssueNets,
      navigateToIssueNetsForHousehold,
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

/* Custom Tabs Container */
.custom-tabs {
  margin-top: 24px;
}

.custom-tabs :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab) {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin-right: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active) {
  background: #ffffff;
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.custom-tabs :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab:hover) {
  background: #ffffff;
  border-color: #b8c7fa;
}

.custom-tabs :deep(.ant-tabs-card-bar .ant-tabs-tab) {
  background: transparent;
}

.main-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tabs-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.tabs-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tabs-title .anticon {
  color: #667eea;
  font-size: 24px;
}

.tabs-description {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.tabs-container {
  position: relative;
  min-height: 400px;
}

/* Modern Page Styles */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
  animation: fadeInDown 0.6s ease;
}

.page-header h1 {
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-header h1 :deep(.anticon) {
  font-size: 40px;
}

.page-header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
}

.stat-icon :deep(.anticon) {
  font-size: 26px;
  color: #667eea;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

/* Tabs Styling */
.households-tabs {
  animation: fadeIn 0.6s ease 0.3s both;
}

.households-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 24px;
  background: #f7fafc;
  padding: 8px;
  border-radius: 12px;
}

.households-tabs :deep(.ant-tabs-tab) {
  font-size: 16px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 4px;
  background: transparent;
  border: 2px solid transparent;
}

.households-tabs :deep(.ant-tabs-tab:hover) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.households-tabs :deep(.ant-tabs-tab-active) {
  background: #ffffff;
  color: #667eea;
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.households-tabs :deep(.ant-tabs-ink-bar) {
  display: none;
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.tab-title .anticon {
  font-size: 18px;
}

/* Filter Card */
.filter-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.filter-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-card h3 :deep(.anticon) {
  color: #667eea;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Table Card */
.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.table-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-header h3 :deep(.anticon) {
  color: #667eea;
}

.table-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Custom Table Styling */
:deep(.ant-table) {
  font-size: 15px;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  padding: 16px;
  border-bottom: 2px solid #e2e8f0;
}

:deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.ant-table-tbody > tr:hover) {
  background: #f7fafc;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

/* Household Avatar */
.household-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.household-info :deep(.ant-avatar) {
  background: #667eea;
  font-size: 16px;
  font-weight: 600;
}

.household-details h4 {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.household-details p {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

/* Location Badge */
.location-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-info :deep(.ant-tag) {
  margin: 0;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  border: none;
}

/* Net Count Badge */
.net-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 36px;
  background: #667eea;
  color: #ffffff;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  padding: 0 12px;
}

/* Status Tag Styling */
:deep(.ant-tag) {
  border-radius: 6px;
  padding: 4px 12px;
  font-weight: 500;
  border: none;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

:deep(.ant-btn) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-btn-primary) {
  background: #667eea;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.ant-btn-primary:hover) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

:deep(.ant-btn-default) {
  border: 1px solid #cbd5e0;
}

:deep(.ant-btn-default:hover) {
  border-color: #667eea;
  color: #667eea;
}

/* Modal Styling */
:deep(.ant-modal-header) {
  background: #667eea;
  border-radius: 16px 16px 0 0;
  padding: 20px 24px;
}

:deep(.ant-modal-title) {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

:deep(.ant-modal-close-x) {
  color: #ffffff;
  font-size: 18px;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

.detail-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  font-size: 13px;
  color: #718096;
  margin-bottom: 4px;
  font-weight: 500;
}

.detail-value {
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

/* Input and Select Styling */
:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 8px;
  border-color: #cbd5e0;
  font-size: 15px;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover),
:deep(.ant-picker:hover) {
  border-color: #667eea;
}

:deep(.ant-input:focus),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

/* Pagination Styling */
:deep(.ant-pagination) {
  margin-top: 24px;
}

:deep(.ant-pagination-item) {
  border-radius: 8px;
  border-color: #cbd5e0;
}

:deep(.ant-pagination-item-active) {
  background: #667eea;
  border-color: #667eea;
}

:deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

/* Empty State */
:deep(.ant-empty) {
  padding: 60px 20px;
}

:deep(.ant-empty-description) {
  color: #718096;
  font-size: 16px;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Styles */
@media (max-width: 992px) {
  .page-header {
    padding: 24px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .page-header h1 :deep(.anticon) {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-actions {
    width: 100%;
  }

  .table-actions :deep(.ant-btn) {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
    margin-bottom: 24px;
  }

  .page-header h1 {
    font-size: 22px;
    gap: 12px;
  }

  .page-header h1 :deep(.anticon) {
    font-size: 28px;
  }

  .page-header p {
    font-size: 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-icon :deep(.anticon) {
    font-size: 24px;
  }

  .stat-value {
    font-size: 28px;
  }

  .filter-card {
    padding: 20px;
  }

  .filter-card h3 {
    font-size: 16px;
  }

  .filters-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filter-actions {
    flex-direction: column;
  }

  .filter-actions :deep(.ant-btn) {
    width: 100%;
  }

  .table-card {
    padding: 16px;
    border-radius: 12px;
  }

  .table-header h3 {
    font-size: 18px;
  }

  .households-tabs :deep(.ant-tabs-tab) {
    font-size: 14px;
    padding: 10px 16px;
  }

  .custom-tabs :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab) {
    padding: 10px 16px;
    margin-right: 8px;
    font-size: 14px;
  }

  .tab-title {
    font-size: 13px;
  }

  .tab-title .anticon {
    font-size: 16px;
  }

  :deep(.ant-table-wrapper) {
    overflow-x: auto;
  }

  :deep(.ant-table) {
    min-width: 800px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons :deep(.ant-btn) {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 16px;
    border-radius: 12px;
  }

  .page-header h1 {
    font-size: 20px;
    gap: 10px;
  }

  .page-header h1 :deep(.anticon) {
    font-size: 24px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 13px;
  }

  .filter-card,
  .table-card {
    padding: 16px;
  }

  :deep(.ant-modal) {
    max-width: calc(100vw - 32px);
    margin: 16px auto;
  }
}
</style>

