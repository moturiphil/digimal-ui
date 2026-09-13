<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ sub_county_name }} Villages
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Sub Counties
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ sub_county_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">CHP &amp; VE</span>
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
                placeholder="Search village by name or code"
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
            <span class="ic"><sdFeatherIcons type="database" size="16" /></span>
            <div>
              <span class="val">{{ sumField("no_of_registered_hh") }}</span>
              <span class="lbl">Households</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="user-plus" size="16" /></span>
            <div>
              <span class="val">{{ sumField("no_of_chp_registered") }}</span>
              <span class="lbl">CHPs</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="user-check" size="16" /></span>
            <div>
              <span class="val">{{ sumField("no_of_ve_registered") }}</span>
              <span class="lbl">VEs</span>
            </div>
          </div>
        </section>

        <!-- Villages list -->
        <section class="panel ou-list-panel">
          <div v-if="villagesLoading" class="ou-loading">
            <a-spin />
          </div>

          <div v-else-if="loadError" class="ou-error">
            <div class="ou-error-icon">
              <sdFeatherIcons type="alert-triangle" size="28" />
            </div>
            <div class="ou-error-title">We could not load the villages</div>
            <div class="ou-error-desc">{{ loadError }}</div>
            <sdButton
              size="extra-small"
              type="primary"
              class="ou-action-btn"
              @click="loadVillages"
            >
              <sdFeatherIcons type="refresh-cw" size="12" /> Retry
            </sdButton>
          </div>

          <div v-else>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ou-table-shell"
            >
              <a-table
                :pagination="{ pageSize: 50, showSizeChanger: true }"
                :dataSource="results"
                :columns="columns"
                row-key="id"
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
                              path: `/org-units/chp/${record.id}`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="12" /> View CHP &amp; VE
                          </router-link>
                        </sdButton>
                        <sdButton
                          size="extra-small"
                          type="light"
                          outlined
                          class="ou-action-btn"
                          @click="openModal(record.id)"
                        >
                          <sdFeatherIcons type="map-pin" size="12" /> Assign Post
                        </sdButton>
                        <sdButton
                          size="extra-small"
                          type="success"
                          class="ou-action-btn"
                        >
                          <router-link
                            :to="{
                              path: `/village-hh/${record.id}`,
                              query: { id: record.id, name: record.name },
                            }"
                          >
                            <sdFeatherIcons type="home" size="12" /> View Households
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>

              <!-- Card view -->
              <div v-else class="ou-card-list">
                <article
                  v-for="record in results"
                  :key="record.id"
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
                      <span class="lbl">Households</span>
                      <span class="val">{{ record.no_of_registered_hh || 0 }}</span>
                    </div>
                    <div>
                      <span class="lbl">CHP(s)</span>
                      <span class="val">{{ record.no_of_chp_registered || 0 }}</span>
                    </div>
                    <div>
                      <span class="lbl">VE(s)</span>
                      <span class="val">{{ record.no_of_ve_registered || 0 }}</span>
                    </div>
                  </div>
                  <div class="ou-card-actions">
                    <sdButton size="extra-small" type="primary" class="ou-action-btn">
                      <router-link
                        :to="{
                          path: `/org-units/chp/${record.id}`,
                          query: { id: record.id },
                        }"
                      >
                        <sdFeatherIcons type="eye" size="12" /> CHP &amp; VE
                      </router-link>
                    </sdButton>
                    <sdButton size="extra-small" type="light" outlined class="ou-action-btn" @click="openModal(record.id)">
                      <sdFeatherIcons type="map-pin" size="12" /> Assign Post
                    </sdButton>
                    <sdButton size="extra-small" type="success" class="ou-action-btn">
                      <router-link
                        :to="{
                          path: `/village-hh/${record.id}`,
                          query: { id: record.id, name: record.name },
                        }"
                      >
                        <sdFeatherIcons type="home" size="12" /> Households
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
            <!-- Assign post -->
          <a-modal
            title="Assign Post"
            :visible="isModalOpen"
            @cancel="handleCancel"
            :width="isMobile ? '90%' : '50%'"
            footer=""
            wrap-class-name="ou-modal-form"
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
                <a-form-item name="Post" label="Select Post">
                  <a-select
                    v-model:value="formState.post_id"
                    show-search
                    option-filter-prop="label"
                    placeholder="Select one"
                    @search="handleSupervisorSearch"
                  >
                    <a-select-option
                      v-for="post in posts"
                      :key="post.id"
                      :value="post.id"
                    >
                      {{ post.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <div class="record-form-actions text-right">
                  <sdButton size="default" htmlType="Save" type="success">
                    {{ isLoading ? "Loading..." : "Submit" }}
                  </sdButton>
                </div>
              </a-form>
            </BasicFormWrapper>
          </a-modal>
          <!-- End of assign post -->
        </BudgetPageWrapper>
      </Main>
    </RecordViewWrapper>
  </template>
<script>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { Switch } from "ant-design-vue";

const columns = [
  {
    title: "Village Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Village Code",
    dataIndex: "code",
    key: "id",
  },
  {
    title: "No of Households",
    dataIndex: "no_of_registered_hh",
    key: "id",
  },
  {
    title: "CHP(s)",
    dataIndex: "no_of_chp_registered",
    key: "id",
  },
  {
    title: "VE(s)",
    dataIndex: "no_of_ve_registered",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, BudgetPageWrapper, TableWrapper },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");
    const { query } = useRoute();
    const router = useRouter();
    const posts = ref([]);
    const village_id = ref("");

    const sub_county_name = query.name;

    const location_id = query.id;
    const isModalOpen = ref(false);

    // Cards/Table view toggle — mirrors the org-units listing pages.
    const viewMode = ref(
      typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
    );

    // Used to make modals full-width on small screens.
    const isMobile = computed(
      () => typeof window !== "undefined" && window.innerWidth <= 767
    );

    const goBack = () => {
      if (window.history.state?.back) {
        router.back();
      } else {
        router.push("/org-units/sub-counties");
      }
    };

    const openModal = async (id) => {
      isModalOpen.value = true;
      village_id.value = id;

      try {
        console.log(village_id.value);
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/location_posts?village_id=${village_id.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );

        if (!response.ok) {
          // Handle error if the response status is not OK
          console.error(`Error: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log(data);

        // Assuming posts is an array, you may need to adjust accordingly
        posts.value = data.data;


        // this.loading = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      }
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    console.log(query);

    // const getPosts = async () => {
    //   const response = await fetch(
    //     `${process.env.VUE_APP_BASE_URL}/sublocation_posts?village_id=${village_id.value}`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         ...authHeader(),
    //       },
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   posts.value = data.post_name;
    //   // this.posts = data.map((post) => ({
    //   //   ...post,
    //   // }));
    //   // this.loading = false;
    // };

    // getPosts();

    const handleSubmit = async () => {
      try {
        const data = {
          post_id: formState.post_id,
          village_id: village_id.value,
        };

        console.log(data);

        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/assign_village_post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(), // Include authentication headers from authHeader()
            },
            body: JSON.stringify(data),
          }
        );

        console.log(response);

        const { success, data: responseData, status } = await response.json();

        if (success) {
          notification.success({
            message: "Success",
            description: responseData,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${status}`,
          });
        }
        isModalOpen.value = false;
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    // Loading + error state for the sub_county_villages fetch (the CRUD store's
    // `isLoading` is unrelated to this request).
    const villagesLoading = ref(true);
    const loadError = ref("");

    const loadVillages = async () => {
      villagesLoading.value = true;
      loadError.value = "";
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/sub_county_villages?subcounty_id=${location_id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );

        if (!response.ok) {
          // Surface whatever the API reported (e.g. its `error` message)
          // instead of a generic message, so failures are explainable.
          const errBody = await response.json().catch(() => null);
          const detail =
            (errBody && (errBody.error || errBody.message)) ||
            `Request failed with status ${response.status}`;
          throw new Error(detail);
        }

        const data = await response.json();

        dataSource.value = data.data || [];
      } catch (error) {
        console.error(error);
        loadError.value =
          error?.message ||
          "The villages for this sub-county could not be fetched right now. Please try again shortly.";
      } finally {
        villagesLoading.value = false;
      }
    };

    onMounted(loadVillages);

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

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      if (!query) {
        return dataSource.value;
      }
      return dataSource.value.filter((user) =>
        `${user.name || ""} ${user.code || ""}`
          .toLowerCase()
          .includes(query)
      );
    });

    // Sum a numeric field across the visible villages (used by the summary strip).
    const sumField = (field) =>
      results.value.reduce((acc, row) => acc + (Number(row[field]) || 0), 0);

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
      isDeactivated: false,
      results,
      searchItem,
      sub_county_name,
      openModal,
      isModalOpen,
      handleCancel,
      handleSubmit,
      posts,
      viewMode,
      isMobile,
      goBack,
      sumField,
      villagesLoading,
      loadError,
      loadVillages,
      // toggleUserStatus /*, deactivate user */,
    };
  },
});

export default DragAndDropTable;
</script>

<style>
/* Friendly error state for the villagers list (e.g. 500 from the API). */
.ou-units-page .ou-error {
  text-align: center;
  padding: 48px 16px;
}
.ou-units-page .ou-error-icon {
  color: #fa8b0c;
  margin-bottom: 8px;
}
.ou-units-page .ou-error-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2437;
  margin-bottom: 4px;
}
.ou-units-page .ou-error-desc {
  font-size: 13px;
  color: #7a8a82;
  max-width: 360px;
  margin: 0 auto 16px;
  line-height: 1.5;
}
</style>
