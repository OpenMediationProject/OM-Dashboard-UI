<template>
  <a-card class="app-create" :bordered="false" :style="style">
    <OmPageAction :confirm="false" :canEdit="true" />
    <div class="content" style="height:100%">
      <div style="text-align: center;" v-show="currentTab === 0">
        <div class="addapp-title">Have you published your app on Google Play or the App Store?</div>
        <div><a @click="currentTab=2" style="margin-right:48px;font-weight: bold;font-size: 20px;">Yes</a><a style="font-weight: bold;font-size: 20px;" @click="currentTab=3">No</a></div>
      </div>
      <div style="margin-left: 30%;" v-if="currentTab === 2" @prevStep="prevStep">
        <div class="addapp-title">Find your app on Google Play & the App Store</div>
        <div style="margin-left: 40px;" >
          <a-form :form="form" :hideRequiredMark="true">
            <div>
              <a-form-item>
                <a-input style="width:340px;display: inline-block;margin-right:8px;" placeholder="Input App Store or Google Play URL" autocomplete="off" v-decorator="['appId', { rules: [{ validator: handleCheckAppId }] }]"/>
                <a-button type="primary" @click="search" :loading="loading" ghost>Search</a-button>
                <adt-tip :tip="$msg('pubapp.app_id_tip')" />
              </a-form-item>
              <a-skeleton
                :loading="loading"
                style="width:300px;"
                :title="false"
                :paragraph="{width: [200, 200]}"
                active
                avatar>
                <om-app-info
                  v-if="appInfo.icon"
                  style="margin-top:32px;"
                  :icon="appInfo.icon"
                  :app-name="appInfo.appName"
                  :app-id="appInfo.appId"
                  :plat="appInfo.plat"
                />
              </a-skeleton>
              <a-form-item v-if="appInfo.icon" class="check">
                <div class="coppa">
                  <div class="coppa-content">
                    <div class="coppa-title">COPPA Compliance</div>
                    <a-checkbox v-decorator="['coppa', { initialValue: '', rules: [ {validator: checkCoppa}] }]" class="coppa-checkbox"></a-checkbox>
                    <div style="display: inline-flex;"><span class="coppa-detail">By checking this box, I hereby represent and warrant that this app is not directed at users under the age of 13 and will at all times comply with AdTiming policies.</span></div>
                  </div>
                </div>
              </a-form-item>
              <div class="button-div">
                <a-button type="primary" style="width:120px" ghost @click="prevStep">Back</a-button>
                <a-button type="primary" style="margin-left: 24px;width:120px" :disabled="!appInfo.icon" :loading="loadingAdd" @click="createApp(false)">Add</a-button>
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <div style="margin-left: 30%;" v-if="currentTab === 3" @prevStep="prevStep">
        <div class="addapp-title" style="margin-left: 10%;">Enter your App Info</div>
        <a-form :form="form" style="margin-left: -36%;" :hideRequiredMark="true">
          <om-form :form="form" label="Platform" :tip="$msg('pubapp.platform_tip')" >
            <a-radio-group v-model="plat">
              <a-radio :value="0">
                iOS
              </a-radio>
              <a-radio :value="1">
                Android
              </a-radio>
            </a-radio-group>
          </om-form>
          <om-form :form="form" :tip="$msg('pubapp.app_name_tip')" label="App Name" field="appName" style="margin-bottom:8px;">
            <a-input :max-length="maxlength" v-decorator="['appName', { rules: [{whitespace: true, validator: handleCheckAppName}] }]"/>
          </om-form>
          <om-form class="check" :form="form" :fill="false" label="" :showTip="false" >
            <div class="coppa">
              <div class="coppa-content">
                <div class="coppa-title">COPPA Compliance</div>
                <a-checkbox v-decorator="['coppa', { initialValue: '', rules: [ {validator: checkCoppa}] }]" class="coppa-checkbox"></a-checkbox>
                <div style="display: inline-flex;"><span class="coppa-detail">By checking this box, I hereby represent and warrant that this app is not directed at users under the age of 13 and will at all times comply with AdTiming policies.</span></div>
              </div>
            </div>
          </om-form>
          <om-form :fill="false" label="" :showTip="false">
            <div>
              <a-button type="primary" style="width:120px; display: inline-block;" ghost @click="prevStep">Back</a-button>
              <a-button type="primary" style="margin-left: 24px;width:120px" :loading="loadingAdd" @click="createApp(true)">Add</a-button>
            </div>
          </om-form>
        </a-form>
      </div>
    </div></a-card>
</template>

<script>

import { createApp, searchAppFromStore } from '@/api/publisher'
import OmAppInfo from '@/components/om/AppInfo'
import OmForm from '@/components/OmForm'
import AdtTip from '@/components/AdtTip'
import OmPageAction from '@/components/OmPageAction'

export default {
  name: 'AppCreate',
  components: {
    OmAppInfo,
    OmForm,
    AdtTip,
    OmPageAction
  },
  created () {
    this.style = 'height:' + (window.innerHeight - 140) + 'px; padding: 32px;margin-top:0;'
  },
  computed: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      currentTab: 0,
      params: {},
      maxlength: 50,
      plat: 0,
      loading: false,
      loadingAdd: false,
      publisherId: 0,
      currentStep: 0,
      appInfo: { appId: '' },
      style: 'height:600px'
    }
  },
  methods: {
    prevStep () {
      this.currentTab = 0
      this.appInfo = {}
    },
    platInfo (data) {
      this.appId = data.appId
      this.plat = data.plat
      if (!this.appInfo) {
        this.appInfo = {}
      }
      this.appInfo.plat = data.plat
    },
    finalCheck (params) {
      this.appInfo = params
      this.currentTab = 2
    },
    finish () {
      this.currentTab = 0
    },
    handleCheckAppId (rule, value, callback) {
      if (!value) {
        callback(new Error(this.$msg('pubapp.id_empty')))
      } else {
        const appId = this.getAppId(value)
        if (appId) {
          callback()
        } else {
          callback(new Error(this.$msg('pubapp.id_pattern')))
        }
      }
    },
    handleCheckAppIdAndroid (rule, value, callback) {
      if (!value) {
        callback(new Error('Please enter app id'))
      } else {
        if (/^([a-zA-Z_][a-zA-Z0-9_]*)+([.][a-zA-Z_][a-zA-Z0-9_]*)+/.test(value)) {
          callback()
        } else {
          callback(new Error(this.$msg('pubapp.id_pattern')))
        }
      }
    },
    handleCheckAppName (rule, value, callback) {
      if (!value) {
        callback(new Error(this.$msg('pubapp.name_empty')))
      } else {
        callback()
      }
    },
    getAppId (s) {
      const that = this
      // https://play.google.com/store/apps/details?id=com.beautyjoy.consumer
      // https://apps.apple.com/ch/app/id898246533?uo=4
      s = s.trim()
      if (!isNaN(s)) { // appleId
        that.plat = 0
        return s
      }
      if (/^https?:/i.test(s)) {
        const url = new URL(s)
        if (url.hostname.search('.google.com') !== -1) {
          that.plat = 1
          return url.searchParams.get('id')
        } else {
          const rv = /id(\d+)/i.exec(url.pathname)
          if (rv && rv.length > 1) {
            that.plat = 0
            return rv[1]
          }
        }
      }
      if (/^([a-zA-Z_][a-zA-Z0-9_]*)+([.][a-zA-Z_][a-zA-Z0-9_]*)+/.test(s)) {
        that.plat = 1
        return s
      }
      return null
    },
    search () {
      const that = this
      const { form: { validateFields } } = this
      this.appInfo = {}
      validateFields(async (err, values) => {
        if (!err || !this.appInfo.icon) {
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
              this.appInfo = res.data
            } else {
              this.$message.error(this.$msg('pubapp.app_not_found'))
            }
          } catch (e) {
            that.loading = false
            this.$message.error(this.$msg('pubapp.app_not_found'))
          }
        }
      })
    },
    checkCoppa (rule, value, callback) {
      if (!value) {
        callback(new Error(this.$msg('pubapp.coppa_not_allowed')))
      } else {
        callback()
      }
    },
    createApp (tag) {
      const that = this
      if (this.loadingAdd) {
        return false
      }
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          const data = { ...that.appInfo }
          if (tag) {
            data.plat = that.plat
            data.appName = values.appName
          } else {
            if (!data.icon) {
              that.$message.error(this.$msg('pubapp.app_not_found'))
              return false
            }
          }
          that.loadingAdd = true
          createApp(data).then(res => {
            if (res.code === 0) {
              that.loadingAdd = false
              localStorage.setItem('show-create-placement', '1')
              this.$store.commit('UPDATESELECTLIST', new Date().getTime())
              this.$store.commit('SET_HAS_APP', true)
              this.$router.push('/publisher/app/list')
            }
          }).finally(() => {
            that.loadingAdd = false
          })
        }
      })
    }
  }
}
</script>

<style type="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
  .ant-card{
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
    border: 4px solid #f5f5f5;
  }
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
    margin-top: 24px;
    margin-bottom: 16px;
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
  .app-create .check >>> .ant-form-explain {
    margin-left: 46px;
    margin-top: -42px;
    margin-bottom: 20px;
  }
  .addapp-title {
    font-size: 24px;
    color: #333333;
    padding-bottom: 32px;
  }
  .app-create >>> .app-info-plat {
    margin-top:-2px;
  }
  .button-div {
    margin-top:32px;
  }
</style>
