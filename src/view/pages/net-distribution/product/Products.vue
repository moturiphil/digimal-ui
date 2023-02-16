<template>
  <sdPageHeader title="Products"
    ><template v-slot:buttons>
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
    <a-row :gutter="30">
      <a-col class="product-sidebar-col" :xxl="5" :xl="7" :lg="7" :md="10" :xs="24">
        <Suspense>
          <template #default>
            <Filters />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton :paragraph="{ rows: 22 }" active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col class="product-content-col" :xxl="19" :lg="17" :md="14" :xs="24">
        <TopToolBox>
          <a-row :gutter="0">
            <a-col :xxl="7" :lg="12" :xs="24">
              <sdAutoComplete :dataSource="searchData" placeholder="Search" width="100%" patterns />
            </a-col>
            <a-col :xxl="7" :lg="12" :xs="24">
              <p class="search-result">Showing 1–8 of 86 results</p>
            </a-col>
            <a-col :xxl="10" :xs="24">
              <div class="product-list-action d-flex justify-content-between align-items-center">
                <div class="product-list-action__tab">
                  <span class="toolbox-menu-title"> Status:</span>
                  <a-radio-group @change="onSorting" defaultValue="rate">
                    <a-radio-button value="rate">Top Rated</a-radio-button>
                    <a-radio-button value="popular">Popular</a-radio-button>
                    <a-radio-button value="time">Newest</a-radio-button>
                    <a-radio-button value="price">Price</a-radio-button>
                  </a-radio-group>
                </div>

                <div
                  v-if="(innerWidth <= 991 && innerWidth >= 768) || innerWidth > 575"
                  class="product-list-action__viewmode"
                >
                  <router-link :to="`${path}/ecommerce/product/grid`">
                    <sdFeatherIcons type="grid" size="16" />
                  </router-link>
                  <router-link :to="`${path}/ecommerce/product/list`">
                    <sdFeatherIcons type="list" size="16" />
                  </router-link>
                </div>
              </div>
            </a-col>
          </a-row>
        </TopToolBox>
        <router-view name="grid"></router-view>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { computed, ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Main } from '../../../styled';
import { TopToolBox } from '../Style';

const Filters = defineAsyncComponent(() => import('./overview/Filters'));

const Product = {
  name: 'Product',
  components: { TopToolBox, Main, Filters },
  setup() {
    const { state, dispatch } = useStore();
    const searchData = computed(() => state.headerSearchData);
    const { matched } = useRoute();
    const { path } = matched[1];
    const active = ref('active');
    const onSorting = (e) => {
      dispatch('sorting', e.target.value);
    };

    const innerWidth = ref(window.innerWidth);

    return {
      searchData,
      active,
      onSorting,
      innerWidth,
      path,
    };
  },
};

export default Product;
</script>
