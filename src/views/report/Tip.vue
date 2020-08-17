<template>
  <a-tooltip v-if="tip" placement="right" :mouseEnterDelay="0.4" :mouseLeaveDelay="0.1">{{ title }}
    <span slot="title">{{ tip }}</span>
    <a class="tip"><a-icon type="info-circle" /></a>
  </a-tooltip>
  <span v-else>{{ title }}</span>
</template>

<script>
export default {
  name: 'FieldsTip',
  components: {
  },
  props: {
    tip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style type="less" scoped>
</style>
