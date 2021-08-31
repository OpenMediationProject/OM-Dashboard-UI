<!-- Mediation list page router '/mediation/mediation/list' -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <div v-if="(guideBtFirst && guideBidNum <= 3) || (guideWfFirst && guideWtfNum <= 2)" @click="onGuideModel" style="background: black;width: 100vw;height: 100vh;position: fixed;top: 0;left: 0;opacity: 0.3;z-index: 1001;"></div>
    <!-- <div v-if="!guideFirst" style="background: black;width: 100vw;height: 100vh;position: fixed;top: 0;left: 0;opacity: 0.3;z-index: 1001;"></div> -->
    <PlacementSelect v-show="searchPlacement" style="margin-left:8px;"/>
    <a-card :bordered="false" style="padding-top:12px;" :class="(guideBidNum === 0 || guideWtfNum === 0) ? 'btPane' : ''">
      <a-tabs class="mytabs" :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '8px', marginTop: '-12px'}" :active-key="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
        <span slot="tabBarExtraContent">
        </span>
        <a-tab-pane :tab="$t('mediation.instances')" key="1" ref="instancesTab" style="margin-top: 8px; position: relative;">
          <instance-pane
            :guideBidNum="guideBidNum"
            @goToWaterfall="goToWaterfall"
            @preGuideNum="() => guideBidNum--"
            @nextGuideNum="() => guideBidNum++"
            @closeGuide="closeGuide"
          />
          <GuideModel
            :visible="guideBidNum === 0"
            placement="bottomLeft"
            top="-25px"
            left="40px"
            :type="1"
            :linkUrl="`${ $i18n.locale === 'zhCN' ? 'https://support.openmediation.com/hc/zh-cn/articles/360050626074' : 'https://support.openmediation.com/hc/en-us/articles/360050626074-Add-Instance' }`"
            :guideTitle="$t('mediation.guide_t1_tip')"
            :guideContent="$t('mediation.guide_c1_tip')"
            @nextGuideNum="() => guideBidNum++"
            @closeGuide="closeGuide"
            @laterGuide="laterGuide"
          />
        </a-tab-pane>
        <a-tab-pane :tab="$t('mediation.waterfalls')" key="2" style="margin-top: 8px; position: relative;">
          <ZeroTip :width="$i18n.locale === 'zhCN' ? '650px' : '882px'" top="0px" bottom="8px" />
          <GuideModel
            :visible="guideWtfNum === 0"
            placement="bottomLeft"
            top="-25px"
            left="175px"
            :type="1"
            :linkUrl="`${ $i18n.locale === 'zhCN' ? 'https://support.openmediation.com/hc/zh-cn/articles/360050663934-搭建聚合规则体系' : 'https://support.openmediation.com/hc/en-us/articles/360050663934-Mediation-rule-settings' }`"
            :guideTitle="$t('mediation.guide_t5_tip')"
            :guideContent="$t('mediation.guide_c5_tip')"
            @nextGuideNum="() => guideWtfNum++"
            @closeGuide="closeGuide"
            @laterGuide="laterGuide"
          />
          <div v-if="!searchPlacement" class="table-page-search-wrapper">
            <a-alert class="om-card-style" type="info">
              <span slot="message" style="text-align: center;width: 100%;">
                <div style="text-align:center; width:900px;margin-left:15%;margin-top:24px;height: 180px">
                  <div style="display:inline-block;float:left; margin-right:26px;margin-left:100px;margin-bottom: 32px"><img src="/assets/mediation_tip.svg"/></div>
                  <div style="text-align:left;line-height:20px;padding-top: 8px">
                    <h4 style="font-size: 16px;color: #333333">{{ $t('mediation.md_1_tip') }}</h4>
                    <p style="font-size:14px;color: #666666">{{ $t('mediation.md_2_tip') }}<br>{{ $t('mediation.md_3_tip') }}<br>{{ $t('mediation.md_4_tip') }}<br>{{ $t('mediation.md_5_tip') }}</p>
                    <div class="button-add">
                      <a-button type="primary" v-if="canEdit" style="width: 168px;" @click="addPlacement()"><span class="iconfull iconfont" style="margin-right: 4px;">&#xe609;</span>{{ $t('mediation.AddPlacement') }}</a-button>
                    </div>
                  </div>
                </div>
              </span>
            </a-alert>
          </div>
          <div v-else>
            <a-row type="flex" justify="start" style="height: 44px;">
              <a-form-item :style="`position: relative; ${ guideWtfNum === 1 ? 'z-index: 1003;' : '' }`">
                <OmInstanceSelect :defaultValue="defaultShowInstace" width="240px" @change="instanceSelectedId" size="default" />
                <GuideModel
                  :visible="guideWtfNum === 1"
                  :totalNum="2"
                  :currentNum="1"
                  :type="3"
                  placement="bottomLeft"
                  top="22px"
                  left="100px"
                  :guideTitle="$t('mediation.guide_t6_tip')"
                  :guideContent="$t('mediation.guide_c6_tip')"
                  @preGuideNum="() => guideWtfNum--"
                  @nextGuideNum="() => guideWtfNum++"
                  @closeGuide="closeGuide"/>
              </a-form-item>
              <a-form-item :style="`position: relative; ${ guideWtfNum === 1 ? 'z-index: 1003;' : '' }`">
                <RegionsSelect @change="regoinsSelectedId" size="default" style="margin-left: 8px;margin-top:2px;width:240px;" />
              </a-form-item>
              <a-form-item :style="`position: relative; ${ guideWtfNum === 1 ? 'z-index: 1003;' : '' }`">
                <DaysSelect @change="daysSelectedId" size="default" style="margin-left: 8px;"/>
              </a-form-item>
              <!-- <a-form-item>
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">{{ $t('comm.apply') }}</a-button>
                </span>
              </a-form-item> -->
              <a-form-item style="position:absolute; right:0px;">
                <span class="table-page-search-submitButtons" >
                  <!-- <a v-if="!abt" @click="settings"><img src="/icon/Setting.svg" style="margin-top:-2px;margin-right: 8px;" />Settings</a> -->
                  <a-button v-if="!abt" @click="settings" type="primary" ghost ><a-icon type="setting" />{{ $t('comm.settings') }}</a-button>
                  <a-button
                    type="primary"
                    style="margin-left: 16px;"
                    v-action:edit
                    v-if="!abt"
                    ghost
                    @click="handleEdit()"><span class="iconfont" style="margin-right: 4px;">&#xe609;</span>{{ $t('mediation.AddMediationRule') }}</a-button>
                </span>
              </a-form-item>
            </a-row>
            <a-spin :spinning="fetching">
              <div style="background:#FFFFFF;margin-bottom: 16px;" :class="guideWtfNum === 2 ? 'wtfTheadshow' : ''">
                <GuideModel
                  :visible="guideWtfNum === 2"
                  :totalNum="2"
                  :currentNum="2"
                  :type="3"
                  placement="top"
                  top="22px"
                  left="42.5%"
                  :guideTitle="$t('mediation.guide_t7_tip')"
                  :guideContent="$t('mediation.guide_c7_tip')"
                  @preGuideNum="() => guideWtfNum--"
                  @nextGuideNum="() => guideWtfNum++"
                  @closeGuide="closeGuide"/>
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
                  <!-- 状态开关 -->
                  <span slot="switchStatus" slot-scope="record">
                    <a-switch :checked="record.status === 1" @click="handelWaterfallStatusUpdate(record)">
                      <a-icon slot="checkedChildren" type="check" />
                      <a-icon slot="unCheckedChildren" type="close" />
                    </a-switch>
                  </span>
                  <span slot="name" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      <om-text :length="40" :tooltip="true" :text="text"/><img style="margin-left:8px;" v-if="record.abTestModel===1" src="/icon/testb.svg" />
                    </span>
                  </span>
                  <span slot="countries" slot-scope="text">
                    <a-tooltip>
                      <span slot="title">
                        <span v-if="text[0]!=='ALL'">{{ text.length }} {{ $t('comm.regions') }} <br></span>
                        {{ text.join(',') }}
                      </span>
                      <div style="display: inline-block;" v-for="(o, index) in text" :key="o">
                        <a-tag v-if="index<2">{{ o === '00' ? 'ALL' : o }}</a-tag>
                      </div>
                      <span v-if="text.length>2">...</span>
                    </a-tooltip>
                  </span>
                  <span slot="fillRate" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" class="tier_requests">
                      <span>{{ (record.fillRate ? record.fillRate : '0') + '%' }}</span>
                      <span v-if="record.fillRateChainComparison" :style="record.fillRateChainComparison > 0 ?'color: #18921D;' : 'color: #D5432F;'">{{ record.fillRateChainComparison + '%' }}</span>
                      <span v-else>--</span>
                    </span>
                  </span>
                  <span slot="ecpm" slot-scope="record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" class="tier_requests">
                      <span>{{ '$ ' + (record.ecpm ? record.ecpm : 0) }}</span>
                      <span v-if="record.ecpmChainComparison" :style="record.ecpmChainComparison > 0 ?'color: #18921D;' : 'color: #D5432F;'">{{ record.ecpmChainComparison + '%' }}</span>
                      <span v-else>--</span>
                    </span>
                  </span>
                  <span slot="autoOpt" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      {{ text === 0? $t('ab.manual'):$t('ab.auto') }}
                    </span>
                  </span>
                  <span slot="ruleInstanceSize" slot-scope="text, record">
                    <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
                      <!-- <a @click="handleOpen(record)">{{ text }}</a> -->
                      <a @click="handleEdit(record)">{{ text }}</a>
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
                        <a @click="handleEdit(record)">{{ $t('comm.edit') }}</a>
                        <a-divider type="vertical" />
                        <a @click="handleCopy(record)">{{ $t('mediation.duplicate') }}</a>
                        <a-divider type="vertical" />
                        <!-- <a @click="segmentStatusUpdate(record)">{{ text===0?$t('comm.enable') : $t('comm.disable') }}</a>
                        <a-divider type="vertical" /> -->
                        <a-popconfirm okText="Yes" cancelText="No" @confirm="segmentDelete(record)">
                          <span slot="title">{{ $t('mediation.remove_confirm') }}<br />
                            {{ $t('mediation.remove_confirm_ext') }}
                          </span>
                          <a>{{ $t('comm.remove') }}</a>
                        </a-popconfirm>
                        <!-- <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                        <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span> -->
                      </div>
                      <div v-else>
                        <a @click="viewMediation(record)">{{ $t('comm.details') }}</a>
                        <!-- <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                        <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span> -->
                      </div>
                    </template>
                  </span>
                  <a-table
                    :ref="index+'table'"
                    slot="expandedRowRender"
                    slot-scope="record, index"
                    rowKey="instanceId"
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
                        :id="srecord.mediationId"
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
                          <a v-if="canEdit && !abt" @click="instanceStatusUpdate(srecord)">{{ srecord.priority >= 0 ? $t('comm.disable') : $t('comm.enable') }}</a>
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
// import OmInstanceSelect from '@/components/om/InstanceSelect'
import OmInstanceSelect from './modules/InstanceSelect'
import DaysSelect from './modules/DaysSelect'
import PlacementSelect from './modules/PlcSelect'
import { placementList } from '@/api/publisher'
import AdNetwork from '@/components/om/AdNetwork'
import OmForm from '@/components/OmForm'
import EditableCell from '@/components/EditableCell'
import OmText from '@/components/om/Text'

import { mapState } from 'vuex'
import InstanceEdit from '@/views/publisher/modules/InstanceEdit'
import InstancePane from './modules/InstancePane'
import GuideModel from './modules/GuideModel'
import ZeroTip from './modules/ZeroTip'
import { getGuideInfo, setGuideInfo } from './modules/utils'

export default {
  name: 'Mediation',
  components: {
    RegionsSelect,
    PlacementSelect,
    OmForm,
    AdNetwork,
    OmText,
    EditableCell,
    InstanceEdit,
    InstancePane,
    OmInstanceSelect,
    DaysSelect,
    GuideModel,
    ZeroTip
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
      instanceSelected: null,
      daysSelected: 1,
      fetching: false,
      sortOrder: '',
      visible: true,
      defaultShowInstace: [],
      columns: [
        {
          title: this.$t('comm.status'),
          scopedSlots: { customRender: 'switchStatus' },
          width: '10%'
        },
        {
          title: this.$t('mediation.mediationRule'),
          dataIndex: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('mediation.Regions'),
          dataIndex: 'countries',
          width: '12%',
          scopedSlots: { customRender: 'countries' }
        },
        {
          title: this.$t('tableHead.fillRate'),
          width: '10%',
          scopedSlots: { customRender: 'fillRate' }
        },
        {
          title: this.$t('tableHead.eCPM'),
          width: '10%',
          scopedSlots: { customRender: 'ecpm' }
        },
        {
          title: this.$t('mediation.priority'),
          dataIndex: 'priority',
          align: 'left',
          width: '9%',
          scopedSlots: { customRender: 'priority' }
        },
        {
          title: this.$t('mediation.instances'),
          dataIndex: 'ruleInstanceSize',
          align: 'left',
          width: '9%',
          scopedSlots: { customRender: 'ruleInstanceSize' }
        },
        {
          width: '20%',
          title: this.$t('comm.operations'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      innerColumns: [
        { title: '', dataIndex: '', width: '10%' },
        { title: this.$t('mediation.AdNetwork'), dataIndex: 'className', width: '25%', key: 'className', scopedSlots: { customRender: 'className' } },
        { title: this.$t('mediation.instances'), dataIndex: 'instanceName', width: '15%', key: 'instanceName', scopedSlots: { customRender: 'instanceName' } },
        { title: this.$t('mediation.priority'), dataIndex: 'priority', align: 'center', width: '20%', key: 'priority', scopedSlots: { customRender: 'priority' } },
        {
          title: this.$t('comm.operations'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      innerColumnsHidePri: [
        { title: '', dataIndex: '', width: '10%' },
        { title: this.$t('mediation.AdNetwork'), dataIndex: 'className', width: '30%', key: 'className', scopedSlots: { customRender: 'className' } },
        { title: this.$t('mediation.instances'), dataIndex: 'instanceName', width: '30%', key: 'instanceName', scopedSlots: { customRender: 'instanceName' } },
        {
          title: this.$t('comm.operations'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      guideBtFirst: false,
      guideWfFirst: false,
      guideBidNum: -1,
      guideWtfNum: -1
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
  mounted () {
    this.checkGuide()
  },
  methods: {
    checkGuide () {
      setTimeout(() => {
        if (!getGuideInfo('bt') && !getGuideInfo('bt_l') && (this.activeKey === 1 || this.activeKey === '1')) {
          this.guideBtFirst = true
          this.guideBidNum = 0
        }
        if (!getGuideInfo('wf') && !getGuideInfo('wf_l') && (this.activeKey === 2 || this.activeKey === '2')) {
          this.guideWfFirst = true
          this.guideWtfNum = 0
        }
      }, 1000)
    },
    closeGuide () {
      if (this.guideBtFirst) {
         setGuideInfo('bt', 1)
      }
      if (this.guideWfFirst) {
        setGuideInfo('wf', 1)
      }
      this.closeGuideModel()
    },
    laterGuide () {
      if (this.guideBtFirst) {
         setGuideInfo('bt_l', 1)
      }
      if (this.guideWfFirst) {
        setGuideInfo('wf_l', 1)
      }
      this.closeGuideModel()
    },
    closeGuideModel () {
      this.guideBidNum = -1
      this.guideWtfNum = -1
      this.guideBtFirst = false
      this.guideWfFirst = false
    },
    onGuideModel () {
      if (this.guideBtFirst) {
        this.guideBidNum++
        if (this.guideBidNum === 4) {
          this.guideBtFirst = false
          setGuideInfo('bt', 1)
        }
      }
      if (this.guideWfFirst) {
        this.guideWtfNum++
        if (this.guideWtfNum === 3) {
          this.guideWfFirst = false
          setGuideInfo('wf', 1)
        }
      }
    },
    tabChange (val) {
      if (val === '2') {
        this.listSearch()
        setTimeout(() => {
          if (!getGuideInfo('wf') && !getGuideInfo('wf_l')) {
            this.guideWfFirst = true
            this.guideWtfNum = 0
          }
        }, 1000)
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
      this.listSearch()
    },
    instanceSelectedId (val) {
      this.instanceSelected = val
      this.listSearch()
    },
    daysSelectedId (val) {
      this.daysSelected = val
      this.listSearch()
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
            this.$message.success(this.$t('mediation.update_success'))
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
      if (this.instanceSelected) {
        params.instanceId = this.instanceSelected
      }
      params.lastDays = this.daysSelected
      segmentList(params)
        .then(res => {
          if (res.code === 0) {
            this.arraySort(res.data)
            this.abt = this.searchPlacementAbt
            res.data.forEach(item => {
              item.ruleInstances = item.ruleInstances.filter(d => d.priority > 0).sort((a, b) => a.priority - b.priority)
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
          this.$message.success(this.$t('mediation.update_success'))
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
    },
    goToWaterfall (record) {
      this.instanceSelected = record.id
      this.defaultShowInstace = []
      this.defaultShowInstace.push(record.name)
      // console.log(record.instanceName)
      this.tabChange('2')
    },
    handelWaterfallStatusUpdate (record) {
      const status = record.status === 1 ? 0 : 1
      segmentRuleUpdate({ id: record.id, status: status, pubAppId: this.searchApp, placementId: this.searchPlacement }).then(res => {
        if (res.code === 0) {
          record.status = status
          this.listSearch()
          this.$message.success(this.$t('mediation.update_success'))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wtfTheadshow /deep/ .ant-table-thead {
  position: relative;
  z-index: 1003;
}
/deep/ .ant-tabs {
  overflow: visible;
}
/deep/ .ant-btn-background-ghost {
  background: #FFFFFF !important;
}
.btPane /deep/ .ant-tabs-tab-active {
  position: relative;
  z-index: 1003;
  background-color: #f7f7f7;
}
.btPane /deep/ .ant-tabs-ink-bar {
  position: relative;
  z-index: 1003;
}
.ant-table-wrapper {
  padding: 16px;
}
.ant-card {
  background-color: #F7F7F7
}
.mytabs /deep/ .ant-tabs-nav-container {
  font-size: 18px;
  color: #333333;
}
.ant-table-wrapper {
  padding: 0px;
}
.ant-card-body {
  padding: 0;
}
.water-fall /deep/ .ant-card-head-wrapper {
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
.tier_requests {
  display:flex;
  flex-direction: column;
  justify-content: center;
  & > span:nth-of-type(1) {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: #333333;
    margin-bottom: 4px;
  }
  & > span:nth-of-type(2) {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #ccc;
  }
}
</style>
