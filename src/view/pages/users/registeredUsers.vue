<template>
  <RecordViewWrapper>
    <sdPageHeader title="Users">
      <template id="buttons"></template>
    </sdPageHeader>

    <!-- sdPageBody -->

    <Main>
      <a-row :gutter="16" class="search-row">
        <!-- <sdButton class="btn-import" type="success">
          <router-link
            :to="{
              path: `/users/import`,
            }"
            class="btn-icon"
            type="info"
            shape="circle"
          >
            &nbsp;&nbsp; Import Master List
          </router-link>
        </sdButton> -->
        <br />
        <br />
        <a-col :xs="24" :sm="24" :md="12">
          <sdAutoComplete
            @onSearch="handleSearch"
            placeholder="Search registered users"
            :style="{ width: '80%', marginRight: '80px', height: '40px' }"
          />
        </a-col>
      </a-row>
      <a-row :gutter="16" class="search-row"> </a-row>
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
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <!-- <template #users="{ record }">
                    <td :style="{ 'margin-left': '4px' }">
                      <div class="table-actions">
                        <label class="switch">
                          <input
                            type="checkbox"
                            :disabled="isDeactivated"
                            @change="deactivateUser(record.id)"
                            v-model="record.status"
                          />
                          <span class="slider round"></span>
                        </label>
                        <span v-if="record.status">Active</span>
                        <span v-else>Inactive</span>
                      </div>
                    </td>
                  </template> -->

                  <!-- <template #users="{ record }">
                    <td :style="{ 'margin-left': '4px' }">
                      <div class="table-actions">
                        <label class="switch">
                          <input
                            type="checkbox"
                            :disabled="isStarting"
                            @change="toggleUserStatus(record.id, record.status)"
                            v-model="record.status"
                          />
                          <span class="slider round"></span>
                        </label>
                        <span v-if="record.status">Inactive</span>
                        <span v-else>Active</span>
                      </div>
                    </td>
                  </template> -->
                </a-table>
              </TableWrapper>
            </div>
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
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import UserService from "../../../services/user.service";
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
    key: "users",
    slots: { customRender: "users" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  // data() {
  //   return {
  //     users: [], // This is where your users data should be stored
  //     // Other data properties...
  //   };
  // },

  // methods : {
  //   toggleUserStatus(id, status) {
  //     const confirmMessage = status
  //       ? "Are you sure to activate this user?"
  //       : "Are you sure to deactivate this user?";
  //     const confirm = window.confirm(confirmMessage);

  //     if (confirm) {
  //       axios
  //         .post( `${process.env.VUE_APP_BASE_URL}/users/${id}/toggleStatus`)
  //         .then((response) => {
  //           // Assuming the API returns a success response
  //           console.log(response);
  //           if (response.data.success) {
  //             // Update the user's status in your data
  //             // For example, assuming your data structure is an array called 'users'
  //             // const user = users.find((user) => user.id === id);
  //             // if (user) {
  //             //   user.status = !user.status; // Toggle the status
  //             // }
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error toggling user status:", error);
  //         });
  //     }
  //   },
  // },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);

    // const API_URL = `${process.env.VUE_APP_BASE_URL}/generateUserCSV`;

    console.log(authHeader());

    const api_url = UserService;
    console.log(api_url);

    onMounted(async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
          method: "GET",
          headers: authHeader(),
        });
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

    const deactivateUser = async (id) => {
      console.log(id);
      const confirm = window.confirm("Are you sure to deactivate this user?");
      if (confirm) {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/users/${id}/toggleStatus`,
          {
            method: "POST",
            headers: authHeader(),
          }
        );
        console.log(response);
      }
      return false;
    };


    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

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
      deactivateUser,
      // toggleUserStatus /*, deactivate user */,
    };
  },
});

export default DragAndDropTable;
</script>

<style>
/* You can style the toggle switch as needed */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #1EC997;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1EC997;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
