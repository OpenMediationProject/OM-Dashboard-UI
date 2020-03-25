import Vue from 'vue'
import { getInfo, login, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    roles: [],
    perms: {},
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, { roles, perms }) => {
      state.roles = roles
      state.perms = perms
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.data
          Vue.ls.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          if (result.perms && result.perms.length > 0) {
            const pmap = {}
            const perms = {}
            result.perms.forEach(m => {
              pmap[m.pid] || (pmap[m.pid] = [])
              pmap[m.pid].push(m)
              if (m.type === 'perm' || m.type === 'menu') {
                perms[m.name] = m
              }
            })

            Object.values(perms).forEach(m => {
              const children = pmap[m.id]
              if (children) {
                m.actions = children.filter(item => item.type === 'action').map(item => item.name)
              }
            })

            result.perms = perms
            result.roles = result.roles.map(r => r instanceof String ? r : r.name)

            commit('SET_ROLES', { roles: result.roles, perms })
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
