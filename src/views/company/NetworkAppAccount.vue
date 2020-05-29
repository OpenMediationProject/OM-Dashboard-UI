<template>
  <div v-if="id===1">
    <!-- AdTiming -->
    <om-form :form="form" label="API Token" :edit="canEdit" field="adnAppToken" :showTip="false" />
  </div>
  <div style="text-align:center;" v-else-if="id===2">
    <!-- AdMob -->
    <a-radio-group style="margin-bottom:24px;" :value="aType" @change="handleTypeChange">
      <a-radio-button style="width:160px;" :value="1">Sign in with Google</a-radio-button>
      <a-radio-button style="width:160px;" :value="2">Manual</a-radio-button>
      <a-radio-button style="width:160px;" v-if="!create" :value="0">Input/Medium</a-radio-button>
    </a-radio-group>
    <span v-if="aType===2">
      <om-form
        label="API Key"
        @change="changeValue('adnAppId', $event)"
        :defaultValue="temp ? temp.adnAppId : record.adnAppId"
        :edit="canEdit"
        field="adnAppId"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>, select &quot;All Apps&quot; in the left sidebar, then choose your app. Click &quot;View setup instructions&quot; and copy the App ID displayed in the instructions. Make sure you use the same account as you do for the &quot;Grant Access&quot; button above otherwise the access will not be granted." />
      <om-form
        label="Client ID"
        @change="changeValue('adnApiKey', $event)"
        :defaultValue="temp ? temp.adnApiKey : record.adnApiKey"
        :edit="canEdit"
        field="adnApiKey"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,OAuth 2.0 Client IDs" />
      <om-form
        label="Client Secrect"
        @change="changeValue('userSignature', $event)"
        :defaultValue="temp ? temp.userSignature : record.userSignature"
        :edit="canEdit"
        field="userSignature"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,Download OAuth 2.0 Client json file and copy this file content to here" />
      <om-form
        label="Refresh Token"
        @change="changeValue('adnAppToken', $event)"
        :defaultValue="temp ? temp.adnAppToken : record.adnAppToken"
        :edit="canEdit"
        field="adnAppToken"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>,Click the user avatar to get publisher id,Publisher ID like pub-xxxxxxxxxx" />
    </span>
    <span v-if="aType===1">
      <br/>
      <span v-if="!relogin && record && record.userId" >
        <img style="opacity: 0.3;margin-right:8px;margin-bottom:16px;" src="/icon/sign-google.svg"/>
        <a v-if="edit" @click="()=>{this.relogin = true}">Relogin</a>
      </span>
      <img @click="googleApiInit" v-else style="cursor: pointer;margin-bottom:16px;" src="/icon/sign-google.svg"/>
    </span>
    <span v-if="aType===0">
      <om-form
        label="Publisher ID"
        :defaultValue="record.userId"
        :fill="false"
        :edit="false"
        field="userId"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>,Click the user avatar to get publisher id,Publisher ID like pub-xxxxxxxxxx" />
      <om-form
        label="Client ID"
        :defaultValue="record.adnApiKey"
        :fill="false"
        :edit="false"
        field="adnApiKey"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,OAuth 2.0 Client IDs" />
      <om-form
        label="Client JSON"
        :fill="false"
        :defaultValue="record.adnAppToken"
        :edit="false"
        field="adnAppToken"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,Download OAuth 2.0 Client json file and copy this file content to here" />
      <om-form
        label="Authorized redirect URIs"
        :defaultValue="record.authKeyUrl"
        :fill="false"
        :edit="false"
        field="authKeyUrl"
        tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the Client ID for Web application page</a>, Copy this url to Authorized redirect URIs Users will be redirected to this path after they have authenticated with Google." />
      <img style="opacity: 0.3;" src="/icon/sign-google.svg"/>
    </span>
  </div>
  <div v-else-if="id===4">
    <!-- UnityAds -->
    <om-form :form="form" label="API Key" :edit="canEdit" field="adnApiKey" tip="Your API key is found on the API keys tab of the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>." />
  </div>
  <div v-else-if="id===5">
    <!-- Vungle -->
    <!-- <om-form :form="form" label="Reporting API ID" :edit="canEdit" field="reportAppId" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, find your Reporting API ID towards the bottom of the page. If you do not already have a Report ID, email Vungle at account-managers@vungle.com to request one." /> -->
    <om-form :form="form" label="Reporting API Key" :edit="canEdit" field="adnApiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Reporting API Key in the Application Details column." />
  </div>
  <div v-else-if="id===7">
    <!-- AdColony -->
    <om-form :form="form" label="Read-Only API Key" :edit="canEdit" field="adnAppToken" tip="To get User Credentials on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
  </div>
  <div v-else-if="id===8">
    <!-- AppLovin -->
    <om-form :form="form" label="Report Key" :edit="canEdit" field="adnApiKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the Report Key. If you do not see the Report Key field, email support@applovin.com and request your reporting key." />
  </div>
  <div v-else-if="id===9">
    <!-- Mopub -->
    <om-form :form="form" label="API Key" :edit="canEdit" field="adnAppId" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, check &quot;Enable data access through API&quot;. Then click the &quot;View API Access Details&quot; link to reveal your API Key." />
    <om-form :form="form" label="Inventory Report ID" :edit="canEdit" field="adnApiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, click the &quot;View API Access Details&quot; link to reveal your Inventory Report ID." />
  </div>
  <div v-else-if="id===11">
    <!-- Tapjoy -->
    <om-form :form="form" label="Publisher Reporting API Key" :edit="canEdit" field="adnAppToken" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    <om-form :form="form" label="Ad Reporting API Key" :edit="canEdit" field="adnApiKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
  </div>
  <div v-else-if="id===12">
    <!-- Chartboost -->
    <om-form :form="form" label="User ID" :edit="canEdit" field="userId" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User ID" />
    <om-form :form="form" label="User Signature" :edit="canEdit" field="userSignature" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User Signature." />
  </div>
  <div v-else-if="id===13">
    <!-- Tiktok -->
    <om-form :form="form" label="User ID" :edit="canEdit" field="userId" :showTip="false" />
    <om-form
      :form="form"
      label="Security-Key"
      :edit="canEdit"
      field="userSignature"
      :fill="false"
      :showTip="false" />
  </div>
  <div v-else-if="id===14">
    <!-- Mintegral -->
    <om-form :form="form" label="Report API SKey" :edit="canEdit" field="adnApiKey" :showTip="false" />
    <om-form :form="form" label="Report API Secret" :edit="canEdit" field="userSignature" :showTip="false" />
  </div>
  <div v-else-if="id===15">
    <!-- IronSource -->
    <om-form :form="form" label="User Name" :edit="canEdit" field="userId" tip="From <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/account/generalInfo&quot;>ironSource My Account</a> page,selected User Info Tab to get your User Name" />
    <om-form :form="form" label="Secret Key" :edit="canEdit" field="userSignature" tip="From <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/account/apiDetails&quot;>ironSource My Account</a> page,selected API Tab to get your Secret Key" />
  </div>
  <div v-else-if="id===30">
    <!-- Fyber -->
    <om-form :form="form" label="Publisher ID" :edit="canEdit" field="userId" :showTip="false" />
    <om-form :form="form" label="Consumer Key" :edit="canEdit" field="adnApiKey" :showTip="false" />
    <om-form :form="form" label="Consumer Secret" :edit="canEdit" field="userSignature" :showTip="false" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import omForm from '@/components/OmForm'
import { admobGrantToken } from '@/api/mediation'
import { importScript } from '@/api/import'
import { accountCreate, googleTokenSave } from '@/api/account'
importScript('https://apis.google.com/js/platform.js?onload=initGAPI')

export default {
  components: {
    omForm
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit,
      temp: {},
      relogin: false,
      aType: this.authType
    }
  },
  name: 'NetworkAppAccount',
  props: {
    id: {
      type: Number,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    create: {
      type: Boolean,
      default: false
    },
    authType: {
      type: Number,
      default: 1
    },
    record: {
      type: Object,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    edit (val) {
      this.canEdit = val
    }
  },
  methods: {
    changeValue (field, value) {
      this.temp[field] = value
    },
    handleTypeChange (e) {
      this.aType = e.target.value
      const that = this
      if (this.record) {
        this.record.authType = e.target.value
        const params = Object.assign(that.record, this.temp)
        setTimeout(function () {
          that.form.setFieldsValue({ adnAppId: params.adnAppId, adnApiKey: params.adnApiKey, userSignature: params.userSignature, adnAppToken: params.adnAppToken, userId: params.userId, authKeyUrl: params.authKeyUrl })
        }, 1)
      }
    },
    // googleApiInit () {
    //   this.$emit('admobAuth')
    // },
    googleApiInit () {
      const scope = 'https://www.googleapis.com/auth/adsense.readonly https://www.googleapis.com/auth/dfp'
      if (this.record && this.record.id > 0) {
        // eslint-disable-next-line no-undef
        gapi.load('auth2', _ => {
          // eslint-disable-next-line no-undef
          const GoogleAuth = gapi.auth2.init({
            client_id: '22744042822-iec4lvvm2vgqkshnom4jrv2opjel3kd5.apps.googleusercontent.com',
            fetch_basic_profile: false,
            scope: scope
          })
          GoogleAuth.grantOfflineAccess({
            scope: scope,
            prompt: 'select_account'
          }).then(resp => {
            if (resp.code) {
              const params = { accountId: this.record.id, authCode: resp.code }
              googleTokenSave(params).then(res => {
                if (res.code === 0) {
                  this.$emit('authSuccess', this.record.id)
                  this.$message.success('success')
                }
              })
            }
          })
        })
      } else {
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          if (!err) {
            values.authType = this.aType
            if (this.record) {
              values.id = this.record.id
              values.adnAccountId = this.record.adnAccountId
            } else {
              values.adnAccountId = 0
            }
            values.adnId = 2
            accountCreate(values).then(res => {
              if (res.code === 0) {
                if (this.record) {
                  this.record = Object.assign(this.record, res.data)
                } else {
                  this.record = res.data
                }
                // eslint-disable-next-line no-undef
                gapi.load('auth2', _ => {
                  // eslint-disable-next-line no-undef
                  const GoogleAuth = gapi.auth2.init({
                    client_id: '22744042822-iec4lvvm2vgqkshnom4jrv2opjel3kd5.apps.googleusercontent.com',
                    fetch_basic_profile: false,
                    scope: scope
                  })
                  GoogleAuth.grantOfflineAccess({
                    scope: scope,
                    prompt: 'select_account'
                  }).then(resp => {
                    if (resp.code) {
                      const params = { accountId: this.record.id, authCode: resp.code }
                      googleTokenSave(params).then(res => {
                        if (res.code === 0) {
                          this.$emit('authSuccess', this.record.id)
                          this.$message.success('success')
                        }
                      })
                    }
                  })
                })
              }
            })
          }
        })
      }
    },
    grantToken () {
      const params = { accountId: this.record.id }
      admobGrantToken(params).then(res => {
        if (res.code === 0 && res.data) {
          window.open(res.data, 'newwindow', 'width=800, height=600')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
img {
margin-left:6px;margin-top:-5px;
}
.tip {
  position: absolute;
  top: 1px;
  margin-left: 8px;
}
.ant-form-item {
  margin-bottom: 12px;
}
</style>
