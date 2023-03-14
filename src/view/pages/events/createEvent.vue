<template>
  <sdPageHeader title="Start Event">
    <sdButton class="btn-add_new" size="default" key="1" type="sucess">
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
                    <a-form-item label="Event Name">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                      >
                        <a-select-option value="1">Stakeholder meeting</a-select-option>
                        <a-select-option default-value="2" value="2"
                          >Health Care Worker Training</a-select-option
                        >
                        <a-select-option value="3">CHV mobilization</a-select-option>
                        <a-select-option value="4">Village Elder mobilization</a-select-option>
                        <a-select-option value="5">CHV/VE Training</a-select-option>
                        <a-select-option value="5">Social mobilization</a-select-option>
                      </a-select>
                    </a-form-item>
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
                    <a-form-item name="location_id" label="Location ID">
                      <a-input-number
                        v-model:value="formState.location_id"
                        placeholder="Input Location ID"
                      />
                    </a-form-item>
                    <a-form-item name="campaign_id" label="Campaign ID">
                      <a-select
                        v-model:value="formState.campaign_id"
                        placeholder="Select a campaign"
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
                    <a-form-item name="facilitators" label="Facilitators">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.facilitators"
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
import axios from "axios";
import authHeader from "../../../services/auth-header";
// import Select from 'vue-select';

// const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  setup() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/create`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaigns_all`;

    // const [campaigns, setCampaigns] = reactive({});
    const { campaigns, setCampaigns } = reactive({
      campaigns: [],
      setCampaigns: () => {},
    });

    // axios
    //   .get(campaign_url, { headers: authHeader() })
    //   .then((response) => {
    //     const options = response.data.map((campaign) => ({
    //       label: campaign.name,
    //       value: campaign.id,
    //     }));
    //     setCampaigns(options);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    fetch(campaign_url, { headers: authHeader() })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const options = data.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
        setCampaigns(options);
      })
      .catch((error) => console.log(error));

    const handleSubmit = (values) => {
      const data = {
        name: values.name,
        user_id: 1, // replace with the logged-in user's ID
        venue: values.venue,
        location_id: 1, // replace with the actual location ID
        campaign_id: values["campaign-select"],
        facilitators: values["officers-select"],
      };
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
      "basic-select": null,
      "campaign-select": null,
      venue: "",
      "officers-select": [],
    });

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      campaigns,
    };
  },
});

export default AddNew;
</script>
<!-- <script>
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  setup() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event/create`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaigns_all`;

    const [ setCampaigns] = useState([]);

    const handleSubmit = (values) => {
      values = {
        name: values.name,
        event_code: values.event_code,
        user_id: 1,
        campaign_id: values.campaign_id,
        venue: values.venue,
        location_id: 1,
      };
      console.log(values);

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // fetch the list of campaigns
      fetch(campaign_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCampaigns(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const formState = reactive({
      name: "",
      campaign_id: 1,
      event_code: "",
      user_id: 1,
      venue: "",
      location_id: 1,
    });

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      handleSubmit,
      dateFormat,
      formState,
      join,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default AddNew;
</script> -->
