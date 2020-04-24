<template>
  <span :style="status===0 ? 'opacity: 0.3;' : null" >
    <a-tag v-if="adTypes && adTypes.indexOf('RewardedVideo')>-1">Rewarded Video</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Interstitial')>-1">Interstitial</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Native')>-1">Native</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Banner')>-1">Banner</a-tag>
  </span>
</template>

<script>
export default {
  name: 'AdType',
  props: {
    adTypes: {
      type: Array,
      required: true
    },
    status: {
      type: Number,
      required: false,
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
</style>
