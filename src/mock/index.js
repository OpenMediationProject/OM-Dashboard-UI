import { isIE } from '@/utils/util'

//  init mock
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  if (isIE()) {
    console.error('ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
  }
  console.log('mock mounting')
  const Mock = require('mockjs2')
  // require('./services/report')

  Mock.setup({
    timeout: 800 // setter delay time
  })
  console.log('mock mounted')
}
