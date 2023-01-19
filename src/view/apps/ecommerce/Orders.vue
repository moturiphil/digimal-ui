<template>
  <sdPageHeader title="Orders"
    ><template v-slot:buttons>
      <div class="page-header-actions">
        <sdCalendarButton />
        <sdExportButton />
        <sdShareButton />
        <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton>
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
              <a-col :xxl="14" :lg="16" :xs="24">
                <div class="table-toolbox-menu">
                  <span class="toolbox-menu-title"> Status:</span>
                  <a-radio-group v-if="item" @change="handleChangeForFilter">
                    <a-radio-button value="">All</a-radio-button>
                    <a-radio-button v-for="value in [...new Set(filterKey)]" :key="value" :value="value">
                      {{ value }}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </a-col>
              <a-col :xxl="4" :xs="24">
                <div class="table-toolbox-actions">
                  <sdButton size="small" type="secondary" transparented> Export </sdButton>
                  <sdButton size="small" type="primary"> <sdFeatherIcons type="plus" size="12" /> Add Order </sdButton>
                </div>
              </a-col>
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
import { computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';

const columns = [
  {
    title: 'Order Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

const Orders = defineComponent({
  name: 'Orders',
  components: { TopToolBox, Main, TableWrapper },

  setup() {
    const { state, dispatch } = useStore();
    const searchData = computed(() => state.headerSearchData);
    const orders = computed(() => state.orders.data);

    const item = computed(() => state.orders.data);
    const selectedRowKeys = ref([]);
    const stateValue = ref('');
    const filterKey = ref(['Shipped', 'Awaiting Shipment', 'Canceled']);

    const handleChangeForFilter = (e) => {
      dispatch('orderFilter', { column: 'status', value: e.target.value });
    };

    const dataSource = computed(() =>
      orders.value.map((value, key) => {
        const { status, orderId, customers, amount, date } = value;
        return {
          key: key + 1,
          id: <span class="order-id">{orderId}</span>,
          customer: <span class="customer-name">{customers}</span>,
          status: (
            <span
              class={`status ${
                status === 'Shipped' ? 'Success' : status === 'Awaiting Shipment' ? 'warning' : 'error'
              }`}
            >
              {status}
            </span>
          ),
          amount: <span class="ordered-amount">{amount}</span>,
          date: <span class="ordered-date">{date}</span>,
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

export default Orders;
</script>
