<template>
  <CardToolbox>
    <sdPageHeader title="Team Members">
      <template #subTitle>
        <span class="title-counter">274 Users</span>
        <sdAutoComplete :dataSource="searchData" width="100%" placeholder="Search by Name" patterns />
      </template>
      <template #buttons>
        <sdButton class="btn-add_new" size="default" key="1" type="primary">
          <sdFeatherIcons type="plus" size="14" /> Add New Member
        </sdButton>
      </template>
    </sdPageHeader>
  </CardToolbox>

  <Main>
    <a-row :gutter="25">
      <a-col v-for="user in team" :key="user.id" :xxl="6" :lg="8" :sm="12" :xs="24">
        <Suspense>
          <template #fallback>
            <sdCards headless>
              <a-skeleton avatar active />
            </sdCards>
          </template>
          <template #default>
            <TeamCard :user="user">
              <template #item>
                <a to="#">
                  <sdFeatherIcons size="14" type="eye" />
                  <span>View</span>
                </a>
                <a to="#">
                  <sdFeatherIcons size="14" type="edit" />
                  <span>Edit</span>
                </a>
                <a to="#">
                  <sdFeatherIcons size="14" type="trash-2" />
                  <span>Delete</span>
                </a>
              </template>
            </TeamCard>
          </template>
        </Suspense>
      </a-col></a-row
    >
  </Main>
</template>
<script>
import { computed, defineAsyncComponent, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Main, CardToolbox } from '../../styled';
const TeamCard = defineAsyncComponent(() => import('./overview/TeamCard'));

const Team = defineComponent({
  name: 'Team',
  components: { Main, CardToolbox, TeamCard },
  setup() {
    const { state } = useStore();
    const searchData = computed(() => state.headerSearchData);
    const team = computed(() => state.team.data);
    return {
      searchData,
      team,
    };
  },
});

export default Team;
</script>
