<!-- MediationEdit page router '/mediation/mediation/add' -->
<template>
  <div class="water-fall">
    <a v-if="canEdit" @click="segmentSave" style="position: absolute;right: 50px;top: 80px;"><img width="24px" src="/icon/save.svg" /></a>
    <page-header-placement />
    <a-form :form="form" :hideRequiredMark="true" >
      <MediationEditForm
        :form="form"
        :regions="this.countries"
        @change="regoinsSelectedId"
        :conType="conType"
        :modelType="deviceModelType"
        :autoOpt="this.autoOpt || 1"
        @optChange="optChange"
        @selectedModelType="selectedModelType"
        @selectedContype="selectedContype" />
      <a-card class="card-noline om-card-style" :bordered="false" title="Waterfall" style="margin-top:8px;" >
        <a-row type="flex" justify="start" style="margin-bottom: 16px;">
          <om-ad-network-select size="default" style="margin-left:24px; display:inline-block; margin-right:16px;"/>
          <OmInstanceSelect modelName="instanceId" :placementId="this.placementId" />
          <a-button type="primary" style="margin-left:16px;width:100px;margin-top: 3px;" ghost @click="search">Apply</a-button>
          <a-button type="primary" style="margin-left:16px;width:100px;margin-top: 3px;" ghost @click="resetSearchForm()">Clear</a-button>
        </a-row>
        <a-spin :spinning="fetching">
          <WaterfallTable
            :autoOpt="autoOpt"
            :data="instances"
            style="margin-left:24px;margin-right:24px;margin-bottom:16px;"
            @updateStatus="instanceStatusUpdate"
            @sortEnd="sortInstance"
            @priorityUpdate="onCellChange"
          />
        </a-spin>
      </a-card>
      <div style="height:16px;"></div>
    </a-form>
  </div>

</template>

<script>
import MediationEditForm from './MediationEditForm'
import { segmentCreate, segmentUpdate, segmentGet, segmentResortPriority, mediationRuleInstanceList, mediationSegmentRuleInstanceCreate, mediationSegmentRuleInstanceDelete } from '@/api/mediation'
import AdNetwork from '@/components/Mediation/AdNetwork'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmInstanceSelect from '@/components/om/InstanceSelect'
import EditableCell from '@/components/EditableCell'
import WaterfallTable from './WaterfallTable'
import OmText from '@/components/om/Text'
import pick from 'lodash.pick'
import Save from '../../../../public/icon/save.svg'
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'

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
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      params: {},
      canEdit: this.$auth('mediation.edit') && type !== 'Details',
      name: '',
      countries: [],
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
      segmentId: null,
      conType: [],
      deviceModelType: [],
      instances: [],
      fetching: false,
      currentId: null,
      waterfallInstance: []
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
          if (res.data.deviceModelType) {
            const modelType = []
            const mt = res.data.deviceModelType
            for (var x = 0; x < 3; ++x) {
              if ((mt & (1 << x)) === (1 << x)) modelType.push(x)
            }
            this.deviceModelType = modelType
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.data, ['name', 'autoOpt', 'frequency', 'iapMin', 'iapMax', 'interest', 'brandType', 'brandList', 'modelType', 'modelList', 'channel', 'channelBow']))
          })
        }
      })
      mediationRuleInstanceList(params).then(res => {
        if (res.code === 0) {
          this.instances = res.data
        }
      })
    } else {
      const params = { pubAppId: this.appId, placementId: this.placementId }
      mediationRuleInstanceList(params).then(res => {
        if (res.code === 0) {
          this.instances = res.data
        }
      })
      this.form.setFieldsValue({ autoOpt: 1 })
    }
  },
  methods: {
    resetSearchForm () {
      this.form.resetFields(['adnId', 'instanceId'])
    },
    optChange (value) {
      this.autoOpt = value
    },
    sortInstance (placementRuleInstanceId, value) {
      segmentResortPriority({ placementRuleInstanceId: placementRuleInstanceId, priority: value }).then(res => {
        if (res.code === 0) {
          this.search('instance')
        }
      })
    },
    onCellChange (record, dataIndex, value) {
      if (record.priority === value) {
        return
      }
      segmentResortPriority({ placementRuleInstanceId: record.placementRuleInstanceId, priority: value }).then(res => {
        if (res.code === 0) {
          this.search(record.id)
        }
      })
    },
    search (rowDataId) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      const formSearch = this.form.getFieldsValue(['instanceId', 'adnId'])
      this.fetching = true
      if (formSearch.instanceId) {
        params.instanceId = formSearch.instanceId
      }
      if (formSearch.adnId) {
        params.adNetworkIds = formSearch.adnId.join(',')
      }
      const that = this
      mediationRuleInstanceList(params).then(res => {
        if (res.code === 0) {
          that.fetching = false
          that.instances = res.data
          if (rowDataId) {
            const target = that.instances.find(item => item.id === rowDataId)
            if (target) {
              const scroll = (target.priority - 1) * 64
              that.$vnode.elm.querySelectorAll('.ant-table-body')[0].scrollTop = scroll
            }
          }
        }
      })
    },
    modelTypeChange (value) {
      this.deviceModelType = value
    },
    brandTypeChange (value) {
      this.brandType = value
    },
    segmentSave () {
      const { form: { validateFields } } = this
      let params = { pubAppId: this.appId, placementId: this.placementId }
      const that = this
      validateFields((err, values) => {
        if (!err) {
          if (values.channel && values.channel.length) {
            values.channel = values.channel.join(',')
            if (values.channel.length > 1000) {
              this.$message.error('Data too long for Channel, Please control at 1000 characters')
              return false
            }
          } else {
            values.channel = ''
          }
          values.id = that.placementId
          let ct = 0
          for (const i in that.conType) { ct |= (1 << that.conType[i]) }
          values.conType = ct
          let mt = 0
          for (const i in that.deviceModelType) { mt |= (1 << that.deviceModelType[i]) }
          values.deviceModelType = mt
          values.brandWhitelist = values.brandType === 'include' && values.brandList ? values.brandList.join('\n') : ''
          values.brandBlacklist = values.brandType === 'exclude' && values.brandList ? values.brandList.join('\n') : ''
          values.modelWhitelist = values.modelType === 'include' && values.modelList ? values.modelList.join('\n') : ''
          values.modelBlacklist = values.modelType === 'exclude' && values.modelList ? values.modelList.join('\n') : ''
          if (!that.regions || that.regions.length === 0) {
            that.form.setFields({ 'regions': { value: null, errors: 'Regions can not be empty.' } })
            that.$message.error('Regions can not be empty.')
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
          if (this.ruleId) {
            params.id = this.ruleId
            params.segmentId = this.segmentId
            segmentUpdate(params).then(res => {
              if (res.code === 0) {
                this.$message.success(`success`)
                this.$router.push({
                  name: 'MediationList'
                })
              } else {
                this.$message.error(`error`)
              }
            })
          } else {
            segmentCreate(params).then(res => {
              if (res.code === 0) {
                this.ruleId = res.data.id
                this.$router.push({
                  name: 'MediationList'
                })
                this.$message.success(`success`)
              } else {
                this.$message.error(`error`)
              }
            })
          }
        } else {
          console.log(err)
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
    instanceStatusUpdate (record, ref) {
      if (!this.ruleId) {
        const { form: { validateFields } } = this
        let params = { pubAppId: this.appId, placementId: this.placementId }
        const that = this
        validateFields((err, values) => {
          if (!err) {
            if (values.channel && values.channel.length) {
              values.channel = values.channel.join(',')
              if (values.channel.length > 1000) {
                this.$message.error('Data too long for Channel, Please control at 1000 characters')
                return false
              }
            } else {
              values.channel = ''
            }
            values.id = that.placementId
            let ct = 0
            for (const i in that.conType) { ct |= (1 << that.conType[i]) }
            values.conType = ct
            let mt = 0
            for (const i in that.deviceModelType) { mt |= (1 << that.deviceModelType[i]) }
            values.deviceModelType = mt
            values.brandWhitelist = values.brandType === 'include' && values.brandList ? values.brandList.join('\n') : ''
            values.brandBlacklist = values.brandType === 'exclude' && values.brandList ? values.brandList.join('\n') : ''
            values.modelWhitelist = values.modelType === 'include' && values.modelList ? values.modelList.join('\n') : ''
            values.modelBlacklist = values.modelType === 'exclude' && values.modelList ? values.modelList.join('\n') : ''
            if (!that.regions || that.regions.length === 0) {
              that.form.setFields({ 'regions': { value: null, errors: 'Regions can not be empty.' } })
              that.$message.error('Regions can not be empty.')
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
            segmentCreate(params).then(res => {
              if (res.code === 0) {
                this.ruleId = res.data.id
                this.segmentId = res.data.segmentId
                this.instanceUpdate(record)
              }
            })
          } else {
            document.documentElement.scrollTop = 0
          }
        })
      } else {
        this.instanceUpdate(record)
      }
    },
    instanceUpdate (record) {
      const status = record.priority > 0 ? 0 : 1
      if (status === 1) {
        mediationSegmentRuleInstanceCreate({ ruleId: this.ruleId, adnId: record.adnId, instanceId: record.id }).then(res => {
          if (res.code === 0) {
            this.search(res.data.id)
          }
        })
      } else {
        mediationSegmentRuleInstanceDelete({ ruleId: this.ruleId, instanceId: record.id }).then(res => {
          if (res.code === 0) {
            record.priority = undefined
            this.search()
          }
        })
      }
    }
  }
}
</script>

<style type="less" scoped>
.water-fall >>> .ant-card-head-wrapper {
  margin-left: -8px;
}
</style>
