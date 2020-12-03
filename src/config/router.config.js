// eslint-disable-next-line
import { BasicLayout, AlertLayout, FullPageView, PageView, RouteView, UserLayout } from '@/layouts'
import Dashboard from '../../public/menu/dashboard.svg'
import Apps from '../../public/menu/Apps.svg'
import Mediation from '../../public/menu/mediation.svg'
import Overview from '../../public/menu/overview.svg'
import Placements from '../../public/menu/placements.svg'
import Report from '../../public/menu/report.svg'
import SDK from '../../public/menu/sdk.svg'
import AppSettings from '../../public/menu/AppSettings.svg'
import AdNetwork from '../../public/menu/adn.svg'
import Performance from '../../public/menu/Performance.svg'
import RB from '../../public/menu/RB.svg'
import User from '../../public/menu/User.svg'
import Promote from '../../public/menu/promot.svg'
import Campaigns from '../../public/menu/Campaigns.svg'
import i18n from '../../lang/index'

export const asyncRouterMap = {
  getRouterMap () {
    return [
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
              title: i18n.t('route.overview'),
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
                  title: i18n.t('route.overview'),
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
                  title: i18n.t('route.overview'),
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
            meta: { title: i18n.t('route.apps'), apps: true, icon: Apps, permission: ['publisherMenu'] },
            children: [
              {
                name: 'AppList',
                path: '/publisher/app',
                redirect: '/publisher/app/list',
                component: RouteView,
                hideChildrenInMenu: true,
                meta: { title: i18n.t('route.apps'), apps: true, keepAlive: false, hiddenHeaderContent: true, permission: ['pubapp'] },
                children: [
                  {
                    path: '/publisher/app/list',
                    name: 'PublisherApps',
                    component: () => import('@/views/publisher/Apps'),
                    meta: { title: i18n.t('route.apps'), keepAlive: false, hiddenHeaderContent: true, permission: ['pubapp'], action: ['query'] }
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
                  title: i18n.t('route.appDashboard'),
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
                      title: i18n.t('route.appDashboard'),
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
                  title: i18n.t('route.placements'),
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
                      title: i18n.t('route.placements'),
                      keepAlive: false,
                      hiddenHeaderContent: true,
                      permission: ['placement'],
                      action: ['query']
                    }
                  }
                ]
              },
              {
                name: 'AdNetwork',
                path: '/adn',
                redirect: '/adn/list',
                component: RouteView,
                hideChildrenInMenu: true,
                meta: { title: i18n.t('route.adn'), icon: AdNetwork, keepAlive: false, hiddenHeaderContent: true },
                children: [
                  {
                    name: 'AdNetworkList',
                    path: '/adn/list',
                    component: () => import('@/views/adn/AdNetwork'),
                    meta: { title: i18n.t('route.adn'), adn: true, keepAlive: false, hiddenHeaderContent: true, permission: ['app_settings'], action: ['query'] }
                  }
                ]
              },
              {
                name: 'Mediation',
                path: '/mediation/mediation',
                redirect: '/mediation/mediation/list',
                component: RouteView,
                hideChildrenInMenu: true,
                meta: { title: i18n.t('route.mediation'), icon: Mediation, keepAlive: false, hiddenHeaderContent: true },
                children: [
                  {
                    name: 'MediationList',
                    path: '/mediation/mediation/list',
                    component: () => import('@/views/mediation/Mediation'),
                    meta: { title: i18n.t('route.mediation'), keepAlive: false, hiddenHeaderContent: true, permission: ['mediation'], action: ['query'] }
                  }
                ]
              },
              {
                path: '/sdk',
                name: 'SDK',
                redirect: '/sdk/testing',
                component: RouteView,
                hideChildrenInMenu: true,
                meta: { title: i18n.t('route.sdk'), icon: SDK, keepAlive: false, hiddenHeaderContent: true },
                children: [
                  {
                    name: 'SDKIntegration',
                    path: '/sdk/testing',
                    component: () => import('@/views/test/SDK'),
                    meta: { title: i18n.t('route.sdk'), keepAlive: false, hiddenHeaderContent: true, permission: ['mediation'], action: ['query'] }
                  }
                ]
              },
              {
                path: '/app',
                name: 'appSettings',
                redirect: '/app/settings',
                component: RouteView,
                hideChildrenInMenu: true,
                meta: { title: i18n.t('route.appSetting'), icon: AppSettings, keepAlive: false, hiddenHeaderContent: true },
                children: [
                  {
                    name: 'AppSettings',
                    path: '/app/settings',
                    component: () => import('@/views/appsetting/Settings'),
                    meta: { title: i18n.t('route.appSetting'), keepAlive: false, hiddenHeaderContent: true, permission: ['app_settings'], action: ['query'] }
                  }
                ]
              }
            ]
          },
          {
            path: '/report',
            name: 'ReportMain',
            redirect: '/report/performance',
            component: PageView,
            hideChildrenInMenu: false,
            meta: {
              title: i18n.t('route.report'),
              icon: Report,
              keepAlive: false,
              permission: ['performance'],
              hiddenHeaderContent: true
            },
            children: [
              {
                path: '/report/performance',
                name: 'Report',
                component: () => import('@/views/report/Report'),
                meta: { title: i18n.t('route.performance'), keepAlive: false, hiddenHeaderContent: true, permission: ['performance'], icon: Performance }
              },
              {
                path: '/report/ua',
                name: 'UserAnalysis',
                component: () => import('@/views/report/ReportUA'),
                meta: { title: i18n.t('route.ua'), keepAlive: false, hiddenHeaderContent: true, permission: ['user_activity'], action: ['query'], icon: User }
              },
              {
                path: '/report/builder',
                name: 'ReportingBuilder',
                component: () => import('@/views/report/ReportBuilder'),
                meta: { title: i18n.t('route.builder'), permission: ['report_builder'], hiddenHeaderContent: true, keepAlive: false, action: ['query'], icon: RB } }
            ]
          },
          {
            path: '/campaign',
            name: 'CampaignMain',
            redirect: '/campaign/list',
            component: PageView,
            hideChildrenInMenu: false,
            meta: { title: i18n.t('route.promote'), icon: Promote, keepAlive: false, permission: ['cross_bid'], hiddenHeaderContent: true },
            children: [
              {
                name: 'Campaigns',
                path: '/campaign/list',
                component: () => import('@/views/campaign/Campaign'),
                meta: { title: i18n.t('route.campaigns'), keepAlive: false, hiddenHeaderContent: true, permission: ['cross_bid'], icon: Campaigns }
              },
              {
                path: '/campaign/performance',
                name: 'CampaignReport',
                component: () => import('@/views/campaign/CampaignReport'),
                meta: { title: i18n.t('route.promoteReport'), keepAlive: false, hiddenHeaderContent: true, permission: ['cross_bid'], icon: Performance }
              }
            ]
          },
          {
            path: '/um',
            redirect: '/um/user-manage',
            hidden: true,
            component: PageView,
            meta: { title: i18n.t('route.um'), icon: 'apartment' },
            children: [
              {
                path: '/um/user-manage/',
                name: 'user-manage',
                hideChildrenInMenu: true,
                component: () => import('@/views/um/UserManage'),
                meta: { title: i18n.t('route.um'), keepAlive: false, hiddenHeaderContent: true }
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
  }
}

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

export const constantFullPageMap = {
  getRouterMap () {
    return [
      {
        path: '/alert',
        component: AlertLayout,
        hidden: true,
        children: [
          {
            path: '/publisher/app',
            component: FullPageView,
            redirect: '/publisher/app/add',
            children: [
              {
                path: '/publisher/app/add',
                component: () => import('@/views/publisher/AppCreate'),
                meta: {
                  title: i18n.t('route.appAdd'),
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
            path: '/adn/account',
            component: FullPageView,
            redirect: '/adn/account',
            children: [
              {
                path: '/adn/account',
                name: 'adnAccount',
                component: () => import('@/views/adn/AccountManagement'),
                meta: { title: i18n.t('route.adnAccount'), hidden: true, keepAlive: false, action: ['edit', 'add'], parent: '/adn/list' }
              }
            ]
          },
          {
            path: '/mediation',
            component: FullPageView,
            redirect: '/mediation/mediation/add',
            children: [
              {
                path: '/mediation/mediation/add',
                name: 'MediationEdit',
                component: () => import('@/views/mediation/modules/MediationRuleEdit'),
                meta: { title: i18n.t('route.mediationAdd'), hidden: true, headTitle: 'Mediation', keepAlive: false, action: ['edit', 'add'], parent: '/mediation/mediation/list?type=2' },
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
                component: () => import('@/views/mediation/modules/MediationRuleEdit'),
                meta: { title: i18n.t('route.mediationAdd'), hidden: true, headTitle: 'Mediation', keepAlive: false, action: ['query'], parent: '/mediation/mediation/list?type=2' },
                beforeEnter (to, from, next) {
                  if (from.path === '/') {
                    next('/mediation/mediation/list')
                  } else {
                    next()
                  }
                }
              },
              {
                path: '/mediation/mediation/settings',
                name: 'MediationSettings',
                component: () => import('@/views/mediation/modules/Settings'),
                meta: { title: i18n.t('route.mediationSetting'), hidden: true, keepAlive: false, action: ['edit'], parent: '/mediation/mediation/list?type=2' },
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
            path: '/campaign/edit',
            component: FullPageView,
            redirect: '/campaign/edit',
            children: [
              {
                path: '/campaign/edit',
                name: 'CampaignEdit',
                component: () => import('@/views/campaign/Edit'),
                meta: { title: i18n.t('route.campaignAdd'), hidden: true, headTitle: i18n.t('route.campaignAdd'), keepAlive: false, action: ['edit', 'add'], parent: '/campaign/list' }
              }
            ]
          },
          {
            path: '/publisher/placement',
            component: FullPageView,
            redirect: '/publisher/placement/add',
            children: [
              {
                path: '/publisher/placement/add',
                name: 'createPlacement',
                component: () => import('@/views/publisher/modules/CreatePlacement'),
                meta: {
                  title: i18n.t('route.placementAdd'),
                  hidden: true,
                  keepAlive: false,
                  action: ['add'],
                  parent: '/publisher/placement/list'
                }
              },
              {
                path: '/publisher/placement/details',
                name: 'editPlacement',
                component: () => import('@/views/publisher/modules/CreatePlacement'),
                meta: {
                  title: i18n.t('route.placementAdd'),
                  keepAlive: false,
                  hidden: true,
                  action: ['query'],
                  parent: '/publisher/placement/list'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
