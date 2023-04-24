<template>
    <RecordViewWrapper>
      <sdPageHeader title="Households Lists">
        <template #subTitle>
        </template>
        <template #buttons>
          <div class="search-box">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              @change="onHandleSearch"
              v-model:value.trim="formState.searchItem"
              type="text"
              name="dataSource"
              placeholder="Search Here"
            /></div
        ></template>
      </sdPageHeader>
      <Main>
        <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
          Export HouseHolds Data
        </sdButton>
        <br>
        <br>
        <a-row :gutter="15">
          <a-col class="w-100" :md="24">
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>
  
              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
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
      </Main>
    </RecordViewWrapper>
  </template>
  <script>
  import axios from "axios";
  import authHeader from "../../../services/auth-header";
  import { RecordViewWrapper } from "../style";
  import { Main, TableWrapper } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  // import { useRouter } from "vue-router";
  // import { Modal } from "ant-design-vue";
  
  // const router = useRouter();
  
  const columns = [
    {
      title: "First name",
      dataIndex: "first_name",
      key: "id_no",
    },
    {
      title: "Last name",
      dataIndex: "last_name",
      key: "id_no",
    },
    {
      title: "Phone number",
      dataIndex: "phone_no",
      key: "id_no",
    },
    {
      title: "Household size",
      dataIndex: "hh_size",
      key: "id_no",
    },
    {
      title: "Location",
      dataIndex: "location_id",
      key: "id_no",
    },
    {
      title: "CHV",
      dataIndex: "chw_id",
      key: "id_no",
    },
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "id_no",
    },
  ];
  
  const ViewPage = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main, TableWrapper },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        modalType: "primary",
        colorVisible: false,
      };
    },
    setup() {
      const { state } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
  
      const API_URL = `${process.env.VUE_APP_BASE_URL}/households`;

      const households_url = `${process.env.VUE_APP_BASE_URL}/generateHHCSV`;
  
      onMounted(() => {
        axios
          .get(API_URL, {
            headers: authHeader(),
          })
          .then((response) => {
            console.log(response.data.data);
            dataSource.value = response.data.data;
            // let house_hold_sz = dataSource; 
          })
          .catch((error) => {
            console.error(error);
          });
      });

      const exportHouseHoldData = async () => {
      try {
        const response = await fetch(
          households_url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "households.csv";
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
  
     
  
      const formState = reactive({
        searchItem: "",
      });
  
      // const onSelectChange = (selectedRowKey) => {
      //   selectedRowKeys.value = selectedRowKey;
      // };
  
      // const rowSelection = {
      //   selectedRowKeys,
      //   onChange: onSelectChange,
      // };
  
      return {
        crud,
        isLoading,
        selectedRowKeys,
        // handleDelete,
        // rowSelection,
        // onSelectChange,
        dataSource,
        columns,
        formState,
        exportHouseHoldData
      };
    },
  });
  
  export default ViewPage;
  </script>
  