<template>
  <span :style="status===0 ? 'opacity: 0.3;' : null" >
    <a-tag v-if="adTypes && adTypes.indexOf('RewardedVideo')>-1">{{ $t('placements.rewardedVideo') }}</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Interstitial')>-1">{{ $t('placements.interstitial') }}</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Interactive')>-1">{{ $t('placements.interactive') }}</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Native')>-1">{{ $t('placements.native') }}</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Banner')>-1">{{ $t('placements.banner') }}</a-tag>
    <a-tag v-if="adTypes && adTypes.indexOf('Splash')>-1">{{ $t('placements.splash') }}</a-tag>
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
