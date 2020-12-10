<template>
  <div
    class="popupContainer bottom-right"
    id="previewControl"
    @click="previewClick($event)"
    xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="creative-popup-wrapper" :style="'width:' + preview_width + 'px'">
      <div class="creative-preview-container" :style="'height:' + preview_height + 'px'">
        <iframe allow="autoplay" class="adunitFrame" id="iframePreview"></iframe>
      </div>
    </div>
    <div class="deviceSelectionFooter" v-show="[2, 3].includes(type)">
      <span class="selectedTitle">Phone Landscape</span>
      <div :class="['iconWrapper', { selected: ipadPClass }]" id="ipad_p" @click="ipadPortraitClick">
        <svg width="14px" height="18px" viewBox="0 0 14 18" version="1.1">
          <title>4BCB93A1-2F86-411E-9308-E94289A339FD</title>
          <desc>Created with sketchtool.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              id="Icon-Library"
              transform="translate(-1384.000000, -3596.000000)"
              fill="#52677B"
              fill-rule="nonzero">
              <path
                d="M1385,3597 L1385,3613 L1397,3613 L1397,3597 L1385,3597 Z M1385,3596 L1397,3596 C1397.55228,3596 1398,3596.44772 1398,3597 L1398,3613 C1398,3613.55228 1397.55228,3614 1397,3614 L1385,3614 C1384.44772,3614 1384,3613.55228 1384,3613 L1384,3597 C1384,3596.44772 1384.44772,3596 1385,3596 Z M1390,3610 L1392,3610 L1392,3612 L1390,3612 L1390,3610 Z M1389,3598 L1393,3598 L1393,3599 L1389,3599 L1389,3598 Z"
                id="tablet-portrait"></path>
            </g>
          </g>
        </svg>
      </div>
      <div :class="['iconWrapper', { selected: ipadLClass }, 'landscape']" id="ipad_l" @click="ipadLandscapeClick">
        <svg width="18px" height="14px" viewBox="0 0 18 14" version="1.1">
          <title>656A99FA-CA10-4E68-9530-44CCD60D1F3C</title>
          <desc>Created with sketchtool.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              id="Icon-Library"
              transform="translate(-1509.000000, -3598.000000)"
              fill="#52677B"
              fill-rule="nonzero">
              <path
                d="M1510,3599 L1510,3611 L1526,3611 L1526,3599 L1510,3599 Z M1510,3598 L1526,3598 C1526.55228,3598 1527,3598.44772 1527,3599 L1527,3611 C1527,3611.55228 1526.55228,3612 1526,3612 L1510,3612 C1509.44772,3612 1509,3611.55228 1509,3611 L1509,3599 C1509,3598.44772 1509.44772,3598 1510,3598 Z M1511,3604 L1513,3604 L1513,3606 L1511,3606 L1511,3604 Z M1524,3603 L1525,3603 L1525,3607 L1524,3607 L1524,3603 Z"
                id="tablet-landscape"></path>
            </g>
          </g>
        </svg>
      </div>
      <div :class="['iconWrapper', { selected: iphonePClass }]" id="iphone_p" @click="iphonePortraitClick">
        <svg width="10px" height="18px" viewBox="0 0 10 18" version="1.1">
          <title>529BF761-09CD-4660-907B-0BDA2EC2E9AB</title>
          <desc>Created with sketchtool.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              id="Icon-Library"
              transform="translate(-1132.000000, -3601.000000)"
              fill="#52677B"
              fill-rule="nonzero">
              <path
                d="M1133,3602 L1133,3618 L1141,3618 L1141,3602 L1133,3602 Z M1133,3601 L1141,3601 C1141.55228,3601 1142,3601.44772 1142,3602 L1142,3618 C1142,3618.55228 1141.55228,3619 1141,3619 L1133,3619 C1132.44772,3619 1132,3618.55228 1132,3618 L1132,3602 C1132,3601.44772 1132.44772,3601 1133,3601 Z M1136,3615 L1138,3615 L1138,3617 L1136,3617 L1136,3615 Z M1135,3603 L1139,3603 L1139,3604 L1135,3604 L1135,3603 Z"
                id="phone-portrait"></path>
            </g>
          </g>
        </svg>
      </div>
      <div :class="['iconWrapper', { selected: iphoneLClass }, 'landscape']" id="iphone_l" @click="iphoneLandscapeClick">
        <svg width="18px" height="10px" viewBox="0 0 18 10" version="1.1">
          <title>A01915F1-C01B-474F-877D-E2CEB21B4EE4</title>
          <desc>Created with sketchtool.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              id="Icon-Library"
              transform="translate(-1255.000000, -3604.000000)"
              fill="#52677B"
              fill-rule="nonzero">
              <path
                d="M1256,3605 L1256,3613 L1272,3613 L1272,3605 L1256,3605 Z M1256,3604 L1272,3604 C1272.55228,3604 1273,3604.44772 1273,3605 L1273,3613 C1273,3613.55228 1272.55228,3614 1272,3614 L1256,3614 C1255.44772,3614 1255,3613.55228 1255,3613 L1255,3605 C1255,3604.44772 1255.44772,3604 1256,3604 Z M1257,3608 L1259,3608 L1259,3610 L1257,3610 L1257,3608 Z M1270,3607 L1271,3607 L1271,3611 L1270,3611 L1270,3607 Z"
                id="phone-landscape-"></path>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CreativePreview',
  components: {
  },
  created () {
    this.showTemplate()
  },
  data () {
    return {
      data: this.creative,
      preview_width: (this.creative.w || 312) + 4,
      preview_height: (this.creative.h || 560) + 4,
      type: this.creative.creativeType,
      ipadPClass: false,
      ipadLClass: false,
      iphonePClass: true,
      iphoneLClass: false
    }
  },
  props: {
    creative: {
      type: Object,
      required: true
    }
  },
  watch: {
    creative (v) {
      this.data = v
    }
  },
  methods: {
    previewClick (e) {
      e.preventDefault()
      e.cancelBubble = true
      return false
    },
    iphoneLandscapeClick () {
      this.preview_width = 564
      this.preview_height = 316
      this.ipadPClass = false
      this.ipadLClass = false
      this.iphonePClass = false
      this.iphoneLClass = true
    },
    iphonePortraitClick () {
      this.preview_width = 316
      this.preview_height = 564
      this.ipadPClass = false
      this.ipadLClass = false
      this.iphonePClass = true
      this.iphoneLClass = false
    },
    ipadLandscapeClick () {
      this.preview_width = 610
      this.preview_height = 457
      this.ipadPClass = false
      this.ipadLClass = true
      this.iphonePClass = false
      this.iphoneLClass = false
    },
    ipadPortraitClick () {
      this.preview_width = 457
      this.preview_height = 610
      this.ipadPClass = true
      this.ipadLClass = false
      this.iphonePClass = false
      this.iphoneLClass = false
    },
    loadIframe (url, initData, callback) {
      const _this = this
      fetch(url, { cache: 'no-cache' }).then(o => o.text()).then(res => {
        const d = res
          .replace(/^images\//g, 'https://img.adtiming.com/sw/images/')
          .replace(/touchend/g, 'click')
        const iframe = document.querySelector('#iframePreview')
        const iwin = iframe.contentWindow
        iwin.url = url
        iwin.sdk = {
          postMessage (msg) {
            const { m, d } = JSON.parse(msg)
            console.log(`method: ${m}, data:`, d)
            switch (m) {
              case 'jsLoaded':
                initData.type = 'wv.init'
                iwin.postMessage(initData, '*')
                break
              case 'close':
                if (iwin.url.indexOf('ec.html') > -1) {
                  _this.closePreview()
                }
                break
              default:
                break
            }
          }
        }
        iwin.document.write(d)
        let evt = iwin.document.createEvent('Event')
        evt.initEvent('load', true, false)
        iwin.dispatchEvent(evt)

        evt = iwin.document.createEvent('Event')
        evt.initEvent('resize', true, false)
        iwin.dispatchEvent(evt)
        if (callback) {
          callback()
        }
      }).catch(e => console.log('load frame error', e))
    },
    closePreview () {
      this.$emit('close')
    },
    showTemplate () {
      Object.assign(this.data, { mk: 1, lang: navigator.language })
      const _this = this
      const initData = {
        type: 'wv.init',
        placement: {
          id: 4944,
          rl: 10
        },
        campaign: {
          test: 1,
          title: this.data.title,
          descn: this.data.description,
          resources: this.data.resources,
          imptks: [],
          link: this.data.ad_url,
          imgs: [this.data.mainimg_url],
          adtype: 4,
          cid: this.data.campaign_id,
          crid: this.data.cid,
          expire: 21600,
          ves: {
            start: [],
            complete: []
          },
          video: {
            url: this.data.video_url,
            dur: 25
          },
          ps: 'country=USA&make=&brand=&model=&osv=9.0&req_id=6eb41101-c1dc-4fb0-ad52-65b89fa0e039&bid_time=1595396952159&did=1A76016B-EC55-4280-88EA-F07FBD9742C2&uid=eb7136ce-1b04-4cc2-8fa5-43732f032222&iid=11312&size=300X250&place=4941&s=6&mb=1166619854&con_type=2&sdkv=5.6.0&cr=&lang=zh&tag=0&cid=187190753&ctid=274316088',
          app: {
            id: 'com.ff',
            name: this.data.app_name,
            icon: this.data.icon_url,
            rating: 4.5
          },
          iswv: false,
          mk: {
            logo: '',
            link: ''
          }
        },
        bfs: {},
        scene: {
          id: 0,
          name: 'DS'
        }
      }

      this.loadIframe(this.data.resources[0], initData, () => {
        const iframe = document.querySelector('#iframePreview')
        if (this.data.resources.length > 1) {
          iframe.addEventListener('load', e => {
            // about:blank 解决跨域问题
            iframe.contentWindow.location.href = 'about:blank'
            this.loadIframe(this.data.resources[1], initData)
          }, { once: true })
        }
      })
      setTimeout(function () {
        document.body.addEventListener('click', _this.closePreview, { once: true })
      }, 100)
    }
  }
}
</script>

<style type="less" scoped>

  .popupContainer {
    bottom: 5px;
    right: 5px;
    position: fixed;
    z-index: 3011;
  }

  .creative-popup-wrapper {
    box-shadow: 0 0 10px 0 rgba(0,0,0,.5);
  }
  .creative-preview-container {
    height: 320px;
    border: 2px solid #f3f5f7;
  }

  .adunitFrame {
    display: block;
    width: 100%;
    height: 100%;
    background-color: white;
    border: none;
  }

  .deviceSelectionFooter {
    padding: 3px 0 0 10px;
    height: 34px;
    line-height: 34px;
    background-color: #f3f5f7;
  }

  .selectedTitle {
    font-size: 13px;
    font-family: HelveticaNeue,helvetica,sans-serif;
    font-weight: 400;
    color: #172d4c;
    top: -2px;
    position: relative;
  }

  .iconWrapper {
    width: 28px;
    height: 28px;
    float: right;
    text-align: center;
    margin-right: 2px;
  }

  .iconWrapper.landscape {
    line-height: 28px;
  }

  .iconWrapper.landscape {
    line-height: 28px;
  }

  .iconWrapper.selected,.iconWrapper:hover {
    border-radius: 3px;
    background-color: #3091f6;
  }
</style>
