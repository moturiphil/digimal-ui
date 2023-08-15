<template>
  <RecordViewWrapper>
    <sdPageHeader title="Users">
      <template id="buttons"></template>
    </sdPageHeader>

    <!-- sdPageBody -->

    <Main>
      <a-row :gutter="16" class="search-row">
        <sdButton class="btn-import" type="success">
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
        <!-- &nbsp;&nbsp;&nbsp;&nbsp;
        <sdButton class="btn-import" type="success" @click="exportUserData">
          Export Users
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
                />
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

    // const exportUserData = async () => {
    //   try {
    //     const response = await fetch(API_URL, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         ...authHeader(),
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch export data");
    //     }

    //     const fileBlob = await response.blob();
    //     const fileName = "users.csv";
    //     const link = document.createElement("a");
    //     link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    //     link.setAttribute("download", fileName);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode.removeChild(link);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

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
      // exportUserData,
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
</style>
