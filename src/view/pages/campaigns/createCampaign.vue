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
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item name="name" label="Campaign Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Input Campaign Name"
                        @blur="validate('name')"
                        @keypress="validate('name')"
                      />
                      <p class="errors" style="color: red" v-if="!!errors.name">
                        {{ errors.name }}
                      </p>
                    </a-form-item>

                    <a-form-item name="startDate" label="Campaign Start Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.startDate"
                        :format="dateFormat"
                        :disabledDate="disabledDate"
                        @blur="validate('startDate')"
                        @keypress="validate('startDate')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.startDate"
                      >
                        {{ errors.startDate }}
                      </p>
                    </a-form-item>

                    <a-form-item name="endDate" label="Campaign End Date">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.endDate"
                        :format="dateFormat"
                        :disabledDate="disabledDate"
                        @blur="validate('endDate')"
                        @keypress="validate('endDate')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.endDate"
                      >
                        {{ errors.endDate }}
                      </p>
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        :disabled="isSubmitting"
                      >
                        {{
                          isLoading
                            ? "Loading..."
                            : isSubmitting
                            ? "Processing ..."
                            : "Submit"
                        }}
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
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import dayjs from "dayjs";

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

    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/createCampaign`;

    const formState = reactive({
      name: "",
      startDate: "",
      endDate: "",
    });

    const ArticleSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      startDate: Yup.string().required("Start Date is required"),
      endDate: Yup.string().required("End Date is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    const handleSubmit = () => {
      this.isSubmitting = true;
      const values = {
        name: formState.name,
        start_date: dayjs(formState.startDate).format("YYYY-MM-DD"),
        end_date: dayjs(formState.endDate).format("YYYY-MM-DD"),
      };

      ArticleSchema.validate(this.formState, { abortEarly: false })
        .then(() => {
          this.errors = {};
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
                this.isSubmitting = false;
                router.push("view-campaign");
                notification["success"]({
                  message: "Campaign Created",
                  description: "Campaign Created successfully.",
                  duration: 4.5,
                });
              }
            })
            .catch((error) => {
              this.isSubmitting = false;
              console.error("Error:", error);
            });
        })
        .catch((err) => {
          this.isSubmitting = false;
          err.inner.forEach((e) => {
            this.errors[e.path] = e.message;
          });
        });
    };

    return {
      isLoading,
      isSubmitting: false,
      apiUrl,
      isFileLoading,
      handleSubmit,
      dateFormat,
      formState,
      validate,
      join,
      errors: {
        name: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    disabledDate(current) {
      if (this.formState.startDate) {
        return current && current < new Date(this.formState.startDate);
      }
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
