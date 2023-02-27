<template>
  <sdPageHeader title="Create an Activity">
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
                    <a-form-item name="name" label="Activity Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Input Activity Name"
                      />
                    </a-form-item>
                    <a-form-item name="activity_code" label="Activity Code">
                      <a-input
                        v-model:value="formState.activity_code"
                        placeholder="Input Activity Code"
                      />
                    </a-form-item>

                    <a-form-item label="County">
                      <a-select
                        mode="multiple"
                        :default-value="['1']"
                        placeholder="Please select"
                      >
                        <a-select-option value="1"
                          >Bungoma</a-select-option
                        >
                        <a-select-option value="2"
                          >Busia</a-select-option
                        >
                        <a-select-option value="3"
                          >Elgeyo Marakwet</a-select-option
                        >
                        <a-select-option value="4"
                          >Kericho</a-select-option
                        >
                      </a-select>
                    </a-form-item>

                    <a-form-item name="campaign_id" label="Campaign">
                      <a-input
                        v-model:value="formState.campaign_id"
                        placeholder="Input Activity County"
                      />
                    </a-form-item>

                    <a-form-item name="startDate" label="Activity Start Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.startDate"
                        :format="dateFormat"
                      />
                    </a-form-item>

                    <a-form-item name="endDate" label="Activity End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.endDate"
                        :format="dateFormat"
                      />
                    </a-form-item>
                    <a-form-item
                      name="payable_travel_days"
                      label="Payable Travel Days"
                    >
                      <a-input
                        v-model:value="formState.payable_travel_days"
                        placeholder="Payable Travel Days"
                        type="number"
                      />
                    </a-form-item>
                    <!-- no of officers as number -->
                    <a-form-item name="no_of_officers" label="No of Officers">
                      <a-input
                        v-model:value="formState.no_of_officers"
                        placeholder="No of Officers"
                        type="number"
                      />
                    </a-form-item>
                    <a-form-item label="Officers">
                      <a-select
                        mode="multiple"
                        :default-value="['1']"
                        placeholder="Please select"
                      >
                        <a-select-option value="1"
                          >Admin Test 1</a-select-option
                        >
                        <a-select-option value="2"
                          >Admin Test 2</a-select-option
                        >
                        <a-select-option value="3"
                          >Admin Test 3</a-select-option
                        >
                        <a-select-option value="4"
                          >Admin Test 4</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <!-- <a-form-item name="created_by" label="Created By">
                      <a-input
                        v-model:value="formState.campaign_id"
                        placeholder="Input Activity County"
                        disabled
                      />
                    </a-form-item> -->
                    <!-- <a-form-item label="Multiple Select">
                      <a-select
                        mode="multiple"
                        :default-value="['1', '2']"
                        placeholder="Please select"
                      >
                        <a-select-option value="1"
                          >Admin User 1</a-select-option
                        >
                        <a-select-option value="2"
                          >Admin User 2</a-select-option
                        >
                        <a-select-option value="3"
                          >Admin User 3</a-select-option
                        >
                        <a-select-option value="4"
                          >Admin User 4</a-select-option
                        >
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

    const API_URL = "http://localhost:8000/api/event/create";

    const handleSubmit = (values) => {
      values = {
        name: values.name,
        start_date: new Date(values.startDate.$d).toISOString().substr(0, 10),
        end_date: new Date(values.endDate.$d).toISOString().substr(0, 10),
        event_code: values.event_code,
        user_id: 1,
        campaign_id: 1,
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
    };

    //   axios
    //     .post(API_URL, values, { headers: authHeader() })
    //     .then(function (response) {
    //       console.log(response);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // };
    //pick the user_id in the localstorage and add it into formstate
    // const user_id = computed(() => state.auth);

    // console.log(state.auth.user.id);

    const formState = reactive({
      name: "",
      event_code: "",
      startDate: "",
      endDate: "",
      user_id: 1,
      campaign_id: 1,
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
</script>
