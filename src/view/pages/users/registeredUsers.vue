<template>
  <RecordViewWrapper>
    <sdPageHeader title="Registered Users">
      <template #buttons>
        <div class="search-box">
          <a-input
            style="border: 1px solid #151414; padding: 8px; border-radius: 5px; align-items: center; justify-items: center;"
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name"
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" size="small">
        <router-link to="/events/add-stakeholder"> Add Stakeholder</router-link>
      </sdButton>
      &nbsp;&nbsp;

      <sdButton class="btn-import" type="success" size="small">
        <router-link to="/users/add-chp-ve"> Add CHP & VE</router-link>
      </sdButton>
      <br />
      <br />
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
                  :pagination="{
                    pageSize: 100,
                    showSizeChanger: true,
                    current: currentPage,
                  }"
                  :dataSource="dataSource"
                  :columns="columns"
                  @change="handleTableChange"
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
import { computed, onMounted, ref, reactive, defineComponent, watchEffect } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
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
    key: "users",
    slots: { customRender: "users" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");
    const users = ref([]);

    // onMounted(async () => {
    //   try {
    //     const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
    //       method: "GET",
    //       headers: authHeader(),
    //     });
    //     const data = await response.json();
    //     dataSource.value = data.data;
    //     console.log(data.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

    onMounted(async () => {
      try {
        // Assuming you have an initial page number
        const pageNumber = 1;
        const pageSize = 100;

        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/users?page=${pageNumber}&per_page=${pageSize}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        users.value = data.data;
        dataSource.value = data.data;
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

    watchEffect(async()=>{
      const query = searchItem.value.toLowerCase();
      try {
        if(!query) 
        {
          dataSource.value = users.value;
          return dataSource.value;
        }
        if(query.length > 3){
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/users?query=${query}`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          dataSource.value = data.data;
        }
        
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    })

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
      searchItem,
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
  background-color: #1ec997;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1ec997;
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