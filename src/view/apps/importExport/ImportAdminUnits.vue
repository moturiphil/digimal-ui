<template>
  <Main>
    <sdPageHeader title="Import Administrative Units">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <!-- <sdCalendarButton />
          <sdExportButton />
          <sdShareButton />
          <sdButton size="small" type="primary">
            <sdFeatherIcons type="plus" size="14" />
            Add New
          </sdButton> -->
        </div>
      </template>
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :sm="24" :xs="24">
        <ImportStyleWrap>
          <div class="sDash_import-box">
            <a-row :gutter="15">
              <a-col :xs="24">
                <div class="sDash_import-inner">
                  <a-upload-dragger v-bind="fileUploadProps">
                    <p class="ant-upload-drag-icon">
                      <sdFeatherIcons type="upload" size="50" />
                    </p>
                    <sdHeading as="h4" class="ant-upload-text">
                      <span> Drop File</span>
                      <span class="ant-upload-hint">
                        or <span>Browse</span>
                      </span>
                    </sdHeading>
                  </a-upload-dragger>
                </div>
              </a-col>
            </a-row>
          </div>
        </ImportStyleWrap>

        <a-alert
          v-if="resultMessage"
          :type="resultType"
          show-icon
          style="margin-top: 16px"
          :message="resultTitle"
          :description="resultMessage"
        />

        <div v-if="errors.length" class="import-issues">
          <h4 class="import-issues__title">
            {{ errors.length }} problem(s) found in your file
          </h4>
          <p class="import-issues__hint">
            The "Row" column is the line number in your spreadsheet (row 1 is the
            header). Fix the listed rows and columns, save the file and upload it
            again.
          </p>
          <a-table
            :columns="issueColumns"
            :data-source="errors"
            :pagination="false"
            row-key="key"
            size="small"
          />
        </div>

        <div v-if="warnings.length" class="import-issues import-issues--warning">
          <h4 class="import-issues__title">Notes</h4>
          <ul class="import-issues__list">
            <li v-for="(warning, index) in warnings" :key="'warning-' + index">
              <span v-if="warning.row">Row {{ warning.row }}: </span>{{ warning.message }}
            </li>
          </ul>
        </div>

        <a-alert
          type="info"
          show-icon
          style="margin-top: 16px"
          message="Expected file layout"
          description="The importer reads the columns in this order: County, Sub County, Ward, Location, Sub Location, Village, Estimated No. of Households, Population Estimate, Village Code. The Village Code is optional — a unique code is generated automatically when it is blank or already in use."
        />
      </a-col>
    </a-row>
  </Main>
</template>
<script lang="jsx">
import { Main, ImportStyleWrap } from "../../styled";
import { notification } from "ant-design-vue";
import { ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";

const Import = defineComponent({
  name: "Import",
  components: { Main, ImportStyleWrap },
  setup() {
    const file = ref(null);
    const list = ref(null);
    const submitValues = ref({});
    const errors = ref([]);
    const warnings = ref([]);
    const resultType = ref("info");
    const resultTitle = ref("");
    const resultMessage = ref("");

    const issueColumns = [
      { title: "Row", dataIndex: "row", key: "row", width: 90 },
      { title: "Column", dataIndex: "column", key: "column", width: 240 },
      { title: "Value", dataIndex: "value", key: "value", width: 160 },
      { title: "What needs fixing", dataIndex: "message", key: "message" },
    ];

    const resetResult = () => {
      errors.value = [];
      warnings.value = [];
      resultType.value = "info";
      resultTitle.value = "";
      resultMessage.value = "";
    };

    // Show exactly which rows and columns of the uploaded file need fixing.
    const applyResult = (data) => {
      resetResult();

      const failed = !!data && data.success === false;

      resultType.value = failed ? "error" : "success";
      resultTitle.value = failed ? "Import failed" : "Import completed";
      resultMessage.value = (data && data.message) || "";

      errors.value = Array.isArray(data && data.errors)
        ? data.errors.map((issue, index) => ({
            ...issue,
            key: `${issue.row || 0}-${issue.column || ""}-${index}`,
          }))
        : [];

      warnings.value = Array.isArray(data && data.warnings) ? data.warnings : [];

      if (failed) {
        notification.error({
          message: "Import failed",
          description:
            (data && data.message) ||
            "Some rows could not be imported. Check the details on the page.",
          duration: 0,
          style: { width: "600px" },
        });
      } else {
        notification.success({
          message: "Import completed",
          description:
            (data && data.message) || "The file was imported successfully.",
          duration: 5.5,
        });
      }
    };

    const fileUploadProps = {
      name: "csv_file",
      multiple: true,
      customRequest({ file, onSuccess, onError }) {
        const formData = new FormData();
        formData.append("csv_file", file); // Set the key as 'csv_file'

        // Perform the API request with the custom FormData using fetch
        fetch(`${process.env.VUE_APP_BASE_URL}/create/adminunits`, {
          method: "POST",
          headers: {
            ...authHeader(),
          },
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            applyResult(data);
            onSuccess(data, file);
          })
          .catch((error) => {
            resultType.value = "error";
            resultTitle.value = "Upload failed";
            resultMessage.value =
              (error && error.message) || "The file could not be uploaded.";
            onError(error);
          });
      },

      onChange(info) {
        // Result messaging is handled in customRequest so the user sees the
        // real per-row errors returned by the API.
        const { status } = info.file;
        if (status !== "uploading") {
          file.value = info.file;
          list.value = info.fileList;
        }
      },
      listType: "picture",
      defaultFileList: [],
      showUploadList: {
        showRemoveIcon: true,
        removeIcon: (
          <sdFeatherIcons
            type="trash-2"
            onClick={(e) => console.log(e, "custom removeIcon event")}
          />
        ),
      },
    };

    return {
      submitValues,
      fileUploadProps,
      errors,
      warnings,
      issueColumns,
      resultType,
      resultTitle,
      resultMessage,
    };
  },
});

export default Import;
</script>

<style scoped>
.import-issues {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  background: #fff2f0;
}

.import-issues--warning {
  border-color: #ffe58f;
  background: #fffbe6;
}

.import-issues__title {
  margin-bottom: 4px;
}

.import-issues__hint {
  margin-bottom: 12px;
  color: #8c8c8c;
}

.import-issues__list {
  margin: 0;
  padding-left: 18px;
}
</style>
