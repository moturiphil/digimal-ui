<template>
  <sdPageHeader title="Assign Campaign Users">
    <sdButton class="btn-add_new" size="default" key="1" type="success">
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
                    <a-form-item name="campaign_id" label="Campaign Name">
                      <a-select
                        v-model:value="formState.campaign_id"
                        v-if="!loading"
                        placeholder="Select Campaign Name"
                        @blur="validate('campaign_id')"
                        @keypress="validate('campaign_id')"
                      >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :key="campaign.id"
                          :value="campaign.id"
                        >
                          {{ campaign.name }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.campaign_id"
                      >
                        {{ errors.campaign_id }}
                      </p>
                    </a-form-item>

                    <a-form-item label="CHPs">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.chv_id"
                        v-if="!loading"
                        placeholder="Select CHPs"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('chv_id')"
                        @keypress="validate('chv_id')"
                      >
                        <a-select-option
                          v-for="chv in chvs"
                          :key="chv.id"
                          :value="chv.id"
                          :label="`${chv.first_name} ${chv.last_name} - ${chv.phone_no}`"
                        >
                          {{ chv.first_name }} {{ chv.last_name }} -
                          {{ chv.phone_no }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.chv_id"
                      >
                        {{ errors.chv_id }}
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
import * as Yup from "yup";
import store from "../../../vuex/store";
// import { useRouter } from "vue-router";

// testing app

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    // const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/users_doing_hh_reg`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    // const facilitator_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const chv_url = `${process.env.VUE_APP_BASE_URL}/get_user_given_the_role?role=chv`;

    const { campaigns, chvs, loading } = reactive({
      campaigns: "",
      loading: true,
      chvs: [],
    });
    const formState = reactive({
      campaign_id: null,
      user_id: [],
    });

    const ArticleSchema = Yup.object().shape({
      campaign_id: Yup.string().required("Campaign name is required"),
      chv_id: Yup.array()
        .min(1, "At least 1 CHP is required")
        .required("At least 1 CHP is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    const fetchCampaigns = async () => {
      const response = await fetch(campaign_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.campaigns = data.data;
      // console.log(this.campaigns);
      this.loading = false;
    };
    fetchCampaigns();

    const fetchCHV = async () => {
      const response = await fetch(chv_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();

      const transformedData = data.data.map((chv) => ({
        ...chv,
        label: `${chv.first_name} ${chv.last_name} - ${chv.phone_no}`,
      }));

      this.chvs = transformedData;
      this.loading = false;
    };
    fetchCHV();

    const handleSubmit = () => {
      store.commit("setIsSubmitting", true);
      const data = {
        campaign_id: formState.campaign_id,
        user_ids: formState.chv_id,
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
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then(({ success, message, occupied_users }) => {
              if (success) {
                // router.push("event-view");
                console.log(success, message, occupied_users);
                store.commit("setIsSubmitting", false);
                if (occupied_users == null) {
                  notification["success"]({
                    message: message,
                    description: "Users successfully assigned to a campaign",
                    duration: 10.5,
                  });
                }
                // output notification for each user
                else if (occupied_users.length > 0) {
                  for (var i = 0; i < occupied_users.length; i++) {
                    notification["error"]({
                      message: message,
                      description: `User ${occupied_users[i].user} already assigned to a campaign`,
                      duration: 10.5,
                    });
                  }
                }
              }
            })
            .catch((error) => {
              store.commit("setIsSubmitting", false);
              notification.error({
                message: "Could not submit!",
                description: "An error has occured. Please try again later.",
              });
              console.error("Error:", error);
            });
        })
        .catch((err) => {
          store.commit("setIsSubmitting", false);
          err.inner.forEach((e) => {
            this.errors[e.path] = e.message;
          });
        });
    };

    // console.log(formState);

    return {
      isLoading,
      isSubmitting,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      campaigns,
      validate,
      errors: {
        campaign_id: "",
        user_id: "",
      },
      chvs,
      loading,
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
