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
                    <a-form-item name="name" label="Event Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Input Event Name"
                      />
                    </a-form-item>
                    <a-form-item name="event_code" label="Event Code">
                      <a-input
                        v-model:value="formState.event_code"
                        placeholder="Input Event Code"
                      />
                    </a-form-item>

                    <a-form-item name="startDate" label="Event Start Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.startDate"
                        :format="dateFormat"
                      />
                    </a-form-item>

                    <a-form-item name="endDate" label="Event End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.endDate"
                        :format="dateFormat"
                      />
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
});

export default AddNew;
</script>
