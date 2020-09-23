<!-- App Info component props icon, plat(0 iOS, 1 Android), appId, appName  -->
<template>
  <div class="selected-app" :style="status?null:'opacity: 0.3;'">
    <img style="width:32px;height:32px;" :src="icon? icon: plat === 0? '/iOS-40.svg':'/Android-40.svg'">
    <div class="info-title">
      <div>
        <ellipsis :style="{color:this.titleColor}" :length="25" :tooltip="this.showtip">{{ appName }}</ellipsis>
      </div>
      <div style="color:#999999;font-size: 10px;margin-top: 4px;">
        <img class="plat-icon" v-if="plat===1" src="/assets/Android.svg"/>
        <img class="plat-icon" v-else src="/assets/iOS.svg"/>
        <ellipsis :length="28" :tooltip="this.showtip">{{ appId }}</ellipsis>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'

export default {
  name: 'OmAppInfo',
  props: {
    icon: {
      type: String,
      default: '',
      required: false
    },
    plat: {
      type: Number,
      required: false,
      default: 0
    },
    appId: {
      type: String,
      required: true,
      default: ''
    },
    appName: {
      type: String,
      required: true,
      default: ''
    },
    status: {
      type: Number,
      required: false,
      default: 1
    },
    showtip: {
      type: Boolean,
      default: true
    },
    titleColor: {
      type: String,
      default: ''
    }
  },
  components: {
    Ellipsis
  },
  data () {
    return {
      visible: true
    }
  }
}
</script>

<style lang="less" scoped>
  .plat-icon {
    width: 12px;
    height: 12px;
    margin-right: 2px;
    margin-top: -4px;
  }
  .info-title {
    color:#333333;font-size: 14px;
    display: inline-block;vertical-align: middle;margin-left: 7px;
    line-height: 1.2;
  }
</style>
