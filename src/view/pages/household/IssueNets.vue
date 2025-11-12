<template>
  <Main>
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <a-icon type="home" class="header-icon" />
          <div>
            <h2 class="page-title">Issue Nets</h2>
            <p class="page-subtitle">{{ chp_post }}</p>
          </div>
        </div>
        <sdButton
          type="success"
          size="large"
          @click="navigateToServedHouseholds"
          class="view-households-btn"
        >
          <a-icon type="list" />
          View Served Households
        </sdButton>
      </div>
    </div>

    <a-row :gutter="[24, 24]">
      <a-col :xs="24">
        <RecordFormWrapper>
          <a-row justify="center">
            <a-col :xl="12" :lg="14" :md="18" :sm="22" :xs="24">
              <BasicFormWrapper>
                <!-- Step 1: Search Household Form -->
                <a-card 
                  v-if="!householdFound"
                  class="search-card"
                  :bordered="false"
                >
                  <div class="search-container">
                    <div class="search-icon-wrapper">
                      <a-icon type="search" class="search-icon" />
                    </div>
                    <h2 class="card-title">Find Household</h2>
                    <p class="card-description">
                      Enter the household head's ID number to begin
                    </p>
                    
                    <a-form
                      class="search-form"
                      layout="vertical"
                      name="searchHousehold"
                      @finish="searchHousehold"
                    >
                      <a-form-item
                        name="id_number"
                        :validate-status="errors.id_number ? 'error' : ''"
                        :help="errors.id_number"
                      >
                        <a-input
                          v-model:value="searchForm.id_number"
                          placeholder="Enter 6-8 digit ID number"
                          type="text"
                          maxlength="8"
                          size="large"
                          class="search-input"
                          @blur="validate('id_number')"
                          @input="clearError('id_number')"
                          @keypress="onlyNumbers"
                        >
                          <template #prefix>
                            <a-icon type="idcard" style="color: #8c8c8c;" />
                          </template>
                        </a-input>
                      </a-form-item>

                      <sdButton
                        size="large"
                        type="warning"
                        :disabled="isLoading || !searchForm.id_number"
                        @click="searchHousehold"
                        class="search-btn"
                        block
                      >
                        <a-icon v-if="!isLoading" type="search" />
                        <a-icon v-if="isLoading" type="loading" />
                        {{ isLoading ? "Searching..." : "Search Household" }}
                      </sdButton>
                    </a-form>
                  </div>
                </a-card>

                <!-- Step 2: Household Details with Issue Nets -->
                <div v-if="householdFound && householdData" class="household-section">
                  <a-card 
                    class="household-card"
                    :bordered="false"
                  >
                    <div class="household-header">
                      <a-icon type="check-circle" class="success-icon" />
                      <h3 class="household-title">Household Found</h3>
                    </div>

                    <!-- Household Head Info -->
                    <div class="household-head">
                      <a-avatar 
                        :size="64" 
                        class="head-avatar"
                      >
                        {{ householdData.first_name?.charAt(0) }}{{ householdData.last_name?.charAt(0) }}
                      </a-avatar>
                      <div class="head-info">
                        <h3 class="head-name">
                          {{ householdData.first_name }} {{ householdData.middle_name }} {{ householdData.last_name }}
                        </h3>
                        <p class="head-role">Household Head</p>
                      </div>
                    </div>

                    <!-- Household Details Grid -->
                    <a-row :gutter="[12, 12]" class="details-grid">
                      <a-col :xs="24" :sm="12">
                        <div class="detail-item">
                          <a-icon type="idcard" class="detail-icon" />
                          <div>
                            <p class="detail-label">ID Number</p>
                            <p class="detail-value">{{ householdData.id_no }}</p>
                          </div>
                        </div>
                      </a-col>
                      <a-col :xs="24" :sm="12">
                        <div class="detail-item">
                          <a-icon type="phone" class="detail-icon" />
                          <div>
                            <p class="detail-label">Phone Number</p>
                            <p class="detail-value">{{ householdData.phone_no }}</p>
                          </div>
                        </div>
                      </a-col>
                      <a-col :xs="24" :sm="12">
                        <div class="detail-item">
                          <a-icon type="team" class="detail-icon" />
                          <div>
                            <p class="detail-label">Household Size</p>
                            <p class="detail-value">{{ householdData.hh_size }} members</p>
                          </div>
                        </div>
                      </a-col>
                      <a-col :xs="24" :sm="12">
                        <div class="detail-item nets-allocation">
                          <a-icon type="gift" class="detail-icon" />
                          <div>
                            <p class="detail-label">Nets Allocated</p>
                            <p class="detail-value nets-count">{{ householdData.actual_allocation }}</p>
                          </div>
                        </div>
                      </a-col>
                    </a-row>

                    <!-- Issue Nets Button -->
                    <div class="action-section">
                      <sdButton
                        size="large"
                        type="warning"
                        :disabled="isSubmitting"
                        @click="issueNets"
                        class="issue-btn"
                        block
                      >
                        <a-icon v-if="!isSubmitting" type="gift" />
                        <a-icon v-if="isSubmitting" type="loading" />
                        {{ isSubmitting ? "Processing..." : `Issue ${householdData.actual_allocation} Nets` }}
                      </sdButton>
                    </div>
                  </a-card>

                  <!-- Search Another Household Card -->
                  <a-card 
                    class="search-another-card"
                    :bordered="false"
                  >
                    <div class="search-another-content">
                      <a-icon type="reload" class="reload-icon" />
                      <h3 class="search-another-title">Need to serve another household?</h3>
                      <p class="search-another-description">
                        Click below to search for a different household
                      </p>
                      <sdButton
                        size="large"
                        type="success"
                        @click="resetForm"
                        class="search-another-btn"
                      >
                        <a-icon type="search" />
                        Search Another Household
                      </sdButton>
                    </div>
                  </a-card>
                </div>
              </BasicFormWrapper>
            </a-col>
          </a-row>
        </RecordFormWrapper>
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { reactive, ref, defineComponent } from "vue";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import authHeader from "../../../services/auth-header";
import * as Yup from "yup";

const IssueNets = defineComponent({
  name: "IssueNets",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const router = useRouter();
    
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const householdFound = ref(false);
    const householdData = ref(null);
    const errors = ref({
      id_number: null,
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const chp = user.user;
    const chp_id = chp.id;


    // hit get_my_post endpoint to get post_name
    const chp_post = ref("");

    console.log(chp);
    const searchForm = reactive({
      id_number: "",
    });

    // Validation schemas
    const SearchSchema = Yup.object().shape({
      id_number: Yup.string()
        .required("ID Number is required")
        .matches(/^\d{6,8}$/, "ID Number must be 6-8 digits"),
    });

    const validate = async (field) => {
      try {
        await SearchSchema.validateAt(field, searchForm);
        errors.value[field] = "";
      } catch (err) {
        errors.value[err.path] = err.message;
      }
    };

    const clearError = (field) => {
      errors.value[field] = null;
    };

    const onlyNumbers = (event) => {
      // Allow only numbers
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    };

    const searchHousehold = async () => {
      console.log('searchHousehold called with id_number:', searchForm.id_number);
      try {
        isLoading.value = true;
        
        // Validate search form
        await SearchSchema.validate(searchForm, { abortEarly: false });
        
        // Clear previous errors
        errors.value = {
          id_number: null,
        };

        // Use Fetch API instead of axios
        const apiUrl = `${process.env.VUE_APP_BASE_URL || ''}/web/get_hh_by_id_number`;

        const fetchResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_number: searchForm.id_number }),
        });

        // Parse JSON response (server expected to return JSON)
        let data = null;
        try {
          data = await fetchResponse.json();
        } catch (err) {
          console.error('Failed to parse JSON response from get_hh_by_id_number:', err);
          throw new Error('Invalid JSON response from server');
        }

        console.log('get_hh_by_id_number response:', fetchResponse.status, data);

        if (fetchResponse.ok && data && data.success) {
          householdData.value = data.data;
          householdFound.value = true;

          notification.success({
            message: 'Household Found',
            description: data.message,
            duration: 3,
          });
        } else if (data && data.not_found) {
          notification.error({
            message: 'Household Not Found',
            description: data.message || 'Household not found.',
            duration: 5,
          });
        } else {
          notification.error({
            message: 'Error',
            description: (data && data.message) || 'An error occurred while searching for the household',
            duration: 5,
          });
        }
      } 
      catch (error) {
        console.error('Search error:', error);
        if (error.inner) {
          // Validation errors
          error.inner.forEach((e) => {
            errors.value[e.path] = e.message;
          });
        } else {
          console.log(error);
          notification.error({
            message: "Error",
            description: "An error occurred while searching for the household",
            duration: 5,
          });
        }
      } 
      finally {
        isLoading.value = false;
      }
    };

    const issueNets = async () => {
      try {
        isSubmitting.value = true;
        
        // Clear previous errors
        errors.value = {
          id_number: null,
        };

        const requestData = {
          id_number: searchForm.id_number,
          hh_id: householdData.value.id,
          no_of_nets: householdData.value.actual_allocation,
          post_id: householdData.value.post_id,
        };

        // Use Fetch API instead of axios
        const apiUrl = `${process.env.VUE_APP_BASE_URL || ''}/web/issue_nets`;

        const fetchResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
          },
          body: JSON.stringify(requestData),
        });

        // Try to parse JSON body (server is expected to return JSON)
        let data = null;
        try {
          data = await fetchResponse.json();
        } catch (err) {
          console.error('Failed to parse JSON response from issue_nets:', err);
          throw new Error('Invalid JSON response from server');
        }

        console.log('issue_nets response:', data);

        // Treat non-2xx as error (but still use returned JSON message if present)
        if (fetchResponse.ok && data && data.success) {
          notification.success({
            message: 'Nets Issued Successfully',
            description: data.message || 'Nets have been issued to the household',
            duration: 5,
          });

          // Reset form after successful submission
          resetForm();
        } else {
          notification.error({
            message: 'Error Issuing Nets',
            description: (data && data.message) || 'Failed to issue nets',
            duration: 5,
          });
        }
      } catch (error) {
        console.error('Issue nets error:', error);
        notification.error({
          message: "Error",
          description: "Household already issued nets",
          duration: 5,
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => {
      searchForm.id_number = "";
      householdFound.value = false;
      householdData.value = null;
      errors.value = {
        id_number: null,
      };
    };

    const getPost = () => {
      const apiUrl = `${process.env.VUE_APP_BASE_URL || ''}/get_my_post`;

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('get_my_post response:', data);
        if (data && data.success) {
          chp_post.value = data.data.name;
        } else {
          chp_post.value = chp.level.level_name;
        }
      })
      .catch(error => {
        console.error('Error fetching post name:', error);
      });
    };

    getPost();

    const navigateToServedHouseholds = () => {
      router.push(`/chp/${chp_id}/hh-served`);
    };

    return {
      isLoading,
      isSubmitting,
      householdFound,
      householdData,
      searchForm,
      chp_post,
      validate,
      clearError,
      onlyNumbers,
      searchHousehold,
      issueNets,
      resetForm,
      navigateToServedHouseholds,
      errors,
    };
  },
});

export default IssueNets;
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: fadeInDown 0.6s ease-out;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 32px;
  color: #20c997;
  padding: 12px;
  background: linear-gradient(135deg, #e6f9f4 0%, #d1f4ea 100%);
  border-radius: 12px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.page-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #8c8c8c;
}

.view-households-btn {
  border-radius: 10px;
  height: 44px;
  padding: 0 24px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.2);
}

.view-households-btn .anticon {
  margin-right: 8px;
}

/* Search Card */
.search-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.search-container {
  text-align: center;
  padding: 32px 24px;
}

.search-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #faad14 0%, #fa8c16 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.search-icon {
  font-size: 36px;
  color: #fff;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.card-description {
  margin: 0 0 32px 0;
  font-size: 16px;
  color: #8c8c8c;
  line-height: 1.6;
}

.search-form {
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  height: 52px;
  border-radius: 10px;
  font-size: 16px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.search-input:hover {
  border-color: #faad14;
}

.search-input:focus {
  border-color: #faad14;
  box-shadow: 0 0 0 3px rgba(250, 173, 20, 0.1);
  transform: scale(1.01);
}

.search-btn {
  height: 52px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3);
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(250, 173, 20, 0.4);
}

.search-btn .anticon {
  margin-right: 8px;
}

/* Household Section */
.household-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Household Card */
.household-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease-out 0.2s both;
  border: 2px solid #e8f9f4;
}

.household-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px dashed #e8e8e8;
}

.success-icon {
  font-size: 48px;
  color: #52c41a;
  margin-bottom: 12px;
  display: block;
  animation: scaleIn 0.5s ease-out;
}

.household-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.household-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.head-avatar {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.head-info {
  flex: 1;
}

.head-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.head-role {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

/* Details Grid */
.details-grid {
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 100%;
}

.detail-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.detail-icon {
  font-size: 24px;
  color: #1890ff;
}

.detail-label {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.detail-value {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.nets-allocation {
  background: linear-gradient(135deg, #e6f9f4 0%, #d1f4ea 100%);
  border: 2px solid #20c997;
}

.nets-allocation .detail-icon {
  color: #20c997;
}

.nets-count {
  font-size: 20px;
  color: #20c997;
  font-weight: bold;
}

/* Action Section */
.action-section {
  padding-top: 20px;
  border-top: 2px dashed #e8e8e8;
}

.issue-btn {
  height: 56px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  transition: all 0.3s ease;
}

.issue-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
}

.issue-btn .anticon {
  margin-right: 8px;
  font-size: 20px;
}

/* Search Another Card */
.search-another-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px dashed #d9d9d9;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.search-another-content {
  text-align: center;
  padding: 32px 24px;
}

.reload-icon {
  font-size: 40px;
  color: #8c8c8c;
  margin-bottom: 16px;
  display: block;
}

.search-another-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.search-another-description {
  margin: 0 0 24px 0;
  font-size: 15px;
  color: #8c8c8c;
}

.search-another-btn {
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  min-width: 200px;
  transition: all 0.3s ease;
}

.search-another-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-another-btn .anticon {
  margin-right: 8px;
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-title {
    justify-content: center;
  }

  .header-icon {
    font-size: 28px;
    padding: 10px;
  }

  .page-title {
    font-size: 20px;
  }

  .view-households-btn {
    width: 100%;
    justify-content: center;
  }

  .search-container {
    padding: 24px 16px;
  }

  .search-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .search-icon {
    font-size: 28px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 15px;
  }

  .search-input,
  .search-btn {
    height: 48px;
    font-size: 15px;
  }

  .household-head {
    padding: 16px;
  }

  .head-avatar {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .head-name {
    font-size: 16px;
  }

  .detail-item {
    padding: 12px;
  }

  .detail-icon {
    font-size: 20px;
  }

  .detail-value {
    font-size: 15px;
  }

  .nets-count {
    font-size: 18px;
  }

  .issue-btn {
    height: 52px;
    font-size: 16px;
  }

  .search-another-content {
    padding: 24px 16px;
  }

  .reload-icon {
    font-size: 32px;
  }

  .search-another-title {
    font-size: 16px;
  }

  .search-another-description {
    font-size: 14px;
  }

  .search-another-btn {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 18px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .card-title {
    font-size: 18px;
  }

  .household-head {
    flex-direction: column;
    text-align: center;
  }

  .head-info {
    text-align: center;
  }
}
</style>
