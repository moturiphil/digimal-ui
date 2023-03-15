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
                    <!-- <a-form-item name="name" label="Event Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Input Event Name"
                      />
                    </a-form-item> -->
                    <a-form-item label="Event Type">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Event Type"
                      >
                        <a-select-option value="1"
                          >Stakeholder meeting</a-select-option
                        >
                        <a-select-option default-value="2" value="2"
                          >Health Care Worker Training</a-select-option
                        >
                        <a-select-option value="3"
                          >CHV mobilization</a-select-option
                        >
                        <a-select-option value="4"
                          >Village Elder mobilization</a-select-option
                        >
                        <a-select-option value="5"
                          >CHV/VE Training</a-select-option
                        >
                        <a-select-option value="5"
                          >Social mobilization</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <a-form-item name="campaign_id" label="Campaign Name">
                      <a-select v-model="formState.campaign_id" v-if="!loading" placeholder="Select Campaign Name">
                        <a-select-option
                          v-for="campaign in campaigns"
                          :key="campaign.id"
                          :value="campaign.id"
                        >
                          {{ campaign.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item name="facilitator_id" label="Facilitator">
                      <a-select
                        v-model="formState.facilitator_id"
                        v-if="!loading"
                        placeholder="Select Facilitator"
                      >
                        <!-- select facilitator option  -->
                        <!-- <a-select-option>Select Facilitator</a-select-option> -->
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          :value="facilitator.id"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} - {{ facilitator.id_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item name="facilitator_id" label="Trainers">
                      <a-select
                        mode="multiple"
                        v-model="formState.facilitator_id"
                        v-if="!loading"
                        placeholder="Select at-most two facilitators"
                      >
                        <!-- <a-select-option>Select Facilitator</a-select-option> -->
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          :value="facilitator.id"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} - {{ facilitator.id_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <!-- <a-form-item label="Officers">
                      <a-select
                        mode="multiple"
                        v-model="selectedOfficers"
                        placeholder="Please select"
                      >
                        <a-select-option
                        v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          :value="facilitator.id"
                        >
                          {{ option.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item> -->
                    <!-- <a-form-item name="user_id" label="User ID">
                      <a-input-number
                        v-model:value="formState.user_id"
                        placeholder="Input User ID"
                      />
                    </a-form-item> -->
                    <a-form-item name="venue" label="Event Venue">
                      <a-input
                        v-model:value="formState.venue"
                        placeholder="Input Event Venue"
                      />
                    </a-form-item>
                    <!-- <a-form-item name="location_id" label="Location ID">
                      <a-input-number
                        v-model:value="formState.location_id"
                        placeholder="Input Location ID"
                      />
                    </a-form-item> -->
                    <!-- <a-form-item name="facilitators" label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.facilitators_select"
                        placeholder="Select one or more facilitators"
                      >
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          :value="facilitator.id"
                        >
                          {{ facilitator.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item> -->
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
import axios from "axios";
import authHeader from "../../../services/auth-header";
// import Select from 'vue-select';

// const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/with_facilitator`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const facilitator_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const trainer_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const { campaigns, facilitators, loading } = reactive({
      campaigns: [],
      loading: true, // setCampaigns: () => {},
      facilitators: [],
      // setFacilitator: () => {},
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

    const handleSubmit = (values) => {
      const data = {
        name: values.name,
        user_id: 1, // replace with the logged-in user's ID
        venue: values.venue,
        location_id: 1, // replace with the actual location ID
        campaign_id: values["campaign_id"],
        facilitator_id: values["facilitator_id"],
      };
      console.log(data);
      axios
        .post(API_URL, data, { headers: authHeader() })
        .then((response) => {
          console.log(response.data);
          // redirect to the event detail page or show a success message
        })
        .catch((error) => {
          console.log(error);
          // show an error message
        });
    };

    const formState = reactive({
      name: null,
      user_id: null,
      venue: "",
      location_id: null,
      campaign_id: null,
      facilitator_id: [],
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
