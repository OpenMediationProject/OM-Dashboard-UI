<!-- Show placement info props: id（placement_id）, name(placement_name), type(placement_type) use in AdNetworkEdit.vue -->
<template>
  <div>
    <div style="display: inline-block;vertical-align: middle;">
      <div style="color:#333333;font-size: 20px;font-weight: 500;">
        {{ name }}
      </div>
      <div style="color:#999999;font-size: 12px;">
        <span v-if="type===0">Banner</span>
        <span v-if="type===1">Native</span>
        <span v-if="type===2">Rewarded Video</span>
        <span v-if="type===3">Interstitial</span>
        <a-divider type="vertical" /> {{ id }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Placement',
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
  .plat-icon {
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }
</style>
