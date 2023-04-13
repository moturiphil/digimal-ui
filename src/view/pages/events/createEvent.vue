<template>
  <sdPageHeader title="Create Event">
    <sdButton class="btn-add_new" size="default" key="1" type="success">
      <router-link to="/crud/axios-view">View All</router-link>
    </sdButton>
  </sdPageHeader>
  <Main>
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="10" :md="16" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item name="campaign_id" label="Campaign Name">
                      <a-select
                        v-model:value="formState.campaign_id"
                        v-if="!loading"
                        placeholder="Select Campaign Name"
                      >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :key="campaign.id"
                          :value="campaign.id"
                        >
                          {{ campaign.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="Event Type">
                      <a-select
                        size="large"
                        name="name"
                        class="sDash_fullwidth-select"
                        placeholder="Select Event Type"
                        v-model:value="formState.name"
                      >
                        <a-select-option value="Stakeholder meeting"
                          >Stakeholder meeting</a-select-option
                        >
                        <a-select-option
                          default-value="2"
                          value="Health Care Worker Training"
                          >Health Care Worker Training</a-select-option
                        >
                        <a-select-option value="CHV mobilization"
                          >CHV mobilization</a-select-option
                        >
                        <a-select-option value="Village Elder mobilization"
                          >Village Elder mobilization</a-select-option
                        >
                        <a-select-option value="CHV/VE Training"
                          >CHV/VE Training</a-select-option
                        >
                        <a-select-option value="Social mobilization"
                          >Social mobilization</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <a-form-item name="facilitator_id" label="Host">
                      <a-select
                        v-model:value="formState.facilitator_id"
                        v-if="!loading"
                        placeholder="Select Host"
                      >
                        <!-- select facilitator option  -->
                        <!-- <a-select-option>Select Facilitator</a-select-option> -->
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          v-model:value="facilitator.id"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} - {{ facilitator.phone_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.trainer_id"
                        v-if="!loading"
                        placeholder="Select at-most two facilitators"
                      >
                        <a-select-option
                          v-for="trainer in facilitators"
                          :key="trainer.id"
                          :value="trainer.id"
                        >
                          {{ trainer.first_name }}
                          {{ trainerlast_name }} - {{ trainer.id_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item name="venue" label="Event Venue">
                      <a-input
                        v-model:value="formState.venue"
                        placeholder="Input Event Venue"
                      />
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
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
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";


// testing app

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/with_facilitator`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const facilitator_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const trainer_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const { campaigns, facilitators, loading } = reactive({
      campaigns: "",
      loading: true, 
      facilitators: [],

    });

    const fetchCampaigns = async () => {
      const response = await fetch(campaign_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.campaigns = data.data;
      console.log(this.campaigns);
      this.loading = false;
    };
    fetchCampaigns();

    const fetchFacilitators = async () => {
      const response = await fetch(facilitator_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.facilitators = data.data;
      console.log(data.data);
      this.loading = false;
    };
    fetchFacilitators();

    const fetchTrainer = async () => {
      const response = await fetch(trainer_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.facilitators = data.data;
      console.log(data.data);
      this.loading = false;
    };
    fetchTrainer();

    const handleSubmit = () => {
      const data = {
        name: formState.name,
        user_id: 1,
        venue: formState.venue,
        location_id: 1, 
        campaign_id: formState.campaign_id,
        facilitator: formState.facilitator_id,
        trainers: formState.trainer_id,
      };

      console.log(data);

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(({ success, data }) => {
          if (success) {
            router.push("event-view");
            notification["success"]({
              message: "Event Created",
              description: `Event Created successfully. Your event code is ${data.event.event_code}`,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const formState = reactive({
      name: null,
      user_id: null,
      venue: "",
      location_id: null,
      campaign_id: null,
      facilitator_id: "",
      trainer_id: [],
    });

    console.log(formState);

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      campaigns,
      facilitators,
      loading,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default AddNew;
</script>
