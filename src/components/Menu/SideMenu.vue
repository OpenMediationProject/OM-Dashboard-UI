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
      :ms="ms"
      :theme="theme"
      :mode="mode"
      :useUnity="useUnity"
      @select="onSelect"
      style="padding: 16px 0px;"></s-menu>
  </a-layout-sider>
</template>

<script>
import SMenu from './menu'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapState } from 'vuex'

export default {
  name: 'SideMenu',
  components: { SMenu },
  mixins: [mixin, mixinDevice],
  computed: mapState({
    useUnity: state => state.publisher.useUnity
  }),
  data () {
    return {
      id: 1,
      ms: this.menus
    }
  },
  watch: {
    menus (v) {
      this.ms = v
    }
  },
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
