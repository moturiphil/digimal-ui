<template>
  <sdPageHeader title="Export">
    <template v-slot:buttons>
      <div class="page-header-actions">
        <!-- <sdCalendarButton />
        <sdExportButton />
        <sdShareButton /> -->
        <!-- <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton> -->
      </div>
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
              <!-- <a-table
                :rowSelection="rowSelection"
                :dataSource="usersTableData"
                :columns="usersTableColumns"
                :pagination="{
                  defaultPageSize: 7,
                  total: usersTableData.length,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }"
              /> -->
              <a-table
                :rowSelection="rowSelection"
                :pagination="{ pageSize: 10, showSizeChanger: true }"
                :dataSource="dataSource"
                :columns="columns"
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


const Import = {
  name: "Import",
  components: { Main, ExportStyleWrap },
  setup() {
    const { state, dispatch } = useStore();
    const users = computed(() => state.contact.data);
    const isModalVisible = ref(false);
    const fileName = ref("strikingDash");
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
    const csvData = [["id", "name", "email", "company", "joining", "position"]];
    const csvJsonData = [
      {
        id: "id",
        name: "name",
        email: "email",
        company: "company",
        joining: "joining",
        position: "position",
      },
    ];
    const usersTableData = computed(() =>
      users.value
        .sort((a, b) => {
          return b.time - a.time;
        })
        .map((user) => {
          const { id, name, designation, email, joining, company } = user;
          return {
            key: id,
            user: name,
            email,
            company,
            joining: joining,
            position: designation,
          };
        })
    );

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

    const rowSelection = {
      onChange: (keys, rows) => {
        selectedRowKeys.value = keys;
        selectedRows.value = rows;
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

        // console.log(updatedData);

        dataSource.value = updatedData;
      } catch (error) {
        console.error(error);
      }
    });

    watchEffect(() => {
      selectedRows.value.map((member) => {
        const { key, user, position, email, company } = member;
        csvJsonData.push({ id: key, name: user, email, company, position });
        return csvData.push([key, user, email, company, position]);
      });
    });

    return {
      columns,
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
