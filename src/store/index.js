import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import publisher from './modules/publisher'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
import dict from './modules/dict'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    publisher,
    permission,
    dict
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters
})
