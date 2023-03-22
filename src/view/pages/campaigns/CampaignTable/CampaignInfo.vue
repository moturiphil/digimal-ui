<template>
  <UserTableStyleWrapper>
    <TableWrapper class="table-responsive">
      <a-table
        :rowSelection="rowSelection"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :dataSource="dataSource"
        :columns="columns"
      />
    </TableWrapper>
  </UserTableStyleWrapper>
</template>

<script>
import { UserTableStyleWrapper } from "../style";
import { TableWrapper } from "../../../styled";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  reactive,
} from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../../../src/services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
const columns = [
  {
    title: "Event Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Event Code",
    dataIndex: "event_code",
    key: "id",
  },
  {
    title: "Event Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Event Venue",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
    width: "90px",
  },
];
const EventCampaignTable = defineComponent({
  name: "EventCampaignTable",
  components: { UserTableStyleWrapper, TableWrapper },
  setup() {
    const { state } = useStore();
    const eventData = computed(() => state.crud.data);
    const dataSource = ref([]);
    const selectedRowKeys = ref([]);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/campaign`;
    const route = useRoute();
    const campaignId = reactive({
      value: route.params.id,
    });
    // watch(campaignId, async (newCampaignId) => {
    //   try {
    //     const response = await axios.get(`${API_URL}/${newCampaignId}/events`, {
    //       headers: authHeader(),
    //     });
    //     console.log(response);
    //     dataSource.value = response.data.data;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });
    onMounted(async () => {
      try {
        const response = await axios.get(
          `${API_URL}/${campaignId.value}/events`,
          {
            headers: authHeader(),
          }
        );

        // check if event status == 0  set to inactive else set to active
        // console.log(response.data.data);
        // if (response.data.data.status == 0) {
        //   response.data.data.status = "Inactive";
        // } else {
        //   response.data.data.status = "Active";
        // }
        if (response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            if (element.status === 0) {
              element.status = "Inactive";
            } else if (element.status === 1) {
              element.status = "Active";
            }
          });
        }
        dataSource.value = response.data.data;
      } catch (error) {
        console.error(error);
      }
    });
    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    return {
      columns,
      eventData,
      rowSelection,
      dataSource,
      selectedRowKeys,
      onSelectChange,
    };
  },
});
export default EventCampaignTable;
</script>
