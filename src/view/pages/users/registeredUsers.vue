<template>
  <sdPageHeader title="Export">
    <template v-slot:buttons>
      <!-- <div class="page-header-actions">
        <sdCalendarButton />
        <sdExportButton />
        <sdShareButton />
        <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton>
      </div> -->
    </template>
  </sdPageHeader>
  <Main>
    <a-row :gutter="25">
      <a-col :sm="24" :xs="24">
        <ExportStyleWrap>
          <sdCards headless>
            <div class="sDash_export-box">
              <template v-if="selectedRows.length">
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
                        type="success"
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
              </template>

              <sdButton
                v-else
                class="btn-export"
                @click="warning"
                type="success"
              >
                Export
              </sdButton>
              <sdButton class="btn-import" type="success">
                <router-link
                  :to="{
                    path: `/users/import`
                  }"
                  class="btn-icon"
                  type="info"
                  shape="circle"
                >
                  <!-- <sdFeatherIcons type="eye" size="16" /> -->
                  &nbsp;&nbsp; Import Master List
                </router-link>
              </sdButton>

              <a-input
                v-model:value="searchData"
                @change="handleSearch"
                placeholder="Search by Name"
              >
                <template #prefix>
                  <sdFeatherIcons type="search" size="14" />
                </template>
              </a-input>
            </div>
            <div
              class="sDash_export-file-table table-bordered table-responsive"
            >
              <a-table
                :rowSelection="rowSelection"
                :dataSource="usersTableData"
                :columns="usersTableColumns"
                :pagination="{
                  defaultPageSize: 7,
                  total: usersTableData.length,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }"
              />
            </div>
          </sdCards>
        </ExportStyleWrap>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Main, ExportStyleWrap } from "../../styled";
import { useStore } from "vuex";
import { computed, ref, watchEffect, onMounted } from "vue";
import { Modal } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
// import UserService from "../../../services/user.service";

const Import = {
  name: "Import",
  components: { Main, ExportStyleWrap },
  setup() {
    const { dispatch } = useStore();
    // const users = computed(() => state.contact.data);
    const isModalVisible = ref(false);
    const fileName = ref("DigiMal Ke Users");
    const convertedTo = ref("csv");
    const selectedRowKeys = ref(0);
    const selectedRows = ref([]);
    const searchData = ref("");
    const dataSource = ref([]);

    const showModal = () => {
      isModalVisible.value = true;
    };

    const handleCancel = () => {
      isModalVisible.value = false;
    };

    const handleSearch = () => {
      dispatch("contactSearchData", searchData.value);
    };
    const csvData = [
      [
        "first_name",
        "middle_name",
        "last_name",
        "level_id",
        "org_types_id",
        "role_id",
        "phone_no",
      ],
    ];
    const csvJsonData = [
      {
        first_name: "first_name",
        middle_name: "middle_name",
        last_name: "last_name",
        level_id: "level_id",
        org_types_id: "org_types_id",
        role_id: "role_id",
        phone_no: "phone_no",
      },
    ];
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
    // console.log(data);
    const usersTableData = computed(() =>
      dataSource.value
        .sort((a, b) => {
          return b.time - a.time;
        })
        .map((user) => {
          // console.log(user);
          const {
            first_name,
            middle_name,
            last_name,
            level_id,
            org_types_id,
            role_id,
            phone_no,
          } = user;
          return {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            org_types_id: org_types_id,
            level_id: level_id,
            role_id: role_id,
            phone_no: phone_no,
          };
        })
    );

    const usersTableColumns = [
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

    const rowSelection = {
      // selectedRows,
      onChange: (keys, rows) => {
        selectedRowKeys.value = keys;
        selectedRows.value = rows;
        // selectedRows.value = selectedRows;
      },

      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };

    const warning = () => {
      Modal.warning({
        title: "Please Select your Required Rows!",
      });
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

    watchEffect(() => {
      selectedRows.value.map((member) => {
        console.log(member);
        const {
          first_name,
          middle_name,
          last_name,
          level_id,
          org_types_id,
          role_id,
          phone_no,
        } = member;
        csvJsonData.push({
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          level_id,
          org_types_id,
          role_id,
          phone_no,
        });
        return csvData.push([
          first_name,
          middle_name,
          last_name,
          level_id,
          org_types_id,
          role_id,
          phone_no,
        ]);
      });
    });

    return {
      usersTableColumns,
      exportToXLSX,
      updateFileName,
      updateFileType,
      fileType,
      xlsxExtension,
      rowSelection,
      warning,
      usersTableData,
      handleSearch,
      searchData,
      handleCancel,
      showModal,
      fileName,
      convertedTo,
      selectedRowKeys,
      selectedRows,
      isModalVisible,
      csvData,
      csvJsonData,
    };
  },
};

export default Import;
</script>
