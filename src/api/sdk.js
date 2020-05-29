import { axios } from '@/utils/request'

const api = {
  deviceList: '/sdk/devices',
  createDevice: '/sdk/device/create',
  deleteDevice: '/sdk/device/delete',
  adNetWorkList: '/sdk/adnetworks',
  AdNetworkPlacements: '/sdk/adnetwork/placements',
  createDevApp: '/sdk/dev_app/create',
  updateDevAppTestResult: '/sdk/dev_app/dev_result/update',
  devAppGet: '/sdk/dev_app/get'
}
export function devAppGet (params) {
  return axios({
    url: api.devAppGet,
    method: 'get',
    params: params
  })
}
export function deviceList (params) {
  return axios({
    url: api.deviceList,
    method: 'get',
    params: params
  })
}
export function createDevice (data) {
  return axios({
    url: api.createDevice,
    method: 'post',
    data: data
  })
}
export function deleteDevice (params) {
  return axios({
    url: api.deleteDevice,
    method: 'get',
    params: params
  })
}
export function adNetWorkList (params) {
  return axios({
    url: api.adNetWorkList,
    method: 'get',
    params: params
  })
}
export function AdNetworkPlacements (params) {
  return axios({
    url: api.AdNetworkPlacements,
    method: 'get',
    params: params
  })
}
export function createDevApp (data) {
  return axios({
    url: api.createDevApp,
    method: 'post',
    data: data
  })
}
export function updateDevAppTestResult (params) {
  return axios({
    url: api.updateDevAppTestResult,
    method: 'get',
    params: params
  })
}
