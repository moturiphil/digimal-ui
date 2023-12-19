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
          <!-- <a-table :columns="transfersColumns" :data-source="subLocationData" /> -->
          <div class="table-responsive">
            <a-table
              :columns="transfersColumns"
              :data-source="subLocationData"
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
import { ref, onMounted, watch } from "vue";
//   import { fetchData } from "@/api"; // Replace with your actual API module
import authHeader from "../../../services/auth-header";

const selectedKeys = ref(["2"]);

const transfersColumns = ref([
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Post Code",
    dataIndex: "post_code",
    key: "id",
  },
  {
    title: "Post Supervisor",
    dataIndex: "post_supervisor_user_id",
    key: "id",
  },
  {
    title: "Distribution Start Date",
    dataIndex: "distribution_start_date",
    key: "id",
  },
  {
    title: "Distribution End Date",
    dataIndex: "distribution_end_date",
    key: "id",
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   key: "id",
  //   slots: { customRender: "action" },
  // },
]);

const villagesColumns = ref([
  {
    title: "Village",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "id",
  },
  {
    title: "No of CHPs",
    dataIndex: "no_of_chp_registered",
    key: "id",
  },
  {
    title: "No of Village Elders",
    dataIndex: "no_of_ve_registered",
    key: "id",
  },
  {
    title: "No of Households",
    dataIndex: "no_of_registered_hh",
    key: "id",
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   key: "id",
  //   slots: { customRender: "action" },
  // },
]);
const villagesData = ref([]);

const subLocationData = ref([]);

const selectMenuItem = (key) => {
  selectedKeys.value = [key];
};

// Function to fetch village data
const fetchVillagesData = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/villages/list`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const data = await response.json();
    console.log(data);
    villagesData.value = data.data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch sub location data
const fetchSubLocationData = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/sub_location_posts`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const data = await response.json();
    console.log(data);
    subLocationData.value = data.data;
  } catch (error) {
    console.error(error);
  }
};

// Initial load: Fetch villages data
onMounted(async () => {
  await fetchVillagesData();
});

// Watch for changes in selectedKeys
watch(selectedKeys, async (newSelectedKeys) => {
  if (newSelectedKeys[0] === "1") {
    await fetchSubLocationData();
  } else if (newSelectedKeys[0] === "2") {
    await fetchVillagesData();
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
