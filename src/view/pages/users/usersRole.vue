<template>
  <RecordViewWrapper>
    <sdPageHeader title="User Roles">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by role name..."
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
                  <template #action="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton type="success" size="small">
                          <router-link
                            :to="{
                              path: `/assign-permission/${record.id}`,
                              query: {
                                id: record.id,
                                name: record.name,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            &nbsp;&nbsp; Assign Role Permission
                          </router-link>
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
// import axios from "axios";
import authHeader from "../../../services/auth-header";
import UserService from "../../../services/user.service";
import { useRouter } from "vue-router";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "orgtype_name",
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
    const searchItem = ref("");
    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/generateUserCSV`;

    console.log(authHeader());

    const api_url = UserService;
    console.log(api_url);

    onMounted(async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/roles`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        dataSource.value = data;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

    const handleRowClick = (row) => {
      console.log(row);
      router.push({ path: `/assign-permission/${row.id}` });
    };
    const exportUserData = async () => {
      try {
        const response = await fetch(API_URL, {
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
        const fileName = "users.csv";
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
        return dataSource.value.filter((role) => {
          return (
            regex.test(role.name)
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
      handleRowClick,
      exportUserData,
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
.green {
  background-color: green;
}
</style>
