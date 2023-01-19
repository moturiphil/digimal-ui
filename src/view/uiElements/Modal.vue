<template>
  <div>
    <sdPageHeader title="Modals">
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
            <p>
              When requiring users to interact with the application, but without jumping to a new page and interrupting
              the user's workflow, you can use Modal to create a new floating layer over the current page to get user
              feedback or display information. Additionally
            </p>
            <sdModal title="Basic Modal" :type="modalType" :onOk="handleOk" :visible="visible" :onCancel="handleCancel">
              <p>
                When requiring users to interact with the application, but without jumping to a new page and
                interrupting the user's workflow, you can use Modal to create a new floating layer over the current page
                to get user feedback or display information. Additionally
              </p>
            </sdModal>
            <a-space class="sDash-action-btn-list">
              <sdButton
                @click="
                  () => {
                    showModal();
                    changeType('primary');
                  }
                "
                size="small"
                type="primary"
                >Primary</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showModal();
                    changeType('success');
                  }
                "
                size="small"
                type="success"
                >Success</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showModal();
                    changeType('warning');
                  }
                "
                size="small"
                type="warning"
                >Warning</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showModal();
                    changeType('error');
                  }
                "
                size="small"
                type="error"
                >Error</sdButton
              >
            </a-space>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Color Modal">
            <p>
              When requiring users to interact with the application, but without jumping to a new page and interrupting
              the user's workflow, you can use Modal to create a new floating layer over the current page to get user
              feedback or display information. Additionally
            </p>
            <sdModal
              title="Color Modal"
              :color="true"
              :type="modalType"
              :onOk="handleOk"
              :visible="colorVisible"
              :onCancel="handleCancel"
            >
              <p>
                When requiring users to interact with the application, but without jumping to a new page and
                interrupting the user's workflow, you can use Modal to create a new floating layer over the current page
                to get user feedback or display information. Additionally
              </p>
            </sdModal>
            <a-space class="sDash-action-btn-list">
              <sdButton
                @click="
                  () => {
                    showColorModal();
                    changeType('primary');
                  }
                "
                size="small"
                type="primary"
                >Primary</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showColorModal();
                    changeType('success');
                  }
                "
                size="small"
                type="success"
                >Success</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showColorModal();
                    changeType('warning');
                  }
                "
                size="small"
                type="warning"
                >Warning</sdButton
              >
              <sdButton
                @click="
                  () => {
                    showColorModal();
                    changeType('error');
                  }
                "
                size="small"
                type="error"
                >Error</sdButton
              >
            </a-space>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Color Modal" class="Information Modal">
            <p>
              When requiring users to interact with the application, but without jumping to a new page and interrupting
              the user's workflow, you can use Modal to create a new floating layer over the current page to get user
              feedback or display information. Additionally
            </p>
            <sdModal
              title="Information Modal"
              :color="true"
              :type="modalType"
              :onOk="handleOk"
              :visible="colorVisible"
              :onCancel="handleCancel"
            >
              <p>
                When requiring users to interact with the application, but without jumping to a new page and
                interrupting the user's workflow, you can use Modal to create a new floating layer over the current page
                to get user feedback or display information. Additionally
              </p>
            </sdModal>
            <a-space class="sDash-action-btn-list">
              <sdButton type="info" size="small" @click="info"> Info </sdButton>
              <sdButton type="success" size="small" @click="success"> Success </sdButton>
              <sdButton type="error" size="small" @click="error"> Error </sdButton>
              <sdButton type="warning" size="small" @click="warning"> Warning </sdButton>
            </a-space>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { Modal } from 'ant-design-vue';
import { h, defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',
  components: {
    Main,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      modalType: 'primary',
      colorVisible: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    showColorModal() {
      this.colorVisible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.colorVisible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
    info() {
      //const h = this.$createElement;
      Modal.info({
        title: 'This is a notification message',
        content: h('div', {}, [h('p', 'some messages...some messages...'), h('p', 'some messages...some messages...')]),
        onOk() {
          console.log('ok');
        },
      });
    },
    success() {
      Modal.success({
        title: 'This is a success message',
        // JSX support
        content: (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
      });
    },

    error() {
      Modal.error({
        title: 'This is an error message',
        content: 'some messages...some messages...',
      });
    },

    warning() {
      Modal.warning({
        title: 'This is a warning message',
        content: 'some messages...some messages...',
      });
    },
  },
});
</script>
