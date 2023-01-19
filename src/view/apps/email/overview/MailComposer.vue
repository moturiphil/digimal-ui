<template>
  <MailBox>
    <div class="body">
      <div
        v-if="!text"
        :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }"
        class="group"
      >
        <div class="reply-inner" :style="{ display: 'flex', alignItems: 'center' }">
          <span v-if="replay" class="reply-title">Replay To</span>
          <tags-input
            element-id="tags"
            :placeholder="replay ? null : 'To'"
            :existing-tags="selectedTags"
            v-model:value="selectedTags"
            ><template v-slot:selected-tag="{ tag, index, removeTag }">
              <span class="tagsinput-tag">
                <span v-html="tag.value"></span>
                <a v-show="!disabled" href="#" class="tags-input-remove" @click.prevent="removeTag(index)"
                  ><sdFeatherIcons type="x" size="14"
                /></a>
              </span>
            </template>
          </tags-input>
        </div>
        <span class="mail-cc">Cc</span>
      </div>
      <div class="group mail-editor">
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
      </div>
    </div>

    <div v-if="!text" class="footer">
      <div class="left d-flex align-items-center">
        <sdButton size="default" type="primary" @click="onSubmit" raised> Send </sdButton>
        <router-link to="#">
          <a-upload v-bind="antProps">
            <sdFeatherIcons type="paperclip" size="16" />
          </a-upload>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons type="alert-circle" size="16" />
        </router-link>
      </div>
      <div class="right">
        <router-link to="#">
          <sdFeatherIcons type="trash-2" size="16" />
        </router-link>
      </div>
    </div>
  </MailBox>
</template>
<script>
import VoerroTagsInput from '@voerro/vue-tagsinput';
import { MailBox } from './style';
import { ref, toRefs, defineComponent } from 'vue';
import VueTypes from 'vue-types';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const antProps = defineComponent({
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      // message.error(`${info.file.name} file upload failed.`);
    }
  },
});

const MailComposer = defineComponent({
  name: 'mailComposer',
  components: { MailBox, 'tags-input': VoerroTagsInput },
  props: {
    onChange: VueTypes.func.def(() => {}),
    onSend: VueTypes.func.def(() => {}),
    defaultTag: VueTypes.string,
    replay: VueTypes.bool.def(false),
    text: VueTypes.bool.def(false),
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
  setup(props) {
    const { defaultTag, onSend } = toRefs(props);

    const tags = ref(['hello']);
    const handleChange = (tag) => {
      tags.value = [...tags.value, tag];
    };
    const editorData = ref(
      "<p>What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?</p>",
    );

    const onSubmit = () => {
      onSend.value && onSend.value(editorData.value);
    };

    const selectedTags = ref(defaultTag.value ? [{ key: defaultTag.value, value: defaultTag.value }] : []);

    return {
      handleChange,
      tags,
      antProps,
      onSubmit,
      selectedTags,
      ClassicEditor,
      disabled: false,
      editorData,
    };
  },
});
export default MailComposer;
</script>
