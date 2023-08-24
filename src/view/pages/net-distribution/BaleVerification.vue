<template>
    <Main>
      <sdPageHeader :title="`Bale Verification at ${post_name}`">
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
                      <a-form-item name="bale_batch_no" label="Bale Batch No.">
                        <a-input
                          v-model:value="formState.bale_batch_no"
                          placeholder="Enter bale size"
                          type="text"
                          @blur="validate('bale_batch_no')"
                          @keypress="validate('bale_batch_no')"
                        >
                        </a-input>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.bale_batch_no"
                        >
                          {{ errors.bale_batch_no }}
                        </p>
                      </a-form-item>
                      <a-form-item name="counted_no_of_nets" label="Counted Number of Nets">
                        <a-input
                          v-model:value="formState.counted_no_of_nets"
                          placeholder="Enter number of bales"
                          type="number"
                          @blur="validate('counted_no_of_nets')"
                          @keypress="validate('counted_no_of_nets')"
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.counted_no_of_nets"
                        >
                          {{ errors.counted_no_of_nets }}
                        </p>
                      </a-form-item>
                      <a-form-item name="date_received" label="Date Received">
                        <a-date-picker
                          :style="{ width: '100%' }"
                          v-model:value="formState.date_received"
                          :format="dateFormat"
                          @blur="validate('date_received')"
                          @keypress="validate('date_received')"
                          disabled
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.date_received"
                        >
                          {{ errors.date_received }}
                        </p>
                      </a-form-item>
                      <a-form-item name="received_from" label="Received From">
                        <a-select
                          name="basic-select"
                          class="sDash_fullwidth-select"
                          v-model:value="formState.received_from"
                          placeholder="Select Received By"
                          @blur="validate('received_from')"
                          @keypress="validate('received_from')"
                          disabled
                        >
                          <a-select-option value="KEMSA">KEMSA</a-select-option>
                          <a-select-option value="MEDS">MEDS</a-select-option>
                        </a-select>
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.received_from"
                        >
                          {{ errors.received_from }}
                        </p>
                      </a-form-item>
                      <a-form-item name="delivery_note_number" label="Delivery Note No.">
                        <a-input
                          v-model:value="formState.delivery_note_number"
                          placeholder="Delivery Note No."
                          @blur="validate('delivery_note_number')"
                          @keypress="validate('delivery_note_number')"
                          disabled
                        />
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.delivery_note_number"
                        >
                          {{ errors.delivery_note_number }}
                        </p>
                      </a-form-item>
  
                      <a-form-item name="received_by" label="Received By">
                        <a-select
                          v-model:value="formState.received_by"
                          v-if="!loading"
                          placeholder="Select Received By"
                          @blur="validate('received_by')"
                          @keypress="validate('received_by')"
                          disabled
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
                        <p
                          class="errors"
                          style="color: red"
                          v-if="!!errors.received_by"
                        >
                          {{ errors.received_by }}
                        </p>
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
  import { RecordFormWrapper } from "../style";
  import { Main, BasicFormWrapper } from "../../styled";
  import { useStore } from "vuex";
  import { reactive, ref, defineComponent, computed, onMounted } from "vue";
  // import axios from "axios";
  import { notification } from "ant-design-vue";
  import authHeader from "../../../services/auth-header";
  import { useRouter } from "vue-router";
  import * as Yup from "yup";
  import dayjs from "dayjs";
  import { useRoute } from "vue-router";
  
  
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
      const API_URL = `${process.env.VUE_APP_BASE_URL}/bale_verification`;
      const router = useRouter();
  
      const { query } = useRoute();
      const post_id = Number(query.id);
      const post_name = query.name;
      const d_no = query.delivery_no;
      const date_received = dayjs(query.date_received, dateFormat);
      const received_from = query.received_from;
      const received_by = query.received_by;
      console.log(date_received)
  
      const formState = reactive({
        post_id: post_id,
        bale_batch_no: "",
        counted_no_of_nets:"",
        date_received: date_received,
        received_from: received_from,
        delivery_note_number: d_no,
        received_by: received_by,
      });
  
      const {  loading, isFacility, users } = reactive({
        loading: true,
        isFacility: false,
        users: [],
      });
  
      const ArticleSchema = Yup.object().shape({
        bale_batch_no: Yup.string().required("Bale size is required"),
        counted_no_of_nets: Yup.number().required("Bale size is required"),
        date_received: Yup.string().required("Date received is required"),
        received_from: Yup.string().required("Received from is required"),
        delivery_note_number: Yup.string().required("Delivery no is required"),
        received_by: Yup.string().required("Received by is required"),
      });
  
      const validate = (field) => {
        ArticleSchema.validateAt(field, formState)
          .then(() => (this.errors[field] = ""))
          .catch((err) => {
            this.errors[err.path] = err.message;
          });
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
        this.loading = false;
      };
  
      onMounted(() => {
        getUsers();
      });
      // console.log(formState.isFacility)
      const handleSubmit = () => {
        const values = {
          post_id: post_id,
          bale_batch_no: formState.bale_batch_no,
          counted_no_of_nets: formState.counted_no_of_nets,
          date_received: formState.date_received,
          received_from: formState.received_from,
          delivery_note_number: formState.delivery_note_number,
          received_by:  formState.received_by,
        };
        console.log(JSON.stringify(values));
        try {
          
          ArticleSchema.validate(this.formState, { abortEarly: false })
            .then(async() => {
              this.error = {};
    
              await fetch(API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
                body: JSON.stringify(values),
              })
                .then((response) => response.json())
                .then(({ success }) => {
                  if (success) {
                    notification["success"]({
                      message: "Nets Verified",
                      description: "Nets have been successfully verified",
                      duration: 5.5,
                    });
                    router.push("/nets/nets-delivered");
                  }else{
                    notification["error"]({
                      message: "Error",
                      description: "Error verifying nets",
                      duration: 5.5,
                    });
                  }

                })
                .catch((error) => {
                  console.error("Error:", error);
                  notification.error({
                    message: "Error",
                    description: error.message,
                    duration: 5.5,
                  });
                });
            })
            .catch((err) => {
              err.inner.forEach((e) => {
                this.errors[e.path] = e.message;
              });
            });
        } catch (error) {
          notification["error"]({
            message: "Error",
            description: error.message,
            duration: 5.5,
          });
        }
  
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
        validate,
        errors: {
          bale_batch_no: "",
          counted_no_of_nets:"",
          date_received: "",
          received_from: "",
          delivery_note_number: "",
          received_by: "",
        },
        users,
        post_name,
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
  