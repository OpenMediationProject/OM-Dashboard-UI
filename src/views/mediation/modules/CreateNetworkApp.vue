<template>
  <div v-if="id===1">
    <!-- AdTiming -->
    <om-form label="App Key" :edit="canEdit" field="adnAppKey" :showTip="false" />
    <om-form label="API Token" :edit="canEdit" field="refreshToken" :showTip="false" />
  </div>
  <div v-else-if="id===2">
    <!-- AdMob -->
    <om-form label="App ID" :edit="canEdit" field="adnAppKey" tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>, select &quot;All Apps&quot; in the left sidebar, then choose your app. Click &quot;View setup instructions&quot; and copy the App ID displayed in the instructions. Make sure you use the same account as you do for the &quot;Grant Access&quot; button above otherwise the access will not be granted." />
    <om-form label="Publisher ID" :fill="false" :edit="canEdit" field="reportAppId" tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>,Click the user avatar to get publisher id,Publisher ID like pub-xxxxxxxxxx" />
    <om-form label="Client ID" :fill="false" :edit="canEdit" field="clientId" tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,OAuth 2.0 Client IDs" />
    <om-form label="Client Secrect" :fill="false" :edit="canEdit" field="clientSecret" tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,Download OAuth 2.0 Client json file and copy this file content to here" />
  </div>
  <div v-else-if="id===3">
    <!-- facebook -->
    <om-form label="App ID" :edit="canEdit" field="adnAppKey" tip="You can find your App ID on your app's <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/apps&quot;>settings page.</a>" />
    <om-form label="App Secret" :fill="false" :edit="canEdit" field="apiKey" :showTip="false" />
    <om-form label="System User Access Token" :fill="false" :edit="canEdit" field="refreshToken" tip="App tokens for all of your apps are listed <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/tools/accesstoken/&quot;>here</a>. You must be an administrator of the app to see them." />
  </div>
  <div v-else-if="id===4">
    <!-- UnityAds -->
    <om-form label="Game ID" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>, choose your game. Your Game ID will be listed next to the platform." />
    <om-form label="API Key" :fill="false" :edit="canEdit" field="apiKey" tip="Your API key is found on the API keys tab of the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>." />
  </div>
  <div v-else-if="id===5">
    <!-- Vungle -->
    <om-form label="App ID" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Vungle App ID in the Application Details column." />
    <om-form label="Reporting API ID" :fill="false" :edit="canEdit" field="reportAppId" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, find your Reporting API ID towards the bottom of the page. If you do not already have a Report ID, email Vungle at account-managers@vungle.com to request one." />
    <om-form label="Reporting API Key" :fill="false" :edit="canEdit" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Reporting API Key in the Application Details column." />
  </div>
  <div v-else-if="id===7">
    <!-- AdColony -->
    <om-form label="APP ID" :edit="canEdit" field="adnAppKey" tip="Your API key will be labeled as &quot;Read-Only API Key&quot; on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
    <om-form label="Read-Only API Key" :fill="false" :edit="canEdit" field="clientSecret" tip="To get User Credentials on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
  </div>
  <div v-else-if="id===8">
    <!-- AppLovin -->
    <om-form label="SDK Key" :edit="canEdit" field="adnAppKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the SDK Key." />
    <om-form label="Report Key" :fill="false" :edit="canEdit" field="apiKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the Report Key. If you do not see the Report Key field, email support@applovin.com and request your reporting key." />
  </div>
  <div v-else-if="id===9">
    <!-- Mopub -->
    <om-form label="API Key" :fill="false" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, check &quot;Enable data access through API&quot;. Then click the &quot;View API Access Details&quot; link to reveal your API Key." />
    <om-form label="Inventory Report ID" :fill="false" :edit="canEdit" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, click the &quot;View API Access Details&quot; link to reveal your Inventory Report ID." />
  </div>
  <div v-else-if="id===11">
    <!-- Tapjoy -->
    <om-form label="SDK Key" :edit="canEdit" field="adnAppKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    <om-form label="Publisher Reporting API Key" :fill="false" :edit="canEdit" field="refreshToken" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    <om-form label="Ad Reporting API Key" :fill="false" :edit="canEdit" field="apiKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
  </div>
  <div v-else-if="id===12">
    <!-- Chartboost -->
    <om-form label="App ID" hint="App ID#App Signature" :edit="canEdit" field="adnAppKey" tip="You can find your game's App ID on its App Settings page on the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/&quot;>Chartboost dashboard</a>. See <a target=&quot;_blank&quot; href=&quot;https://answers.chartboost.com/hc/en-us/articles/201465075&quot;>this Chartboost documentation for a screenshot.</a>" />
    <om-form label="User ID" :fill="false" :edit="canEdit" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User ID" />
    <om-form label="User Signature" :fill="false" field="clientSecret" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User Signature." />
  </div>
  <div v-else-if="id===13">
    <!-- Tiktok -->
    <om-form label="App ID" :edit="canEdit" field="adnAppKey" :showTip="false" />
    <om-form label="User ID" :fill="false" :edit="canEdit" field="apiKey" :showTip="false" />
    <om-form label="Security-Key" :fill="false" :edit="canEdit" field="clientSecret" :showTip="false" />
  </div>
  <div v-else-if="id===14">
    <!-- Mintegral -->
    <om-form label="App ID" hint="App ID#App Key" :edit="canEdit" field="adnAppKey" :showTip="false" />
    <om-form label="Report API SKey" :fill="false" :edit="canEdit" field="apiKey" :showTip="false" />
    <om-form label="Report API Secret" :fill="false" :edit="canEdit" field="clientSecret" :showTip="false" />
  </div>
  <div v-else-if="id===6">
    <!-- TencentAds -->
    <om-form label="APP ID" :edit="canEdit" field="adnAppKey" tip="From this <a target=&quot;_blank&quot; href=&quot;http://adnet.qq.com/medium/list&quot;>Medium</a> page to get your App ID" />
  </div>
  <div v-else-if="id===9">
    <!-- Mopub -->
    <om-form label="API Key" :fill="false" :edit="canEdit" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, check &quot;Enable data access through API&quot;. Then click the &quot;View API Access Details&quot; link to reveal your API Key." />
    <om-form label="Inventory Report ID" :fill="false" :edit="canEdit" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, click the &quot;View API Access Details&quot; link to reveal your Inventory Report ID." />
  </div>
  <div v-else-if="id===15">
    <!-- IronSource -->
    <om-form label="App Key" :edit="canEdit" field="adnAppKey" tip="From this <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/applications&quot;>App Management</a> page to get your App Key" />
    <om-form label="User Name" :fill="false" :edit="canEdit" field="clientId" tip="From <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/account/generalInfo&quot;>ironSource My Account</a> page,selected User Info Tab to get your User Name" />
    <om-form label="Secret Key" :fill="false" :edit="canEdit" field="clientSecret" tip="From <a target=&quot;_blank&quot; href=&quot;https://platform.ironsrc.com/partners/account/apiDetails&quot;>ironSource My Account</a> page,selected API Tab to get your Secret Key" />
  </div>
  <div v-else-if="id===30">
    <!-- Fyber -->
    <om-form label="App ID" :edit="canEdit" field="adnAppKey" :showTip="false" />
    <om-form label="Publisher ID" :fill="false" :edit="canEdit" field="apiKey" :showTip="false" />
    <om-form label="Consumer Key" :fill="false" :edit="canEdit" field="clientId" :showTip="false" />
    <om-form label="Consumer Secret" :fill="false" :edit="canEdit" field="clientSecret" :showTip="false" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import omForm from '@/components/OmForm'

export default {
  components: {
    omForm
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit
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
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    edit (val) {
      this.canEdit = val
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
