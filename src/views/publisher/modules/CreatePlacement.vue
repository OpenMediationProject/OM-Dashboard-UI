<!-- Placement edit router '/publisher/placement/add' -->
<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="plcedit" style="box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);border-radius: 2px;">
      <a v-action:edit v-if="canEdit" :disabled="loading" @click="createPlacement" style="position: absolute;right: 44px;top: -44px;"><img width="24px" src="/icon/save.svg" /></a>
      <a-form :form="form" :hideRequiredMark="true">
        <a-card :bordered="false" >
          <a-tabs :activeKey="activeKey" class="createplacement" style="margin-left:14px;" @change="tabClickHandler">
            <a-tab-pane tab="Basic" key="1" forceRender :style="{height: height, overflowY: 'scroll'}">
              <div style="margin: 16px auto 0;">
                <om-form :form="form" label="Name" field="name" style="margin-bottom:24px;">
                  <a-input :style="$msg('placement.name_tip')?null:'width: 408px;'" placeholder="Placement name" :max-length="30" v-decorator="['mdl.name', { initialValue: '', rules: [{ required: true, message: this.$msg('placement.name_empty') }] }]"/>
                  <adt-tip :tip="$msg('placement.name_tip')" />
                </om-form>
                <om-form :form="form" label="Type" :showTip="false">
                  <a-form-item v-if="editType==='Edit' || editType === 'Details'">
                    <div v-if="mdl.adType===2" :class="mdl.adType===2? 'item-main-selected': 'item-main'">
                      <img class="item-icon" src="/icon/placement/video-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Rewarded Video</span></div>
                        <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                      </div>
                    </div>
                    <div v-if="mdl.adType===3" :class="mdl.adType===3? 'item-main-selected': 'item-main'" style="margin: 0 0px 16px 0;">
                      <img class="item-icon" src="/icon/placement/int-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Interstitial</span></div>
                        <div class="item-desc">A full-screen ad appearing at natural breaks during the app lifecycle. Users can choose to skip these ads.</div>
                      </div>
                    </div>
                    <div v-if="mdl.adType===0" @click="handleTypeChance(0)" :class="mdl.adType===0? 'item-main-selected': 'item-main'">
                      <img class="item-icon" src="/icon/placement/banner-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Banner</span></div>
                        <div class="item-desc">Rectangular ads that occupy a portion of an app's layout; can be refreshed automatically after a period of time.</div>
                      </div>
                    </div>
                    <div v-if="mdl.adType===1" @click="handleTypeChance(1)" :class="mdl.adType===1? 'item-main-selected': 'item-main'">
                      <img class="item-icon" src="/icon/placement/native-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Native</span></div>
                        <div class="item-desc">Native ad is favored for its integration into content, allowing for an uninterrupted UX.</div>
                      </div>
                    </div>
                    <div v-if="mdl.adType===4" :class="mdl.adType===4? 'item-main-selected': 'item-main'" style="margin: 0 0px 16px 0;">
                      <img class="item-icon" src="/icon/placement/splash.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Splash</span></div>
                        <div class="item-desc">Branded full screen ad that appears for a few seconds after the branded application splash screen.</div>
                      </div>
                    </div>
                  </a-form-item>
                  <a-form-item v-else>
                    <div @mouseenter="enter(2, $event)" @mouseleave="leave(2, $event)" @click="handleTypeChance(2)" :class="mdl.adType===2? 'item-main-selected': 'item-main'" :style="hasRv?'cursor: not-allowed;':''">
                      <img class="item-icon" :src="hasRv?'/icon/placement/video-gray.svg':'/icon/placement/video-blue.svg'" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Rewarded Video</span></div>
                        <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                      </div>
                    </div>
                    <div @mouseenter="enter(3, $event)" @mouseleave="leave(3, $event)" @click="handleTypeChance(3)" :class="mdl.adType===3? 'item-main-selected': 'item-main'" :style="hasInterstitial? 'cursor: not-allowed;': null">
                      <img class="item-icon" :src="hasInterstitial?'/icon/placement/int-gray.svg':'/icon/placement/int-blue.svg'" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Interstitial</span></div>
                        <div class="item-desc">A full-screen ad appearing at natural breaks during the app lifecycle. Users can choose to skip these ads.</div>
                      </div>
                    </div>
                    <div @mouseenter="enter(0, $event)" @mouseleave="leave(0, $event)" @click="handleTypeChance(0)" :class="mdl.adType===0? 'item-main-selected': 'item-main'">
                      <img class="item-icon" src="/icon/placement/banner-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Banner</span></div>
                        <div class="item-desc">Rectangular ads that occupy a portion of an app's layout; can be refreshed automatically after a period of time.</div>
                      </div>
                    </div>
                    <div @mouseenter="enter(1, $event)" @mouseleave="leave(1, $event)" @click="handleTypeChance(1)" :class="mdl.adType===1? 'item-main-selected': 'item-main'">
                      <img class="item-icon" src="/icon/placement/native-blue.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Native</span></div>
                        <div class="item-desc">Native ad is favored for its integration into content, allowing for an uninterrupted UX.</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(4, $event)"
                      @mouseleave="leave(4, $event)"
                      @click="handleTypeChance(4)"
                      :class="mdl.adType===4? 'item-main-selected': 'item-main'"
                      :style="placementId? 'cursor: not-allowed;':'' ">
                      <img class="item-icon" src="/icon/placement/splash.svg" style="width: 30px;height: 55.5px;">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">Splash</span></div>
                        <div class="item-desc">Branded full screen ad that appears for a few seconds after the branded application splash screen.</div>
                      </div>
                    </div>
                  </a-form-item>
                </om-form>
              </div>
              <div style="height:16px; width:100%"></div>
            </a-tab-pane>
            <a-tab-pane tab="Scenes" key="2" forceRender :style="{height: height}">
              <a-card v-if="[2, 3].includes(mdl.adType)" :bordered="false" style="margin: 16px 16px 0;margin-left: 8px;margin-right: 24px;">
                <ScenesEdit ref="scenesEdit" :list="this.data" />
              </a-card>
              <a-card v-else :bordered="false" style="margin: 16px 16px 0;">
                <a-alert
                  style="margin-right:16px;"
                  message="Notice"
                  description="Scene can only be added/edited in Rewarded Video or Interstitial placement."
                  type="info"
                  showIcon
                />
              </a-card>
              <div style="height:16px; width:100%"></div>
            </a-tab-pane>
            <a-tab-pane tab="Advanced Settings" key="3" forceRender :style="{height: height}">
              <a-card :bordered="false" style="margin: 16px auto 0;">
                <a-form-item
                  label="Callback URL"
                  :colon="false"
                  v-if="mdl.adType===2"
                  :labelCol="{lg: { span: 9 }, sm: { span: 9 }}"
                  :wrapperCol="{lg: { span: 9 }, sm: { span: 9 } }">
                  <a-input v-decorator="['mdl.icUrl',{initialValue: mdl.icUrl}]" style="width:400px;"></a-input>
                  <adt-tip :tip="$msg('placement.callback_url_tip')" />
                </a-form-item>
                <a-form-item
                  v-if="[0, 1].includes(mdl.adType)"
                  label="Frequency Cap"
                  :colon="false"
                  style="margin-bottom: 8px;"
                  :labelCol="{lg: { span: 9 }, sm: { span: 9 }}"
                  :wrapperCol="{lg: { span: 9 }, sm: { span: 9 } }">
                  Limit to <a-input-number
                    type="number"
                    size="small"
                    :min="0"
                    :max="9999"
                    style="width:66px;"
                    v-decorator="['mdl.frequencyCap',{initialValue: mdl.frequencyCap}]"/> impressions per
                  <a-input-number
                    type="number"
                    size="small"
                    :min="1"
                    :max="24"
                    style="width:50px;"
                    v-decorator="['mdl.frequencyUnit',{initialValue: mdl.frequencyUnit}]"/> hour(s)
                  <adt-tip :tip="$msg('placement.frequency_tip')" />
                </a-form-item>
                <a-form-item
                  style="margin-bottom: 8px;"
                  label="Pacing"
                  :colon="false"
                  :labelCol="{lg: { span: 9 }, sm: { span: 9 }}"
                  :wrapperCol="{lg: { span: 9 }, sm: { span: 9 } }">
                  Show a maximun ad 1ad per <a-input-number
                    type="number"
                    size="small"
                    :min="0"
                    :max="1440"
                    style="width:66px;"
                    v-decorator="['mdl.frequencyInterval',{initialValue: mdl.frequencyInterval}]"/> minute(s)
                  <adt-tip :tip="$msg('placement.pacing_tip')" />
                </a-form-item>
                <a-form-item
                  style="margin-bottom: 16px;"
                  label="Device Brand"
                  :colon="false"
                  :labelCol="{lg: { span: 9 }, sm: { span: 9 }}"
                  :wrapperCol="{lg: { span: 9 }, sm: { span: 9 } }">
                  <a-input-group compact style="margin-top:6px;">
                    <a-select v-decorator="['mdl.brandType',{initialValue: mdl.brandType || 'include'}]" style="width: 100px" >
                      <a-select-option value="include">include</a-select-option>
                      <a-select-option value="exclude">exclude</a-select-option>
                    </a-select>
                    <a-select
                      style="width: 300px"
                      :value="value"
                      @search="selectBrand"
                      @change="handleChange"
                      :filterOption="false"
                      :notFoundContent="fetching ? undefined : null"
                      v-decorator="['mdl.brandList',{initialValue: mdl.brandList}]"
                      mode="multiple">
                      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                      <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                    <adt-tip style="margin-top: 4px;" :tip="$msg('placement.brand_tip')" />
                  </a-input-group>
                </a-form-item>
                <a-form-item
                  style="margin-bottom: 8px;"
                  label="Device Model"
                  :colon="false"
                  :labelCol="{lg: { span: 9 }, sm: { span: 9 }}"
                  :wrapperCol="{lg: { span: 9 }, sm: { span: 9 } }">
                  <a-input-group compact style="margin-top:6px;">
                    <a-select v-decorator="['mdl.modelType',{initialValue: mdl.modelType || 'include'}]" style="width: 100px" >
                      <a-select-option value="include">include</a-select-option>
                      <a-select-option value="exclude">exclude</a-select-option>
                    </a-select>
                    <a-select
                      style="width: 300px"
                      :value="value"
                      @search="selectModel"
                      @change="handleChange"
                      :filterOption="false"
                      :notFoundContent="fetching ? undefined : null"
                      v-decorator="['mdl.modelList',{initialValue: mdl.modelList}]"
                      mode="multiple">
                      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                      <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                    <adt-tip style="margin-top: 4px;" :tip="$msg('placement.model_tip')" />
                  </a-input-group>
                </a-form-item>
              </a-card>
              <div style="height:16px; width:100%"></div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-form>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>
import {
  modelSearch,
  brandSearch,
  placementGet,
  placementUpdateWithScenes,
  placementList
} from '@/api/publisher'
import OmForm from '@/components/OmForm'
import AdtTip from '@/components/AdtTip'
import ScenesEdit from './ScenesEdit'
import { mapState } from 'vuex'

export default {
  name: 'CreatePlacement',
  components: {
    OmForm,
    ScenesEdit,
    AdtTip
  },
  data () {
    const canEdit = this.$route.query.type !== 'Details'
    return {
      canEdit,
      loading: false,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      hasRv: false,
      hasInterstitial: false,
      name: '',
      height: '500px',
      spinning: true,
      count: -100,
      activeKey: this.$route.query.key || '1',
      mdl: { pubAppId: this.$store.state.publisher.searchApp, name: '', icUrl: '', frequencyCap: 0, frequencyUnit: 1, frequencyInterval: 0, adType: this.$route.params.type === 'Edit' ? null : 0, modelType: 'include', brandType: 'include' },
      placementId: this.$route.query.placementId,
      data: [],
      deviceData: [],
      editType: this.$route.query.type,
      lastFetchId: 0,
      value: [],
      fetching: false
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  mounted () {
    this.height = (window.innerHeight - 206) + 'px'
    const params = { pubAppId: this.searchApp }
    placementList(params)
      .then(res => {
        res.data.forEach(item => {
          if (item.adType === 3) {
            this.hasInterstitial = true
          } else if (item.adType === 2) {
            this.hasRv = true
          }
        })
        if (this.placementId > 0) {
          placementGet({ placementId: this.$route.query.placementId })
            .then(res => {
              if (res.data) {
                this.mdl = Object.assign(this.mdl, res.data)
                this.form.setFieldsValue({ mdl: this.mdl })
                if (res.data.scenes) {
                  this.arraySort(res.data.scenes)
                  res.data.scenes.forEach(item => {
                    item.expandStatus = false
                    item.editStatus = false
                  })
                  this.data = res.data.scenes
                }
                this.spinning = false
              }
            }).finally(() => {
              this.spinning = false
            })
        } else {
          if (!this.hasRv) {
            this.mdl.adType = 2
          } else if (!this.hasInterstitial) {
            this.mdl.adType = 3
          }
          this.form.setFieldsValue({ mdl: this.mdl })
          this.spinning = false
        }
      })
  },
  methods: {
    enter (value, e) {
      if (value === 2 && this.hasRv) {
        return false
      }
      if (value === 3 && this.hasInterstitial) {
        return false
      }
      e.target.className = 'item-main-selected'
    },
    leave (value, e) {
      if (value === 2 && this.hasRv) {
        return false
      }
      if (value === 3 && this.hasInterstitial) {
        return false
      }
      if (this.mdl.adType !== value) {
        e.target.className = 'item-main'
      }
    },
    handleTypeChance (type) {
      if (type === 2 && this.hasRv) {
        return false
      }
      if (type === 3 && this.hasInterstitial) {
        return false
      }
      if (!this.placementId) {
        this.mdl.adType = type
      }
    },
    close () {
      this.$router.push('/publisher/placement/list')
    },
    createPlacement () {
      this.loading = true
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          that.mdl = Object.assign(that.mdl, that.form.getFieldsValue().mdl)
          if (that.mdl.brandList) {
            const brandWhitelist = that.mdl.brandType === 'include' ? that.mdl.brandList.join('\n') : null
            const brandBlacklist = that.mdl.brandType === 'exclude' ? that.mdl.brandList.join('\n') : null
            that.mdl = Object.assign(that.mdl, { 'brandWhitelist': brandWhitelist, 'brandBlacklist': brandBlacklist })
          }
          if (that.mdl.modelList) {
            const modelWhitelist = that.mdl.modelType === 'include' ? that.mdl.modelList.join('\n') : null
            const modelBlacklist = that.mdl.modelType === 'exclude' ? that.mdl.modelList.join('\n') : null
            that.mdl = Object.assign(that.mdl, { 'modelWhitelist': modelWhitelist, 'modelBlacklist': modelBlacklist })
          }
          if (this.$refs.scenesEdit) {
            that.mdl.scenes = this.$refs.scenesEdit.data || []
          } else {
            that.mdl.scenes = []
          }
          if (this.placementId) {
            placementUpdateWithScenes(that.mdl).then(res => {
              if (res.code === 0) {
                this.$router.push('/publisher/placement/list')
                this.$message.success(this.$msg('placement.update_success'))
              }
            }).finally(() => {
              this.loading = false
            })
          } else {
            that.mdl.id = -100
            placementUpdateWithScenes(that.mdl).then(res => {
              if (res.code === 0) {
                if (this.$route.query.isnew) {
                  this.$router.push(
                    {
                      path: '/publisher/placement/list',
                      query: { newplc: res.data.id, isnew: this.$route.query.isnew }
                    })
                } else {
                  this.$router.push(
                    {
                      path: '/publisher/placement/list',
                      query: { newplc: res.data.id }
                    })
                }
              }
            }).finally(() => {
              this.loading = false
            })
          }
        } else {
          this.activeKey = '1'
          this.loading = false
        }
      })
    },
    handleChange (value) {
      Object.assign(this, {
        value,
        deviceData: [],
        fetching: false
      })
    },
    selectBrand (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      brandSearch({ brand: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        const data = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))

        this.deviceData = data
        this.fetching = false
      })
    },
    selectModel (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      modelSearch({ model: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        const data = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))

        this.deviceData = data
        this.fetching = false
      })
    },
    tabClickHandler (val) {
      this.activeKey = val
    },
    arraySort (list) {
      if (list && list.length) {
        list = list.sort((a, b) => {
          if (a.status === b.status) {
            return b.createTime - a.createTime
          } else {
            return b.status - a.status
          }
        })
      }
    }
  }
}
</script>

<style type="less" scpoed>
  .item-main {
    margin: 0 0px 8px 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    cursor: pointer;
    display: flex;
    padding: 16px;
    align-items: center;
    border-radius: 4px;
    justify-content: flex-start;
    height: 88px;
    width: 408px;
  }
  .item-main-selected {
    margin: 0 0px 8px 0;
    border: 1px solid rgb(26, 125, 240);
    cursor: pointer;
    display: flex;
    padding: 16px;
    align-items: center;
    border-radius: 4px;
    justify-content: flex-start;
    height: 88px;
    width: 408px;
  }
  .item-title {
    display: inline-block; vertical-align: middle;
    margin: 0;
    position: static;
    height: 16px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
    flex: none;
    order: 0;
    align-self: center;
    margin: 8px 0px;
  }
  .item-desc {
    position: static;
    width: 100%;
    height: 28px;
    left: 50px;
    top: 48px;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #999999;
    flex: none;
    order: 1;
    align-self: center;
  }
  .item-icon {
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 24px;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    user-select: none;
    flex-shrink: 0;
  }
  .item-content {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    margin-top: -14px;
  }
  .expand-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    text-align: center;
    background: #fff;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-top: 2px;
  }
  .ant-table-row-expand-icon {
    display: none;
  }
  .ant-table-expand-icon-th, .ant-table-row-expand-icon-cell {
    width: 1px;
    min-width: 1px;
  }
  form .has-feedback .ant-input {
    padding-right: 5px;
  }
  .ant-tabs-nav-wrap {
    margin-left: -6px;
  }
  .ad-type-current {
    margin: 0 0px 16px 0;
    border: 1px solid rgb(26, 125, 240);
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
  .plcedit >>> .ant-card-head-title {
    margin-left: -8px;
    margin-top: -6px;
  }
  .plcedit >>> .ant-card-head {
    height: 48px;
  }
  .plcedit >>> .ant-form-item {
    margin-bottom: 0;
  }
  .plcedit >>> .ant-form-explain, .ant-form-extra {
    line-height: 1.5;
    margin-bottom: -20px;
  }
</style>
