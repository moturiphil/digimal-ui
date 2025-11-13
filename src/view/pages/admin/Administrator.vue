<template>
  <div class="admin-container">
    <!-- Terminal-style Header -->
    <div class="terminal-header">
      <div class="terminal-controls">
        <span class="control-dot red"></span>
        <span class="control-dot yellow"></span>
        <span class="control-dot green"></span>
      </div>
      <div class="terminal-title">
        <a-icon type="code" class="terminal-icon" />
        <span class="terminal-text">root@massnet:~# Administrator Panel</span>
        <span class="cursor-blink">_</span>
      </div>
      <div class="terminal-status">
        <span class="status-indicator"></span>
        <span class="status-text">SYSTEM ONLINE</span>
      </div>
    </div>

    <Main>
      <SearchResultWrapper>
        <div class="admin-content">
          <!-- System Stats -->
          <div class="stats-grid">
            <div class="stat-card" v-for="(stat, index) in systemStats" :key="index">
              <div class="stat-header">
                <a-icon :type="stat.icon" class="stat-icon" />
                <span class="stat-label">{{ stat.label }}</span>
              </div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-footer">
                <span :class="['stat-change', stat.trend]">
                  <a-icon :type="stat.trend === 'up' ? 'arrow-up' : 'arrow-down'" />
                  {{ stat.change }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Access Cards -->
          <div class="section-header">
            <a-icon type="dashboard" />
            <span>QUICK ACCESS</span>
            <div class="header-line"></div>
          </div>
          
          <a-row :gutter="16" class="quick-access-grid">
            <a-col :xs="24" :sm="12" :lg="8">
              <div class="access-card">
                <div class="card-glow"></div>
                <div class="card-content">
                  <a-icon type="security-scan" class="card-icon" />
                  <h3 class="card-title">Event OTPs</h3>
                  <p class="card-description">Manage event authentication tokens</p>
                  <router-link :to="{ path: `/view/admin-events/` }" class="card-link">
                    <sdButton class="geek-button">
                      <a-icon type="right-circle" />
                      ACCESS MODULE
                    </sdButton>
                  </router-link>
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="8">
              <div class="access-card">
                <div class="card-glow"></div>
                <div class="card-content">
                  <a-icon type="node-index" class="card-icon" />
                  <h3 class="card-title">Sub County Events</h3>
                  <p class="card-description">Monitor regional event data</p>
                  <router-link :to="{ path: `/admin/subcounty-hh-reg` }" class="card-link">
                    <sdButton class="geek-button">
                      <a-icon type="right-circle" />
                      ACCESS MODULE
                    </sdButton>
                  </router-link>
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="8">
              <div class="access-card">
                <div class="card-glow"></div>
                <div class="card-content">
                  <a-icon type="transaction" class="card-icon" />
                  <h3 class="card-title">Transaction Reports</h3>
                  <p class="card-description">View system transaction logs</p>
                  <router-link :to="{ path: `/admin/transaction-reports` }" class="card-link">
                    <sdButton class="geek-button">
                      <a-icon type="right-circle" />
                      ACCESS MODULE
                    </sdButton>
                  </router-link>
                </div>
              </div>
            </a-col>
          </a-row>

          <!-- Endpoint Management Section -->
          <div class="section-header">
            <a-icon type="api" />
            <span>ENDPOINT MANAGEMENT</span>
            <div class="header-line"></div>
          </div>

          <div class="endpoint-section">
            <div class="endpoint-toolbar">
              <div class="toolbar-left">
                <a-input-search
                  v-model:value="endpointSearch"
                  placeholder="Search endpoints..."
                  class="search-input"
                  @search="filterEndpoints"
                >
                  <template #prefix>
                    <a-icon type="search" />
                  </template>
                </a-input-search>
              </div>
              <div class="toolbar-right">
                <sdButton class="create-endpoint-btn" @click="showCreateEndpointModal">
                  <a-icon type="plus-circle" />
                  CREATE ENDPOINT
                </sdButton>
                <sdButton class="refresh-btn" @click="fetchEndpoints">
                  <a-icon type="reload" :spin="isLoadingEndpoints" />
                </sdButton>
              </div>
            </div>

            <div v-if="isLoadingEndpoints" class="loading-container">
              <a-spin size="large">
                <template #indicator>
                  <a-icon type="loading" style="font-size: 48px" spin />
                </template>
              </a-spin>
              <p class="loading-text">LOADING ENDPOINTS...</p>
            </div>

            <div v-else class="endpoints-table-container">
              <table class="geek-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ENDPOINT</th>
                    <th>METHOD</th>
                    <th>STATUS</th>
                    <th>LAST UPDATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="endpoint in filteredEndpoints" :key="endpoint.id" class="table-row">
                    <td>
                      <span class="endpoint-id">#{{ endpoint.id || 'N/A' }}</span>
                    </td>
                    <td>
                      <div class="endpoint-path">
                        <a-icon type="link" />
                        <code>{{ endpoint.path || 'N/A' }}</code>
                      </div>
                    </td>
                    <td>
                      <span :class="['method-badge', (endpoint.method || 'GET').toLowerCase()]">
                        {{ endpoint.method || 'GET' }}
                      </span>
                    </td>
                    <td>
                      <span :class="['status-badge', endpoint.status ? 'active' : 'inactive']">
                        <span class="status-dot"></span>
                        {{ endpoint.status ? 'ACTIVE' : 'INACTIVE' }}
                      </span>
                    </td>
                    <td>
                      <span class="timestamp">{{ formatDate(endpoint.updated_at) }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <a-tooltip title="Edit Endpoint">
                          <sdButton class="action-btn edit" @click="showEditEndpointModal(endpoint)">
                            <a-icon type="edit" />
                          </sdButton>
                        </a-tooltip>
                        <a-tooltip :title="endpoint.status ? 'Deactivate' : 'Activate'">
                          <sdButton 
                            :class="['action-btn', endpoint.status ? 'deactivate' : 'activate']" 
                            @click="toggleEndpointStatus(endpoint)"
                          >
                            <a-icon :type="endpoint.status ? 'stop' : 'play-circle'" />
                          </sdButton>
                        </a-tooltip>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredEndpoints.length === 0">
                    <td colspan="6" class="no-data">
                      <a-icon type="inbox" style="font-size: 48px; opacity: 0.3;" />
                      <p>NO ENDPOINTS FOUND</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- SMS Settings Section -->
          <div class="section-header">
            <a-icon type="message" />
            <span>SMS SETTINGS</span>
            <div class="header-line"></div>
          </div>

          <div class="sms-section">
            <div v-if="isLoading" class="loading-container">
              <a-spin size="large">
                <template #indicator>
                  <a-icon type="loading" style="font-size: 48px" spin />
                </template>
              </a-spin>
              <p class="loading-text">LOADING SMS SETTINGS...</p>
            </div>

            <div v-else class="sms-table-container">
              <table class="geek-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>SERVICE</th>
                    <th>DESCRIPTION</th>
                    <th>PROVIDER</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sms in dataSource" :key="sms.id" class="table-row">
                    <td>
                      <span class="endpoint-id">#{{ sms.id }}</span>
                    </td>
                    <td>
                      <div class="service-label">
                        <a-icon type="notification" />
                        {{ sms.service_label }}
                      </div>
                    </td>
                    <td>
                      <span class="description-text">{{ sms.description }}</span>
                    </td>
                    <td>
                      <span class="provider-badge">
                        <a-icon type="cloud" />
                        {{ sms.sms_provider }}
                      </span>
                    </td>
                    <td>
                      <sdButton class="geek-button small" @click="handleToggle(sms)">
                        <a-icon type="swap" />
                        TOGGLE PROVIDER
                      </sdButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SearchResultWrapper>
    </Main>

    <!-- SMS Provider Toggle Modal -->
    <a-modal
      v-model:visible="isModalOpen"
      title="TOGGLE SMS PROVIDER"
      :footer="null"
      class="geek-modal"
      centered
    >
      <div class="modal-content">
        <div class="modal-icon">
          <a-icon type="warning" />
        </div>
        <p class="modal-text">
          Are you sure you want to toggle the service
          <span class="highlight">{{ service.service_label }}</span> from
          <span class="highlight">{{ service.sms_provider }}</span>?
        </p>
        <div class="modal-actions">
          <sdButton class="modal-btn cancel" @click="handleCancel">
            <a-icon type="close-circle" />
            CANCEL
          </sdButton>
          <sdButton class="modal-btn confirm" @click="handleOk" :disabled="isPaying">
            <a-icon type="check-circle" />
            {{ isPaying ? "PROCESSING..." : "CONFIRM" }}
          </sdButton>
        </div>
      </div>
    </a-modal>

    <!-- Create/Edit Endpoint Modal -->
    <a-modal
      v-model:visible="isEndpointModalOpen"
      :title="endpointModalMode === 'create' ? 'CREATE NEW ENDPOINT' : 'UPDATE ENDPOINT'"
      :footer="null"
      class="geek-modal"
      centered
      width="600px"
    >
      <div class="endpoint-form">
        <a-form layout="vertical" :model="endpointForm">
          <a-form-item label="ENDPOINT PATH" required>
            <a-input
              v-model:value="endpointForm.path"
              placeholder="/api/endpoint/path"
              class="geek-input"
            >
              <template #prefix>
                <a-icon type="link" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="HTTP METHOD" required>
            <a-select v-model:value="endpointForm.method" class="geek-select">
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="PATCH">PATCH</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="DESCRIPTION">
            <a-textarea
              v-model:value="endpointForm.description"
              placeholder="Endpoint description..."
              :rows="3"
              class="geek-input"
            />
          </a-form-item>

          <a-form-item label="STATUS">
            <a-switch
              v-model:checked="endpointForm.status"
              checked-children="ACTIVE"
              un-checked-children="INACTIVE"
              class="geek-switch"
            />
          </a-form-item>

          <div class="modal-actions">
            <sdButton class="modal-btn cancel" @click="closeEndpointModal">
              <a-icon type="close-circle" />
              CANCEL
            </sdButton>
            <sdButton 
              class="modal-btn confirm" 
              @click="submitEndpoint"
              :disabled="isSubmittingEndpoint"
            >
              <a-icon type="check-circle" />
              {{ isSubmittingEndpoint ? "PROCESSING..." : (endpointModalMode === 'create' ? 'CREATE' : 'UPDATE') }}
            </sdButton>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import moment from "moment";

export default defineComponent({
  name: "Administrator",
  components: {
    Main,
    SearchResultWrapper,
  },
  setup() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const isModalOpen = ref(false);
    const service = ref({});
    const service_id = ref(0);
    const isPaying = ref(false);

    // Endpoint Management
    const endpoints = ref([]);
    const filteredEndpoints = ref([]);
    const isLoadingEndpoints = ref(false);
    const endpointSearch = ref("");
    const isEndpointModalOpen = ref(false);
    const endpointModalMode = ref("create"); // 'create' or 'edit'
    const isSubmittingEndpoint = ref(false);
    const endpointForm = ref({
      id: null,
      path: "",
      method: "GET",
      description: "",
      status: true,
    });

    // System Stats
    const systemStats = ref([
      { label: "Total Endpoints", value: "0", icon: "api", change: "+12%", trend: "up" },
      { label: "Active Services", value: "0", icon: "check-circle", change: "+8%", trend: "up" },
      { label: "System Uptime", value: "99.9%", icon: "clock-circle", change: "+0.1%", trend: "up" },
      { label: "API Calls Today", value: "12.5K", icon: "line-chart", change: "+24%", trend: "up" },
    ]);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/get_sms_settings`;
    const ENDPOINT_LIST_URL = `${process.env.VUE_APP_BASE_URL}/endpoint_management/get_all`;
    const ENDPOINT_CREATE_URL = `${process.env.VUE_APP_BASE_URL}/endpoint_management/create`;
    const ENDPOINT_UPDATE_URL = `${process.env.VUE_APP_BASE_URL}/endpoint_management/update`;

    // Fetch SMS Settings
    const fetchSMSSettings = () => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          const logs = response.data.data.map((item) => ({
            id: item.id,
            service_label: item.service_label,
            description: item.description,
            sms_provider: item.sms_provider_id === 1 ? "Advanta" : "Africa's Talking",
          }));
          dataSource.value = logs;
          systemStats.value[1].value = logs.length.toString();
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: "Error",
            description: "Failed to load SMS settings",
          });
        });
    };

    // Fetch Endpoints
    const fetchEndpoints = async () => {
      isLoadingEndpoints.value = true;
      try {
        const response = await axios.get(ENDPOINT_LIST_URL, {
          headers: authHeader(),
        });
        
        if (response.data && response.data.success) {
          // Normalize endpoint data to ensure all fields exist
          endpoints.value = (response.data.data || []).map(endpoint => ({
            id: endpoint.id || null,
            path: endpoint.path || '',
            method: endpoint.method || 'GET',
            description: endpoint.description || '',
            status: endpoint.status === 1 || endpoint.status === true,
            updated_at: endpoint.updated_at || null,
            created_at: endpoint.created_at || null,
          }));
          filteredEndpoints.value = endpoints.value;
          systemStats.value[0].value = endpoints.value.length.toString();
          
          notification.success({
            message: "Success",
            description: `Loaded ${endpoints.value.length} endpoints successfully`,
            duration: 2,
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch endpoints");
        }
      } catch (error) {
        console.error("Fetch endpoints error:", error);
        
        // Check if it's a 404 or endpoint doesn't exist yet
        if (error.response && error.response.status === 404) {
          notification.info({
            message: "Info",
            description: "Endpoint management feature not yet configured on server",
            duration: 3,
          });
        } else {
          notification.error({
            message: "Error",
            description: error.response?.data?.message || error.message || "Failed to load endpoints",
            duration: 3,
          });
        }
        
        // Set empty array on error
        endpoints.value = [];
        filteredEndpoints.value = [];
      } finally {
        isLoadingEndpoints.value = false;
      }
    };

    // Filter Endpoints
    const filterEndpoints = () => {
      const search = endpointSearch.value.toLowerCase();
      if (!search) {
        filteredEndpoints.value = endpoints.value;
      } else {
        filteredEndpoints.value = endpoints.value.filter(
          (endpoint) =>
            endpoint.path?.toLowerCase().includes(search) ||
            endpoint.method?.toLowerCase().includes(search) ||
            endpoint.description?.toLowerCase().includes(search)
        );
      }
    };

    // Show Create Endpoint Modal
    const showCreateEndpointModal = () => {
      endpointModalMode.value = "create";
      endpointForm.value = {
        id: null,
        path: "",
        method: "GET",
        description: "",
        status: true,
      };
      isEndpointModalOpen.value = true;
    };

    // Show Edit Endpoint Modal
    const showEditEndpointModal = (endpoint) => {
      endpointModalMode.value = "edit";
      endpointForm.value = {
        id: endpoint.id || null,
        path: endpoint.path || "",
        method: endpoint.method || "GET",
        description: endpoint.description || "",
        status: endpoint.status === 1 || endpoint.status === true,
      };
      isEndpointModalOpen.value = true;
    };

    // Close Endpoint Modal
    const closeEndpointModal = () => {
      isEndpointModalOpen.value = false;
      endpointForm.value = {
        id: null,
        path: "",
        method: "GET",
        description: "",
        status: true,
      };
    };

    // Submit Endpoint (Create or Update)
    const submitEndpoint = async () => {
      if (!endpointForm.value.path) {
        notification.warning({
          message: "Validation Error",
          description: "Endpoint path is required",
        });
        return;
      }

      isSubmittingEndpoint.value = true;

      try {
        const url =
          endpointModalMode.value === "create"
            ? ENDPOINT_CREATE_URL
            : ENDPOINT_UPDATE_URL;

        const method = endpointModalMode.value === "create" ? "post" : "patch";

        const payload = {
          path: endpointForm.value.path,
          method: endpointForm.value.method,
          description: endpointForm.value.description,
          status: endpointForm.value.status ? 1 : 0,
        };

        if (endpointModalMode.value === "edit") {
          payload.id = endpointForm.value.id;
        }

        const response = await axios[method](url, payload, {
          headers: authHeader(),
        });

        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: response.data.message || `Endpoint ${endpointModalMode.value === "create" ? "created" : "updated"} successfully`,
          });
          closeEndpointModal();
          fetchEndpoints();
        } else {
          throw new Error(response.data.message || "Operation failed");
        }
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.response?.data?.message || error.message || `Failed to ${endpointModalMode.value} endpoint`,
        });
      } finally {
        isSubmittingEndpoint.value = false;
      }
    };

    // Toggle Endpoint Status
    const toggleEndpointStatus = async (endpoint) => {
      if (!endpoint || !endpoint.id) {
        notification.warning({
          message: "Warning",
          description: "Invalid endpoint data",
        });
        return;
      }
      
      const newStatus = !endpoint.status;
      
      try {
        const response = await axios.patch(
          ENDPOINT_UPDATE_URL,
          {
            id: endpoint.id,
            status: newStatus ? 1 : 0,
          },
          {
            headers: authHeader(),
          }
        );

        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: `Endpoint ${newStatus ? "activated" : "deactivated"} successfully`,
            duration: 2,
          });
          fetchEndpoints();
        } else {
          throw new Error(response.data.message || "Failed to toggle status");
        }
      } catch (error) {
        console.error("Toggle status error:", error);
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Failed to toggle endpoint status",
          duration: 3,
        });
      }
    };

    // Format Date
    const formatDate = (date) => {
      return date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : "N/A";
    };

    // SMS Settings Handlers
    const handleToggle = (record) => {
      isModalOpen.value = true;
      service.value = record;
      service_id.value = record.id;
    };

    const handleOk = async () => {
      isPaying.value = true;
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/toggle_sms_provider/${service_id.value}`,
          {
            method: "GET",
            headers: {
              ...authHeader(),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.success == true) {
            notification.success({
              message: "Success",
              description: data.message,
            });
            setTimeout(() => {
              fetchSMSSettings();
              isModalOpen.value = false;
            }, 1500);
          } else {
            notification.error({
              message: "Error",
              description: data.message,
            });
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Error",
          description: "Operation failed",
        });
      } finally {
        isPaying.value = false;
      }
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    onMounted(() => {
      fetchSMSSettings();
      fetchEndpoints();
    });

    return {
      isLoading,
      dataSource,
      activeClass,
      isModalOpen,
      service,
      handleToggle,
      handleCancel,
      handleOk,
      isPaying,
      // Endpoint Management
      endpoints,
      filteredEndpoints,
      isLoadingEndpoints,
      endpointSearch,
      filterEndpoints,
      fetchEndpoints,
      showCreateEndpointModal,
      showEditEndpointModal,
      closeEndpointModal,
      isEndpointModalOpen,
      endpointModalMode,
      endpointForm,
      submitEndpoint,
      isSubmittingEndpoint,
      toggleEndpointStatus,
      formatDate,
      systemStats,
    };
  },
});
</script>

<style scoped>
/* ============================================
   GEEK ADMIN THEME - DARK MODE
   ============================================ */

/* Base Container */
.admin-container {
  min-height: 100vh;
  background: #f5f5f5;
  background-image: 
    linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

/* Terminal Header */
.terminal-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-bottom: 2px solid #2563eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-dot.red {
  background: #ff5f56;
  box-shadow: 0 0 10px #ff5f56;
}

.control-dot.yellow {
  background: #ffbd2e;
  box-shadow: 0 0 10px #ffbd2e;
}

.control-dot.green {
  background: #27c93f;
  box-shadow: 0 0 10px #27c93f;
}

.control-dot:hover {
  transform: scale(1.2);
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.terminal-icon {
  font-size: 24px;
  color: #60a5fa;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  color: #60a5fa;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Main Content */
.admin-content {
  padding: 32px 24px;
}

/* System Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2563eb, transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.2);
  border-color: #60a5fa;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.stat-icon {
  font-size: 24px;
  color: #2563eb;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(31, 41, 55, 0.1);
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.up {
  color: #10b981;
}

.stat-change.down {
  color: #ef4444;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 40px 0 24px 0;
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

.section-header .anticon {
  font-size: 24px;
  color: #2563eb;
}

.header-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, transparent);
  position: relative;
}

.header-line::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 8px;
  height: 8px;
  background: #2563eb;
  transform: rotate(45deg);
  box-shadow: 0 0 10px #2563eb;
}

/* Quick Access Cards */
.quick-access-grid {
  margin-bottom: 40px;
}

.access-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  margin-bottom: 16px;
}

.access-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.access-card:hover::before {
  opacity: 1;
}

.access-card:hover {
  border-color: #2563eb;
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.2);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(37, 99, 235, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.access-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-icon {
  font-size: 48px;
  color: #2563eb;
  margin-bottom: 16px;
  display: block;
  filter: drop-shadow(0 0 10px rgba(37, 99, 235, 0.3));
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-description {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
}

.card-link {
  display: block;
}

.geek-button {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  color: #ffffff;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.geek-button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
  color: #ffffff;
}

.geek-button.small {
  padding: 6px 12px;
  font-size: 11px;
}

/* Endpoint Section */
.endpoint-section,
.sms-section {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.endpoint-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left {
  flex: 1;
  max-width: 400px;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.search-input {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #1f2937;
}

.search-input :deep(.ant-input) {
  background: #ffffff;
  color: #1f2937;
  border: none;
}

.search-input :deep(.ant-input::placeholder) {
  color: #9ca3af;
}

.search-input :deep(.anticon) {
  color: #2563eb;
}

.create-endpoint-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  color: #ffffff;
}

.refresh-btn {
  background: #ffffff;
  border: 2px solid #2563eb;
  color: #2563eb;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #2563eb;
  color: #ffffff;
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #2563eb;
}

.loading-text {
  margin-top: 20px;
  font-size: 14px;
  letter-spacing: 2px;
  animation: blink 1.5s ease-in-out infinite;
}

/* Geek Table */
.endpoints-table-container,
.sms-table-container {
  overflow-x: auto;
}

.geek-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.geek-table thead tr {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.geek-table th {
  padding: 16px 12px;
  text-align: left;
  color: #1f2937;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.geek-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.geek-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%);
  border-left: 3px solid #2563eb;
}

.geek-table td {
  padding: 14px 12px;
  color: #6b7280;
}

.endpoint-id {
  color: #1f2937;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.endpoint-path {
  display: flex;
  align-items: center;
  gap: 8px;
}

.endpoint-path code {
  background: #f9fafb;
  padding: 4px 8px;
  border-radius: 4px;
  color: #2563eb;
  border: 1px solid #e5e7eb;
  font-size: 12px;
}

.method-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
}

.method-badge.get {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.method-badge.post {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid #10b981;
}

.method-badge.put,
.method-badge.patch {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid #f59e0b;
}

.method-badge.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid #10b981;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
  animation: pulse 2s ease-in-out infinite;
}

.timestamp {
  font-family: 'Courier New', monospace;
  color: #9ca3af;
  font-size: 11px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.action-btn:hover {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.action-btn.edit:hover {
  border-color: #3b82f6;
  background: #3b82f6;
}

.action-btn.activate:hover {
  border-color: #10b981;
  background: #10b981;
}

.action-btn.deactivate:hover {
  border-color: #ef4444;
  background: #ef4444;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.no-data p {
  margin-top: 16px;
  font-size: 14px;
  letter-spacing: 2px;
}

/* SMS Table Specific */
.service-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
}

.description-text {
  color: #00ff4170;
  font-size: 12px;
}

.provider-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid #10b981;
  font-size: 12px;
}

/* Modals */
.geek-modal :deep(.ant-modal-content) {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

.geek-modal :deep(.ant-modal-header) {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.geek-modal :deep(.ant-modal-title) {
  color: #1f2937;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.geek-modal :deep(.ant-modal-close-x) {
  color: #1f2937;
}

.geek-modal :deep(.ant-modal-body) {
  background: transparent;
  color: #1f2937;
}

.modal-content {
  padding: 20px 0;
}

.modal-icon {
  text-align: center;
  font-size: 64px;
  color: #f59e0b;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.3));
}

.modal-text {
  text-align: center;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.8;
  margin-bottom: 24px;
}

.highlight {
  color: #2563eb;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.modal-btn.cancel {
  background: #ffffff;
  border: 2px solid #ef4444;
  color: #ef4444;
}

.modal-btn.cancel:hover {
  background: #ef4444;
  color: #ffffff;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: #ffffff;
}

.modal-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

/* Endpoint Form */
.endpoint-form {
  padding: 20px 0;
}

.endpoint-form :deep(.ant-form-item-label > label) {
  color: #1f2937;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.geek-input,
.geek-select {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  border-radius: 6px;
}

.geek-input:hover,
.geek-select:hover {
  border-color: #2563eb;
}

.geek-input:focus,
.geek-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
}

.geek-input :deep(.ant-input),
.geek-input :deep(.ant-input-textarea) {
  background: #ffffff;
  color: #1f2937;
  border: none;
}

.geek-input :deep(.ant-input::placeholder),
.geek-input :deep(.ant-input-textarea::placeholder) {
  color: #9ca3af;
}

.geek-input :deep(.anticon) {
  color: #2563eb;
}

.geek-select :deep(.ant-select-selector) {
  background: #ffffff !important;
  border: none !important;
  color: #1f2937 !important;
}

.geek-select :deep(.ant-select-arrow) {
  color: #1f2937;
}

.geek-switch {
  background: #e5e7eb;
}

.geek-switch:deep(.ant-switch-checked) {
  background: #10b981;
}

/* Responsive Design */
@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .terminal-title {
    font-size: 16px;
  }

  .terminal-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-content {
    padding: 20px 12px;
  }

  .terminal-header {
    padding: 12px 16px;
  }

  .terminal-status {
    display: none;
  }

  .endpoint-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    max-width: 100%;
  }

  .toolbar-right {
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .geek-table {
    font-size: 11px;
  }

  .geek-table th,
  .geek-table td {
    padding: 10px 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .section-header {
    font-size: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .stat-value {
    font-size: 24px;
  }

  .endpoint-path code {
    font-size: 10px;
    word-break: break-all;
  }
}

/* Force light backgrounds on all elements */
.admin-container :deep(*) {
  background-color: transparent;
}

.admin-container :deep(div),
.admin-container :deep(section),
.admin-container :deep(main) {
  background: transparent !important;
}

.admin-container :deep(.ant-card),
.admin-container :deep(.ant-card-body) {
  background: #ffffff !important;
}

.admin-container :deep(.ant-card-head) {
  background: #f9fafb !important;
}

.admin-container :deep(.ant-table),
.admin-container :deep(.ant-table-wrapper),
.admin-container :deep(.ant-table-container),
.admin-container :deep(.ant-table-content) {
  background: #ffffff !important;
}

.admin-container :deep(.ant-table-thead > tr > th) {
  background: #f9fafb !important;
  color: #1f2937 !important;
}

.admin-container :deep(.ant-table-tbody > tr) {
  background: #ffffff !important;
}

.admin-container :deep(.ant-table-tbody > tr > td) {
  background: transparent !important;
  color: #6b7280 !important;
}

.admin-container :deep(.ant-row),
.admin-container :deep(.ant-col) {
  background: transparent !important;
}

.admin-container :deep(.ant-modal-content) {
  background: #ffffff !important;
}

.admin-container :deep(.ant-modal-header) {
  background: #f9fafb !important;
}

.admin-container :deep(.ant-modal-body),
.admin-container :deep(.ant-modal-footer) {
  background: #ffffff !important;
}

.admin-container :deep(.ant-pagination-item) {
  background: #ffffff !important;
}
</style>