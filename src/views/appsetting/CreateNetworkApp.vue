<template>
  <div>
    <div v-if="id===1">
      <!-- AdTiming -->
      <om-form :form="form" label="App Key" :edit="canEdit" field="adnAppKey" :showTip="false" />
    </div>
    <div v-else-if="id===2">
      <!-- AdMob -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="adnAppKey" tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>, select &quot;All Apps&quot; in the left sidebar, then choose your app. Click &quot;View setup instructions&quot; and copy the App ID displayed in the instructions. Make sure you use the same account as you do for the &quot;Grant Access&quot; button above otherwise the access will not be granted." />
    </div>
    <div v-else-if="id===3">
      <!-- facebook -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="adnAppKey" tip="You can find your App ID on your app's <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/apps&quot;>settings page.</a>" />
      <om-form :form="form" label="System User Access Token" :edit="canEdit" field="refreshToken" tip="App tokens for all of your apps are listed <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/tools/accesstoken/&quot;>here</a>. You must be an administrator of the app to see them." />
    </div>
    <div v-else-if="id===4">
      <!-- UnityAds -->
      <om-form :form="form" label="Game ID" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>, choose your game. Your Game ID will be listed next to the platform." />
    </div>
    <div v-else-if="id===5">
      <!-- Vungle -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Vungle App ID in the Application Details column." />
    </div>
    <div v-else-if="id===6">
      <!-- TencentAds -->
      <om-form :form="form" label="APP ID" :edit="canEdit" field="adnAppKey" tip="From this <a target=&quot;_blank&quot; href=&quot;http://adnet.qq.com/medium/list&quot;>Medium</a> page to get your App ID" />
    </div>
    <div v-else-if="id===7">
      <!-- AdColony -->
      <om-form :form="form" label="APP ID" :edit="canEdit" field="adnAppKey" tip="Your API key will be labeled as &quot;Read-Only API Key&quot; on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
    </div>
    <div v-else-if="id===8">
      <!-- AppLovin -->
      <om-form :form="form" label="SDK Key" :edit="canEdit" field="adnAppKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the SDK Key." />
    </div>
    <div v-else-if="id===9">
    <!-- Mopub -->
    </div>
    <div v-else-if="id===11">
      <!-- Tapjoy -->
      <om-form :form="form" label="SDK Key" :edit="canEdit" field="adnAppKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    </div>
    <div v-else-if="id===12">
      <!-- Chartboost -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="cb_left" tip="You can find your game's App ID on its App Settings page on the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/&quot;>Chartboost dashboard</a>. See <a target=&quot;_blank&quot; href=&quot;https://answers.chartboost.com/hc/en-us/articles/201465075&quot;>this Chartboost documentation for a screenshot.</a>" />
      <om-form :form="form" label="App Signature" :edit="canEdit" field="cb_right" tip="You can find your game's App ID on its App Settings page on the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/&quot;>Chartboost dashboard</a>. See <a target=&quot;_blank&quot; href=&quot;https://answers.chartboost.com/hc/en-us/articles/201465075&quot;>this Chartboost documentation for a screenshot.</a>" />
    </div>
    <div v-else-if="id===13">
      <!-- Tiktok -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="adnAppKey" :showTip="false" />
    </div>
    <div v-else-if="id===14">
      <!-- Mintegral -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="mt_left" :showTip="false" />
      <om-form :form="form" label="App Key" :edit="canEdit" field="mt_right" :showTip="false" />
    </div>
    <div v-else-if="id===15">
      <!-- IronSource -->
      <om-form :form="form" label="App Key" :edit="canEdit" field="adnAppKey" tip="From this <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/applications&quot;>App Management</a> page to get your App Key" />
    </div>
    <div v-else-if="id===30">
      <!-- Fyber -->
      <om-form :form="form" label="App ID" :edit="canEdit" field="adnAppKey" :showTip="false" />
    </div>
    <div v-if="![ 3, 6 ].includes(id)">
      <div v-if="!account">
        <om-form :form="form" label="Ad Network Account" :edit="canEdit" field="reportAccountId" :showTip="false">
          <a-form-item>
            <AccountSelect :edit="canEdit" :adnId="id" />
          </a-form-item>
        </om-form>
        <om-form v-if="canEdit" label="" :edit="true" :fill="false" :showTip="false">
          <div><a @click="newAccount">New Account</a></div>
        </om-form>
      </div>
      <div v-else>
        <om-form :form="form" label="Account Name" :showTip="false" v-if="true">
          <a-input :maxlength="40" style="margin-top:0px;" v-decorator="['adnAccountName',{initialValue: '', rules: [{ whitespace: true, required: true, validator: handleCheckName}] }]"/>
        </om-form>
        <om-form :form="form" label="Currency" :showTip="false" v-if="true">
          <CurrencySelect :edit="canEdit" :adnId="record" />
        </om-form>
        <NetworkAppAccount
          @authSuccess="authSuccess"
          :form="form"
          style="margin-top:24px;"
          :create="true"
          :edit="canEdit"
          :authType="1"
          :id="id" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import omForm from '@/components/OmForm'
import NetworkAppAccount from '@/views/company/NetworkAppAccount'
import CurrencySelect from '@/components/om/CurrencySelect'
import AccountSelect from '@/components/om/AccountSelect'

export default {
  components: {
    omForm,
    NetworkAppAccount,
    CurrencySelect,
    AccountSelect
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit,
      account: false
    }
  },
  name: 'CreateNetworkApp',
  props: {
    id: {
      type: Number,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
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
    newAccount () {
      this.account = true
    },
    authSuccess (accountId) {
      this.$emit('authSuccess', accountId)
    },
    inputLength (value) {
      let len = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
          len += 2
        } else {
          len++
        }
      }
      return len
    },
    handleCheckName (rule, value, callback) {
      if (!value) {
        callback(new Error('Account Name can not be empty.'))
      } else {
        if (this.inputLength(value) > 40) {
          callback(new Error('Characters longer than 40'))
        } else {
          callback()
        }
      }
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
