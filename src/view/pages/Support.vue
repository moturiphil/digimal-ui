<template>
  <div>
    <sdPageHeader title="Support Center">
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
        <a-col :xs="24">
          <SupportTopWrap>
            <div class="sDash-support-container">
              <a-row align="middle">
                <a-col :lg="16" :sm="14" :xs="24">
                  <div class="sDash_support-content">
                    <h2 class="sDash_support-content__title">Hello, We are here to help</h2>
                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy</p>
                    <sdButton class="btn-ticket" size="large" type="primary" raised> Create Support Ticket </sdButton>
                  </div>
                </a-col>

                <a-col :lg="8" :sm="10" :xs="24">
                  <div class="sDash_support-img">
                    <img :src="require(`../../static/img/Group 9786.png`)" alt="" />
                  </div>
                </a-col>
              </a-row>
            </div>
          </SupportTopWrap>
          <SupportContentWrap>
            <div class="sDash-support-container">
              <div class="sDash-support-links">
                <a-row :gutter="30">
                  <a-col :lg="8" :xs="24">
                    <div class="sDash-support-link-item">
                      <div class="sDash-support-link-item__icon primary">
                        <img :src="require(`../../static/img/icon/idea.svg`)" alt="" />
                      </div>
                      <h4 class="sDash-support-link-item__title">Knowledgebase</h4>
                      <div class="sDash-support-link-item__content">
                        <p>Lorem ipsum dolor sit amet consetetur</p>
                        <router-link to="./knowledgebase/base/plugins" class="btn-link"> Learn More </router-link>
                      </div>
                    </div>
                  </a-col>
                  <a-col :lg="8" :xs="24">
                    <div class="sDash-support-link-item">
                      <div class="sDash-support-link-item__icon info">
                        <img :src="require(`../../static/img/icon/chat.svg`)" alt="" />
                      </div>
                      <h4 class="sDash-support-link-item__title">FAQ</h4>
                      <div class="sDash-support-link-item__content">
                        <p>Lorem ipsum dolor sit amet consetetur</p>
                        <router-link to="./faqs" class="btn-link"> Learn More </router-link>
                      </div>
                    </div>
                  </a-col>
                  <a-col :lg="8" :xs="24">
                    <div class="sDash-support-link-item">
                      <div class="sDash-support-link-item__icon success">
                        <img :src="require(`../../static/img/icon/documentation.svg`)" alt="" />
                      </div>
                      <h4 class="sDash-support-link-item__title">Documentation</h4>
                      <div class="sDash-support-link-item__content">
                        <p>Lorem ipsum dolor sit amet consetetur</p>
                        <router-link to="./documentation" class="btn-link"> Learn More </router-link>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
              <div class="sDash_faq-block">
                <sdCards headless title="Frequently Asked Questions">
                  <FaqWrapper>
                    <a-collapse :bordered="false" default-active-key="1">
                      <a-collapse-panel :showArrow="false" header="How long does it take to download updates?" key="1">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel
                        :showArrow="false"
                        header="How to use SCSS variables to build custom color?"
                        key="2"
                      >
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel :showArrow="false" header="How long does it take to download updates?" key="3">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel :showArrow="false" header="What is the flex layout?" key="4">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel :showArrow="false" header="How long does it take to download updates?" key="5">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel :showArrow="false" header="Where to buy this UI dashboard?" key="6">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <sdFeatherIcons type="smile" size="14" />
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                      <a-collapse-panel :showArrow="false" header="How long does it take to download updates?" key="7">
                        <p>
                          Many support queries and technical questions will already be answered in supporting
                          documentation such as FAQ&rsquo;s and comments from previous buyers. Anim pariatur cliche
                          reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                          Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                          assumenda shoreditch et.
                        </p>
                        <sdHeading as="h4">Was this article helpful?</sdHeading>
                        <div class="panel-actions">
                          <sdButton :outlined="true" type="success">
                            <span>Yes</span>
                          </sdButton>
                          <sdButton :outlined="true" type="warning">
                            <sdFeatherIcons type="frown" size="14" />
                            <span>No</span>
                          </sdButton>
                        </div>
                      </a-collapse-panel>
                    </a-collapse>
                  </FaqWrapper>
                </sdCards>
              </div>
            </div>
          </SupportContentWrap>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { SupportTopWrap, SupportContentWrap, FaqWrapper } from './style';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Faqs',
  components: {
    Main,
    SupportTopWrap,
    SupportContentWrap,
    FaqWrapper,
  },
});
</script>
