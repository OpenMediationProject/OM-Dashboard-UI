function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$msg && Object.defineProperties(Vue.prototype, {
    $msg: {
      get () {
        const _this = this
        return (str) => {
          const [page, key] = str.split('.')
          const content = _this.$store.getters.msg[page][key]
          return content || ''
        }
      }
    }
  })
}

export default plugin
