<template>
  <div>
    <sdPageHeader title="Activity Confirmation">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <!-- <sdCalendarButton />
          <sdExportButton />
          <sdShareButton /> -->
          <!-- <sdButton size="small" type="primary">
            <sdFeatherIcons type="plus" size="14" />
            Add New
          </sdButton> -->
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :md="24" :xs="24">
          <sdCards title="Confirm Activity">
            <a-list size="small" bordered :data-source="data">
              <template #renderItem="{ item }">
                <a-list-item>{{ item }}</a-list-item>
              </template>
              <!-- <template #header>
                <div>Header</div>
              </template> -->
              <!-- <template #footer>
                <div>Footer</div>
              </template> -->
            </a-list>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../../styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'List',
  components: {
    Main,
  },
  data() {
    return {
      activity: {}
    };
  },
  created() {
    // const encodedData = this.$route.params.data;
    // console.log(encodedData);

    let encodedData = this.$route.params.data;
    console.log("data is", encodedData);
    const decodedData = decodeURIComponent(encodedData);
    console.log(decodedData.toString())
    this.activity = JSON.parse(decodedData);
  }
});
</script>
