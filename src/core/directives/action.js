import Vue from 'vue'
import store from '@/store'

/**
 * Action
 *  - v-action:[method] ：
 *    <i-button v-action:add >Add User</a-button>
 *    <a-button v-action:delete>Delete User</a-button>
 *    <a v-action:edit @click="edit(record)">Update</a>
 */
const action = Vue.directive('action', {
  inserted (el, binding, vnode) {
    const actionName = binding.arg
    const perms = store.getters.perms
    const { permission } = vnode.context.$route.meta
    if (!permission) {
      return
    }

    permission.forEach(permId => {
      const perm = perms[permId]
      if (!perm) {
        return
      }

      if (!perm.actions || perm.actions.length === 0 || !perm.actions.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export default action
