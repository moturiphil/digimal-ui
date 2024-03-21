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
                <h3>Distribution Summary</h3>
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
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>
            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <h3 style="">
                  Total Pending Distribution <strong>{{ pending_hh_count }}</strong>
                </h3>
                <a-table
                  :pagination="true"
                  :dataSource="pending_hh_data"
                  :columns="pending_hh_cols"
                >
                  <template #phone_no="{ record }">
                    <div>
                      {{
                        `${record.hh_phone_number.substring(0, 2)}${"*".repeat(
                          record.hh_phone_number.length - 4
                        )}${record.hh_phone_number.substring(
                          record.hh_phone_number.length - 2
                        )}`
                      }}
                    </div>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>
            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <h3 style="">
                  Total Households Served <strong>{{ served_hh_count }}</strong>
                </h3>
                <a-table
                  :pagination="true"
                  :dataSource="pending_hh_data"
                  :columns="served_hh_cols"
                >
                  <template #phone_no="{ record }">
                    <div>
                      {{
                        `${record.hh_phone_number.substring(0, 2)}${"*".repeat(
                          record.hh_phone_number.length - 4
                        )}${record.hh_phone_number.substring(
                          record.hh_phone_number.length - 2
                        )}`
                      }}
                    </div>
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
import { useStore } from "vuex";
import { computed, onMounted, ref, defineProps } from "vue";
//import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

const props = defineProps({
  post_id: Number,
});
const pending_hh_cols = ref([
  {
    title: "ID",
    dataIndex: "hh_id",
    key: "hh_id",
  },
  {
    title: "Phone Number",
    dataIndex: "hh_phone_number",
    key: "hh_phone_number",
    slots: { customRender: "phone_no" },
  },
  {
    title: "Name",
    dataIndex: "hh_name",
    key: "hh_name",
  },
]);
const served_hh_cols = ref([
  {
    title: "ID",
    dataIndex: "hh_id",
    key: "hh_id",
  },
  {
    title: "Phone Number",
    dataIndex: "hh_phone_number",
    key: "hh_phone_number",
    slots: { customRender: "phone_no" },
  },
  {
    title: "Name",
    dataIndex: "hh_name",
    key: "hh_name",
  },
]);
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
    title: "Unserved Households Served",
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
const pending_hh_data = ref([]);
const pending_hh_count = ref(0);
const served_hh_count=ref(0);
const searchItem = ref("");
const isModalOpen = ref(false);

//org levels
const access_level = ref({});
onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    fetchDistributionsPostsSummary();
    fetchPendingHHData();
    fetchServedHHData();
  }
});
const fetchServedHHData = async () => {
  try {
    const response = await axios.get(
      `hh_per_post_served?post_id=${props.post_id}`
    );
    const data = await response.data;
    pending_hh_data.value = data.households;
    served_hh_count.value = data.served_hh_count || 0;
  } catch (error) {
    console.error(error);
  }
};
const fetchPendingHHData = async () => {
  try {
    const response = await axios.get(
      `hh_per_post_pending_collection?post_id=${props.post_id}`
    );
    const data = await response.data;
    pending_hh_data.value = data.households;
    pending_hh_count.value = data.hh_pending_count || 0;
  } catch (error) {
    console.error(error);
  }
};
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
