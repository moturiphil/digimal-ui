<template>
    <sdPageHeader title="Create Post">
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
                      <a-form-item name="name"  label="Post Name">
                        <a-input
                          v-model:value="formState.name"
                          placeholder="Enter post name"
                        />
                      </a-form-item>
                      <a-form-item name="distribution_start_date" label="Start Date">
                            <a-date-picker
                            v-model:value="formState.distribution_start_date"
                            placeholder="mm/dd/yyyy"
                            :format="dateFormat"
                            />
                      </a-form-item>
                      <a-form-item name="distribution_end_date" label="End Date">
                            <a-date-picker
                            v-model:value="formState.distribution_end_date"
                            placeholder="mm/dd/yyyy"
                            :format="dateFormat"
                            />
                      </a-form-item>
                      <a-form-item name="post_supervisor_user_id"  label="Supervisor User Id">
                        <a-input
                          v-model:value="formState.post_supervisor_user_id"
                          placeholder="Enter post name"
                        />
                      </a-form-item>
                      <a-form-item name="villages"  label="Villages">
                        <a-select
                          mode="multiple"
                          size="large"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          v-model:value="formState.villages"
                          v-if="!loading" 
                        >
                        <a-select-option v-for="village in villages" :value="village.id" :key="village.id">{{village.name}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    <a-form-item>
                        <a-checkbox v-model:checked="formState.isFacility" name="is_facility">Is Facility?</a-checkbox>

                    </a-form-item>
                    <a-form-item name="post_code"  label="Post code">
                        <a-input
                          v-model:value="formState.post_code"
                          placeholder="Enter post code"
                        />
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
      // const API_URL = `${process.env.VUE_APP_BASE_URL}/village/create`;
  
      const formState = reactive({
        name:"",
        distribution_start_date:"",
        distribution_end_date:"",
        post_supervisor_user_id:"",
        villages:[],
        isFacility:false,
        post_code:""
      });

      const { villages,loading} = reactive({
        villages: [],
        loading: true,
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

      onMounted(() => {
        getVillages();
      });

      const handleSubmit = (values) => {
        values = {
          name:values.name,
          distribution_start_date:values.distribution_start_date,
          distribution_end_date:values.distribution_end_date,
          post_supervisor_user_id:values.post_supervisor_user_id,
          villages:values.villages,
          isFacility:values.isFacility,
          post_code:values.post_code

        };
  console.log(values);
        // fetch(API_URL, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     ...authHeader(),
        //   },
        //   body: JSON.stringify(values),
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log(data);
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
      };
  
      return {
        isLoading,
        loading,
        apiUrl,
        isFileLoading,
        handleSubmit,
        dateFormat,
        formState,
        join,
        villages
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
  