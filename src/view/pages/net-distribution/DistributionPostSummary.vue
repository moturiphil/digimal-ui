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
                <a-table :pagination="true" :dataSource="dataSource" :columns="columns">
                </a-table>
              </TableWrapper>
            </div>
            <!-- Assign supervisor -->
            <a-modal
              title="Assign Supervisor"
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
                  <a-form-item name="Supervisors" label="Select Supervisor">
                    <a-select
                      v-model:value="formState.user_id"
                      show-search
                      option-filter-prop="label"
                      placeholder="Select one"
                    >
                      <a-select-option
                        v-for="user in supervisors"
                        :key="user.id"
                        :value="user.id"
                        :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`"
                      >
                        {{ user.first_name }} {{ user.last_name }} {{ user.other_name }} -
                        {{ user.id_no }},{{ user.role_id }}, {{ user.location_id }}
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
            <!-- End of assign supervisor -->
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
console.log(props);
const columns = [
  {
    title: "Nets Ordered",
    dataIndex: "nets_ordered",
    key: "nets_ordered",
  },
  {
    title: "Nets Supplied",
    dataIndex: "nets_supplied",
    key: "nets_supplied",
  },
  {
    title: "Nets Received",
    dataIndex: "nets_received",
    key: "nets_received",
  },
  {
    title: "Nets Distributed",
    dataIndex: "nets_distributed",
    key: "nets_distributed",
  },
  {
    title: "Nets Balance",
    dataIndex: "undistributed_nets_balance",
    key: "undistributed_nets_balance",
  },
  {
    title: "Households Registered",
    dataIndex: "households_registered",
    key: "households_registered",
  },
  {
    title: "Households Served",
    dataIndex: "households_served",
    key: "households_served",
  },
  {
    title: "Households Served",
    dataIndex: "unserved_households",
    key: "unserved_households",
  },
];

const { state } = useStore();
// const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const dataSource = ref([]);
const supervisors = ref([]);
const searchItem = ref("");
const isModalOpen = ref(false);

//org levels
const access_level = ref({});
onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    fetchDistributionsPostsSummary();
    //filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    // console.log(JSON.stringify(access_level.value.location));
  }
});
const fetchDistributionsPostsSummary = async () => {
  try {
    const response = await axios.get(
      `nets_received_distributed_hh_post?post_id=${props.post_id}`
    );
    const data = await response.data;
    dataSource.value = [];
    dataSource.value.push(data);
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
};
</script>
