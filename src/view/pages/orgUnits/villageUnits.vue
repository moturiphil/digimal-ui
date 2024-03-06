<template>
  <RecordViewWrapper>
    <sdPageHeader ghost :title="`${village_name} Villages`">
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" v-if="isAdmin">
        <router-link
          :to="{
            path: `/org-units/import-orgunit/${params.id}`,
            query: { orgtype: 'village' },
          }"
          class="btn-icon"
          type="info"
          shape="circle"
        >
          &nbsp;&nbsp; Import Villages
        </router-link>
      </sdButton>
      <br />
      <br />
      <br />
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
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #units="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/org-units${record.id}/households`,
                              query: { id: record.org_id },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            &nbsp;&nbsp; View HouseHolds
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/org-units/chp/${record.id}`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            View CHP & VE
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          class="button-container"
                          size="extra-small"
                          type="success"
                          @click="openModal(record.org_id)"
                        >
                          Re-assing Village
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- handle transfer of village to a location -->
            <a-modal
              title="Re-assign Village to Sub Location"
              :visible="isModalOpen"
              @cancel="handleCancel"
              width="25%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-record-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleSubmit"
                >
                  <a-form-item name="ward_id" label="Ward">
                    <a-select
                      size="large"
                      name="basic-select"
                      class="sDash_fullwidth-select"
                      placeholder="Select Ward"
                      v-model:value="formState.ward_id"
                    >
                      <a-select-option
                        v-for="location in remap_parent"
                        :value="location.org_id"
                        :key="location.id"
                      >
                        {{ location.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <div class="record-form-actions text-right">
                    <sdButton
                      size="default"
                      htmlType="Save"
                      type="success"
                      :disabled="isSubmitting"
                    >
                      {{
                        isLoading
                          ? "Loading..."
                          : isSubmitting
                            ? "Processing ..."
                            : "Assign"
                      }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
            <!--end of handle transfer of village to a location modal -->
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
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
import { hasRole } from "../../../services/user-role";
import store from "../../../vuex/store";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Village Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Village Code",
    dataIndex: "code",
    key: "name",
  },
  {
    title: "Org ID",
    dataIndex: "org_id",
    key: "org_id",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];

const adminRoles = [53];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const { params, query } = useRoute();
    const searchItem = ref("");
    const reassig_org = ref("");
    const remap_parent = ref([]);
    const isModalOpen = ref(false);
    const village_name = query.name;
    const API_URL = `${process.env.VUE_APP_BASE_URL}`;

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${params.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        dataSource.value = data.message;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

    async function fetchParentChildren() {
      console.log(params.id);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_orgunits_siblings/${params.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.data);
        remap_parent.value = data.data;
        return data.data;
      } catch (error) {
        console.error(error);
        // Handle errors as needed
        throw error;
      }
    }

    fetchParentChildren();

    const formState = reactive({
      parent_id: null,
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

    // Village assignment to Location

    const openModal = (org) => {
      console.log(org);
      reassig_org.value = org;

      isModalOpen.value = true;
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const handleSubmit = () => {
      const data = {
        org_id: reassig_org.value,
        parent_id: formState.ward_id,
      };

      console.log(JSON.stringify(data));

      fetch(`${API_URL}/transfer_org_unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(({ success, data }) => {
          console.log(data);
          if (success == true) {
            store.commit("setIsSubmitting", false);
            notification["success"]({
              message: "Location mapped successfully",
              description: data,
              duration: 5.5,
            });
            isModalOpen.value = false;
            setTimeout(() => location.reload(), 3000);
          }
          // show error message from the api response
          else {
            store.commit("setIsSubmitting", false);
            notification["error"]({
              message: "Error!",
              description: data,
              duration: 5.5,
            });
            isModalOpen.value = false;
          }
        })
        .catch((error) => {
          store.commit("setIsSubmitting", false);
          notification["error"]({
            message: "Error!",
            description: `${error}`,
            duration: 5.5,
          });
        });
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return regex.test(event.name);
        });
      }
    });

    const isAdmin = hasRole(adminRoles);

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      results,
      searchItem,
      params,
      columns,
      isAdmin,
      village_name,
      openModal,
      reassig_org,
      remap_parent,
      handleCancel,
      handleSubmit,
      formState,
      isModalOpen,
    };
  },
});

export default DragAndDropTable;
</script>
