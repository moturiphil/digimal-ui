<template>
  <MailDetailsWrapper v-if="email">
    <sdCards>
      <template #button>
        <MailRightAction>
          <span>1 - 50 of 235</span>
        </MailRightAction>
      </template>
      <template #title>
        <MessageAction>
          <router-link @click="() => back()" to="#">
            <sdFeatherIcons type="arrow-left" size="14" />
          </router-link>
          <a-tooltip placement="bottom" title="Refresh">
            <router-link to="#">
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
      <a-row :gutter="15">
        <a-col>
          <MessageDetails>
            <div class="d-flex justify-content-between align-items-center">
              <div class="message-subject">
                <sdHeading as="h2">
                  {{ email.subject }}
                  <span class="mail-badge primary">{{ email.type }}</span>
                </sdHeading>
              </div>

              <div class="message-action">
                <router-link to="#" class="ex-coll">
                  <sdFeatherIcons type="chevron-up" size="16" />
                  <sdFeatherIcons type="chevron-down" size="16" />
                </router-link>

                <router-link to="#">
                  <sdFeatherIcons type="printer" size="16" />
                </router-link>
              </div>
            </div>

            <div class="message-box d-flex justify-content-between align-items-center">
              <div class="message-author">
                <img :style="{ width: '60px', borderRadius: '50%' }" :src="`${email.img}`" alt="" />
                <div>
                  <sdHeading as="h4">{{ email.userName }}</sdHeading>
                  <sdDropdown placement="bottom">
                    <template #overlay>
                      <ul class="mail-props">
                        <li>
                          <span>From:</span> <span>{{ email.from }}</span>
                        </li>
                        <li>
                          <span>To:</span> <span>{{ email.to }}</span>
                        </li>
                        <li><span>CC:</span> <span>example@gamil.com</span></li>
                        <li>
                          <span>Date:</span> <span>{{ dayjs(email.id).format('MMM D, YYYY') }}</span>
                        </li>
                      </ul>
                    </template>
                    <router-link to="#">
                      To {{ email.to }}
                      <sdFeatherIcons type="chevron-down" size="14" />
                    </router-link>
                  </sdDropdown>
                </div>
              </div>

              <div class="message-excerpt">
                <span>
                  <sdFeatherIcons type="paperclip" />
                </span>
                <span>{{ dayjs(email.id).format('MMM D, YYYY') }} </span>
                <router-link
                  :class="email.stared ? 'starActive' : 'starDeactivate'"
                  @click="() => onStaredChange(email.id)"
                  to="#"
                >
                  <font-awesome-icon :icon="faStar" size="1x" :style="{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }" />
                </router-link>
                <router-link to="#">
                  <sdFeatherIcons type="corner-up-left" />
                </router-link>
                <router-link to="#">
                  <sdFeatherIcons type="more-vertical" />
                </router-link>
              </div>
            </div>

            <div class="message-body">
              <span class="welcome-text">Hello Adam,</span>
              <p>{{ email.body }}</p>

              <sdHeading as="h6">
                Best Regards <br />
                {{ email.userName }}
              </sdHeading>
            </div>

            <div class="message-attachments">
              <figure>
                <div class="attachment-image">
                  <img :src="require('../../../../static/img/email/2.png')" alt="" />
                </div>
                <div class="attachment-hover">
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="download" />
                  </router-link>
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="share-2" />
                  </router-link>
                </div>
                <figcaption>
                  <sdHeading as="h4">Attached.jpg</sdHeading>
                  <p>256.5 KB</p>
                </figcaption>
              </figure>

              <figure>
                <div class="attachment-image">
                  <img :src="require('../../../../static/img/email/1.png')" alt="" />
                </div>
                <div class="attachment-hover">
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="download" />
                  </router-link>
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="share-2" />
                  </router-link>
                </div>
                <figcaption>
                  <sdHeading as="h4">Attached.jpg</sdHeading>
                  <p>256.5 KB</p>
                </figcaption>
              </figure>
              <figure>
                <div class="attachment-image">
                  <img :src="require('../../../../static/img/email/3.png')" alt="" />
                </div>
                <div class="attachment-hover">
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="download" />
                  </router-link>
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="share-2" />
                  </router-link>
                </div>
                <figcaption>
                  <sdHeading as="h4">Attached.zip</sdHeading>
                  <p>256.5 KB</p>
                </figcaption>
              </figure>
              <figure>
                <div class="attachment-image">
                  <img :src="require('../../../../static/img/email/4.png')" alt="" />
                </div>
                <div class="attachment-hover">
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="download" />
                  </router-link>
                  <router-link class="btn-link" to="#">
                    <sdFeatherIcons type="share-2" />
                  </router-link>
                </div>
                <figcaption>
                  <sdHeading as="h4">Attached.pdf</sdHeading>
                  <p>256.5 KB</p>
                </figcaption>
              </figure>
            </div>
            <hr />
          </MessageDetails>
        </a-col>
      </a-row>

      <a-row :gutter="15">
        <a-col :xs="24">
          <ReplyList>
            <div class="reply-view__single">
              <figure class="reply-view__content d-flex">
                <img
                  :style="{ width: '50px', height: '50px' }"
                  :src="require('../../../../static/img/email/2.png')"
                  alt=""
                />
                <figcaption>
                  <sdHeading as="h6">Reynante Labares</sdHeading>
                  <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor inviduntLorem
                    ipsum dolor...
                  </p>
                </figcaption>
              </figure>
              <div class="reply-view__meta">
                <span class="meta-list">
                  <span class="date-meta">Jan 2, 2021, 5:22 PM</span>
                  <router-link
                    :class="email.stared ? 'starActive' : 'starDeactivate'"
                    @click="() => onStaredChange(email.id)"
                    to="#"
                  >
                    <font-awesome-icon :icon="faStar" size="1x" :style="{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }" />
                  </router-link>
                  <router-link to="#">
                    <sdFeatherIcons type="more-vertical" />
                  </router-link>
                  <router-link to="#">
                    <sdFeatherIcons type="corner-up-left" />
                  </router-link>
                </span>
              </div>
            </div>
          </ReplyList>
          <MessageReply>
            <nav>
              <ul>
                <li>
                  <router-link :to="`/app/mail-single/${params.id}/replay`">
                    <sdFeatherIcons type="corner-up-left" size="14" /> Reply
                  </router-link>
                </li>
                <li>
                  <router-link :to="`/app/mail-single/${params.id}/forward`">
                    <sdFeatherIcons type="corner-up-right" size="14" /> Forward
                  </router-link>
                </li>
              </ul>
            </nav>
            <div class="reply-form d-flex">
              <div class="reply-box">
                <router-view name="child" defaultTag="Alice Freeman" replay :onSend="replyMail"></router-view>
              </div>
            </div>
          </MessageReply>
        </a-col>
      </a-row>
    </sdCards>
  </MailDetailsWrapper>
  <div v-else class="spin">
    <a-spin />
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { MailDetailsWrapper, MessageAction, MessageDetails, ReplyList, MessageReply, MailRightAction } from './style';
// const MailComposer = lazy(() => import('./MailComposer'));
import { useRouter, useRoute } from 'vue-router';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Single = defineComponent({
  name: 'Single',
  components: { MailDetailsWrapper, MessageAction, MessageDetails, ReplyList, MessageReply, MailRightAction },

  setup() {
    const { state, dispatch } = useStore();
    const { back } = useRouter();
    const { params, matched } = useRoute();
    const email = computed(() => state.email.data[0]);
    const replyMessage = ref(0);

    onMounted(() => {
      dispatch('filterSinglePage', parseInt(params.id));
    });

    const replyMail = (message) => {
      replyMessage.value = message;
      console.log(message);
    };

    const onStaredChange = (id) => {
      dispatch('onStarUpdate', id);
    };

    return {
      onStaredChange,
      replyMail,
      replyMessage,
      email,
      dayjs,
      back,
      faStar,
      matched,
      params,
    };
  },
});

export default Single;
</script>
