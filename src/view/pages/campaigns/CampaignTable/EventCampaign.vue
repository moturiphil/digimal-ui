<template>
  <UserTableStyleWrapper>
    <TableWrapper class="table-responsive">
      <a-table
        :rowSelection="rowSelection"
        :dataSource="usersTableData"
        :columns="EventCampaignColumns"
        :pagination="{
          defaultPageSize: 5,
          total: usersTableData.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }"
      />
    </TableWrapper>
  </UserTableStyleWrapper>
</template>
<script>
import { UserTableStyleWrapper } from '../style';
import { TableWrapper } from '../../../styled';
// import users from '@/demoData/usersData.json';
import users from '@/demoData/usersData.json';
import event_campaigns from '../../../../vuex//modules/project/actionCreator';
// import {{ useStore }} from 
import { computed, defineComponent } from 'vue';
// import { mapActions } from 'vuex';
// import events data from vuex store
// import events from 'store/'

const EventCampaignColumns = [
  {
    title: 'Event Name',
    dataIndex: 'email',
    key: 'name',
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Join Date',
    dataIndex: 'joinDate',
    key: 'joinDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    key: 'action',
    width: '90px',
  },
];
const EventCampaignTable = defineComponent({
  name: 'EventCampaignTable',
  components: { UserTableStyleWrapper, TableWrapper },
  setup() {
    const usersTableData = computed(() =>
      users.map((user) => {
        const { id, name, designation, img, status } = user;

        return {
          key: id,
          user: (
            <div class="user-info">
              <figure>
                <img style={{ width: '40px' }} src={require(`@/${img}`)} alt="" />
              </figure>
              <figcaption>
                <sdHeading class="user-name" as="h6">
                  {name}
                </sdHeading>
                <span class="user-designation">San Francisco, CA</span>
              </figcaption>
            </div>
          ),
          email: 'john@gmail.com',
          company: 'asdnfids',
          position: designation,
          joinDate: 'January 20, 2021',
          status: <span class={`status-text ${status}`}>{status}</span>,
          action: (
            <div class="table-actions">
              <>
                <sdButton class="btn-icon" type="default" to="#" shape="circle">
                  <sdFeatherIcons type="eye" size="16" />
                </sdButton>
                <sdButton class="btn-icon" type="default" to="#" shape="circle">
                  <sdFeatherIcons type="edit" size="16" />
                </sdButton>
                <sdButton class="btn-icon" type="default" to="#" shape="circle">
                  <sdFeatherIcons type="trash-2" size="16" />
                </sdButton>
              </>
            </div>
          ),
        };
      }),
    );
    

    console.log(event_campaigns);







    // const eventCampaignData = computed(() =>
    //   users.map((user) => {
    //     const { id, name, designation, img, status } = user;

    //     return {
    //       key: id,
    //       user: (
    //         <div class="user-info">
    //           <figure>
    //             <img style={{ width: '40px' }} src={require(`@/${img}`)} alt="" />
    //           </figure>
    //           <figcaption>
    //             <sdHeading class="user-name" as="h6">
    //               {name}
    //             </sdHeading>
    //             <span class="user-designation">San Francisco, CA</span>
    //           </figcaption>
    //         </div>
    //       ),
    //       email: 'john@gmail.com',
    //       company: 'asdnfids',
    //       position: designation,
    //       joinDate: 'January 20, 2021',
    //       status: <span class={`status-text ${status}`}>{status}</span>,
    //       action: (
    //         <div class="table-actions">
    //           <>
    //             <sdButton class="btn-icon" type="default" to="#" shape="circle">
    //               <sdFeatherIcons type="eye" size="16" />
    //             </sdButton>
    //             <sdButton class="btn-icon" type="default" to="#" shape="circle">
    //               <sdFeatherIcons type="edit" size="16" />
    //             </sdButton>
    //             <sdButton class="btn-icon" type="default" to="#" shape="circle">
    //               <sdFeatherIcons type="trash-2" size="16" />
    //             </sdButton>
    //           </>
    //         </div>
    //       ),
    //     };
    //   }),
    // );

    const rowSelection = {
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return { EventCampaignColumns, usersTableData, rowSelection };
  },
});

export default EventCampaignTable;
</script>
