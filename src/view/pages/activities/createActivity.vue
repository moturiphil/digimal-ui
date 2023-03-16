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
                    <a-form-item name="county_id"  label="County">
                        <a-select
                          size="large"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          placeholder="Select County"
                          v-model:value="formState.county_id"
                        >
                        <a-select-option value="">Select an option</a-select-option>
                        <a-select-option v-for="county in counties" :value="county.id" :key="county.id">{{county.name}}</a-select-option>
                        </a-select>
                      </a-form-item>

                    <a-form-item name="campaign_id" label="Campaign">
                      <a-input
                        v-model:value="formState.campaign_id"
                        placeholder="Input Activity County"
                      />
                    </a-form-item>

                    <a-form-item name="start_date" label="Activity Start Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.start_date"
                        :format="dateFormat"
                      />
                    </a-form-item>

                    <a-form-item name="end_date" label="Activity End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.end_date"
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
                        default-value="1"
                      />
                    </a-form-item>
                    <!-- no of officers as number -->
                    <a-form-item name="number_of_officers" label="No of Officers">
                      <a-input
                        v-model:value="formState.number_of_officers"
                        placeholder="No of Officers"
                        type="number"
                        min="0"
                      />
                    </a-form-item>
                        
                    <a-form-item name="activity_facilitator" label="Officers">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.activity_facilitator"
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
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from 'ant-design-vue';

import axios from "axios";
import authHeader from "../../../services/auth-header";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const users = ref([])

    const { counties,} = reactive({
        counties: []
      });

    const API_URL = `${process.env.VUE_APP_BASE_URL}/createActivity`;
    const formState = reactive({
      name: "",
      county_id: "",
      campaign_id: "",
      start_date: "",
      end_date: "",
      payable_travel_days: "",
      number_of_officers: "",
      activity_facilitator: [],
    });

    //counties
    const getCounties = async () => {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/counties`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        this.counties = data.data;
      };

    // const handleSelect = (values)
    const handleSubmit = (values) => {
  
      values = {
        name: values.name,
        county_id: values.county_id,
        campaign_id: values.campaign_id,
        start_date: new Date(values.start_date.$d).toISOString().substr(0, 10),
        end_date: new Date(values.end_date.$d).toISOString().substr(0, 10),
        payable_travel_days: values.payable_travel_days,
        number_of_officers: values.number_of_officers,
        activity_facilitator: values.activity_facilitator,
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

        getCounties();
    
    })

    console.log({p_users: users})



    return {
      isLoading,
      apiUrl,
      users,
      isFileLoading,
      counties,
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
