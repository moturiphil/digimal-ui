<template>
  <Main>
    <sdPageHeader title="Create Event">
      <sdButton class="btn-add_new" size="default" key="1" type="success">
        <router-link to="/crud/axios-view">View All</router-link>
      </sdButton>
    </sdPageHeader>
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
                        placeholder="Selected Host"
                        v-model:value="formState.facilitator_id"
                        v-if="!loading"
                      >
                        <a-select-option
                          v-for="facilitator in facilitators"
                          :key="facilitator.id"
                          v-model:value="facilitator.id"
                        >
                          {{ facilitator.first_name }}
                          {{ facilitator.last_name }} -
                          {{ facilitator.role_id }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>


                    <a-form-item label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.trainer_id"
                        v-if="!loading"
                        placeholder="Select facilitators"
                        :render="
                          (facilitator) =>
                            `${facilitator.first_name} ${facilitator.last_name} - ${facilitator.role_id}`
                        "
                        :filterOption="
                          (inputValue, option) =>
                            filterOption(inputValue, option, facilitator)
                        "
                        @change="handleChange"
                      >
                        <a-select-option
                          v-for="trainer in facilitators"
                          :key="trainer.id"
                          :value="trainer.id"
                        >
                          {{ trainer.first_name }}
                          {{ trainer.last_name }} - {{ trainer.role_id }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item name="venue" label="venue">
                      <a-input
                        v-model:value="formState.venue"
                        placeholder="Input Venue"
                      />
                    </a-form-item>
                    <a-form-item name="county_id" label="County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-on:change="getSubCounties($event)"
                        v-model:value="formState.county_id"
                        v-if="!loading"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="county in counties"
                          :value="county.id"
                          :key="county.id"
                          :org_id="county.org_id"
                        >
                          {{ county.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <!-- <a-form-item name="sub_county_id" label="Sub County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Sub-County"
                        v-model:value="formState.sub_county_id"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="scounty in sub_counties"
                          :value="scounty.org_id"
                          :key="scounty.id"
                          >{{ scounty.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item> -->
                    <a-form-item label="Location Type">
                      <a-select
                        size="large"
                        name="name"
                        class="sDash_fullwidth-select"
                        placeholder="Select Location Type"
                        v-model:value="formState.location_type"
                      >
                        <a-select-option value="1">City</a-select-option>
                        <a-select-option value="2">County HQ</a-select-option>
                        <a-select-option value="3">Others</a-select-option>
                      </a-select>
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
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
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

    const { campaigns, facilitators, loading, counties, sub_counties } =
      reactive({
        campaigns: "",
        loading: true,
        facilitators: [],
        counties: [],
        sub_county_id: "",
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
      // console.log(this.campaigns);
      this.loading = false;
    };
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
      // console.log(data.data);
      this.loading = false;
    };
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
      // console.log(data.data);
      this.loading = false;
    };

    const getCounties = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/counties`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      const data = await response.json();
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      // console.log(this.counties);
      this.loading = false;
    };

    //get sub_counties
    const getSubCounties = async (org_id) => {
      // console.log(org_id);
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${org_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      this.sub_counties = data.message;
    };

    function handleChange(request, response, value) {
      console.log(value);
      getSubCounties(value);
    }

    function filterOption(inputValue, option, facilitator) {
      console.log(facilitator);
      console.log(option);
      if (!facilitator) return false; // Return false if facilitator is undefined or null

      const { first_name, last_name, role_id } = facilitator;
      const fullName = `${first_name} ${last_name}`.toLowerCase();
      const searchValue = inputValue.toLowerCase();

      return fullName.includes(searchValue) || role_id.includes(searchValue);
    }

    onMounted(() => {
      getCounties();
      getSubCounties();
      fetchTrainer();
      fetchFacilitators();
      fetchCampaigns();
    });

    const handleSubmit = () => {
      console.log(formState);
      const data = {
        name: formState.name,
        venue: formState.venue,
        location_id: formState.county_id,
        campaign_id: formState.campaign_id,
        facilitator: formState.facilitator_id,
        trainers: formState.trainer_id,
        location_type_id: parseInt(formState.location_type),
        event_list_id: 1,
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
          // show error message from the api response
          else {
            notification["error"]({
              message: "Error",
              description: "Something went wrong",
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
      sub_counties: [],
    });

    // console.log(formState);

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
      counties,
      sub_counties,
      getSubCounties,
      filterOption,
      handleChange,
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
