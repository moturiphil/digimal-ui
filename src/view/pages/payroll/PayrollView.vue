<template>
  <div>
    <sdPageHeader ghost title="Payroll" />
    <Main>
      <a-row>
        <a-col :span="11">
          <CardWrapper>
            <figcaption>
              <h2>Activity Payroll</h2>
              <p>{{ content }}</p>
              <router-link to="/activity-payroll">View Payroll</router-link>
            </figcaption>
          </CardWrapper>
        </a-col>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a-col :span="11">
          <CardWrapper>
            <figcaption>
              <h2>Event Payroll</h2>
              <p>{{ content }}</p>
              <router-link to="/event-payroll">View Payroll</router-link>
            </figcaption>
          </CardWrapper>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import {
  computed,
  onMounted,
  ref,
  reactive,
  defineComponent,
  toRefs,
} from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import Styled from "vue3-styled-components";

const CardWrapper = Styled.figure`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  margin: 0;
  figcaption {
    h2 {
      margin: 24px 0 10px 0;
    }
    p {
      line-height: 1.79;
      color: ${({ theme }) => theme["gray-color"]};
    }
  }
`;
import VueTypes from "vue-types";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Activity",
    dataIndex: "activity_id",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "total_amount",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "payroll",
    slots: { customRender: "payroll" },
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    CardWrapper,
  },
  props: {
    item: VueTypes.object.def({
      id: 1,
      title: "User Friendly",
      content: "",
      img: "static/img/sampleCards/1.svg",
    }),
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      payroll: [],
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    // handleChange(value) {
    //   this.activeClass = value;
    // },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
  },
  setup(props) {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/payroll_summary`;

    const filteredData = computed(() => {
      if (activeClass.value === "approved") {
        console.log(dataSource.value);
        return dataSource.value.filter((item) => item.isVerified === 1);
      } else if (activeClass.value === "outliers") {
        return dataSource.value.filter((item) => item.isVerified === 0);
      } else {
        return dataSource.value;
      }
    });

    const { item } = toRefs(props);
    const { id, title, content, img } = item.value;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          // households.value = response.data.data;
          // console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    const handleVerify = (record) => {
      console.log(record);
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/verify_house_hold/${record}`, {
          headers: authHeader(),
        })
        .then(({ status }) => {
          console.log(status);
          if (status == 200) {
            location.reload();
            notification["success"]({
              message: "HouseHold Verified",
              description: `HouseHold has been verified successfully`,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    };

    // handleChange(tab) {
    //   if (tab === 'all') {
    //     filteredData.value = dataSource.value;
    //   } else if (tab === 'approved') {
    //     filteredData.value = dataSource.value.filter(item => item.isVerified === 1);
    //   } else if (tab === 'outliers') {
    //     filteredData.value = dataSource.value.filter(item => item.hh_size > 5);
    //   }
    // }

    const formState = reactive({
      searchItem: "",
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      formState,
      // exportHouseHoldData,
      filteredData,
      handleChange,
      activeClass,
      handleVerify,
      id,
      title,
      content,
      img,
    };
  },
  // computed: {
  // },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
  font-size: 12px;
}
</style>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>
