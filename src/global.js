const placementTypeMap = {
  0: {
    icon: '/icon/plc/banner.svg',
    title: 'Banner',
    descn: 'Rectangular ads that occupy a portion of an app\'s layout; can be refreshed automatically after a period of time.'
  },
  1: {
    icon: '/icon/plc/native.svg',
    title: 'Native',
    descn: 'Native ad is favored for its integration into content, allowing for an uninterrupted UX.'
  },
  2: {
    icon: '/icon/plc/rv.svg',
    title: 'Rewarded Video',
    descn: 'Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.'
  },
  3: {
    icon: '/icon/plc/interstitial.svg',
    title: 'Interstitial',
    descn: 'A full-screen ad appearing at natural breaks during the app lifecycle. Users can choose to skip these ads.'
  },
  4: {
    icon: '/icon/plc/splash.svg',
    title: 'Splash',
    descn: 'Branded full screen ad that appears for a few seconds after the branded application splash screen.'
  },
  5: { icon: '/icon/plc/cross.svg', title: 'Cross Promote', descn: 'Shows ads for your other apps, encouraging users to try them out.' }
}
const adnIconMap = {
  1: { icon: '/logo/AdTiming.svg', name: 'AdTiming', iconBidding: '/logo/Adtiming2.svg' },
  2: { icon: '/logo/AdMob.svg', name: 'Google Admob' },
  3: { icon: '/logo/Facebook.svg', name: 'Facebook', iconBidding: '/logo/Facebook2.svg' },
  4: { icon: '/logo/Unity.svg', name: 'Unity Ads' },
  5: { icon: '/logo/Vungle.svg', name: 'Vungle' },
  6: { icon: '/logo/TencentAd.svg', name: 'Tencent Ads' },
  7: { icon: '/logo/AdColony.svg', name: 'AdColony' },
  8: { icon: '/logo/AppLovin.svg', name: 'App Lovin' },
  9: { icon: '/logo/Mopub.svg', name: 'Mopub' },
  10: { icon: '/logo/GoogleAd.svg', name: 'GoogleAd' },
  11: { icon: '/logo/Tapjoy.svg', name: 'Tapjoy' },
  12: { icon: '/logo/Chartboost.svg', name: 'Chartboost' },
  13: { icon: '/logo/TikTok.svg', name: 'Pangle' },
  14: { icon: '/logo/Mintegral.svg', name: 'Mintegral', iconBidding: '/logo/Mintegral2.svg' },
  15: { icon: '/logo/IronSource.svg', name: 'IronSource' },
  16: { icon: '/logo/MyTarget.svg', name: 'MyTarget' },
  17: { icon: '/logo/ChartboostBid.svg', name: 'Helium', iconBidding: '/logo/ChartboostBid2.svg' },
  18: { icon: '/logo/Mint.svg', name: 'Mint' },
  19: { icon: '/logo/CrossPromotion.svg', name: 'Cross Bidding' },
  20: { icon: '/logo/SigMob.svg', name: 'Sigmob' },
  21: { icon: '/logo/KsAd.svg', name: 'KsAd' },
  22: { icon: '/logo/Ogury.svg', name: 'Ogury' },
  23: { icon: '/logo/HyBid.svg', name: 'PubNative', iconBidding: '/logo/HyBid2.svg' },
  26: { icon: '/logo/InMobi.svg', name: 'Inmobi', iconBidding: '/logo/InMobi2.svg' },
  27: { icon: '/logo/SanAds.svg', name: 'SanAds' },
  30: { icon: '/logo/Fyber.svg', name: 'Fyber' }
}
const global = {
  platIcon: (plat) => {
    if (plat === 0) {
      return '/iOS-40.svg'
    } else if (plat === 1) {
      return '/Android-40.svg'
    } else if (plat === 2) {
      return '/link.svg'
    }
  },
  typeInfo: (type) => {
    if (!placementTypeMap[type]) {
      return { icon: '', title: 'Not Found' }
    }
    return placementTypeMap[type]
  },
  getAdnIconById (id) {
    if (!adnIconMap[id]) {
      return { icon: '' }
    }
    return adnIconMap[id]
  },
  getAdnName (id) {
    if (!adnIconMap[id]) {
      return ''
    }
    return adnIconMap[id].name
  }
}

export default global
