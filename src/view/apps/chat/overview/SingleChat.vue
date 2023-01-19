<template>
  <SingleChatWrapper>
    <BackShadowEmoji v-if="pickerShow" @click="() => setPickerShow(false)" />
    <sdCards>
      <template #button>
        <sdDropdown key="1">
          <template #overlay>
            <router-link to="#">
              <sdFeatherIcons type="users" size="14" />
              <span>Create new group</span>
            </router-link>
            <router-link to="#">
              <sdFeatherIcons type="trash-2" size="14" />
              <span>Delete conversation</span>
            </router-link>
            <router-link to="#">
              <sdFeatherIcons type="slash" size="14" />
              <span>Block & Report</span>
            </router-link>
          </template>
          <a to="#">
            <sdFeatherIcons size="24" type="more-vertical" />
          </a>
        </sdDropdown>
      </template>
      <template #title>
        <sdHeading as="h5">{{ name }}</sdHeading>
        <p>Active Now</p>
      </template>

      <ul class="atbd-chatbox" v-if="singleContent.length">
        <perfect-scrollbar
          :options="{
            wheelSpeed: 1,
            swipeEasing: true,
            suppressScrollX: true,
          }"
        >
          <li
            v-for="({ time, img, email, content, id }, index) in singleContent"
            :key="time"
            class="atbd-chatbox__single"
          >
            <p v-if="index === 1" class="time-connector text-center text-capitalize">
              <span>today</span>
            </p>

            <div :key="id" :style="{ overflow: 'hidden' }">
              <div :class="email !== me ? 'left' : 'right'">
                <img v-if="email !== me" :src="require(`../../../../static/img/chat-author/${img}`)" alt="" />

                <div class="atbd-chatbox__content">
                  <sdHeading as="h5" class="atbd-chatbox__name">
                    {{ email !== me ? name : null }}
                    <span>{{
                      dayjs(time).format('MM-DD-YYYY') === dayjs().format('MM-DD-YYYY')
                        ? dayjs(id).format('hh:mm A')
                        : dayjs(id).format('MMM D, YYYY')
                    }}</span>
                  </sdHeading>

                  <div v-if="email !== me" class="atbd-chatbox__contentInner d-flex">
                    <div class="atbd-chatbox__message">
                      <MessageList class="message-box">{{ content }}</MessageList>
                    </div>

                    <div class="atbd-chatbox__actions">
                      <sdDropdown :action="['hover']" placement="bottom">
                        <template #overlay>
                          <div class="atbd-chatbox__emoji">
                            <ul>
                              <li>
                                <router-link to="#">
                                  <span role="img">&#127773;</span>
                                </router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <span role="img">&#128116;</span>
                                </router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <span role="img">&#128127;</span>
                                </router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <span role="img">&#128151;</span>
                                </router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <span role="img">&#128400;</span>
                                </router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <sdFeatherIcons type="more-horizontal" />
                                </router-link>
                              </li>
                            </ul>
                          </div>
                        </template>
                        <router-link to="#">
                          <sdFeatherIcons type="smile" />
                        </router-link>
                      </sdDropdown>

                      <sdDropdown :action="['hover']" placement="bottom">
                        <template #overlay>
                          <div class="atbd-chatbox__messageControl">
                            <ul>
                              <li>
                                <router-link to="#">Copy</router-link>
                              </li>
                              <li>
                                <router-link to="#">Edit</router-link>
                              </li>
                              <li>
                                <router-link to="#">Quote</router-link>
                              </li>
                              <li>
                                <router-link to="#">Forward</router-link>
                              </li>
                              <li>
                                <router-link to="#">Remove</router-link>
                              </li>
                            </ul>
                          </div>
                        </template>
                        <router-link to="#">
                          <sdFeatherIcons type="more-horizontal" size="16" />
                        </router-link>
                      </sdDropdown>
                    </div>
                  </div>

                  <div v-else class="atbd-chatbox__contentInner d-flex">
                    <div class="atbd-chatbox__actions">
                      <sdDropdown :action="['hover']" placement="bottom">
                        <template #overlay>
                          <div class="atbd-chatbox__messageControl">
                            <ul>
                              <li>
                                <router-link to="#">Edit </router-link>
                              </li>
                              <li>
                                <router-link to="#">Copy </router-link>
                              </li>
                              <li>
                                <router-link to="#">Quote</router-link>
                              </li>
                              <li>
                                <router-link to="#">Forward</router-link>
                              </li>
                              <li>
                                <router-link to="#">Remove</router-link>
                              </li>
                            </ul>
                          </div>
                        </template>
                        <router-link to="#">
                          <sdFeatherIcons type="more-horizontal" size="16" />
                        </router-link>
                      </sdDropdown>
                      <sdDropdown :action="['hover']" placement="bottom">
                        <template #overlay>
                          <div class="atbd-chatbox__emoji">
                            <ul>
                              <li>
                                <router-link to="#">&#127773;</router-link>
                              </li>
                              <li>
                                <router-link to="#">&#128116;</router-link>
                              </li>
                              <li>
                                <router-link to="#">&#128127;</router-link>
                              </li>
                              <li>
                                <router-link to="#">&#128151;</router-link>
                              </li>
                              <li>
                                <router-link to="#">&#128400;</router-link>
                              </li>
                              <li>
                                <router-link to="#">
                                  <sdFeatherIcons type="more-horizontal" />
                                </router-link>
                              </li>
                            </ul>
                          </div>
                        </template>
                        <router-link to="#">
                          <sdFeatherIcons type="smile" />
                        </router-link>
                      </sdDropdown>
                    </div>
                    <div class="atbd-chatbox__message">
                      <MessageList class="message-box">{{ content }}</MessageList>
                    </div>
                  </div>

                  <div v-if="email === me && singleContent.length === index + 1" class="message-seen text-right">
                    <span class="message-seen__time">Seen 9:20 PM </span>
                    <img :src="`../../../../static/img/chat-author/${img}`" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </perfect-scrollbar>
      </ul>
      <p v-else>No data found</p>

      <Footer>
        <form @submit="handleSubmit">
          <div :class="`chatbox-reply-form d-flex ${fileList.length && 'hasImage'} ${fileList2.length && 'hasFile'}`">
            <div class="chatbox-reply-input">
              <span class="smile-icon">
                <EmojiPicker :emojiClick="onEmojiClick" v-if="pickerShow" />
                <router-link @click="onPickerShow" to="#">
                  <sdFeatherIcons type="smile" size="24" />
                </router-link>
              </span>
              <input
                @change="handleChange"
                placeholder="Type your message..."
                name="chat"
                id="chat"
                :style="{ width: '100%' }"
                :value="inputValue"
              />
            </div>
            <div class="chatbox-reply-action d-flex">
              <a to="#">
                <a-upload v-bind="props">
                  <sdFeatherIcons type="camera" size="18" />
                </a-upload>
              </a>
              <a to="#">
                <a-upload v-bind="attachment">
                  <sdFeatherIcons type="paperclip" size="18" />
                </a-upload>
              </a>
              <sdButton @click="handleSubmit" type="primary" class="btn-send">
                <sdFeatherIcons type="send" size="18" />
              </sdButton>
            </div>
          </div>
        </form>
      </Footer>
    </sdCards>
  </SingleChatWrapper>
</template>
<script>
import dayjs from 'dayjs';
import { SingleChatWrapper, MessageList, BackShadowEmoji, Footer } from '../style';
import { useStore } from 'vuex';
import { computed, onMounted, ref, defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import EmojiPicker from '@/components/utilities/Emoji.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

const SingleChat = defineComponent({
  name: 'SingleChat',
  components: { SingleChatWrapper, MessageList, BackShadowEmoji, Footer, EmojiPicker, PerfectScrollbar },
  setup() {
    const { state, dispatch } = useStore();
    const { params } = useRoute();
    const rtl = computed(() => state.ChangeLayoutMode.rtlData);
    const chatData = computed(() => state.chat.privetData.data);
    const left = computed(() => (!rtl.value ? 'left' : 'right'));

    const me = ref('woadud@gmail.com');

    const singleContent = computed(() => (chatData.value[0] ? chatData.value[0].content : []));
    const name = computed(() => chatData.value[0] && chatData.value[0].userName);

    const inputValue = ref('');
    const fileList = ref([]);
    const fileList2 = ref([]);
    const pickerShow = ref(false);

    const setPickerShow = (value) => {
      pickerShow.value = value;
    };

    const onEmojiClick = (emojiObject) => {
      return (inputValue.value = inputValue.value + emojiObject);
    };

    const onPickerShow = () => {
      pickerShow.value = !pickerShow.value;
    };

    const handleChange = (e) => {
      inputValue.value = e.target.value;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const pushcontent = {
        content: inputValue,
        time: new Date().getTime(),
        seen: false,
        reaction: false,
        email: me,
      };
      dispatch('updatePrivetChat', { id: params.id, pushcontent });
      singleContent.value = [...singleContent.value, pushcontent];
      inputValue.value = '';
    };

    onMounted(() => dispatch('filterSinglePage', params.id));

    return {
      rtl,
      handleSubmit,
      setPickerShow,
      props: {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        listType: 'picture-card',
        onChange(info) {
          if (info.file.status !== 'uploading') {
            fileList.value = info.fileList;
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      },
      attachment: {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
            fileList2.value = info.fileList;
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      },
      handleChange,
      onEmojiClick,
      onPickerShow,
      left,
      chatData,
      me,
      singleContent,
      name,
      inputValue,
      fileList,
      fileList2,
      pickerShow,
      dayjs,
    };
  },
});

export default SingleChat;
</script>
<style scoped>
.ps {
  height: 450px;
}
</style>
