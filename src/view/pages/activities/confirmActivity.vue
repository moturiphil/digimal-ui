<template>
  <div>
    <sdPageHeader title="Activity Confirmation">
      <template v-slot:buttons>
        <div class="page-header-actions">
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
    let encodedData = this.$route.params.data;
    console.log("data is", encodedData);
    const decodedData = decodeURIComponent(encodedData);
    console.log(decodedData.toString())
    this.activity = JSON.parse(decodedData);
  }
});
</script>
