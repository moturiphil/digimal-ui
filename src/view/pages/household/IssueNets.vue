<template>
  <Main>
    <sdPageHeader ghost :title="`Issue Nets in ${chp_village}`" />

    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="10" :md="16" :xs="24">
                <BasicFormWrapper>
                  <!-- Step 1: Enter ID Number -->
                  <a-form
                    v-if="!householdFound"
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="searchHousehold"
                    @finish="searchHousehold"
                  >
                    <a-card 
                      style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;"
                      :headStyle="{ border: 'none', backgroundColor: 'transparent' }"
                    >
                      <div style="padding: 20px 0;">
                        <a-icon type="home" style="font-size: 48px; color: #1890ff; margin-bottom: 16px;" />
                        <h2 style="margin: 0 0 8px 0; color: #262626;">Find Household</h2>
                        <p style="margin: 0 0 24px 0; color: #8c8c8c;">
                          Enter the household head's ID number to search for the household
                        </p>
                        
                        <a-form-item
                          name="id_number"
                          :validate-status="errors.id_number ? 'error' : ''"
                          :help="errors.id_number"
                          style="margin-bottom: 24px;"
                        >
                          <a-input
                            v-model:value="searchForm.id_number"
                            placeholder="Enter 6-8 digit ID number"
                            type="text"
                            maxlength="8"
                            size="large"
                            style="border-radius: 6px; height: 48px; font-size: 16px; text-align: center;"
                            @blur="validate('id_number')"
                            @input="clearError('id_number')"
                            @keypress="onlyNumbers"
                          />
                        </a-form-item>

                        <sdButton
                          size="large"
                          type="primary"
                          :disabled="isLoading || !searchForm.id_number"
                          @click="searchHousehold"
                          style="border-radius: 6px; height: 48px; padding: 0 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);"
                        >
                          <a-icon v-if="!isLoading" type="search" style="margin-right: 8px;" />
                          <a-icon v-if="isLoading" type="loading" style="margin-right: 8px;" />
                          {{ isLoading ? "Searching..." : "Search Household" }}
                        </sdButton>
                      </div>
                    </a-card>
                  </a-form>

                  <!-- Step 2: Display Household Details and Issue Nets -->
                  <div v-if="householdFound && householdData">
                    <a-card 
                      title="Household Details" 
                      style="margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                      :headStyle="{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '16px' }"
                    >
                      <a-row :gutter="[16, 16]">
                        <a-col :span="24">
                          <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <a-avatar 
                              :size="40" 
                              style="background-color: #1890ff; margin-right: 12px;"
                            >
                              {{ householdData.first_name?.charAt(0) }}{{ householdData.last_name?.charAt(0) }}
                            </a-avatar>
                            <div>
                              <h3 style="margin: 0; color: #262626;">
                                {{ householdData.first_name }} {{ householdData.middle_name }} {{ householdData.last_name }}
                              </h3>
                              <p style="margin: 0; color: #8c8c8c; font-size: 14px;">Household Head</p>
                            </div>
                          </div>
                        </a-col>
                        <a-col :xs="24" :sm="12">
                          <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
                            <p style="margin: 0; color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">ID Number</p>
                            <p style="margin: 4px 0 0 0; font-weight: 500; font-size: 16px;">{{ householdData.id_no }}</p>
                          </div>
                        </a-col>
                        <a-col :xs="24" :sm="12">
                          <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
                            <p style="margin: 0; color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</p>
                            <p style="margin: 4px 0 0 0; font-weight: 500; font-size: 16px;">{{ householdData.phone_no }}</p>
                          </div>
                        </a-col>
                        <a-col :xs="24" :sm="12">
                          <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
                            <p style="margin: 0; color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Household Size</p>
                            <p style="margin: 4px 0 0 0; font-weight: 500; font-size: 16px;">{{ householdData.hh_size }} members</p>
                          </div>
                        </a-col>
                        <a-col :xs="24" :sm="12">
                          <div style="padding: 12px; background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%); border-radius: 6px; color: white;">
                            <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nets to Issue</p>
                            <p style="margin: 4px 0 0 0; font-weight: bold; font-size: 18px;">{{ householdData.actual_allocation }} nets</p>
                          </div>
                        </a-col>
                      </a-row>
                    </a-card>

                    <a-card 
                      title="Confirm Net Issuance" 
                      style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                      :headStyle="{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '16px' }"
                    >
                      <div style="text-align: center; padding: 20px 0;">
                        <a-icon type="check-circle" style="font-size: 48px; color: #52c41a; margin-bottom: 16px;" />
                        <h3 style="margin: 0 0 8px 0; color: #262626;">Ready to Issue Nets</h3>
                        <p style="margin: 0 0 24px 0; color: #8c8c8c;">
                          You are about to issue <strong>{{ householdData.actual_allocation }} nets</strong> to this household
                        </p>
                        
                        <div class="record-form-actions" style="display: flex; justify-content: center; gap: 12px;">
                          <sdButton
                            size="large"
                            type="default"
                            @click="resetForm"
                            style="border-radius: 6px; height: 48px; padding: 0 24px; font-weight: 500;"
                          >
                            <a-icon type="search" style="margin-right: 8px;" />
                            Search Another
                          </sdButton>
                          <sdButton
                            size="large"
                            type="success"
                            :disabled="isSubmitting"
                            @click="issueNets"
                            style="border-radius: 6px; height: 48px; padding: 0 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);"
                          >
                            <a-icon v-if="!isSubmitting" type="gift" style="margin-right: 8px;" />
                            <a-icon v-if="isSubmitting" type="loading" style="margin-right: 8px;" />
                            {{ isSubmitting ? "Processing..." : "Issue Nets" }}
                          </sdButton>
                        </div>
                      </div>
                    </a-card>
                  </div>
                </BasicFormWrapper>
              </a-col>
            </a-row>
          </sdCards>
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
import axios from "@/Axiosconfig";
import authHeader from "../../../services/auth-header";
import * as Yup from "yup";

const IssueNets = defineComponent({
  name: "IssueNets",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const householdFound = ref(false);
    const householdData = ref(null);
    const errors = ref({
      id_number: null,
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const chp = user.user;
    const chp_village = chp.location.name;

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

        const response = await axios.post(`/web/get_hh_by_id_number`, {
          id_number: searchForm.id_number
        }, {
          headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
          }
        });

        console.log('API response:', response.data);

        if (response.data.success) {
          householdData.value = response.data.data;
          householdFound.value = true;
          
          notification.success({
            message: "Household Found",
            description: "Household details retrieved successfully",
            duration: 3,
          });
        } else if (response.data.not_found) {
          notification.error({
            message: "Household Not Found",
            description: response.data.message || "Household not found.",
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

        const response = await axios.post('/web/issue_nets', requestData, {
          headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          notification.success({
            message: "Nets Issued Successfully",
            description: response.data.message || "Nets have been issued to the household",
            duration: 5,
          });
          
          // Reset form after successful submission
          resetForm();
        } else {
          notification.error({
            message: "Error Issuing Nets",
            description: response.data.message || "Failed to issue nets",
            duration: 5,
          });
        }
      } catch (error) {
        console.error('Issue nets error:', error);
        notification.error({
          message: "Error",
          description: "An error occurred while issuing nets",
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

    return {
      isLoading,
      isSubmitting,
      householdFound,
      householdData,
      searchForm,
      chp_village,
      validate,
      clearError,
      onlyNumbers,
      searchHousehold,
      issueNets,
      resetForm,
      errors,
    };
  },
});

export default IssueNets;
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

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
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

/* Success button glow effect */
.ant-btn-success {
  position: relative;
  overflow: hidden;
}

.ant-btn-success::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

.ant-btn-success:hover::before {
  left: 100%;
}

/* Input focus effects */
.ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* Card hover effects */
.ant-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  transition: box-shadow 0.3s ease;
}

/* Gradient text for numbers */
.gradient-text {
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Custom spacing */
.record-form-actions .ant-btn {
  margin: 0 6px;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .record-form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .record-form-actions .ant-btn {
    width: 100%;
    margin: 0;
  }
}
</style>
