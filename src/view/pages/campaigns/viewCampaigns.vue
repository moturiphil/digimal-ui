<template>
  <div>
    <sdPageHeader title="Campaigns">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <!-- <sdCalendarButton />
          <sdExportButton />
          <sdShareButton /> -->
          <sdButton class="btn-add_new" size="default" type="success">
            <router-link to="/campaigns/create-campaign">
              <sdFeatherIcons type="plus" size="14" /> Start New
              Campaign</router-link
            >
          </sdButton>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :xs="24">
          <sdCards size="default">
            <div class="columnCardsWrapper">
              <a-row :gutter="30">
                <a-col
                  :sm="8"
                  :xs="24"
                  v-for="(item, index) in dataSource"
                  :key="index"
                >
                  <CardStyleWrapper>
                    <sdCards :border="false" :title="item.name">
                      <p>Start Date: {{ item.start_date }}</p>
                      <p>End Date: {{ item.end_date }}</p>
                      <template #actions="{ item }">
                        <td>
                          <div class="table-actions">
                            <sdButton>
                              <router-link
                                :to="`/campaigns/view/${item.id}`"
                                class="btn-icon"
                                type="info"
                                shape="circle"
                              >
                                <sdFeatherIcons type="eye" size="16" />
                                &nbsp;&nbsp; View
                              </router-link>
                            </sdButton>
                          </div>
                        </td>
                      </template>
                    </sdCards>
                  </CardStyleWrapper>
                </a-col>
              </a-row>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { CardStyleWrapper } from "../../uiElements/ui-elements-styled";
import { defineComponent, computed, onMounted, ref, reactive } from "vue";
import { useStore } from "vuex";
import authHeader from "../../../services/auth-header";

export default defineComponent({
  name: "Cards",
  components: {
    Main,
    CardStyleWrapper,
  },
  data() {
    return {};
  },
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    },

    getMonthData(value) {
      if (value.month() === 8) {
        return 1394;
      }
    },
  },
  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/campaign_all`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      formState,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});
</script>
