<template>
  <div>
    <om-form v-if="id!==2" :form="form" label="Currency">
      <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
    </om-form>
    <div v-if="id===1">
      <!-- AdTiming -->
      <om-form
        :form="form"
        label="API Token"
        :msg="$msg('account.api_token')"
        :edit="canEdit"
        field="adnAppToken"
      />
    </div>
    <div style="text-align:center;" v-else-if="id===2">
      <!-- AdMob -->
      <a-radio-group style="margin-bottom:24px;" :value="aType" @change="handleTypeChange">
        <a-radio-button style="width:160px;" :value="1" v-if="authType === 1">Sign in with Google</a-radio-button>
        <a-radio-button style="width:160px;" :value="3" v-else>Sign in with Google</a-radio-button>
        <a-radio-button style="width:160px;" :value="2" v-if="authType === 2">Manual</a-radio-button>
        <a-radio-button style="width:160px;" :value="4" v-else>Manual</a-radio-button>
        <a-radio-button style="width:160px;" v-if="!create" :value="0">Input/Medium</a-radio-button>
      </a-radio-group>
      <span v-if="aType===4">
        <om-form :form="form" label="Currency">
          <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
        </om-form>
        <om-form
          label="API Key"
          @change="changeValue('adnAppId', $event)"
          :defaultValue="temp ? temp.adnAppId : record.adnAppId"
          :edit="canEdit"
          :msg="$msg('account.api_key')"
          field="adnAppId"
          :tip="$msg('account.admob_api_key_tip')" />
        <om-form
          label="Client ID"
          @change="changeValue('adnApiKey', $event)"
          :defaultValue="temp ? temp.adnApiKey : record.adnApiKey"
          :edit="canEdit"
          :msg="$msg('account.client_id')"
          field="adnApiKey"
          :tip="$msg('account.admob_client_id_tip')" />
        <om-form
          label="Client Secrect"
          :msg="$msg('account.client_secrect')"
          @change="changeValue('userSignature', $event)"
          :defaultValue="temp ? temp.userSignature : record.userSignature"
          :edit="canEdit"
          field="userSignature"
          :tip="$msg('account.admob_client_secrect_tip')" />
        <om-form
          label="Refresh Token"
          :msg="$msg('account.refresh_token')"
          @change="changeValue('adnAppToken', $event)"
          :defaultValue="temp ? temp.adnAppToken : record.adnAppToken"
          :edit="canEdit"
          field="adnAppToken"
          :tip="$msg('account.admob_refresh_token_tip')" />
      </span>
      <span v-if="aType===3">
        <br/>
        <om-form :form="form" label="Currency">
          <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
        </om-form>
        <om-form
          label="Publisher ID"
          :fill="false"
          :edit="false"
          field="userId"
          :tip="$msg('account.admob_publisher_id')" />
        <a-spin tip="Processing..." class="spinStyle" :class="spinning? 'proSpin' : 'proSpin'" :spinning="spinning" v-if="!relogin && record && record.userId">
          <span class="signGoogleSpan_s1">
            <img style="opacity: 0.3; padding: 0;margin: 8px 0;" src="/icon/sign-google.svg"/><br>
            <a style="margin-left: 18px" v-if="edit" @click="()=>{this.relogin = true}">Relogin</a>
          </span>
        </a-spin>
        <a-spin tip="Processing..." class="spinStyle" :class="spinning? '' : 'proSpin'" :spinning="spinning" v-else>
          <span class="signGoogleSpan_s1">
            <img @click="googleApiInit" style="cursor: pointer;margin: 8px 0;" src="/icon/sign-google.svg"/>
          </span>
        </a-spin>
        <!-- <span v-if="!relogin && record && record.userId" >
          <img style="opacity: 0.3;margin-right:8px;margin-bottom:8px;" src="/icon/sign-google.svg"/><br>
          <a v-if="edit" @click="()=>{this.relogin = true}">Relogin</a>
        </span>
        <img @click="googleApiInit" v-else style="cursor: pointer;margin-bottom:16px;" src="/icon/sign-google.svg"/> -->
      </span>
      <span v-if="aType===2">
        <om-form :form="form" label="Currency">
          <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
        </om-form>
        <om-form
          label="API Key"
          @change="changeValue('adnAppId', $event)"
          :defaultValue="temp ? temp.adnAppId : record.adnAppId"
          :edit="canEdit"
          :msg="$msg('account.api_key')"
          field="adnAppId"
          :tip="$msg('account.admob_api_key_tip')" />
        <om-form
          label="Client ID"
          @change="changeValue('adnApiKey', $event)"
          :defaultValue="temp ? temp.adnApiKey : record.adnApiKey"
          :edit="canEdit"
          :msg="$msg('account.client_id')"
          field="adnApiKey"
          :tip="$msg('account.admob_client_id_tip')" />
        <om-form
          label="Client Secrect"
          :msg="$msg('account.client_secrect')"
          @change="changeValue('userSignature', $event)"
          :defaultValue="temp ? temp.userSignature : record.userSignature"
          :edit="canEdit"
          field="userSignature"
          :tip="$msg('account.admob_client_secrect_tip')" />
        <om-form
          label="Refresh Token"
          :msg="$msg('account.refresh_token')"
          @change="changeValue('adnAppToken', $event)"
          :defaultValue="temp ? temp.adnAppToken : record.adnAppToken"
          :edit="canEdit"
          field="adnAppToken"
          :tip="$msg('account.admob_refresh_token_tip')" />
      </span>
      <span v-if="aType===1">
        <br/>
        <om-form :form="form" label="Currency">
          <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
        </om-form>
        <om-form
          label="Publisher ID"
          :fill="false"
          :edit="false"
          field="userId"
          :tip="$msg('account.admob_publisher_id')" />
        <a-spin tip="Processing..." class="spinStyle" :class="spinning? 'proSpin' : 'proSpin'" :spinning="spinning" v-if="!relogin && record && record.userId">
          <span class="signGoogleSpan_s1">
            <img style="opacity: 0.3; padding: 0;margin: 8px 0;" src="/icon/sign-google.svg"/><br>
            <a style="margin-left: 18px" v-if="edit" @click="()=>{this.relogin = true}">Relogin</a>
          </span>
        </a-spin>
        <a-spin tip="Processing..." class="spinStyle" :class="spinning? '' : 'proSpin'" :spinning="spinning" v-else>
          <span class="signGoogleSpan_s1">
            <img @click="googleApiInit" style="cursor: pointer;margin: 8px 0;" src="/icon/sign-google.svg"/>
          </span>
        </a-spin>
      </span>
      <span v-if="aType===0">
        <om-form :form="form" label="Currency">
          <CurrencySelect default-value="USD" :edit="canEdit" :adnId="record" />
        </om-form>
        <om-form
          label="Publisher ID"
          :defaultValue="record.userId"
          :fill="false"
          :edit="false"
          field="userId"
          :tip="$t('account.admob_user_id_tip')" />
        <om-form
          label="Client ID"
          :defaultValue="record.adnApiKey"
          :fill="false"
          :edit="false"
          field="adnApiKey"
          :tip="$t('account.admob_client_id_tip')" />
        <om-form
          label="Client JSON"
          :fill="false"
          :defaultValue="record.adnAppToken"
          :edit="false"
          field="adnAppToken"
          :tip="$t('account.admob_client_json_tip')" />
        <om-form
          label="Authorized redirect URIs"
          :defaultValue="record.authKeyUrl"
          :fill="false"
          :edit="false"
          field="authKeyUrl"
          :tip="$t('account.admob_auth_url_tip')" />
        <div class="spinStyle">
          <span class="signGoogleSpan_s2">
            <img style="opacity: 0.3;cursor: pointer;margin: 8px 0;" src="/icon/sign-google.svg"/>
          </span>
        </div>
      </span>
    </div>
    <div v-else-if="id===4">
      <!-- UnityAds -->
      <om-form
        :form="form"
        label="Monetization Stats API key"
        :msg="$msg('account.api_key')"
        :edit="canEdit"
        field="adnApiKey"
        :tip="$msg('account.unity_api_key_tip')" />
      <om-form
        :form="form"
        label="Organization core ID"
        :edit="canEdit"
        field="userId"
        :tip="$msg('account.unity_org_id_tip')"
        :fill="false"
      />
    </div>
    <div v-else-if="id===5">
      <!-- Vungle -->
      <om-form
        :form="form"
        label="Reporting API Key"
        :msg="$msg('account.reporting_api_key')"
        :edit="canEdit"
        field="adnApiKey"
        :tip="$msg('account.vungle_reporting_api_key_tip')" />
    </div>
    <div v-else-if="id===6">
      <!-- TencentAds -->
      <om-form
        :form="form"
        label="Member ID"
        msg="Member ID can not be empty."
        :edit="canEdit"
        field="userId" />
      <om-form
        :form="form"
        label="Secret"
        :fill="false"
        :edit="canEdit"
        field="userSignature"
        tip="Please contact your Tencent Ads AM to get your secret." />
    </div>
    <div v-else-if="id===7">
      <!-- AdColony -->
      <om-form
        :form="form"
        label="Read-Only API Key"
        :msg="$msg('account.read_only_api_key')"
        :edit="canEdit"
        field="adnAppToken"
        :tip="$msg('account.adcolony_read_only_api_key_tip')" />
    </div>
    <div v-else-if="id===8">
      <!-- AppLovin -->
      <om-form
        :form="form"
        label="Report Key"
        :msg="$msg('account.report_key')"
        :edit="canEdit"
        field="adnApiKey"
        :tip="$msg('account.applovin_report_key_tip')" />
    </div>
    <div v-else-if="id===9">
      <!-- Mopub -->
      <om-form
        :form="form"
        label="API Key"
        :msg="$msg('account.api_key')"
        :edit="canEdit"
        field="adnAppId"
        :tip="$msg('account.mopub_api_key_tip')" />
      <om-form
        :form="form"
        label="Inventory Report ID"
        :msg="$msg('account.inventory_report_id')"
        :edit="canEdit"
        field="adnApiKey"
        :tip="$msg('account.mopub_inventory_report_id_tip')" />
    </div>
    <div v-else-if="id===11">
      <!-- Tapjoy -->
      <om-form
        :form="form"
        label="Publisher Reporting API Key"
        :msg="$msg('account.publisher_reporting_api_key')"
        :edit="canEdit"
        field="adnAppToken"
        :tip="$msg('account.tapjoy_publisher_reporting_api_key_tip')" />
      <om-form
        :form="form"
        label="Ad Reporting API Key"
        :msg="$msg('account.ad_reporting_api_key')"
        :edit="canEdit"
        field="adnApiKey"
        :tip="$msg('account.tapjoy_ad_reporting_api_key_tip')" />
    </div>
    <div v-else-if="id===12">
      <!-- Chartboost -->
      <om-form
        :form="form"
        label="User ID"
        :msg="$msg('account.user_id')"
        :edit="canEdit"
        field="userId"
        :tip="$msg('account.chartboost_user_id_tip')" />
      <om-form
        :form="form"
        label="User Signature"
        :msg="$msg('account.user_signature')"
        :edit="canEdit"
        field="userSignature"
        :tip="$msg('account.chartboost_user_signature_tip')" />
    </div>
    <div v-else-if="id===13">
      <!-- Pangle -->
      <om-form
        :form="form"
        label="User ID"
        :msg="$msg('account.user_id')"
        :tip="$msg('account.pangle_user_id_tip')"
        :edit="canEdit"
        field="userId"
      />
      <om-form
        :form="form"
        :fill="false"
        label="Security-Key"
        :tip="$msg('account.pangle_secret_key_tip')"
        :msg="$msg('account.secret_key')"
        :edit="canEdit"
        field="userSignature"
      />
    </div>
    <div v-else-if="id===14">
      <!-- Mintegral -->
      <om-form
        :form="form"
        label="Report API SKey"
        :msg="$msg('account.report_api_skey')"
        :tip="$msg('account.mintegral_report_api_skey_tip')"
        :edit="canEdit"
        field="adnApiKey"
      />
      <om-form
        :form="form"
        label="Report API Secret"
        :msg="$msg('account.report_api_secret')"
        :tip="$msg('account.mintegral_report_api_secret_tip')"
        :edit="canEdit"
        field="userSignature"
      />
    </div>
    <div v-else-if="id===15">
      <!-- IronSource -->
      <om-form
        :form="form"
        label="User Name"
        :msg="$msg('account.user_name')"
        :edit="canEdit"
        field="userId"
        :tip="$msg('account.ironsource_user_name_tip')" />
      <om-form
        :form="form"
        label="Secret Key"
        :msg="$msg('account.secret_key')"
        :edit="canEdit"
        field="userSignature"
        :tip="$msg('account.ironsource_secret_key_tip')" />
    </div>
    <div v-else-if="id===17">
      <!-- Helium ChartboostBid -->
      <om-form
        :form="form"
        label="User ID"
        :msg="$msg('account.user_id')"
        :edit="canEdit"
        field="userId"
        :tip="$msg('account.chartboost_user_id_tip')" />
      <om-form
        :form="form"
        label="User Signature"
        :msg="$msg('account.user_signature')"
        :edit="canEdit"
        field="userSignature"
        :tip="$msg('account.chartboost_user_signature_tip')" />
    </div>
    <div v-else-if="id===18">
      <!-- Mint -->
      <om-form
        :form="form"
        label="App Token"
        msg="App Token can not be empty."
        :edit="canEdit"
        field="adnAppToken" />
    </div>
    <div v-else-if="id===23">
      <om-form
        :form="form"
        label="Access Token"
        msg="Access Token can not be empty."
        :edit="canEdit"
        field="adnApiKey"
      />
    </div>
    <div v-else-if="id===30">
      <!-- Fyber -->
      <om-form
        :form="form"
        label="Publisher ID"
        :msg="$msg('account.publisher_id')"
        :edit="canEdit"
        field="userId"
      />
      <om-form
        :form="form"
        label="Consumer Key"
        :msg="$msg('account.consumer_key')"
        :edit="canEdit"
        field="adnApiKey"
      />
      <om-form
        :form="form"
        label="Consumer Secret"
        :msg="$msg('account.consumer_secret')"
        :edit="canEdit"
        field="userSignature"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import omForm from './OmForm'
import { importScript } from '@/api/import'
import { accountCreate, accountUpdate, admobTokenSave } from '@/api/account'
import CurrencySelect from '@/components/om/CurrencySelect'
importScript('https://apis.google.com/js/platform.js?onload=initGAPI')

export default {
  components: {
    omForm,
    CurrencySelect
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit,
      temp: {},
      relogin: false,
      aType: this.authType,
      spinning: false
    }
  },
  name: 'AccountEdit',
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
    },
    reselect: {
      type: Boolean,
      default: false
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    clientId: state => state.user.info.clientId
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
          that.form.setFieldsValue({
            adnAppId: params.adnAppId,
            adnApiKey: params.adnApiKey,
            userSignature: params.userSignature,
            adnAppToken: params.adnAppToken,
            userId: params.userId
          })
        }, 1)
      }
    },
    googleApiInit () {
      this.spinning = true
      this.$emit('dontSaveInfo', false)
      // const scope = 'https://www.googleapis.com/auth/adsense.readonly https://www.googleapis.com/auth/dfp'
      const scope = 'https://www.googleapis.com/auth/admob.readonly https://www.googleapis.com/auth/admob.report'
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-undef
          gapi.load('auth2', _ => {
            // eslint-disable-next-line no-undef
            const GoogleAuth = gapi.auth2.init({
              client_id: this.clientId,
              // client_id: clientId,
              fetch_basic_profile: false,
              scope: scope
            })
            GoogleAuth.grantOfflineAccess({
              scope: scope,
              prompt: 'select_account'
            }).then(resp => {
              if (resp.code) {
                const params = { authCode: resp.code }
                admobTokenSave(params).then(res => {
                  if (res.code === 0) {
                    values.userId = res.data.pubId
                    values.adnAppToken = res.data.refreshToken
                    // values.authType = this.aType
                    values.authType = 3
                    if (this.record) {
                      values.id = this.record.id
                      values.adnAccountId = this.record.adnAccountId
                    } else {
                      values.adnAccountId = 0
                    }
                    values.adnId = 2
                    if (this.accountPath) {
                      accountUpdate(values).then(res => {
                        if (res.code === 0) {
                          if (this.record) {
                            this.record = Object.assign(this.record, res.data)
                          } else {
                            this.record = res.data
                          }
                          this.$emit('dontSaveInfo', true)
                          this.$emit('authSuccess', this.record.id)
                          this.$message.success('success')
                        }
                      }).finally(() => {
                        this.spinning = false
                      })
                    } else {
                      accountCreate(values).then(res => {
                        if (res.code === 0) {
                          if (this.record) {
                            this.record = Object.assign(this.record, res.data)
                          } else {
                            this.record = res.data
                          }
                          this.$emit('dontSaveInfo', true)
                          this.$emit('authSuccess', this.record.id)
                          this.$message.success('success')
                        }
                      }).finally(() => {
                        this.spinning = false
                      })
                    }
                  }
                }).catch(() => {
                  this.spinning = false
                  // this.$emit('dontSaveInfo', true)
                })
              } else {
                // this.$message.error('GrantOfflineAccess Error!')
              }
            }).catch((e) => {
              // this.$message.error('GrantOfflineAccess Error!')
              this.spinning = false
              // this.$emit('dontSaveInfo', true)
            })
          })
        } else {
          this.spinning = false
          this.$emit('dontSaveInfo', true)
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
/deep/ .ant-spin-nested-loading{
  background: rgba(255, 255, 255, 0.4);
}
/deep/ .spinStyle .ant-spin-container{
  width: 33.3333333%;
}
.proSpin{
  // background: #f5f5f5
  background: transparent;
}
.signGoogleSpan_s1{
  width: 100%;
  display:flex;
  justify-content: flex-start;
  align-items: center;
}
.signGoogleSpan_s2{
  width: 33.3333333%;
  display:flex;
  justify-content: flex-start;
  align-items: center;
}
.spinStyle{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
}
</style>
