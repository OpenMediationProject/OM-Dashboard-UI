<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="water-fall">
      <OmPageAction :has-change="hasChange" :loading="loading" @save="segmentSave" :canEdit="canEdit"/>
      <page-header-placement/>
      <a-form-model ref="ruleForm" :model="mediationRuleInfo" :rules="rules" :hideRequiredMark="true">
        <a-card class="card-noline om-card-style" title="Basic Information" :bordered="false" >
          <om-form-model field="name" label="Name" :tip="this.$msg('mediation.rule_name_tip')">
            <a-input :max-length="500" placeholder="Name" v-model="mediationRuleInfo.name"/>
          </om-form-model>
          <om-form-model field="autoOpt" label="Optimized Type" :tip="this.$msg('mediation.optimized_type_tip')">
            <a-select placeholder="Manual" v-model="mediationRuleInfo.autoOpt">
              <a-select-option :value="0">Manual</a-select-option>
              <a-select-option :value="1">Auto</a-select-option>
            </a-select>
          </om-form-model>
          <om-form-model label="Regions" field="regions" :tip="this.$msg('mediation.regions_tip')">
            <regions-select
              mode="multiple"
              :default-selected="mediationRuleInfo.regions"
              @change="(v)=>{mediationRuleInfo.regions=v}"
              style="width: 100%"/>
          </om-form-model>
          <om-form-model label="Channel" field="channel" :fill="false">
            <a-input-group style="width:100%" compact>
              <a-select v-model="mediationRuleInfo.channelBow">
                <a-select-option :value="0">include</a-select-option>
                <a-select-option :value="1">exclude</a-select-option>
              </a-select>
              <a-select allowClear v-model="mediationRuleInfo.channel" mode="tags" style="width: 73%">
              </a-select>
            </a-input-group>
          </om-form-model>
          <a-divider><img v-if="visible" @click="visible = !visible" src="/assets/lineUp.svg"><img
            @click="visible = !visible"
            v-else
            src="/assets/lineDown.svg"></a-divider>
          <span v-show="visible">
            <om-form-model label="Frequency" field="frequency" :fill="false" :tip="$msg('mediation.frequency_tip')">
              <a-input-number
                ref="iap-min"
                style="width:100%"
                type="number"
                :min="0"
                :max="500"
                v-model="mediationRuleInfo.frequency"/>
            </om-form-model>
            <om-form-model
              label="IAP(USD)"
              field="iap"
              :tip="$msg('mediation.iap_tip')"
              :fill="false">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="9999"
                  ref="iapmin"
                  @change="(v)=>iap[0]=v"
                  v-model="mediationRuleInfo.iapMin"
                  style=" width: 100px; text-align: center"
                  placeholder="Minimum"/>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none;"
                  placeholder="~"
                  disabled
                />
                <a-input-number
                  ref="iapmax"
                  :min="0"
                  @change="(v)=>iap[1]=v"
                  :max="9999"
                  v-model="mediationRuleInfo.iapMax"
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="Maximum"/>
              </a-input-group>
            </om-form-model>
            <om-form-model label="Gender" field="gender" :tip="$msg('mediation.gender_tip')" :fill="false">
              <a-checkbox-group v-model="mediationRuleInfo.gender">
                <a-checkbox :value="0">Male</a-checkbox>
                <a-checkbox :value="1">Female</a-checkbox>
              </a-checkbox-group>
            </om-form-model>
            <om-form-model
              label="Age"
              field="age"
              :tip="this.$msg('mediation.age_tip')"
              :fill="false">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="200"
                  ref="agemin"
                  @change="(v)=>age[0]=v"
                  v-model="mediationRuleInfo.ageMin"
                  style=" width: 100px; text-align: center"
                  placeholder="Minimum"/>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none;"
                  placeholder="~"
                  disabled
                />
                <a-input-number
                  ref="agemax"
                  :min="0"
                  @change="(v)=>age[1]=v"
                  :max="200"
                  v-model="mediationRuleInfo.ageMax"
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="Maximum"/>
              </a-input-group>
            </om-form-model>
            <om-form-model
              label="Connection Types"
              field="conType"
              :fill="false"
              :tip="this.$msg('mediation.contype_tip')">
              <a-select placeholder="Connection Types" v-model="mediationRuleInfo.conType" mode="multiple">
                <a-select-option :value="0">WIFI</a-select-option>
                <a-select-option :value="1">2G</a-select-option>
                <a-select-option :value="2">3G</a-select-option>
                <a-select-option :value="3">4G</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model
              label="Model Type"
              field="modelType"
              :fill="false"
              :tip="this.$msg('mediation.model_type_tip')">
              <a-select
                placeholder="Device Types"
                v-model="mediationRuleInfo.deviceModelType"
                mode="multiple"
                style="width: 100%;">
                <a-select-option :value="0">Phone</a-select-option>
                <a-select-option :value="1">Pad</a-select-option>
                <a-select-option :value="2">TV</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model label="Device Brand" field="brand" :tip="this.$msg('mediation.brand_tip')" :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.brandType">
                  <a-select-option value="include">include</a-select-option>
                  <a-select-option value="exclude">exclude</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  @search="selectBrand"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.brandList"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                  <a-select-option v-for="d in deviceBrandData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </om-form-model>
            <om-form-model label="Device Model" field="model" :tip="this.$msg('mediation.model_tip')" :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.modelType">
                  <a-select-option value="include">include</a-select-option>
                  <a-select-option value="exclude">exclude</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  @search="selectModel"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.modelList"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                  <a-select-option v-for="d in deviceModelData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </om-form-model>
          </span>
        </a-card>
        <a-card
          v-show="headerbidding.length"
          class="card-noline om-card-style"
          title="In-app Bidding"
          :bordered="false"
          style="margin-top:8px;">
          <a-spin :spinning="fetchingHB">
            <a-table
              style="margin: 8px 24px 24px;"
              class="ant-card-table-default-noshadow"
              ref="hbTable"
              rowKey="id"
              :dataSource="headerbidding"
              :columns="columnsHB"
              :pagination="false"
              :bordered="false"
            >
              <span slot="status" slot-scope="text, record">
                <template>
                  <a @click="instanceHbStatusUpdate(record, 'hb')">{{ record.priority >0 ? 'Disable' : 'Enable' }}</a>
                </template>
              </span>
              <span slot="name" slot-scope="text, record">
                <span :style="record.priority >0 ? null: 'opacity: 0.3;' ">
                  <a-tooltip :title="record.placementKey">{{ text }}</a-tooltip>
                </span>
              </span>
              <span slot="className" slot-scope="text, record">
                <ad-network
                  :className="text"
                  :id="record.adnId"
                  :status="record.priority>0 ? 1: 0"
                />
              </span>
            </a-table>
          </a-spin>
        </a-card>
        <a-card class="card-noline om-card-style" :bordered="false" title="Waterfall" style="margin-top:8px;">
          <a-row type="flex" justify="start" style="height: 44px;">
            <om-ad-network-select
              :pubAppId="appId"
              @change="adnChange"
              size="default"
              style="margin-left:24px;margin-right:8px; display:inline-block; "/>
            <OmInstanceSelect
              @change="(v)=>instanceIds=v"
              :adnIds="adnIds"
              :hb="true"
              :allowClear="true"
              modelName="instanceId"
              :placementId="this.placementId"/>
            <a-form-item>
              <a-select
                style="width:200px;margin-left: 8px;"
                @change="hourChange"
                v-model="mediationRuleInfo.hourBefore"
                :allowClear="false">
                <span slot="suffixIcon"><img src="/icon/Clock.svg"></span>
                <a-select-option
                  v-for="time in [{value: 12, title:'In 12 hours'},{value: 24, title:'In 24 hours'},{value:48, title:'In 48 hours'}]"
                  :key="time.value"
                  :title="time.title">
                  {{ time.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" style="margin-left:8px;width:100px;margin-top: 3px;" ghost @click="search(true)">
              Apply
            </a-button>
          </a-row>
          <a-spin :spinning="fetching">
            <WaterfallTable
              ref="waterfallTable"
              :autoOpt="mediationRuleInfo.autoOpt"
              :hour="hourBefore"
              :data="filter ? templist:instances"
              :sortdisable="filter"
              style="margin-left:24px;margin-right:24px;margin-bottom:16px;"
              @updateStatus="instanceUpdate"
              @sortEnd="sortInstance"
              @priorityUpdate="onCellChange"
            />
          </a-spin>
        </a-card>
        <div style="height:16px;"></div>
      </a-form-model>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>
import { segmentGet, mediationRuleInstanceList, segmentUpdateWithInstance } from '@/api/mediation'
import AdNetwork from '@/components/Mediation/AdNetwork'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmInstanceSelect from './InstanceSelect'
import WaterfallTable from './WaterfallTable'
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'
import numerify from 'numerify'
import OmPageAction from '@/components/OmPageAction'
import OmFormModel from '@/components/OmFormModel'
import RegionsSelect from '@/components/om/RegionsSelect'
import { modelSearch, brandSearch } from '@/api/publisher'

export default {
  name: 'MediationEdit',
  components: {
    WaterfallTable,
    OmAdNetworkSelect,
    AdNetwork,
    OmInstanceSelect,
    PageHeaderPlacement,
    OmPageAction,
    OmFormModel,
    RegionsSelect
  },
  data () {
    const type = this.$route.query.type
    const columnsHB = [
      {
        title: 'Ad Network',
        dataIndex: 'className',
        width: '40%',
        scopedSlots: { customRender: 'className' }
      },
      {
        title: 'Instance',
        dataIndex: 'name',
        width: '40%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      }
    ]
    const validateIap = (rule, value, callback) => {
      if (!this.mediationRuleInfo.iapMin || !this.mediationRuleInfo.iapMax) {
        callback()
      } else {
        const min = Number(this.mediationRuleInfo.iapMin)
        const max = Number(this.mediationRuleInfo.iapMax)
        if (max < min) {
          callback(new Error('illegal range.'))
        } else {
          callback()
        }
      }
    }
    const validateAge = (rule, value, callback) => {
      if (!this.mediationRuleInfo.ageMin || !this.mediationRuleInfo.ageMax) {
        callback()
      } else {
        const min = Number(this.mediationRuleInfo.ageMin)
        const max = Number(this.mediationRuleInfo.ageMax)
        if (max < min) {
          callback(new Error('illegal range.'))
        } else {
          callback()
        }
      }
    }
    if (!this.$auth('mediation.edit')) {
      columnsHB.pop()
    }
    return {
      loading: false,
      visible: false,
      deviceBrandData: [],
      deviceModelData: [],
      lastFetchId: 0,
      fetching: false,
      value: [],
      iap: [],
      age: [],
      mediationRuleInfo: {
        name: '',
        autoOpt: 0,
        regions: [],
        channelBow: 0,
        channel: [],
        frequency: 0,
        iapMin: undefined,
        iapMax: undefined,
        modelList: [],
        modelType: 'include',
        brandType: 'include',
        brandList: [],
        ageMax: undefined,
        ageMin: undefined,
        conType: [],
        deviceModelType: [],
        hourBefore: 24,
        gender: []
      },
      rules: {
        name: [
          { required: true, whitespace: true, message: this.$msg('mediation.name_empty'), trigger: 'change' }
        ],
        regions: [
          { required: true, message: this.$msg('mediation.regions_empty'), trigger: 'change' }
        ],
        iap: [
          { validator: validateIap, trigger: 'change' }
        ],
        age: [
          { validator: validateAge, trigger: 'change' }
        ]
      },
      params: {},
      type,
      canEdit: this.$auth('mediation.edit') && type !== 'Details',
      countries: [],
      spinning: true,
      adnIds: [],
      instanceIds: [],
      appId: this.$route.params.pubAppId,
      placementId: this.$route.params.placementId,
      ruleId: this.$route.params.ruleId,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      deviceData: [],
      regions: [],
      count: -100,
      segmentId: null,
      gender: [],
      currentId: null,
      columnsHB,
      fetchingHB: false,
      instances: [],
      hourBefore: 24,
      instancesOld: [],
      headerbidding: [],
      headerbiddingOld: [],
      templist: [],
      filter: false,
      oldData: {},
      changeInstance: false
    }
  },
  mounted () {
    if (this.ruleId) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      segmentGet(params).then(res => {
        if (res.code === 0) {
          this.segmentId = res.data.segmentId
          if (res.data.countries && res.data.countries.indexOf('00') > -1) {
            res.data.countries.splice(res.data.countries.indexOf('00'), 1)
            res.data.countries.push('ALL')
            this.regions = res.data.countries
          } else {
            this.regions = res.data.countries
          }
          res.data.regions = res.data.countries
          if (res.data.channel) {
            res.data.channel = res.data.channel.split(',')
          } else {
            res.data.channel = []
          }
          this.countries = res.data.countries || null
          if (res.data.conType) {
            const carr = []
            const ct = res.data.conType
            for (let i = 0; i < 4; ++i) {
              if ((ct & (1 << i)) === (1 << i)) carr.push(i)
            }
            res.data.conType = carr
          } else {
            res.data.conType = []
          }
          if (res.data.gender) {
            const gender = []
            const gd = res.data.gender
            for (let z = 0; z < 3; ++z) {
              if ((gd & (1 << z)) === (1 << z)) gender.push(z)
            }
            res.data.gender = gender
          } else {
            res.data.gender = []
          }
          if (res.data.deviceModelType) {
            const modelType = []
            const mt = res.data.deviceModelType
            for (let x = 0; x < 3; ++x) {
              if ((mt & (1 << x)) === (1 << x)) modelType.push(x)
            }
            res.data.deviceModelType = modelType
          } else {
            res.data.deviceModelType = []
          }
          if (this.type === 'Duplicate') {
            res.data.name = ''
          }
          this.mediationRuleInfo = Object.assign(this.mediationRuleInfo, res.data)
          this.oldData = JSON.parse(JSON.stringify(this.mediationRuleInfo))
          this.spinning = false
        }
      }).finally(() => {
        this.spinning = false
      })
    }
    this.search()
  },
  methods: {
    adnChange (val) {
      this.adnIds = val
      this.instanceIds = []
    },
    hourChange (val) {
      this.hourBefore = val
    },
    frontSort (ids, rowDataId) {
      this.fetching = true
      const j = this.instances.filter(row => {
        return ids.includes(row.placementRuleInstanceId)
      })
      const x = this.instances.filter(row => {
        return !ids.includes(row.placementRuleInstanceId)
      })
      const d = []
      for (let i = 0; i < ids.length; i++) {
        const item = j.find(o => {
          return o.placementRuleInstanceId === ids[i]
        })
        item.priority = i + 1
        d.push(item)
      }
      this.instances = d.concat(x)
      if (rowDataId) {
        const target = this.instances.find(item => item.id === rowDataId)
        if (target) {
          const scroll = (target.priority - 1) * 64
          if (this.headerbidding.length > 0) {
            this.$vnode.elm.querySelectorAll('.ant-table-body')[1].scrollTop = scroll
          } else {
            this.$vnode.elm.querySelectorAll('.ant-table-body')[0].scrollTop = scroll
          }
        }
      }
      this.fetching = false
    },
    sortInstance (list) {
      const params = []
      for (const item of list) {
        params.push(item.placementRuleInstanceId)
      }
      this.frontSort(params)
    },
    onCellChange (record, dataIndex, value) {
      if (record.priority === value) {
        return
      }
      const params = []
      let hasAdded = false
      for (const item of this.instances) {
        if (!item.placementRuleInstanceId || item.id === record.id) {
          continue
        }
        if (item.priority === value) {
          hasAdded = true
          params.push(record.placementRuleInstanceId)
        }
        if (item.priority) {
          params.push(item.placementRuleInstanceId)
        }
      }
      if (!hasAdded) {
        params.push(record.placementRuleInstanceId)
      }
      this.frontSort(params, record.id)
    },
    search (type) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      const formSearch = { instanceId: this.instanceIds, adnId: this.adnIds, hourBefore: this.hourBefore }
      this.fetching = true
      if (formSearch.instanceId) {
        params.instanceId = formSearch.instanceId
      }
      if (formSearch.adnId) {
        params.adNetworkIds = formSearch.adnId.join(',')
      }
      if (formSearch.hourBefore) {
        params.hourBefore = formSearch.hourBefore
      }
      this.filter = !!(params.instanceId > 0 || params.adNetworkIds)
      if (!type) {
        mediationRuleInstanceList(params).then(res => {
          if (!res.code) {
            const ins = []
            const hb = []
            res.data.forEach(row => {
              row.fillRate = row.instanceFilledLatest > 0 ? row.instanceFilledLatest / row.instanceRequestLatest : 0
              row.fillRate2 = row.instanceFilledSecondLatest > 0 ? row.instanceFilledSecondLatest / row.instanceRequestSecondLatest : 0
              row.ecpm = row.costLatest > 0 ? row.costLatest * 1000 / row.apiImprLatest : 0
              row.ecpm2 = row.costSecondLatest > 0 ? row.costSecondLatest * 1000 / row.apiImprSecondLatest : 0
              if (row.instanceRequestSecondLatest > 0) {
                row.reqGrowth = numerify(row.instanceRequestLatest / (row.instanceRequestSecondLatest || 1) - 1, '0,0.00a%')
              } else {
                row.reqGrowth = '--'
              }
              if (row.fillRate2 > 0) {
                row.fillGrowth = numerify(row.fillRate / (row.fillRate2 || 1) - 1, '0,0.00a%')
              } else {
                row.fillGrowth = '--'
              }
              if (row.ecpm2 > 0) {
                row.ecpmGrowth = numerify(row.ecpm / (row.ecpm2 || 1) - 1, '0,0.00a%')
              } else {
                row.ecpmGrowth = '--'
              }
              if (row.hbStatus) {
                if (!row.priority) {
                  row.priority = 0
                }
                hb.push(row)
              } else {
                if (row.placementRuleInstanceId > 0) {
                } else {
                  row.placementRuleInstanceId = this.count
                  this.count--
                }
                ins.push(row)
              }
            })
            this.instances = ins
            this.templist = JSON.parse(JSON.stringify(ins))
            this.headerbidding = hb
          }
        }).finally(() => {
          this.fetching = false
          this.spinning = false
        })
      } else {
        // 本地查询
        this.templist = JSON.parse(JSON.stringify(this.instances))
        if (params.instanceId > 0 || formSearch.adnId.length) {
          this.templist = this.templist.filter(row => {
            return !((params.instanceId > 0 && row.id !== params.instanceId) || (formSearch.adnId && formSearch.adnId.length > 0 && !formSearch.adnId.includes(row.adnId)))
          })
        }
        const ps = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
        ps.hourBefore = this.mediationRuleInfo.hourBefore
        mediationRuleInstanceList(ps).then(res => {
          if (!res.code) {
            const ins = []
            res.data.forEach(row => {
              const newItem = {}
              newItem.id = row.id
              newItem.instanceFilledLatest = row.instanceFilledLatest
              newItem.instanceRequestLatest = row.instanceRequestLatest
              newItem.instanceFilledSecondLatest = row.instanceFilledSecondLatest
              newItem.instanceRequestSecondLatest = row.instanceRequestSecondLatest
              newItem.costLatest = row.costLatest
              newItem.apiImprLatest = row.apiImprLatest
              newItem.costSecondLatest = row.costSecondLatest
              newItem.apiImprSecondLatest = row.apiImprSecondLatest
              newItem.fillRate = row.instanceFilledLatest > 0 ? row.instanceFilledLatest / row.instanceRequestLatest : 0
              newItem.fillRate2 = row.instanceFilledSecondLatest > 0 ? row.instanceFilledSecondLatest / row.instanceRequestSecondLatest : 0
              newItem.ecpm = row.costLatest > 0 ? row.costLatest * 1000 / row.apiImprLatest : 0
              newItem.ecpm2 = row.costSecondLatest > 0 ? row.costSecondLatest * 1000 / row.apiImprSecondLatest : 0
              if (newItem.instanceRequestSecondLatest > 0) {
                newItem.reqGrowth = numerify(newItem.instanceRequestLatest / (newItem.instanceRequestSecondLatest || 1) - 1, '0,0.00a%')
              } else {
                newItem.reqGrowth = '--'
              }
              if (newItem.fillRate2 > 0) {
                newItem.fillGrowth = numerify(newItem.fillRate / (newItem.fillRate2 || 1) - 1, '0,0.00a%')
              } else {
                newItem.fillGrowth = '--'
              }
              if (newItem.ecpm2 > 0) {
                newItem.ecpmGrowth = numerify(newItem.ecpm / (newItem.ecpm2 || 1) - 1, '0,0.00a%')
              } else {
                newItem.ecpmGrowth = '--'
              }
              ins.push(newItem)
            })

            this.instances.forEach(d => {
              d = Object.assign(d, ins.find(item => {
                return item.id === d.id
              }))
            })
            this.templist.forEach(d => {
              d = Object.assign(d, ins.find(item => {
                return item.id === d.id
              }))
            })
          }
        }).finally(() => {
          this.fetching = false
          this.spinning = false
        })
      }
    },
    segmentSave () {
      this.loading = true
      let params = { pubAppId: this.appId, placementId: this.placementId }
      const that = this
      let tag = true
      this.$refs.ruleForm.validate((b) => {
        if (!b) {
          tag = false
        }
      })
      if (!tag) {
        this.loading = false
        return false
      }
      const values = Object.assign({}, this.mediationRuleInfo)
      values.pubAppId = this.appId
      values.placementId = this.placementId
      values.id = that.placementId
      let ct = 0
      for (const i in values.conType) {
        ct |= (1 << values.conType[i])
      }
      if (values.channel && values.channel.length) {
        values.channel = values.channel.join(',')
        if (values.channel.length > 1000) {
          this.$message.error(this.$msg('mediation.channel_too_long'))
          return false
        }
      } else {
        values.channel = ''
      }
      values.conType = ct
      let mt = 0
      for (const i in values.deviceModelType) {
        mt |= (1 << values.deviceModelType[i])
      }
      values.deviceModelType = mt
      let gd = 0
      for (const i in values.gender) {
        gd |= (1 << values.gender[i])
      }
      values.gender = gd
      values.brandWhitelist = values.brandType === 'include' && values.brandList ? values.brandList.join('\n') : ''
      values.brandBlacklist = values.brandType === 'exclude' && values.brandList ? values.brandList.join('\n') : ''
      values.modelWhitelist = values.modelType === 'include' && values.modelList ? values.modelList.join('\n') : ''
      values.modelBlacklist = values.modelType === 'exclude' && values.modelList ? values.modelList.join('\n') : ''
      const countries = [...values.regions]
      if (countries && countries.indexOf('ALL') > -1) {
        countries.splice(countries.indexOf('ALL'), 1)
        countries.push('00')
      }
      values.countries = countries && countries.join(',')
      params = Object.assign(params, values)
      params.instances = this.instances
      params.headerbidding = this.headerbidding
      if (this.ruleId && this.type !== 'Duplicate') {
        params.id = this.ruleId
        params.segmentId = this.segmentId
        segmentUpdateWithInstance(params).then(res => {
          if (res.code === 0) {
            this.$message.success(this.$msg('mediation.update_success'))
            this.$router.push({
              name: 'MediationList',
              query: {
                type: '2'
              }
            })
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        params.id = -100
        segmentUpdateWithInstance(params).then(res => {
          if (res.code === 0) {
            this.ruleId = res.data.id
            this.$router.push({
              name: 'MediationList',
              query: {
                type: '2'
              }
            })
            this.$message.success(this.$msg('mediation.create_success'))
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    /**
     * 验证是否有改动，表单直接跟原始数据对比
     * Instance列表只要涉及更改状态操作就算改动过
     * @returns {boolean}
     */
    hasChange () {
      if (this.changeInstance) {
        return true
      }
      if (this.type === 'Add' || this.type === 'Duplicate') {
        return true
      }
      const temp = this.mediationRuleInfo
      const { name, autoOpt, frequency, iapMin, brandType, brandList, modelType, modelList, channel, channelBow, gender, ageMax, ageMin, conType, deviceModelType, regions } = { ...this.oldData }
      try {
        if (temp.name !== name) {
          return true
        }
        if (temp.autoOpt !== autoOpt) {
          return true
        }
        if (temp.frequency !== frequency) {
          return true
        }
        if (temp.iapMin !== iapMin) {
          return true
        }
        if (temp.brandType !== brandType) {
          return true
        }
        if (temp.brandList.join(',') !== brandList.join(',')) {
          return true
        }
        if (temp.modelType !== modelType) {
          return true
        }
        if (temp.modelList.join(',') !== modelList.join(',')) {
          return true
        }
        if (this.isNgp) {
          if (temp.channel !== channel) {
            return true
          }
          if (temp.channelBow !== channelBow) {
            return true
          }
        }
        if (temp.gender.join(',') !== gender.join(',')) {
          return true
        }
        if (temp.conType.join(',') !== conType.join(',')) {
          return true
        }
        if (temp.deviceModelType.join(',') !== deviceModelType.join(',')) {
          return true
        }
        if (temp.regions.join(',') !== regions.join(',')) {
          return true
        }
        if (temp.ageMax !== ageMax) {
          return true
        }
        if (temp.ageMin !== ageMin) {
          return true
        }
      } catch (e) {
        return true
      }
      return false
    },
    instanceHbStatusUpdate (record) {
      this.changeInstance = true
      const status = record.priority > 0 ? 0 : 1
      if (status === 1) {
        if (this.headerbidding.find(row => {
          return row.adnId === record.adnId && row.priority > 0
        })) {
          this.$message.error(this.$msg('mediation.already_existed_hb'))
          return false
        }
      }
      record.priority = status
      this.headerbidding.sort((a, b) => {
        return b.priority - a.priority
      })
    },
    instanceUpdate (record) {
      this.changeInstance = true
      const status = record.priority > 0 ? 0 : 1
      const target = this.instances.find(row => {
        return row.placementRuleInstanceId === record.placementRuleInstanceId
      })
      if (!status) {
        target.priority = 0
      } else {
        target.priority = this.instances.filter(row => row.priority > 0).length + 1
      }
      const d = [...this.instances.filter(item => item.priority > 0)]
      const params = []
      for (const o of d) {
        params.push(o.placementRuleInstanceId)
      }
      const t = this.templist.find(row => {
        return row.placementRuleInstanceId === record.placementRuleInstanceId
      })
      t.priority = target.priority
      this.frontSort(params, record.id)
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
        this.deviceBrandData = Object.keys(res.data).map(key => ({
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
        this.deviceModelData = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))
        this.fetching = false
      })
    }
  }
}
</script>

<style type="less" scoped>
  .water-fall > > > .ant-card-head-wrapper {
    margin-left: -8px;
  }
</style>
