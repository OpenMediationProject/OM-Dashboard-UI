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
  1: { icon: '/logo/Adtiming.svg' },
  2: { icon: '/logo/Admob.svg' },
  3: { icon: '/logo/Facebook.svg' },
  4: { icon: '/logo/Unity.svg' },
  5: { icon: '/logo/Vungle.svg' },
  6: { icon: '/logo/TencentAd.svg' },
  7: { icon: '/logo/AdColony.svg' },
  8: { icon: '/logo/AppLovin.svg' },
  9: { icon: '/logo/Mopub.svg' },
  10: { icon: '/logo/GoogleAd.svg' },
  11: { icon: '/logo/Tapjoy.svg' },
  12: { icon: '/logo/Chartboost.svg' },
  13: { icon: '/logo/TikTok.svg' },
  14: { icon: '/logo/Mintegral.svg' },
  15: { icon: '/logo/IronSource.svg' },
  16: { icon: '/logo/MyTarget.svg' },
  17: { icon: '/logo/ChartboostBid.svg' },
  18: { icon: '/logo/Mint.svg' },
  19: { icon: '/logo/cross.svg' },
  30: { icon: '/logo/Fyber.svg' }
}
const global = {
  platIcon: (plat) => {
    return plat === 0 ? '/iOS-40.svg' : '/Android-40.svg'
  },
  typeInfo: (type) => {
    if (!placementTypeMap[type]) {
      return { icon: '', title: 'Not Found' }
    }
    return placementTypeMap[type]
  },
  getAdnIconById: (id) => {
    if (!adnIconMap[id]) {
      return { icon: '' }
    }
    return adnIconMap[id]
  }
}

export default global
