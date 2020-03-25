<template>
  <div :style="status?null:'opacity: 0.3;'">
    <img :src="'/logo/'+className + '.svg'"/>
  </div>
</template>

<script>

export default {
  name: 'AdNetwork',
  props: {
    className: {
      type: String,
      default: 'AdTiming',
      required: false
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
