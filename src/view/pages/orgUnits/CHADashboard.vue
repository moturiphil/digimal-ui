<template>
  <a-layout class="layout">
    <a-layout-header>
      <h3
        class="sd-page-header"
        :style="{
          color: '#000000',
          lineHeight: '64px',
          margin: '0 24px',
          fontSize: '1.5rem',
        }"
      >
        Sub-Location Supervisor Dashboard
      </h3>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="horizontal"
        :style="{
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid #1ec997',
        }"
      >
        <a-menu-item
          key="1"
          @click="selectMenuItem('1')"
          :style="{ color: selectedKeys[0] === '1' ? '#1ec997' : '' }"
          >Distribution Post</a-menu-item
        >
        <a-menu-item
          key="2"
          @click="selectMenuItem('2')"
          :style="{ color: selectedKeys[0] === '2' ? '#1ec997' : '' }"
          >Villages</a-menu-item
        >
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0"> </a-breadcrumb>
      <br />
      <br />
      <br />
      <div
        :style="{ background: '#FFFFFF', padding: '24px', minHeight: '280px' }"
      >
        <template v-if="selectedKeys[0] === '1'">
          <h2>Distribution Posts</h2>
          <!-- <a-table :columns="transfersColumns" :data-source="transfersData" /> -->
          <div class="table-responsive">
            <a-table
              :columns="transfersColumns"
              :data-source="transfersData"
              :scroll="{ x: 'max-content' }"
            />
          </div>
        </template>
        <template v-else-if="selectedKeys[0] === '2'">
          <h2>Villages</h2>
          <!-- <a-table :columns="villagesColumns" :data-source="villagesData" /> -->
          <div class="table-responsive">
            <a-table
              :columns="villagesColumns"
              :data-source="villagesData"
              :scroll="{ x: 'max-content' }"
            />
          </div>
        </template>
      </div>
      <br />
      <br />
      <br />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
//   import { fetchData } from "@/api"; // Replace with your actual API module

const selectedKeys = ref(["2"]);

const transfersColumns = ref([
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
    slots: { customRender: "status" },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
]);

const villagesColumns = ref([
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
]);
const villagesData = ref([]);

const selectMenuItem = (key) => {
  selectedKeys.value = [key];
};

onMounted(async () => {
  // Fetch data for Distribution Post table
  if (selectedKeys.value[0] === "1") {
    //   transfersData.value = await fetchData('/transfers-endpoint');
  }

  // Fetch data for Villages table
  if (selectedKeys.value[0] === "2") {
    //   villagesData.value = await  fetchData('/villages-endpoint');
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
