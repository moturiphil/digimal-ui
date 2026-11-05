<template>
  <i :class="classes" v-html="activity" style="line-height: 0"></i>
</template>

<script>
import { icons } from "feather-icons";
import VueTypes from "vue-types";
import { toRefs, watchEffect, ref, defineComponent } from "vue";

export default defineComponent({
  name: "FeatherIcons",
  props: {
    type: VueTypes.string.def("activity"),
    size: VueTypes.oneOfType([VueTypes.number, VueTypes.string]).def(16),
    stroke: VueTypes.oneOfType([VueTypes.number, VueTypes.string]).def(2),
    classes: VueTypes.string,
    color: VueTypes.string,
    fill: VueTypes.string.def("transparent"),
  },
  setup(props) {
    const { size, color, fill, type, stroke, classes } = toRefs(props);

    // Guard against icon names that are not part of the installed
    // `feather-icons` release (e.g. `unlink`). Falling back to a known icon
    // keeps the whole page from crashing at render time.
    const resolveIcon = (name) => icons[name] || icons["alert-circle"] || null;

    const renderIcon = () => {
      const icon = resolveIcon(type.value);

      return icon
        ? icon.toSvg({
            "stroke-width": stroke.value,
            width: size.value,
            height: size.value,
            color: color.value,
            fill: fill.value,
            class: classes.value,
          })
        : "";
    };

    let activity = ref(renderIcon());

    watchEffect(() => {
      activity.value = renderIcon();
    });

    return {
      activity,
    };
  },
});
</script>

<style lang="scss" scoped></style>
