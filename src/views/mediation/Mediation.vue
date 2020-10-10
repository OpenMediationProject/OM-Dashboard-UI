<!-- Mediation list page router '/mediation/mediation/list' -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <PlacementSelect v-show="searchPlacement" style="margin-left:8px;"/>
    <a-card :bordered="false" style="padding-top:12px;">
      <a-tabs class="mytabs" :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '8px', marginTop: '-12px'}" :active-key="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
        <span slot="tabBarExtraContent">
        </span>
        <a-tab-pane tab="Instances" key="1" ref="instancesTab" style="margin-top: 8px;">
          <instance-edit @tab2="activeKey = '2'" />
        </a-tab-pane>
        <a-tab-pane tab="Waterfall" key="2" style="margin-top: 8px;">
          <div v-if="!searchPlacement" class="table-page-search-wrapper">
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
          <div v-else>
            <a-row type="flex" justify="start" style="height: 44px;">
              <a-form-item>
                <RegionsSelect @change="regoinsSelectedId" size="default" style="margin-top:2px;width:260px;" />
              </a-form-item>
              <a-form-item>
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">Apply</a-button>
                </span>
              </a-form-item>
              <a-form-item style="position:absolute; right:0px;">
                <span class="table-page-search-submitButtons" >
                  <a v-if="!abt" @click="settings" style="margin-right: 32px;"><img src="/icon/Setting.svg" style="margin-top:-2px;margin-right: 8px;" />Settings</a>
                  <a-button type="primary" v-action:edit v-if="!abt" ghost @click="handleEdit()">Add Mediation Rule</a-button>
                </span>
              </a-form-item>
            </a-row>
            <a-spin :spinning="fetching">
              <div style="background:#FFFFFF;margin-bottom: 16px;">
                <a-table
                  class="ant-card-table-default"
                  ref="table"
                  rowKey="id"
                  :dataSource="list"
                  :expandedRowKeys="curExpandedRowKeys"
                  :columns="columns"
                  :expandIconAsCell="false"
                  :expandIconColumnIndex="-1"
                  :pagination="false"
                  @change="tableChange"
                >
                  <span slot="name" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      <om-text :length="40" :tooltip="true" :text="text"/><img style="margin-left:8px;" v-if="record.abTestModel===1" src="/icon/testb.svg" />
                    </span>
                  </span>
                  <span slot="countries" slot-scope="text">
                    <a-tooltip>
                      <span slot="title">
                        <span v-if="text[0]!=='ALL'">{{ text.length }} Regions <br></span>
                        {{ text.join(',') }}
                      </span>
                      <div style="display: inline-block;" v-for="(o, index) in text" :key="o">
                        <a-tag v-if="index<2">{{ o }}</a-tag>
                      </div>
                      <span v-if="text.length>2">...</span>
                    </a-tooltip>
                  </span>
                  <span slot="autoOpt" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      {{ text === 0? 'Manual':'Auto' }}
                    </span>
                  </span>
                  <span slot="ruleInstanceSize" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      <a @click="handleOpen(record)">{{ text }}</a>
                    </span>
                  </span>
                  <span slot="priority" slot-scope="text, record">
                    <span :style="record.status > 0 ? null: 'opacity: 0.3;' ">
                      <editable-cell v-if="record.status > 0 && canEdit && !abt" :text="record.priority || '--'" @change="onCellChange(record, 'priority', $event)" />
                      <span v-else-if="record.status>0">{{ text }}</span>
                      <span v-else>{{ '--' }}</span>
                    </span>
                  </span>
                  <span slot="status" slot-scope="text, record">
                    <template>
                      <div v-if="canEdit && !abt">
                        <a herf="#" @click="handleEdit(record)">Edit</a>
                        <a-divider type="vertical" />
                        <a herf="#" @click="handleCopy(record)">Duplicate</a>
                        <a-divider type="vertical" />
                        <a herf="#" @click="segmentStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                        <a-divider v-if="record.name!=='ALL'" type="vertical" />
                        <a-popconfirm v-if="record.name!=='ALL'" okText="Yes" cancelText="No" @confirm="segmentDelete(record)">
                          <span slot="title">{{ $msg('mediation.remove_confirm') }}<br />
                            {{ $msg('mediation.remove_confirm_ext') }}
                          </span>
                          <a herf="#">Remove</a>
                        </a-popconfirm>
                        <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                        <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                      </div>
                      <div v-else>
                        <a herf="#" @click="viewMediation(record)">Details</a>
                        <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                        <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                      </div>
                    </template>
                  </span>
                  <a-table
                    :ref="index+'table'"
                    slot="expandedRowRender"
                    slot-scope="record, index"
                    rowKey="id"
                    :columns="record.autoOpt===1 ? innerColumnsHidePri:innerColumns"
                    :dataSource="record.ruleInstances"
                    :pagination="false"
                  >
                    <span slot="id" slot-scope="text, srecord">
                      <span :style="srecord.priority >=0 ? null: 'opacity: 0.3;' ">
                        {{ text }}
                      </span>
                    </span>
                    <span slot="className" slot-scope="text, srecord">
                      <ad-network
                        :className="text"
                        :id="srecord.adnId"
                        :status="srecord.priority >=0 ? 1: 0"
                      />
                    </span>
                    <span slot="instanceName" slot-scope="text, srecord">
                      <span :style="srecord.priority >=0 ? null: 'opacity: 0.3;' ">
                        {{ text }}
                      </span>
                    </span>
                    <span slot="operation" slot-scope="text, srecord">
                      <template>
                        <div>
                          <a herf="#" v-if="canEdit && !abt" @click="instanceStatusUpdate(srecord)">{{ srecord.priority >= 0 ?'Disable' : 'Enable' }}</a>
                        </div>
                      </template>
                    </span>
                  </a-table>
                </a-table>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-form>
</template>

<script>
import { segmentRuleUpdate, segmentRuleDelete, segmentList, rulePriorityUpdate, mediationRuleInstanceUpdate, mediationSegmentRuleInstanceCreate, mediationSegmentRuleInstanceDelete } from '@/api/mediation'
import RegionsSelect from '@/components/om/RegionsSelect'
import PlacementSelect from './modules/PlcSelect'
import { placementList } from '@/api/publisher'
import AdNetwork from '@/components/Mediation/AdNetwork'
import OmForm from '@/components/OmForm'
import EditableCell from '@/components/EditableCell'
import OmText from '@/components/om/Text'

import { mapState } from 'vuex'
import InstanceEdit from '@/views/publisher/modules/InstanceEdit'

export default {
  name: 'Mediation',
  components: {
    RegionsSelect,
    PlacementSelect,
    OmForm,
    AdNetwork,
    OmText,
    EditableCell,
    InstanceEdit
  },
  data () {
    return {
      activeKey: this.$route.query.type || '1',
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      form: this.$form.createForm(this),
      searchOption: {},
      adNetworkName: this.$route.params.name,
      adTypes: this.$route.params.adTypes,
      canEdit: this.$auth('mediation.edit'),
      abt: 0,
      curExpandedRowKeys: [],
      scroll: 200,
      currentExpandedStatOpen: false,
      id: this.$route.params.id,
      placementSelectOption: [],
      instanceSelectOption: [],
      placementType: null,
      data: [],
      list: [],
      regions: [],
      fetching: false,
      sortOrder: '',
      visible: true,
      columns: [
        {
          title: 'Mediation Rule',
          dataIndex: 'name',
          width: '25%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Regions',
          dataIndex: 'countries',
          width: '15%',
          scopedSlots: { customRender: 'countries' }
        },
        {
          title: 'Optimized Type',
          dataIndex: 'autoOpt',
          width: '14%',
          scopedSlots: { customRender: 'autoOpt' }
        },
        {
          title: 'Priority',
          dataIndex: 'priority',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'priority' }
        },
        {
          title: 'Instances',
          dataIndex: 'ruleInstanceSize',
          align: 'center',
          width: '11%',
          scopedSlots: { customRender: 'ruleInstanceSize' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      innerColumns: [
        { title: '', dataIndex: '', width: '10%' },
        { title: 'Ad Network', dataIndex: 'className', width: '25%', key: 'className', scopedSlots: { customRender: 'className' } },
        { title: 'Instance', dataIndex: 'instanceName', width: '15%', key: 'instanceName', scopedSlots: { customRender: 'instanceName' } },
        { title: 'Priority', dataIndex: 'priority', align: 'center', width: '20%', key: 'priority', scopedSlots: { customRender: 'priority' } },
        {
          title: 'Operations',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      innerColumnsHidePri: [
        { title: '', dataIndex: '', width: '10%' },
        { title: 'Ad Network', dataIndex: 'className', width: '30%', key: 'className', scopedSlots: { customRender: 'className' } },
        { title: 'Instance', dataIndex: 'instanceName', width: '30%', key: 'instanceName', scopedSlots: { customRender: 'instanceName' } },
        {
          title: 'Operations',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    searchPlacement: state => state.publisher.searchPlacement,
    searchPlacementAbt: state => state.publisher.searchPlacementAbt
  }),
  watch: {
    searchPlacement (curVal) {
      this.listSearch()
    },
    searchPlacementAbt (curVal) {
      this.abt = curVal
    },
    data (val) {
      this.list = []
      this.$nextTick(() => {
        this.list = val
      })
    }
  },
  created () {
    this.scroll = window.innerHeight - 320
    this.listSearch()
    if (this.searchApp) {
      placementList({ pubAppId: this.searchApp }).then(res => {
        if (res.code === 0) {
          this.placementSelectOption = res.data
          this.instanceSelectOption = res.data
        }
      })
    }
  },
  methods: {
    tabChange (val) {
      if (val === '2') {
        this.listSearch()
      }
      this.activeKey = val
    },
    onCellChange (record, dataIndex, value) {
      if (record.priority === value) {
        return
      }
      rulePriorityUpdate({ ruleId: record.id, priority: value }).then(res => {
        if (res.code === 0) {
          this.listSearch()
        }
      })
    },
    tableChange (pagination, filters, sorter) {
      this.sortOrder = sorter.order
    },
    instanceStatusUpdate (record) {
      const status = record.priority > 0 ? 0 : 1
      if (status === 1) {
        mediationSegmentRuleInstanceCreate({ ruleId: record.ruleId, adnId: record.adnId, instanceId: record.instanceId }).then(res => {
          if (res.code === 0) {
            this.listSearch()
          }
        })
      } else {
        mediationSegmentRuleInstanceDelete({ ruleId: record.ruleId, instanceId: record.instanceId }).then(res => {
          if (res.code === 0) {
            record.priority = undefined
            this.listSearch()
          }
        })
      }
    },
    settings () {
      this.$router.push({
        name: 'MediationSettings'
      })
    },
    handleCopy (record) {
      this.$router.push({
        name: 'MediationEdit',
        params: {
          ruleId: record.id,
          pubAppId: this.searchApp,
          placementId: this.searchPlacement
        },
        query: {
          type: 'Duplicate'
        }
      })
    },
    handleEdit (record) {
      if (record) {
        this.$router.push({
          name: 'MediationEdit',
          params: {
            ruleId: record.id,
            pubAppId: this.searchApp,
            placementId: this.searchPlacement
          },
          query: {
            type: 'Edit'
          }
        })
      } else {
        this.$router.push({
          name: 'MediationEdit',
          params: {
            pubAppId: this.searchApp,
            placementId: this.searchPlacement
          },
          query: {
            type: 'Add'
          }
        })
      }
    },
    segmentDelete (record) {
      segmentRuleDelete({ ruleId: record.id }).then(res => {
        if (res.code === 0) {
          this.listSearch()
        }
      })
    },
    viewMediation (record) {
      if (record) {
        this.$router.push({
          name: 'MediationDetails',
          params: {
            ruleId: record.id,
            pubAppId: this.searchApp,
            placementId: this.searchPlacement
          },
          query: {
            type: 'Details'
          }
        })
      }
    },
    regoinsSelectedId (val) {
      this.regions = val
    },
    handleOpen (record) {
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
    handelMediationRuleInstanceUpdate (record) {
      mediationRuleInstanceUpdate({ status: record.status === 0 ? 1 : 0, id: record.id })
        .then(res => {
          if (res.code === 0) {
            Object.assign(record, { status: record.status === 0 ? 1 : 0 })
            this.$message.success(this.$msg('mediation.update_success'))
          }
        })
    },
    listSearch () {
      this.fetching = true
      if (!this.searchPlacement || this.searchPlacement === 'undefined') {
        this.fetching = false
        return false
      }
      const params = { pubAppId: this.searchApp, placementId: this.searchPlacement, abTestModel: 0 }
      const countries = [ ...this.regions ]
      if (countries && Object.keys(countries).length > 0) {
        params.countries = countries.join(',')
      }
      if (countries && Object.keys(countries).length > 0) {
        if (countries && countries.indexOf('ALL') > -1) {
          countries.splice(countries.indexOf('ALL'), 1)
          countries.push('00')
        }
        params.countries = countries.join(',')
      }
      segmentList(params)
        .then(res => {
          if (res.code === 0) {
            this.arraySort(res.data)
            this.abt = this.searchPlacementAbt
            res.data.forEach(item => {
              item.ruleInstances = item.ruleInstances.filter(d => d.priority > 0).sort((a, b) => a.priority - b.priority)
              if (item.countries && item.countries.length) {
                if (item.countries.indexOf('00') > -1) {
                  item.countries.splice(item.countries.indexOf('00'), 1)
                  item.countries.push('ALL')
                }
              }
            })
            this.data = res.data
            this.currentExpandedStatOpen = false
            this.curExpandedRowKeys = []
          }
        }).finally(() => {
          this.fetching = false
        })
    },
    segmentStatusUpdate (record) {
      const status = record.status === 1 ? 0 : 1
      segmentRuleUpdate({ id: record.id, status: status, pubAppId: this.searchApp, placementId: this.searchPlacement }).then(res => {
        if (res.code === 0) {
          record.status = status
          this.listSearch()
          this.$message.success(this.$msg('mediation.update_success'))
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
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return a.priority - b.priority
        } else {
          return b.status - a.status
        }
      })
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
.ant-table-wrapper {
  padding: 16px;
}
.ant-card {
  background-color: #F7F7F7
}
.mytabs >>> .ant-tabs-nav-container {
  font-size: 18px;
  color: #333333;
}
.ant-table-wrapper {
  padding: 0px;
}
.ant-card-body {
  padding: 0;
}
.water-fall >>> .ant-card-head-wrapper {
  margin-left: -8px;
}
.button-div {
  text-align: center;
  bottom: 0;
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100px;
}
.ant-alert-info {
  background-color: white;
  border:none;
}
</style>
