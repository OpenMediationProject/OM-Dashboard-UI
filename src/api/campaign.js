import { axios, JsonHeader } from '@/utils/request'

const api = {
  materialList: '/cross/bid/get_materials',
  templateList: '/cross/bid/get_templates',
  materialUpload: '/cross/bid/file_upload',
  createMaterial: '/cross/bid/create_material',
  campaignList: '/cross/bid/get_campaigns',
  campaignCreate: '/cross/bid/create_campaign',
  getCampaign: '/cross/bid/get_campaign',
  campaignUpdate: '/cross/bid/update_campaign',
  campaignStatusUpdate: '/cross/bid/update_campaign_status',
  osVersions: '/util/get/os_versions',
  promoteAppSelectList: '/cross/bid/get_select_apps',
  promoteReportList: '/report/list/cross_bid'
}
export function promoteReportList (params) {
  return axios({
    url: api.promoteReportList,
    method: 'POST',
    headers: JsonHeader,
    data: params
  })
}

export function promoteAppSelectList (params) {
  return axios({
    url: api.promoteAppSelectList,
    method: 'get',
    params: params
  })
}
export function osVersions (params) {
  return axios({
    url: api.osVersions,
    method: 'get',
    params: params
  })
}
export function materialList (params) {
  return axios({
    url: api.materialList,
    method: 'get',
    params: params
  })
}
export function campaignStatusUpdate (params) {
  return axios({
    url: api.campaignStatusUpdate,
    method: 'get',
    params: params
  })
}
export function getCampaign (params) {
  return axios({
    url: api.getCampaign,
    method: 'get',
    params: params
  })
}
export function templateList (params) {
  return axios({
    url: api.templateList,
    method: 'get',
    params: params
  })
}
export function campaignList (params) {
  return axios({
    url: api.campaignList,
    method: 'get',
    params: params
  })
}
export function materialUpload (data) {
  return axios({
    url: api.materialUpload,
    method: 'post',
    data: data
  })
}
export function createMaterial (data) {
  return axios({
    url: api.createMaterial,
    method: 'post',
    data: data
  })
}
export function campaignCreate (data) {
  return axios({
    url: api.campaignCreate,
    method: 'post',
    data: data
  })
}
export function campaignUpdate (data) {
  return axios({
    url: api.campaignUpdate,
    method: 'post',
    data: data
  })
}
