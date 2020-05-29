<template>
  <div class="step3">
    <a-form :form="form" style="max-width: 500px;margin: 64px auto 0;">
      <om-app-info
        :icon="appInfo.icon"
        :app-name="appInfo.appName"
        :app-id="appInfo.appId"
        :plat="appInfo.plat"
      />
      <a-form-item>
        <div class="coppa">
          <div class="coppa-content">
            <div class="coppa-title">COPPA Compliance</div>
            <a-checkbox @change="onChange" v-decorator="['coppa', { initialValue: '', rules: [ {validator: checkCoppa}] }]" class="coppa-checkbox"></a-checkbox>
            <div style="display: inline-flex;"><span class="coppa-detail">By checking this box, I hereby represent and warrant that this app is not directed at users under the age of 13 and will at all times comply with AdTiming policies.</span></div>
          </div>
        </div>
      </a-form-item>
    </a-form>
    <div class="button-div">
      <a-button type="primary" style="width:168px;" ghost @click="prevStep">Previous</a-button>
      <a-button type="primary" style="margin-left: 55px;width:168px" :loading="loading" @click="createApp">Add</a-button>
    </div>
  </div>
</template>

<script>
import { Result } from '@/components'
import OmAppInfo from '@/components/om/AppInfo'
import { createApp } from '@/api/publisher'

export default {
  name: 'Step3',
  components: {
    Result,
    OmAppInfo
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      appInfo: this.$parent.$parent.appInfo
    }
  },
  methods: {
    finish () {
      this.$emit('finish')
    },
    prevStep () {
      this.$emit('prevStep')
    },
    toAppList () {
      this.$router.push('/publisher/apps')
    },
    createApp () {
      const that = this
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          that.loading = true
          createApp(that.appInfo).then(res => {
            if (res.code === 0) {
              that.loading = false
              this.$router.push('/publisher/app/list')
              this.$store.commit('UPDATESELECTLIST', new Date().getTime())
            } else {
              that.loading = false
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    checkCoppa (rule, value, callback) {
      if (!value) {
        callback(new Error('Must be checked.'))
      } else {
        callback()
      }
    },
    onChange () {
      console.log(this.form.getFieldsValue())
    }
  }
}
</script>
<style type="less" scoped>
  .information {
    line-height: 22px;
  }
  .information .ant-row:not(:last-child) {
      margin-bottom: 24px;
  }
  .money {
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
  .coppa {
    width: 465px;
    height: 128px;
    background:rgba(0, 207, 8, 0.06);
    border-radius: 2px;
    margin-top: 40px
  }
  .coppa-content {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }
  .coppa-title {
    height: 16px;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
    margin-left: 16px;
    margin-top: 16px;
  }
  .coppa-detail {
    margin-left: 5px;
    width: 380px;
    height: 54px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #666666;
  }
  .coppa-checkbox {
    margin-left: 16px
  }
  .selected-app {
    margin-left: 120px;
  }
  .step3 >>> .ant-form-explain {
    margin-left: 46px;
    margin-top: -28px;
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
