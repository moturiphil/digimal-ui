<template>
  <Main>
    <sdPageHeader
      :title="`Assign Activity Payroll - ${act_name}`"
    ></sdPageHeader>
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
                    <a-form-item label="Assign Matrix">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.matrix"
                        v-if="!loading"
                        placeholder="Select Matrix to Assign"
                      >
                        <a-select-option
                          v-for="matrix in matrix"
                          :key="matrix.id"
                          v-model:value="matrix.id"
                        >
                          {{ matrix.formula_name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <!-- <a-form-item name="venue" label="Event Venue">
                      <a-input
                        v-model:value="formState.venue"
                        placeholder="Input Event Venue"
                      />
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
import { RecordFormWrapper } from "../events/style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

// testing app

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    // const router = useRouter();

    const { params, query } = useRoute();

    console.log({ query, params });

    const activity_name = query.name;

    const activity_id = parseInt(query.id);

    const act_id = activity_id;

    const act_name = activity_name;

    console.log({ activity_name });

    console.log(act_id);

    // console.log({ query.name, query.id });

    const API_URL = `${process.env.VUE_APP_BASE_URL}/pay_roll_matrix_assign_to_activity`;

    const campaign_url = `${process.env.VUE_APP_BASE_URL}/campaign_all`;

    const pay_matrix_url = `${process.env.VUE_APP_BASE_URL}/list_pay_matrix`;

    const trainer_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const { matrix, loading } = reactive({
      loading: true,
      matrix: [],
    });

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

    const fetchMatrix = async () => {
      const response = await fetch(pay_matrix_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.matrix = data.data;
      console.log(data.data);
      this.loading = false;
    };
    fetchMatrix();

    const fetchTrainer = async () => {
      const response = await fetch(trainer_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.facilitators = data.data;
      // console.log(data.data);
      this.loading = false;
    };
    fetchTrainer();

    const handleSubmit = () => {
      const data = {
        activity_list_id: act_id,
        pay_matrix: formState.matrix,
      };

      console.log(data);

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: data,
      })
        .then((response) => response.json())
        .then(({ response }) => {
          console.log(response);
          notification["success"]({
            message: "Activity Matrix Assigned successfully",
            description: `Matrix Assigned successfully. You can now view the matrix`,
            duration: 5.5,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          if (error) {
            notification["error"]({
              message: "Error",
              description: "Something went wrong",
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const formState = reactive({
      matrix: [],
    });

    // console.log(formState);

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      matrix,
      loading,
      act_name,
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
