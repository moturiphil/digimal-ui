<template>
  <ActivityContents>
    <sdCards headless>
      <ul class="activity-list">
        <li class="activity-list__single">
          <span class="activity-icon primary">
            <sdFeatherIcons type="inbox" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t1.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">James</span> Send you a message
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon secondary">
            <sdFeatherIcons type="upload" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t2.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">Adam </span>upload website template for sale
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon success">
            <sdFeatherIcons type="log-out" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t3.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">Mumtahin</span> has registered
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon info">
            <sdFeatherIcons type="at-sign" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t4.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">James</span> Send you a message
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon danger">
            <sdFeatherIcons type="heart" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t5.png')" alt="" />
              <p>
                <span class="inline-text color-primary">Adam</span> upload website template for sale
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon warning">
            <sdFeatherIcons type="message-square" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t1.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">Mumtahin</span> has registered
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon info">
            <sdFeatherIcons type="at-sign" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t6.png')" alt="" />
              <p>
                <span class="inline-text color-primary">James</span> Send you a message
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon warning">
            <sdFeatherIcons type="heart" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t7.png')" alt="" />
              <p>
                <span class="inline-text color-primary">Mumtahin</span> has registered
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon danger">
            <sdFeatherIcons type="message-square" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t8.png')" alt="" />
              <p>
                <span class="inline-text color-primary">Adam</span> upload website template for sale
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
        <li class="activity-list__single">
          <span class="activity-icon primary">
            <sdFeatherIcons type="heart" size="14" />
          </span>
          <div class="activity-content">
            <div class="activity-info">
              <img :src="require('@/static/img/chat-author/t1.jpg')" alt="" />
              <p>
                <span class="inline-text color-primary">James</span> Send you a message
                <span class="hour">5 hours ago</span>
              </p>
            </div>
            <a class="activity-more" to="#">
              <sdDropdown :action="['click']">
                <template #overlay>
                  <a to="#">
                    <span>Hide</span>
                  </a>
                  <a to="#">
                    <span>Delete</span>
                  </a>
                </template>
                <sdFeatherIcons type="more-horizontal" />
              </sdDropdown>
            </a>
          </div>
        </li>
      </ul>
    </sdCards>
  </ActivityContents>
</template>
<script>
import { ActivityContents } from './style';
import { defineComponent } from 'vue';

const ActivityContent = defineComponent({
  name: 'ActivityContent',
  components: { ActivityContents },
});

export default ActivityContent;
</script>
