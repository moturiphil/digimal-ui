<template>
  <RecordViewWrapper>
    <sdPageHeader title="Review Excel">
      <template id="buttons"></template>
    </sdPageHeader>
    <sdPageBody>
      <Main>
        <a-row :gutter="16">
          <a-col class="w-100" :md="24">
            <input
              type="file"
              @change="handleFile"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <div v-if="dataSource.length">
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key == 0">
                      <template v-for="(error, index) in errors" :key="index">
                        <template v-if="error.key == record['ID']">
                          <p style="color: red">{{ record["ID"] }}</p>
                        </template>
                      </template>
                    </template>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </a-col>
        </a-row>
      </Main>
    </sdPageBody>
  </RecordViewWrapper>
</template>
<script>
import { notification } from "ant-design-vue";
import { RecordViewWrapper } from "../../pages/style";
import { Main, TableWrapper } from "../../styled";
import { defineComponent, ref } from "vue";
import * as XLSX from "xlsx";
import authHeader from "../../../services/auth-header";
const importExport = defineComponent({
  name: "ReviewExcel",
  components: {
    RecordViewWrapper,
    Main,
    TableWrapper,
  },

  data() {
    const dataSource = ref([]);
    const columns = ref([]);
    let formData = new FormData();
    const handleSubmit = (file) => {
      formData.append("file", file);

      fetch(`${process.env.VUE_APP_BASE_URL}/master-import`, {
        method: "POST",
        headers: {
          ...authHeader(),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then(({ success, message }) => {
          console.log(success, message);
        //   const rs = data.map((item) => {
        //     return `Row No: ${item.row_id} "\n" ${Object.keys(item.row_errors)
        //       .map((key) => item.row_errors[key])
        //       .join("||")}`;
        //   });
          if (success) {
            notification["success"]({
              message: "Success",
              description: `${message}`,
              duration: 5.5,
            });
          } else {
            notification["error"]({
              message: `${message}`,
              description: `${message}`,
              duration: 0,
              style: {
                width: "600px",
              },
            });
          }
        })
        .catch((error) => {
          notification["error"]({
            message: "Error",
            description: `Error: ${error}`,
          });
        });
    };

    const handleFile = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const passedData = XLSX.utils.sheet_to_json(worksheet);
        dataSource.value = passedData;

        const heads = parsedData.shift().map((item, index) => {
          return {
            title: item,
            dataIndex: item,
            key: index,
          };
        });

        const error = [];
        const regex =
          /^(?:254|\+254)?((1|7)(?:(?:[12945][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/;

        passedData.forEach((item) => {
          if (`${item["Phone No."]}`.match(regex) == null) {
            if (!error.find((entry) => entry.key === item["ID"])) {
              error.push({
                key: item["ID"],
                value: [
                  `${item["Phone No."]}` + " is not a valid phone number",
                ],
              });
            } else {
              const existingEntry = error.find(
                (entry) => entry.key === item["ID"]
              );
              existingEntry.value.push(
                `${item["Phone No."]}` + " is not a valid phone number"
              );
            }
          }

          if (
            item["Level (National/County/Sub-county)"] == undefined ||
            item["Gender"] == undefined ||
            item["Organization"] == undefined
          ) {
            if (!error.find((entry) => entry.key === item["ID"])) {
              error.push({
                key: item["ID"],
                value: ["Fill all the required columns"],
              });
            } else {
              const existingEntry = error.find(
                (entry) => entry.key === item["ID"]
              );
              existingEntry.value.push("Fill all the required columns");
            }
          }
        });
        this.errors = error;

        columns.value = heads;
        if (this.errors.length == 0) {
          handleSubmit(file);
        } else {
          const errorDescriptions = this.errors.map((item) => {
            const rawObject = Object.assign({}, item);
            return `${Object.keys(rawObject)
              .map((key) => rawObject[key])
              .join("||")}`;
          });

          notification.error({
            message: "Error",
            description:
              "Error on ID Number:\n" + errorDescriptions.join("\n \n"),
            duration: 0,
            style: {
              width: "600px",
            },
          });
        }
      };

      reader.readAsArrayBuffer(file);
    };

    return {
      handleFile,
      dataSource,
      columns,
      errors: [],
    };
  },
});

export default importExport;
</script>
