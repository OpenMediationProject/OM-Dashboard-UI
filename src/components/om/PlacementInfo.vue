<!-- Show placement info props: id（placement_id）, name(placement_name), type(placement_type) -->
<template>
  <div :style="status?null:'opacity: 0.3;'">
    <div style="display: inline-block;">
      <div style="color:#333333;font-size: 14px;margin-bottom:5px;">
        <ellipsis :length="20" tooltip>{{ name }}</ellipsis>
      </div>
      <div style="color:#999999;font-size: 12px;">
        <span v-if="type===0">Banner</span>
        <span v-if="type===1">Native</span>
        <span v-if="type===2">Rewarded Video</span>
        <span v-if="type===3">Interstitial</span>
        <span v-if="type===4">Splash</span>
        <a-divider type="vertical" />
        <span style="margin-left:-2px;">{{ id }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'

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
</style>
