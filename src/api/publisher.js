// Apps and Placements api

import { axios } from '@/utils/request'

const api = {
  publisherGet: '/publisher/get',
  appInfo: '/publisher/app/list',
  appList: '/publisher/app/list',
  updateApp: '/publisher/app/update',
  createApp: '/publisher/app/create',
  searchAppFromStore: '/app/get',
  placementList: '/placement/list',
  placementGet: '/placement/get',
  placementSelectList: '/placement/select/list',
  placementCreate: '/placement/create',
  placementUpdate: '/placement/update',
  placementScenesList: '/placement/scenes',
  placementScenesCreate: '/placement/scene/create',
  placementScenesUpdate: '/placement/scene/update',
  appSelectList: '/publisher/app/sort_list',
  brandSearch: '/util/device/brand/list',
  modelSearch: '/util/device/model/list',
  currencyList: '/util/currency/list'
}
export function publisherGet (params) {
  return axios({
    url: api.publisherGet,
    method: 'get',
    params: params
  })
}
export function currencyList (params) {
  return axios({
    url: api.currencyList,
    method: 'get',
    params: params
  })
}
export function searchAppFromStore (params) {
  return axios({
    url: api.searchAppFromStore,
    method: 'get',
    params: params
  })
}
export function placementSelectList (params) {
  return axios({
    url: api.placementSelectList,
    method: 'get',
    params: params
  })
}
export function getAppList (params) {
  return axios({
    url: api.appList,
    method: 'get',
    params: params
  })
}
export function appSelectList (params) {
  return axios({
    url: api.appSelectList,
    method: 'get',
    params: params
  })
}
export function updateApp (data) {
  return axios({
    url: api.updateApp,
    method: 'post',
    data: data
  })
}
export function createApp (data) {
  return axios({
    url: api.createApp,
    method: 'post',
    data: data
  })
}

export function placementList (params) {
  return axios({
    url: api.placementList,
    method: 'get',
    params: params
  })
}

export function placementUpdate (data) {
  return axios({
    url: api.placementUpdate,
    method: 'post',
    data: data
  })
}
export function placementCreate (data) {
  return axios({
    url: api.placementCreate,
    method: 'post',
    data: data
  })
}

export function placementGet (params) {
  return axios({
    url: api.placementGet,
    method: 'get',
    params: params
  })
}

export function placementScenesList (params) {
  return axios({
    url: api.placementScenesList,
    method: 'get',
    params: params
  })
}
export function placementScenesCreate (data) {
  return axios({
    url: api.placementScenesCreate,
    method: 'post',
    data: data
  })
}
export function placementScenesUpdate (data) {
  return axios({
    url: api.placementScenesUpdate,
    method: 'post',
    data: data
  })
}
export function brandSearch (params) {
  return axios({
    url: api.brandSearch,
    method: 'get',
    params: params
  })
}
export function modelSearch (params) {
  return axios({
    url: api.modelSearch,
    method: 'get',
    params: params
  })
}
