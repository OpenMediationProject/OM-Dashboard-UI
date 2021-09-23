export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? 'Good morning  ' : hour <= 11 ? 'Good morning' : hour <= 13 ? 'Good noon' : hour < 20 ? 'Good afternoon' : 'Good evening  '
}

/**
 *  window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * compare two Array<br>
 * arrDiff(undefined, null): false<br>
 * arrDiff(undefined, undefined): false<br>
 * arrDiff(undefined, []): false<br>
 * arrDiff([], undefined): false<br>
 * arrDiff(undefined, [1]): true<br>
 * arrDiff([1,2], [1]): true<br>
 * arrDiff([1,2], [1,2]): false<br>
 * @param {Array} a
 * @param {Array} b
 * @returns {boolean} true: not equals
 */
export function arrDiff (a, b) {
  if (a === b) return false
  if (!a) {
    if (!b) return false
    return !!b.length
  }
  if (!b) return !!a.length
  return a.join('#$&#') !== b.join('#$&#')
}

/**
 * compare two Objects
 * @param {Object} a reqiured
 * @param {Object} b reqiured
 * @returns {boolean} true: not equals
 */
export function objDiff (a, b) {
  if (a === b) return false
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  if (arrDiff(aKeys, bKeys)) return true
  for (const k of aKeys) {
    const aV = a[k]
    const bV = b[k]
    const aEmtpy = (aV === undefined || aV === null)
    const bEmpty = (bV === undefined || bV === null)
    if (aEmtpy && bEmpty) continue
    if (aEmtpy !== bEmpty) return true
    if (Array.isArray(aV)) {
      if (!Array.isArray(bV)) return true
      if (arrDiff(aV, bV)) return true
    } else if (aV !== bV) {
      return true
    }
  }
  return false
}
export function convertDate (date, format) {
  let result = ''
  switch (format) {
    case 'ymd':
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      result = date.getFullYear() + '-' + m + '-' + d
      break
    default:
      break
  }
  return result
}
export function calcuStartDate (date, num) {
  date.setDate(date.getDate() - num)
  let m = date.getMonth() + 1
  let d = date.getDate()
  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }
  return date.getFullYear() + '-' + m + '-' + d
}
