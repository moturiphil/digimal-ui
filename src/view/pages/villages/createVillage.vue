<template>
    <sdPageHeader title="Village">
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
                      <a-form-item name="name"  label="Village Name">
                        <a-input
                          v-model:value="formState.name"
                          placeholder="Enter village name"
                        />
                      </a-form-item>
                      <a-form-item name="county"  label="County">
                        <a-select
                          size="large"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          v-on:change="getSubCounties($event)"
                          v-if="!loading" 
                        >
                        <a-select-option value="">Select an option</a-select-option>
                        <a-select-option v-for="county in counties" :value="county.id" :key="county.id">{{county.name}}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item name="sub_county"  label="Sub County">
                        <a-select
                          size="large"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          v-on:change="getWards($event)"
                        >
                        <a-select-option value="">Select an option</a-select-option>
                        <a-select-option v-for="scounty in sub_counties" :value="scounty.id" :key="scounty.id">{{scounty.name}}</a-select-option>
                        </a-select>
                      </a-form-item>

                      <a-form-item name="ward_id"  label="Ward">
                        <a-select
                          size="large"
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          v-model:value="formState.ward_id"
                        >
                        <a-select-option value="">Select an option</a-select-option>
                        <a-select-option v-for="ward in wards" :value="ward.id" :key="ward.id">{{ward.name}}</a-select-option>
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
  import { RecordFormWrapper } from "./style";
  import { Main, BasicFormWrapper } from "../../styled";
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
      const API_URL = `${process.env.VUE_APP_BASE_URL}/village/create`;
  
      const formState = reactive({
        name: "",
        ward_id: "",
      });

      const { counties,loading,sub_counties,wards} = reactive({
        counties: [],
        loading: true,
        sub_counties: [],
        wards: [],
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
        this.loading = false;
      };

      onMounted(() => {
        getCounties();
      });

      //sub-counties
      const getSubCounties = async (county_id) => { //7
        console.log(county_id);
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/getcounty/${county_id}/subcounties`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        this.sub_counties=data.county.sub_counties;
      };

      //wards
      const getWards = async (subcounty_id) => { //13
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/getsubcounty/${subcounty_id}/ward`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        this.wards=data.data.ward;
      };

      const handleSubmit = (values) => {
        values = {
          name: values.name,
          ward_id: values.ward_id,
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
        handleSubmit,
        dateFormat,
        formState,
        join,
        counties,sub_counties,wards,getSubCounties,getWards
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
  