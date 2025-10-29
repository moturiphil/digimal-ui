<template>
  <div v-if="isLoading" class="spin">
    <a-spin />
  </div>
  <div v-else>
    <TableWrapper class="table-data-view table-responsive">
      <a-table
        :pagination="true"
        :dataSource="returnedNets"
        :columns="returns_columns"
      >
      </a-table>
    </TableWrapper>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref, defineProps } from "vue";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
const returnedNets = ref([]);
const props = defineProps({
  post_id: Number,
});
const returns_columns = [
  {
    title: "From Post",
    dataIndex: "post_name",
    key: "id",
  },
  {
    title: "To Dropoff",
    dataIndex: "dropoff_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date Returned",
    dataIndex: "date_returned",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
    slots: { customRender: "status" },
  },
];

const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
onMounted(async () => {
  fetchReturnedNets();
});

const fetchReturnedNets = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/dropoff_returns_by_post/${props.post_id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          console.log(data);
          returnedNets.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};
</script>
