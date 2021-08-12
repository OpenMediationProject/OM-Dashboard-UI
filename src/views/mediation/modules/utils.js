const initFormRuleObj = (text = '') => {
  return {
    error: false,
    text: text,
    code: 0
  }
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
const clearRepeatArr = (arr) => {
  return Array.from(new Set(arr))
}
export {
  initFormRuleObj,
  varifiedForm,
  clearRepeatArr
}
