<!-- Mediation list page router '/mediation/mediation/list' -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <a-card :bordered="false" style="padding-top:12px;">
      <PlacementSelect />
      <a-tabs class="mytabs" :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '16px', marginTop: '-12px'}" defaultActiveKey="1" @change="callback">
        <span slot="tabBarExtraContent">
        </span>
        <a-tab-pane tab="Waterfall" key="1" style="margin-top: 8px;">
          <a-row type="flex" justify="start" style="height: 44px;">
            <a-form-item>
              <RegionsSelect @change="regoinsSelectedId" size="default" style="margin-top:2px;width:260px;" />
            </a-form-item>
            <a-form-item>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">Apply</a-button>
                <a-button type="primary" ghost @click="resetSearch">Clear</a-button>
              </span>
            </a-form-item>
            <a-form-item style="position:absolute; right:0px;">
              <span class="table-page-search-submitButtons" >
                <a-button type="primary" v-action:edit ghost @click="handleEdit()">Add Segment</a-button>
              </span>
            </a-form-item>
          </a-row>
          <a-spin :spinning="fetching">
            <div style="background:#FFFFFF;">
              <a-table
                class="ant-card-table-default"
                ref="table"
                rowKey="id"
                :dataSource="list"
                :expandedRowKeys="curExpandedRowKeys"
                :columns="columns"
                :scroll="{ y: scroll }"
                :expandIconAsCell="false"
                :expandIconColumnIndex="-1"
                :pagination="false"
                @change="tableChange"
              >
                <span slot="name" slot-scope="text, record">
                  <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                    <om-text :tooltip="true" :text="text"/>
                  </span>
                </span>
                <span slot="autoOpt" slot-scope="text, record">
                  <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                    {{ text === 0? 'Manual':'Auto' }}
                  </span>
                </span>
                <span slot="ruleInstanceSize" slot-scope="text, record">
                  <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                    {{ text }}
                  </span>
                </span>
                <span slot="priority" slot-scope="text, record">
                  <span :style="record.status > 0 ? null: 'opacity: 0.3;' ">
                    <editable-cell v-if="record.status > 0 && canEdit" :text="record.priority || '--'" @change="onCellChange(record, 'priority', $event)" />
                    <span v-else-if="record.status>0 && !canEdit">{{ text }}</span>
                    <span v-else>{{ '--' }}</span>
                  </span>
                </span>
                <span slot="status" slot-scope="text, record">
                  <template>
                    <div v-if="canEdit">
                      <a herf="#" @click="handleEdit(record)">Edit</a>
                      <a-divider type="vertical" />
                      <a herf="#" @click="segmentStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                      <a-divider v-if="record.name!=='ALL'" type="vertical" />
                      <a-popconfirm v-if="record.name!=='ALL'" title="Are you really sure？" okText="Yes" cancelText="No" @confirm="segmentDelete(record)">
                        <a herf="#">Remove</a>
                      </a-popconfirm>
                      <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                      <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                    </div>
                    <div v-else>
                      <a herf="#" @click="viewMediation(record)">Details</a>
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
                        <a herf="#" @click="instanceStatusUpdate(srecord)">{{ srecord.priority >= 0 ?'Disable' : 'Enable' }}</a>
                      </div>
                    </template>
                  </span>
                </a-table>
              </a-table>
            </div>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="Settings" class="water-fall" key="2" forceRender style="height:600px;">
          <a-card class="card-noline" style="height:270px;background:#FFFFFF; margin-top:8px;" title="Waterfall Settings" :bordered="false">
            <om-form label="Batch Size" field="batchSize" tip="Batch Size">
              <a-input-number
                style="width:100%"
                ref="iap-min"
                type="number"
                :min="1"
                :max="5"
                v-decorator="['batchSize', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
            </om-form>
            <om-form label="Preload Timeout(s)" field="preloadTimeout" tip="Preload Timeout(s)" >
              <a-input-number
                style="width:100%"
                ref="iap-min"
                type="number"
                :min="1"
                :max="30"
                v-decorator="['preloadTimeout', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
            </om-form>
            <om-form label="Pool Size" field="inventoryCount" tip="Pool Size">
              <a-input-number
                style="width:100%"
                ref="iap-min"
                type="number"
                :min="2"
                :max="20"
                v-decorator="['inventoryCount', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
            </om-form>
          </a-card>
          <a-card style="margin-top:8px;background:#FFFFFF" :bordered="false">
            <span
              slot="title"
              style="color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;">Audience Segment Automation <a-switch style="margin-left:100px;" disabled checkedChildren="√" unCheckedChildren="X" :defaultChecked="false" /> <span style="font-weight:300">Disable</span></span>
          </a-card>
          <div class="button-div">
            <a-button type="primary" v-action:edit style="bottom: -40px;width: 180px;left: -9.5%;" @click="placementSave">Save</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-form>
</template>

<script>
import { segmentRuleUpdate, segmentRuleDelete, segmentList, rulePriorityUpdate, mediationRuleInstanceUpdate, mediationSegmentRuleInstanceCreate, mediationSegmentRuleInstanceDelete } from '@/api/mediation'
import RegionsSelect from '@/components/om/RegionsSelect'
import PlacementSelect from '@/components/om/PlacementSelect'
import { placementList, placementGet, placementUpdate } from '@/api/publisher'
import AdNetwork from '@/components/Mediation/AdNetwork'
import OmForm from '@/components/OmForm'
import EditableCell from '@/components/EditableCell'
import OmText from '@/components/om/Text'
import pick from 'lodash.pick'

import { mapState } from 'vuex'

export default {
  name: 'Mediation',
  components: {
    RegionsSelect,
    PlacementSelect,
    OmForm,
    AdNetwork,
    OmText,
    EditableCell
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      form: this.$form.createForm(this),
      searchOption: {},
      adNetworkName: this.$route.params.name,
      adTypes: this.$route.params.adTypes,
      canEdit: this.$auth('mediation.edit'),
      curExpandedRowKeys: [],
      scroll: 200,
      currentExpandedStatOpen: false,
      id: this.$route.params.id,
      placementSelectOption: [],
      instanceSelectOption: [],
      data: [],
      list: [],
      regions: [],
      fetching: false,
      sortOrder: '',
      columns: [
        {
          title: 'Segment',
          dataIndex: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Optimize Type',
          dataIndex: 'autoOpt',
          width: '15%',
          scopedSlots: { customRender: 'autoOpt' }
        },
        {
          title: 'Priority',
          dataIndex: 'priority',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'priority' }
        },
        {
          title: 'Active Instances',
          dataIndex: 'ruleInstanceSize',
          align: 'center',
          width: '20%',
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
    searchPlacement: state => state.publisher.searchPlacement
  }),
  watch: {
    searchPlacement (curVal) {
      this.listSearch()
    },
    data (val) {
      this.list = []
      this.$nextTick(() => {
        this.list = val
      })
    }
  },
  created () {
    this.scroll = window.innerHeight - 290
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
    onCellChange (record, dataIndex, value) {
      if (record.priority === value) {
        return
      }
      const params = []
      let hasAdded = false
      for (const item of this.data) {
        if (!item.id || item.id === record.id) {
          continue
        }
        if (item.priority === value) {
          hasAdded = true
          params.push(record.id)
        }
        params.push(item.id)
      }
      if (!hasAdded) {
        params.push(record.id)
      }
      rulePriorityUpdate({ placementRuleIds: params.join(','), placementId: {} }).then(res => {
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
            this.$message.success(`success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    placementSave () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          values.id = this.searchPlacement
          placementUpdate(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`success`)
            } else {
              this.$message.error(`error`)
            }
          })
        }
      })
    },
    callback (value) {
    },
    listSearch () {
      this.fetching = true
      if (!this.searchPlacement || this.searchPlacement === 'undefined') {
        this.fetching = false
        return false
      }
      const params = { pubAppId: this.searchApp, placementId: this.searchPlacement }
      const countries = [ ...this.regions ]
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
            this.data = res.data
          }
        }).finally(() => {
          this.fetching = false
        })
      placementGet({ placementId: this.searchPlacement }).then(res => {
        if (res.code === 0) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.data, ['batchSize', 'preloadTimeout', 'inventoryCount']))
          })
        }
      })
    },
    resetSearch () {
      this.regions = []
    },
    segmentStatusUpdate (record) {
      const status = record.status === 1 ? 0 : 1
      segmentRuleUpdate({ id: record.id, status: status, pubAppId: this.searchApp, placementId: this.searchPlacement }).then(res => {
        if (res.code === 0) {
          record.status = status
          this.listSearch()
          this.$message.success('success')
        } else {
          this.$message.error('error')
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
  .mytabs >>> .ant-tabs-top-bar{
    width: 250px;
  }
  .ant-table-wrapper {
    padding: 0px;
  }
  .water-fall >>> .ant-card-head-wrapper {
    margin-left: -8px;
  }
  .mytabs >>> .ant-tabs-nav-wrap {
    margin-left: -8px;
  }
  .button-div {
    text-align: center;
    bottom: 0;
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 100px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 32.36%, #ffffff 100%);
  }
</style>
