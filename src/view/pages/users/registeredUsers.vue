<template>
  <RecordViewWrapper>
    <sdPageHeader title="Users">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <!-- <router-link to="/campaigns/create-campaign">
            <sdFeatherIcons type="plus" size="14" /> Start New
            Campaign</router-link
          > -->
        </sdButton>
      </template>
      <!-- <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span></div
      ></template> -->
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :rowSelection="rowSelection"
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
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
// import UserService from "../../../services/user.service";
// import { useRouter } from "vue-router";
// import DragAndDropTable from '../../../view/table/DragTable.vue';

// console.log(userService.getAll());

const columns = [
  {
    title: "First Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
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

    console.log(authHeader());


    onMounted(async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();

        console.log(data.data);

        const updatedData = data.data.map((user) => {
          let fullName = `${user.first_name} ${user.last_name}`;

          function toTitleCase(str) {
            return str.replace(/\w\S*/g, function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
          }

          fullName = toTitleCase(fullName);
          return {
            ...user,
            fullName,
          };
        });

        dataSource.value = updatedData;
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
    };
  },
});

export default DragAndDropTable;
</script>
