<template>
  <div>
    <a-form :form="form" style="margin-top:84px;text-align: center;">
      <om-form :form="form" :showTip="false" label="App Name" field="appName" style="margin-bottom:32px;position:">
        <a-input placeholder="my appname" :appName="appName" v-decorator="['appName', { initialValue: appName || '', rules: [{validator: handleCheckAppName}] }]"/>
      </om-form>
    </a-form>
    <div class="button-div">
      <a-button type="primary" style="width:168px;" ghost @click="prevStep">Previous</a-button>
      <a-button type="primary" :loading="loading" style="margin-left: 55px;width:168px" @click="nextStep">Next</a-button>
    </div>
    <a-spin :spinning="loading" style="width:100%; height: 80%;" >
    </a-spin>
  </div>
</template>

<script>
import OmForm from '@/components/OmForm'

export default {
  name: 'Step2',
  components: {
    OmForm
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      appName: this.$parent.$parent.appName,
      plat: this.$parent.$parent.appInfo.plat,
      timer: 0
    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          that.loading = false
          that.$emit('nextStep', values)
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleCheckAppName (rule, value, callback) {
      if (!value) {
        callback(new Error('App Name format is incorrect'))
      } else if (this.plat === 1 && value.length > 30) {
        callback(new Error('Android App Name max length limited to 30 characters'))
      } else if (this.plat === 0 && value.length > 50) {
        callback(new Error('iOS App Name max length limited to 50 characters'))
      } else {
        callback()
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
.button-div {
  text-align: center;
  bottom: 0;
  z-index: 100;
  position: fixed;
  width: 80%;
  height: 100px;
}
</style>
