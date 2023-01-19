<template>
  <MailBox :size="size">
    <div class="header">
      <p>New Message</p>
      <div class="icon-right">
        <sdFeatherIcons @click="toggleSize" type="maximize-2" size="18" />
        <sdFeatherIcons @click="close" type="x" size="18" />
      </div>
    </div>

    <div class="body">
      <div class="group">
        <a-input placeholder="Subject" type="text" />
      </div>
      <MailComposer />
    </div>
  </MailBox>
</template>
<script>
import { MailBox } from './style';
import MailComposer from './MailComposer';
import VueTypes from 'vue-types';
import { ref, defineComponent } from 'vue';

const Compose = defineComponent({
  name: 'Compose',
  components: { MailBox, MailComposer },
  props: {
    close: VueTypes.func.def(() => {}),
  },
  setup() {
    const tags = ref([]);
    const size = ref('small');
    const toggleSize = () => {
      size.value = size.value === 'small' ? 'big' : 'small';
    };

    return {
      tags,
      size,
      toggleSize,
    };
  },
});

export default Compose;
</script>
