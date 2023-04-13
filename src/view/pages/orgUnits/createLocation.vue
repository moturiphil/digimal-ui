<template>
  <sdPageHeader title="Create Location">
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
                    <a-form-item name="county" label="County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select County"
                        v-on:change="getSubCounties($event)"
                        v-if="!loading"
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
                    </a-form-item>
                    <a-form-item name="sub_county" label="Sub County">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Sub-County"
                        v-on:change="getWards($event)"
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
                    </a-form-item>

                    <a-form-item name="ward_id" label="Ward">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Ward"
                        v-model:value="formState.ward_id"
                      >
                        <a-select-option value=""
                          >Select an option</a-select-option
                        >
                        <a-select-option
                          v-for="ward in wards"
                          :value="ward.org_id"
                          :key="ward.id"
                          >{{ ward.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>

                    <a-form-item name="name" label="Location Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Enter Location name"
                      />
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
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/ouCreation?unit=location`;

    const formState = reactive({
      name: "",
      ward_id: "",
    });

    const { counties, loading, sub_counties, wards } = reactive({
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
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      console.log(this.counties);
      this.loading = false;
    };

    onMounted(() => {
      getCounties();
      getSubCounties();
    });

    // sub_county

    const getSubCounties = async (org_id) => {
      console.log(org_id);
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
      console.log(data);
      this.sub_counties = data.message;
    };

    //wards

    const getWards = async (org_id) => {
      console.log(org_id);  
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
      console.log(data);
      this.wards = data.message;
    };

    const handleSubmit = (values) => {

      console.log(values.ward_id);
      console.log(values.name);

      const data = {
        parent_id: values.ward_id,
        data: [
          {
            name: values.name,
          },
        ],
      };
      console.log(API_URL);

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(({ success }) => {
          if (success) {
            // router.push("activity-view");
            notification["success"]({
              message: "Location Created",
              description: `Location Created successfully`, //${data.activity_code}
              duration: 5.5,
            });
          }
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
      counties,
      sub_counties,
      wards,
      getSubCounties,
      getWards,
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
