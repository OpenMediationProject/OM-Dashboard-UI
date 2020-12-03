<!-- BasicLayout Menu GlobalHeader RouterView -->
<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <side-menu
      v-if="isSideMenu()"
      style="position: fixed;"
      mode="inline"
      :menus="mainMenu.find(item => item.path === '/').children"
      :theme="navTheme"
      :collapsed="false"
      :collapsible="true"
      @toggle="toggle"
    ></side-menu>
    <side-menu-adv
      v-else
      style="position: fixed;"
      mode="inline"
      :menus="mainMenu.find(item => item.path === '/').children"
      :theme="navTheme"
      :collapsed="false"
      :collapsible="true"
      @toggle="toggle"
    ></side-menu-adv>
    <global-header
      style="position: fixed;width: 100%;z-index:1000"
      :mode="layoutMode"
      :menus="mainMenu.find(item => item.path === '/').children"
      :theme="navTheme"
      :collapsed="false"
      :device="device"
      @toggle="toggle"
    />
    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '16px 16px 0', paddingTop: fixedHeader ? '64px' : '0', paddingLeft: contentCalc() }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <!-- <a-layout-footer>
        <global-footer />
      </a-layout-footer> -->
    </a-layout>
  </a-layout>

</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    contentCalc () {
      return this.sidebarOpened ? '256px' : '80px'
    },
    menuSelect () {
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
