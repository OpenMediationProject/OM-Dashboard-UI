<template>
  <span>
    <span class="item-title">{{ name }}</span>
    <img class="item-icon" v-if="adTypes.indexOf('RewardedVideo')>-1" src="/icon/placement/Video.svg" >
    <img class="item-icon" v-if="adTypes.indexOf('Interstitial')>-1" src="/icon/placement/Interstitial.svg" >
    <img class="item-icon" v-if="adTypes.indexOf('Native')>-1" src="/icon/placement/Native.svg" >
    <img class="item-icon" v-if="adTypes.indexOf('Banner')>-1" src="/icon/placement/banner.svg" >
    <img class="item-icon" v-if="adTypes.indexOf('Interactive')>-1" src="/icon/placement/iav.svg" >
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
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.item-icon {
  width: 12.97px;
  height: 23.95px;
  margin-right: 8px;
}
.item-title {
  height: 24px;
  font-size: 18px;
  line-height: 23px;
  text-align: justify;
  color: #333333;
  margin-right: 16px;
}
</style>
