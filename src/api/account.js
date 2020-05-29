import { axios } from '@/utils/request'

const api = {
  accountList: '/publisher/account/list',
  accountCreate: '/publisher/account/create',
  accountUpdate: '/publisher/account/update',
  accountDelete: '/publisher/account/delete',
  accountSelectList: '/publisher/account/select/list',
  googleTokenSave: '/report/google/refreshToken/save'
}
export function accountList (params) {
  return axios({
    url: api.accountList,
    method: 'get',
    params: params
  })
}
export function accountCreate (data) {
  return axios({
    url: api.accountCreate,
    method: 'post',
    data: data
  })
}
export function accountUpdate (data) {
  return axios({
    url: api.accountUpdate,
    method: 'post',
    data: data
  })
}
export function accountDelete (params) {
  return axios({
    url: api.accountDelete,
    method: 'get',
    params: params
  })
}
export function accountSelectList (params) {
  return axios({
    url: api.accountSelectList,
    method: 'get',
    params: params
  })
}
export function googleTokenSave (params) {
  return axios({
    url: api.googleTokenSave,
    method: 'get',
    params: params
  })
}
