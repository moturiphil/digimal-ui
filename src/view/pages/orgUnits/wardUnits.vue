<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ sub_county_name }} Wards
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Sub Counties
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ sub_county_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Wards</span>
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
            <span class="ic"><sdFeatherIcons type="map" size="16" /></span>
            <div>
              <span class="val">{{ results.length }}</span>
              <span class="lbl">Wards</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="flag" size="16" /></span>
            <div>
              <span class="val">{{ sub_county_name }}</span>
              <span class="lbl">Parent Sub County</span>
            </div>
          </div>
        </section>

        <!-- Wards list -->
        <section class="panel ou-list-panel">
          <div v-if="isLoading" class="ou-loading">
            <a-spin />
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
                            path: `/org-units/locations/${record.org_id}`,
                            query: { name: record.name },
                          }"
                        >
                          <sdFeatherIcons type="eye" size="12" /> View Locations
                        </router-link>
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
                    <span class="lbl">Ward Code</span>
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
                        path: `/org-units/locations/${record.org_id}`,
                        query: { name: record.name },
                      }"
                    >
                      <sdFeatherIcons type="eye" size="12" /> Locations
                    </router-link>
                  </sdButton>
                </div>
              </article>
              <div v-if="!results.length" class="ou-empty">
                No wards found.
              </div>
            </div>
          </div>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Ward Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Ward Code",
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
const isLoading = ref(true);
const dataSource = ref([]);
const { params, query } = useRoute();
const searchItem = ref("");
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);
const router = useRouter();
const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push({ path: `/org-units/sub-counties/${params.id}` });
  }
};
const sub_county_name = query.name;
console.log(query);
onMounted(async () => {
  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
});

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
</script>
