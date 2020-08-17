<!-- Show placement info props: id（placement_id）, name(placement_name), type(placement_type) -->
<template>
  <div :style="status?null:'opacity: 0.3;'">
    <div style="display: inline-block;">
      <div class="plc-title">
        <ellipsis :length="20" tooltip>{{ name }}</ellipsis>
      </div>
      <div class="plc-type">
        <span v-if="!copyId">
          <span v-if="type===0">Banner</span>
          <span v-if="type===1">Native</span>
          <span v-if="type===2">Rewarded Video</span>
          <span v-if="type===3">Interstitial</span>
          <span v-if="type===4">Splash</span>
          <a-divider type="vertical" />
          <span style="margin-left:-2px;">{{ id }}</span>
        </span>
        <span v-else>
          <span>{{ id }}</span>
          <a-tooltip title="Copy">
            <a style="margin-left: 8px;" @click="handleCopy(id)"><img src="/icon/copy-gray.svg" alt="Copy"></a>
          </a-tooltip>
        </span>
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
    },
    copyId: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Ellipsis
  },
  data () {
    return {
      visible: true
    }
  },
  methods: {
    handleCopy (text) {
      this.$copyText(text).then(function (e) {
      }, function (e) {
      })
      this.$message.success('Copied id to the clipboard', 1)
    }
  }
}
</script>

<style lang="less" scoped>
  .plc-title {
    color:#333333;font-size: 14px;margin-bottom:4px;
  }
  .plc-type {
    color:#999999;font-size: 12px;text-align: left;
  }
</style>
