import Vue from 'vue'
import { MEDIATION_INS, MEDIATION_WTF, MEDIATION_RUL, MEDIATION_INS_LATER, MEDIATION_WTF_LATER, MEDIATION_RUL_LATER } from '@/store/mutation-types'
import { getInstance } from '@/api/mediation'
import global from '@/global'
import i18n from '../../../../lang'
import numerify from 'numerify'
numerify('1', '0,0')
class OpenExpand {
  constructor (rowKeys, record, data) {
    this.rowKeys = rowKeys
    this.record = record
    this.data = data
    this.init()
  }
  init () {
    if (this.getLength() > 0) {
      if (this.getIndex() > -1) {
        this.delKey(this.getIndex())
        this.changeStatus({ edit: false, expand: false })
      } else {
        this.delKey(0)
        this.clearOtherStatus()
        this.changeStatus({ expand: true })
        this.addKey()
      }
    } else {
      this.addKey()
      this.changeStatus({ expand: true })
    }
  }
  clearOtherStatus () {
    this.data.forEach(item => {
      if (item.id !== this.record.id) {
        item.expandStatus = false
        item.editStatus = false
        item.ecpmSatus = false
      }
    })
  }
  getLength () {
    return this.rowKeys.length
  }
  getIndex () {
    return this.rowKeys.indexOf(this.record.id)
  }
  addKey () {
    this.rowKeys.push(this.record.id)
  }
  delKey (i) {
    this.rowKeys.splice(i, 1)
  }
  changeStatus (o) {
    for (const k in o) {
      if (k === 'edit') {
        this.record.editStatus = o[k]
      } else if (k === 'expand') {
        this.record.expandStatus = o[k]
      } else {}
    }
  }
  getRecord () {
    return this.record
  }
  getRowKeys () {
    return this.rowKeys
  }
  getData () {
    return this.data
  }
}
const OpenExpandObj = function (rowKeys, record, data) {
  return new OpenExpand(rowKeys, record, data)
}
const initFormRuleObj = (text = '') => {
  return {
    error: false,
    text: text,
    code: 0
  }
}
const setRepeatObj = (name, record, error, text, code) => {
  record[name + 'Varified'] = {
    error: error,
    text: text,
    code: code
  }
}
const checkInterfaceRepeatAction = (record) => {
  return new Promise((resolve, reject) => {
    if (record.placementKey) {
      getInstance({ placementKey: record.placementKey, pubAppId: record.pubAppId, adnId: record.adnId }).then(res => {
        // if (res.data && res.data.length) {
        //   setRepeatObj('placementKey', record, true, 'Unit ID already exist', 2)
        // } else {
        //   setRepeatObj('placementKey', record, false, 'Unit ID can use!', 3)
        // }
        if (res.data && res.data.length) {
          setRepeatObj('placementKey', record, true, 'Unit ID already exist', 2)
          reject(new Error())
        } else {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}
const varifiedForm = (name, record) => {
  return isEmptyForm(name, record)
}
const isEmptyForm = (name, record) => {
  if (!record[name]) {
    record[name + 'Varified'].error = true
    return false
  } else {
    record[name + 'Varified'].error = false
    return true
  }
}
const swapArray = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  arr[index1].TierIndex = index1 + 1
  arr[index2].TierIndex = index2 + 1
}
const swapArray2 = (arr, index1, index2, $set) => {
  // 之前交换逻辑不正确，直接赋值（类似于指针形式）交互Vue无法监听
  if (index1 === index2) {
    return arr
  } else if (index1 > index2) {
    const temp = JSON.parse(JSON.stringify(arr[index1]))
    let arrow = index1
    while (arrow !== index2) {
      // arr[arrow] = arr[arrow - 1]
      $set(arr, arrow, arr[arrow - 1])
      arrow = arrow - 1
    }
    // arr[index2] = temp
    $set(arr, index2, temp)
  } else {
    const temp = JSON.parse(JSON.stringify(arr[index1]))
    let arrow = index1
    while (arrow !== index2) {
      // arr[arrow] = arr[arrow + 1]
      $set(arr, arrow, arr[arrow + 1])
      arrow = arrow + 1
    }
    // arr[index2] = temp
    $set(arr, index2, temp)
  }
  return arr
}
// 置顶，即将当前元素移到数组的最后一位
const zIndexTop = (arr, index, length) => {
  if (index + 1 !== length) {
    // 首先判断当前元素需要上移几个位置,置底移动到数组的第一位
    var moveNum = length - 1 - index
    // 循环出需要一个一个上移的次数
    for (var i = 0; i < moveNum; i++) {
      swapArray(arr, index, index + 1)
      index++
    }
  }
}
const clearRepeatArr = (arr) => {
  return Array.from(new Set(arr))
}
const getAdnNameById = (id) => {
  return i18n.t('mediation.' + global.getAdnName(id))
}
const showRegionsformat = (regions) => {
  if (!regions) return
  let result = ''
  const res = regions.split(',')
  if (res && res.length > 0) {
    let i = 0
    for (; i < res.length; i++) {
      if (i > 1) {
        // result = result.slice(0, result.length - 1)
        result += ' ...'
        break
      } else {
        result += res[i] + ','
      }
      if (i === 1) {
        result = result.slice(0, result.length - 1)
      }
    }
    if (i === 1) {
      result = result.slice(0, result.length - 1)
    }
  }
  return result
}
const getGuideInfo = (key) => {
  let result = ''
  switch (key) {
    case 'bt':
      result = Vue.ls.get(MEDIATION_INS, 0)
      break
    case 'wf':
      result = Vue.ls.get(MEDIATION_WTF, 0)
      break
    case 'rl':
      result = Vue.ls.get(MEDIATION_RUL, 0)
      break
    case 'bt_l':
      result = Vue.ls.get(MEDIATION_INS_LATER, 0)
      break
    case 'wf_l':
      result = Vue.ls.get(MEDIATION_WTF_LATER, 0)
      break
    case 'rl_l':
      result = Vue.ls.get(MEDIATION_RUL_LATER, 0)
      break
    default:
      return result
  }
  return result
}
const setGuideInfo = (key, val) => {
  switch (key) {
    case 'bt':
      Vue.ls.set(MEDIATION_INS, val)
      break
    case 'wf':
      Vue.ls.set(MEDIATION_WTF, val)
      break
    case 'rl':
      Vue.ls.set(MEDIATION_RUL, val)
      break
    case 'bt_l':
      Vue.ls.set(MEDIATION_INS_LATER, val)
      break
    case 'wf_l':
      Vue.ls.set(MEDIATION_WTF_LATER, val)
      break
    case 'rl_l':
      Vue.ls.set(MEDIATION_RUL_LATER, val)
      break
    default:
  }
}
const getElementToPageTop = (el) => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop
  }
  return el.offsetTop
}
const formatData = (v, f) => {
  if (!v) {
    v = 0
  }
  if (!f) {
    f = '0,0'
  }
  return numerify(v, f)
}
export {
  OpenExpandObj,
  initFormRuleObj,
  varifiedForm,
  isEmptyForm,
  checkInterfaceRepeatAction,
  swapArray,
  swapArray2,
  zIndexTop,
  clearRepeatArr,
  getAdnNameById,
  showRegionsformat,
  getGuideInfo,
  setGuideInfo,
  getElementToPageTop,
  formatData
}
