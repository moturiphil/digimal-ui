<template>
  <RecordViewWrapper>
    <sdPageHeader ghost :title="`${sub_county_name} Wards`">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
      </template>
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
                              path: `/org-units/locations/${record.org_id}`,
                              query: { name: record.name },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="16" />
                            &nbsp;&nbsp; View Locations
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
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
