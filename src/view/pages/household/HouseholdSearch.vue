<template>
  <div>
    <sdPageHeader ghost title=" ">
      <template #buttons>
        <sdButton 
          type="primary" 
          size="default"
          @click="resetSearch"
          v-if="dataSource.length > 0"
        >
          <sdFeatherIcons type="rotate-ccw" size="14" />
          New Search
        </sdButton>
      </template>
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <!-- Advanced Search Form Card -->
        <a-card class="search-form-card" :bordered="false">
          <div class="search-header">
            <sdFeatherIcons type="edit" size="24" class="search-icon-header" />
            <div class="search-header-content">
              <h2 class="search-title">Find Household to Edit</h2>
              <p class="search-description">
                Search for households using their phone number to update their information
              </p>
            </div>
          </div>

          <a-form
            ref="searchFormRef"
            :model="searchForm"
            layout="vertical"
            class="advanced-search-form"
            @finish="handleSearch"
          >
            <a-row :gutter="[16, 0]">
              <!-- Phone Number Search Field -->
              <a-col :xs="24" :sm="24" :lg="24">
                <a-form-item
                  label="Phone Number"
                  name="phone_number"
                  :rules="[
                    { required: true, message: 'Phone number is required!' },
                    { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                  ]"
                >
                  <a-input
                    v-model:value="searchForm.phone_number"
                    placeholder="Enter 10-digit phone number (e.g., 0712345678)"
                    size="large"
                    maxlength="10"
                    :disabled="isLoading"
                    @keypress="onlyNumbers"
                  >
                    <template #prefix>
                      <sdFeatherIcons type="phone" size="16" />
                    </template>
                  </a-input>
                  <div class="search-hint">
                    Enter the household's 10-digit phone number to search
                  </div>
                </a-form-item>
              </a-col>
            </a-row>

            <!-- Search Actions -->
            <a-row :gutter="16" class="search-actions">
              <a-col :xs="24" :sm="12" :md="12">
                <sdButton
                  type="primary"
                  size="large"
                  htmlType="submit"
                  :disabled="isLoading || !hasSearchCriteria"
                  block
                  class="search-button"
                >
                  <sdFeatherIcons v-if="!isLoading" type="search" size="16" />
                  <span v-if="isLoading" class="loading-spinner">
                    <a-spin size="small" />
                  </span>
                  {{ isLoading ? 'Searching...' : 'Search Household' }}
                </sdButton>
              </a-col>
              <a-col :xs="24" :sm="12" :md="12">
                <sdButton
                  type="light"
                  size="large"
                  @click="clearForm"
                  :disabled="isLoading"
                  block
                >
                  <sdFeatherIcons type="x-circle" size="16" />
                  Clear Form
                </sdButton>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <!-- Search Results Section -->
        <div v-if="searchPerformed" class="results-section">
          <!-- Results Header -->
          <div class="results-header">
            <div class="results-info">
              <sdFeatherIcons type="list" size="20" class="results-icon" />
              <div>
                <h3 class="results-title">Search Results</h3>
                <p class="results-count" v-if="dataSource.length > 0">
                  Found <strong>{{ dataSource.length }}</strong> household{{ dataSource.length !== 1 ? 's' : '' }}
                </p>
                <p class="results-count no-results" v-else>
                  No households found matching your criteria
                </p>
              </div>
            </div>
          </div>

          <!-- Results Table -->
          <a-card v-if="dataSource.length > 0" class="results-card" :bordered="false">
            <a-table
              :pagination="{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} households`,
                pageSizeOptions: ['10', '25', '50', '100']
              }"
              :dataSource="dataSource"
              :columns="columns"
              :loading="isLoading"
              :scroll="{ x: 1000 }"
              class="households-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'full_name'">
                  <div class="household-name">
                    <sdFeatherIcons type="user" size="16" class="name-icon" />
                    <span>{{ record.first_name }} {{ record.middle_name }} {{ record.last_name }}</span>
                  </div>
                </template>

                <template v-if="column.key === 'phone_no'">
                  <div class="phone-number">
                    <sdFeatherIcons type="phone" size="14" />
                    <span>{{ record.phone_no }}</span>
                  </div>
                </template>

                <template v-if="column.key === 'id_no'">
                  <div class="id-number">
                    <sdFeatherIcons type="credit-card" size="14" />
                    <span>{{ record.id_no || 'N/A' }}</span>
                  </div>
                </template>

                <template v-if="column.key === 'actual_allocation'">
                  <a-tag :color="record.actual_allocation > 0 ? 'green' : 'orange'">
                    {{ record.actual_allocation }} {{ record.actual_allocation === 1 ? 'Net' : 'Nets' }}
                  </a-tag>
                </template>

                <template v-if="column.key === 'action'">
                  <div class="table-actions">
                    <sdButton
                      @click="handleUpdate(record)"
                      size="small"
                      type="success"
                      class="update-btn"
                    >
                      <sdFeatherIcons type="edit-3" size="14" />
                      Update ID
                    </sdButton>
                  </div>
                </template>
              </template>
            </a-table>
          </a-card>

          <!-- Empty State -->
          <a-card v-else class="empty-state-card" :bordered="false">
            <a-empty description="">
              <template #description>
                <h3>No Results Found</h3>
                <p>Try adjusting your search criteria or use different keywords</p>
              </template>
              <sdButton type="primary" @click="clearForm">
                <sdFeatherIcons type="rotate-ccw" size="14" />
                Clear Search
              </sdButton>
            </a-empty>
          </a-card>
        </div>
      </SearchResultWrapper>

      <!-- Update ID Modal -->
      <a-modal
        v-model:visible="isModalOpen"
        title="Update Household ID Number"
        @ok="handleOk"
        @cancel="handleCancel"
        :okText="isUpdating ? 'Updating...' : 'Update'"
        :confirmLoading="isUpdating"
        width="500px"
        class="update-modal"
      >
        <div class="modal-content">
          <div class="modal-info">
            <sdFeatherIcons type="info" size="20" class="info-icon" />
            <p>Update the ID number for this household head</p>
          </div>
          
          <div class="household-details">
            <p><strong>Name:</strong> {{ recordId?.first_name }} {{ recordId?.middle_name }} {{ recordId?.last_name }}</p>
            <p><strong>Current ID:</strong> {{ recordId?.id_no || 'Not set' }}</p>
            <p><strong>Phone:</strong> {{ recordId?.phone_no }}</p>
          </div>

          <a-form-item
            label="New ID Number"
            :validate-status="idError ? 'error' : ''"
            :help="idError"
          >
            <a-input
              v-model:value="inputValue"
              placeholder="Enter correct ID number"
              size="large"
              maxlength="20"
              @change="validateIdNumber"
            >
              <template #prefix>
                <sdFeatherIcons type="credit-card" size="16" />
              </template>
            </a-input>
          </a-form-item>
        </div>
      </a-modal>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, defineComponent, computed } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { notification } from "ant-design-vue";

export default defineComponent({
  name: "HouseholdSearch",
  components: {
    Main,
    SearchResultWrapper,
  },
  setup() {
    const isLoading = ref(false);
    const isUpdating = ref(false);
    const searchPerformed = ref(false);
    const searchFormRef = ref();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/search_household`;
    const BASE_URL = `${process.env.VUE_APP_BASE_URL}`;

    // Search form data
    const searchForm = ref({
      phone_number: "",
    });

    // Table columns with improved design
    const columns = [
      {
        title: "Household Head Name",
        key: "full_name",
        width: 250,
        ellipsis: true,
      },
      {
        title: "ID Number",
        dataIndex: "id_no",
        key: "id_no",
        width: 150,
      },
      {
        title: "Phone Number",
        dataIndex: "phone_no",
        key: "phone_no",
        width: 150,
      },
      {
        title: "Nets Allocated",
        dataIndex: "actual_allocation",
        key: "actual_allocation",
        width: 150,
        align: "center",
      },
      {
        title: "Action",
        key: "action",
        width: 150,
        align: "center",
        fixed: "right",
      },
    ];

    const dataSource = ref([]);
    const isModalOpen = ref(false);
    const recordId = ref(null);
    const inputValue = ref("");
    const idError = ref("");

    // Computed property to check if search criteria is filled
    const hasSearchCriteria = computed(() => {
      return searchForm.value.phone_number.trim() !== "" && 
             /^\d{10}$/.test(searchForm.value.phone_number.trim());
    });

    // Only allow numbers in phone input
    const onlyNumbers = (event) => {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    };

    onMounted(() => {
      // Initialize component
    });

    // Handle search
    const handleSearch = async () => {
      if (!hasSearchCriteria.value) {
        notification.warning({
          message: "Phone Number Required",
          description: "Please enter a valid 10-digit phone number to search.",
        });
        return;
      }

      try {
        isLoading.value = true;
        searchPerformed.value = true;
        
        const phoneNumber = searchForm.value.phone_number.trim();

        const response = await axios.get(
          `${API_URL}?query=${phoneNumber}`,
          {
            headers: authHeader(),
          }
        );

        const hh = response.data.data;
        dataSource.value = Array.isArray(hh) ? hh : [hh];

        if (dataSource.value.length === 0) {
          notification.info({
            message: "No Results",
            description: "No households found matching your search criteria.",
          });
        } else {
          notification.success({
            message: "Search Complete",
            description: `Found ${dataSource.value.length} household${dataSource.value.length !== 1 ? 's' : ''}.`,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        
        if (error.response) {
          notification.error({
            message: "Search Error",
            description: error.response.data.message || "Failed to search households. Please try again.",
          });
        } else if (error.request) {
          notification.error({
            message: "Network Error",
            description: "Unable to reach the server. Please check your connection.",
          });
        } else {
          notification.error({
            message: "Error",
            description: "An unexpected error occurred. Please try again.",
          });
        }
        
        dataSource.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Clear form
    const clearForm = () => {
      searchForm.value = {
        phone_number: "",
      };
      
      if (searchFormRef.value) {
        searchFormRef.value.clearValidate();
      }
    };

    // Reset search and clear results
    const resetSearch = () => {
      clearForm();
      dataSource.value = [];
      searchPerformed.value = false;
    };

    // Open update modal
    const handleUpdate = (record) => {
      recordId.value = record;
      inputValue.value = record.id_no || "";
      idError.value = "";
      isModalOpen.value = true;
    };

    // Close modal
    const handleCancel = () => {
      isModalOpen.value = false;
      inputValue.value = "";
      idError.value = "";
      recordId.value = null;
    };

    // Validate ID number input
    const validateIdNumber = () => {
      idError.value = "";
      
      if (!inputValue.value.trim()) {
        idError.value = "ID number is required";
        return false;
      }
      
      if (!/^\d+$/.test(inputValue.value.trim())) {
        idError.value = "ID number must contain only digits";
        return false;
      }
      
      if (inputValue.value.trim().length > 20) {
        idError.value = "ID number is too long";
        return false;
      }
      
      return true;
    };

    // Handle ID update
    const handleOk = async () => {
      if (!validateIdNumber()) {
        return;
      }

      const hh = recordId.value;
      const newIdNumber = inputValue.value.trim();

      try {
        isUpdating.value = true;

        const response = await axios.post(
          `${BASE_URL}/update_household_record`,
          {
            hh_id: hh.id,
            id_no: newIdNumber,
          },
          {
            headers: authHeader(),
          }
        );

        if (response.data.success === true) {
          notification.success({
            message: "Success",
            description: response.data.message || "Household ID number updated successfully.",
          });

          // Update the record in the table
          const index = dataSource.value.findIndex(item => item.id === hh.id);
          if (index !== -1) {
            dataSource.value[index].id_no = newIdNumber;
          }

          handleCancel();
        } else {
          notification.warning({
            message: "Update Failed",
            description: response.data.message || "Unable to update household ID number.",
          });
        }
      } catch (error) {
        console.error("Error updating household:", error);
        
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Error updating household ID number. Please try again.",
        });
      } finally {
        isUpdating.value = false;
      }
    };

    return {
      isLoading,
      isUpdating,
      searchPerformed,
      searchFormRef,
      dataSource,
      searchForm,
      handleSearch,
      columns,
      handleUpdate,
      handleCancel,
      isModalOpen,
      handleOk,
      inputValue,
      idError,
      validateIdNumber,
      hasSearchCriteria,
      clearForm,
      resetSearch,
      onlyNumbers,
    };
  },
});
</script>

<style scoped>
/* Search Form Card Styles */
.search-form-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background: linear-gradient(to bottom, #e6faf4 0%, #ffffff 120px);
}

.search-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #d1f5ea;
}

.search-icon-header {
  color: #20c997;
  margin-right: 16px;
  margin-top: 4px;
}

.search-header-content {
  flex: 1;
}

.search-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.search-description {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.6;
}

/* Advanced Search Form */
.advanced-search-form {
  margin-top: 24px;
}

.advanced-search-form .ant-form-item {
  margin-bottom: 20px;
}

.advanced-search-form .ant-form-item-label > label {
  font-weight: 600;
  color: #595959;
  font-size: 14px;
}

.advanced-search-form .ant-input-lg,
.advanced-search-form .ant-input-affix-wrapper-lg {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.advanced-search-form .ant-input-lg:hover,
.advanced-search-form .ant-input-affix-wrapper-lg:hover {
  border-color: #5dd9a8;
}

.advanced-search-form .ant-input-lg:focus,
.advanced-search-form .ant-input-affix-wrapper-focused {
  border-color: #20c997;
  box-shadow: 0 0 0 2px rgba(32, 201, 151, 0.1);
}

.advanced-search-form .ant-input-prefix {
  color: #8c8c8c;
  margin-right: 8px;
}

.search-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #8c8c8c;
  font-style: italic;
}

/* Search Actions */
.search-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f2f5;
}

.search-button {
  font-weight: 600;
  border-radius: 8px;
  height: 48px;
  font-size: 15px;
  background: linear-gradient(135deg, #20c997 0%, #3dd9b0 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.25);
  transition: all 0.3s;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1ab385 0%, #20c997 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.35);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.loading-spinner {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
}

/* Results Section */
.results-section {
  margin-top: 32px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #20c997 0%, #3dd9b0 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.2);
}

.results-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.results-icon {
  color: #fff;
  margin-right: 16px;
}

.results-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
}

.results-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.results-count.no-results {
  color: rgba(255, 255, 255, 0.85);
}

.results-count strong {
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

/* Results Card */
.results-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Table Styles */
.households-table {
  font-size: 14px;
}

.households-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  border-bottom: 2px solid #f0f0f0;
  padding: 16px;
}

.households-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.households-table :deep(.ant-table-tbody > tr:hover > td) {
  background: #e6faf4;
}

.household-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #262626;
}

.household-name .name-icon {
  color: #20c997;
  flex-shrink: 0;
}

.phone-number,
.id-number {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #595959;
}

.phone-number svg {
  color: #2C99FF;
  flex-shrink: 0;
}

.id-number svg {
  color: #5F63F2;
  flex-shrink: 0;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.update-btn {
  border-radius: 6px;
  font-weight: 500;
  background: linear-gradient(135deg, #20c997 0%, #3dd9b0 100%);
  border: none;
  color: white;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
  transition: all 0.3s;
}

.update-btn:hover {
  background: linear-gradient(135deg, #1ab385 0%, #20c997 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(32, 201, 151, 0.3);
}

/* Empty State */
.empty-state-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 60px 20px;
  text-align: center;
}

.empty-state-card :deep(.ant-empty-description) h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 16px 0 8px;
}

.empty-state-card :deep(.ant-empty-description) p {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 24px;
}

/* Modal Styles */
.update-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #20c997 0%, #3dd9b0 100%);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.update-modal :deep(.ant-modal-title) {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.update-modal :deep(.ant-modal-close) {
  color: #fff;
}

.update-modal :deep(.ant-modal-close:hover) {
  color: rgba(255, 255, 255, 0.85);
}

.modal-content {
  padding: 8px 0;
}

.modal-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #e6faf4;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #20c997;
}

.modal-info .info-icon {
  color: #20c997;
  margin-right: 12px;
  flex-shrink: 0;
}

.modal-info p {
  margin: 0;
  color: #595959;
  font-size: 14px;
}

.household-details {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.household-details p {
  margin: 8px 0;
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
}

.household-details p:first-child {
  margin-top: 0;
}

.household-details p:last-child {
  margin-bottom: 0;
}

.household-details strong {
  color: #262626;
  font-weight: 600;
  display: inline-block;
  min-width: 110px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-icon-header {
    margin-bottom: 12px;
  }

  .search-title {
    font-size: 20px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .results-info {
    margin-bottom: 16px;
  }

  .search-actions .ant-col {
    margin-bottom: 12px;
  }

  .households-table :deep(.ant-table) {
    font-size: 13px;
  }

  .household-details strong {
    min-width: auto;
    display: block;
    margin-bottom: 4px;
  }
}

@media (max-width: 576px) {
  .search-form-card {
    margin-left: -12px;
    margin-right: -12px;
    border-radius: 0;
  }

  .search-title {
    font-size: 18px;
  }

  .search-description {
    font-size: 13px;
  }

  .results-title {
    font-size: 18px;
  }

  .empty-state-card {
    padding: 40px 16px;
  }
}

/* Loading States */
.ant-btn[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-section {
  animation: slideInUp 0.4s ease-out;
}

/* Tags */
.ant-tag {
  border-radius: 4px;
  font-weight: 500;
  padding: 4px 12px;
  font-size: 13px;
}

/* Form Validation */
.ant-form-item-has-error :deep(.ant-input),
.ant-form-item-has-error :deep(.ant-input-affix-wrapper) {
  border-color: #ff4d4f;
}

.ant-form-item-has-error :deep(.ant-input:focus),
.ant-form-item-has-error :deep(.ant-input-affix-wrapper-focused) {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

/* Primary Action Buttons - Green Theme */
.ant-btn-primary {
  background-color: #20c997;
  border-color: #20c997;
}

.ant-btn-primary:hover:not(:disabled) {
  background-color: #0fa876;
  border-color: #0fa876;
}

.ant-btn-primary:focus {
  background-color: #20c997;
  border-color: #20c997;
}
</style>
