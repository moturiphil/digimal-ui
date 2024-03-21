<template>
  <RecordViewWrapper>
    <sdPageHeader title="Distribution Posts Summary">
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
            placeholder="Search by name/code/supervisor"
          />
        </div>
      </template>
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
                <h3 style="display: inline;margin-right: 10%;">Distribution Post Worker Summary</h3>
                <h3 style="display: inline;"><span style="margin: 2%;">Total Served:<strong>{{ total_summary.total_count }}</strong></span> <span>Total Nets:<strong>{{ total_summary.total_nets }}</strong></span></h3>
                <a-table :pagination="true" :dataSource="formattedPostWorkers" :columns="columns">
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
import { useStore } from "vuex";
import { computed, onMounted, ref, defineProps } from "vue";
//import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

const props = defineProps({
  post_id: Number,
});
const columns = [
{
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Issue date",
    dataIndex: "issue_date",
    key: "issue_date",
  },
  {
    title: "Total Households Served",
    dataIndex: "total_households_served",
    key: "total_households_served",
  },
  {
    title: "Total Nets",
    dataIndex: "total_nets",
    key: "total_nets",
  },
];

const { state } = useStore();
// const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const dataSource = ref([]);
const total_summary=ref({
  total_count:0,
  total_nets:0,
})
const searchItem = ref("");

//org levels
const access_level = ref({});
onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    fetchDistributionsPostsWorkerSummary();
  }
});

const fetchDistributionsPostsWorkerSummary = async () => {
  try {
    const response = await axios.get(
      `post_worker_summary?post_id=${props.post_id}`
    );
    const data = await response.data.data;
    dataSource.value = [];
    dataSource.value=data.post_workers.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    total_summary.value=data.total_summary?data.total_summary:{total_count:0,total_nets:0,};
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
};
// Format workers array
const formattedPostWorkers = computed(() => {
  const formatted = [];
      let prevName = '';
      let prevRole='';
      dataSource.value.forEach(worker => {
        if (worker.name === prevName && worker.role===prevRole) {
          formatted.push({
            ...worker,
            name: '',
            role:'',
          });
        } else {
          formatted.push(worker);
          prevName = worker.name;
          prevRole=worker.role;
        }
      });
      return formatted;
});
</script>
