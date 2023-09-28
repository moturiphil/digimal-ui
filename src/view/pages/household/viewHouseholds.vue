<template>
  <RecordViewWrapper>
    <sdPageHeader title="Households Lists">
      <template #subTitle> </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name, phone no, village or CHP"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
        Export HouseHolds Data
      </sdButton>
      <br />
      <br />
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <p> <b>Total Records: </b> {{ recordCount }}</p>
                <a-table
                  :pagination="{ pageSize: 50, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import axios from "axios";
import authHeader from "../../../services/auth-header";
import { RecordViewWrapper } from "../style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, defineComponent } from "vue";

const columns = [
  {
    title: "First name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Phone number",
    dataIndex: "phone_no",
    key: "phone_no",
  },
  {
    title: "Household size",
    dataIndex: "hh_size",
    key: "hh_size",
  },
  {
    title: "Village",
    dataIndex: "location_id",
    key: "location_id",
  },
  {
    title: "CHP",
    dataIndex: "chw_id",
    key: "chw_id",
  },
  {
    title: "CHP Phone Number",
    dataIndex: "chw_phone_no",
    key: "chw_phone_no",
  },
  {
    title: "Post",
    dataIndex: "post_id",
    key: "post_id",
  },
  {
    title: "Timestamp",
    dataIndex: "created_at",
    key: "created_at",
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, TableWrapper },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
    };
  },
  computed: {
    recordCount() {
      return this.results.length;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/households`;

    const households_url = `${process.env.VUE_APP_BASE_URL}/generateHHCSV`;

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data;
          // let house_hold_sz = dataSource;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const exportHouseHoldData = async () => {
      try {
        const response = await fetch(households_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "households.csv";
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([fileBlob]));
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return (
            regex.test(event.chw_id) ||
            regex.test(event.first_name) ||
            regex.test(event.last_name) ||
            regex.test(event.location_id) ||
            regex.test(event.phone_no)
          );
        });
      }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      searchItem,
      results,
      exportHouseHoldData,
    };
  },
});

export default ViewPage;
</script>
