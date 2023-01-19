<template>
  <div>
    <sdPageHeader title="Data Tables" />
    <Main>
      <a-row :gutter="15">
        <a-col :xs="24">
          <sdCards title="Project List"> <ProjectLists /></sdCards>
        </a-col>
        <a-col :xs="24">
          <sdCards title="User List Table"> <UserListTable /></sdCards>
        </a-col>
        <a-col :xs="24">
          <sdCards title="Filter and sorter">
            <a-table class="table-responsive" :pagination="false" :columns="columns" :data-source="data" />
          </sdCards>
        </a-col>
        <a-col :xs="24">
          <sdCards title="Table Pagination">
            <a-table
              class="table-responsive"
              :columns="columnsPagination"
              :data-source="data"
              :pagination="{ pageSize: 3 }"
            />
          </sdCards>
        </a-col>
        <a-col :xs="12"> </a-col>
        <a-col :xs="24">
          <sdCards title="Task List">
            <TaskLists>
              <TaskList />
            </TaskLists>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Main } from '../styled';
import UserListTable from '@/view/apps/users/overview/UserTable';
import ProjectLists from '@/view/apps/project/overview/List';
import TaskList from '@/view/apps/project/overview/TaskList';
import { TaskLists } from '@/view/apps/project/style';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
  },
];
const columnsPagination = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jim Red 2',
    age: 37,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '6',
    name: 'Jim Red 2',
    age: 35,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '7',
    name: 'Jim Red 2',
    age: 37,
    address: 'London No. 2 Lake Park',
  },
];
export default defineComponent({
  name: 'DataTable',
  components: {
    Main,
    UserListTable,
    ProjectLists,
    TaskList,
    TaskLists,
  },
  setup() {
    return {
      data,
      columns,
      columnsPagination,
    };
  },
});
</script>
