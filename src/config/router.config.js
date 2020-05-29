// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView, UserLayout } from '@/layouts'
import Dashboard from '../../public/menu/dashboard.svg'
import Apps from '../../public/menu/Apps.svg'
import Mediation from '../../public/menu/mediation.svg'
import Overview from '../../public/menu/overview.svg'
import Placements from '../../public/menu/placements.svg'
import Report from '../../public/menu/report.svg'
import SDK from '../../public/menu/sdk.svg'
import AppSettings from '../../public/menu/AppSettings.svg'
import Company from '../../public/menu/company.svg'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/overview',
    children: [
      {
        path: '/overview',
        redirect: '/overview/dashboard',
        component: PageView,
        name: 'Dashboard',
        hideChildrenInMenu: true,
        meta: {
          title: 'Overview',
          keepAlive: false,
          hiddenHeaderContent: true,
          icon: Overview,
          permission: ['dashboard']
        },
        children: [
          {
            path: '/overview/dashboard',
            component: () => import('@/views/dashboard/AppDashboard'),
            meta: {
              title: 'Overview',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['dashboard']
            }
          },
          {
            path: '/overview/back',
            name: 'supplierAllBack',
            component: () => import('@/views/dashboard/supplierAllBack'),
            meta: {
              title: 'Overview',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['dashboard']
            }
          }
        ]
      },
      {
        path: '/publisher',
        redirect: '/publisher/app',
        component: PageView,
        meta: { title: 'Apps', icon: Apps, permission: ['publisherMenu'] },
        children: [
          {
            name: 'AppList',
            path: '/publisher/app',
            redirect: '/publisher/app/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Apps', keepAlive: false, hiddenHeaderContent: true, permission: ['pubapp'] },
            children: [
              {
                path: '/publisher/app/list',
                name: 'PublisherApps',
                component: () => import('@/views/publisher/Apps'),
                meta: { title: 'Apps', keepAlive: false, hiddenHeaderContent: true, permission: ['pubapp'], action: ['query'] }
              },
              {
                path: '/publisher/app/add',
                name: 'CreateApp',
                component: () => import('@/views/publisher/modules/CreateApp'),
                meta: {
                  title: 'App',
                  headTitle: 'Apps',
                  keepAlive: false,
                  hidden: true,
                  permission: ['pubapp'],
                  action: ['add', 'query'],
                  parent: '/publisher/app/list'
                }
              }
            ]
          },
          {
            name: 'AppDashboard',
            path: '/appdashboard',
            redirect: '/app/dashboard',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: {
              title: 'Apps Dashboard',
              keepAlive: true,
              icon: Dashboard,
              hiddenHeaderContent: true,
              permission: ['dashboard']
            },
            children: [
              {
                path: '/app/dashboard',
                component: () => import('@/views/dashboard/AppDashboard'),
                meta: {
                  title: 'Apps Dashboard',
                  keepAlive: false,
                  hiddenHeaderContent: true,
                  permission: ['dashboard'],
                  action: ['query'],
                  icon: Dashboard
                }
              }
            ]
          },
          {
            name: 'Placements',
            path: '/publisher/placement',
            redirect: '/publisher/placement/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: {
              title: 'Placements',
              keepAlive: false,
              icon: Placements,
              hiddenHeaderContent: true,
              permission: ['placement']
            },
            children: [
              {
                path: '/publisher/placement/list',
                component: () => import('@/views/publisher/Placements'),
                meta: {
                  title: 'Placements',
                  keepAlive: false,
                  hiddenHeaderContent: true,
                  permission: ['placement'],
                  action: ['query']
                }
              },
              {
                path: '/publisher/placement/add',
                name: 'createPlacement',
                component: () => import('@/views/publisher/modules/CreatePlacement'),
                meta: {
                  title: 'Placement',
                  headTitle: 'Placements',
                  keepAlive: false,
                  permission: ['placement'],
                  action: ['add'],
                  parent: '/publisher/placement/list'
                }
              },
              {
                path: '/publisher/placement/details',
                name: 'editPlacement',
                component: () => import('@/views/publisher/modules/CreatePlacement'),
                meta: {
                  title: 'Placement',
                  headTitle: 'Placements',
                  keepAlive: false,
                  permission: ['placement'],
                  action: ['query'],
                  parent: '/publisher/placement/list'
                }
              }
            ]
          },
          {
            name: 'Mediation',
            path: '/mediation/mediation',
            redirect: '/mediation/mediation/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Mediation', icon: Mediation, keepAlive: false, hiddenHeaderContent: true },
            children: [
              {
                name: 'MediationList',
                path: '/mediation/mediation/list',
                component: () => import('@/views/mediation/Mediation'),
                meta: { title: 'Mediation', keepAlive: false, hiddenHeaderContent: true, permission: ['mediation'], action: ['query'] }
              },
              {
                path: '/mediation/mediation/add',
                name: 'MediationEdit',
                component: () => import('@/views/mediation/modules/MediationEdit'),
                meta: { title: 'Segement', headTitle: 'Mediation', keepAlive: false, action: ['edit', 'add'], parent: '/mediation/mediation/list' },
                beforeEnter (to, from, next) {
                  if (from.path === '/') {
                    next('/mediation/mediation/list')
                  } else {
                    next()
                  }
                }
              },
              {
                path: '/mediation/mediation/details',
                name: 'MediationDetails',
                component: () => import('@/views/mediation/modules/MediationEdit'),
                meta: { title: 'Segement', headTitle: 'Mediation', keepAlive: false, action: ['query'], parent: '/mediation/mediation/list' },
                beforeEnter (to, from, next) {
                  if (from.path === '/') {
                    next('/mediation/mediation/list')
                  } else {
                    next()
                  }
                }
              }
            ]
          },
          {
            path: '/sdk',
            name: 'SDK',
            redirect: '/sdk/integration',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'SDK Integration', icon: SDK, keepAlive: false, hiddenHeaderContent: true },
            children: [
              {
                name: 'SDKIntegration',
                path: '/sdk/integration',
                component: () => import('@/views/test/SDK'),
                meta: { title: 'SDK Integration', keepAlive: false, hiddenHeaderContent: true, permission: ['mediation'], action: ['query'] }
              }
            ]
          },
          {
            path: '/app',
            name: 'appSettings',
            redirect: '/app/settings',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'App Settings', icon: AppSettings, keepAlive: false, hiddenHeaderContent: true },
            children: [
              {
                name: 'AppSettings',
                path: '/app/settings',
                component: () => import('@/views/appsetting/AdNetwork'),
                meta: { title: 'App Settings', keepAlive: false, hiddenHeaderContent: true, permission: ['app_settings'], action: ['query'] }
              }
            ]
          }
        ]
      },
      {
        name: 'reportMenu',
        path: '/report',
        redirect: '/report/main',
        component: PageView,
        hideChildrenInMenu: true,
        meta: {
          title: 'Reporting',
          icon: Report,
          keepAlive: false,
          permission: ['dashboard'],
          hiddenHeaderContent: true
        },
        children: [
          {
            path: '/report/main',
            name: 'Report',
            component: () => import('@/views/report/Report'),
            meta: { title: 'Reporting', keepAlive: false, hiddenHeaderContent: true, permission: ['dashboard'] }
          }
        ]
      },
      {
        name: 'Company',
        path: '/company',
        redirect: '/adn/accounts',
        component: PageView,
        hideChildrenInMenu: true,
        meta: {
          title: 'Ad Network Accounts',
          icon: Company,
          keepAlive: false,
          permission: ['accounts'],
          hiddenHeaderContent: true
        },
        children: [
          {
            path: '/adn/accounts',
            name: 'accounts',
            component: () => import('@/views/company/OrgAdNetwork'),
            meta: { title: 'Ad Network Accounts', keepAlive: false, hiddenHeaderContent: true, permission: ['accounts'] }
          }
        ]
      },
      {
        path: '/um',
        redirect: '/um/user-manage',
        hidden: true,
        component: PageView,
        meta: { title: 'User Management', icon: 'apartment' },
        children: [
          {
            path: '/um/user-manage/',
            name: 'user-manage',
            hideChildrenInMenu: true,
            component: () => import('@/views/um/UserManage'),
            meta: { title: 'User Management', keepAlive: false, hiddenHeaderContent: true }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * base router
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
