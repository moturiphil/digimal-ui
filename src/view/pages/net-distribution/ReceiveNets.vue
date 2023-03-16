<template>
    <sdPageHeader title="Receive Nets">
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

                    <!-- {
   "post_id":242435,
            "number_of_nets":34,
            "date_received":"2023-03-15",
            "received_from":"KEMSA",
            "received_by": 1
} -->
                      <a-form-item name="post_id"  label="Post Name">
                        <a-input
                        type="number"
                          v-model:value="formState.post_id"
                          placeholder="Enter post name"
                        />
                      </a-form-item>
                      <a-form-item name="number_of_nets"  label="Number of Nets">
                        <a-input
                          v-model:value="formState.number_of_nets"
                          placeholder="Enter number of nets"
                        />
                      </a-form-item>
                      <a-form-item name="date_received" label="Date Received">
                            <a-date-picker
                            :style="{ width: '100%' }"
                            v-model:value="formState.date_received"
                            :format="dateFormat"
                            />
                      </a-form-item>
                      <a-form-item name="received_from"  label="Received From">
                        <a-input
                          v-model:value="formState.received_from"
                          placeholder="Enter name"
                        />
                      </a-form-item>
                    
                      <a-form-item name="received_by"  label="Received By">
                      <a-select
                        v-model:value="formState.received_by"
                        v-if="!loading"
                        placeholder="Select Received By"
                      >
                        <a-select-option
                          v-for="user in users"
                          :key="user.id"
                          v-model:value="user.id"
                        >
                          {{ user.first_name }}
                          {{ user.last_name }} - {{ user.id_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
  
                      <div class="record-form-actions text-right">
                        <sdButton size="default" htmlType="Save" type="success" >
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
  import { RecordFormWrapper } from "../style";
  import { Main, BasicFormWrapper } from "../../styled"
  import { useStore } from "vuex";
  import { reactive, ref, defineComponent, computed, onMounted } from "vue";
  // import axios from "axios";
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
      const API_URL = `${process.env.VUE_APP_BASE_URL}/net_deliveries`;
  
      const formState = reactive({
            post_id:"",
            number_of_nets:"",
            date_received:"",
            received_from:"",
            received_by: ""
      });

      const { villages,loading, isFacility,users} = reactive({
        villages: [],
        loading: true,
        isFacility:false,
        users:[]
      });

      //counties
      const getVillages = async () => {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/villages/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        console.log(data)
        this.villages = data.data;
        this.loading = false;
      };

       //users
       const getUsers = async () => {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        this.users = data.data;
      };

      onMounted(() => {
        getUsers()
        getVillages();
      });
// console.log(formState.isFacility)
      const handleSubmit = (values) => {
        values = {
            post_id:values.post_id,
            number_of_nets:values.number_of_nets,
            date_received: new Date(values.date_received).toISOString().substr(0, 10),
            received_from:values.received_from,
            received_by: values.received_by,
        };
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
  
      return {
        isLoading,
        loading,
        apiUrl,
        isFileLoading,
        isFacility,
        handleSubmit,
        dateFormat,
        formState,
        join,
        villages,
        users
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
  