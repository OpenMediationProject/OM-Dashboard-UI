// Report API

import { axios, JsonHeader } from '@/utils/request'

const api = {
  reportList: '/report/list',
  inAppList: '/report/list/in_app',
  dashboardHeadRevenues: '/report/dashboard/head/revenues',
  dashboardRegionRevenues: '/report/dashboard/regions/revenues',
  reportBuilders: '/report/builders',
  reportBuilderCreate: '/report/builder/create',
  reportBuilderRemove: '/report/builder/delete',
  reportBuilderUpdate: '/report/builder/update',
  reportBuilderStatusUpdate: '/report/builder/status/update',
  reportBuilderTest: '/report/builder/test'
}

export function getReportList (params) {
  return axios({
    url: api.reportList,
    method: 'POST',
    headers: JsonHeader,
    data: params
  })
}

export function getDashboardHeadRevenues (params) {
  return axios({
    url: api.dashboardHeadRevenues,
    method: 'get',
    params: params
  })
}

export function getDashboardRegionsRevenues (params) {
  return axios({
    url: api.dashboardRegionRevenues,
    method: 'get',
    params: params
  })
}

export function getReportBuilderList (params) {
  return axios({
    url: api.reportBuilders,
    method: 'get',
    params: params
  })
}

export function createReportBuilder (params) {
  return axios({
    url: api.reportBuilderCreate,
    method: 'post',
    headers: JsonHeader,
    data: params
  })
}

export function updateReportBuilder (params) {
  return axios({
    url: api.reportBuilderUpdate,
    method: 'post',
    headers: JsonHeader,
    data: params
  })
}

export function updateReportBuilderStatus (params) {
  return axios({
    url: api.reportBuilderStatusUpdate,
    method: 'post',
    params: params
  })
}

export function removeReportBuilder (params) {
  return axios({
    url: api.reportBuilderRemove,
    method: 'post',
    params: params
  })
}

export function testReportBuilder (params) {
  return axios({
    url: api.reportBuilderTest,
    method: 'get',
    params: params
  })
}

export function inAppList (params) {
  return axios({
    url: api.inAppList,
    method: 'POST',
    headers: JsonHeader,
    data: params
  })
}
