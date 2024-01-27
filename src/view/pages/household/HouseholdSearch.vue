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
        <!-- Conditional rendering of the table" -->
        <a-table
          v-if="dataSource.length > 0"
          :pagination="{
            pageSize: 50,
            showSizeChanger: true,
          }"
          :dataSource="dataSource"
          :columns="columns"
        >
          <template #action="{ record }">
            <td>
              <div class="table-actions">
                <sdButton
                  @click="handleUpdate(record)"
                  size="extra-small"
                  type="success"
                >
                  <sdFeatherIcons type="edit-3" size="small" />
                  &nbsp; Update ID No
                </sdButton>
              </div>
            </td>
          </template>
        </a-table>

        <!-- Display a message if no data is available -->
        <div v-else>No data available</div>
      </SearchResultWrapper>
      <a-modal
        title="Update Household ID No"
        :visible="isModalOpen"
        @ok="handleOk(recordId, inputValue)"
        @cancel="handleCancel"
        class="title-success"
      >
        <div>
          <p>Enter the correct Household ID No</p>
          <input type="number" v-model="inputValue" />
        </div>
      </a-modal>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { notification } from "ant-design-vue";

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

    const BASE_URL = `${process.env.VUE_APP_BASE_URL}`;

    const columns = [
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Middle Name",
        dataIndex: "middle_name",
        key: "middle_name",
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "ID No",
        dataIndex: "id_no",
        key: "id_no",
      },
      {
        title: "Phone No",
        dataIndex: "phone_no",
        key: "phone_no",
      },
      {
        title: "Nets Allocated",
        dataIndex: "actual_allocation",
        key: "actual_allocation",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];

    onMounted(() => {
      // Your existing onMounted logic
    });

    // Function to handle the search

    const dataSource = ref([]);

    let isModalOpen = ref(false);

    const recordId = ref(null);

    const visible = ref(false);

    const handleSearch = async () => {
      try {
        isLoading.value = true;
        const trimmedSearchItem = searchItem.value.trim();

        // Check if the input is a 10-digit number
        const isNumeric = /^\d+$/.test(trimmedSearchItem);
        if (trimmedSearchItem.length !== 10 || !isNumeric) {
          notification.error({
            message: "Please enter a 10-digit number.",
          });
          return;
        }

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

    const handleUpdate = (id) => {
      console.log(id);
      isModalOpen.value = true;
      console.log("Event Code;", id);
      recordId.value = id;
      console.log("recordId", recordId.value);
      try {
        console.log("register");
      } catch (error) {
        console.log(error);
      }
    };

    const handleCancel = () => {
      isModalOpen.value = false;
      visible.value = false;
    };

    const handleOk = async (id, inputValue) => {
      const hh = recordId.value;
      console.log(hh.id);
      console.log(inputValue);

      console.log(`${BASE_URL}/update_household_record`);

      try {
        const response = await axios.post(
          `${BASE_URL}/update_household_record`,
          {
            hh_id: hh.id,
            id_no: inputValue,
          },
          {
            headers: authHeader(),
          }
        );

        console.log(response);

        if (response.data.success === true) {
          inputValue = "";
          notification.success({
            message: "Success",
            description: response.data.message,
          });
        } else {
          notification.info({
            message: "Error",
            description: response.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error Updating Household ID No",
        });
      } finally {
        inputValue = "";
        isModalOpen = true;
      }
    };

    return {
      isLoading,
      dataSource,
      searchItem,
      handleSearch,
      columns,
      handleUpdate,
      handleCancel,
      isModalOpen,
      handleOk,
      visible,
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
