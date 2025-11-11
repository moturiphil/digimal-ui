<template>
  <Main>
    <sdPageHeader ghost title="Household Registration" />
    
    <a-row justify="center" :gutter="15">
      <a-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <RecordFormWrapper>
          <sdCards headless>
            <div class="disabled-message-container">
              <div class="icon-container">
                <a-icon type="stop" class="disabled-icon" />
              </div>
              
              <div class="message-content">
                <h2 class="disabled-title">Household Registration Disabled</h2>
                <p class="disabled-description">
                  Household registration is currently disabled for this campaign. 
                  This feature is only available for Mass LLIN Campaign 2023 - 2024
                </p>
                
                <div class="info-box">
                  <div class="info-item">
                    <strong>Current Campaign:</strong> {{ currentCampaign }}
                  </div>
                  <div class="info-item">
                    <strong>Status:</strong> Registration Disabled
                  </div>
                </div>
                
                <div class="action-buttons">
                  <sdButton 
                    type="warning" 
                    size="large"
                    @click="issueNets"
                  >
                    <a-icon type="arrow-left" />
                    Issue Nets
                  </sdButton>
                  
                  <sdButton 
                    type="default" 
                    size="large"
                    @click="contactSupport"
                  >
                    <a-icon type="customer-service" />
                    Contact Support
                  </sdButton>
                </div>
              </div>
            </div>
          </sdCards>
        </RecordFormWrapper>
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { RecordFormWrapper } from "./style";
import { Main } from "../../styled";
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";

export default defineComponent({
  name: "HouseholdRegistrationDisabled",
  components: { 
    RecordFormWrapper, 
    Main 
  },
  
  setup() {
    const router = useRouter();
    
    // Get current campaign info from user data
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentCampaign = computed(() => {
      // Based on the session storage structure: user.user.campaign_id
      const campaignId = userData?.user?.campaign_id;
      return `Campaign ${campaignId || 'Unknown'}`;
    });
    
    const issueNets = () => {
      router.push({ name: "issue-nets" }); // Go to issue nets page
    };
    
    const contactSupport = () => {
      notification.info({
        message: "Contact Support",
        description: "Please contact your system administrator for assistance with household registration.",
        duration: 5,
      });
    };
    
    return {
      currentCampaign,
      issueNets,
      contactSupport
    };
  }
});
</script>

<style scoped>
.disabled-message-container {
  text-align: center;
  padding: 60px 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon-container {
  margin-bottom: 30px;
}

.disabled-icon {
  font-size: 80px;
  color: #ff4d4f;
  opacity: 0.8;
}

.message-content {
  max-width: 500px;
  width: 100%;
}

.disabled-title {
  color: #262626;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.3;
}

.disabled-description {
  color: #595959;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.info-box {
  background: #f9f9f9;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 40px;
  text-align: left;
}

.info-item {
  margin-bottom: 12px;
  font-size: 14px;
  color: #595959;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item strong {
  color: #262626;
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .ant-btn {
  min-width: 140px;
  height: 44px;
  border-radius: 6px;
  font-weight: 500;
}

.action-buttons .ant-btn .anticon {
  margin-right: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .disabled-message-container {
    padding: 40px 20px;
  }
  
  .disabled-title {
    font-size: 24px;
  }
  
  .disabled-description {
    font-size: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .ant-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .disabled-icon {
    font-size: 60px;
  }
  
  .disabled-title {
    font-size: 20px;
  }
  
  .info-box {
    padding: 16px;
  }
}
</style>