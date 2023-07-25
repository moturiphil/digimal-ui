<template>
  <Main>
    <sdPageHeader title="Create Dropoff Point">
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
                    <a-form-item name="campaign_id" label="Select Campaign">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        v-model:value="formState.campaign_id"
                        v-if="!loading"
                        placeholder="Select Campaign"
                        @blur="validate('campaign_id')"
                        @keypress="validate('campaign_id')"
                      >
                        <a-select-option value="" disabled
                          >Select a campaign</a-select-option
                        >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :value="campaign.id"
                          :key="campaign.id"
                          >{{ campaign.name }}</a-select-option
                        >
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.campaign_id"
                      >
                        {{ errors.campaign_id }}
                      </p>
                    </a-form-item>
                    <a-form-item name="name" label="Distribution Point Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Enter name of the distribution point"
                        @blur="validate('name')"
                        @keypress="validate('name')"
                      />
                      <p class="errors" style="color: red" v-if="!!errors.name">
                        {{ errors.name }}
                      </p>
                    </a-form-item>
                    <a-form-item name="county_id" label="County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-on:change="getSubCounties($event)"
                        v-model:value="formState.county_id"
                        v-if="!loading"
                        @blur="validate('county_id')"
                        @keypress="validate('county_id')"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="county in counties"
                          :value="county.org_id"
                          :key="county.id"
                          :org_id="county.org_id"
                        >
                          {{ county.name }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.county_id"
                      >
                        {{ errors.county_id }}
                      </p>
                    </a-form-item>
                    <a-form-item name="sub_county_id" label="Sub County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Sub-County"
                        v-model:value="formState.sub_county"
                        @blur="validate('sub_county')"
                        @keypress="validate('sub_county')"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="scounty in sub_counties"
                          :value="scounty.org_id"
                          :key="scounty.id"
                          >{{ scounty.name }}</a-select-option
                        >
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.sub_county"
                      >
                        {{ errors.sub_county }}
                      </p>
                    </a-form-item>

                    <div class="record-form-actions text-right">
                      <sdButton
                        size="small"
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
import { RecordFormWrapper } from "../style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import store from "../../../vuex/store";

const dateFormat = "YYYY-MM-DD";

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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/new_drop_off_points`;
    const router = useRouter();
    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const { loading, campaigns, sub_counties, counties } = reactive({
      campaigns: [],
      counties: [],
      sub_counties: [],
      loading: true,
    });

    const formState = reactive({
      name: "",
      campaign_id: "",
      county_id: "",
      sub_county: "",
    });

    const ArticleSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      campaign_id: Yup.string().required("Campaign name is required"),
      county_id: Yup.string().required("County is required"),
      sub_county: Yup.string().required("Sub County is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    //campaigns
    const getCampaigns = async () => {
      const response = await fetch(campaign_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.campaigns = data.data;
      this.loading = false;
    };

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
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      this.loading = false;
    };

    //get sub_counties
    const getSubCounties = async (org_id) => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${org_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      //   console.log(data.message);
      this.sub_counties = data.message;
    };

    onMounted(() => {
      getCounties();
      getCampaigns();
      getSubCounties();
    });

    const handleSubmit = (values) => {
      store.commit("setIsSubmitting", true);
      values = {
        name: formState.name,
        campaign_id: formState.campaign_id,
        ou_sub_county: formState.sub_county,
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
            .then((data) => {
              if (data.status == true) {
                router.push("/nets/distribution-points");
                notification["success"]({
                  message: "Distribution Point Created",
                  description: `Distribution Point Created successfully.`,
                  duration: 5.5,
                });
              } else {
                notification["error"]({
                  message: "Distribution Point Creation Failed",
                  description: `Distribution Point Creation failed.`,
                  duration: 5.5,
                });
              }
              store.commit("setIsSubmitting", false);
            })
            .catch((error) => {
              store.commit("setIsSubmitting", false);
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

    return {
      isLoading,
      isSubmitting,
      loading,
      apiUrl,
      isFileLoading,
      handleSubmit,
      dateFormat,
      formState,
      join,
      getSubCounties,
      sub_counties,
      campaigns,
      counties,
      validate,
      errors: {
        name: "",
        campaign_id: "",
        county_id: "",
        sub_county: "",
      },
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
