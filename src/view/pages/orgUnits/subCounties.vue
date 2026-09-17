<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ county_name }} Sub Counties
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Counties
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ county_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Sub Counties</span>
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
            <span class="ic"><sdFeatherIcons type="map-pin" size="16" /></span>
            <div>
              <span class="val">{{ dataSource.length }}</span>
              <span class="lbl">Sub Counties</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="flag" size="16" /></span>
            <div>
              <span class="val">{{ county_name }}</span>
              <span class="lbl">Parent County</span>
            </div>
          </div>
        </section>

        <!-- Sub-counties list -->
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
                :dataSource="dataSource"
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
                            path: `/org-units/wards/${record.org_id}`,
                            query: { name: record.name },
                          }"
                        >
                          View Wards
                        </router-link>
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="success"
                        class="ou-action-btn"
                      >
                        <router-link
                          :to="{
                            path: `/sub-county-units/chp-ve/${record.org_id}`,
                            query: {
                              name: record.name,
                              id: record.id,
                            },
                          }"
                        >
                          View Villages
                        </router-link>
                      </sdButton>
                      <sdButton
                        @click="handleDistributionDates()"
                        size="extra-small"
                        type="warning"
                        class="ou-action-btn"
                      >
                        Start Distribution
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
      <div v-else class="ou-card-list">
              <article
                v-for="record in dataSource"
                :key="record.org_id"
                class="ou-card"
              >
                <div class="ou-card-head">
                  <div class="ou-card-title">{{ record.name }}</div>
                  <span class="ou-card-code">{{ record.code }}</span>
                </div>
                <div class="ou-card-meta">
                  <div>
                    <span class="lbl">Sub County Code</span>
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
                        path: `/org-units/wards/${record.org_id}`,
                        query: { name: record.name },
                      }"
                    >
                      Wards
                    </router-link>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="success"
                    class="ou-action-btn"
                  >
                    <router-link
                      :to="{
                        path: `/sub-county-units/chp-ve/${record.org_id}`,
                        query: {
                          name: record.name,
                          id: record.id,
                        },
                      }"
                    >
                      Villages
                    </router-link>
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ou-empty">
                No sub counties found.
              </div>
            </div>
          </div>
        </section>

        <!-- start Distribution Modal -->
        <a-modal
          title="Start SubCounty Distribution"
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
              <a-form-item name="start_date" label="Distribution Start Date">
                <a-date-picker
                  :style="{ width: '100%' }"
                  v-model:value="formState.start_date"
                  :format="dateFormat"
                  :disabledDate="disabledStartDate"
                />
              </a-form-item>
              <a-form-item name="end_date" label="Distribution End Date">
                <a-date-picker
                  :style="{ width: '100%' }"
                  v-model:value="formState.end_date"
                  :format="dateFormat"
                  :disabledDate="disabledEndDate"
                />
              </a-form-item>
              <div class="record-form-actions text-right">
                <sdButton size="small" htmlType="Save" type="success">
                  {{ isLoading ? "Loading..." : "Submit" }}
                </sdButton>
              </div>
            </a-form>
          </BasicFormWrapper>
        </a-modal>
        <!-- start Distribution Modal -->
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Sub County Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Sub County Code",
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
    router.push({ path: "/org-units/view" });
  }
};
const county_name = query.name;
let isModalOpen = ref(false);
const isLoading = ref(true);

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
    dataSource.value = data.message;
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const handleDistributionDates = () => {
  isModalOpen.value = true;
};
const formState = reactive({
  start_date: "",
  end_date: "",
});

const handleSubmit = async () => {
  console.log('handling submit form');
  try {
    const data = {
      start_date: formState.start_date,
      end_date: formState.end_date,
    };
    console.log(data);

    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}subcounty/start/distribution`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    const { status, data: responseData } = result;

    if (status === true) {
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
      isModalOpen.value = false;
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};
const handleCancel = () => {
  isModalOpen.value = false;
};
</script>
