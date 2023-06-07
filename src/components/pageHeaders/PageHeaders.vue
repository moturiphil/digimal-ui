<script>
import { PageHeaderStyle } from "./style";
import VueTypes from "vue-types";
import { defineComponent } from "vue";

const PageHeader = defineComponent({
  components: {
    PageHeaderStyle,
  },
  props: {
    title: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    subTitle: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    bgColor: VueTypes.string,
    class: VueTypes.string,
    routes: VueTypes.object,
    buttons: VueTypes.array,
    ghost: VueTypes.bool,
    breadcrumb: VueTypes.object,
  },

  render() {
    const pageHeaderContainer = document.createElement("div");
    const pageHeaderStyle = document.createElement("page-header-style");

    // Set background color
    pageHeaderContainer.style.backgroundColor = this.bgColor || "#F4F5F7";
    pageHeaderStyle.style.backgroundColor = "rgb(244, 245, 247)";

    // Set class
    if (this.class) {
      pageHeaderStyle.setAttribute("class", this.class);
    }

    // Set title
    pageHeaderStyle.setAttribute("title", this.title || this.$slots.title());

    // Set subTitle
    if (this.subTitle || this.$slots.subTitle) {
      const subTitle = this.subTitle || this.$slots.subTitle();
      pageHeaderStyle.setAttribute("subTitle", subTitle);
    }

    // Set breadcrumb
    if (this.breadcrumb) {
      pageHeaderStyle.setAttribute("breadcrumb", this.breadcrumb);
    }

    // Set ghost
    if (this.ghost) {
      pageHeaderStyle.setAttribute("ghost", this.ghost);
    }

    // Set extra (buttons)
    if (this.$slots.buttons) {
      const buttons = this.$slots.buttons();
      pageHeaderStyle.setAttribute("extra", buttons);
    }

    pageHeaderContainer.appendChild(pageHeaderStyle);
    return pageHeaderContainer;
  },
});

export { PageHeader as default };
</script>
