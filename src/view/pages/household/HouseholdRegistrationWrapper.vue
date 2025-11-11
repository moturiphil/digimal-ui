<template>
  <AddHouseHold v-if="isCampaign1" />
  <HouseholdRegistrationDisabled v-else />
</template>

<script>
import { defineComponent, computed } from "vue";
import AddHouseHold from "./AddHouseHold.vue";
import HouseholdRegistrationDisabled from "./HouseholdRegistrationDisabled.vue";

export default defineComponent({
  name: "HouseholdRegistrationWrapper",
  components: {
    AddHouseHold,
    HouseholdRegistrationDisabled
  },
  
  setup() {
    // Check if current user is in campaign 1
    const isCampaign1 = computed(() => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
        
        // Based on the session storage structure: user.user.campaign_id
        const campaignId = userData?.user?.campaign_id;
        
        // Convert to number for comparison if it's a string
        const numericCampaignId = typeof campaignId === 'string' ? 
                                 parseInt(campaignId, 10) : 
                                 campaignId;
        
        console.log("User Campaign ID:", numericCampaignId);
        console.log("User Data:", userData?.user);
        
        // Return true only if campaign ID is 1
        return numericCampaignId === 1;
      } catch (error) {
        console.error("Error checking campaign:", error);
        // Default to false (disabled) if there's any error
        return false;
      }
    });
    
    return {
      isCampaign1
    };
  }
});
</script>