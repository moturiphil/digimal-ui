<template>
  <RecordViewWrapper>
    <sdPageHeader title="User Roles">
      <template id="buttons"></template>
    </sdPageHeader>

    <!-- sdPageBody -->

    <Main>
      <a-row :gutter="16" class="search-row">
        <sdButton class="btn-import" type="success">
          <router-link
            :to="{
              path: `/assign-permission`,
            }"
            class="btn-icon"
            type="info"
            shape="circle"
          >
            &nbsp;&nbsp; Assign Role Permission
          </router-link>
        </sdButton>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <!-- <sdButton class="btn-import" type="success" @click="exportUserData">
          Export Users
        </sdButton> -->
        <br />
        <br />
        <a-col :xs="24" :sm="24" :md="12">
          <sdAutoComplete
            @onSearch="handleSearch"
            placeholder="Search role"
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
                  <template #action="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton class="btn-import green" type="success">
                          <router-link
                            :to="`/assign-permission/${record.orgtype_id}`"
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
import { Main, TableWrapper } from "../../styled";
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
    dataIndex: "orgtype_id",
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
  components: { RecordViewWrapper, Main, TableWrapper },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}/generateUserCSV`;

    console.log(authHeader());

    const api_url = UserService;
    console.log(api_url);

    onMounted(async () => {
      try {
        const rls = [];
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/roles`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        for (let i = 1; i < data.length; i++) {
          const element = {
            id: i,
            name: data[i].name,
            orgtype_id: data[i].orgtype_id,
          };
          rls.push(element);
        }
        dataSource.value = rls;
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
