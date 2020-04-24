<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'" class="header">
          <span style="position:absolute;width:256px;background: #B02D13;height: 64px;margin-top:-1px;">
            <img src="/om-logo.svg" style="margin-top:-1px;" />
          </span>
          <span id="global_title" class="title" style="margin-left: 296px;">{{ $route.meta.headTitle || $route.meta.title }}</span>
          <user-menu></user-menu>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme"/>
              <span id="global_title" class="title">{{ title }}</span>
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import { mixin } from '@/utils/mixin'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu
  },
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
    }
  },
  mounted () {
    // console.log(this.$route.meta.hiddenHeaderContent)
    document.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  methods: {
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  },
  beforeDestroy () {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less" scoped>
  @import '../index.less';

  .header-animat {
    position: relative;
    z-index: @ant-global-header-zindex;
  }

  .showHeader-enter-active {
    transition: all 0.25s ease;
  }

  .showHeader-leave-active {
    transition: all 0.5s ease;
  }

  .showHeader-enter, .showHeader-leave-to {
    opacity: 0;
  }

  .title {
    font-size: 26px;
    font-weight: bold;
    color:#333333;
    margin-bottom: 16px;
    margin-left: 16px;
    -webkit-box-flex: 1;
    -ms-flex: auto;
    flex: auto;
  }
</style>
