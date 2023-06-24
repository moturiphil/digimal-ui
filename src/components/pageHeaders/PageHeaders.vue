<template>
  <div>
    <div :style="{ backgroundColor: bgColor || '#F4F5F7' }">
      <PageHeaderStyle
        :style="{ backgroundColor: 'rgb(244, 245, 247)' }"
        :class="customClass"
        :title="title || $slots.title()"
        :subTitle="subTitle || ($slots.subTitle ? $slots.subTitle() : null)"
        :breadcrumb="breadcrumb"
        :ghost="ghost"
        :extra="$slots.buttons && $slots.buttons()"
      ></PageHeaderStyle>
    </div>
  </div>
</template>

<script>
import { PageHeaderStyle } from './style';
import VueTypes from 'vue-types';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    PageHeaderStyle,
  },
  props: {
    title: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    subTitle: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    bgColor: VueTypes.string,
    customClass: VueTypes.string,
    routes: VueTypes.object,
    buttons: VueTypes.array,
    ghost: VueTypes.bool,
    breadcrumb: VueTypes.object,
  },
});
</script>
