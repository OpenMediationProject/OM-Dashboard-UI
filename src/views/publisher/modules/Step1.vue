<template>
  <div style="height:100%">
    <a-form :form="form" :hideRequiredMark="true" style="margin-top:84px;text-align: center;" >
      <om-form :showTip="false" label="App ID" field="appId" tip="App ID" style="margin-top:-12px;">
        <a-input placeholder="App ID" autocomplete="off" :appId="appId" v-decorator="['appId', { initialValue: appId || '', rules: [{ validator: handleCheckAppId }] }]"/>
      </om-form>
    </a-form>
    <div class="button-div">
      <a-button type="primary" ghost @click="search">Import Info From Store</a-button>
      <a-button type="primary" ghost style="margin-left: 55px;width:168px" @click="nextStep">Not Live in Store</a-button>
    </div>
    <a-spin :spinning="loading" style="width:100%; height: 80%;" >
    </a-spin>
  </div>
</template>

<script>
import { searchAppFromStore } from '@/api/publisher'
import OmForm from '@/components/OmForm'

export default {
  name: 'Step1',
  components: {
    OmForm
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      appId: this.$parent.$parent.appInfo.appId || '',
      showInfo: true,
      loading: false,
      plat: 0
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          values.plat = this.plat
          this.$parent.$parent.appInfo = {}
          this.$emit('nextStep', values)
        }
      })
    },
    handleCheckAppId (rule, value, callback) {
      if (!value) {
        callback(new Error('App Id format is incorrect'))
      } else {
        const appId = this.getAppId(value, callback)
        if (appId) {
          callback()
        } else {
          callback(new Error('App id is incorrect'))
        }
      }
    },
    getAppId (s, callback) {
      const that = this
      // https://play.google.com/store/apps/details?id=com.beautyjoy.consumer
      // https://apps.apple.com/ch/app/id898246533?uo=4
      s = s.trim()
      if (!isNaN(s)) { // appleId
        that.plat = 0
        // that.$emit('platInfo', { plat: 0, appId: s })
        return s
      }
      if (/^https?:/i.test(s)) {
        const url = new URL(s)
        if (url.hostname.search('.google.com') !== -1) {
          // that.$emit('platInfo', { plat: 1, appId: s })
          that.plat = 1
          return url.searchParams.get('id')
        } else {
          const rv = /id(\d+)/i.exec(url.pathname)
          if (rv && rv.length > 1) {
            that.plat = 0
            // that.$emit('platInfo', { plat: 0, appId: s })
            return rv[1]
          }
        }
      }
      if (/^([a-zA-Z_][a-zA-Z0-9_]*)+([.][a-zA-Z_][a-zA-Z0-9_]*)+/.test(s)) {
        // that.$emit('platInfo', { plat: 1, appId: s })
        that.plat = 1
        return s
      }
      return null
    },
    search () {
      const that = this
      const { form: { validateFields } } = this
      validateFields(async (err, values) => {
        if (!err) {
          const appId = this.getAppId(values.appId)
          if (!appId) {
            return false
          }
          that.loading = true
          values.appId = appId
          try {
            const res = await searchAppFromStore({ appId })
            that.loading = false
            if (res.code === 0 && res.data) {
              that.$emit('finalCheck', res.data)
            } else {
              this.$message.error('App is not found in store')
            }
          } catch (e) {
            that.loading = false
            this.$message.error('App is not found in store')
          }
        } else {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
  .ant-col-19 {
    width: 500px;
  }
}
.button-div {
  text-align: center;
  bottom: 16px;
  z-index: 100;
  position: fixed;
  width: 80%;
  height: 100px;
}
</style>
