<template>
  <RecordViewWrapper>
    <sdPageHeader title="View Post Workers">
      <template #subTitle>
        <sdButton type="success" size="extra-small">
          <router-link
            :to="{
              path: `/assign-worker`,
              query: { id: post_id },
            }"
            class="btn-icon"
            type="success"
            shape="circle"
          >
            &nbsp;&nbsp; Assign Post Workers
          </router-link>
        </sdButton>
        &nbsp;&nbsp;
        <sdButton
          class="button-container"
          size="extra-small"
          type="warning"
          @click="openModal()"
        >
          Add Security
        </sdButton>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #workers="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          size="extra-small"
                          type="danger"
                          :disabled="isStarting"
                          @click="removeMatrix(record.id)"
                          v-if="!record.status"
                        >
                          <span> De-Assign Post Worker </span>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- Issue modal -->
            <a-modal
              title="Add Security"
              :visible="isModalOpen"
              @cancel="handleCancelReceive"
              width="50%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-record-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleSubmit"
                >
                  <a-form-item name="First Name" label="First Name">
                    <a-input
                      v-model:value="formState.first_name"
                      placeholder="Input First Name"
                      @blur="validate('first_name')"
                      @keypress="validate('first_name')"
                    />
                    <p
                      class="errors"
                      style="color: red"
                      v-if="!!errors.first_name"
                    >
                      {{ errors.first_name }}
                    </p>
                  </a-form-item>
                  <a-form-item name="Middle Name" label="Middle Name">
                    <a-input
                      v-model:value="formState.middle_name"
                      placeholder="Input Middle Name"
                      @blur="validate('middle_name')"
                      @keypress="validate('middle_name')"
                    />
                    <p
                      class="errors"
                      style="color: red"
                      v-if="!!errors.middle_name"
                    >
                      {{ errors.middle_name }}
                    </p>
                  </a-form-item>
                  <a-form-item name="Last Name" label="Last Name">
                    <a-input
                      v-model:value="formState.last_name"
                      placeholder="Input Last Name"
                      @blur="validate('last_name')"
                      @keypress="validate('last_name')"
                    />
                    <p
                      class="errors"
                      style="color: red"
                      v-if="!!errors.last_name"
                    >
                      {{ errors.last_name }}
                    </p>
                  </a-form-item>
                  <a-form-item name="ID No" label="ID No">
                    <a-input
                      v-model:value="formState.id_no"
                      placeholder="Input ID No"
                      type="number"
                      @blur="validate('id_no')"
                      @keypress="validate('id_no')"
                    />
                    <p class="errors" style="color: red" v-if="!!errors.id_no">
                      {{ errors.id_no }}
                    </p>
                  </a-form-item>
                  <a-form-item name="Phone No" label="Phone No">
                    <a-input
                      v-model:value="formState.phone_no"
                      placeholder="254..."
                      type="number"
                      @blur="validate('phone_no')"
                      @keypress="validate('phone_no')"
                    />
                    <p
                      class="errors"
                      style="color: red"
                      v-if="!!errors.phone_no"
                    >
                      {{ errors.phone_no }}
                    </p>
                  </a-form-item>
                  <a-form-item name="Gender" label="Gender">
                    <a-select
                      v-model:value="formState.gender"
                      v-if="!loading"
                      placeholder="Select Gender"
                      @blur="validate('gender')"
                      @keypress="validate('gender')"
                      show-search
                      option-filter-prop="label"
                    >
                      <a-select-option
                        v-for="g in gender"
                        :key="g.id"
                        :value="g.id"
                        :label="`${g.name}`"
                      >
                        {{ g.name }}
                      </a-select-option>
                    </a-select>
                    <p class="errors" style="color: red" v-if="!!errors.gender">
                      {{ errors.gender }}
                    </p>
                  </a-form-item>
                  <a-form-item name="Shift" label="Shift">
                    <a-select
                      v-model:value="formState.shift"
                      v-if="!loading"
                      placeholder="Select Shift"
                      @blur="validate('shift')"
                      @keypress="validate('shift')"
                      show-search
                      option-filter-prop="label"
                    >
                      <a-select-option
                        v-for="s in shift"
                        :key="s.id"
                        :value="s.id"
                        :label="`${s.name}`"
                      >
                        {{ s.name }}
                      </a-select-option>
                    </a-select>
                    <p class="errors" style="color: red" v-if="!!errors.shift">
                      {{ errors.shift }}
                    </p>
                  </a-form-item>
                  <a-form-item
                    name="otp"
                    label="Security OTP"
                    v-if="security_otp"
                  >
                    <a-input
                      v-model:value="formState.otp"
                      placeholder="OTP."
                      type="number"
                    />
                  </a-form-item>
                  <div class="record-form-actions text-right">
                    <!-- <sdButton
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
                            : "Verify OTP"
                        }}
                      </sdButton> -->
                    <sdButton
                      size="default"
                      htmlType="Save"
                      type="success"
                      :disabled="isSubmitting"
                      @click="handleButtonClick"
                      v-if="!security_otp"
                    >
                      {{
                        isLoading
                          ? "Loading..."
                          : isSubmitting
                            ? "Processing ..."
                            : "Verify OTP"
                      }}
                    </sdButton>
                    <sdButton
                      size="default"
                      htmlType="Save"
                      type="success"
                      :disabled="isSubmitting"
                      @click="handleButtonClick"
                      v-if="security_otp"
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
            </a-modal>
            <!-- End of Issue modal -->
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";
import * as Yup from "yup";
import store from "../../../vuex/store";

const dateFormat = "YYYY-MM-DD";
const columns = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "id",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
  // {
  //   title: "Drop off Manager",
  //   dataIndex: "drop_off_manager",
  //   key: "id",
  // },
  {
    title: "Action",
    dataIndex: "",
    key: "workers",
    slots: { customRender: "workers" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  data() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const isModalOpen = ref(false);
    const postdata = ref([]);
    const { query } = useRoute();
    const API_URL = `${process.env.VUE_APP_BASE_URL}`;
    const security_otp = ref(false);


    const { gender } = reactive({
      gender: [
        { id: "M", name: "Male" },
        { id: "F", name: "Female" },
      ],
    });
    const { shift } = reactive({
      shift: [
        { id: "D", name: "Day" },
        { id: "N", name: "Night" },
      ],
    });

    const formState = reactive({
      gender: [
        { id: "M", name: "Male" },
        { id: "F", name: "Female" },
      ],
      shift: [
        { id: "D", name: "Day" },
        { id: "N", name: "Night" },
      ],
      first_name: null,
      middle_name: null,
      last_name: null,
      id_no: null,
      phone_no: null,
      otp: null,
    });

    const post_id = query.id;

    console.log(post_id);

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/view_post_workers?post_id=${query.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data.data);
        dataSource.value = data.data;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

    const openModal = () => {
      isModalOpen.value = true;
    };

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const regex =
      /^254((1|7)(?:(?:[129456][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/;

    const ArticleSchema = Yup.object().shape({
      first_name: Yup.string().required("First Name is required"),
      middle_name: Yup.string().required("Middle Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      id_no: Yup.string().required("ID No is required"),
      phone_no: Yup.string()
        .matches(regex, "Invalid Safaricom phone number")
        .required("Phone No is required"),
      gender: Yup.string().required("Gender is required"),
      shift: Yup.string().required("Shift is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    const removeMatrix = async (id) => {
      const deassignWorkerUrl = `${process.env.VUE_APP_BASE_URL}/remove_post_workers?worker_id=${id}?distribution_post_id=${post_id}`;

      try {
        const data = {
          worker_id: id,
          distribution_post_id: post_id,
        };

        console.log(JSON.stringify(data));

        await fetch(deassignWorkerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(({ status, data }) => {
            if (status == true) {
              notification.success({
                message: "Success",
                description: data,
              });
              setTimeout(function () {
                location.reload();
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: `${status}`,
              });
            }
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    const handleSubmit = () => {
      const data = {
        first_name: formState.first_name,
        middle_name: formState.middle_name,
        last_name: formState.last_name,
        id_no: formState.id_no,
        phone_no: formState.phone_no,
        gender: formState.gender,
        shift: formState.shift,
        otp: formState.otp,
        post_id: post_id,
      };

      sessionStorage.setItem("stakeholder", JSON.stringify(data));
      store.commit("setIsSubmitting", true);
      const sendotp = {
        first_name: formState.first_name,
        last_name: formState.last_name,
        phone_no: formState.phone_no,
      };
      console.log(JSON.stringify(sendotp));

      if (!this.security_otp) {
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            fetch(`${API_URL}/security/get_otp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeader(),
              },
              body: JSON.stringify(sendotp),
            })
              .then((response) => response.json())
              .then(({ success, message }) => {
                console.log(message);
                if (success == true) {
                  notification["success"]({
                    message: "Success",
                    description: message,
                    duration: 5.5,
                  });
                  this.security_otp = true;

                  const stakeholder_data =
                    sessionStorage.getItem("stakeholder");

                  console.log(stakeholder_data);

                  store.commit("setIsSubmitting", false);
                }
                // show error message from the api response
                else {
                  notification["error"]({
                    message: "Error!",
                    description: message,
                    duration: 5.5,
                  });
                }
              })
              .catch((error) => {
                store.commit("setIsSubmitting", false);
                notification["error"]({
                  message: "Error!",
                  description: `${error}`,
                  duration: 5.5,
                });
              });
          })
          .catch((err) => {
            store.commit("setIsSubmitting", false);
            notification.error({
              message: "Could not submit!",
              description: "An error has occured. Please try again later.",
            });
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      } else {
        console.log(JSON.stringify(data));
        fetch(`${API_URL}/security/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(({ success, message }) => {
            console.log(message);
            if (success == true) {
              store.commit("setIsSubmitting", false);
              notification["success"]({
                message: "Post Security Registered Successfully",
                description: message,
                duration: 5.5,
              });
            }
            // show error message from the api response
            else {
              store.commit("setIsSubmitting", false);
              notification["error"]({
                message: "Error!",
                description: message,
                duration: 5.5,
              });
            }
          })
          .catch((error) => {
            store.commit("setIsSubmitting", false);
            notification["error"]({
              message: "Error!",
              description: `${error}`,
              duration: 5.5,
            });
          });
      }
    };

    const handleCancelReceive = () => {
      isModalOpen.value = false;
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      dateFormat,
      postdata,
      handleCancelReceive,
      openModal,
      isModalOpen,
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
      post_id,
      removeMatrix,
      validate,
      handleSubmit,
      security_otp,
      gender,
      shift,
      errors: {
        gender: null,
        name: null,
        county_id: "",
        location_type: null,
        facilitator_id: "",
        no_of_days: null,
        venue: "",
        shift: null
      },
    };
  },
});

export default DragAndDropTable;
</script>
<style>
.full-modal {
  .ant-modal {
    max-width: 50%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    /* height: calc(70vh); */
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
