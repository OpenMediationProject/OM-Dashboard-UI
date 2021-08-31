<template>
  <div class="paneBox">
    <OmFocus
      v-if="
        (bt_curExpandedRowKeys.length && this.data_bidding_original.find(r=>r.id===bt_curExpandedRowKeys[0]).editStatus)
          || (wf_curExpandedRowKeys.length && this.data_waterfall.find(r=>r.id===wf_curExpandedRowKeys[0]).editStatus)
          || addModel
      "
    />
    <add-instance
      v-if="addModel"
      @addInstancesCancel="()=> this.addModel = false"
      @refreshData="listSearch"
    ></add-instance>
    <div v-if="!searchPlacement" class="table-page-search-wrapper">
      <div class="table-page-search-wrapper">
        <a-alert class="om-card-style" type="info">
          <span slot="message" style="text-align: center;width: 100%;">
            <div style="text-align:center; width:900px;margin-left:15%;margin-top:24px;height: 180px">
              <div style="display:inline-block;float:left; margin-right:26px;margin-left:100px;margin-bottom: 32px"><img src="/assets/mediation_tip.svg" alt=""/></div>
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
    </div>
    <div v-else>
      <div class="adnedit">
        <!-- 过滤器 -->
        <a-form :form="form" :hideRequiredMark="true">
          <a-row type="flex" justify="start" style="height: 44px;">
            <om-ad-network-select
              name="insAdnId"
              :showArrow="false"
              :pubAppId="parseInt(searchApp)"
              mode="none"
              @change="adnFilterChange"
              size="default"
              style="display:inline-block; margin-right:8px;"/>
            <om-instance-select
              ref="insselect"
              :adnIds="adnIds"
              :arrowShow="true"
              :placementId="parseInt(searchPlacement)"
              @change="insFilterChange"/>
            <!-- <a-form-item>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">{{ $t('comm.apply') }}</a-button>
              </span>
            </a-form-item> -->
            <a-form-item v-action:edit v-if="canEdit" :style="`position:absolute; right:0px;${ guideBidNum === 1 ? 'z-index: 1003;' : '' }`">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" :disabled="this.curExpandedRowKeys.length > 0" ghost @click="instanceAdd"><span class="iconfont" style="margin-right: 4px;">&#xe609;</span>{{ $t('mediation.AddInstance') }}</a-button>
              </span>
              <GuideModel
                :visible="guideBidNum === 1"
                :totalNum="3"
                :currentNum="1"
                :type="2"
                placement="bottomRight"
                top="22px"
                left="120px"
                :guideTitle="$t('mediation.guide_t2_tip')"
                :guideContent="$t('mediation.guide_c2_tip')"
                :guideImg="$i18n.locale === 'zhCN' ? '/mediation/zh/add.webp' : '/mediation/en/add.webp'"
                @preGuideNum="() => this.$emit('preGuideNum')"
                @nextGuideNum="() => this.$emit('nextGuideNum')"
                @closeGuide="() => this.$emit('closeGuide')"/>
            </a-form-item>
          </a-row>
        </a-form>
        <!-- In-App Bidding -->
        <a-form-model class="bt_form" ref="instanceForm_bt" :model="instanceInfo" :rules="rules_bt" :hideRequiredMark="true">
          <a-card class="bt_card" :class="guideBidNum === 3 ? 'bidTheadshow' : ''">
            <GuideModel
              :visible="guideBidNum === 3"
              :totalNum="3"
              :currentNum="3"
              :type="3"
              placement="bottom"
              top="55px"
              left="76%"
              :guideTitle="$t('mediation.guide_t4_tip')"
              :guideContent="$t('mediation.guide_c4_tip')"
              @preGuideNum="() => this.$emit('preGuideNum')"
              @nextGuideNum="() => this.$emit('nextGuideNum')"
              @closeGuide="() => this.$emit('closeGuide')"/>
            <div class="card_head" :style="`${ guideBidNum === 2 ? 'position: relative; z-index: 1003; background: #fff;' : ''}`">
              <div class="card_head_box" style="position: relative;">
                <span class="card_head_icon bt_head_icon"><span class="iconfont">&#xe61a;</span></span>
                <span class="card_head_title bt_head_title">{{ $t('mediation.InAppBiddingInstance') }}</span>
                <GuideModel
                  :visible="guideBidNum === 2"
                  :totalNum="3"
                  :currentNum="2"
                  :type="3"
                  placement="rightTop"
                  top="2px"
                  left="170px"
                  :guideTitle="$t('mediation.guide_t3_tip')"
                  :guideContent="$t('mediation.guide_c3_tip')"
                  @preGuideNum="() => this.$emit('preGuideNum')"
                  @nextGuideNum="() => this.$emit('nextGuideNum')"
                  @closeGuide="() => this.$emit('closeGuide')"/>
              </div>
              <span class="card_head_select">{{ bt_status_true }} {{ $t('mediation.instancesg') }}</span>
            </div>
            <a-divider style="margin: 0"/>
            <a-table
              class=""
              rowKey="id"
              :columns="columns_bidding"
              :data-source="data_bidding_show"
              :loading="loading_bidding"
              :defaultExpandAllRows="true"
              :expandedRowKeys="bt_curExpandedRowKeys"
              :expandIconAsCell="false"
              :expandIconColumnIndex="-1"
              :pagination="false"
              :rowClassName="(record)=>{
                if (bt_curExpandedRowKeys.length && record.id === bt_curExpandedRowKeys[0]){
                  return 'om-edit-row'
                } else {
                  return 'normal'
                }
              }"
            >
              <!-- 展开行 -->
              <div slot="expandedRowRender" class="bt-expand-row" slot-scope="record" :rowKey="record.id" style="margin: 0;">
                <om-form-model
                  :label="$t('mediation.instanceName')"
                  :colon="false"
                  :fill="false"
                  field="name"
                  :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
                  style="margin-bottom: 24px;">
                  <a-input
                    :disabled="!record.editStatus"
                    :placeholder="$t('mediation.instanceName')"
                    style="margin-top:0;"
                    v-model="instanceInfo.name" />
                </om-form-model>
                <om-form-model
                  :label="$t('mediation.unitID')"
                  :colon="false"
                  :fill="false"
                  field="placementKey"
                  :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
                  style="margin-bottom: 24px;">
                  <a-input
                    :disabled="!record.editStatus || record.adnId === 18"
                    :placeholder="$t('mediation.unitID')"
                    style="margin-top:0;"
                    v-model="instanceInfo.placementKey" />
                </om-form-model>
                <a-divider style="margin: 0"/>
                <a-row>
                  <a-col :span="8" :offset="8">
                    <p class="expand-advanced" @click="openAdvanced(record)">{{ $t('mediation.advancedOptions') }} <span class="iconfont">{{ record.expandAdvanced? '&#xe603;': '&#xe602;' }}</span></p>
                  </a-col>
                </a-row>
                <div class="bt_advanced_card" v-if="record.expandAdvanced">
                  <advanced-card
                    :instanceInfo="instanceInfo"
                    :record="record"
                    :instanceInfoChange="instanceInfoChange"
                  ></advanced-card>
                </div>
                <a-row v-if="record.editStatus" style="margin-bottom: 16px;">
                  <a-col :span="6" :offset="6">
                    <a-button type="primary" @click="handleInstanceSave_bt(record)" style="margin-right: 24px;">{{ $t('comm.save') }}</a-button>
                    <a-button type="primary" @click="handleInstanceCancel_bt(record)" ghost>{{ $t('comm.cancel') }}</a-button>
                  </a-col>
                </a-row>
              </div>
              <!-- 广告平台 标题 -->
              <!-- <span slot="instanceTitle">{{ $t('mediation.instanceName') }} <span class="iconfont searchIcon" @click.stop="seacrhInstance">&#xe61d;</span></span> -->
              <span slot="instanceTitle">{{ $t('mediation.instance') }}</span>
              <!-- 状态开关 -->
              <span slot="status" class="row-edit" slot-scope="text, record">
                <a-switch :loading="record.loadingStatus" :checked="record.status === 1" @click="handelInstanceStatusUpdate(record, 'bt')">
                  <a-icon slot="checkedChildren" type="check" />
                  <a-icon slot="unCheckedChildren" type="close" />
                </a-switch>
              </span>
              <!-- 广告平台 -->
              <span slot="adnName" class="row-edit" slot-scope="text, record">
                <ad-network
                  v-if="!record.createNew"
                  style="max-width:120px;"
                  :id="record.adnId"
                  :status="record.status"
                />
              </span>
              <!-- 广告层级 -->
              <span slot="instance" slot-scope="text, record">
                <div class="bidding_instance" :style="record.status===0 ? 'opacity: 0.3;' : null">
                  <span class="bt_tr_instanceName">{{ record.name }}<span class="iconfont">&#xe61a;</span></span>
                  <span class="bt_tr_placementKey">{{ record.placementKey? record.placementKey: "--" }}</span>
                </div>
              </span>
              <!-- Mediation Rule -->
              <span slot="mediationRule" class="row-edit row-mediationRule" slot-scope="record">
                <div :disabled="!record.relateRuleSize" @click="goToWaterfall(record)" :class="!record.relateRuleSize? 'disabledS': ''">{{ (record.relateRuleSize ? record.relateRuleSize : 0) + ' ' + $t('comm.Enabled') }}</div>
              </span>
              <!-- 操作 -->
              <span slot="operations" slot-scope="text, record">
                <div v-if="!record.editStatus">
                  <a @click="handleEdit_bt(record)">{{ $t('comm.edit') }}</a>
                  <span style="float:right; margin-right:8px;" v-if="!record.expandStatus" @click="handleOpen_bt(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right; margin-right:8px;" v-else @click="handleOpen_bt(record)"><img src="/assets/up.svg"/></span>
                </div>
              </span>
            </a-table>
            <div class="bt_expand_table" v-if="data_bidding_original.length > 2" @click="triggerBtExpand">{{ $t('mediation.SeeAllInstances') }} <span class="iconfont">{{ this.bt_expand ? '&#xe61c;': '&#xe620;' }}</span></div>
          </a-card>
        </a-form-model>
        <!-- waterfall -->
        <a-form-model ref="instanceForm_wf" :model="instanceInfo" :rules="rules_wf" :hideRequiredMark="true">
          <a-card class="wf_card">
            <div class="card_head" :style="`${ guideBidNum === 2 ? 'position: relative; z-index: 1003; background: #fff;' : ''}`">
              <div class="card_head_box">
                <span class="card_head_icon wf_head_icon"><span class="iconfont">&#xe61b;</span></span>
                <span class="card_head_title wf_head_title">{{ $t('mediation.WaterfallInstance') }}</span>
              </div>
              <span class="card_head_select">{{ wf_status_true }} {{ $t('mediation.instancesg') }}</span>
            </div>
            <a-divider style="margin: 0"/>
            <a-table
              class=""
              rowKey="id"
              :columns="columns_waterfall"
              :data-source="data_waterfall"
              :loading="loading_waterfall"
              :defaultExpandAllRows="true"
              :expandedRowKeys="wf_curExpandedRowKeys"
              :expandIconAsCell="false"
              :expandIconColumnIndex="-1"
              :pagination="false"
              :rowClassName="(record)=>{
                if (wf_curExpandedRowKeys.length && record.id === wf_curExpandedRowKeys[0]){
                  return 'om-edit-row'
                } else {
                  return 'normal'
                }
              }"
            >
              <!-- 展开行 -->
              <div slot="expandedRowRender" class="bt-expand-row" slot-scope="record" :rowKey="record.id" style="margin: 0">
                <div v-if="!record.ecpmSatus">
                  <om-form-model
                    :label="$t('mediation.instanceName')"
                    :colon="false"
                    :fill="false"
                    field="name"
                    :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
                    style="margin-bottom: 24px;">
                    <a-input
                      :disabled="!record.editStatus"
                      :placeholder="$t('mediation.instanceName')"
                      style="margin-top:0;"
                      v-model="instanceInfo.name" />
                  </om-form-model>
                  <om-form-model
                    :label="$t('mediation.unitID')"
                    :colon="false"
                    :fill="false"
                    field="placementKey"
                    :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
                    style="margin-bottom: 24px;">
                    <a-input
                      :disabled="!record.editStatus"
                      :placeholder="$t('mediation.unitID')"
                      style="margin-top:0;"
                      v-model="instanceInfo.placementKey" />
                  </om-form-model>
                  <om-form-model
                    :label="$t('mediation.manualECPMS')"
                    :colon="false"
                    :fill="false"
                    :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
                    style="margin-bottom: 24px;">
                    <waterfall-table-inner
                      ref="waterfalltableinner"
                      :recordF="record"
                      @editECPM="d => changeManualECPM(d, record)">
                    </waterfall-table-inner>
                  </om-form-model>
                  <a-divider style="margin: 0"/>
                  <a-row>
                    <a-col :span="8" :offset="8">
                      <p class="expand-advanced" @click="openAdvanced(record)">{{ $t('mediation.advancedOptions') }} <span class="iconfont">{{ record.expandAdvanced? '&#xe603;': '&#xe602;' }}</span></p>
                    </a-col>
                  </a-row>
                  <div class="bt_advanced_card" v-if="record.expandAdvanced">
                    <advanced-card
                      :instanceInfo="instanceInfo"
                      :record="record"
                      :instanceInfoChange="instanceInfoChange"
                    ></advanced-card>
                  </div>
                  <a-row v-if="record.editStatus" style="margin-bottom: 16px;">
                    <a-col :span="6" :offset="6">
                      <a-button type="primary" @click="handleInstanceSave_wf(record)" style="margin-right: 24px;">{{ $t('comm.save') }}</a-button>
                      <a-button type="primary" @click="handleInstanceCancel_wf(record)" ghost>{{ $t('comm.cancel') }}</a-button>
                    </a-col>
                  </a-row>
                </div>
                <div v-else>
                  <a-row type="flex" justify="center" style="margin-bottom: 32px;">
                    <a-col>
                      <waterfall-table-inner
                        :recordF="record">
                      </waterfall-table-inner>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <!-- 广告平台 标题 -->
              <!-- <span slot="instanceTitle">{{ $t('mediation.instanceName') }} <span class="iconfont searchIcon" @click.stop="seacrhInstance">&#xe61d;</span></span> -->
              <span slot="instanceTitle">{{ $t('mediation.instance') }}</span>
              <!-- 状态开关 -->
              <span slot="status" class="row-edit" slot-scope="text, record">
                <a-switch :checked="record.status === 1" @click="handelInstanceStatusUpdate(record, 'wf')">
                  <a-icon slot="checkedChildren" type="check" />
                  <a-icon slot="unCheckedChildren" type="close" />
                </a-switch>
              </span>
              <!-- 广告平台 -->
              <span slot="adnName" class="row-edit" slot-scope="text, record">
                <ad-network
                  v-if="!record.createNew"
                  style="max-width:120px;"
                  :id="record.adnId"
                  :status="record.status"
                />
              </span>
              <!-- Manual eCPM -->
              <span slot="eCPMFloor" class="row-edit row-manual" slot-scope="record">
                <div v-if="record.instanceCountries && record.instanceCountries.length > 1" class="multiple">
                  <span @click="toggleEcpm(record)">{{ $t('mediation.Multiple') }}</span>
                </div>
                <div v-else-if="record.instanceCountries && record.instanceCountries.length === 1" class="single">
                  <span class="ecpm" @click="toggleEcpm(record)">{{ '$' + record.instanceCountries[0].manualEcpm }}</span>
                  <span class="text">{{ showRegionsformatInner(record.instanceCountries[0].country) }}</span>
                </div>
                <div v-else>
                  <span>--</span>
                </div>
              </span>
              <!-- Mediation Rule -->
              <span slot="mediationRule" class="row-edit row-mediationRule" slot-scope="record">
                <div :disabled="!record.relateRuleSize" @click="goToWaterfall(record)" :class="!record.relateRuleSize? 'disabledS': ''">{{ (record.relateRuleSize ? record.relateRuleSize : 0) + ' ' + $t('comm.Enabled') }}</div>
              </span>
              <!-- 广告层级 -->
              <span slot="instance" slot-scope="text, record">
                <div class="bidding_instance" :style="record.status===0 ? 'opacity: 0.3;' : null">
                  <span class="bt_tr_instanceName">{{ record.name }}</span>
                  <span class="bt_tr_placementKey">{{ record.placementKey? record.placementKey: "--" }}</span>
                </div>
              </span>
              <!-- 操作 -->
              <span slot="operations" slot-scope="text, record">
                <div v-if="!record.editStatus">
                  <a @click="handleEdit_wf(record)">{{ $t('comm.edit') }}</a>
                  <span style="float:right; margin-right:8px;" v-if="!record.expandStatus" @click="handleOpen_wf(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right; margin-right:8px;" v-else @click="handleOpen_wf(record)"><img src="/assets/up.svg"/></span>
                </div>
              </span>
            </a-table>
          </a-card>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import OmFocus from '@/components/OmFocus'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
// import OmInstanceSelect from '@/components/om/InstanceSelect'
import OmInstanceSelect from './InstanceSelect'
import AdNetwork from '@/components/om/AdNetwork'
import OmFormModel from '@/components/OmFormModel'
import ADNSelect from '@/views/publisher/modules/ADNSelect'
import AdvancedCard from './AdvancedCard'
import WaterfallTableInner from './WaterfallTableInner'
import AddInstance from './AddInstances'
import { OpenExpandObj as OpenExpand, showRegionsformat } from './utils'
import GuideModel from './GuideModel'

// import { getInstance, instancesUpdate, instancesCreate, instancesStatusUpdate, adNetworkInstancesList, instancesSelectList } from '@/api/mediation'
import { getInstance, instancesUpdate, instancesStatusUpdate, adNetworkInstancesList } from '@/api/mediation'

import { mapState } from 'vuex'

export default {
  name: 'InstancePane',
  components: {
    OmFocus,
    OmAdNetworkSelect,
    OmInstanceSelect,
    AdNetwork,
    OmFormModel,
    ADNSelect,
    AdvancedCard,
    WaterfallTableInner,
    AddInstance,
    GuideModel
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    searchPlacement: state => state.publisher.searchPlacement,
    searchPlacementAbt: state => state.publisher.searchPlacementAbt,
    appInfo: state => state.publisher.appInfo
  }),
  props: {
    guideBidNum: {
      type: Number,
      default: 0
    }
  },
  watch: {
    bt_expand (n) {
      if (n) {
        this.data_bidding_show = this.data_bidding_original
      } else {
        this.data_bidding_show = this.setBiddingShowData()
      }
    },
    searchPlacement () {
      this.listSearch()
    },
    addModel (f) {
      if (f) {
        document.body.style.height = '100vh'
        document.body.style['overflow-y'] = 'hidden'
      } else {
        document.body.style.height = 'unset'
        document.body.style['overflow-y'] = 'auto'
      }
    }
  },
  data () {
    const checkPlacementKeybt = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('instance.unit_id_empty')))
        return false
      }
      const id = this.instanceInfo.id
      let flag = true
      this.data.forEach(ins => {
        if (ins.placementKey === value && ins.id === id) {
          callback()
          flag = false
        }
      })
      if (!flag) {
        return
      }
      getInstance({ placementKey: value, pubAppId: this.pubAppId, adnId: this.instanceInfo.adnId }).then(res => {
        if (res.data && res.data.length) {
          callback(new Error(this.$t('instance.placement_key_exits')))
        } else {
          callback()
        }
      })
    }
    return {
      instanceInfo: {
        name: '',
        placementKey: '',
        brandList: [],
        brandType: 'include',
        modelList: [],
        modelType: 'include'
      },
      curExpandedRowKeys: [],
      form: this.$form.createForm(this),
      adnIds: [],
      canEdit: this.$auth('adn.edit') && this.$route.query.type !== 'Details',
      isnewPlc: parseInt(localStorage.getItem('isnew_plc')) || 0,
      loading_bidding: false,
      loading_waterfall: false,
      pubAppId: this.$store.state.publisher.searchApp,
      data: [],
      columns_bidding: [
        {
          title: this.$t('comm.status'),
          dataIndex: 'status',
          width: '12%',
          sorter: (a, b) => a.status - b.status,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('mediation.AdNetwork'),
          dataIndex: 'adnName',
          width: '14%',
          sorter: (a, b) => {
            const aC = this.GLOBAL.getAdnName(a.adnId).slice(0, 1).toLowerCase()
            const bC = this.GLOBAL.getAdnName(b.adnId).slice(0, 1).toLowerCase()
            return aC.charCodeAt() - bC.charCodeAt()
          },
          scopedSlots: { customRender: 'adnName' }
        },
        {
          slots: { title: 'instanceTitle' },
          dataIndex: 'instance',
          width: '47%',
          sorter: (a, b) => a.name.localeCompare(b.name),
          scopedSlots: { customRender: 'instance' }
        },
        {
          title: this.$t('mediation.mediationRule'),
          width: '18%',
          sorter: (b, a) => a.relateRuleSize - b.relateRuleSize,
          scopedSlots: { customRender: 'mediationRule' }
        },
        {
          title: this.$t('comm.operations'),
          dataIndex: 'operations',
          scopedSlots: { customRender: 'operations' }
        }
      ],
      data_bidding_original: [],
      data_bidding_show: [],
      bt_curExpandedRowKeys: [],
      bt_expand: false,
      bt_status_true: 0,
      columns_waterfall: [
        {
          title: this.$t('comm.status'),
          dataIndex: 'status',
          width: '12%',
          sorter: (a, b) => a.status - b.status,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('mediation.AdNetwork'),
          dataIndex: 'adnName',
          width: '14%',
          sorter: (a, b) => {
            const aC = this.GLOBAL.getAdnName(a.adnId).slice(0, 1).toLowerCase()
            const bC = this.GLOBAL.getAdnName(b.adnId).slice(0, 1).toLowerCase()
            return aC.charCodeAt() - bC.charCodeAt()
          },
          scopedSlots: { customRender: 'adnName' }
        },
        {
          slots: { title: 'instanceTitle' },
          dataIndex: 'instance',
          width: '30%',
          sorter: (a, b) => a.name.localeCompare(b.name),
          scopedSlots: { customRender: 'instance' }
        },
        {
          title: this.$t('mediation.manualECPMS'),
          width: '17%',
          sorter: (a, b) => {
            if (a.instanceCountries && a.instanceCountries.length === 1 && b.instanceCountries && b.instanceCountries.length === 1) {
              return a.instanceCountries[0].manualEcpm - b.instanceCountries[0].manualEcpm
            } else if (a.instanceCountries && a.instanceCountries.length > 1 && b.instanceCountries && b.instanceCountries.length > 1) {
              return a.instanceCountries.length - b.instanceCountries.length
            } else if (a.instanceCountries && a.instanceCountries.length === 1 && b.instanceCountries && b.instanceCountries.length > 1) {
              return 1
            } else if (a.instanceCountries && !b.instanceCountries) {
              return 1
            } else {
              return -1
            }
          },
          scopedSlots: { customRender: 'eCPMFloor' }
        },
        {
          title: this.$t('mediation.mediationRule'),
          width: '18%',
          sorter: (b, a) => a.relateRuleSize - b.relateRuleSize,
          scopedSlots: { customRender: 'mediationRule' }
        },
        {
          title: this.$t('comm.operations'),
          dataIndex: 'operations',
          scopedSlots: { customRender: 'operations' }
        }
      ],
      data_waterfall: [],
      wf_curExpandedRowKeys: [],
      wf_status_true: 0,
      rules_bt: {
        name: [
          { required: true, message: this.$t('instance.name_empty'), trigger: 'change' }
        ],
        placementKey: [
          { validator: checkPlacementKeybt, trigger: 'change' }
        ]
      },
      rules_wf: {
        name: [
          { required: true, message: this.$t('instance.name_empty'), trigger: 'change' }
        ],
        placementKey: [
          { validator: checkPlacementKeybt, trigger: 'change' }
        ]
      },
      addModel: false,
      insSelectedVal: null
    }
  },
  mounted () {
    this.listSearch()
  },
  methods: {
    showRegionsformatInner (v) {
      return showRegionsformat(v)
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
    adnFilterChange (val) {
      if (val) {
        this.adnIds = [val]
      } else {
        this.adnIds = []
      }
      this.form.resetFields(['instanceId'])
      this.insSelectedVal = null
      this.listSearch()
    },
    insFilterChange (val) {
      if (val) {
        this.insSelectedVal = val
      } else {
        this.insSelectedVal = null
      }
      this.listSearch()
    },
    listSearch (f, down) {
      this.loadingOpen()
      const _this = this
      const params = { pubAppId: this.pubAppId, placementId: this.searchPlacement }
      // if (this.form.getFieldValue(['insAdnId'])) {
      //   params.adNetworkId = this.form.getFieldValue(['insAdnId']).sAdnId
      // }
      if (this.adnIds && this.adnIds.length) {
        params.adNetworkId = this.adnIds[0]
      }
      if (this.insSelectedVal) {
        params.instanceId = this.insSelectedVal
      }
      // adNetworkInstancesList(Object.assign(params, this.form.getFieldsValue(['instanceId'])))
      adNetworkInstancesList(params)
        .then(res => {
          if (res.code === 0) {
            this.abt = this.searchPlacementAbt
            this.arraySort(res.data)
            res.data.forEach(item => {
              if (item.instances) {
                item.instances.forEach(ins => {
                  ins.hbStatus = ins.hbStatus !== 0
                  ins.ecpmSatus = false
                  ins.editStatus = false
                  ins.expandStatus = false
                  ins.expandAdvanced = false
                })
                if (f === 'bt') {
                  this.setBiddingData(item.instances)
                } else if (f === 'wf') {
                  this.setWaterfallData(item.instances)
                } else {
                  this.setBiddingData(item.instances)
                  this.setWaterfallData(item.instances)
                }
              }
            })
            if (res.data && res.data.length) {
              this.arraySort(res.data[0].instances)
              this.data = res.data[0].instances
              if (down && down.dw) {
                try {
                  _this.$vnode.elm.querySelectorAll('.ant-table-body')[0].scrollTop = (_this.data.length - _this.data.filter((i) => i.status === 0).length) * 64 - 100
                } catch (e) {
                }
              }
            }
          }
        }).finally(() => {
          this.loadingClose()
        })
    },
    handleInstanceSave_bt (record) {
      this.$refs.instanceForm_bt.validate((b) => {
        if (b) {
          const item = { ...this.instanceInfo }
          item.placementKey = item.placementKey && item.placementKey.trim()
          item.brandWhitelist = item['brandType'] === 'include' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.brandBlacklist = item['brandType'] === 'exclude' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.modelWhitelist = item['modelType'] === 'include' && item['modelList'] ? item['modelList'].join('\n') : ''
          item.modelBlacklist = item['modelType'] === 'exclude' && item['modelList'] ? item['modelList'].join('\n') : ''
          // item.hbStatus = item.hbStatus ? 1 : 0
          item.hbStatus = 1
          item.pubAppId = this.searchApp
          instancesUpdate(item).then(res => {
            if (res.code === 0) {
              this.handleOpen_bt(record)
              this.listSearch('bt')
              // if (this.$route.query.newplc) {
              //   this.showAlert = true
              //   document.documentElement.scrollTop = 0
              // }
              this.$message.success(this.$t('instance.update_success'))
            }
          })
        }
      })
    },
    handleInstanceCancel_bt (record) {
      this.handleOpen_bt(record)
    },
    handleInstanceSave_wf (record) {
      this.$refs.instanceForm_wf.validate((b) => {
        if (b && this.checkRegionsEcpm()) {
          const item = { ...this.instanceInfo }
          item.placementKey = item.placementKey && item.placementKey.trim()
          item.brandWhitelist = item['brandType'] === 'include' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.brandBlacklist = item['brandType'] === 'exclude' && item['brandList'] ? item['brandList'].join('\n') : ''
          item.modelWhitelist = item['modelType'] === 'include' && item['modelList'] ? item['modelList'].join('\n') : ''
          item.modelBlacklist = item['modelType'] === 'exclude' && item['modelList'] ? item['modelList'].join('\n') : ''
          // item.hbStatus = item.hbStatus ? 1 : 0
          item.hbStatus = 0
          item.pubAppId = this.searchApp
          item.instanceCountries = record.instanceCountries
          instancesUpdate(item).then(res => {
            if (res.code === 0) {
              this.handleOpen_wf(record)
              this.listSearch('wf')
              // this.$refs.waterfalltableinner.resetNum()
              this.$message.success(this.$t('instance.update_success'))
            }
          })
        }
      })
    },
    checkRegionsEcpm () {
      let result = true
      try {
        if (!this.$refs.waterfalltableinner.checkRegionsEcpm()) {
          result = false
        }
      } catch (e) {
        console.log('dont find ref')
      }
      return result
    },
    handleInstanceCancel_wf (record) {
      record.instanceCountries = JSON.parse(JSON.stringify(record.instanceCountriesOrigin))
      this.$refs.waterfalltableinner.manualChangeData(record)
      this.$refs.waterfalltableinner.clearDisInfo()
      // this.$refs.waterfalltableinner.resetNum()
      this.handleOpen_wf(record)
    },
    setBiddingData (arr, expandFlag) {
      arr.sort(function (a, b) {
        return b.status - a.status
      })
      this.data_bidding_original = arr.filter(v => v.hbStatus !== false)
      if (this.data_bidding_original && this.data_bidding_original.length) {
        this.data_bidding_show = this.setBiddingShowData()
      } else {
        this.data_bidding_show = []
      }
      if (expandFlag) {
        this.data_bidding_show = this.data_bidding_original
      }
      this.setBtStatusTrue()
      this.changeBtExpand(!!expandFlag)
    },
    setBiddingShowData () {
      return this.data_bidding_original.slice(0, 2)
    },
    setBtStatusTrue () {
      // this.bt_status_true = this.data_bidding_original.filter(v => v.status !== 0).length
      this.bt_status_true = this.data_bidding_original.length
    },
    setWaterfallData (arr) {
      arr.sort(function (a, b) {
        return b.status - a.status
      })
      this.data_waterfall = arr.filter(v => v.hbStatus === false)
      this.data_waterfall.map(v => {
        v.instanceCountriesOrigin = JSON.parse(JSON.stringify(v.instanceCountries))
      })
      this.setWfStatusTrue()
    },
    setWfStatusTrue () {
      // this.wf_status_true = this.data_waterfall.filter(v => v.status !== 0).length
      this.wf_status_true = this.data_waterfall.length
    },
    instanceInfoChange (newO) {
      Object.assign(this.instanceInfo, newO)
    },
    handelInstanceStatusUpdate (record, f) {
      if (record.id) {
        // this.$set(record, 'loadingStatus', true)
        const status = (record.status === 0) ? 1 : 0
        instancesStatusUpdate({ status: status, instanceId: record.id }).then(res => {
          if (res.code === 0) {
            record.status = status
            if (!status) {
              record.relateRuleSize = 0
            }
            setTimeout(() => {
              if (f === 'bt') {
                this.data_bidding_original.map(v => {
                  if (v.id === record.id) {
                    v.status = status
                  }
                })
                this.setBiddingData(this.data_bidding_original, this.bt_expand)
              } else if (f === 'wf') {
                this.data_waterfall.sort(function (a, b) {
                  return b.status - a.status
                })
              }
            }, 350)
            this.$message.success(this.$t('instance.update_success'))
          }
        }).finally(() => {
          // record.loadingStatus = false
        })
      }
    },
    instanceAdd () {
      this.addModel = true
    },
    handleEdit_bt (record) {
      record.editStatus = true
      if (!record.expandStatus) {
        this.handleOpen_bt(record)
      } else {
        this.instanceInfo = JSON.parse(JSON.stringify(record))
      }
    },
    handleEdit_wf (record) {
      record.editStatus = true
      record.ecpmSatus = false
      if (!record.expandStatus) {
        this.handleOpen_wf(record)
      } else {
        this.instanceInfo = JSON.parse(JSON.stringify(record))
      }
    },
    handleOpen_bt (record) {
      record.expandAdvanced = false
      const oe = new OpenExpand(this.bt_curExpandedRowKeys, record, this.data_bidding_original)
      this.bt_curExpandedRowKeys = oe.getRowKeys()
      record = oe.getRecord()
      this.instanceInfo = JSON.parse(JSON.stringify(record))
    },
    handleOpen_wf (record) {
      record.expandAdvanced = false
      record.ecpmSatus = false
      const oe = new OpenExpand(this.wf_curExpandedRowKeys, record, this.data_waterfall)
      this.wf_curExpandedRowKeys = oe.getRowKeys()
      record = oe.getRecord()
      this.instanceInfo = JSON.parse(JSON.stringify(record))
    },
    toggleEcpm (record) {
      record.ecpmSatus = !record.ecpmSatus
      const oe = new OpenExpand(this.wf_curExpandedRowKeys, record, this.data_waterfall)
      this.wf_curExpandedRowKeys = oe.getRowKeys()
      record = oe.getRecord()
    },
    openAdvanced (record) {
      record.expandAdvanced = !record.expandAdvanced
    },
    triggerBtExpand () {
      this.bt_expand = !this.bt_expand
    },
    changeBtExpand (t) {
      this.bt_expand = t
    },
    loadingOpen () {
      this.loading_bidding = true
      this.loading_waterfall = true
    },
    loadingClose () {
      this.loading_bidding = false
      this.loading_waterfall = false
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
    changeManualECPM (d, record) {
      const tempArr = []
      d.forEach(v => {
        if (v.eCPM != null && v.eCPM !== '' && v.regions.length > 0) {
          tempArr.push({
            country: v.regions.join(','),
            manualEcpm: v.eCPM
          })
        }
      })
      record.instanceCountries = tempArr
    },
    goToWaterfall (record) {
      if (!record.relateRuleSize) return
      this.$emit('goToWaterfall', record)
    }
  }
}

</script>

<style lang='less' scoped>
@import '~ant-design-vue/dist/antd.less';
@bidding-color: #B28BD9;
@waterfall-color: #49ACF0;
.paneBox{
  min-height: 1000px;
  position: relative;
}
// .bt_form {
//   width: calc(100% + 32px);
//   // box-shadow: 0px 0px 4px red, 0px 4px 10px red;
//   position: absolute;
//   left: -16px;
//   background: greenyellow;
//   z-index: 90000;
// }
.bt_card {
  width: calc(100%);
  margin-right: 8px;
  border: none;
  border-left: 4px solid @bidding-color;
  box-shadow: 0px 0px 4px rgba(221, 224, 228, 0.3), 0px 4px 10px rgba(221, 224, 228, 0.3);
  // box-shadow: 0px 0px 4px red, 0px 4px 10px red;
  // position: relative;
  // left: 8px;
}
.wf_card {
  width: 100%;
  margin: 8px 8px 16px 0;
  border: none;
  border-left: 4px solid @waterfall-color;
  box-shadow: 0px 0px 4px rgba(221, 224, 228, 0.3), 0px 4px 10px rgba(221, 224, 228, 0.3);
}
.card_head {
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card_head_box {
    display: flex;
    align-items: center;
    .card_head_icon {
      width: 38px;
      height: 26px;
      border-radius: 0px 16px 16px 0px;
      display: flex;
      align-items: center;
      .iconfont{
        color: #ffffff!important;
        font-size: 14px!important;
        margin-left: 16px;
      }
    }
    .card_head_title {
      font-size: 14px;
      margin-left: 4px;
    }
  }
  .card_head_select {
   margin-right: 16px;
   font-size: 12px;
   color: #BDBDBD;
  }
}
.bt_head_icon {
  background: @bidding-color;
}
.bt_head_title {
  color: @bidding-color;
}
.wf_head_icon {
  background: @waterfall-color;
}
.wf_head_title {
  color: @waterfall-color;
}
.bt_tr_instanceName {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  .iconfont{
    color: @bidding-color!important;
    margin-left: 7px;
  }
}
.bt_tr_placementKey {
  font-size: 12px;
  line-height: 14px;
  color: #999999;
  margin-top: 4px;
}
.searchIcon{
  position: absolute;
  left: 130%;
  top: 2px;
  color: #999999!important;
}
.bidding_instance {
  display: flex;
  flex-direction: column;
}
.bt_expand_table {
  width: 100%;
  height: 31px;
  text-align: center;
  line-height: 31px;
  cursor: pointer;
  color: #1A7DF1;
}
.bt-expand-row{
  // padding: 32px 0;
  padding-top: 32px;
}
.expand-advanced{
  font-size: 14px;
  line-height: 18px;
  color: #1A7DF1;
  margin-top: 16px;
  margin-bottom: 32px;
  cursor: pointer;
  text-align: center;
}
/deep/ .ant-table-tbody > .ant-table-expanded-row > td{
  padding: 0!important;
}
.adnedit /deep/ .ant-table-expanded-row td {
  padding: 16px 16px 0 16px;
  position: relative;
  z-index: 1002;
  background-color: rgb(251, 251, 251);
}
.row-edit.row-manual {
  .multiple {
    cursor: pointer;
    color: #1A7DF1;
    display: flex;
    align-items: center;
  }
  .single {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .ecpm {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: #1A7DF1;
      cursor: pointer;
    }
    .text {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: #999999;
    }
  }
}
.row-mediationRule {
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #1A7DF1;
  & > div {
    cursor: pointer;
  }
  & > .disabledS {
    color: #999999;
    cursor: not-allowed;
  }
}
/deep/ .ant-table-tbody > tr > td.ant-table-column-sort {
  background: rgba(255, 255, 255, 1)!important;
}
/deep/ .ant-table-body .ant-table-tbody > tr.ant-table-row:hover {
  background: @item-hover-bg!important;
}
/deep/ .ant-table-body .ant-table-tbody > tr.ant-table-row:hover > td{
  background: @item-hover-bg!important;
}
.bidTheadshow /deep/ .ant-table-thead {
  position: relative;
  z-index: 1003;
}
</style>
