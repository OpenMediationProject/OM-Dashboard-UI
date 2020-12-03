<!-- Placement edit router '/publisher/placement/add' -->
<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="plcedit">
      <OmPageAction :has-change="hasChange" @save="createPlacement" :canEdit="canEdit" />
      <a-form-model ref="placementForm" :model="placementInfo" :rules="rules" :hideRequiredMark="true">
        <a-card :bordered="false">
          <a-tabs :activeKey="activeKey" class="createplacement" style="margin-left:14px;" @change="tabClickHandler">
            <a-tab-pane tab="Basic" key="1" forceRender :style="{height: height, overflowY: 'scroll'}">
              <div style="margin: 16px auto 0;">
                <om-form-model field="name" label="Name" :tip="$msg('placement.name_tip')" style="margin-bottom:24px;">
                  <a-input
                    v-model="placementInfo.name"
                    style="width: 418px"
                    placeholder="Placement name"
                    :max-length="30"/>
                </om-form-model>
                <om-form-model field="type" label="Type">
                  <!-- edit is not allowed to modify adType -->
                  <div v-if="editType==='Edit' || editType === 'Details'">
                    <div class="item-main-selected">
                      <img class="item-icon" :src="GLOBAL.typeInfo(placementInfo.adType).icon">
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">{{ GLOBAL.typeInfo(placementInfo.adType).title }}</span>
                        </div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(placementInfo.adType).descn }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- create placement -->
                  <div v-else>
                    <div
                      @mouseenter="enter(2, $event)"
                      @mouseleave="leave(2, $event)"
                      @click="handleTypeChance(2)"
                      :class="placementInfo.adType===2? 'item-main-selected': 'item-main'"
                      :style="hasRv?'cursor: not-allowed;':''">
                      <img class="item-icon" :style="hasRv? 'opacity: 0.3;':null" :src="GLOBAL.typeInfo(2).icon">
                      <div class="item-content">
                        <div class="item-title"><span
                          style="margin-right: 10px;">{{ GLOBAL.typeInfo(2).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(2).descn }}</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(3, $event)"
                      @mouseleave="leave(3, $event)"
                      @click="handleTypeChance(3)"
                      :class="placementInfo.adType===3? 'item-main-selected': 'item-main'"
                      :style="hasInterstitial? 'cursor: not-allowed;': null">
                      <img
                        class="item-icon"
                        :style="hasInterstitial? 'opacity: 0.3;':null"
                        :src="GLOBAL.typeInfo(3).icon">
                      <div class="item-content">
                        <div class="item-title"><span
                          style="margin-right: 10px;">{{ GLOBAL.typeInfo(3).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(3).descn }}</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(0, $event)"
                      @mouseleave="leave(0, $event)"
                      @click="handleTypeChance(0)"
                      :class="placementInfo.adType===0? 'item-main-selected': 'item-main'">
                      <img class="item-icon" :src="GLOBAL.typeInfo(0).icon">
                      <div class="item-content">
                        <div class="item-title"><span
                          style="margin-right: 10px;">{{ GLOBAL.typeInfo(0).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(0).descn }}</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(1, $event)"
                      @mouseleave="leave(1, $event)"
                      @click="handleTypeChance(1)"
                      :class="placementInfo.adType===1? 'item-main-selected': 'item-main'">
                      <img class="item-icon" :src="GLOBAL.typeInfo(1).icon">
                      <div class="item-content">
                        <div class="item-title"><span
                          style="margin-right: 10px;">{{ GLOBAL.typeInfo(1).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(1).descn }}</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(4, $event)"
                      @mouseleave="leave(4, $event)"
                      @click="handleTypeChance(4)"
                      :class="placementInfo.adType===4? 'item-main-selected': 'item-main'"
                      :style="placementId? 'cursor: not-allowed;':'' ">
                      <img class="item-icon" :src="GLOBAL.typeInfo(4).icon">
                      <div class="item-content">
                        <div class="item-title"><span
                          style="margin-right: 10px;">{{ GLOBAL.typeInfo(4).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(4).descn }}</div>
                      </div>
                    </div>
                    <div
                      @mouseenter="enter(5, $event)"
                      @mouseleave="leave(5, $event)"
                      @click="handleTypeChance(5)"
                      :class="placementInfo.adType===5? 'item-main-selected': 'item-main'"
                      :style="hasCross? 'cursor: not-allowed;': null">
                      <img class="item-icon" :style="hasInterstitial? 'opacity: 0.3;':null" :src="GLOBAL.typeInfo(5).icon" >
                      <div class="item-content">
                        <div class="item-title"><span style="margin-right: 10px;">{{ GLOBAL.typeInfo(5).title }}</span></div>
                        <div class="item-desc">{{ GLOBAL.typeInfo(5).descn }}</div>
                      </div>
                    </div>
                  </div>
                </om-form-model>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="Scenes" key="2" forceRender>
              <a-card
                v-if="[2, 3, 5].includes(placementInfo.adType)"
                :bordered="false"
                style="margin: 16px 16px 0;margin-left: 8px;margin-right: 24px;">
                <ScenesEdit ref="scenesEdit" @change="hasChangeScene" :list="placementInfo.scenes"/>
              </a-card>
              <a-card v-else :bordered="false" style="margin: 16px 16px 0;">
                <a-alert
                  style="margin-right:16px;"
                  message="Notice"
                  description="Scene can only be added/edited in Rewarded Video or Interstitial placement."
                  type="info"
                  :show-icon="true"
                />
              </a-card>
            </a-tab-pane>
            <a-tab-pane tab="Advanced Settings" key="3" forceRender :style="{height: height}">
              <a-card :bordered="false" style="margin: 16px auto 0;">
                <om-form-model
                  label="Callback URL"
                  v-if="placementInfo.adType===2"
                  :fill="false"
                  :tip="$msg('placement.callback_url_tip')">
                  <a-input v-model="placementInfo.icUrl" style="width:418px;"/>
                </om-form-model>
                <om-form-model
                  label="Frequency Cap"
                  v-if="[0, 1].includes(placementInfo.adType)"
                  :fill="false"
                  :tip="$msg('placement.frequency_tip')">
                  Limit to
                  <a-input-number
                    type="number"
                    size="small"
                    :min="0"
                    :max="9999"
                    style="width:66px;"
                    v-model="placementInfo.frequencyCap"/>
                  impressions per
                  <a-input-number
                    type="number"
                    size="small"
                    :min="1"
                    :max="24"
                    style="width:50px;"
                    v-model="placementInfo.frequencyUnit"/>
                  hour(s)
                </om-form-model>
                <om-form-model
                  :fill="false"
                  style="margin-bottom: 8px;"
                  label="Pacing"
                  :tip="$msg('placement.pacing_tip')">
                  Show a maximun ad 1ad per
                  <a-input-number
                    type="number"
                    size="small"
                    :min="0"
                    :max="1440"
                    style="width:66px;"
                    v-model="placementInfo.frequencyInterval"/>
                  minute(s)
                </om-form-model>
                <om-form-model
                  :fill="false"
                  style="margin-bottom: 16px;"
                  label="Device Brand"
                  :tip="$msg('placement.brand_tip')">
                  <a-input-group compact style="margin-top:6px;">
                    <a-select v-model="placementInfo.brandType" style="width: 100px">
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
                      v-model="placementInfo.brandList"
                      mode="multiple">
                      <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                      <a-select-option v-for="d in deviceData" :key="d.value" :title="d.text">{{ d.text }}
                      </a-select-option>
                    </a-select>
                  </a-input-group>
                </om-form-model>
                <om-form-model
                  :fill="false"
                  style="margin-bottom: 8px;"
                  label="Device Model"
                  :tip="$msg('placement.model_tip')">
                  <a-input-group compact style="margin-top:6px;">
                    <a-select v-model="placementInfo.modelType" style="width: 100px">
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
                      v-model="placementInfo.modelList"
                      mode="multiple">
                      <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                      <a-select-option v-for="did in deviceData" :key="did.value">{{ did.text }}</a-select-option>
                    </a-select>
                  </a-input-group>
                </om-form-model>
                <om-form-model :fill="false" v-if="placementInfo.adType===5" style="margin-bottom: 8px;" label="Pool Size" >
                  <a-input-number
                    style="width:400px"
                    type="number"
                    :min="2"
                    :max="20"
                    v-model="placementInfo.inventoryCount"/>
                </om-form-model>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-form-model>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>
import { brandSearch, modelSearch, placementGet, placementList, placementUpdateWithScenes } from '@/api/publisher'
import OmFormModel from '@/components/OmFormModel'
import ScenesEdit from './ScenesEdit'
import { mapState } from 'vuex'
import OmPageAction from '@/components/OmPageAction'

export default {
  name: 'CreatePlacement',
  components: {
    OmFormModel,
    ScenesEdit,
    OmPageAction
  },
  data () {
    const canEdit = this.$route.query.type !== 'Details'
    return {
      canEdit,
      loading: false,
      hasRv: false,
      hasInterstitial: false,
      height: '500px',
      hasCross: false,
      spinning: true,
      count: -100,
      type: this.$route.query.type,
      activeKey: this.$route.query.key || '1',
      placementInfo: {
        pubAppId: this.$store.state.publisher.searchApp,
        name: '',
        icUrl: '',
        frequencyCap: 0,
        frequencyUnit: 1,
        frequencyInterval: 0,
        adType: this.$route.params.type === 'Edit' ? null : 0,
        modelType: 'include',
        brandType: 'include',
        inventoryCount: 2,
        scenes: []
      },
      rules: {
        name: [
          { required: true, whitespace: true, message: this.$msg('placement.name_empty'), trigger: 'change' }
        ]
      },
      placementId: this.$route.query.placementId,
      deviceData: [],
      editType: this.$route.query.type,
      lastFetchId: 0,
      value: [],
      fetching: false,
      oldData: {},
      changeScenes: false
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
          } else if (item.adType === 5) {
            this.hasCross = true
          }
        })
        if (this.placementId > 0) {
          placementGet({ placementId: this.$route.query.placementId })
            .then(res => {
              if (res.data) {
                this.placementInfo = Object.assign(this.placementInfo, res.data)
                if (res.data.scenes) {
                  this.arraySort(res.data.scenes)
                  res.data.scenes.forEach(item => {
                    item.expandStatus = false
                    item.editStatus = false
                  })
                  this.placementInfo.scenes = res.data.scenes
                }
                this.oldData = JSON.parse(JSON.stringify(this.placementInfo))
                this.spinning = false
              }
            }).finally(() => {
              this.spinning = false
            })
        } else {
          if (!this.hasRv) {
            this.placementInfo.adType = 2
          } else if (!this.hasInterstitial) {
            this.placementInfo.adType = 3
          }
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
      if (value === 5 && this.hasCross) {
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
      if (this.placementInfo.adType !== value) {
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
      if (type === 5 && this.hasCross) {
        return false
      }
      if (!this.placementId) {
        this.placementInfo.adType = type
      }
    },
    close () {
      this.$router.push('/publisher/placement/list')
    },
    createPlacement () {
      this.loading = true
      let tag = true
      const that = this
      this.$refs.placementForm.validate((b) => {
        if (!b) {
          tag = false
        }
      })
      if (!tag) {
        this.activeKey = '1'
        this.loading = false
        return
      }
      if (that.placementInfo.brandList) {
        const brandWhitelist = that.placementInfo.brandType === 'include' ? that.placementInfo.brandList.join('\n') : null
        const brandBlacklist = that.placementInfo.brandType === 'exclude' ? that.placementInfo.brandList.join('\n') : null
        that.placementInfo = Object.assign(that.placementInfo, {
          'brandWhitelist': brandWhitelist,
          'brandBlacklist': brandBlacklist
        })
      }
      if (that.placementInfo.modelList) {
        const modelWhitelist = that.placementInfo.modelType === 'include' ? that.placementInfo.modelList.join('\n') : null
        const modelBlacklist = that.placementInfo.modelType === 'exclude' ? that.placementInfo.modelList.join('\n') : null
        that.placementInfo = Object.assign(that.placementInfo, {
          'modelWhitelist': modelWhitelist,
          'modelBlacklist': modelBlacklist
        })
      }
      if (this.$refs.scenesEdit) {
        that.placementInfo.scenes = this.$refs.scenesEdit.data || []
      } else {
        that.placementInfo.scenes = []
      }
      if (this.placementId) {
        placementUpdateWithScenes(that.placementInfo).then(() => {
          this.$router.push('/publisher/placement/list')
          this.$message.success(this.$msg('placement.update_success'))
        }).finally(() => {
          this.loading = false
        })
      } else {
        that.placementInfo.id = -100
        placementUpdateWithScenes(that.placementInfo).then(res => {
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
        }).finally(() => {
          this.loading = false
        })
      }
    },
    hasChangeScene () {
      this.changeScenes = true
    },
    /**
     * 验证是否有改动，表单直接跟原始数据对比
     * Scenes列表只要涉及保存和更改状态就算改动过
     * @returns {boolean}
     */
    hasChange () {
      if (this.changeScenes || this.editType === 'Add') {
        return true
      }
      const temp = this.placementInfo
      const { name, icUrl, frequencyCap, frequencyUnit, frequencyInterval, brandList, modelList, inventoryCount } = { ...this.oldData }
      try {
        if (temp.name !== name) {
          return true
        }
        if (temp.inventoryCount !== inventoryCount) {
          return true
        }
        if (temp.adType === 2 && temp.icUrl !== icUrl) {
          return true
        }
        if ([0, 1].includes(temp.adType)) {
          if (temp.frequencyCap !== frequencyCap) {
            return true
          }
          if (temp.frequencyUnit !== frequencyUnit) {
            return true
          }
        }
        if (temp.frequencyInterval !== frequencyInterval) {
          return true
        }
        if (temp.brandList.join(',') !== brandList.join(',')) {
          return true
        }
        if (temp.modelList.join(',') !== modelList.join(',')) {
          return true
        }
      } catch (e) {
        return true
      }
      return false
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
        this.deviceData = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))
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
        this.deviceData = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))
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

<style type="less" scoped>
  .item-main {
    margin: 0 0 8px 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    cursor: pointer;
    display: flex;
    padding: 8px;
    align-items: center;
    border-radius: 4px;
    justify-content: flex-start;
    height: 88px;
    width: 418px;
  }

  .item-main-selected {
    margin: 0 0 8px 0;
    border: 1px solid rgb(26, 125, 240);
    cursor: pointer;
    display: flex;
    padding: 8px;
    align-items: center;
    border-radius: 4px;
    justify-content: flex-start;
    height: 88px;
    width: 418px;
  }

  .item-title {
    display: inline-block;
    vertical-align: middle;
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
    margin: 8px 0;
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
    width: 56px;
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
    margin: 0 0 16px 0;
    border: 1px solid rgb(26, 125, 240);
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .plcedit >>> .ant-card-head-title {
    margin-left: -8px;
    margin-top: -6px;
  }

  .plcedit > > > .ant-card-head {
    height: 48px;
  }

  .plcedit > > > .ant-form-item {
    margin-bottom: 0;
  }

  .plcedit > > > .ant-form-explain, .ant-form-extra {
    line-height: 1.5;
    margin-bottom: -20px;
  }

  .plcedit {
    box-shadow: 0 4px 10px rgba(221, 224, 228, 0.3), 0 0 4px rgba(221, 224, 228, 0.3);
    border-radius: 2px;
  }
</style>
