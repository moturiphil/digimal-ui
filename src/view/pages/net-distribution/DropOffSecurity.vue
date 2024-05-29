<template>
  <RecordViewWrapper>
    <sdPageHeader ghost :title="`${post_name} - Securities`" />

    <Main>
      &nbsp;&nbsp;
      <sdButton
        class="button-container"
        size="extra-small"
        type="warning"
        @click="openSecurityModal()"
      >
        Add Security
      </sdButton>
      <br />
      <br />
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
                  :scroll="{ x: 50 }"
                  :expand-column-width="100"
                >
                  <template #workers="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          size="extra-small"
                          type="danger"
                          :disabled="isStarting"
                          @click="removeMatrix(record.id)"
                        >
                          <span> De-Assign Post Worker </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="extra-small"
                          type="success"
                          :disabled="isStarting"
                          @click="openShiftModal(record.id)"
                          v-if="record.role_id == 'Security Guard - Post'"
                        >
                          <span> Edit Shift </span>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- Drop off security Modal -->
            <a-modal
              title="Assign Security"
              :visible="isSecurityModalOpen"
              @cancel="handleCancelSecurity"
              width="50%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-transfer-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleAssignSecurity"
                >
                  <a-form-item
                    name="drop_off_manager"
                    label="Assign Drop Off Security"
                  >
                    <a-select
                      placeholder="Assign Drop Off Security"
                      v-model:value="formState.drop_off_manager"
                      v-if="!loading"
                      show-search
                      option-filter-prop="label"
                    >
                      <a-select-option
                        v-for="worker in users"
                        :key="worker.id"
                        v-model:value="worker.id"
                        :label="`${worker.first_name} ${worker.last_name} -${worker.role_id} `"
                      >
                        {{ worker.first_name }}
                        {{ worker.last_name }} - {{ worker.id_no }},
                        {{ worker.role_id }}, {{ worker.location_id }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item name="Shift" label="Shift">
                    <a-select
                      v-model:value="formState.shift"
                      v-if="!loading"
                      placeholder="Select Shift"
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
                  </a-form-item>
                  <div class="record-form-actions text-right">
                    <sdButton size="default" htmlType="Save" type="success">
                      {{ isLoading ? "Loading..." : "Submit" }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
            <!-- End of security modal -->
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
import axios from "@/Axiosconfig";

const dateFormat = "YYYY-MM-DD";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Phone No",
    dataIndex: "phone_number",
    key: "phone_no",
  },
  {
    title: "ID No",
    dataIndex: "id_no",
    key: "id_no",
  },
  {
    title: "Shift",
    dataIndex: "shift",
    key: "id",
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
    const isModalShiftOpen = ref(false);
    const post_guard = ref("");
    const isSecurityModalOpen = ref(false);
    const users = ref("");

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

    const post_name = query.name;

    console.log(post_name);

    onMounted(async () => {
      getSecurities();
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/dropoff_security_guards/${query.id}`,
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

    const openShiftModal = (id) => {
      post_guard.value = id;
      isModalShiftOpen.value = true;
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
      /^254((1|7)(?:(?:[129546][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/;

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

    const handleSubmitShift = () => {
      const data = {
        guard_id: post_guard.value,
        shift_id: formState.shift,
        distribution_post_id: post_id,
      };

      console.log(JSON.stringify(data));
      fetch(`${API_URL}/edit_guard_shift`, {
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
              message: "Post Security Shift Updated Successfully",
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
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const handleShiftCancel = () => {
      isModalShiftOpen.value = false;
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const openSecurityModal = (id) => {
      console.log(id);
      isSecurityModalOpen.value = true;
      formState.drop_off_point_id = id;
    };

    const handleCancelSecurity = () => {
      isSecurityModalOpen.value = false;
    };

    const handleAssignSecurity = async () => {
      try {
        const data = {
          user_id: formState.drop_off_manager,
          drop_off_id: query.id,
          shift: formState.shift,
        };

        console.log(JSON.stringify(data));
        await axios
          .post(`security/create_dropoff`, data)
          .then((response) => response.data)
          .then(({ success, message }) => {
            if (success == true) {
              notification.success({
                message: "Success",
                description: message,
              });
              isModalOpen.value = false;
              setTimeout(function () {
                window.location.reload();
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: `${message}`,
              });
            }
            isModalOpen.value = false;
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

    //users
    const getSecurities = async () => {
      const response = await axios.get(`subcounty_dropoff_guards`);
      const data = await response.data.data;
      users.value = data;
      console.log(users.value);
    };

    return {
      dateFormat,
      postdata,
      handleCancel,
      openModal,
      isModalOpen,
      handleShiftCancel,
      openShiftModal,
      isModalShiftOpen,
      crud,
      users,
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
      handleSubmitShift,
      validate,
      handleSubmit,
      isSecurityModalOpen,
      openSecurityModal,
      handleCancelSecurity,
      handleAssignSecurity,
      security_otp,
      gender,
      shift,
      post_name,
      errors: {
        gender: null,
        name: null,
        county_id: "",
        location_type: null,
        facilitator_id: "",
        no_of_days: null,
        venue: "",
        shift: null,
      },
    };
  },
});

export default DragAndDropTable;
</script>
