<template>
  <a-form-item :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-bottom:20px;">
    <span slot="label"><img v-if="fill" src="/assets/Vector.svg"/> {{ label }} </span>
    <slot>
      <a-input v-if="fill" :placeholder="hint" :disabled="!canEdit" :max-length="maxlength" v-decorator="[field, { rules: [{ whitespace: true, required: true, message: label + ' can not be empty.'}] }]"/>
      <a-input v-else :disabled="!canEdit" :placeholder="hint" :max-length="maxlength" v-decorator="[field]"/>
    </slot>
    <a-tooltip v-if="tip" placement="right" :mouseEnterDelay="0.4" :mouseLeaveDelay="0.4">
      <p slot="title" v-html="tip"></p>
      <a class="tip"><a-icon type="exclamation-circle" /></a>
    </a-tooltip>
  </a-form-item>
</template>
<script>

export default {
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit
    }
  },
  name: 'OmForm',
  props: {
    label: {
      type: String,
      default: ''
    },
    fill: {
      type: Boolean,
      default: true
    },
    field: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    showTip: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: 1000
    },
    edit: {
      type: Boolean,
      default: true
    },
    hint: {
      type: String,
      default: ''
    }
  },
  watch: {
    edit (val) {
      this.canEdit = val
    }
  }
}
</script>
<style lang="less" scoped>
  img {
    margin-right:6px;margin-top:-5px;
  }
  .tip {
    position: absolute;
    margin-left: 8px;
  }
</style>
