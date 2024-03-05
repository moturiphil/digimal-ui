<template>
  <RecordViewWrapper>
    <sdPageHeader   ghost :title="`${ward_name} Locations`">
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
            query: { orgtype: 'location' },
          }"
          class="btn-icon"
          type="info"
          shape="circle"
        >
          &nbsp;&nbsp; Import Locations
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
                              path: `/org-units/sub-locations/${record.org_id}`,
                              query: {
                                name: record.name
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            &nbsp;&nbsp; View Sub-Locations
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          class="button-container"
                          size="extra-small"
                          type="success"
                          @click="openModal(record.org_id)"
                        >
                          Re-assing Location
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <a-modal
              title="Re-assign Location to Ward"
              :visible="isModalOpen"
              @cancel="handleCancel"
              width="50%"
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
                      <a-select-option value=""
                        >Select an option</a-select-option
                      >
                      <a-select-option
                        v-for="ward in remap_parent"
                        :value="ward.org_id"
                        :key="ward.id"
                      >
                        {{ ward.name }}
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
// import axios from "axios";
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
import { hasRole } from "../../../services/user-role";
import { notification } from "ant-design-vue";
import store from "../../../vuex/store";

const columns = [
  //   {
  //     title: "Id",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  {
    title: "Location Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Location Code",
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

const adminRoles = [53, 56];

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
    const isModalOpen = ref(false);
    const API_URL = `${process.env.VUE_APP_BASE_URL}`;
    const remap_parent = ref([]);
    const reassig_org = ref("");

    const ward_name = query.name
    console.log(params);

    // Define a function to fetch data
    async function fetchOrgChildren(params) {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${params.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        return data.message;
      } catch (error) {
        console.error(error);
        // Handle errors as needed
        throw error;
      }
    }

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

    // Use onMounted to call the fetchData function
    onMounted(async () => {
      try {
        const data = await fetchOrgChildren(params);
        console.log(data);
        dataSource.value = data;
        console.log(dataSource.value);
      } catch (error) {
        // Handle errors if necessary
        console.error(error);
      }
    });

    const formState = reactive({
      parent_id: null,
    });

    const openModal = (org) => {
      console.log(org);
      reassig_org.value = org;

      isModalOpen.value = true;
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

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

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      results,
      params,
      searchItem,
      columns,
      isAdmin,
      openModal,
      isModalOpen,
      handleCancel,
      formState,
      handleSubmit,
      remap_parent,
      ward_name,
    };
  },
});

export default DragAndDropTable;
</script>
