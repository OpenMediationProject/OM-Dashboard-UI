<template>
  <a-alert
    v-if="visible"
    type="info"
    closable
    :after-close="handleClose"
  >
    <span slot="message" style="text-align: center;width: 100%;">
      <div class="ghost-button-default" style="text-align:center; margin-top:16px;">
        <div style="text-align:center; font-size: 16px;color: #333333;font-weight: bold;padding-bottom: 12px;"><img style="margin-top: -4px;margin-right:4px;" src="/icon/success.svg">{{ message.title }}</div>
        <span style="font-size:14px;color: #666666">{{ message.content }} <a-button
          v-if="message.button"
          @click="handleClick"
          size="small"
          style="margin-bottom:16px;"
          type="primary"
          ghost>{{ message.button }}</a-button></span>
      </div>
    </span>
  </a-alert>
</template>

<script>

export default {
  name: 'OmAlert',
  components: {
  },
  props: {
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: true
    }
  },
  methods: {
    handleClose () {
      this.visible = false
      localStorage.removeItem('show-create-placement')
    },
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
<style type="less" scoped>
  .search {
    margin-right: 8px;
  }
  .ant-alert-info {
    background-color: #E0F6FF;
    border:none;
  }
</style>
