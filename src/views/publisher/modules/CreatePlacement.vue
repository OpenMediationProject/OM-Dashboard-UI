<!-- Placement edit router '/publisher/placement/add' -->
<template>
  <div>
    <div class="button-div">
      <a-button v-if="this.$route.query.type === 'Edit'" type="primary" class="save-button" v-action:edit @click="createPlacement">Save</a-button>
      <a-button v-else-if="this.$route.query.type === 'Add'" type="primary" class="save-button" v-action:add @click="createPlacement">Add</a-button>
      <a-button v-else type="primary" class="save-button" @click="close">OK</a-button>
    </div>
    <a-form :form="form">
      <a-card :bordered="false" >
        <a-tabs :activeKey="activeKey" class="createplacement" style="margin-left:14px;" @change="tabClickHandler">
          <a-tab-pane tab="Basic" key="1" :style="{height: height}">
            <div style="margin: 16px auto 0;">
              <om-form label="Name" field="name" :showTip="false" style="margin-bottom:24px;">
                <a-form-item style="width: 408px;">
                  <a-input placeholder="Appname-Placement name" v-decorator="['mdl.name', { initialValue: '', rules: [{ required: true, message: 'Placement name can not be empty.' },{max: 30, message: 'Android App Name max length limited to 30 characters'}] }]"/>
                </a-form-item>
              </om-form>
              <om-form label="Type" :showTip="false">
                <a-form-item v-if="editType==='Edit' || editType === 'Details'">
                  <div v-if="mdl.adType===2" :class="mdl.adType===2? 'item-main-selected': 'item-main'" style="cursor: not-allowed;">
                    <img class="item-icon" src="/icon/placement/video-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Rewarded Video</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                    </div>
                  </div>
                  <div v-if="mdl.adType===1" @click="handleTypeChance(1)" :class="mdl.adType===1? 'item-main-selected': 'item-main'" :style="placementId? 'cursor: not-allowed;':'' ">
                    <img class="item-icon" src="/icon/placement/native-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Native</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Native ad is favored for its integration into content, allowing for an uninterrupted UX.</div>
                    </div>
                  </div>
                  <div v-if="mdl.adType===3" :class="mdl.adType===3? 'item-main-selected': 'item-main'" style="cursor: not-allowed;margin: 0 0px 16px 0;">
                    <img class="item-icon" src="/icon/placement/int-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Interstitial</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">A full-screen ad appearing at natural breaks during the app lifecycle. Users can choose to skip these ads.</div>
                    </div>
                  </div>
                  <div v-if="mdl.adType===0" @click="handleTypeChance(0)" :class="mdl.adType===0? 'item-main-selected': 'item-main'" :style="placementId? 'cursor: not-allowed;':'' ">
                    <img class="item-icon" src="/icon/placement/banner-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Banner</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                    </div>
                  </div>
                </a-form-item>
                <a-form-item v-else>
                  <div :class="mdl.adType===2? 'item-main-selected': 'item-main'" style="cursor: not-allowed;">
                    <img class="item-icon" src="/icon/placement/video-gray.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Rewarded Video</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                    </div>
                  </div>
                  <div @mouseenter="enter(1, $event)" @mouseleave="leave(1, $event)" @click="handleTypeChance(1)" :class="mdl.adType===1? 'item-main-selected': 'item-main'" :style="placementId? 'cursor: not-allowed;':'' ">
                    <img class="item-icon" src="/icon/placement/native-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Native</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Native ad is favored for its integration into content, allowing for an uninterrupted UX.</div>
                    </div>
                  </div>
                  <div :class="mdl.adType===3? 'item-main-selected': 'item-main'" style="cursor: not-allowed;">
                    <img class="item-icon" src="/icon/placement/int-gray.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Interstitial</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">A full-screen ad appearing at natural breaks during the app lifecycle. Users can choose to skip these ads.</div>
                    </div>
                  </div>
                  <div @mouseenter="enter(0, $event)" @mouseleave="leave(0, $event)" @click="handleTypeChance(0)" :class="mdl.adType===0? 'item-main-selected': 'item-main'" :style="placementId? 'cursor: not-allowed;':'' ">
                    <img class="item-icon" src="/icon/placement/banner-blue.svg" style="width: 30px;height: 55.5px;">
                    <div class="item-content">
                      <div class="item-title"><span style="margin-right: 10px;">Banner</span><a><a-icon type="question-circle" /></a></div>
                      <div class="item-desc">Rewarded Video ad rewards your users with valuable virtual item in exchange for a completed view.</div>
                    </div>
                  </div>
                </a-form-item>
              </om-form>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="Scenes" key="2" forceRender :style="{height: height}">
            <a-card v-if="mdl.adType === 2 || mdl.adType ===3" :bordered="false" style="margin: 16px 16px 0;margin-left: 0px;">
              <div class="table-page-search-wrapper" v-if="canEdit">
                <a-row :gutter="48">
                  <a-col>
                    <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } || {} ">
                      <a-button type="primary" ghost @click="handleAddSence()">Add Scene</a-button>
                    </span>
                  </a-col>
                </a-row>
              </div>
              <a-table
                class="ant-card-table-default-noshadow"
                style="margin-bottom:64px;"
                ref="table"
                rowKey="id"
                fixed="true"
                :dataSource="data"
                :scroll="{ y: 420 }"
                :expandedRowKeys="curExpandedRowKeys"
                :columns="columns"
                :expandIconAsCell="false"
                :expandIconColumnIndex="-1"
                :pagination="false"
              >
                <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                  <a-form-item
                    label="Frequency Cap"
                    :colon="false"
                    style="margin-bottom: 0px;"
                    :labelCol="{lg: { span: 10 }, sm: { span: 10 }}"
                    :wrapperCol="{lg: { span: 10 }, sm: { span: 10 } }">
                    Limit to <a-input-number
                      type="number"
                      size="small"
                      :min="0"
                      :max="9999"
                      style="width:66px;"
                      v-decorator="[record.id+'frequencyCap',{initialValue: record.frequencyCap}]"/> impressions per
                    <a-input-number
                      type="number"
                      size="small"
                      :min="1"
                      :max="24"
                      style="width:50px;"
                      v-decorator="[record.id+'frequencyUnit',{initialValue: record.frequencyUnit}]"/> hour(s)
                  </a-form-item>
                  <a-form-item
                    style="margin-bottom: 0px;"
                    label="Pacing"
                    :colon="false"
                    :labelCol="{lg: { span: 10 }, sm: { span: 10 }}"
                    :wrapperCol="{lg: { span: 10 }, sm: { span: 10 } }">
                    Show a maximun ad 1ad per <a-input-number
                      type="number"
                      size="small"
                      :min="0"
                      :max="1440"
                      style="width:66px;"
                      v-decorator="[record.id+'frequencyInterval',{initialValue: record.frequencyInterval}]"/> minute(s)
                  </a-form-item>
                </p>
                <span slot="frequencyCap" slot-scope="text, record">
                  <span :style="record.status===0 ? 'opacity: 0.3;' : null" v-if="record.frequencyCap===0 &&record.frequencyInterval===0">
                    <a-icon class="expand-icon" @click="handleExpand(record)" :type="record.expandStatus ? 'minus':'plus'" /> All
                  </span>
                  <span v-else>
                    <div :style="record.status===0 ? 'opacity: 0.3;' : null">
                      <div style="margin-top:-5px;"><a-icon class="expand-icon" @click="handleExpand(record)" :type="record.expandStatus ? 'minus':'plus'" />Frequency Cap: <span style="color:#1890ff;">{{ record.frequencyCap }} impr / {{ record.frequencyUnit }} h</span><br></div>
                      <div style="margin-top:5px;"><span style="margin-left:24px;">Pacing: <span style="color:#1890ff;">1 ads / {{ record.frequencyInterval }} min</span></span></div>
                    </div>
                  </span>
                </span>
                <span slot="status" slot-scope="text, record">
                  <template>
                    <div v-if="record.expandStatus">
                      <a herf="#" @click="handleSceneSave(record)">Save</a>
                      <a-divider type="vertical" />
                      <a herf="#" @click="handleCancel(record)">Cancel</a>
                    </div>
                    <div v-else>
                      <a herf="#" @click="handleExpand(record)">Edit</a>
                      <a-divider type="vertical" />
                      <a herf="#" @click="handelSceneStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                    </div>
                  </template>
                </span>
                <span slot="name" slot-scope="text, record">
                  <a-form-item v-if="record.expandStatus" :style="record.status===0 ? 'opacity: 0.3;' : null">
                    <a-input
                      placeholder="scene name"
                      v-decorator="[record.id+'name',{initialValue: record.name,rules: [{ required: true, message: '.' }]}]"
                    />
                  </a-form-item>
                  <span :style="record.status===0 ? 'opacity: 0.3;' : null" v-else >{{ text }}</span>
                </span>
              </a-table>
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
          </a-tab-pane>
          <a-tab-pane tab="Advanced Settings" key="3" :style="{height: height}">
            <a-card :bordered="false" style="margin: 16px auto 0;">
              <a-form-item
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
                </a-input-group>
              </a-form-item>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import { modelSearch, brandSearch, placementGet, placementUpdate,
  placementCreate, placementScenesUpdate, placementScenesCreate } from '@/api/publisher'
import OmForm from '@/components/OmForm'

export default {
  name: 'CreatePlacement',
  components: {
    OmForm
  },
  data () {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '400px',
        sorter: (a, b) => {
          return a.name.localeCompare(b.name)
        },
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Traffic Control',
        dataIndex: 'frequencyCap',
        scopedSlots: { customRender: 'frequencyCap' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        width: '150px',
        scopedSlots: { customRender: 'status' }
      }
    ]
    if (!this.$auth('placement.edit') && !this.$auth('placement.add')) {
      columns.pop()
    }
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      params: {},
      name: '',
      height: '500px',
      count: -100,
      activeKey: '1',
      canEdit: this.$auth('placement.edit') || this.$auth('placement.add'),
      mdl: { pubAppId: this.$store.state.publisher.searchApp, name: '', frequencyCap: 0, frequencyUnit: 1, frequencyInterval: 0, adType: this.$route.params.type === 'Edit' ? null : 1, modelType: 'include', brandType: 'include' },
      placementId: this.$route.query.placementId,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      data: [],
      deviceData: [],
      editType: this.$route.query.type,
      lastFetchId: 0,
      value: [],
      fetching: false,
      columns: columns
    }
  },
  mounted () {
    this.height = (window.innerHeight - 240) + 'px'
    if (this.placementId > 0) {
      placementGet({ placementId: this.$route.query.placementId })
        .then(res => {
          this.mdl = Object.assign(this.mdl, res.data)
          this.form.setFieldsValue({ mdl: this.mdl })
          this.arraySort(res.data.scenes)
          res.data.scenes.forEach(item => {
            item.expandStatus = false
          })
          this.data = res.data.scenes
        })
    } else {
      this.form.setFieldsValue({ mdl: this.mdl })
    }
  },
  methods: {
    enter (value, e) {
      e.target.className = 'item-main-selected'
    },
    leave (value, e) {
      if (this.mdl.adType !== value) {
        e.target.className = 'item-main'
      }
    },
    handleTypeChance (type) {
      if (!this.placementId) {
        this.mdl.adType = type
      }
    },
    handleSceneSave (record) {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.name = values[record.id + 'name']
          item.frequencyCap = values[record.id + 'frequencyCap']
          item.frequencyInterval = values[record.id + 'frequencyInterval']
          item.frequencyUnit = values[record.id + 'frequencyUnit']
          if (record.createNew) {
            item.placementId = that.placementId
            placementScenesCreate(item).then(res => {
              if (res.code === 0) {
                Object.assign(record, res.data)
                record.expandStatus = false
                record.createNew = false
                // remove temp data from table
                this.handleExpand(item)
                this.$message.success(`create scene success`)
              } else {
                this.$message.error(`create scene error`)
              }
            })
          } else {
            placementScenesUpdate(item).then(res => {
              if (res.code === 0) {
                this.$message.success(`update scene success`)
                Object.assign(record, item)
                this.handleExpand(record)
              } else {
                this.$message.error(`update scene error`)
              }
            })
          }
        }
      })
    },
    handleExpand (record) {
      record['expandStatus'] = !record['expandStatus']
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleCancel (record) {
      if (record.createNew) {
        this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
      }
      this.handleExpand(record)
    },
    handelSceneStatusUpdate (record) {
      placementScenesUpdate(Object.assign(record, { status: record.status === 0 ? 1 : 0 }))
        .then(res => {
          if (res.code === 0) {
            this.$message.success(`update success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleAddSence () {
      const newItem = {
        id: this.count,
        name: '',
        expandStatus: true,
        frequencyCap: 0,
        frequencyUnit: 1,
        frequencyInterval: 0,
        createNew: true
      }
      this.count = this.count - 1
      this.data.unshift(newItem)
      this.currentExpandedStatOpen = true
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(newItem.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(newItem.id)
        }
      } else {
        this.curExpandedRowKeys.push(newItem.id)
      }
      this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
        node.scrollTop = 0
      })
    },
    close () {
      this.$router.push('/publisher/placement/list')
    },
    createPlacement () {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          that.mdl = Object.assign(that.mdl, that.form.getFieldsValue().mdl)
          if (that.mdl.brandList) {
            const brandWhitelist = that.mdl.brandType === 'include' ? that.mdl.brandList.join(',') : null
            const brandBlacklist = that.mdl.brandType === 'exclude' ? that.mdl.brandList.join(',') : null
            that.mdl = Object.assign(that.mdl, { 'brandWhitelist': brandWhitelist, 'brandBlacklist': brandBlacklist })
          }
          if (that.mdl.modelList) {
            const modelWhitelist = that.mdl.modelType === 'include' ? that.mdl.modelList.join(',') : null
            const modelBlacklist = that.mdl.modelType === 'exclude' ? that.mdl.modelList.join(',') : null
            that.mdl = Object.assign(that.mdl, { 'modelWhitelist': modelWhitelist, 'modelBlacklist': modelBlacklist })
          }
          if (this.placementId) {
            placementUpdate(that.mdl).then(res => {
              if (res.code === 0) {
                this.$router.push('/publisher/placement/list')
                this.$message.success(`update placement success`)
              } else {
                this.$message.error(`create placement success`)
              }
            })
          } else {
            placementCreate(that.mdl).then(res => {
              if (res.code === 0) {
                this.$router.push('/publisher/placement/list')
                this.$message.success(`create placement success`)
              } else {
                this.$message.error(`create placement error`)
              }
            })
          }
        } else {
          this.activeKey = '1'
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
.button-div {
  bottom: 0px;
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 32.36%, #ffffff 100%);
}
.save-button {
  bottom: 36px;
  z-index: 100;
  width: 168px;
  left: 51%;
  position: inherit;
}
.ant-form-item {
  margin-bottom: 0px;
}
</style>
