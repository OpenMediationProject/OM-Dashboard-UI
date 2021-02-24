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
  }
}

export default global
