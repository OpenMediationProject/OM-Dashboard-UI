<template>
  <div :style="status ? null : 'opacity: 0.3;'">
    <img :src="GLOBAL.getAdnIconById(id).icon"/>
  </div>
</template>

<script>

export default {
  name: 'AdNetwork',
  props: {
    id: {
      type: Number,
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
