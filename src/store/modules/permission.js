import { asyncRouterMap, constantRouterMap, constantFullPageMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param perms
 * @param route
 * @returns {boolean}
 */
function hasPermission (perms, route) {
  if (!route.meta || !route.meta.permission) {
    return true
  }
  const { permission, action } = route.meta
  return permission.every(pname => {
    const perm = perms[pname]
    if (perm) {
      if (!perm.actions) {
        return true
      }
      return !action || action.every(a => perm.actions.includes(a))
    } else {
      return false
    }
  })
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, perms) {
  return routerMap.filter(route => {
    if (hasPermission(perms, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, perms)
      }
      return true
    }
    return false
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { perms } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap.getRouterMap().concat(constantFullPageMap.getRouterMap()), perms)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
