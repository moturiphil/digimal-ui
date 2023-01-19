<template>
  <div>
    <sdPageHeader title="Single Article">
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
      <GeneralKnowledgeTop />
      <KnowledgebaseArticleWrap>
        <div class="knowledgebase-article-container">
          <div class="sDash_paginaion">
            <ul>
              <li>
                <router-link class="active" to="/page/knowledgebase/base/plugins"> Doc Home </router-link>
              </li>
              <li>
                <router-link class="active" to="#"> Switch between accounts </router-link>
              </li>
              <li>
                <router-link class="active" to="#"> Introduction to Plugin </router-link>
              </li>
              <li>
                <span>Plugins {{ collapsed }}</span>
              </li>
            </ul>
            <template v-if="responsive <= 991">
              <sdButton type="primary" class="knowledge-sidebar-trigger" @click="toggleCollapsed">
                <sdFeatherIcons :type="collapsed ? 'align-left' : 'align-right'" size="14" />
              </sdButton>
            </template>
          </div>
          <SingleKnowledgeContent>
            <div v-if="responsive > 991">
              <SidebarNavWrap>
                <div class="knowledge-sidebar">
                  <h4 class="knowledge-sidebar__title">Plugins</h4>
                  <ul>
                    <li>
                      <a @click="setOpen('menu1')" :class="open === 'menu2' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Introduction to Plugin</span>
                      </a>
                      <ul :class="open === 'menu1' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#" class="active">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                        <li>
                          <a href="#">Understand your actions in lorem</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu2')" :class="open === 'menu2' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Productivity tools for your Plugin admin & change password</span>
                      </a>
                      <ul :class="open === 'menu2' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                        <li>
                          <a href="#">Understand your actions in lorem</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu3')" :class="open === 'menu3' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Download, install, and upgrade</span>
                      </a>
                      <ul :class="open === 'menu3' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu4')" :class="open === 'menu4' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Download, install, and upgrade</span>
                      </a>
                      <ul :class="open === 'menu4' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu5')" :class="open === 'menu5' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Explore plans & features</span>
                      </a>
                      <ul :class="open === 'menu5' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu6')" :class="open === 'menu6' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Profile Settings</span>
                      </a>
                      <ul :class="open === 'menu6' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu7')" :class="open === 'menu7' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Listings Management</span>
                      </a>
                      <ul :class="open === 'menu7' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a @click="setOpen('menu8')" :class="open === 'menu8' ? 'active' : ''">
                        <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                        <span class="menu-text">Miscellaneous</span>
                      </a>
                      <ul :class="open === 'menu8' ? 'submenu show' : 'submenu'">
                        <li>
                          <a href="#">Switch between accounts</a>
                        </li>
                        <li>
                          <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                        </li>
                        <li>
                          <a href="#">Stop getting emails from lorem</a>
                        </li>
                        <li>
                          <a href="#">Threads to organize discussions</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </SidebarNavWrap>
            </div>
            <div v-else>
              <div :class="collapsed ? 'knowledge-sidebar-wrap show' : 'knowledge-sidebar-wrap hide'">
                <SidebarNavWrap>
                  <div class="knowledge-sidebar">
                    <h4 class="knowledge-sidebar__title">
                      Plugins
                      <sdButton type="link" class="trigger-close" size="small" @click="toggleCollapsed">
                        <sdFeatherIcons type="x" size="16" />
                      </sdButton>
                    </h4>
                    <ul>
                      <li>
                        <a @click="setOpen('menu1')" :class="open === 'menu2' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Introduction to Plugin</span>
                        </a>
                        <ul :class="open === 'menu1' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#" class="active">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                          <li>
                            <a href="#">Understand your actions in lorem</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu2')" :class="open === 'menu2' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Productivity tools for your Plugin admin & change password</span>
                        </a>
                        <ul :class="open === 'menu2' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                          <li>
                            <a href="#">Understand your actions in lorem</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu3')" :class="open === 'menu3' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Download, install, and upgrade</span>
                        </a>
                        <ul :class="open === 'menu3' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu4')" :class="open === 'menu4' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Download, install, and upgrade</span>
                        </a>
                        <ul :class="open === 'menu4' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu5')" :class="open === 'menu5' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Explore plans & features</span>
                        </a>
                        <ul :class="open === 'menu5' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu6')" :class="open === 'menu6' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Profile Settings</span>
                        </a>
                        <ul :class="open === 'menu6' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu7')" :class="open === 'menu7' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Listings Management</span>
                        </a>
                        <ul :class="open === 'menu7' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a @click="setOpen('menu8')" :class="open === 'menu8' ? 'active' : ''">
                          <sdFeatherIcons :type="open === 'menu1' ? 'chevron-down' : 'chevron-up'" size="14" />
                          <span class="menu-text">Miscellaneous</span>
                        </a>
                        <ul :class="open === 'menu8' ? 'submenu show' : 'submenu'">
                          <li>
                            <a href="#">Switch between accounts</a>
                          </li>
                          <li>
                            <a href="#">Installing vendor marketplace lorem vendor marketplace </a>
                          </li>
                          <li>
                            <a href="#">Stop getting emails from lorem</a>
                          </li>
                          <li>
                            <a href="#">Threads to organize discussions</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </SidebarNavWrap>
              </div>
            </div>
            <SingleKnowledgeDetails />
          </SingleKnowledgeContent>
        </div>
      </KnowledgebaseArticleWrap>
    </Main>
  </div>
</template>

<script>
import { onMounted, ref, defineComponent } from 'vue';
import { Main } from '../../styled';
import SingleKnowledgeDetails from './overview/singleKnowledge/SingleKnowledgeDetails';
import GeneralKnowledgeTop from './overview/GeneralKnowledgeTop';
import { KnowledgebaseArticleWrap, SingleKnowledgeContent, SidebarNavWrap } from './style';

export default defineComponent({
  name: 'SingleKnowledge',
  components: {
    Main,
    SingleKnowledgeDetails,
    GeneralKnowledgeTop,
    KnowledgebaseArticleWrap,
    SingleKnowledgeContent,
    SidebarNavWrap,
  },
  setup() {
    const responsive = ref(0);
    const collapsed = ref(false);
    const open = ref('menu1');
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };
    const setOpen = (setOpen) => {
      open.value = setOpen;
    };

    onMounted(() => {
      function updateSize() {
        const width = window.innerWidth;
        responsive.value = width;
      }
      window.addEventListener('resize', updateSize);
      updateSize();
    });

    return {
      responsive,
      open,
      toggleCollapsed,
      collapsed,
      setOpen,
    };
  },
});
</script>
