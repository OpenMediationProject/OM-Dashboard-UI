<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="app-set-info">
      <a-card class="om-card-style" :bordered="false" style="height:72px; margin-top:24px;" >
        <div class="header_style" style="margin-left: 35%">
          <om-app-info
            style="cursor: pointer;margin-top: 16px;display: inline-block;"
            :icon="data.icon"
            :app-name="data.appName"
            :app-id="data.appId"
            :plat="data.plat"
          />
          <img v-if="!data.icon" style="margin-left: 16px;display: inline-block;" @click="linkToApp(true)" src="/icon/appedit.svg">
          <a herf="#" v-if="!data.icon && !linkStatus" @click="linkToApp(false)" class="link_href" style="margin-left: 24px;">{{ data.plat === 0? 'LINK YOUR APP WITH THE APP STORE' : 'LINK YOUR APP WITH GOOGLE PLAY' }}</a>
          <a herf="#" v-if="data.icon && data.previewUrl" @click="priview" class="link_href" style="margin-left: 24px;">{{ data.plat===0? 'VIEW IN THE APP STORE':'VIEW IN GOOGLE PLAY' }} <img style="margin-left:4px;margin-top:-2px;" src="/icon/jump.svg"></a>
        </div>
      </a-card>
      <a-card v-if="linkStatus" class="center_style" :bordered="false" :style="center_style">
        <a-divider></a-divider>
        <div class="center">
          <a-form :form="form" :hideRequiredMark="true">
            <span v-if="!editName">
              <a-form-item>
                <a-input style="width:340px;display: inline-block;margin-right:8px;margin-top:24px;" :placeholder="data.plat === 0? 'Input App Store URL': 'Input Google Play URL'" autocomplete="off" v-decorator="['appId', { rules: [{ validator: handleCheckAppId }] }]"/>
                <a-button type="primary" @click="search" :loading="loading" ghost>Search</a-button>
              </a-form-item>
              <a-skeleton
                :loading="loading"
                size="small"
                style="width:300px;margin-bottom: 0;"
                :title="false"
                :paragraph="{width: [200, 200]}"
                active
                avatar>
                <om-app-info
                  v-if="appInfo.icon"
                  style="margin-top:16px;"
                  :icon="appInfo.icon"
                  :app-name="appInfo.appName"
                  :app-id="appInfo.appId"
                  :plat="appInfo.plat"
                />
              </a-skeleton>
              <div style="margin-top:24px;" v-if="!loading">
                <a herf="#" @click="cancel" class="app-cancel">CANCEL</a>
                <a herf="#" @click="save" :disabled="!appInfo.icon" class="app-save" :style="!appInfo.icon? 'color: gray': null">SAVE</a>
              </div>
            </span>
            <span v-else>
              <om-form :form="form" :showTip="false" label="App Name" field="appName" style="margin-top:24px;margin-left:-50%;">
                <a-input :max-length="50" style="width:320px;" v-decorator="['appName', {initialValue: data.appName, rules: [{whitespace: true, validator: handleCheckAppName}] }]"/>
              </om-form>
              <div style="margin-top:24px;" v-if="!loading">
                <a herf="#" @click="cancel" class="app-cancel">CANCEL</a>
                <a herf="#" @click="saveName" class="app-save">SAVE</a>
              </div>
            </span>
          </a-form>
        </div>
      </a-card>
      <a-card class="om-card-style bottom" :bordered="false" :style="bottom_style">
        <div class="bottom_style">
          <span class="botoon_text" >App Key </span>
          <span class="appkey_text" >{{ this.data.appKey }}</span>
          <a herf="#" class="copy_img"><img src="/icon/copy.svg" @mouseenter="enter" @mouseleave="leave" @click="handleCopyAppKey(key)" alt="Copy"></a>
        </div>
      </a-card>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>

import { mapState } from 'vuex'
import { getAppList, searchAppFromStore, updateApp } from '@/api/publisher'
import OmAppInfo from '@/components/om/AppInfo'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import OmForm from '@/components/OmForm'

export default {
  name: 'TableList',
  components: {
    AFormItem,
    OmAppInfo,
    OmForm
  },
  data () {
    return {
      data: {},
      canEdit: this.$auth('app_settings.edit'),
      loading: false,
      spinning: true,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      form: this.$form.createForm(this),
      bottom_style: 'height:52px;',
      center_style: 'height:224px',
      linkStatus: false,
      curApp: this.$store.state.publisher.searchApp,
      key: '',
      searchStatus: false,
      appName: '',
      appInfo: {},
      editName: false
    }
  },
  created () {
    this.appGet()
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  methods: {
    cancel () {
      this.linkStatus = false
    },
    linkToApp (editName) {
      this.editName = editName
      this.linkStatus = true
    },
    save () {
      const { appId, appName, bundleId, category, appAdsId, icon, previewUrl } = { ...this.appInfo }
      updateApp({ id: this.searchApp, appId, appName, bundleId, category, appAdsId, icon, previewUrl })
        .then(res => {
          if (res.code === 0) {
            this.$message.success(this.$msg('pubapp.status_update'))
            this.$store.commit('UPDATESELECTLIST', new Date().getTime())
            this.appGet()
            this.linkStatus = false
          }
        })
    },
    saveName () {
      const { form: { validateFields } } = this
      const that = this
      that.loadingAdd = true
      validateFields((err, values) => {
        if (!err) {
          updateApp({ id: this.searchApp, appName: values.appName }).then(res => {
            if (res.code === 0) {
              this.$store.commit('UPDATESELECTLIST', new Date().getTime())
              this.appGet()
              this.linkStatus = false
            }
          }).finally(() => {
            that.loadingAdd = false
          })
        } else {
          that.loadingAdd = false
        }
      })
    },
    priview () {
      window.open(this.data.previewUrl)
    },
    handleCheckAppName (rule, value, callback) {
      if (!value) {
        callback(new Error(this.$msg('pubapp.name_empty')))
      } else {
        callback()
      }
    },
    appGet () {
      getAppList({ pubAppId: this.searchApp })
        .then(res => {
          if (res.data) {
            this.data = res.data[0]
            this.key = res.data[0].appKey
            this.spinning = false
          }
        })
    },
    handleCopyAppKey (text) {
      this.$copyText(text).then(function (e) {
      }, function (e) {
      })
      this.$message.success(this.$msg('pubapp.app_key_copied'), 1)
    },
    enter (e) {
      e.target.src = '/icon/copy-hover.svg'
    },
    leave (e) {
      e.target.src = '/icon/copy.svg'
    },
    getAppId (s) {
      const that = this
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
          if (that.plat !== that.data.plat) {
            this.$message.error(this.$msg('appsettings.plat_check'))
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
    handleCheckAppId (rule, value, callback) {
      if (!value) {
        if (this.data.plat === 0) {
          callback(new Error('Please enter App Store URL'))
        } else {
          callback(new Error('Please enter Google Play URL'))
        }
      } else {
        const appId = this.getAppId(value)
        if (appId) {
          callback()
        } else {
          callback(new Error(this.$msg('pubapp.id_pattern')))
        }
      }
    }
  }
}
</script>
<style type="less" scoped>
  .search {
    margin-right: 16px;
  }
  .bottom{
    margin-top: 8px;
  }
  .center_style{
    background:#FBFBFB;
  }
  .botoon_text {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    color: #333333;
    position: absolute;
    margin-top: 16px;
  }
  .header_style{
    position: absolute;
    height: 96px;
    width: 100%;
  }
  .ant-card-wider-padding .bottom_style .ant-card-body{
    padding: 24px;
  }
  .bottom_style {
    position: absolute;
    height: 52px;
    width: 100%;
    margin-left: 35%;
  }
  .app-info-plat{
    text-align: initial;
  }
  .appkey_text{
    margin-top: 16px;
    padding-left: 80px;
    color: #333333;
    display: inline-block;
  }
  .copy_img{
    margin-top: 14px;
    margin-left: 8px;
  }
  .center{
    position: absolute;
    height: 208px;
    width: 100%;
    margin-left: 35%;
  }
  .app-set-info >>> .app-info-plat {
    margin-top:-2px;
  }
  .app-set-info >>> .ant-divider {
    height: 1px;
    padding: 0;
    margin-top: -16px;
    width: 106%;
    margin-left: -2px;
  }
  .app-cancel {
    font-size: 16px;color:#1A7DF1;margin-right: 30px;font-weight: 500;
  }
  .app-save {
    font-size: 16px;color:#1A7DF1;font-weight: 500;
  }
</style>
