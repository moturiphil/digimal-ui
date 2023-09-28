<template>
  <RecordViewWrapper>
    <sdPageHeader title="Masterlists">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name, level, location or organization"
          />
        </div>
      </template>
    </sdPageHeader>
    <!-- sdPageBody -->
    <Main>
      <a-row :gutter="16" class="search-row">
        <sdButton class="btn-import" type="success" size="extra-small">
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
        </sdButton>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <sdButton
          class="btn-import"
          type="success"
          @click="validateMasterlist"
          size="extra-small"
        >
          Validate Masterlist
        </sdButton>
        &nbsp;&nbsp;&nbsp;&nbsp;

        <sdButton class="btn-import" type="success" size="extra-small">
          <router-link
            :to="{
              path: `/uploads`,
            }"
            class="btn-icon router_link"
            type="info"
            shape="circle"
          >
            Uploads
          </router-link>
        </sdButton>

        <br />
        <br />
        <!-- <a-col :xs="24" :sm="24" :md="12"> 
          <sdAutoComplete
            @onSearch="handleSearch"
            placeholder="Search registered users"
            :style="{ width: '80%', marginRight: '80px', height: '40px' }"
          />
        </a-col> -->
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
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #action="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          @click="handleDeletion(record.id)"
                          size="small"
                          type="danger"
                        >
                          <sdFeatherIcons type="x-circle" size="small" />
                          &nbsp; Delete Record
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
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
// import { UploadOutlined } from '@ant-design/icons';
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import UserService from "../../../services/user.service";

const columns = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "organization",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "id",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    slots: { customRender: "action" },
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
    const masterlist_validation_url = `${process.env.VUE_APP_BASE_URL}/mpesa-list-export`;
    const searchItem = ref("");

    // const API_URL = `${process.env.VUE_APP_BASE_URL}/generateUserCSV`;

    console.log(authHeader());

    const api_url = UserService;
    console.log(api_url);

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/masterlist_list`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        const updatedData = data.data.map((record) => {
          let fullName = `${record.first_name} ${record.middle_name} ${record.last_name}`;
          let status = record.status == 1 ? "validated" : "Not Validated";
          // const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          // let created_at = record.created_at.toLocaleDateString('en-US', options);
          return {
            ...record,
            fullName,
            status,
          };
        });
        dataSource.value = updatedData;
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    });

    const validateMasterlist = async () => {
      try {
        const response = await fetch(masterlist_validation_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "master_list.xlsx";
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([fileBlob]));
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeletion = async (id) => {
      try {
        console.log(id);
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/delete_record?record_id=${id}`,
          {
            method: "DELETE",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.success == true) {
          notification.success({
            message: "Success",
            description: data.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Error",
            description: data.message,
          });
        }
      } catch (error) {
        console.error(error);
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

    const formState = reactive({
      searchItem: "",
    });

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
            regex.test(user.level_id) ||
            regex.test(user.org_types_id) ||
            regex.test(user.role)
          );
        });
      }
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
      handleDeletion,
      validateMasterlist,
      results,
      searchItem,
    };
  },
});

export default DragAndDropTable;
</script>

<style>
.search-row {
  display: flex;
  align-items: center;
}
.router_link {
  color: #fff;
}
.router_link:hover {
  color: #fff;
}
</style>
