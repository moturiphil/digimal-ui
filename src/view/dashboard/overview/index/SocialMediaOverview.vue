<template>
  <SocialMediaWrapper>
    <sdCards title="Social Media Overview">
      <a-row :gutter="25">
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent :icon="faFacebookF" bgColor="#2366B8" title="5,461" subTitle="Likes" />
        </a-col>
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent :icon="faTwitter" bgColor="#00ABE4" title="5,461" subTitle="Followers" />
        </a-col>
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent
            :icon="faInstagram"
            bgColor="linear-gradient(to top, #ffc107 0%,#f44336 31%,#9c27b0 65%,#9c27b0 100%)"
            title="5,461"
            subTitle="Followers"
          />
        </a-col>
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent :icon="faYoutube" bgColor="#E32212" title="5,461" subTitle="Subscribers" />
        </a-col>
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent :icon="faPinterest" bgColor="#E32212" title="5,461" subTitle="Followers" />
        </a-col>
        <a-col :xxl="8" :md="4" :xs="8">
          <SocialMediaContent :icon="faLinkedinIn" bgColor="#007CBC" title="5,461" subTitle="Followers" />
        </a-col>
      </a-row>
    </sdCards>
  </SocialMediaWrapper>
</template>
<script>
import { SocialMediaWrapper } from '../../style';
import SocialMediaContent from '../../../../components/social-media/overview.vue';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faYoutube,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';
import { defineComponent } from 'vue';

const SocialMediaOverview = defineComponent({
  name: 'SocialMediaOverview',
  components: { SocialMediaWrapper, SocialMediaContent },
  setup() {
    return {
      faFacebookF,
      faTwitter,
      faInstagram,
      faLinkedinIn,
      faYoutube,
      faPinterest,
    };
  },
});

export default SocialMediaOverview;
</script>
