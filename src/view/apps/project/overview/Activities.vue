<template>
  <ActivitiesWrapper>
    <div class="activity-block">
      <a-row :gutter="15">
        <a-col :xxl="3" :lg="5" :md="4" :sm="5" :xs="24">
          <div class="activity-dateMeta">
            <sdHeading as="h4">22</sdHeading>
            <span class="activity-month">December</span>
          </div>
        </a-col>
        <a-col :xxl="21" :lg="19" :md="20" :sm="19" :xs="24">
          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-secondary">
                <sdFeatherIcons type="plus" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5">
                Mumtahin <span>add new task</span> Dashboard Project
              </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>

          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-primary">
                <sdFeatherIcons type="code" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5"> Mike Greene<span>pushed commit</span>#652364 </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>

          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-success">
                <sdFeatherIcons type="plus" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5">
                Tomlinson<span>completed task</span>Invoice template
              </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="activity-block">
      <a-row :gutter="15">
        <a-col :xxl="3" :lg="5" :md="4" :sm="5" :xs="24">
          <div class="activity-dateMeta">
            <sdHeading as="h4">22</sdHeading>
            <span class="activity-month">December</span>
          </div>
        </a-col>
        <a-col :xxl="21" :lg="19" :md="20" :sm="19" :xs="24">
          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-secondary">
                <sdFeatherIcons type="user-plus" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5">
                Mumtahin <span>add new task</span> Dashboard Project
              </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>

          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-primary">
                <sdFeatherIcons type="code" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5"> Mike Greene<span>pushed commit</span>#652364 </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>

          <div class="activity-single d-flex">
            <div class="activity-single__figure">
              <span class="activity-icon bg-success">
                <sdFeatherIcons type="upload" size="12" />
              </span>
              <img style="width: 30px" :src="require('@/static/img/users/1.png')" alt="" />
            </div>
            <div class="activity-single__content">
              <sdHeading class="activity-title" as="h5">
                Tomlinson<span>completed task</span>Invoice template
              </sdHeading>
              <p class="activity-timeMeta">3:30 PM</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </ActivitiesWrapper>
</template>
<script>
import { ActivitiesWrapper } from '../style';
import { defineComponent } from 'vue';

const Activities = defineComponent({
  name: 'Activities',
  components: { ActivitiesWrapper },
});

export default Activities;
</script>
