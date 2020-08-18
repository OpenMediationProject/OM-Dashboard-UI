<!-- MediationEdit page router '/mediation/mediation/add' -->
<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="water-fall">
      <a v-if="canEdit" @click="segmentSave" style="position: absolute;right: 44px;top: -44px;"><img width="24px" src="/icon/save.svg" /></a>
      <page-header-placement />
      <a-form :form="form" :hideRequiredMark="true" >
        <MediationEditForm
          :form="form"
          :regions="this.countries"
          @change="regoinsSelectedId"
          :conType="conType"
          :gender="gender"
          :modelType="deviceModelType"
          :autoOpt="this.autoOpt || 1"
          @optChange="optChange"
          @selectedModelType="selectedModelType"
          @selectedGender="selectedGender"
          @selectedContype="selectedContype" />
        <a-card v-show="headerbidding.length" class="card-noline om-card-style" title="In-app Bidding" :bordered="false" style="margin-top:8px;" >
          <a-spin :spinning="fetchingHB">
            <a-table
              style="margin-top: 8px;margin-left: 24px;margin-right: 24px;margin-bottom: 24px;"
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
                  <a herf="#" @click="instanceHbStatusUpdate(record, 'hb')">{{ record.priority >0 ? 'Disable' : 'Enable' }}</a>
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
                  :id="record.id"
                  :status="record.priority>0 ? 1: 0"
                />
              </span>
            </a-table>
          </a-spin>
        </a-card>
        <a-card class="card-noline om-card-style" :bordered="false" title="Waterfall" style="margin-top:8px;" >
          <a-row type="flex" justify="start" style="height: 44px;">
            <om-ad-network-select :pubAppId="this.appId" @change="adnChange" size="default" style="margin-left:24px; display:inline-block; margin-right:8px;"/>
            <OmInstanceSelect :adnIds="adnIds" :hb="true" :allowClear="true" modelName="instanceId" :placementId="this.placementId" />
            <a-form-item>
              <a-select style="width:200px;margin-left: 8px;" @change="hourChange" v-decorator="['hourBefore', {initialValue: 24}]" :allowClear="false" >
                <span slot="suffixIcon"><img src="/icon/Clock.svg"></span>
                <a-select-option v-for="time in [{value: 12, title:'In 12 hours'},{value: 24, title:'In 24 hours'},{value:48, title:'In 48 hours'}]" :key="time.value" :title="time.title">
                  {{ time.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" style="margin-left:8px;width:100px;margin-top: 3px;" ghost @click="search(true)">Apply</a-button>
          </a-row>
          <a-spin :spinning="fetching">
            <WaterfallTable
              ref="waterfallTable"
              :autoOpt="autoOpt"
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
      </a-form>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>
import MediationEditForm from './MediationEditForm'
import { segmentGet, mediationRuleInstanceList, segmentUpdateWithInstance } from '@/api/mediation'
import AdNetwork from '@/components/Mediation/AdNetwork'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmInstanceSelect from '@/components/om/InstanceSelect'
import EditableCell from '@/components/EditableCell'
import WaterfallTable from './WaterfallTable'
import OmText from '@/components/om/Text'
import pick from 'lodash.pick'
import Save from '../../../../public/icon/save.svg'
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'
import numerify from 'numerify'

export default {
  name: 'MediationEdit',
  components: {
    WaterfallTable,
    OmAdNetworkSelect,
    MediationEditForm,
    AdNetwork,
    OmInstanceSelect,
    EditableCell,
    OmText,
    Save,
    PageHeaderPlacement
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
    if (!this.$auth('mediation.edit')) {
      columnsHB.pop()
    }
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      params: {},
      type,
      canEdit: this.$auth('mediation.edit') && type !== 'Details',
      name: '',
      countries: [],
      spinning: true,
      adnIds: [],
      placementId: this.$route.params.placementId,
      appId: this.$route.params.pubAppId,
      ruleId: this.$route.params.ruleId,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      deviceData: [],
      autoOpt: null,
      lastFetchId: 0,
      regions: this.countries,
      value: [],
      count: -100,
      segmentId: null,
      conType: [],
      deviceModelType: [],
      gender: [],
      fetching: false,
      currentId: null,
      columnsHB,
      fetchingHB: false,
      instances: [],
      hourBefore: 24,
      instancesOld: [],
      headerbidding: [],
      headerbiddingOld: [],
      templist: [],
      filter: false
    }
  },
  mounted () {
    if (this.ruleId) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      segmentGet(params).then(res => {
        if (res.code === 0) {
          this.segmentId = res.data.segmentId
          this.autoOpt = res.data.autoOpt
          if (res.data.countries) {
            if (res.data.countries && res.data.countries.indexOf('00') > -1) {
              res.data.countries.splice(res.data.countries.indexOf('00'), 1)
              res.data.countries.push('ALL')
              this.regions = res.data.countries
            } else {
              this.regions = res.data.countries
            }
          }
          if (res.data.channel) {
            res.data.channel = res.data.channel.split(',')
          } else {
            res.data.channel = []
          }
          this.countries = res.data.countries || null
          if (!res.data.interest || res.data.interest.length === 0) {
            res.data.interest = []
          }
          if (res.data.conType) {
            const carr = []
            const ct = res.data.conType
            for (var i = 0; i < 4; ++i) {
              if ((ct & (1 << i)) === (1 << i)) carr.push(i)
            }
            this.conType = carr
          }
          if (res.data.gender) {
            const gender = []
            const gd = res.data.gender
            for (var z = 0; z < 3; ++z) {
              if ((gd & (1 << z)) === (1 << z)) gender.push(z)
            }
            this.gender = gender
          }
          if (res.data.deviceModelType) {
            const modelType = []
            const mt = res.data.deviceModelType
            for (var x = 0; x < 3; ++x) {
              if ((mt & (1 << x)) === (1 << x)) modelType.push(x)
            }
            this.deviceModelType = modelType
          }
          if (this.type === 'Duplicate') {
            res.data.name = ''
          }

          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.data, ['name', 'autoOpt', 'frequency', 'iapMin', 'iapMax', 'interest', 'brandType', 'brandList', 'modelType', 'modelList', 'channel', 'channelBow', 'gender', 'ageMax', 'ageMin']))
          })
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
      this.form.resetFields(['instanceId'])
    },
    hourChange (val) {
      this.hourBefore = val
    },
    resetSearchForm () {
      this.form.resetFields(['adnId', 'instanceId'])
    },
    optChange (value) {
      this.autoOpt = value
    },
    frontSort (ids, rowDataId) {
      this.fetching = true
      const j = this.instances.filter(row => { return ids.includes(row.placementRuleInstanceId) })
      const x = this.instances.filter(row => { return !ids.includes(row.placementRuleInstanceId) })
      const d = []
      for (let i = 0; i < ids.length; i++) {
        const item = j.find(o => { return o.placementRuleInstanceId === ids[i] })
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
      const formSearch = this.form.getFieldsValue(['instanceId', 'adnId', 'hourBefore'])
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
      if (params.instanceId > 0 || params.adNetworkIds) {
        this.filter = true
      } else {
        this.filter = false
      }
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
              if (row.headbidding) {
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
            if ((params.instanceId > 0 && row.id !== params.instanceId) || (formSearch.adnId && formSearch.adnId.length > 0 && !formSearch.adnId.includes(row.adnId))) {
              return false
            } else {
              return true
            }
          })
        }
        const ps = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
        const fs = this.form.getFieldsValue(['hourBefore'])
        ps.hourBefore = fs.hourBefore
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
      const { form: { validateFields } } = this
      let params = { pubAppId: this.appId, placementId: this.placementId }
      const that = this
      validateFields((err, values) => {
        if (!err) {
          values.id = that.placementId
          let ct = 0
          for (const i in that.conType) { ct |= (1 << that.conType[i]) }
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
          for (const i in that.deviceModelType) { mt |= (1 << that.deviceModelType[i]) }
          values.deviceModelType = mt
          let gd = 0
          for (const i in that.gender) { gd |= (1 << that.gender[i]) }
          values.gender = gd
          values.brandWhitelist = values.brandType === 'include' && values.brandList ? values.brandList.join('\n') : ''
          values.brandBlacklist = values.brandType === 'exclude' && values.brandList ? values.brandList.join('\n') : ''
          values.modelWhitelist = values.modelType === 'include' && values.modelList ? values.modelList.join('\n') : ''
          values.modelBlacklist = values.modelType === 'exclude' && values.modelList ? values.modelList.join('\n') : ''
          if (!that.regions || that.regions.length === 0) {
            that.$message.error(this.$msg('mediation.regions_empty'))
            return false
          }
          const countries = [ ...that.regions ]
          if (countries && countries.indexOf('ALL') > -1) {
            countries.splice(countries.indexOf('ALL'), 1)
            countries.push('00')
          }
          values.countries = countries && countries.join(',')
          values.interest = values.interest && values.interest.join(',')
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
            })
          }
        }
      })
    },
    regoinsSelectedId (value) {
      this.regions = value
    },
    selectedContype (value) {
      this.conType = value
    },
    selectedModelType (value) {
      this.deviceModelType = value
    },
    selectedGender (value) {
      this.gender = value
    },
    instanceHbStatusUpdate (record, ref) {
      const status = record.priority > 0 ? 0 : 1
      if (status === 1) {
        if (this.headerbidding.find(row => { return row.adnId === record.adnId && row.priority > 0 })) {
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
      const status = record.priority > 0 ? 0 : 1
      const target = this.instances.find(row => { return row.placementRuleInstanceId === record.placementRuleInstanceId })
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
      const t = this.templist.find(row => { return row.placementRuleInstanceId === record.placementRuleInstanceId })
      t.priority = target.priority
      this.frontSort(params, record.id)
    }
  }
}
</script>

<style type="less" scoped>
  .water-fall >>> .ant-card-head-wrapper {
    margin-left: -8px;
  }
</style>
