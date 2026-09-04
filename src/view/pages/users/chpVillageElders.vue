<template>
  <RecordViewWrapper>
    <sdPageHeader title="Village Elders & CHPs">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name or role"
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="16" class="search-row"> </a-row>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #units="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          @click="handleAssignment(record.id)"
                          size="extra-small"
                          type="success"
                        >
                          Reassign
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          @click="handleDeAssignment(record.id)"
                          size="extra-small"
                          type="success"
                        >
                          De-assign
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
      <a-modal
        title="Reassign CHP"
        :visible="isModalOpen"
        @ok="handleOk(recordId)"
        @cancel="handleCancel"
        class="title-success"
      >
        <div>
          <BasicFormWrapper>
            <a-form
              class="add-record-form"
              :style="{ width: '100%' }"
              layout="vertical"
              name="addnew"
              :model="formState"
              @finish="handleSubmit"
            >
              <a-form-item name="county">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select County"
                  v-on:change="getSubCounties($event)"
                  v-if="!loading"
                >
                  <a-select-option value="">Select an option</a-select-option>
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
              <a-form-item name="sub_county">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Sub-County"
                  v-on:change="getWards($event)"
                >
                  <a-select-option value="">Select an option</a-select-option>
                  <a-select-option
                    v-for="scounty in sub_counties"
                    :value="scounty.org_id"
                    :key="scounty.id"
                    >{{ scounty.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>

              <a-form-item name="ward_id">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Ward"
                  v-on:change="getLocations($event)"
                >
                  <a-select-option value="">Select an option</a-select-option>
                  <a-select-option
                    v-for="ward in wards"
                    :value="ward.org_id"
                    :key="ward.id"
                    >{{ ward.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>

              <a-form-item name="location">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Location"
                  v-on:change="getSubLocations($event)"
                >
                  <a-select-option value="">Select an option</a-select-option>
                  <a-select-option
                    v-for="location in locations"
                    :value="location.org_id"
                    :key="location.id"
                    >{{ location.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>

              <a-form-item name="sub_location_id">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Sub Location"
                  v-on:change="getVillages($event)"
                >
                  <a-select-option value="">Select an option</a-select-option>
                  <a-select-option
                    v-for="slocation in sub_locations"
                    :value="slocation.org_id"
                    :key="slocation.id"
                    >{{ slocation.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>

              <a-form-item name="Location">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Village to Reassign to"
                  v-model:value="formState.location_id"
                >
                  <a-select-option value="">Select an option</a-select-option>
                  <a-select-option
                    v-for="village in villages"
                    :value="village.id"
                    :key="village.id"
                    >{{ village.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item name="Role">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Role"
                  v-on:change="getSubCounties($event)"
                  v-model:value="formState.role_id"
                  v-if="!loading"
                >
                  <a-select-option
                    v-for="role in roles"
                    :value="role.id"
                    :key="role.id"
                  >
                    {{ role.name }}
                  </a-select-option>
                </a-select>
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
        </div>
      </a-modal>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import axios from "axios";
import * as Yup from "yup";
// import { Switch } from "ant-design-vue";

const columns = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "id",
  },
  {
    title: "Middle Name",
    dataIndex: "middle_name",
    key: "id",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Household Registered",
    dataIndex: "household_registered",
    key: "id",
  },
  {
    title: "Registration Days",
    dataIndex: "registration_days",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  methods: {
    handleCancel() {
      this.isModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
  },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");
    const { query } = useRoute();
    let isModalOpen = ref(false);
    const counties = ref([]);
    const sub_counties = ref([]);
    const wards = ref([]);
    const locations = ref([]);
    const sub_locations = ref([]);
    const villages = ref([]);
    const roles = [
      { id: 52, name: "CHP" },
      { id: 51, name: "Village Elder" },
    ];

    const location_id = query.id;
    const API_URL = `${process.env.VUE_APP_BASE_URL}/update_chp_ve`;
    const DEASSIGN_URL = `${process.env.VUE_APP_BASE_URL}/deassign_chp_ve`;


    const getCounties = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_counties`,
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
      const countiesList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      counties.value = countiesList.map((county) => ({
        ...county,
      }));
    };

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/list_chp_ve?location_id=${location_id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data;
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    });

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

    const ArticleSchema = Yup.object().shape({});

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    var user_id = "";

    const handleAssignment = (id) => {
      getCounties();
      isModalOpen.value = true;
      console.log("Record ID", id);
      user_id = id;
    };

    const handleDeAssignment = (id) => {
      const data = {
        user_id: id,
      };
      console.log(data);

      fetch(DEASSIGN_URL, {
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
            notification["success"]({
              message: "User De-assigned successfully",
              description: `User De-assigned from village to sub-county successfully`,
              duration: 5.5,
            });
          }
          // show error message from the api response
          else {
            notification["error"]({
              message: "Error!",
              description: "Failed to De-assigned",
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          // Handle fetch errors here
          notification["error"]({
            message: "Error!",
            description: `${error}`,
            duration: 5.5,
          });
        });
    };

    const handleSubmit = () => {
      const data = {
        location_id: formState.location_id,
        user_id: user_id, // Make sure user_id is defined
        role_id: formState.role_id,
      };
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
          if (success) {
            notification["success"]({
              message: "Success",
              description: `User Reassigned mapped successfully`,
              duration: 5.5,
            });
          }
          // show error message from the api response
          else {
            notification["error"]({
              message: "Error!",
              description: "Fail to Reassigned User",
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          // Handle fetch errors here
          notification["error"]({
            message: "Error!",
            description: `${error}`,
            duration: 5.5,
          });
        });
    };

    const handleOk = async (id, inputValue) => {
      console.log(id);
      console.log(inputValue);
      try {
        const response = await axios.post(API_URL, { headers: authHeader() });
        console.log(response);
        if (response.status == 200) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });
          inputValue = "";
        } else if (response.status == 208) {
          notification.info({
            message: "Info",
            description: response.data.message,
          });
          inputValue = "";
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description:
            "Reassignment Failed, User already started household registration",
        });
        inputValue = "";
      } finally {
        console.log(inputValue);
        inputValue = ""; // Clear inputValue after the modal is closed
        isModalOpen = true;
      }
    };

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
      sub_counties.value = data.message;
    };

    //wards
    const getWards = async (org_id) => {
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
      wards.value = data.message;
    };

    // locations
    const getLocations = async (org_id) => {
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
      locations.value = data.message;
    };

    // sub-subcountues
    const getSubLocations = async (org_id) => {
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
      sub_locations.value = data.message;
    };

    const getVillages = async (org_id) => {
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
      villages.value = data.message;
    };

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((user) => {
          return (
            regex.test(user.first_name) ||
            regex.test(user.last_name) ||
            regex.test(user.id_no) ||
            regex.test(user.role_id)
          );
        });
      }
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
      isDeactivated: false,
      results,
      searchItem,
      handleAssignment,
      isModalOpen,
      handleOk,
      counties,
      sub_counties,
      wards,
      locations,
      sub_locations,
      villages,
      getCounties,
      getSubCounties,
      getWards,
      getLocations,
      getSubLocations,
      getVillages,
      roles,
      handleSubmit,
      validate,
      handleDeAssignment,
    };
  },
});

export default DragAndDropTable;
</script>
