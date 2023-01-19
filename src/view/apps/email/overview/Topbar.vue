<template>
  <MessageAction>
    <a-tooltip placement="bottom" title="Refresh">
      <router-link @click="refreshState" to="#">
        <sdFeatherIcons type="rotate-cw" size="18" />
      </router-link>
    </a-tooltip>
    <a-tooltip placement="bottom" title="Archive">
      <router-link to="#">
        <sdFeatherIcons type="archive" size="18" />
      </router-link>
    </a-tooltip>
    <a-tooltip placement="bottom" title="Info">
      <router-link to="#">
        <sdFeatherIcons type="alert-octagon" size="18" />
      </router-link>
    </a-tooltip>
    <a-tooltip placement="bottom" title="Delete">
      <router-link to="#">
        <sdFeatherIcons type="trash" size="18" />
      </router-link>
    </a-tooltip>
    <a-tooltip placement="bottom" title="Read">
      <router-link to="#">
        <sdFeatherIcons type="book-open" size="18" />
      </router-link>
    </a-tooltip>
    <a-tooltip placement="bottom" title="Folder">
      <router-link to="#">
        <sdFeatherIcons type="folder" size="18" />
      </router-link>
    </a-tooltip>
  </MessageAction>
</template>
<script>
import VueTypes from 'vue-types';
import { MessageAction } from './style';
import { defineComponent } from 'vue';

const Topbar = defineComponent({
  name: 'Topbar',
  components: { MessageAction },
  props: {
    refreshState: VueTypes.func.isRequired,
  },
});

export default Topbar;
</script>
