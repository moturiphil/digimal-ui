<template>
  <Main>
    <sdPageHeader title="Start Campaign">
      <sdButton class="btn-add_new" size="default" key="1" type="sucess">
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
                  <Form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @submit="handleSubmit"
                  >

                      <a-form-item name="name" label="Campaign Name">
                        <Field name="name" class="ant-input" v-model:value="formState.name" type="text" placeholder="Input Campaign Name"  :rules="validate" />
                        <ErrorMessage name="name" style="color: red;" />
                      </a-form-item>

                    <a-form-item name="startDate" label="Campaign Start Date">
                        <Field name="startDate" class="ant-input" v-model:value="formState.startDate" type="date" :min="minDate" :format="dateFormat" :rules="validate" />
                        <ErrorMessage name="startDate" style="color: red;" />
                    </a-form-item>

                    <a-form-item name="endDate" label="Campaign End Date">
                      <Field name="endDate" class="ant-input" v-model:value="formState.endDate" type="date" :format="dateFormat" :min="minDate" :rules="validate" />
                      <ErrorMessage name="endDate" style="color: red;"/>
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </Form>
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
import {  Field, Form, ErrorMessage } from 'vee-validate';
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const dateFormat = "YYYY-MM-DD";
const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper, Field, Form, ErrorMessage },
  setup() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/createCampaign`;

    const handleSubmit = (values) => {
      values = {
        name: values.name,
        start_date: values.startDate,
        end_date: values.endDate
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
        .then(({ success }) => {
          // console.log(data);
          if (success) {
            router.push("view-campaign");
            notification["success"]({
              message: "Campaign Created",
              description: "Campaign Created successfully.",
              duration: 4.5,
            });
          }
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

    const formState = reactive({
      name: "",
      startDate: "",
      endDate: "",
    });

    const validate =(value)=> {
      if (!value) {
        return 'This field is required';
      }
      return true;
    };

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      handleSubmit,
      validate,
      dateFormat,
      minDate: dayjs().format("YYYY-MM-DD"),
      formState,
      join,
    };
  },
  methods: {
    disabledDate(current) {
      return current && current < Date.now();
    },
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
