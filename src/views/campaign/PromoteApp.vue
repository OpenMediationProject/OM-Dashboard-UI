<template>
  <div class="selected-app-small">
    <img :style="{width:iconSize,height:iconSize}" :src="appInfo.icon? appInfo.icon: GLOBAL.platIcon(appInfo.plat)">
    <div style="display: inline-block;vertical-align: middle;margin-left: 8px;">
      <div class="title" :style="{fontSize: titleFontSize}">
        <ellipsis :length="26" tooltip>{{ appInfo.appName }}</ellipsis>
      </div>
      <div class="sub-title" :style="{fontSize: subTitleFontSize, paddingTop: padding}">
        <img class="plat-icon" :src="GLOBAL.platIcon(appInfo.plat)"/>
        <ellipsis :length="36" tooltip>{{ appInfo.appId }}</ellipsis>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { searchAppFromStore } from '../../api/publisher'
import { mapState } from 'vuex'

export default {
  name: 'PromoteApp',
  props: {
    appId: {
      type: Number,
      default: 0
    },
    app: {
      type: Object,
      default: null
    },
    size: {
      type: Number,
      default: 32
    }
  },
  components: {
    Ellipsis
  },
  watch: {
    appId (v) {
      this.app_id = v
      this.load(v)
    }
  },
  computed: mapState({
    apps: state => state.publisher.apps
  }),
  data () {
    return {
      app_id: this.appId,
      initValue: this.defaultValue,
      appInfo: this.app,
      iconSize: this.size + 'px',
      titleFontSize: this.size === 40 ? '16px' : '14px',
      subTitleFontSize: this.size === 40 ? '12px' : '10px',
      padding: this.size === 40 ? '8px' : '4px'
    }
  },
  methods: {
    async load (appId) {
      const res = await searchAppFromStore({ appId })
      if (res.code === 0 && res.data) {
        this.appInfo = res.data
      }
    }
  },
  created () {
    if (!this.app.appId && this.appId) {
      this.load(this.appId)
    }
  }
}
</script>

<style type="less" scoped>
  .plat-icon {
    width: 10px;
    height: 10px;
    margin-right: 2px;
    margin-top: -3px;
  }
  .title {
    color:#333333;font-size: 14px;line-height: 14px;
  }
  .sub-title {
    color:#999999;font-size: 10px;line-height: 14px;padding-top: 4px;
  }
</style>
