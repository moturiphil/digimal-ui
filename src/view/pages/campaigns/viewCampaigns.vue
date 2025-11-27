<template>
  <div class="campaigns-wrapper">
    <div class="campaigns-header">
      <div class="header-content">
        <sdHeading as="h1" class="page-title">
          Campaigns
        </sdHeading>
        <p class="page-subtitle">Manage and view all your campaigns</p>
      </div>
      <div class="header-actions">
        <sdButton class="btn-create-campaign" size="large" type="success">
          <router-link to="/campaigns/create-campaign">
            <sdFeatherIcons type="plus" size="16" /> 
            <span>Create Campaign</span>
          </router-link>
        </sdButton>
      </div>
    </div>

    <Main>
      <div class="campaigns-content">
        <a-spin :spinning="isLoading" tip="Loading campaigns...">
          <div v-if="dataSource && dataSource.length > 0" class="campaigns-grid">
            <div
              v-for="(item, index) in dataSource"
              :key="item.id || index"
              class="campaign-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="card-header">
                <h3 class="campaign-name">{{ item.name }}</h3>
              </div>
              <div class="card-body">
                <div class="info-item">
                  <sdFeatherIcons type="calendar" size="16" class="info-icon" />
                  <div class="info-content">
                    <span class="info-label">Start Date</span>
                    <span class="info-value">{{ formatDate(item.start_date) }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <sdFeatherIcons type="calendar" size="16" class="info-icon" />
                  <div class="info-content">
                    <span class="info-label">End Date</span>
                    <span class="info-value">{{ formatDate(item.end_date) }}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="card-footer">
                <sdButton class="btn-view" type="success" size="default">
                  <router-link :to="`/campaigns/view/${item.id}`">
                    <sdFeatherIcons type="eye" size="16" />
                    <span>View Details</span>
                  </router-link>
                </sdButton>
              </div> -->
            </div>
          </div>
          <div v-else-if="!isLoading" class="empty-state">
            <sdFeatherIcons type="inbox" size="64" class="empty-icon" />
            <h3>No Campaigns Yet</h3>
            <p>Create your first campaign to get started</p>
            <sdButton class="btn-create-first" size="large" type="success">
              <router-link to="/campaigns/create-campaign">
                <sdFeatherIcons type="plus" size="16" />
                <span>Create Your First Campaign</span>
              </router-link>
            </sdButton>
          </div>
        </a-spin>
      </div>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { defineComponent, computed, onMounted, ref, reactive } from "vue";
import { useStore } from "vuex";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";

export default defineComponent({
  name: "ViewCampaigns",
  components: {
    Main,
  },
  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = ref(false);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    onMounted(async () => {
      isLoading.value = true;
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/campaign_all`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data || [];
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Error Loading Campaigns",
          description: "Failed to fetch campaigns. Please try again later.",
        });
      } finally {
        isLoading.value = false;
      }
    });

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      formState,
      formatDate,
    };
  },
});
</script>

<style scoped>
/* Main Wrapper */
.campaigns-wrapper {
  min-height: 100vh;
  background: #ffffff;
  padding: 30px;
}

/* Header Section */
.campaigns-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeInDown 0.6s ease-out;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #272b41;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #20c997 0%, #17a589 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 16px;
  color: #868eae;
  margin: 0;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
}

.btn-create-campaign {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.25);
  transition: all 0.3s ease;
}

.btn-create-campaign:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.35);
}

.btn-create-campaign a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Content Area */
.campaigns-content {
  animation: fadeInUp 0.6s ease-out 0.2s both;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  min-height: 400px;
}

/* Grid Layout */
.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
  padding: 0;
}

/* Campaign Card */
.campaign-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease-out both;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.campaign-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #20c997 0%, #17a589 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.campaign-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.campaign-card:hover::before {
  transform: scaleX(1);
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f2f5;
}

.campaign-name {
  font-size: 20px;
  font-weight: 700;
  color: #272b41;
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
}

.card-body {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
}

.info-icon {
  color: #20c997;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #868eae;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  color: #272b41;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 2px solid #f0f2f5;
}

.btn-view {
  border-radius: 10px;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-view a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-view:hover {
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.6s ease-out;
}

.empty-icon {
  color: #d0d4e4;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 700;
  color: #272b41;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: #868eae;
  margin-bottom: 32px;
}

.btn-create-first {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 0 32px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.25);
}

.btn-create-first a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Loading Spinner */
.ant-spin-nested-loading {
  min-height: 400px;
}

:deep(.ant-spin) {
  color: #20c997;
}

:deep(.ant-spin-dot-item) {
  background-color: #20c997;
}

:deep(.ant-spin-text) {
  color: #272b41;
  font-size: 14px;
  margin-top: 8px;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

/* Responsive Design */
@media (max-width: 1200px) {
  .campaigns-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .campaigns-wrapper {
    padding: 20px;
  }

  .campaigns-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    gap: 20px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-create-campaign {
    width: 100%;
    justify-content: center;
    height: 46px;
    font-size: 15px;
  }

  .page-title {
    font-size: 26px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .campaigns-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }

  .campaign-card {
    padding: 24px;
  }

  .campaign-name {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .campaigns-wrapper {
    padding: 16px;
  }

  .campaigns-header {
    padding: 20px;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 22px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .btn-create-campaign {
    height: 44px;
    font-size: 14px;
    padding: 0 20px;
  }

  .campaign-card {
    padding: 20px;
  }

  .campaign-name {
    font-size: 17px;
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 14px;
  }

  .btn-view {
    width: 100%;
    justify-content: center;
    font-size: 14px;
    height: 42px;
  }

  .empty-state {
    padding: 60px 20px;
  }

  .empty-state h3 {
    font-size: 20px;
  }

  .empty-state p {
    font-size: 14px;
  }

  .btn-create-first {
    width: 100%;
    height: 44px;
    font-size: 14px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-create-campaign,
  .btn-view,
  .btn-create-first {
    min-height: 44px;
  }

  .campaign-card:hover {
    transform: none;
  }

  .campaign-card:active {
    transform: scale(0.98);
  }
}
</style>
