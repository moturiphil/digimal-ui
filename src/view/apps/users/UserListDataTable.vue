<template>
  <CardToolbox>
    <sdPageHeader title="User List Data Table">
      <template #subTitle>
        <span class="title-counter">274 Users</span>
        <sdAutoComplete :dataSource="searchData" width="100%" placeholder="Search by Name" patterns />
      </template>
      <template #buttons>
        <sdButton class="btn-add_new" size="default" type="primary" key="1">
          <router-link to="/admin/users/add-user/info">+ Add New User</router-link>
        </sdButton>
      </template>
    </sdPageHeader>
  </CardToolbox>

  <Main>
    <a-row :gutter="15">
      <a-col :md="24">
        <UserListTable />
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import UserListTable from './overview/UserTable';
import { computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Main, CardToolbox } from '../../styled';

const UserList = defineComponent({
  name: 'UserList',
  components: { Main, CardToolbox, UserListTable },
  setup() {
    const { state } = useStore();
    const searchData = computed(() => state.headerSearchData);
    const selectedRowKeys = ref(0);
    const selectedRows = ref(0);

    return {
      searchData,
      selectedRowKeys,
      selectedRows,
    };
  },
});

export default UserList;
</script>
