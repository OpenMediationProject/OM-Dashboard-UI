<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import enGB from 'ant-design-vue/lib/locale-provider/en_GB'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapState } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    enGB.Empty.description = 'No Data Available'
    return {
      locale: this.matchLanguage(this.$i18n.locale)
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language
    })
  },
  watch: {
    language (v) {
      this.locale = this.matchLanguage(v)
    }
  },
  created () {
    this.$store.commit('SET_LANGUAGE', this.$i18n.locale)
  },
  methods: {
    matchLanguage (v) {
      if (v === 'enGB') {
        return enGB
      } else {
        return zhCN
      }
    }
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
