<template>
  <div>
    <div @click="handleClick" style="background: black;width: 100vw;height: 100vh;position: fixed;top: 0;left: 0;opacity: 0.3;z-index: 1001;"></div>
    <a-modal
      width="385px"
      height="160px"
      style="box-shadow: 0 2px 16px rgba(1, 6, 12, 0.1);border-radius: 4px;z-index: 1003;position: relative;"
      :visible="visible"
      :closable="false"
      :bodyStyle="{padding: 24}"
      :footer="null"
      :maskClosable="false"
      :keyboard="false">
      <div>
        <div style="text-align: center">
          <p style="color:#333333;font-size: 26px;margin-bottom: 4px;">{{ $t('pageHead.unsavedChanges') }}</p>
          <p style="text-align: center;">{{ $t('pageHead.tip1') }}</p>
          <div style="margin-top: 24px;text-align: left;">
            <a-button type="primary" ghost @click="close">{{ $t('pageHead.dontSave') }}</a-button>
            <a-button type="primary" style="float: right;margin-right: 0px;" @click="save">{{ $t('comm.save') }}</a-button>
            <a-button type="primary" style="float: right;margin-right: 16px;" ghost @click="visible=false">{{ $t('comm.cancel') }}</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'OmFocus',
  components: {
  },
  props: {
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    handleClick () {
      // this.visible = true
      this.$emit('click')
    },
    save () {
      this.visible = false
      this.$emit('save')
    },
    close () {
      this.visible = false
      this.$emit('cancel')
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
