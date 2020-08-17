<template>
  <a-row>
    <a-col :span="8"></a-col>
    <a-col style="text-align: left" :span="8">
      <a-form-item :colon="false" style="margin-bottom:20px;">
        <span slot="label"><img v-if="fill" src="/assets/Vector.svg"/> {{ label }} </span>
        <slot>
          <a-textarea
            @change="change"
            autoSize
            v-if="fill"
            :placeholder="hint"
            :disabled="!canEdit"
            :max-length="maxlength"
            @focus="()=>{if(this.form) {this.form.validateFields([field])}}"
            v-decorator="[field, {initialValue: defaultValue, rules: [{ whitespace: true, required: true, message: label + ' can not be empty.'}] }]"/>
          <a-textarea
            @change="change"
            v-else
            autoSize
            :disabled="!canEdit"
            :placeholder="hint"
            :max-length="maxlength"
            v-decorator="[field,{initialValue: defaultValue}]"/>
        </slot>
        <AdtTip :tip="tip" />
        <a-tooltip v-if="copy" title="Copy" :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
          <a class="tip"><img src="/icon/copy.svg" @mouseenter="enter" @mouseleave="leave" @click="handleCopy(defaultValue)" alt="Copy"></a>
        </a-tooltip>
      </a-form-item>
    </a-col>
    <a-col :span="8"></a-col>
  </a-row>
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
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
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
    defaultValue: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: null
    },
    copy: {
      type: Boolean,
      default: false
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
    },
    enter (e) {
      e.target.src = '/icon/copy-hover.svg'
    },
    leave (e) {
      e.target.src = '/icon/copy.svg'
    },
    handleCopy (text) {
      this.$copyText(text).then(function (e) {
      }, function (e) {
      })
      this.$message.success(`Copied success`, 1)
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
