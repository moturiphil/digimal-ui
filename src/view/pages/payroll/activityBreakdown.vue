<template>
  <div>
    <sdPageHeader :title="`Pay Breakdown for ${name}`">
      <template v-slot:buttons>
        <div class="page-header-actions"></div>
      </template>
    </sdPageHeader>
    <Main>
      <MixedCardWrap>
        <a-row :gutter="25">
          <a-col :lg="18" :md="35" :sm="18" :xs="24">
            <sdCards headless>
              <PaySummary :subtotal="1200" />
            </sdCards>
          </a-col>
        </a-row>
      </MixedCardWrap>
    </Main>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Main } from "../../styled";
import PaySummary from "./PaySummary.vue";
import { MixedCardWrap } from "./Style";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "WidgetMixed",
  components: {
    Main,
    PaySummary,
    MixedCardWrap,
  },
  setup() {
    const { query } = useRoute();
    const name = query.name;
    console.log(name);
    return { name };
  },
});
</script>
