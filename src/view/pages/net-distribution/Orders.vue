<template>
  <sdPageHeader title="Distribution Posts"
    ><template v-slot:buttons>
      <div class="page-header-actions">
        <!-- <sdCalendarButton /> -->
        <sdExportButton />
        <!-- <sdShareButton /> -->
        <!-- <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton> -->
      </div>
    </template>
  </sdPageHeader>
  <Main>
    <sdCards headless>
      <a-row :gutter="15">
        <a-col :xs="24">
          <TopToolBox>
            <a-row :gutter="15" class="justify-content-center">
              <a-col :lg="6" :xs="24">
                <div class="table-search-box">
                  <sdAutoComplete :dataSource="searchData" width="100%" patterns />
                </div>
              </a-col>
              <a-col :xxl="18" :lg="16" :xs="24">
                <div class="table-toolbox-menu">
                  <span class="toolbox-menu-title"> Distribution Level:</span>
                  <a-radio-group v-if="item" @change="handleChangeForFilter">
                    <a-radio-button value="">National</a-radio-button>
                    <a-radio-button v-for="value in [...new Set(filterKey)]" :key="value" :value="value">
                      {{ value }}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </a-col>
              <!-- <a-col :xxl="4" :xs="24">
                <div class="table-toolbox-actions">
                  <sdButton size="small" type="secondary" transparented> Export </sdButton>
                  <sdButton size="small" type="primary"> <sdFeatherIcons type="plus" size="12" /> Add Order </sdButton>
                </div>
              </a-col> -->
            </a-row>
          </TopToolBox>
        </a-col>
      </a-row>
      <a-row :gutter="15">
        <a-col :md="24">
          <TableWrapper class="table-order table-responsive">
            <a-table
              :rowSelection="rowSelection"
              :dataSource="dataSource"
              :columns="columns"
              :pagination="{ pageSize: 7, showSizeChanger: true, total: orders ? orders.length : 20 }"
            />
          </TableWrapper>
        </a-col>
      </a-row>
    </sdCards>
  </Main>
</template>
<script>
import { TopToolBox } from './Style';
import { Main, TableWrapper } from '../../styled';
import { computed, ref, defineComponent, onMounted, toRaw } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import authHeader from '../../../services/auth-header';

const columns = [
  {
    title: 'Distribution Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Distribution Post',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Distribution Post Code',
    dataIndex: 'post_code',
    key: 'post_code',
  },
  {
    title: 'Supervisor Id',
    dataIndex: 'post_supervisor_user_id',
    key: 'post_supervisor_user_id',
  },
  {
    title: 'Distribution Start Date',
    dataIndex: 'distribution_start_date',
    key: 'distribution_start_date',
  },
  {
    title: 'Distribution End Date',
    dataIndex: 'distribution_end_date',
    key: 'distribution_end_date',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

const Distribution = defineComponent({
  name: 'Distribution',
  components: { TopToolBox, Main, TableWrapper },
  
  setup() {
    const { state, dispatch } = useStore();
    const searchData = computed(() => state.headerSearchData);
    // const orders = computed(() => state.orders.data);
    const orders = ref([])

    const item = computed(() => state.orders.data);
    const selectedRowKeys = ref([]);
    const stateValue = ref('');
    const filterKey = ref(['County', 'Sub-County', 'Ward']);

    const handleChangeForFilter = (e) => {
      dispatch('orderFilter', { column: 'status', value: e.target.value });
    };

    onMounted(() => {
      axios(`${process.env.VUE_APP_BASE_URL}/posts_data`, {headers: authHeader()})
      .then(({data}) => {
        console.log({data: data.data.data})
        orders.value.push(data.data.data)
      })
      .catch(console.error)
    })

    const dataSource = computed(() =>
      orders.value.map((value, key) => {
      

        const [{ id, name, post_code, distribution_start_date, post_supervisor_user_id, distribution_end_date }] = toRaw(value);
        return {
          key: key + 1,
          id: <span class="order-id">{id}</span>,
          name: <span class="customer-name">{name}</span>,
          /*status: (
            <span
              class={`status ${
                status === 'National' ? 'Success' : status === 'County' ? 'warning' : 'error'
              }`}
            >
              {status}
            </span>
          ),*/
          post_code: <span class="customer-name">{post_code}</span>,
          post_supervisor_user_id: <span class="customer-name">{post_supervisor_user_id}</span>,
          distribution_start_date: <span class="ordered-date">{distribution_start_date}</span>,
          distribution_end_date: <span class="ordered-date">{distribution_end_date}</span>,
          action: (
            <div class="table-actions">
              <>
                <sdButton class="btn-icon" type="primary" to="#" shape="circle">
                  <sdFeatherIcons type="eye" size={16} />
                </sdButton>
                <sdButton class="btn-icon" type="info" to="#" shape="circle">
                  <sdFeatherIcons type="edit" size={16} />
                </sdButton>
                <sdButton class="btn-icon" type="danger" to="#" shape="circle">
                  <sdFeatherIcons type="trash-2" size={16} />
                </sdButton>
              </>
            </div>
          ),
        };
      }),
    );

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      onChange: (selectedRowKeys) => {
        onSelectChange(selectedRowKeys);
      },
    };
    return {
      rowSelection,
      onSelectChange,
      dataSource,
      handleChangeForFilter,
      filterKey,
      item,
      searchData,
      columns,
      orders,
      stateValue,
    };
  },
});

export default Distribution;
</script>
