<template>
  <div v-if="id===1">
    <!-- AdTiming -->
    <om-form label="App Key" field="adnAppKey" :showTip="false" />
    <om-form label="API Token" field="refreshToken" :showTip="false" />
  </div>
  <div v-else-if="id===2">
    <!-- AdMob -->
    <om-form label="App ID" field="adnAppKey" tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>, select &quot;All Apps&quot; in the left sidebar, then choose your app. Click &quot;View setup instructions&quot; and copy the App ID displayed in the instructions. Make sure you use the same account as you do for the &quot;Grant Access&quot; button above otherwise the access will not be granted." />
    <om-form label="Admob Publisher ID" field="reportAppId" tip="From <a target=&quot;_blank&quot; href=&quot;https://apps.admob.com/?pli=1#account/settings:view&quot;>the AdMob Monetize page</a>,Click the user avatar to get publisher id,Publisher ID like pub-xxxxxxxxxx" />
    <om-form label="Client ID" field="clientId" tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,OAuth 2.0 Client IDs" />
    <om-form label="Client Secrect" field="clientSecret" tip="From <a target=&quot;_blank&quot; href=&quot;https://console.developers.google.com/&quot;>the Google Api Credentials page</a>,Download OAuth 2.0 Client json file and copy this file content to here" />
  </div>
  <div v-else-if="id===3">
    <!-- facebook -->
    <om-form label="App ID" field="adnAppKey" tip="You can find your App ID on your app's <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/apps&quot;>settings page.</a>" />
    <om-form label="App Key" field="apiKey" :showTip="false" />
    <om-form label="System User Access Token" field="refreshToken" tip="App tokens for all of your apps are listed <a target=&quot;_blank&quot; href=&quot;https://developers.facebook.com/tools/accesstoken/&quot;>here</a>. You must be an administrator of the app to see them." />
  </div>
  <div v-else-if="id===4">
    <!-- UnityAds -->
    <om-form label="API Key" field="apiKey" tip="Your API key is found on the API keys tab of the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>." />
    <om-form label="Game ID" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.unityads.unity3d.com/&quot;>UnityAds dashboard</a>, choose your game. Your Game ID will be listed next to the platform." />
  </div>
  <div v-else-if="id===5">
    <!-- Vungle -->
    <om-form label="App ID" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Vungle App ID in the Application Details column." />
    <om-form label="API Key" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, select your application. On the next page, find the Reporting API Key in the Application Details column." />
    <om-form label="Reporting API ID" field="reportAppId" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.vungle.com/dashboard/accounts/details&quot;>Vungle Details Dashboard</a>, find your Reporting API ID towards the bottom of the page. If you do not already have a Report ID, email Vungle at account-managers@vungle.com to request one." />
  </div>
  <div v-else-if="id===7">
    <!-- AdColony -->
    <om-form label="APP Key" field="adnAppKey" tip="Your API key will be labeled as &quot;Read-Only API Key&quot; on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
    <om-form label="User Credentials" field="clientSecret" tip="To get User Credentials on <a target=&quot;_blank&quot; href=&quot;https://clients.adcolony.com/users/edit&quot;>this page</a>" />
  </div>
  <div v-else-if="id===8">
    <!-- AppLovin -->
    <om-form label="SDK Key" field="adnAppKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the SDK Key." />
    <om-form label="Report Key" field="apiKey" tip="From your <a target=&quot;_blank&quot; href=&quot;https://applovin.com/users/edit&quot;>Account page</a>, choose &quot;Keys&quot; in the left sidebar, then select the Report Key. If you do not see the Report Key field, email support@applovin.com and request your reporting key." />
  </div>
  <div v-else-if="id===9">
    <!-- Mopub -->
    <om-form label="API Key" field="adnAppKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, check &quot;Enable data access through API&quot;. Then click the &quot;View API Access Details&quot; link to reveal your API Key." />
    <om-form label="Report KEY" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://app.mopub.com/reports/custom/&quot;>Reports page</a>, click the &quot;View API Access Details&quot; link to reveal your Inventory Report ID." />
  </div>
  <div v-else-if="id===11">
    <!-- Tapjoy -->
    <om-form label="Report Key" field="apiKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    <om-form label="SDK Key" field="adnAppKey" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
    <om-form label="Auth Key" field="refreshToken" tip="This is available on the App Info tab under Settings -> App Settings on the Tapjoy Monetization Dashboard." />
  </div>
  <div v-else-if="id===12">
    <!-- Chartboost -->
    <om-form label="App ID" field="adnAppKey" tip="You can find your game's App ID on its App Settings page on the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/&quot;>Chartboost dashboard</a>. See <a target=&quot;_blank&quot; href=&quot;https://answers.chartboost.com/hc/en-us/articles/201465075&quot;>this Chartboost documentation for a screenshot.</a>" />
    <om-form label="User ID" field="apiKey" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User ID" />
    <om-form label="User Signature" field="clientSecret" tip="From the <a target=&quot;_blank&quot; href=&quot;https://dashboard.chartboost.com/tools/api&quot;>API Explorer Page</a>, select the User Signature." />
  </div>
  <div v-else-if="id===13">
    <!-- Tiktok -->
    <om-form label="User ID" field="apiKey" :showTip="false" />
    <om-form label="App Key" field="adnAppKey" :showTip="false" />
    <om-form label="User Signature" field="clientSecret" :showTip="false" />
  </div>
  <div v-else-if="id===14">
    <!-- Mintegral -->
    <om-form label="Report Key" field="apiKey" :showTip="false" />
    <om-form label="App Key" field="adnAppKey" :showTip="false" />
    <om-form label="Report Secret" field="clientSecret" :showTip="false" />
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
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } }
    }
  },
  name: 'CreateNetworkApp',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  })
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
