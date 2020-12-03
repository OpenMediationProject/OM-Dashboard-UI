// Report API

import { axios, JsonHeader } from '@/utils/request'

const api = {
  reportList: '/report/list',
  inAppList: '/report/list/in_app',
  reportRetention: '/report/retention',
  reportRetentionChart: '/report/retention/chart',
  reportLtv: '/report/ltv',
  reportLtvChart: '/report/ltv/chart',
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
export function reportLtvChart (data) {
  const params = new URLSearchParams()
  Object.keys(data).forEach(function (key) {
    if (data[key] instanceof Array) {
      data[key].forEach(v => {
        params.append(key, v)
      })
    } else {
      params.append(key, data[key])
    }
  })
  return axios({
    url: api.reportLtvChart,
    method: 'post',
    data: params
  })
}
export function reportRetentionChart (data) {
  const params = new URLSearchParams()
  Object.keys(data).forEach(function (key) {
    if (data[key] instanceof Array) {
      data[key].forEach(v => {
        params.append(key, v)
      })
    } else {
      params.append(key, data[key])
    }
  })
  return axios({
    url: api.reportRetentionChart,
    method: 'post',
    data: params
  })
}
export function reportRetention (data) {
  const params = new URLSearchParams()
  Object.keys(data).forEach(function (key) {
    if (data[key] instanceof Array) {
      data[key].forEach(v => {
        params.append(key, v)
      })
    } else {
      params.append(key, data[key])
    }
  })
  return axios({
    url: api.reportRetention,
    method: 'post',
    data: params
  })
}
export function reportLtv (data) {
  const params = new URLSearchParams()
  Object.keys(data).forEach(function (key) {
    if (data[key] instanceof Array) {
      data[key].forEach(v => {
        params.append(key, v)
      })
    } else {
      params.append(key, data[key])
    }
  })
  return axios({
    url: api.reportLtv,
    method: 'post',
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
