<template>
  <sdPageHeader title="Drag & Drop">
    <template v-slot:buttons>
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
    <a-row :gutter="15">
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { Main } from '../styled';
import DragAndDropTable from '../table/DragTable';
import { defineComponent } from 'vue';

const UserListDataTable = defineComponent({
  name: 'UserListDataTable',
  components: { Main, DragAndDropTable },
});

export default UserListDataTable;
</script>
