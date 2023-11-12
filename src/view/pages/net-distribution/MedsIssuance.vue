<template>
    <RecordViewWrapper>
      <sdPageHeader title="MEDS Issuance">
        <template #subTitle>
          <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
        </template>
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
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :dataSource="dataSource"
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
  import { Main, TableWrapper } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  // import axios from "axios";
  import authHeader from "../../../services/auth-header";
  
  const columns = [
    {
      title: "HouseHold Name",
      dataIndex: "house_hold_name",
      key: "id",
    },
    {
      title: "CHV Name",
      dataIndex: "chw",
      key: "name",
    },
    {
      title: "Post",
      dataIndex: "post",
      key: "id",
    },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      key: "id",
    },
    {
      title: "No of Nets",
      dataIndex: "no_of_nets",
      key: "id",
    },
    // {
    //   title: "",
    //   dataIndex: "",
    //   key: "activities",
    //   slots: { customRender: "activities" },
    // },
  ];
  
  const DragAndDropTable = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main, TableWrapper },
  
    computed: {
      recordCount() {
        return this.dataSource.length;
      },
    },
    setup() {
      const { state, dispatch } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
  
      console.log(authHeader());
  
      //   const api_url = UserService;
      //   console.log(api_url);
  
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/distribution_details/all`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          console.log(response);
          const data = await response.json();
          dataSource.value = data.data;
          console.log(data.data);
          // console.log($route.params.id)
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
  