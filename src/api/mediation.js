// mediation api
import { axios } from '@/utils/request'

const api = {
  adNetworkList: 'app/adnetwork/list',
  adNetworkSelectList: '/adnetwork/select/list',
  adNetworkAppList: '/adnetwork/app/list',
  adNetworkAppGet: '/adnetwork/app/get',
  adNetworkAppUpdate: '/adnetwork/app/update',
  adNetworkAppCreate: '/adnetwork/app/create',
  adNetworkAppStatusUpdate: '/adnetwork/app/status/update',
  adNetworkInstancesList: '/adnetwork/placement/instances',
  instancesStatusUpdate: '/instance/update/status',
  instancesUpdate: '/instance/update',
  instancesCreate: '/instance/create',
  getInstance: '/instance/get',
  instancesSelectList: '/instance/select/list',
  segmentList: '/mediation/segment/list',
  segmentGet: '/mediation/segment/get',
  segmentUpdate: '/mediation/segment/update',
  segmentUpdateWithInstance: '/mediation/segment/save',
  segmentCreate: '/mediation/segment/create',
  segmentRuleUpdate: '/mediation/segment/rule/update',
  mediationRuleInstanceList: '/mediation/segment/instance/list',
  mediationRuleInstanceUpdate: '/mediation/segment/instance/update',
  mediationSegmentRuleInstanceCreate: '/mediation/segment/rule/instance/create', // enable
  mediationSegmentRuleInstanceDelete: '/mediation/segment/rule/instance/delete', // disable
  regionList: '/util/country/list',
  segmentResortPriority: '/mediation/segment/resort/priority',
  rulePriorityUpdate: '/mediation/rule/resort/priority',
  segmentRuleDelete: '/mediation/segment/rule/delete',
  admobGrantToken: '/report/callback/oauth2authorize'

}
export function getInstance (params) {
  return axios({
    url: api.getInstance,
    method: 'get',
    params: params
  })
}
export function segmentRuleDelete (params) {
  return axios({
    url: api.segmentRuleDelete,
    method: 'get',
    params: params
  })
}
export function rulePriorityUpdate (params) {
  return axios({
    url: api.rulePriorityUpdate,
    method: 'get',
    params: params
  })
}
export function mediationSegmentRuleInstanceDelete (params) {
  return axios({
    url: api.mediationSegmentRuleInstanceDelete,
    method: 'get',
    params: params
  })
}
export function segmentRuleUpdate (data) {
  return axios({
    url: api.segmentRuleUpdate,
    method: 'post',
    data: data
  })
}
export function mediationSegmentRuleInstanceCreate (data) {
  return axios({
    url: api.mediationSegmentRuleInstanceCreate,
    method: 'post',
    data: data
  })
}
export function segmentResortPriority (params) {
  return axios({
    url: api.segmentResortPriority,
    method: 'get',
    params: params
  })
}
export function regionList (params) {
  return axios({
    url: api.regionList,
    method: 'get',
    params: params
  })
}
export function segmentGet (params) {
  return axios({
    url: api.segmentGet,
    method: 'get',
    params: params
  })
}
export function adNetworkSelectList (params) {
  return axios({
    url: api.adNetworkSelectList,
    method: 'get',
    params: params
  })
}
export function segmentUpdate (data) {
  return axios({
    url: api.segmentUpdate,
    method: 'post',
    data: data
  })
}
export function mediationRuleInstanceUpdate (data) {
  return axios({
    url: api.mediationRuleInstanceUpdate,
    method: 'post',
    data: data
  })
}
export function mediationRuleInstanceList (params) {
  return axios({
    url: api.mediationRuleInstanceList,
    method: 'get',
    params: params
  })
}
export function segmentCreate (data) {
  return axios({
    url: api.segmentCreate,
    method: 'post',
    data: data
  })
}
export function adNetworkAppList (params) {
  return axios({
    url: api.adNetworkAppList,
    method: 'get',
    params: params
  })
}
export function segmentList (params) {
  return axios({
    url: api.segmentList,
    method: 'get',
    params: params
  })
}
export function instancesSelectList (params) {
  return axios({
    url: api.instancesSelectList,
    method: 'get',
    params: params
  })
}
export function adNetworkAppGet (params) {
  return axios({
    url: api.adNetworkAppGet,
    method: 'get',
    params: params
  })
}
export function instancesStatusUpdate (params) {
  return axios({
    url: api.instancesStatusUpdate,
    method: 'get',
    params: params
  })
}
export function instancesUpdate (data) {
  return axios({
    url: api.instancesUpdate,
    method: 'post',
    data: data
  })
}
export function instancesCreate (data) {
  return axios({
    url: api.instancesCreate,
    method: 'post',
    data: data
  })
}
export function adNetworkList (params) {
  return axios({
    url: api.adNetworkList,
    method: 'get',
    params: params
  })
}
export function adNetworkAppCreate (data) {
  return axios({
    url: api.adNetworkAppCreate,
    method: 'post',
    data: data
  })
}
export function adNetworkAppUpdate (data) {
  return axios({
    url: api.adNetworkAppUpdate,
    method: 'post',
    data: data
  })
}
export function adNetworkAppStatusUpdate (params) {
  return axios({
    url: api.adNetworkAppStatusUpdate,
    method: 'get',
    params: params
  })
}
export function adNetworkInstancesList (params) {
  return axios({
    url: api.adNetworkInstancesList,
    method: 'get',
    params: params
  })
}
export function admobGrantToken (params) {
  return axios({
    url: api.admobGrantToken,
    method: 'get',
    params: params
  })
}
export function segmentUpdateWithInstance (data) {
  return axios({
    url: api.segmentUpdateWithInstance,
    method: 'post',
    data: data
  })
}
