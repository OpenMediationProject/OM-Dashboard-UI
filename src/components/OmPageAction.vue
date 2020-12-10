<template>
  <span>
    <a v-if="canEdit && confirm" @click="$emit('save')" :disabled="load" style="position: fixed;right: 144px;top: 16px;z-index: 2;"><img src="/icon/savechange.svg" /></a>
    <a @click="showConfirm" style="position: fixed;right: 16px;top: 21px;z-index: 2;"><img src="/icon/close.svg" /></a>
    <a-modal
      width="385px"
      height="160px"
      style="box-shadow: 0 2px 16px rgba(1, 6, 12, 0.1);border-radius: 4px;"
      :visible="visible"
      :closable="false"
      :bodyStyle="{padding: 24}"
      :footer="null"
      :maskClosable="false"
      :keyboard="false">
      <div>
        <div style="display: inline-block;text-align: center">
          <p style="color:#333333;font-size: 26px;margin-bottom: 4px;">Unsaved changes </p>
          <p>Your changes will be lost, if you dont't save. </p>
          <div style="margin-top: 24px;text-align: left;">
            <a-button type="primary" ghost @click="close">Don't Save</a-button>
            <a-button type="primary" style="margin-left: 64px;" ghost @click="visible=false">Cancel</a-button>
            <a-button type="primary" style="margin-left: 16px;" @click="save">Save</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </span>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      load: this.loading
    }
  },
  name: 'OmPageAction',
  watch: {
    loading (v) {
      this.load = v
    }
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: true
    },
    hasChange: {
      type: Function,
      default: () => { return false }
    }
  },
  methods: {
    /**
     * hasChange为传入的比较函数，用于外部判断是否有变动，如果没有变动直接关闭
     */
    showConfirm () {
      if (this.canEdit && this.confirm && this.hasChange()) {
        this.visible = true
      } else {
        this.close()
      }
    },
    close () {
      this.$router.push({ path: this.$route.meta.parent })
    },
    save () {
      this.$emit('save')
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
