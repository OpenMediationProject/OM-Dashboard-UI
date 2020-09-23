<template>
  <div :style="status?null:'opacity: 0.3;'">
    <div class="plc-info">
      <img class="plc-icon" style="width:18px;" :src="'/icon/placement/'+type+'.svg'" />
      <div class="plc-title">
        <ellipsis :length="40" tooltip>{{ name }}</ellipsis><img v-if="abt===1" style="margin-left:4px;margin-right:4px;" src="/icon/TA.svg"/><img v-if="abt===1" src="/icon/TB.svg"/>
      </div>
      <div class="plc-type">
        <span>{{ GLOBAL.placementTypeMap[type].title }}</span>
        <a-divider type="vertical" />
        <span style="margin-left:-2px;">{{ id }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'

export default {
  name: 'OmPlacementInfo',
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: Number,
      required: false,
      default: 0
    },
    status: {
      type: Number,
      required: false,
      default: 1
    },
    abt: {
      type: Number,
      default: 0
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
.plc-title {
  color:#333333;font-size: 14px;margin-bottom:4px;
  white-space: nowrap;
  max-width:230px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.plc-info {
  display: inline-block;margin-left: 32px;
}
.plc-icon {
  position: absolute; left: 16px; top: 10px;
}
.plc-type {
  color:#999999;font-size: 12px;text-align: left;
}
</style>
