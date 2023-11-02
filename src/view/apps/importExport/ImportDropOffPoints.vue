<template>
    <Main>
      <sdPageHeader title="Import Drop-off Points">
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
        </a-col>
      </a-row>
    </Main>
  </template>
  <script lang="jsx">
  import { Main, ImportStyleWrap } from "../../styled";
  import { message } from "ant-design-vue";
  import { ref, defineComponent } from "vue";
  import authHeader from "../../../services/auth-header";
  
  const Import = defineComponent({
    name: "Import",
    components: { Main, ImportStyleWrap },
    setup() {
      const file = ref(null);
      const list = ref(null);
      const submitValues = ref({});
      const fileUploadProps = {
        name: "csv_file",
        multiple: true,
        customRequest({ file, onSuccess, onError }) {
          const formData = new FormData();
          formData.append("csv_file", file); // Set the key as 'csv_file'
  
          console.log(formData);
  
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
              onSuccess(data, file);
            })
            .catch((error) => {
              onError(error);
            });
        },
  
        onChange(info) {
          const { status } = info.file;
          if (status !== "uploading") {
            file.value = info.file;
            list.value = info.fileList;
          }
          if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
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
      };
    },
  });
  
  export default Import;
  </script>
  