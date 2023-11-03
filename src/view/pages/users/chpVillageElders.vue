<template>
  <RecordViewWrapper>
    <sdPageHeader title="Village Elders & CHP">
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
        @ok="handleOk(recordId, inputValue)"
        @cancel="handleCancel"
        class="title-success"
      >
        <div>
          <!-- <p>Reassign User</p> -->
          <!-- <input type="number" v-model="inputValue" /> -->

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
              v-model:value="formState.ward_id"
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

          <a-form-item name="location_id">
            <a-select
              size="large"
              name="basic-select"
              class="sDash_fullwidth-select"
              placeholder="Select Location"
              v-model:value="formState.location_id"
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
              v-model:value="formState.sub_location_id"
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

          <a-form-item name="village">
            <a-select
              size="large"
              name="basic-select"
              class="sDash_fullwidth-select"
              placeholder="Select Village to Reassign to"
              v-model:value="formState.village"
            >
              <a-select-option value="">Select an option</a-select-option>
              <a-select-option
                v-for="village in villages"
                :value="village.org_id"
                :key="village.id"
                >{{ village.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
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


    const location_id = query.id;


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
      counties.value = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      // data.loading = false;
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

    const handleAssignment = (id) => {
      getCounties();
      isModalOpen.value = true;
      console.log("Event Code;", id);
      // recordId.value = id;
      // console.log("recordId", recordId.value);
      try {
        console.log("register");
      } catch (error) {
        console.log(error);
      }
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

    const handleOk = async (id, inputValue) => {
      // console.log(recordId.value);
      console.log(inputValue);
      try {
        const response = await axios.get(
          // `${process.env.VUE_APP_BASE_URL}/event/${recordId.value}/participant/${inputValue}/assign`,
          { headers: authHeader() }
        );
        console.log(response);
        if (response.status == 200) {
          inputValue = "";
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

      // toggleUserStatus /*, deactivate user */,
    };
  },
});

export default DragAndDropTable;
</script>
