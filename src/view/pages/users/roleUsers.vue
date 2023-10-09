<template>
  <RecordViewWrapper>
    <sdPageHeader :title="`${role_name} Users`">
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
                <p> <b>Total Records: </b> {{ recordCount }}</p>
                <a-table
                  :pagination="{ pageSize: 50, showSizeChanger: true }"
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
import authHeader from "../../../services/auth-header";
import { useRoute } from "vue-router";


const columns = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "ID No",
    dataIndex: "id_no",
    key: "id",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Job Group",
    dataIndex: "job_group",
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
    const { query } = useRoute();
    console.log(query.name);
    const role_name = query.name

    console.log(authHeader());

    //   const api_url = UserService;
    //   console.log(api_url);

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_user_given_the_role?role=${role_name}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        console.log(response);
        const data = await response.json();
        console.log(data.data);
        const updatedData = data.data.map((record) => {
          let fullName = `${record.first_name} ${record.last_name}`;
          let status = record.status == 1 ? "validated" : "Not Validated";
          return {
            ...record,
            fullName,
            status,
          };
        });
        console.log(updatedData);

        dataSource.value = updatedData;
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
      role_name,
    };
  },
  computed: {
    recordCount() {
      return this.dataSource.length;
    },
  },
});

export default DragAndDropTable;
</script>
