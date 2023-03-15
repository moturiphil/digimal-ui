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
              <a-col :xl="10" :md="16" :xs="24" order="flex" >
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
                        :style="{ width: '100'}"
                        v-model:value="formState.name"
                        placeholder="Input Activity Name"
                      />
                    </a-form-item>
                    <a-form-item name="activityCode" label="Activity Code">
                      <a-input
                        v-model:value="formState.activityCode"
                        placeholder="Input Activity Code"
                      />
                    </a-form-item>

                    <a-form-item name="countyId" label="County">
                      <a-select
                        mode="single"
                        v-modlel:value="formState.countyId"
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

                    <a-form-item name="campaignId" label="Campaign">
                      <a-input
                        v-model:value="formState.campaignId"
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
                      name="payableTravelDays"
                      label="Payable Travel Days"
                    >
                      <a-input
                        v-model:value="formState.payableTravelDays"
                        placeholder="Payable Travel Days"
                        type="number"
                        default-value="1"
                      />
                    </a-form-item>
                    <!-- no of officers as number -->
                    <a-form-item name="numberOfOfficers" label="No of Officers">
                      <a-input
                        v-model:value="formState.numberOfOfficers"
                        placeholder="No of Officers"
                        type="number"
                        min="0"
                      />
                    </a-form-item>
                        
                    <a-form-item name="activityFacilitators" label="Officers">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.activityFacilitators"
                        placeholder="Please select"         
                        :options="(() => {
                          return users.map(({first_name, last_name, id}) => ({label: `${first_name} ${last_name}`, value: id}))
                        })()"
                      >
                        <!-- <a-select-option v-for="user in users" :key="user" :value="[`${user.id}`]"
                        :label="`${user.first_name}-${user.id}`"
                        >
                           {` ${user.first_name} `}
                          </a-select-option> -->
                 
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
import { reactive, ref, defineComponent, computed, toRaw, onMounted } from "vue";
import { notification } from 'ant-design-vue';

import axios from "axios";
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
    const users = ref([])

    // let county_id;

    const API_URL = `${process.env.VUE_APP_BASE_URL}/createActivity`;

    // const handleSelect = (values)
    const handleSubmit = (values) => {
  
      values = {
        name: values.name,
        county_id: values.countyId,
        campaign_id: values.campaignId,
        start_date: new Date(values.startDate.$d).toISOString().substr(0, 10),
        end_date: new Date(values.endDate.$d).toISOString().substr(0, 10),
        payable_travel_days: values.payableTravelDays,
        number_of_officers: values.numberOfOfficers,
        activity_facilitator: toRaw(values.activityFacilitators)
      };
      console.log({values})
   

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(({success, data}) => {
          if(success){
            notification['success']({
                message: 'Activity Created',
                description: `Activity Created successfully. Your activity code is ${data.activity_code}`,
                duration: null
          });
          }
          })
        .catch((error) => {
          console.error("Error:", error);
        });

        
    };

    
    //pick the user_id in the sessionstorage and add it into formstate
    // const user_id = computed(() => state.auth);

    // console.log(state.auth.user.id);
    onMounted(() => {
        axios
        .get(`${process.env.VUE_APP_BASE_URL}/users`, { headers: authHeader() })
        .then(function ({data}) {
          console.log({data: data.data});
          users.value = data.data
        })
        .catch(function (error) {
          console.log(error);
        });
    
    })

    console.log({p_users: users})

    const formState = reactive({
      name: "",
      countyId: "0",
      campaignId: 1,
      startDate: "",
      endDate: "",
      payableTravelDays: 0,
      numberOfOfficers: 0,
      activityFacilitators: [],
      activityCode: ""
    });

    return {
      isLoading,
      apiUrl,
      users,
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
