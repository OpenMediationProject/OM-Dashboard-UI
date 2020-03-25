<template>
  <a-layout-sider
    style="margin-top: 56px;"
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"></s-menu>
    <!-- <a-icon v-if="device==='mobile'" style="color:white;position: absolute; right: 0px; bottom: 56px;" class="trigger" :type="collapsed ? 'left' : 'right'" @click="toggle"/>
    <a-icon v-else style="color:white;position: absolute; right: 0px; bottom: 56px;" class="trigger" :type="collapsed ? 'right' : 'left'" @click="toggle"/> -->
  </a-layout-sider>
</template>

<script>
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: true
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    toggle () {
      // this.collapsed = !this.collapsed
      this.$emit('toggle')
    }
  }
}
</script>
