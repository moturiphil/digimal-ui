<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ village_name }} Villages
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Sub Locations
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ village_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Villages</span>
            </div>
          </div>
          <div class="ph-actions">
            <div class="ou-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by name"
                allow-clear
              />
            </div>
            <div class="ou-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Summary strip -->
        <section class="panel ou-stats">
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="home" size="16" /></span>
            <div>
              <span class="val">{{ results.length }}</span>
              <span class="lbl">Villages</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="flag" size="16" /></span>
            <div>
              <span class="val">{{ village_name }}</span>
              <span class="lbl">Parent Sub Location</span>
            </div>
          </div>
        </section>

        <!-- Villages list -->
        <section class="panel ou-list-panel">
          <div v-if="isLoading" class="ou-loading">
            <a-spin />
          </div>

          <div v-else>
            <div class="ou-toolbar" v-if="isAdmin">
              <sdButton type="success" class="ou-action-btn">
                <router-link
                  :to="{
                    path: `/org-units/import-orgunit/${params.id}`,
                    query: { orgtype: 'village' },
                  }"
                >
                  <sdFeatherIcons type="download" size="12" /> Import Villages
                </router-link>
              </sdButton>
            </div>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ou-table-shell"
            >
              <a-table
                :pagination="{ pageSize: 50, showSizeChanger: true }"
                :dataSource="results"
                :columns="columns"
                row-key="org_id"
              >
                <template #units="{ record }">
                  <td>
                    <div class="table-actions">
                      <sdButton
                        size="extra-small"
                        type="primary"
                        class="ou-action-btn"
                      >
                        <router-link
                          :to="{
                            path: `/village-hh/${record.id}`,
                            query: {
                              id: record.id,
                              name: record.name,
                              org_id: params.id,
                            },
                          }"
                        >
                          <sdFeatherIcons type="home" size="12" /> View Households
                        </router-link>
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="success"
                        class="ou-action-btn"
                      >
                        <router-link
                          :to="{
                            path: `/org-units/chp/${record.id}`,
                            query: { id: record.id },
                          }"
                        >
                          View CHP & VE
                        </router-link>
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="light"
                        class="ou-action-btn"
                        @click="openModal(record.org_id)"
                      >
                        Re-assign Village
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
            <div v-else class="ou-card-list">
              <article
                v-for="record in results"
                :key="record.org_id"
                class="ou-card"
              >
                <div class="ou-card-head">
                  <div class="ou-card-title">{{ record.name }}</div>
                  <span class="ou-card-code">{{ record.code }}</span>
                </div>
                <div class="ou-card-meta">
                  <div>
                    <span class="lbl">Village Code</span>
                    <span class="val">{{ record.code || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Org ID</span>
                    <span class="val">{{ record.org_id || "—" }}</span>
                  </div>
                </div>
                <div class="ou-card-actions">
                  <sdButton
                    size="extra-small"
                    type="primary"
                    class="ou-action-btn"
                  >
                    <router-link
                      :to="{
                        path: `/village-hh/${record.id}`,
                        query: {
                          id: record.id,
                          name: record.name,
                          org_id: params.id,
                        },
                      }"
                    >
                      <sdFeatherIcons type="home" size="12" /> Households
                    </router-link>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="success"
                    class="ou-action-btn"
                  >
                    <router-link
                      :to="{
                        path: `/org-units/chp/${record.id}`,
                        query: { id: record.id },
                      }"
                    >
                      CHP & VE
                    </router-link>
                  </sdButton>
                </div>
              </article>
              <div v-if="!results.length" class="ou-empty">
                No villages found.
              </div>
            </div>
          </div>
        </section>

        <!-- handle transfer of village to a sub location -->
        <a-modal
          title="Re-assign Village to Sub Location"
          :visible="isModalOpen"
          @cancel="handleCancel"
          width="25%"
          footer=""
        >
          <BasicFormWrapper>
            <a-form
              class="add-record-form ou-modal-form"
              :style="{ width: '100%' }"
              layout="vertical"
              name="addnew"
              :model="formState"
              @finish="handleSubmit"
            >
              <a-form-item name="ward_id" label="Sub Location">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Sub Location"
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
        <!--end of handle transfer of village to a sub location modal -->
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, defineComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
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
  components: { RecordViewWrapper, Main, BudgetPageWrapper, TableWrapper },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const { params, query } = useRoute();
    const router = useRouter();
    const searchItem = ref("");
    const viewMode = ref(
      typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
    );
    const goBack = () => {
      if (window.history.state?.back) {
        router.back();
      } else {
        router.push({ path: `/org-units/sub-locations/${params.id}` });
      }
    };
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
      viewMode,
      goBack,
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
