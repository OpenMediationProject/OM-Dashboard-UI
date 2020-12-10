<template>
  <div>
    <div class="creative-container">
      <div class="creative-cad" :style="edit?'opacity: 0.3':'cursor: pointer;'" >
        <div class="add-card" :style="Object.keys(needAdd).length ? null: 'padding-top:170px;transform: translateY(-36%);'" @click="addAd">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.7857 9.92857H15.0714V2.21429C15.0714 1.26768 14.3038 0.5 13.3571 0.5H11.6429C10.6962 0.5 9.92857 1.26768 9.92857 2.21429V9.92857H2.21429C1.26768 9.92857 0.5 10.6962 0.5 11.6429V13.3571C0.5 14.3038 1.26768 15.0714 2.21429 15.0714H9.92857V22.7857C9.92857 23.7323 10.6962 24.5 11.6429 24.5H13.3571C14.3038 24.5 15.0714 23.7323 15.0714 22.7857V15.0714H22.7857C23.7323 15.0714 24.5 14.3038 24.5 13.3571V11.6429C24.5 10.6962 23.7323 9.92857 22.7857 9.92857Z" fill="#1A7DF1"/>
          </svg>
          Add Ads</div>
        <div v-if="Object.keys(needAdd).length" style="text-align: center;transform: translateY(-86%);color: #999999;">Please add ads with the following ad type<div style="margin-top: 8px;" />
          <a-tag style="color:#999999;padding: 4px 8px;" v-if="needAdd[2]">Video</a-tag>
          <a-tag style="color:#999999;padding: 4px 8px;" v-if="needAdd[0]">Banner</a-tag>
          <a-tag style="color:#999999;padding: 4px 8px;" v-if="needAdd[1]">Native</a-tag>
          <a-tag style="color:#999999;padding: 4px 8px;" v-if="needAdd[3]">Cross Promote</a-tag>
        </div>
      </div>
      <div
        v-if="list.length"
        class="creative-cad"
        :style="c.status===0 ? 'opacity:0.3' : null"
        v-for="(c) of list"
        :key="c.id">
        <div @click="show(c)" :style="'width: 100%;height: 160px;border-radius: 4px 4px 0px 0px;vertical-align: top;background-position: center center;background-size: contain;background-repeat: no-repeat;background-image: url('+c.cpMaterials.find(r=>r.type===0).url+')'" />
        <div style="margin-left: 8px;max-width: 288px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding-top: 8px;">
          {{ c.name }}</div>
        <a-tag style="margin-left: 8px;margin-top: 4px;">{{ typeMap[c.type].title }}</a-tag>
        <a-dropdown :trigger="['click']">
          <img style="float: right;margin-top: 4px;margin-right: 16px;" @click="e => e.preventDefault()" src="/icon/More.svg"/>
          <a-menu slot="overlay">
            <a-menu-item title="Delete">
              <a-popconfirm
                title="Are you really sure？"
                @confirm="()=>{
                  list.splice(c, 1)
                  getTypes(plcs)
                }"
                okText="Yes"
                cancelText="No">
                <img src="/icon/Delete.svg"> Delete
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item title="Edit" @click="copyCreative(c)">
              <img src="/icon/copyadd.svg"> Copy
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-switch
          style="float: right;margin-top: 4px;"
          :checked="c.status ? true: false"
          @change="(v)=>{
            if (v) {
              c.status=1
            } else {
              c.status=0
            }
            $emit('change', list)
            getTypes(plcs)
          }">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </div>
    </div>
    <a-form v-if="edit || creative.id!==null" style="background: #F5F5F5;" :form="form" :hideRequiredMark="true" >
      <a-form-model ref="creativeForm" :model="creative" :rules="rules" :hideRequiredMark="true">
        <a-row id="creativeSetContainer">
          <a-col :span="7" :style="{height: '658px', padding: '16px'}" class="leftSide">
            <div style="font-weight: normal;font-size: 28px;color: #333333;margin-bottom: 16px;">Ads Creator</div>
            <om-app-info
              style="border: 1px solid #D8D8D8;padding: 8px;border-radius: 4px;margin-bottom: 16px;background: #FFFFFF;"
              :app="appInfo"
            />
            <div class="creativeSetEditor">
              <div class="form">
                <om-form type="warp" label="CampaignID" :fill="false" style="margin-bottom: -12px;margin-top: -8px">
                  <a-input disabled v-model="campaignId" />
                </om-form>
                <om-form type="warp" label="Ad Type" style="margin-bottom: -8px;">
                  <a-select :disabled="creative.id!==null" class="form-control" v-model="creative.type" @change="creativeTypeChange">
                    <a-select-option v-for="(value,index) in types" :key="value" :value="index">{{ value }}</a-select-option>
                  </a-select>
                </om-form>
                <om-form type="warp" label="Name" hint="Enter your creative set name" field="name">
                  <a-input :max-length="40" :disabled="creative.id!==null" placeholder="Creative Name" v-model="creative.name"></a-input>
                </om-form>
                <om-form
                  type="warp"
                  v-if="[0, 2, 3].includes(creative.type)"
                  label="Title"
                  field="title">
                  <a-input :max-length="200" :disabled="creative.id!==null" v-model="creative.title" placeholder="Title" />
                </om-form>
                <om-form
                  type="warp"
                  v-if="[0, 1].includes(creative.type)"
                  label="Description"
                  field="descn">
                  <a-input :max-length="200" :disabled="creative.id!==null" v-model="creative.descn" placeholder="Description" />
                </om-form>
                <!--                <a-alert type="info" style="height: 114px;color: #666666" show-icon >-->
                <!--                  <div slot="message">Informational NotesInformational Notes-->
                <!--                    Informational Notes-->
                <!--                    Informational Notes-->
                <!--                    Informational Notes-->
                <!--                  </div>-->
                <!--                </a-alert>-->
              </div>
              <div class="modal-footer">
                <a-button
                  :disabled="creative.id!==null"
                  type="primary"
                  :loading="loading"
                  @click="onSubmit"
                  ghost
                  style="margin-right: 24px;">Save</a-button>
                <a-button
                  type="link"
                  @click="()=>{
                    edit=false
                    creative = { type: 2, name: '', title: '', id: null, status: 1 }
                  }">Cancel</a-button>
              </div>
            </div>
          </a-col>
          <a-col :span="10" class="middleSide" :style="{height: '658px', padding: '24px'}">
            <div class="boxesWrapper">
              <div :class="middleBoxClass(middleBoxes[0])" style="display: flex;" :disabled="creative.id!==null" @click="middleBoxClick(middleBoxes[0])">
                <div class="boxLabel">Video</div>
                <div class="delete" @click="middleBoxes[0].m = {}" v-if="edit && middleBoxes[0].m && middleBoxes[0].m.url"><img src="/icon/mdelete.svg"></div>
                <div v-if="!(middleBoxes[0].m && middleBoxes[0].m.url)" class="assetIcon movie-action">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                      <path d="M15.6707 15.4517C16.0847 15.7003 16.0847 16.3004 15.6707 16.549L9.47718 20.268C9.0506 20.5241 8.50772 20.2169 8.50772 19.7193V12.2814C8.50772 11.7839 9.0506 11.4766 9.47718 11.7327L15.6707 15.4517Z" fill="#E5E7EA"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.6 4.7998C0.716344 4.7998 0 5.51615 0 6.39981V25.5998C0 26.4835 0.716344 27.1998 1.6 27.1998H22.4C23.2837 27.1998 24 26.4835 24 25.5998V19.8681L30.7431 24.5606C31.2735 24.9297 32 24.5501 32 23.9039L32 8.0965C32 7.45029 31.2735 7.07074 30.7431 7.43985L24 12.1323V6.3998C24 5.51615 23.2837 4.7998 22.4 4.7998H1.6ZM2.4 7.1998V24.7998H21.6V7.1998H2.4ZM24 15.0562V16.9442L29.6 20.8412L29.6 11.1592L24 15.0562Z" fill="#E5E7EA"/>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="32" height="32" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div
                  v-if="!(middleBoxes[0].m && middleBoxes[0].m.url)"
                  style="color: #E5E7EA;text-align: left;font-size: 12px;vertical-align: middle;margin-left: 0;margin-top: 0;position: absolute;top: 55%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
                  File Format: mp4<br>
                  Max File Size: 5M<br>
                  Max Duration: 30s<br>
                </div>
                <div class="fusion-video-preview" v-if="middleBoxes[0].m && middleBoxes[0].m.url">
                  <video autoplay muted controls :src="middleBoxes[0].m && middleBoxes[0].m.url"></video>
                </div>
              </div>
              <!--img boxes-->
              <div
                :key="box.key"
                v-for="box in middleBoxes"
                v-if="box.type===0 && !box.disabled"
                :class="middleBoxClass(box)"
                @click="middleBoxClick(box)">
                <div class="boxLabel">{{ box.title }}</div>
                <div class="delete" @click="box.m = {}" v-if="edit && box.m && box.m.url"><img src="/icon/mdelete.svg"></div>
                <div
                  class="img"
                  v-if="box.m && box.m.url"
                  :style="'background-image: url('+box.m.url+')'"></div>
                <div class="assetIcon image" style="top:40%;" v-if="!(box.m && box.m.url)">
                  <svg width="32" height="26" viewBox="0 0 32 26" xmlns="http://www.w3.org/2000/svg">
                    <path :d="svg.image" fill="#222532" fill-rule="evenodd"></path>
                  </svg>
                </div>
                <div
                  v-if="!(box.m && box.m.url)"
                  style="color: #E5E7EA;text-align: left;font-size: 12px;vertical-align: middle;margin-left: 0;margin-top: 0;position: absolute;top: 60%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
                  File Format: png/jpg/gif<br>
                  Max File Size: 2M<br>
                  <span v-if="box.title && box.title.length > 4">Ratio: {{ box.title.substring(3, box.title.length) }}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a-button type="primary" ghost style="width: 100%;" @click="previewClick" :disabled="!canPreview">
                View full experience
              </a-button>
            </div>
          </a-col>

          <a-col :span="7" style="padding: 24px" class="rightSide" :style="{height: '658px'}">
            <div style="margin-top: 5px;margin-right: 8px;margin-bottom: 48px;"> </div>
            <div style="display: inline-block;position: absolute;right: 24px;top: 24px;">
              <a-upload :file-list="[]" :accept="['image/jpeg,image/png,image/gif', null, 'video/mp4'][middleBoxSelected.type]" :before-upload="doUpload" :multiple="true">
                <a-button type="primary" :disabled="creative.id!==null" class="btn btn-primary btn-sm btn-outline">Upload</a-button>
              </a-upload>
            </div>
            <!--            <div style="margin-bottom: 64px;">-->
            <!--              <AppSelectCam @change="appChange" style="margin-left: 8px;margin-top: -8px;float: right"/>-->
            <!--              <span style="color: #333333;float: right;">{{ middleBoxSelected.type === 0 ? 'Images':'Video' }}</span>-->
            <!--            </div>-->
            <div class="boxesWrapper" v-if="materials.length && !noAssets" >
              <div
                :key="m.url"
                v-for="m in materials"
                v-if="assetBoxMatch(m)"
                @click="creative.id? null :assetBoxClick(m)"
                :class="assetBoxClass(m)"
                :style="m.type===0?'background-image: url('+m.url+')':''">
                <div class="boxLabel" v-if="m.width">{{ m.width + ':' + m.height }}</div>
                <video v-if="m.type===2" :src="m.url" @playing="assetBoxOnplaying" muted ></video>
                <div class="checked-fullcolor">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
                    <g fill="none" fill-rule="evenodd">
                      <path class="background" fill="#3091F6" d="M0 0h17v17H0z"></path>
                      <path
                        class="inner"
                        fill="#FFF"
                        fill-rule="nonzero"
                        d="M13.042 4l-6.195 6.402L4.29 7.769 3 9.103l3.849 3.964 7.484-7.734z"></path>
                    </g>
                  </svg>
                </div>
                <span class="opacity"></span>
              </div>
            </div>
            <div class="uploaderWrapper" v-else>
              <a-upload-dragger
                :accept="['image/jpeg,image/png,image/gif', null, 'video/mp4'][middleBoxSelected.type]"
                name="file"
                :file-list="[]"
                :before-upload="doUpload"
                :multiple="true"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </a-upload-dragger>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-form>
    <CreativePreview
      :creative="prewCreative"
      @close="()=>{
        canPreview = true
        showPreview = false
      }"
      v-if="showPreview"/>
  </div>
</template>

<script>
import AppSelectCam from './AppSelectCam'
import OmAppInfo from './PromoteApp'
import OmForm from '@/components/OmFormModel'
import { createMaterial, materialList, templateList, materialUpload } from '@/api/campaign'
import CreativePreview from './CreativePreview'
import { mapState } from 'vuex'

export default {
  name: 'Creative',
  components: {
    AppSelectCam,
    OmAppInfo,
    OmForm,
    CreativePreview
  },
  props: {
    app: {
      type: Object,
      default: null
    },
    campaign: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    plcs: {
      type: Array,
      default: null
    }
  },
  created () {
    templateList().then(res => {
      this.template_options = res.data.map(item => {
        const { id, name: text, type, height: h, width: w, url } = item
        return { id, text, type, h, w, url }
      })
      this.init()
    })
  },
  data () {
    const typeMap = {
      2: { templateId: 1, title: 'Video' },
      0: { templateId: 3, title: 'Banner' },
      1: { templateId: 4, title: 'Native' },
      3: { templateId: 5, title: 'Cross Promote' }
    }
    const mboxes = [{ title: 'video', type: 2, m: {}, key: 0 }]
    for (let i = 1; i < 5; ++i) { mboxes.push({ title: 'img', key: i, type: 0, m: {} }) }
    return {
      typeMap,
      needAdd: JSON.parse(JSON.stringify(typeMap)),
      mboxes,
      prewCreative: {},
      height: (window.innerHeight - 64 - 32) + 'px',
      form: this.$form.createForm(this),
      loading: false,
      appInfo: this.app,
      canPreview: true,
      edit: this.visible,
      list: this.data,
      showPreview: false,
      campaignId: this.campaign || '',
      types: 'Banner,Native,Video,Cross Promote'.split(','),
      svg: {
        image: 'M30 26H2c-1.103 0-2-.897-2-2V2C0 .897.897 0 2 0h28c1.103 0 2 .897 2 2v22c0 1.103-.897 2-2 2zM2 15.773V2h28l-.002 17.584-6.291-6.291a1 1 0 0 0-1.332-.074l-4.301 3.441-7.367-7.367a1 1 0 0 0-1.371-.041L2 15.772zm0 2.676V24h27.997v-1.589l-7.071-7.071-4.301 3.441a.999.999 0 0 1-1.332-.074L9.96 11.374 2 18.449zM25.002 9A2.002 2.002 0 0 1 23 7.002C23 5.898 23.898 5 25.002 5a2 2 0 0 1 0 4z'
      },
      middleBoxSelected: mboxes[0],
      middleBoxes: mboxes,
      materials: [],
      fileList: [],
      noAssets: true,
      template_options: [],
      creative: { type: 2, name: '', title: '', id: null, status: 1 },
      rules: {
        name: [
          { required: true, message: 'Creative name can not be empty.', trigger: 'change' }
        ],
        title: [
          { required: true, message: 'Title can not be empty.', trigger: 'change' }
        ],
        descn: [
          { required: true, message: 'Description can not be empty.', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    app (v) {
      this.appInfo = v
    },
    data (v) {
      this.list = v
    },
    plcs (v) {
      this.getTypes(v)
    },
    placements (v) {
      this.getTypes(this.plcs)
    }
  },
  computed: mapState({
    placements: state => state.publisher.placements
  }),
  methods: {
    init () {
      materialList().then(res => {
        if (res.data) {
          this.materials = res.data
          this.noAssets = !this.materials.some(this.assetBoxMatch)
          this.creativeTypeChange(2)
        }
        this.getTypes(this.plcs)
      })
      this.middleBoxClick(this.middleBoxes[0])
    },
    getTypes (v) {
      const _this = this
      const types = []
      this.needAdd = {}
      if (v && v.length) {
        v.forEach(p => {
          if (p.placementId) {
            types.push(_this.placements.find(row => row.id === p.placementId).adType)
          }
        })
        types.forEach(t => {
          if (t === 0) {
            _this.needAdd[0] = _this.typeMap[0]
          } else if (t === 1) {
            _this.needAdd[1] = _this.typeMap[1]
          } else if (t === 2 || t === 4) {
            _this.needAdd[2] = _this.typeMap[2]
          } else if (t === 9) {
            _this.needAdd[3] = _this.typeMap[3]
          }
        })
        if (_this.list.length) {
          _this.list.forEach(row => {
            if (row.status === 1) {
              delete _this.needAdd[row.type]
            }
          })
        }
      }
    },
    show (creative) {
      this.edit = false
      this.creative = creative
      this.middleBoxes[0].m = creative.cpMaterials.find(row => row.type === 2)
      this.middleBoxes[1].m = creative.cpMaterials.find(row => row.type === 0)
    },
    copyCreative (c) {
      const { type, name, title, descn, cpMaterials } = c
      this.creative = { type, name, title, descn, id: null, status: 1, cpMaterials }
      const mm = [{ title: 'video', type: 2, m: cpMaterials.find(row => row.type === 2), key: 0 }]
      const target = cpMaterials.find(row => row.type === 0)
      for (let i = 1; i < 5; ++i) {
        if (i === 1 && target && target.id) {
          mm.push({ title: 'img', key: i, type: 0, m: target })
        } else {
          mm.push({ title: 'img', key: i, type: 0, m: {}, disabled: true })
        }
      }
      this.middleBoxes = mm
      this.noAssets = !this.materials.some(this.assetBoxMatch)
      this.edit = true
    },
    addAd () {
      if (!this.appInfo || !this.appInfo.appId) {
        this.$message.error('Please select promote app first.')
        return false
      } else {
        this.creative = { type: 2, name: '', title: '', id: null, status: 1 }
        const mm = [{ title: 'video', type: 2, m: {}, key: 0 }]
        for (let i = 1; i < 5; ++i) { mm.push({ title: 'img', key: i, type: 0, m: {} }) }
        this.middleBoxes = mm
        this.noAssets = !this.materials.some(this.assetBoxMatch)
        this.creativeTypeChange(2)
        this.edit = true
      }
    },
    appChange (id) {
      this.init(id)
    },
    gcd (a, b) {
      let c = 0
      while (true) {
        c = a % b
        if (c === 0) return b
        a = b
        b = c
      }
    },
    creativeTypeChange (v) {
      let templateId = 1
      if (v === 0) {
        templateId = 3
      } else if (v === 1) {
        templateId = 4
      } else if (v === 3) {
        templateId = 5
      }
      const o = this.template_options.find(t => t.id === templateId)
      const boxo = {
        title: 'img',
        ratio: o.h > 0 ? o.w / o.h : 0,
        disabled: !1,
        m: {}
      }
      const boxd = { disabled: !0, title: 'disabled', m: {} }
      const end = 2
      if (o.h > 0) {
        const maxCd = this.gcd(o.w, o.h)
        boxo.title = 'img ' + (o.w / maxCd) + ':' + (o.h / maxCd)
      }
      for (let i = 1; i < this.middleBoxes.length; i++) {
        Object.assign(this.middleBoxes[i], i < end ? boxo : boxd)
      }
      this.middleBoxSelected = this.middleBoxes[0]
    },
    middleBoxClick (box) {
      if (box.disabled) return
      this.middleBoxSelected = box
      this.noAssets = !this.materials.some(this.assetBoxMatch)
    },
    middleBoxClass (box) {
      const cs = ['box']
      cs.push(box.type === 2 ? 'big' : 'full')
      if (this.middleBoxSelected === box) cs.push('selected')
      if (!box.m) {
        box.m = {}
      }
      if (!box.m.url) cs.push('empty')
      return cs.join(' ')
    },
    assetBoxMatch (m) {
      if (this.middleBoxSelected.type !== (m.mtype >= 0 ? m.mtype : m.type)) return false
      if (!this.middleBoxSelected.ratio) return true
      const mratio = m.width / m.height
      const ratio = this.middleBoxSelected.ratio
      return (ratio - 0.1 <= mratio && ratio + 0.1 >= mratio)
    },
    assetBoxClick (m) {
      this.middleBoxSelected.m = m
    },
    assetBoxClass (m) {
      const c = 'asset-box'
      for (let i = 0; i < this.middleBoxes.length; i++) {
        const box = this.middleBoxes[i]
        if (box.m && box.m.url === m.url) { return c + ' selected' }
      }
      return c
    },
    doUpload (file) {
      const _this = this
      const id = this.appInfo.appId
      const blobUrl = URL.createObjectURL(file)
      const mtype = file.type.startsWith('image/') ? 0 : 2

      const fd = new FormData()
      fd.append('appId', id)
      fd.append('file', file)
      if (mtype === 0) {
        const tempImg = new Image()
        tempImg.onload = () => {
          const ratio = this.middleBoxSelected.ratio
          const mratio = tempImg.naturalWidth / tempImg.naturalHeight
          if (ratio !== 0 && !(ratio - 0.1 <= mratio && ratio + 0.1 >= mratio)) {
            _this.$message.error('Image ratio does not match', 5)
            return false
          }
          materialUpload(fd).then(res => {
            const exists = []
            _this.materials.forEach(m => {
              exists.push(m.md5sum)
            })
            if (exists.includes(res.data.md5sum)) {
              _this.$message.error('Image already exists', 5)
              return false
            }
            if (file.size > 2097152) {
              _this.$message.error('Max file size 2M.', 5)
              return false
            }
            const { md5sum, path } = res.data
            const m = {
              name: file.name,
              md5sum,
              url: path,
              type: mtype,
              mimeType: file.type,
              width: tempImg.naturalWidth,
              height: tempImg.naturalHeight,
              size: file.size,
              appId: id
            }
            createMaterial(m).then(rv => {
              _this.materials.unshift(rv.data)
              _this.noAssets = !_this.materials.some(_this.assetBoxMatch)
            })
          })
        }
        tempImg.src = blobUrl
      } else {
        const tempVideo = document.createElement('video')
        tempVideo.onloadedmetadata = function () {
          // const ratio = this.middleBoxSelected.ratio
          // const mratio = tempVideo.videoWidth / tempVideo.videoHeight
          // if (ratio !== 0 && !(ratio - 0.1 <= mratio && ratio + 0.1 >= mratio)) {
          //   _this.$message.error('Video ratio does not match ' + ratio, 5)
          //   return false
          // }
          if (file.size > 5242880) {
            _this.$message.error('Max file size 5M.', 5)
            return false
          }
          const videoDuration = parseInt(tempVideo.duration)
          if (videoDuration > 30) {
            _this.$message.error('Max Duration: 30s, ' + videoDuration, 5)
            return false
          }
          materialUpload(fd).then(res => {
            const exists = []
            _this.materials.forEach(m => {
              exists.push(m.md5sum)
            })
            if (exists.includes(res.data.md5sum)) {
              return false
            }
            const { md5sum, path } = res.data
            const m = {
              name: file.name,
              md5sum,
              url: path,
              type: mtype,
              mimeType: file.type,
              width: tempVideo.videoWidth,
              height: tempVideo.videoHeight,
              size: file.size,
              appId: id,
              videoDuration
            }
            createMaterial(m).then(rv => {
              _this.materials.unshift(rv.data)
              _this.noAssets = !_this.materials.some(_this.assetBoxMatch)
            })
          })
        }
        tempVideo.src = blobUrl
      }
    },
    assetBoxOnplaying (e) {
      const video = e.currentTarget
      setTimeout(() => video.pause(), 1000)
    },
    onSubmit () {
      this.loading = true
      let tag = true
      this.$refs.creativeForm.validate((t) => {
        if (!t) {
          tag = false
        }
      })
      if (!tag) {
        this.loading = false
        return
      }
      const materials = []
      const v = this.middleBoxes[0].m
      const m = this.middleBoxes[1].m
      let templateId = 1
      if (this.creative.type === 0) {
        templateId = 3
      } else if (this.creative.type === 1) {
        templateId = 4
      } else if (this.creative.type === 3) {
        templateId = 5
      }
      this.creative.template = templateId
      this.creative.videoTemplate = 2
      if ([0, 1].includes(this.creative.type)) {
        if (!m || !m.url) {
          this.$message.error('Choose Material Required!')
          this.loading = false
          return
        }
      } else {
        if (!v || !v.url || !m || !m.url) {
          this.$message.error('Choose Material Required!')
          this.loading = false
          return
        }
        materials.push(v)
      }
      materials.push(m)
      this.creative.cpMaterials = materials
      this.creative.status = 1
      this.$emit('add', this.creative)
      this.creative.id = -this.list.length
      this.edit = false
      this.getTypes(this.plcs)
      this.loading = false
    },
    previewClick () {
      let tag = true
      this.$refs.creativeForm.validate((t) => {
        if (!t) {
          tag = false
        }
      })
      if (!tag) {
        return
      }
      const ct = this.creative.type
      let templateId = 1
      if (ct === 0) {
        templateId = 3
      } else if (ct === 1) {
        templateId = 4
      } else if (ct === 3) {
        templateId = 5
      }
      const o = this.template_options.find(t => t.id === templateId)
      const mainId = o.id
      const endCardId = 2
      this.canPreview = false
      const prewInfo = {
        creativeType: this.creative.type,
        campaign_id: this.campaignId,
        cid: this.creative.id,
        ad_url: '',
        vq: 'test=preview',
        imptrackers: [],
        icon_url: this.appInfo.icon,
        description: this.creative.descn || 'Test Description',
        title: this.creative.title || '',
        app_name: this.appInfo.appName,
        app_id: this.appInfo.appId,
        imgs: [],
        resources: [],
        rating: this.appInfo.ratingValue,
        rating_count: this.appInfo.ratingCount
      }
      this.middleBoxes.forEach(m => {
        if (m.m && m.m.url) {
          const url = m.m.url
          if (m.type === 2) { // video
            prewInfo.video_url = url
          } else { // img
            if (!prewInfo.mainimg_url) {
              prewInfo.mainimg_url = url
            } else {
              prewInfo.imgs.push(url)
            }
          }
        }
      })
      let mainTemplate
      let endCardTemplate
      this.template_options.forEach(t => {
        if (t.id === mainId) { mainTemplate = t } else if (t.id === endCardId) { endCardTemplate = t }
      })
      if (mainTemplate) prewInfo.resources.push('//img.adtiming.com' + mainTemplate.url)
      if (this.creative.type === 2 && endCardTemplate) {
        prewInfo.resources.push('//img.adtiming.com' + endCardTemplate.url)
      }
      if (this.creative.type === 0) { // Banner
        Object.assign(prewInfo, { w: mainTemplate.w * 2, h: mainTemplate.h * 2 })
      } else if (this.creative.type === 1) { // Native
        Object.assign(prewInfo, { w: 320, h: 229 })
      }
      this.prewCreative = prewInfo
      this.showPreview = true
    }
  }
}
</script>

<style type="less" scoped>
  .main-content >>> .ant-form-item-label {
    line-height: 1.5;
  }
  .main-content >>> .ant-form-item {
    margin-bottom: 0;
  }
  .boxesWrapper {
    display: flex;
    flex-wrap: wrap;
    margin: -4px -4px 0 0;
  }

  .rightSide {
    background-color: #FBFBFB;
    padding: 24px;
  }
  .leftSide {
    padding:24px;
    background-color: #FBFBFB;
    overflow: hidden;
  }

  .rightSide .boxesWrapper {
    max-height: 564px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .form {
    max-height: 460px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .box {
    border: 1px solid #c2cdd7;
    margin: 4px 4px 0 0;
    position: relative;
    margin-top: 8px;
    cursor: pointer;
    text-align: center;
    background-color: #fff;
  }

  .box.big {
    width: 100%;
    height: 336px;
  }
  .box.full {
    width: 100%;
    height: 216px;
  }
  @media screen and (max-width: 1366px) {
    .box.small {
      width: 49%;
      height: 144px;
    }
  }
  @media screen and (min-width: 1440px) {
    .box.small {
      width: 49.1%;
      height: 152px;
    }
  }
  @media screen and (min-width: 1680px) {
    .box.small {
      width: 49.2%;
      height: 152px;
    }
  }

  .box .boxLabel {
    font-family: HelveticaNeue, helvetica, sans-serif;
    font-weight: normal;
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    line-height: 20px;
    background-color: #D8DCE1;
    color: #757F8A;
    text-transform: uppercase;
    padding: 0 7px;
  }

  .box.empty .assetIcon svg * {
    fill: #e1e6eb
  }

  .box.selected .assetIcon svg * {
    fill: #c3dffc
  }

  .box:not(.selected):hover.empty {
    border: 1px solid #c3dffc
  }

  .box:not(.selected):hover.empty .assetIcon svg * {
    fill: #c3dffc
  }

  .box.selected {
    border: 1px solid #3091f6
  }

  .box.selected .boxLabel {
    background-color: #3091f6;
    color: #fff;
    z-index: 1;
  }

  .box.optional:hover .boxLabel, .box:not(.selected):hover .boxLabel {
    background-color: #c3dffc;
    color: #3091f6
  }

  .box .img {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat
  }

  .box .assetIcon {
    margin-left: 0;
    margin-top: 0;
    position: absolute;
    top: 40%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .box .assetIcon.movie-action {
    width: 50px;
    height: 50px;
  }

  .box .assetIcon.image {
    width: 29px;
    height: 23px;
  }

  .box .assetIcon.image svg {
    width: 29px;
    height: 23px;
  }

  .fusion-video-preview {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f5f7;
  }

  .fusion-video-preview video {
    width: 99%;
    height: 240px;
  }

  .requirements {
    text-align: left;
    background-color: #2f405a;
  }

  .requirements label {
    margin-right: 3px;
  }

  .requirements span {
    width: 100%;
  }

  @media screen and (min-width: 1366px) {
    .boxesWrapper .asset-box {
      margin: 4px 4px 0 0;
      flex: 0 1 138px;
      height: 100px;
      background-color: #F7F7F7;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      border: 1px solid #e1e6eb;
      line-height: 24px;
    }
    .boxesWrapper .asset-box video {
      width: 138px;
      height: 100px;
    }
  }
  @media screen and (min-width: 1440px) {
    .boxesWrapper .asset-box {
      margin: 8px 8px 0 0;
      flex: 0 1 146px;
      height: 100px;
      background-color: #F7F7F7;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      border: 1px solid #e1e6eb;
      line-height: 24px;
    }
    .boxesWrapper .asset-box video {
      width: 146px;
      height: 100px;
    }
  }
  @media screen and (min-width: 1680px) {
    .boxesWrapper .asset-box {
      margin: 8px 8px 0 0;
      flex: 0 1 180px;
      height: 120px;
      background-color: #F7F7F7;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      border: 1px solid #e1e6eb;
      line-height: 24px;
    }
    .boxesWrapper .asset-box video {
      width: 180px;
      height: 120px;
    }
  }
  @media screen and (min-width: 1900px) {
    .boxesWrapper .asset-box {
      margin: 8px 8px 0 0;
      flex: 0 1 177px;
      height: 120px;
      background-color: #F7F7F7;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      border: 1px solid #e1e6eb;
      line-height: 24px;
    }
    .boxesWrapper .asset-box video {
      width: 177px;
      height: 120px;
    }
  }

  .boxesWrapper .asset-box:hover {
    background-color: #e1e6eb;
  }

  .boxesWrapper .asset-box.selected {
    pointer-events: none;
    cursor: default;
  }

  .boxesWrapper .asset-box .checked-fullcolor {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: none;
  }

  .boxesWrapper .asset-box.selected .checked-fullcolor {
    display: block;
  }

  .boxesWrapper .asset-box .boxLabel {
    font-family: HelveticaNeue, helvetica, sans-serif;
    font-weight: normal;
    font-size: 10px;
    position: absolute;
    top: 0;
    right: 0;
    text-align: right;
    height: 20px;
    line-height: 20px;
    background-color: #EEEEEE;
    color: #52677b;
    text-transform: uppercase;
    padding: 0 7px;
  }

  .uploaderWrapper {
    height: 440px;
    width: 100%;
  }

  .uploaderWrapper .noAssetsTitle {
    margin-left: 0;
    margin-top: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #678099;
    text-align: center;
    width: 242px;
  }

  #creativeSetContainer a {
    text-decoration: none;
    color: #3091f6;
    cursor: pointer;
  }

  /*select2 app*/
  .select2-results .appselect2 {
    display: inline;
  }

  .appselect2 img {
    width: 1.5em;
  }

  .appselect2 .appname {
    margin-left: 0.5em;
    width: 10em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-flex
  }

  .appselect2 .plat {
    float: right;
    font-size: 1em;
  }

  .select2-selection__rendered .appselect2 .plat {
    margin-top: 7px;
  }

  .select2-selection__rendered .appselect2 img {
    margin-bottom: 5px;
  }
  .main-content >>> .info-title {
    line-height: 1;
    color:#333333;font-size: 14px;
    display: inline-block;vertical-align: middle;margin-left: 7px;
  }
  .modal-footer {
    margin-top: 16px;
  }
  .creative-container {
    background: rgb(251, 251, 251);height: 256px;width: 100%;overflow: scroll hidden;display: inline-block;white-space: nowrap;padding: 16px;
  }
  .creative-cad {
    display: inline-block;box-sizing: border-box;width: 320px;
    height: 224px;background-color: white;
    box-shadow: 0 2px 18px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(0, 0, 0, 0.04);
    border-radius: 4px;margin-right: 16px;
    white-space: normal;
  }
  .first {
    position: absolute;
    margin-right: 350px;
    z-index: 1;
    box-shadow: 0px 1px 18px rgba(0, 0, 0, 0.08), 0px 16px 40px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
  }
  .delete {
    position: absolute;
    z-index: 1;
    right: 4px;
    bottom: 4px;
  }
  .add-card {
    color: #1A7DF1;display: inline-block;font-weight: bold;font-size: 36px;text-align: center;padding-top: 110px;transform: translateY(-32%);width: 100%;
  }
</style>
