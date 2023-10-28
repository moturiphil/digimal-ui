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
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
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
    const { query } = useRoute();

    const location_id = query.id;


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
      // toggleUserStatus /*, deactivate user */,
    };
  },
});

export default DragAndDropTable;
</script>

