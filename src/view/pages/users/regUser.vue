<template>
  <RecordViewWrapper>
    <sdPageHeader title="Users">
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
                <sdButton class="btn-export" @click="showModal" type="success">
                  Export
                </sdButton>
                <sdModal
                  title="Export File"
                  wrapclass="sDash_export-wrap"
                  :visible="isModalVisible"
                  :footer="null"
                  :onCancel="handleCancel"
                  class="export-modal"
                >
                  <a-form name="contact">
                    <a-form-item name="f_name">
                      <a-input
                        placeholder="File Name"
                        v-model:value="fileName"
                        @change="updateFileName"
                      />
                    </a-form-item>
                    <a-form-item name="f_type">
                      <a-select default-value="xlxs" @change="updateFileType">
                        <!-- <a-select-option value="csv">CSV</a-select-option> -->
                        <a-select-option value="xlxs">xlxs</a-select-option>
                      </a-select>
                    </a-form-item>
                    <div class="sDash-button-grp">
                      <!-- <CSVLink v-if="convertedTo === 'csv'" :filename="`${fileName}.csv`" :data="csvJsonData">
                        <sdButton @click="handleCancel" class="btn-export" type="primary">
                          Export
                        </sdButton>
                      </CSVLink> -->

                      <sdButton
                        class="btn-export"
                        @click="() => exportToXLSX(csvData, fileName)"
                        type="primary"
                      >
                        Export
                      </sdButton>

                      <sdButton
                        htmlType="button"
                        @click="handleCancel"
                        size="default"
                        type="light"
                        outlined
                      >
                        Cancel
                      </sdButton>
                    </div>
                  </a-form>
                </sdModal>
                <br />
                <br />
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
import UserService from "../../../services/user.service";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


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
    const showModal = () => {
      isModalVisible.value = true;
    };
    const isModalVisible = ref(false);
    const fileName = ref("DigiMal Users");
    const convertedTo = ref("csv");

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

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const xlsxExtension = ".xlsx";

    const exportToXLSX = (inputData, fileName) => {
      const ws = XLSX.utils.json_to_sheet(inputData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + xlsxExtension);
      isModalVisible.value = false;
    };

    const updateFileName = (e) => {
      fileName.value = e.target.value;
    };
    const updateFileType = (value) => {
      convertedTo.value = value;
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
      showModal,
      exportToXLSX,
      updateFileName,
      updateFileType,
      fileType,
      xlsxExtension,
    };
  },
});

export default DragAndDropTable;
</script>
