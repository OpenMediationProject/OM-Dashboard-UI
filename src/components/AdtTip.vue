<template>
  <a-tooltip v-if="tip" placement="right" :mouseEnterDelay="0.4" :mouseLeaveDelay="0.4">
    <span slot="title" v-html="tip"></span>
    <a class="tip"><a-icon type="exclamation-circle" /></a>
  </a-tooltip>
</template>
<script>

export default {
  data () {
    return {
    }
  },
  name: 'AdtTip',
  props: {
    tip: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
.tip {
  position: absolute;
  margin-left: 8px;
}
</style>
