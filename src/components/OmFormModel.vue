<template>
  <a-form-model-item
    v-if="type==='inline'"
    :colon="false"
    :label-col="labelCol"
    :ref="field"
    :prop="field"
    :wrapper-col="wrapperCol || wrapper"
    style="margin-bottom:16px;">
    <span slot="label"><img v-if="fill" src="/assets/Vector.svg"/> {{ label }} </span>
    <slot style="display: inline-block;">
    </slot>
    <AdtTip :tip="tip"/>
  </a-form-model-item>
  <a-form-model-item
    class="warp"
    v-else
    :colon="false"
    :label-col="{ lg: { span: 24 }, sm: { span: 24 } }"
    :ref="field"
    :prop="field"
    :wrapper-col="{ lg: { span: 24 }, sm: { span: 24 } }"
    style="margin-bottom:16px;">
    <div slot="label" style="text-align: left;"><img v-if="fill" src="/assets/Vector.svg"/> {{ label }}</div>
    <slot style="display: inline-block;">
    </slot>
    <AdtTip :tip="tip"/>
  </a-form-model-item>
</template>
<script>
import AdtTip from '@/components/AdtTip'

export default {
  components: {
    AdtTip
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapper: { lg: { span: 8 }, sm: { span: 8 } },
      canEdit: this.edit,
      data: this.form
    }
  },
  name: 'OmFormModel',
  props: {
    label: {
      type: String,
      default: ''
    },
    wrapperCol: {
      type: Object,
      default: null
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
    },
    form: {
      type: Object,
      default: null
    },
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'inline'
    }
  },
  watch: {
    edit (val) {
      this.canEdit = val
    }
  },
  methods: {
    change (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
<style type="less" scoped>
  img {
    margin-right: 6px;
    margin-top: -5px;
  }

  .tip {
    position: absolute;
    margin-left: 8px;
  }

  .warp >>> .ant-form-item-label {
    margin-bottom: -40px;
  }
</style>
