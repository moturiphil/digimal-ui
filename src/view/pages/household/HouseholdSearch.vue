<template>
  <div>
    <sdPageHeader ghost title="Search Household to Edit">
      <template #buttons></template>
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <div>
          <a-input-search
            v-model:value="searchItem"
            placeholder="Enter Household phone number to search"
            enter-button
            @search="handleSearch"
          />
        </div>
        <!-- Conditional rendering of the table -->
        <a-table
          v-if="dataSource.length > 0"
          :pagination="{
            pageSize: 50,
            showSizeChanger: true,
          }"
          :dataSource="dataSource"
          :columns="columns"
          @change="handleTableChange"
        >
          <template #action="{ record }">
            <span>
              <a @click="edit(record)"
                ><EditOutlined style="color: rgb(14, 176, 14)" />
              </a>
              <span> | </span>
              <a @click="deleteUser(record)"
                ><PoweroffOutlined style="color: rgb(231, 99, 43)"
              /></a>
            </span>
          </template>
        </a-table>

        <!-- Display a message if no data is available -->
        <div v-else>No data available</div>
      </SearchResultWrapper>
      <div class="modal">
        <a-modal
          :visible="userEditModalopen"
          title="Edit User"
          width="1000px"
          @cancel="handleEditUserCancel(false)"
        >
          <template #footer></template>
          <UserEditForm
            :formFields="userEditFieds"
            v-on:close-editmodal="handleEditUserCancel(false)"
          />
        </a-modal>
      </div>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, defineComponent, reactive } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { notification } from "ant-design-vue";
import UserEditForm from "./EditHH.vue";

export default defineComponent({
  name: "HouseHoldValidation",
  components: {
    Main,
    SearchResultWrapper,
  },
  setup() {
    const isLoading = ref(false);
    // const dataSource = ref([]);
    const searchItem = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/search_household`;

    const userEditModalopen = ref(false);

    const columns = [
      {
        title: "First name",
        dataIndex: "first_name",
        key: "id_no",
      },
      {
        title: "Last name",
        dataIndex: "last_name",
        key: "id_no",
      },
      {
        title: "Phone number",
        dataIndex: "phone_no",
        key: "id_no",
      },
      {
        title: "Household size",
        dataIndex: "hh_size",
        key: "id_no",
      },
      {
        title: "Village",
        dataIndex: "location_id",
        key: "id_no",
      },
      {
        title: "CHP",
        dataIndex: "chw_id",
        key: "id_no",
      },
      {
        title: "CHP Phone Number",
        dataIndex: "chw_phone_no",
        key: "id_no",
      },
      {
        title: "Timestamp",
        dataIndex: "created_at_time",
        key: "id_no",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    const userEditFieds = reactive({
      id: 1,
      first_name: "",
      middle_name: "",
      last_name: "",
      location_id: "",
      org_types_id: "HealthIT",
      role_id: "",
      id_no: "",
      phone_no: "",
    });

    const handleEditUserCancel = (value) => {
      userEditModalopen.value = value;
    };

    const edit = (record) => {
      userEditModalopen.value = true;
      userEditFieds.id = record.id;
      userEditFieds.first_name = record.first_name;
      userEditFieds.middle_name = record.middle_name;
      userEditFieds.last_name = record.last_name;
      userEditFieds.org_types_id = record.org_types_id;
      userEditFieds.location_id = record.location_id;
      userEditFieds.role_id = record.role_id;
      (userEditFieds.id_no = record.id_no),
        (userEditFieds.phone_no = record.phone_no);
    };

    onMounted(() => {
      // Your existing onMounted logic
    });

    // Function to handle the search

    const dataSource = ref([]);

    const handleSearch = async () => {
      try {
        isLoading.value = true;
        const trimmedSearchItem = searchItem.value.trim();
        console.log(trimmedSearchItem);

        const response = await axios.get(
          `${API_URL}?query=${trimmedSearchItem}`,
          {
            headers: authHeader(),
          }
        );

        const hh = response.data.data;

        console.log("API Response:", response);
        console.log("Data from API:", hh);

        // Clear existing data and push new data to maintain reactivity
        // dataSource.value = hh;
        dataSource.value = Array.isArray(hh) ? hh : [hh];

        console.log("Final DataSource:", dataSource.value);
      } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response) {
          // The request was made and the server responded with a status code
          // other than 2xx.
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received.
          console.error(
            "No response received. Request details:",
            error.request
          );
        } else {
          // Something happened in setting up the request that triggered an Error.
          console.error("Error setting up the request:", error.message);
        }

        notification.error({
          message: "Error fetching data. See console for details.",
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      dataSource,
      searchItem,
      handleSearch,
      columns,
      edit,
      handleEditUserCancel,
      UserEditForm,
    };
  },
});
</script>

<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}

.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>
