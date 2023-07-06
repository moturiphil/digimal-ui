<template>
  <Main>
    <sdPageHeader title="Create Activity Matrix"> </sdPageHeader>
    <sdButton class="btn-import" type="success">
      <router-link to="/list-activity/matrix">
        <span class="btn-text"> List of Matrixes </span>
      </router-link>
    </sdButton>
    <br>
    <br>
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
                    <a-form-item name="name" label="Formula Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Input Formula Name"
                      />
                    </a-form-item>
                    <a-form-item name="matrix_type_id" label="Matrix Type">
                      <a-select
                        placeholder="Select Matrix Type"
                        v-model:value="formState.matrix_type_id"
                        v-if="!loading"
                      >
                        <a-select-option
                          v-for="matrix_type in matrix_types"
                          :key="matrix_type.id"
                          v-model:value="matrix_type.id"
                        >
                          {{ matrix_type.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item label="Level">
                      <a-select
                        size="large"
                        name="name"
                        class="sDash_fullwidth-select"
                        placeholder="Select Level"
                        v-model:value="formState.level"
                      >
                        <a-select-option value="1">National</a-select-option>
                        <a-select-option value="2">County</a-select-option>
                        <a-select-option value="3">Sub-County</a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item label="Is Driver">
                      <a-select
                        size="large"
                        name="name"
                        class="sDash_fullwidth-select"
                        placeholder="Select Yes/No"
                        v-model:value="formState.is_driver"
                      >
                        <a-select-option value="1">Yes</a-select-option>
                        <a-select-option default-value="0" value="0"
                          >No</a-select-option
                        >
                      </a-select>
                    </a-form-item>

                    <a-form-item label="Location Type">
                      <a-select
                        size="large"
                        name="name"
                        class="sDash_fullwidth-select"
                        placeholder="Select Yes/No"
                        v-model:value="formState.location_type_id"
                      >
                        <a-select-option value="1">City</a-select-option>
                        <a-select-option default-value="2" value="2"
                          >County HQ</a-select-option
                        >
                        <a-select-option default-value="3" value="3"
                          >Other</a-select-option
                        >
                      </a-select>
                    </a-form-item>

                    <a-form-item name="rate" label="Rate">
                      <a-input
                        type="number"
                        v-model:value="formState.rate"
                        placeholder="Input Rate Applicable"
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
import { RecordFormWrapper } from "./Style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  setup() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/create_pay_matrix`;

    const PayMatrixType = `${process.env.VUE_APP_BASE_URL}/pay_matrix_type`;

    const matrix_types = ref([]);

    const getMatrixType = async () => {
      const response = await fetch(PayMatrixType, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      matrix_types.value = data.data;
      console.log(matrix_types.value);
    };

    onMounted(() => {
      getMatrixType();
    });

    const handleSubmit = () => {
      const data = {
        formula_name: formState.name,
        level_id: formState.level,
        is_driver: formState.is_driver,
        matrix_type_id: formState.matrix_type_id,
        rate: formState.rate,
        location_type: formState.location_type_id,
      };

      console.log("------------------------------------");
      console.log(data);

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
          console.log(success);
          router.push({ name: "activity-payroll-matrix" });
          notification["success"]({
            message: "Payroll Matrix Created",
            description: "Payroll Matrix Created successfully.",
            duration: 5.5,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const formState = reactive({
      name: "",
      level: "",
      is_driver: "",
      matrix_type_id: "",
      rate: "",
    });

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      handleSubmit,
      dateFormat,
      formState,
      join,
      matrix_types,
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
