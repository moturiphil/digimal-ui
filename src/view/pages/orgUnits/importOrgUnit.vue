<template>
    <Main>
      <sdPageHeader :title="title__">
      </sdPageHeader>
      <a-row :gutter="25">
        <a-col :sm="24" :xs="24">
            <div class="sDash_import-box">
              <a-row :gutter="15">
                <a-col :xs="24">
                  <RecordFormWrapper>
                  <sdCards headless>
                    <a-row justify="center">
                      <a-col :xl="10" :md="16" :xs="24">
                        <BasicFormWrapper>
                          <a-form 
                          class="add-record-form"
                          :style="{ width: '100%' }"
                          layout="vertical"
                          name="addnew"
                          @submit="handleSubmit"
                          >
                            <a-form-item name="file" label="Upload file">
                              <a-input
                                type="file"
                                @change="handleFileUpload"
                                placeholder="Enter Location name"
                              />
                            </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton size="default" htmlType="Save" type="success">
                                  Submit
                                  <!-- {{ isLoading ? "Loading..." : "Submit" }} -->
                                </sdButton>
                              </div>
                          </a-form>
                        </BasicFormWrapper>
                      </a-col>

                    </a-row>
                  </sdCards>
                  </RecordFormWrapper>
                  
                </a-col>
              </a-row>
            </div>
        </a-col>
      </a-row>
    </Main>
  </template>
  <script lang="jsx">
  import { RecordFormWrapper } from "./style";
  import { Main,BasicFormWrapper, } from "../../styled";
  import { message } from "ant-design-vue";
  import { ref, defineComponent } from "vue";
  import { useRoute } from "vue-router";
  import authHeader from "../../../services/auth-header";
  import { notification } from "ant-design-vue";


  const importOrgUnit = defineComponent({
    name: "Import",
    components: { Main, RecordFormWrapper, BasicFormWrapper },
    data() {
      const file = ref(null);
      const list = ref(null);
      const submitValues = ref({});
      const { params, query } = useRoute();
      let formData = new FormData();
      const API_URL = `${process.env.VUE_APP_BASE_URL}/ouCreation`;
      const title__ = `Import ${query.orgtype}`

      const handleFileUpload=(event)=> {
        this.file = event.target.files[0];
      };

      const fileUploadProps = {
        name: "file",
        multiple: false,
        action: API_URL,
        authHeader,
        onChange(info) {
          const { status } = info.file;
          console.log(status);
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
          // removeIcon: <sdFeatherIcons type="trash-2" onClick={(e) => console.log(e, 'custom removeIcon event')} />,
        },
      };

      const handleSubmit = (values) => {
        console.log(values);
        formData.append("parent_id", params.id);
        formData.append("file", this.file);
        formData.append("unit", query.orgtype);

        console.log(formData);

      fetch(API_URL, {
        method: "POST",
        headers: {
          ...authHeader(),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then(({ success }) => {
          if (success) {
            // router.push("activity-view");
            notification["success"]({
              message: `${query.orgtype} created successfully`,
              description: `${query.orgtype} created successfully`, //${data.activity_code}
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
       
      };
  
      return {
        submitValues,
        fileUploadProps,
        title__,
        handleSubmit,
        handleFileUpload
      };
    },
  });
  
  export default importOrgUnit;
  </script>
  