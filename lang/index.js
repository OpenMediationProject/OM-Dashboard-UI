import VueI18n from 'vue-i18n'
import enGB from './enGB'
import zhCN from './zhCN'
import Vue from 'vue'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('local-language') || 'enGB',
  messages: {
    'enGB': enGB,
    'zhCN': zhCN
  }
})
export default i18n
