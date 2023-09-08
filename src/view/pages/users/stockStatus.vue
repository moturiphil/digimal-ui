<template>
    <RecordViewWrapper>
      <sdPageHeader title="Stock Status">
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
  
  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "id",
    },
    {
      title: "Batch No",
      dataIndex: "batch_no",
      key: "id",
    },
    {
      title: "Warehouse Name",
      dataIndex: "warehouse_name",
      key: "id",
    },
    {
      title: "Quantity Available",
      dataIndex: "quantity_available",
      key: "id",
    },
    {
      title: "Product Source",
      dataIndex: "product_source",
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
  
    //   const api_url = UserService;
    //   console.log(api_url);
  
      onMounted(async () => {
        try {
          const response = await fetch(`http://196.201.229.186:8091/api/InventoryMaster/Getstock`, 
          // const response = await fetch(`${process.env.VUE_APP_BASE_URL}/stock_status`, 
          {
            method: "GET",
            // headers: authHeader(),
          });
          console.log(response);
          const data = await response.json();
          // console.log(data);
          dataSource.value = data;
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
    