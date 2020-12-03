<!-- Instances tab -->
<template>
  <div>
    <div v-if="!searchPlacement" class="table-page-search-wrapper">
      <div class="table-page-search-wrapper">
        <a-alert
          class="om-card-style"
          type="info"
        >
          <span slot="message" style="text-align: center;width: 100%;">
            <div style="text-align:center; width:900px;margin-left:15%;margin-top:24px;height: 180px">
              <div style="display:inline-block;float:left; margin-right:26px;margin-left:100px;margin-bottom: 32px"><img src="/assets/mediation_tip.svg"/></div>
              <div style="text-align:left;line-height:20px;padding-top: 8px">
                <h4 style="font-size: 16px;color: #333333">You need Placements!</h4>
                <p style="font-size:14px;color: #666666">Placements offer more control of where and how ads are served within your app.<br>AdTiming currently support ad placements for all ad formats, i.e. Rewarded Video,<br>Interstitial, Banner, and Native. In addition, you can now also pace and cap your<br>placements to ensure the ultimate user experience!</p>
                <div class="button-add">
                  <a-button type="primary" v-if="canEdit" style="width: 168px;" @click="addPlacement()">Add Placement</a-button>
                </div>
              </div>
            </div>
          </span>
        </a-alert>
      </div>
    </div>
    <div v-else>
      <om-alert v-if="showAlert && canEdit" @click="alertClick" :message="alertMessage"></om-alert>
      <div class="adnedit">
        <a-form :form="form" :hideRequiredMark="true">
          <a-row type="flex" justify="start" style="height: 44px;">
            <om-ad-network-select
              name="insAdnId"
              :showArrow="false"
              :pubAppId="parseInt(searchApp)"
              mode="none"
              @change="adnFilterChange"
              size="default"
              style="margin-left:8px; display:inline-block; margin-right:8px;"/>
            <om-instance-select ref="insselect" :adnIds="adnIds" :placementId="parseInt(searchPlacement)"/>
            <a-form-item>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">Apply</a-button>
              </span>
            </a-form-item>
            <a-form-item v-action:edit v-if="canEdit" style="position:absolute; right:8px;">
              <span class="table-page-search-submitButtons" >
                <a-button type="primary" :disabled="this.curExpandedRowKeys.length > 0" ghost @click="instanceAdd">Add Instance</a-button>
              </span>
            </a-form-item>
          </a-row>
        </a-form>
        <a-form-model ref="instanceForm" :model="instanceInfo" :rules="rules" :hideRequiredMark="true">
          <a-table
            style="margin-left:8px;margin-right:8px;margin-bottom:24px;background-color: white"
            class="ant-card-table-default-noshadow"
            ref="table"
            rowKey="id"
            :dataSource="data"
            :loading="loading"
            :expandedRowKeys="curExpandedRowKeys"
            :columns="columns"
            :rowClassName="(record)=>{
              if (curExpandedRowKeys.length && record.id === curExpandedRowKeys[0]){
                return 'om-edit-row'
              } else {
                return 'normal'
              }
            }"
            :expandIconAsCell="false"
            :expandIconColumnIndex="-1"
            :pagination="false"
          >
            <div slot="expandedRowRender" class="expand-row" slot-scope="record" :rowKey="record.id" style="margin: 0">
              <om-form-model
                label="In-app Bidding"
                :colon="false"
                :fill="false"
                style="margin-bottom: 0;">
                <a-checkbox
                  :disabled="!record.editStatus || !record.createNew || [12,17].includes(record.id) || [12,17].includes(tempAdn)"
                  size="small"
                  v-model="instanceInfo.hbStatus"
                />
              </om-form-model>
              <om-form-model
                label="Frequency Cap"
                :colon="false"
                :fill="false"
                style="margin-bottom: 0;">
                Limit to <a-input-number
                  type="number"
                  size="small"
                  :min="0"
                  :disabled="!record.editStatus"
                  :max="9999"
                  style="width:66px;"
                  v-model="instanceInfo.frequencyCap"/> impressions per
                <a-input-number
                  type="number"
                  size="small"
                  :disabled="!record.editStatus"
                  :min="1"
                  :max="24"
                  style="width:50px;"
                  v-model="instanceInfo.frequencyUnit"/> hour(s)
              </om-form-model>
              <om-form-model
                style="margin-bottom: 0;"
                label="Pacing"
                :fill="false"
                :colon="false">
                Show a maximun ad 1ad per <a-input-number
                  type="number"
                  :disabled="!record.editStatus"
                  size="small"
                  :min="0"
                  :max="1440"
                  style="width:66px;"
                  v-model="instanceInfo.frequencyInterval"/> minute(s)
              </om-form-model>
              <om-form-model
                style="margin-bottom: 0;"
                label="Device Brand"
                :fill="false"
                :colon="false">
                <a-input-group compact style="margin-top:6px;">
                  <a-select :disabled="!record.editStatus" v-model="instanceInfo.brandType" style="width: 100px" >
                    <a-select-option value="include">include</a-select-option>
                    <a-select-option value="exclude">exclude</a-select-option>
                  </a-select>
                  <a-select
                    :disabled="!record.editStatus"
                    style="width: 300px"
                    @search="selectBrand"
                    @change="handleChange"
                    :filterOption="false"
                    :notFoundContent="fetching ? undefined : null"
                    v-model="instanceInfo.brandList"
                    mode="multiple">
                    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                    <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                  </a-select>
                </a-input-group>
              </om-form-model>
              <om-form-model
                style="margin-bottom: 16px;"
                label="Device Model"
                :colon="false"
                :fill="false">
                <a-input-group compact style="margin-top:6px;">
                  <a-select :disabled="!record.editStatus" v-model="instanceInfo.modelType" style="width: 100px" >
                    <a-select-option value="include">include</a-select-option>
                    <a-select-option value="exclude">exclude</a-select-option>
                  </a-select>
                  <a-select
                    style="width: 300px"
                    @search="selectModel"
                    :disabled="!record.editStatus"
                    @change="handleChange"
                    :filterOption="false"
                    :notFoundContent="fetching ? undefined : null"
                    v-model="instanceInfo.modelList"
                    mode="multiple">
                    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                    <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                  </a-select>
                </a-input-group>
              </om-form-model>
            </div>
            <span slot="status" slot-scope="text, record">
              <template>
                <div v-if="record.editStatus">
                  <a @click="handleInstanceSave(record)">Save</a>
                  <a-divider type="vertical" />
                  <a @click="handleInstanceCancel(record)">Cancel</a>
                </div>
                <div v-else-if="canEdit && !abt">
                  <a @click="handleEdit(record)">Edit</a>
                  <a-divider type="vertical" />
                  <a @click="handelInstanceStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </div>
                <div v-else>
                  <a @click="handleOpen(record)">Details</a>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </div>
              </template>
            </span>
            <span slot="className" class="row-edit" slot-scope="text, record">
              <ad-network
                v-if="!record.createNew"
                style="max-width:120px;"
                :className="text"
                :id="record.adnId"
                :status="record.status"
              />
              <a-form-model-item prop="adnId" v-else>
                <ADNSelect @change="adnChange" :placementId="searchPlacement" />
              </a-form-model-item>
            </span>
            <span class="row-edit" slot="placementKey" slot-scope="text, record">
              <div :style="record.status===0 ? 'opacity: 0.3;' : null">
                <a-form-model-item prop="placementKey" size="small" v-if="record.editStatus && ![0, 19].includes(record.adnId)">
                  <a-input :disabled="tempAdn < 0" placeholder="Unit ID" style="margin-top:0;" v-model="instanceInfo.placementKey" />
                </a-form-model-item>
                <span v-else :title="record.id"><ellipsis :length="30" tooltip>{{ text }}</ellipsis></span>
              </div>
            </span>
            <span class="row-edit" slot="name" slot-scope="text, record">
              <span :style="record.status===0 ? 'opacity: 0.3;' : null">
                <a-form-model-item prop="name" size="small" v-if="record.editStatus">
                  <a-input placeholder="Instance name" :max-length="40" style="margin-top:0;" v-model="instanceInfo.name"/>
                </a-form-model-item>
                <span v-else class="hb-bottom">
                  <om-text :text="text" />
                  <a-button
                    v-if="record.hbStatus"
                    type="danger"
                    style="width: 100px;
                    font-size: 12px;
                    margin-left: 10px;
                    height: 25px;"
                    ghost>In-app Bidding</a-button>
                  <img v-if="record.abTestModel===1" style="margin-left:8px;" src="/icon/testb.svg" />
                </span>
              </span>
            </span>
          </a-table>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import {
  adNetworkInstancesList,
  getInstance,
  instancesCreate,
  instancesSelectList,
  instancesStatusUpdate,
  instancesUpdate
} from '@/api/mediation'
import Placement from '@/components/om/Placement'
import { brandSearch, modelSearch } from '@/api/publisher'
import OmInstanceSelect from '@/components/om/InstanceSelect'
import { Ellipsis, OmAlert } from '@/components'
import OmText from '@/components/om/Text'
import AdNetwork from '@/components/Mediation/AdNetwork'
import ADNSelect from './ADNSelect'
import { mapState } from 'vuex'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmFormModel from '@/components/OmFormModel'

export default {
  name: 'InstanceEdit',
  components: {
    Placement,
    Ellipsis,
    OmInstanceSelect,
    OmText,
    AdNetwork,
    ADNSelect,
    OmAdNetworkSelect,
    OmAlert,
    OmFormModel
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    searchPlacement: state => state.publisher.searchPlacement,
    searchPlacementAbt: state => state.publisher.searchPlacementAbt
  }),
  data () {
    const checkPlacementKey = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$msg('instance.unit_id_empty')))
        return false
      }
      const id = this.instanceInfo.id
      let flag = true
      this.data.forEach(ins => {
        if (ins.placementKey === value && ins.id === id && !ins.createNew) {
          callback()
          flag = false
        }
      })
      if (!flag) {
        return
      }
      getInstance({ placementKey: value, pubAppId: this.pubAppId, adnId: this.tempAdn }).then(res => {
        if (res.data && res.data.length) {
          callback(new Error(this.$msg('instance.placement_key_exits')))
        } else {
          callback()
        }
      })
    }
    const adnIdValidate = (rule, value, callback) => {
      if (!this.instanceInfo.adnId || this.instanceInfo.adnId < 0) {
        callback(new Error(this.$msg('instance.adn_empty')))
        return false
      } else {
        callback()
      }
    }
    const isnewPlc = parseInt(localStorage.getItem('isnew_plc')) || 0
    const canEdit = this.$auth('adn.edit') && this.$route.query.type !== 'Details'
    const columns = [
      {
        title: 'Ad Network',
        dataIndex: 'className',
        width: '25%',
        sorter: (a, b) => a.className.localeCompare(b.className),
        scopedSlots: { customRender: 'className' }
      },
      {
        title: 'Instance Name',
        dataIndex: 'name',
        width: '28%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Unit ID',
        dataIndex: 'placementKey',
        width: '28%',
        scopedSlots: { customRender: 'placementKey' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      }
    ]
    if (!canEdit) {
      columns.pop()
    }
    return {
      instanceInfo: {
        adnId: undefined,
        name: '',
        placementKey: '',
        brandList: [],
        brandType: 'include',
        modelList: [],
        modelType: 'include'
      },
      rules: {
        name: [
          { required: true, message: this.$msg('instance.name_empty'), trigger: 'change' }
        ],
        adnId: [
          { validator: adnIdValidate, trigger: 'change' }
        ],
        placementKey: [
          { validator: checkPlacementKey, trigger: 'change' }
        ]
      },
      alertMessage: {
        title: 'Everything is ready.',
        content: 'Next steps：Setup a Mediation Rule to Monitize',
        button: 'Setup Mediation Rule'
      },
      showAlert: false,
      form: this.$form.createForm(this),
      searchOption: {},
      currentAdn: null,
      tempAdn: -1,
      abt: 0,
      canEdit,
      isnewPlc,
      currentAdnAppId: null,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      instanceSelectOption: [],
      data: [],
      adnIds: [],
      value: [],
      scroll: 200,
      currentRecord: null,
      loading: false,
      deviceData: [],
      lastFetchId: 0,
      fetching: false,
      count: -100,
      columns: columns,
      pubAppId: this.$store.state.publisher.searchApp,
      accounts: null
    }
  },
  watch: {
    searchPlacement (curVal) {
      this.curExpandedRowKeys = []
      this.currentExpandedStatOpen = false
      this.listSearch()
    },
    searchPlacementAbt (curVal) {
      this.abt = curVal
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 320
    if (this.searchPlacement) {
      this.listSearch()
      instancesSelectList({ placementId: this.searchPlacement, pubAppId: this.pubAppId }).then(res => {
        if (res.code === 0) {
          this.instanceSelectOption = res.data
        }
      })
    }
  },
  methods: {
    alertClick () {
      this.$emit('tab2')
    },
    adnFilterChange (val) {
      if (val) {
        this.adnIds = [val]
      } else {
        this.adnIds = []
      }
      this.form.resetFields(['instanceId'])
    },
    adnChange (val) {
      if (!val) {
        this.tempAdn = null
        this.form.resetFields()
        this.currentAdn = null
        this.currentAdnAppId = null
        return
      }
      this.tempAdn = val.id
      this.instanceInfo.adnId = val.id
      if (this.tempAdn === 17) {
        const current = this.data.find(row => row.id === this.curExpandedRowKeys[0])
        current.hbStatus = true
      } else {
        const current = this.data.find(row => row.id === this.curExpandedRowKeys[0])
        current.hbStatus = false
      }
      this.accounts = val.accounts
      if (!val.adNetworkAppId) {
        this.currentAdn = val
      } else {
        this.currentAdnAppId = val.adNetworkAppId
        this.form.resetFields()
        this.currentAdn = null
      }
    },
    handleOpen (record) {
      const that = this
      this.currentAdnAppId = null
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
          record.editStatus = false
          record.expandStatus = false
          this.currentAdnAppId = null
          this.currentAdn = null
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
          this.data.forEach(item => {
            if (item.id !== record.id) {
              item.expandStatus = false
              item.editStatus = false
            }
          })
          this.tempAdn = record.adnId
          record.expandStatus = true
          setTimeout(function () {
            that.curExpandedRowKeys.push(record.id)
            if (record.adNetworkAppId) {
              this.instanceInfo = JSON.parse(JSON.stringify(record))
            }
          }, 1)
        }
      } else {
        this.tempAdn = record.adnId
        record.expandStatus = true
        this.curExpandedRowKeys.push(record.id)
        this.instanceInfo = JSON.parse(JSON.stringify(record))
      }
    },
    handleEdit (record) {
      record.editStatus = true
      if (!record.expandStatus) {
        this.handleOpen(record)
      }
    },
    handleInstanceSave (record) {
      this.$refs.instanceForm.validate((b) => {
        if (b) {
          const item = { ...this.instanceInfo }
          item.placementKey = item.placementKey && item.placementKey.trim()
          item.brandWhitelist = item['brandType'] === 'include' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.brandBlacklist = item['brandType'] === 'exclude' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.modelWhitelist = item['modelType'] === 'include' && item['modelList'] ? item['modelList'].join('\n') : ''
          item.modelBlacklist = item['modelType'] === 'exclude' && item['modelList'] ? item['modelList'].join('\n') : ''
          item.hbStatus = item.hbStatus ? 1 : 0
          item.pubAppId = this.searchApp
          if (record.createNew) {
            item.adnAppId = this.currentAdnAppId
            instancesCreate(item).then(res => {
              if (res.code === 0) {
                record.expandStatus = false
                record.createNew = false
                this.handleOpen(item)
                this.listSearch()
                this.$refs.insselect.upload()
                if (this.$route.query.newplc) {
                  this.showAlert = true
                  document.documentElement.scrollTop = 0
                }
                this.$message.success(this.$msg('instance.create_success'))
              }
            })
          } else {
            instancesUpdate(item).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                this.listSearch()
                if (this.$route.query.newplc) {
                  this.showAlert = true
                  document.documentElement.scrollTop = 0
                }
                this.$message.success(this.$msg('instance.update_success'))
              }
            })
          }
        }
      })
    },
    handelInstanceStatusUpdate (record) {
      if (record.id) {
        const status = (record.status === 0) ? 1 : 0
        instancesStatusUpdate({ status: status, instanceId: record.id }).then(res => {
          if (res.code === 0) {
            record.status = status
            this.listSearch()
            this.$message.success(this.$msg('instance.update_success'))
          }
        })
      }
    },
    instanceAdd () {
      this.data.forEach(item => {
        item.expandStatus = false
        item.editStatus = false
      })
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      this.currentAdn = null
      const newItem = {
        id: this.count,
        name: '',
        hbStatus: false,
        adnId: -1,
        frequencyCap: 0,
        status: 1,
        frequencyUnit: 1,
        frequencyInterval: 0,
        brandType: 'include',
        brandList: [],
        modelType: 'include',
        modelList: [],
        createNew: true,
        adnAppId: null,
        expandStatus: false,
        editStatus: true,
        placementKey: '',
        placementId: this.searchPlacement
      }
      this.data.unshift(newItem)
      this.handleOpen(newItem)
      this.count = this.count - 1
      this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
        node.scrollTop = 0
      })
    },
    handleInstanceCancel (record, key) {
      if (record.createNew) {
        this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
      }
      this.handleOpen(record)
      this.listSearch()
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
    listSearch () {
      this.loading = true
      const params = { pubAppId: this.pubAppId, placementId: this.searchPlacement }
      if (this.form.getFieldValue(['insAdnId'])) {
        params.adNetworkId = this.form.getFieldValue(['insAdnId']).sAdnId
      }
      adNetworkInstancesList(Object.assign(params, this.form.getFieldsValue(['instanceId'])))
        .then(res => {
          if (res.code === 0) {
            this.abt = this.searchPlacementAbt
            this.arraySort(res.data)
            res.data.forEach(item => {
              if (item.instances) {
                item.instances.forEach(ins => {
                  ins.hbStatus = ins.hbStatus !== 0
                  ins.editStatus = false
                  ins.expandStatus = false
                })
              }
            })
            if (res.data && res.data.length) {
              this.arraySort(res.data[0].instances)
              this.data = res.data[0].instances
            }
          }
        }).finally(() => {
          this.loading = false
        })
    },
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return b.createTime - a.createTime
        } else {
          return b.status - a.status
        }
      })
    },
    placementFilterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.componentOptions.children[1].children[0].text.indexOf(input) >= 0
      )
    },
    selectPlacementChange (value) {
      this.searchOption.placementId = value
    },
    instanceFilterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.componentOptions.children[1].children[0].text.indexOf(input) >= 0
      )
    },
    selectInstanceChange (value) {
      this.searchOption.instanceId = value
    },
    addPlacement () {
      if (this.isnewPlc) {
        localStorage.removeItem('isnew_plc')
      }
      if (this.$route.query.isnew) {
        this.$router.push({
          path: '/publisher/placement/add',
          query: { type: 'Add', isnew: '2' }
        })
      } else {
        this.$router.push({
          path: '/publisher/placement/add',
          query: { type: 'Add' }
        })
      }
    }
  }
}
</script>

<style type="less" scoped>
  .hb-bottom >>> .ant-btn {
    padding: 0 0;
  }
  .adnedit >>> .ant-card-head-title {
    margin-left: -8px;
    margin-top: -6px;
  }
  .adnedit >>> .ant-card-head {
    height: 48px;
  }
  .adnedit >>> .ant-form-item {
    margin-bottom: 0;
  }
  .expand-row >>> .ant-divider {
    height: 1px;
    margin-top: -16px;
  }
  .adnedit >>> .ant-form-explain, .ant-form-extra {
    line-height: 1.5;
    margin-bottom: -20px;
  }
  .ant-alert-info {
    background-color: white;
    border:none;
  }
</style>
