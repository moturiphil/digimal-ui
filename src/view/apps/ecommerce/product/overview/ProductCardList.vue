<template>
  <p v-if="isLoader">Loading</p>
  <ProductCard v-else class="list-view" :style="{ marginBottom: '20px' }">
    <div class="product-list">
      <a-row :gutter="15">
        <a-col :md="6" :xs="24">
          <figure>
            <img :style="{ width: '100%' }" :src="require(`@/${renderData.img}`)" alt="" />
          </figure>
        </a-col>
        <a-col :md="12" :xs="24">
          <div class="product-single-description">
            <sdHeading class="product-single-title" as="h5">
              <router-link :to="`${matched[1].path}/ecommerce/productDetails/${renderData.id}`">{{
                renderData.name
              }}</router-link>
            </sdHeading>
            <p>{{ renderData.description }}</p>
          </div>
        </a-col>
        <a-col :md="6" :xs="24">
          <div class="product-single-info">
            <a @click="() => dispatch('updateWishList', renderData.id)" class="btn-heart" to="#">
              <sdFeatherIcons
                type="heart"
                size="14"
                :color="renderData.popular ? '#FF4D4F' : '#9299B8'"
                :fill="renderData.popular ? '#FF4D4F' : 'none'"
              />
            </a>
            <p class="product-single-price">
              <span class="product-single-price__new">${{ renderData.price }} </span>

              <template v-if="renderData.oldPrice">
                <del> ${{ renderData.oldPrice }} </del>
                <span class="product-single-price__offer"> 60% Off</span>
              </template>
            </p>
            <div class="product-single-rating">
              <a-rate allow-half :default-value="renderData.rate" disabled /> 4.9
              <span class="total-reviews"> 778 Reviews</span>
            </div>
            <div class="product-single-action">
              <sdButton size="small" class="btn-cart" type="white" :outlined="true">
                <sdFeatherIcons type="shopping-bag" size="14" />
                <span>Add To Cart</span>
              </sdButton>
              <sdButton size="small" type="primary"> Buy Now </sdButton>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </ProductCard>
</template>
<script>
import PropTypes from 'vue-types';
import { ProductCard } from '../../Style';
import { computed, toRefs, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const ProductCardsList = defineComponent({
  name: 'ProductCards',
  components: { ProductCard },
  props: {
    product: PropTypes.object.def({}),
  },
  setup(props) {
    const { dispatch, state } = useStore();
    const isLoader = computed(() => state.ecommerce.isProductLoading);
    const { product } = toRefs(props);
    const renderData = computed(() => product.value);
    const { matched } = useRoute();

    return {
      dispatch,
      renderData,
      isLoader,
      matched,
    };
  },
});

export default ProductCardsList;
</script>
