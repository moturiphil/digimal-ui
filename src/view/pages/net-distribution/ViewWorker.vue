<template>
  <RecordViewWrapper>
    <Main>
      <div class="pw-page">
        <!-- Header -->
        <header class="pw-head">
          <div class="pw-head-left">
            <h3 class="pw-title">
              <span class="pw-icon">▦</span> Post Workers
            </h3>
            <p class="pw-subtitle">{{ post_name }}</p>
          </div>
          <div class="pw-head-actions">
            <sdButton type="success" size="small">
              <router-link
                :to="{ path: `/assign-worker`, query: { id: post_id } }"
                class="btn-icon"
              >
                <sdFeatherIcons type="user-plus" size="14" /> &nbsp;Assign
                Workers
              </router-link>
            </sdButton>
            <sdButton type="warning" size="small" @click="openModal()">
              <sdFeatherIcons type="shield" size="14" /> &nbsp;Add Security
            </sdButton>
          </div>
        </header>

        <!-- Summary chips -->
        <div class="pw-stats">
          <div class="pw-stat">
            <span class="pw-stat-icon total"
              ><sdFeatherIcons type="users" size="16"
            /></span>
            <div class="pw-stat-body">
              <span class="pw-stat-value">{{ totalWorkers }}</span>
              <span class="pw-stat-label">Total Workers</span>
            </div>
          </div>
          <div class="pw-stat">
            <span class="pw-stat-icon active"
              ><sdFeatherIcons type="check-circle" size="16"
            /></span>
            <div class="pw-stat-body">
              <span class="pw-stat-value">{{ activeWorkers }}</span>
              <span class="pw-stat-label">Active</span>
            </div>
          </div>
          <div class="pw-stat">
            <span class="pw-stat-icon security"
              ><sdFeatherIcons type="shield" size="16"
            /></span>
            <div class="pw-stat-body">
              <span class="pw-stat-value">{{ securityWorkers }}</span>
              <span class="pw-stat-label">Security</span>
            </div>
          </div>
        </div>

        <!-- Search -->
        <div class="pw-toolbar">
          <div class="pw-search">
            <span class="search-icon"
              ><sdFeatherIcons type="search" size="14"
            /></span>
            <a-input
              v-model:value="searchTerm"
              placeholder="Search by name, ID, phone or role"
              allow-clear
            />
          </div>
        </div>

        <div v-if="isLoading" class="pw-loading"><a-spin /></div>

        <div v-else>
          <!-- Desktop / tablet table -->
          <TableWrapper class="table-data-view table-responsive pw-table">
            <a-table
              :pagination="{ pageSize: 10, showSizeChanger: true }"
              :dataSource="filteredWorkers"
              :columns="columns"
              :scroll="{ x: 'max-content' }"
              row-key="id"
              size="middle"
            >
              <template #name="{ record }">
                <td>
                  <div class="pw-name-cell">
                    <span class="pw-avatar">{{ initials(record) }}</span>
                    <span class="pw-name-text"
                      >{{ record.first_name }} {{ record.last_name }}</span
                    >
                  </div>
                </td>
              </template>
              <template #role="{ record }">
                <td>
                  <span class="pw-role-tag" :class="roleClass(record.role_id)">{{
                    record.role_id
                  }}</span>
                </td>
              </template>
              <template #status="{ record }">
                <td>
                  <span
                    class="pw-status"
                    :class="statusClass(record.status)"
                    >{{ record.status || "—" }}</span
                  >
                </td>
              </template>
              <template #workers="{ record }">
                <td>
                  <div class="table-actions">
                    <sdButton
                      size="extra-small"
                      type="danger"
                      outlined
                      :disabled="isStarting"
                      @click="removeMatrix(record.id)"
                    >
                      De-Assign
                    </sdButton>
                    <sdButton
                      size="extra-small"
                      type="success"
                      outlined
                      :disabled="isStarting"
                      @click="openShiftModal(record.id)"
                      v-if="record.role_id == 'Security Guard - Post'"
                    >
                      Edit Shift
                    </sdButton>
                  </div>
                </td>
              </template>
            </a-table>
          </TableWrapper>

          <!-- Mobile card list -->
          <div class="pw-cards">
            <article
              v-for="record in filteredWorkers"
              :key="record.id"
              class="pw-card"
            >
              <div class="pw-card-head">
                <span class="pw-avatar">{{ initials(record) }}</span>
                <div class="pw-card-id">
                  <span class="pw-card-name"
                    >{{ record.first_name }} {{ record.last_name }}</span
                  >
                  <span class="pw-role-tag" :class="roleClass(record.role_id)">{{
                    record.role_id
                  }}</span>
                </div>
                <span class="pw-status" :class="statusClass(record.status)">{{
                  record.status || "—"
                }}</span>
              </div>
              <div class="pw-card-meta">
                <div>
                  <span class="lbl">Phone</span>
                  <span class="val">{{ record.phone_no || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">ID No</span>
                  <span class="val">{{ record.id_no || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">Location</span>
                  <span class="val">{{ record.location_id || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">Shift</span>
                  <span class="val">{{ record.shift || "—" }}</span>
                </div>
              </div>
              <div class="pw-card-actions">
                <sdButton
                  size="extra-small"
                  type="danger"
                  outlined
                  :disabled="isStarting"
                  @click="removeMatrix(record.id)"
                >
                  De-Assign Worker
                </sdButton>
                <sdButton
                  size="extra-small"
                  type="success"
                  outlined
                  :disabled="isStarting"
                  @click="openShiftModal(record.id)"
                  v-if="record.role_id == 'Security Guard - Post'"
                >
                  Edit Shift
                </sdButton>
              </div>
            </article>
            <div v-if="!filteredWorkers.length" class="pw-empty">
              No post workers found.
            </div>
          </div>
        </div>
        <sdCards headless class="pw-modal-host">
            <!-- Add Security modal -->
            <a-modal
              title="Add Security"
              :visible="isModalOpen"
              @cancel="handleCancel"
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

            <!-- Edit Security shift modal -->
            <a-modal
              title="Edit Security Shift"
              :visible="isModalShiftOpen"
              @cancel="handleShiftCancel"
              width="20%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-record-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleSubmitShift"
                >
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
                          : "Update Shift"
                      }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
            <!-- End of Update Guard Shift modal -->
        </sdCards>
      </div>
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
    title: "Name",
    dataIndex: "first_name",
    key: "name",
    slots: { customRender: "name" },
  },
  {
    title: "Phone No",
    dataIndex: "phone_no",
    key: "phone_no",
  },
  {
    title: "ID No",
    dataIndex: "id_no",
    key: "id_no",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "location_id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "role_id",
    slots: { customRender: "role" },
  },
  {
    title: "Shift",
    dataIndex: "shift",
    key: "shift",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    slots: { customRender: "status" },
  },
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
    const searchTerm = ref("");
    const isModalOpen = ref(false);
    const postdata = ref([]);
    const { query } = useRoute();
    const API_URL = `${process.env.VUE_APP_BASE_URL}`;
    const security_otp = ref(false);
    const isModalShiftOpen = ref(false);
    const post_guard = ref("");

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

    // ── Derived stats + search/filter + display helpers ──
    const totalWorkers = computed(() => dataSource.value.length);
    const securityWorkers = computed(
      () =>
        dataSource.value.filter(
          (w) => (w.role_id || "").toLowerCase().includes("security")
        ).length
    );
    const activeWorkers = computed(
      () =>
        dataSource.value.filter(
          (w) => (w.status || "").toLowerCase() === "active"
        ).length
    );

    const filteredWorkers = computed(() => {
      const q = searchTerm.value.trim().toLowerCase();
      if (!q) return dataSource.value;
      return dataSource.value.filter((w) =>
        [
          w.first_name,
          w.last_name,
          w.phone_no,
          w.id_no,
          w.role_id,
          w.location_id,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      );
    });

    const initials = (record) => {
      const f = (record.first_name || "").charAt(0);
      const l = (record.last_name || "").charAt(0);
      return (f + l).toUpperCase() || "?";
    };

    const roleClass = (role) => {
      const r = (role || "").toLowerCase();
      if (r.includes("security")) return "role-security";
      if (r.includes("supervisor")) return "role-supervisor";
      if (r.includes("chv") || r.includes("chp") || r.includes("community"))
        return "role-chv";
      if (r.includes("elder")) return "role-elder";
      return "role-default";
    };

    const statusClass = (status) => {
      const s = (status || "").toLowerCase();
      if (s === "active") return "status-active";
      if (s === "inactive") return "status-inactive";
      return "status-default";
    };

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
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      searchTerm,
      filteredWorkers,
      totalWorkers,
      activeWorkers,
      securityWorkers,
      initials,
      roleClass,
      statusClass,
      columns,
      formState,
      post_id,
      removeMatrix,
      handleSubmitShift,
      validate,
      handleSubmit,
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
<style lang="less" scoped>
.pw-page {
  padding-top: 6px;
  padding-bottom: 18px;

  /* Header */
  .pw-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .pw-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #1f2437;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pw-icon {
    color: #2f6746;
  }
  .pw-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: #8a90a6;
  }
  .pw-head-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    :deep(.btn-icon) {
      display: inline-flex;
      align-items: center;
      color: inherit;
    }
  }

  /* Summary chips */
  .pw-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  .pw-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1px solid #e6f2eb;
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: 0 3px 10px rgba(28, 122, 72, 0.05);
  }
  .pw-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pw-stat-icon.total {
    background: #ebebff;
    color: #5f63f2;
  }
  .pw-stat-icon.active {
    background: #e3faf3;
    color: #20c997;
  }
  .pw-stat-icon.security {
    background: #fff4e0;
    color: #fa8b0c;
  }
  .pw-stat-body {
    display: flex;
    flex-direction: column;
  }
  .pw-stat-value {
    font-size: 22px;
    font-weight: 800;
    color: #1f2437;
    line-height: 1.1;
  }
  .pw-stat-label {
    font-size: 11px;
    color: #8a90a6;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Toolbar / search */
  .pw-toolbar {
    margin-bottom: 14px;
  }
  .pw-search {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 360px;
    .search-icon {
      position: absolute;
      left: 14px;
      color: #9ab8a8;
      display: flex;
      z-index: 1;
    }
    :deep(.ant-input-affix-wrapper),
    :deep(input) {
      border-radius: 22px;
      border: 1px solid #d9f0e2;
      background: #f7fdf9;
      padding-left: 36px;
      height: 40px;
    }
  }

  .pw-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  /* Avatar + name */
  .pw-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #20c997 0%, #36ddb3 100%);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pw-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pw-name-text {
    font-weight: 600;
    color: #2f3a35;
  }

  /* Role + status tags */
  .pw-role-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    border-radius: 12px;
    padding: 2px 10px;
    white-space: nowrap;
  }
  .role-security {
    background: #fff4e0;
    color: #fa8b0c;
  }
  .role-supervisor {
    background: #ebebff;
    color: #5f63f2;
  }
  .role-chv {
    background: #e5f3ff;
    color: #2c99ff;
  }
  .role-elder {
    background: #f3ebff;
    color: #9254de;
  }
  .role-default {
    background: #eef2f0;
    color: #4d7a63;
  }
  .pw-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  }
  .status-active {
    color: #20c997;
  }
  .status-inactive {
    color: #ff4d4f;
  }
  .status-default {
    color: #9299b8;
  }

  /* Desktop table */
  .pw-table {
    :deep(.ant-table) {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e6f2eb;
      box-shadow: 0 4px 14px rgba(28, 122, 72, 0.06);
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid #e1efe6;
    }
    :deep(.ant-table-thead > tr > th::before) {
      display: none;
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #f1f7f3;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f3fbf6;
    }
    .table-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
  }

  /* Mobile cards */
  .pw-cards {
    display: none;
    flex-direction: column;
    gap: 12px;
  }
  .pw-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }
  .pw-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .pw-card-id {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }
  .pw-card-name {
    font-size: 14px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.2;
  }
  .pw-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 14px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lbl {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #7a8a82;
      font-weight: 600;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: #2f3a35;
      word-break: break-word;
    }
  }
  .pw-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.ant-btn) {
      width: 100%;
      justify-content: center;
    }
  }
  .pw-empty {
    text-align: center;
    padding: 40px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  .pw-modal-host {
    display: none;
  }

  /* ── Mobile-first breakpoints ── */
  @media (max-width: 991px) {
    .pw-table {
      display: none;
    }
    .pw-cards {
      display: flex;
    }
  }
  @media (max-width: 575px) {
    .pw-head-actions {
      width: 100%;
    }
    .pw-head-actions :deep(.ant-btn) {
      flex: 1;
      justify-content: center;
    }
    .pw-stats {
      grid-template-columns: 1fr;
    }
    .pw-search {
      max-width: 100%;
    }
    .pw-card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
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
