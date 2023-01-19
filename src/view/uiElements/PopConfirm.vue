<template>
  <div>
    <sdPageHeader title="PopConfirm">
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
      <a-row :gutter="25">
        <a-col :md="12" :xs="24">
          <sdCards title="Basic">
            <a-popconfirm
              title="Are you sure delete this task?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="confirm"
              @cancel="cancel"
            >
              <a href="#">Delete</a>
            </a-popconfirm>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Placement">
            <div id="components-a-popconfirm-demo-placement" class="placement-confirm">
              <div
                class="pop-confirm pop-confirm-top"
                :style="{
                  [rtl ? 'marginRight' : 'marginLeft']: `${buttonWidth}px`,
                  whiteSpace: 'nowrap',
                }"
              >
                <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">TL</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">Top</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="topRight" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">TR</sdButton>
                </a-popconfirm>
              </div>
              <div
                className="pop-confirm pop-confirm-left"
                :style="{
                  width: `${buttonWidth}px`,
                  float: rtl ? 'right' : 'left',
                }"
              >
                <a-popconfirm placement="leftTop" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">LT</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="left" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">Left</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="leftBottom" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">LB</sdButton>
                </a-popconfirm>
              </div>
              <div
                className="pop-confirm pop-confirm-right"
                :style="{
                  width: `${buttonWidth}px`,
                  [rtl ? 'marginRight' : 'marginLeft']: `${buttonWidth * 4 + 24}px`,
                }"
              >
                <a-popconfirm placement="rightTop" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">RT</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="right" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">Right</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="rightBottom" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">RB</sdButton>
                </a-popconfirm>
              </div>
              <div
                className="pop-confirm pop-confirm-bottom"
                :style="{
                  [rtl ? 'marginRight' : 'marginLeft']: `${buttonWidth}px`,
                  clear: 'both',
                  whiteSpace: 'nowrap',
                }"
              >
                <a-popconfirm placement="bottomLeft" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">BL</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="bottom" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">Bottom</sdButton>
                </a-popconfirm>
                <a-popconfirm placement="bottomRight" ok-text="Yes" cancel-text="No" @confirm="confirm">
                  <template v-slot:title>
                    <p>{{ text }}</p>
                    <p>{{ text }}</p>
                  </template>
                  <sdButton type="white" size="default" :outlined="true">BR</sdButton>
                </a-popconfirm>
              </div>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { message } from 'ant-design-vue';
import { mapState } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PopConfirm',
  components: {
    Main,
  },
  data() {
    return {
      buttonWidth: 90,
      text: 'Are you sure to delete this task?',
    };
  },
  computed: {
    ...mapState(['rtl']),
  },
  methods: {
    confirm(e) {
      console.log(e);
      message.success('Click on Yes');
    },
    cancel(e) {
      console.log(e);
      message.error('Click on No');
    },
  },
});
</script>
