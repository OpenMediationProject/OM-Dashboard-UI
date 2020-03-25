// User manage Api

import { axios } from '@/utils/request'

const api = {
  userList: '/user/list',
  userSelectList: '/user/select/list',
  userCreate: '/user/create',
  userDelete: '/user/delete',
  userUpdate: '/user/update',
  userAppList: '/user/app/list',
  userAppCreate: '/user/app/create',
  userAppDelete: '/user/app/delete',
  userRoleList: '/user/role/list',
  userRoleSelectList: '/user/role/select/list',
  userRoleCreate: '/user/role/create',
  userRoleUpdate: '/user/role/update',
  userRoleDelete: '/user/role/delete',
  userRolePermissionCreate: '/user/role/permission/create',
  userRolePermissionDelete: '/user/role/permission/delete',
  orgList: '/publisher/list',
  orgSelectList: '/publisher/select/list',
  publisherCreate: '/publisher/create',
  publisherUpdate: '/publisher/update',
  userGetEmail: '/user/get',
  passwordUpdate: '/user/password/update',
  umOrgList: '/publisher/user/list',
  switchPublisher: '/auth/login/switch/publisher'
}
export function switchPublisher (params) {
  return axios({
    url: api.switchPublisher,
    method: 'get',
    params: params
  })
}
export function umOrgList (params) {
  return axios({
    url: api.umOrgList,
    method: 'get',
    params: params
  })
}
export function passwordUpdate (data) {
  return axios({
    url: api.passwordUpdate,
    method: 'post',
    data: data
  })
}
export function userList (params) {
  return axios({
    url: api.userList,
    method: 'get',
    params: params
  })
}
export function userSelectList (params) {
  return axios({
    url: api.userSelectList,
    method: 'get',
    params: params
  })
}
export function userAppList (params) {
  return axios({
    url: api.userAppList,
    method: 'get',
    params: params
  })
}
export function userAppDelete (params) {
  return axios({
    url: api.userAppDelete,
    method: 'get',
    params: params
  })
}
export function userCreate (data) {
  return axios({
    url: api.userCreate,
    method: 'post',
    data: data
  })
}
export function userUpdate (data) {
  return axios({
    url: api.userUpdate,
    method: 'post',
    data: data
  })
}
export function userDelete (params) {
  return axios({
    url: api.userDelete,
    method: 'get',
    params: params
  })
}
export function userRoleList (params) {
  return axios({
    url: api.userRoleList,
    method: 'get',
    params: params
  })
}
export function userRoleSelectList (params) {
  return axios({
    url: api.userRoleSelectList,
    method: 'get',
    params: params
  })
}
export function userRoleCreate (data) {
  return axios({
    url: api.userRoleCreate,
    method: 'post',
    data: data
  })
}
export function userRolePermissionCreate (params) {
  return axios({
    url: api.userRolePermissionCreate,
    method: 'get',
    params: params
  })
}
export function userRoleUpdate (params) {
  return axios({
    url: api.userRoleUpdate,
    method: 'get',
    params: params
  })
}
export function userRolePermissionDelete (params) {
  return axios({
    url: api.userRolePermissionDelete,
    method: 'get',
    params: params
  })
}
export function userAppCreate (data) {
  return axios({
    url: api.userAppCreate,
    method: 'post',
    data: data
  })
}
export function orgList (params) {
  return axios({
    url: api.orgList,
    method: 'get',
    params: params
  })
}
export function orgSelectList (params) {
  return axios({
    url: api.orgSelectList,
    method: 'get',
    params: params
  })
}
export function publisherCreate (data) {
  return axios({
    url: api.publisherCreate,
    method: 'post',
    data: data
  })
}
export function publisherUpdate (data) {
  return axios({
    url: api.publisherUpdate,
    method: 'post',
    data: data
  })
}
export function userGetEmail (params) {
  return axios({
    url: api.userGetEmail,
    method: 'get',
    params: params
  })
}
