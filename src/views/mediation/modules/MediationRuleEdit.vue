<template>
  <a-spin :spinning="spinning" size="large">
    <OmFocus v-if="addModel" />
    <div v-if="guideRlFirst" @click="onGuideModel" style="background: black;width: 100vw;height: 100vh;position: fixed;top: 0;left: 0;opacity: 0.3;z-index: 1001;"></div>
    <add-instance
      v-if="addModel"
      :isNeedGroupLevel="true"
      @addInstancesCancel="()=> this.addModel = false"
      @refreshData="afterAddInstances"
    ></add-instance>
    <div v-show="!spinning" class="water-fall" style="position: relative;">
      <OmPageAction :has-change="hasChange" :loading="loading" @save="segmentSave" :canEdit="canEdit"/>
      <page-header-placement />
      <GuideModel
        :visible="guideRlNum === 0"
        placement="bottomLeft"
        top="-5px"
        left="-60px"
        :type="1"
        :linkUrl="`${ $i18n.locale === 'zhCN' ? 'https://support.openmediation.com/hc/zh-cn/articles/360050663934-搭建聚合规则体系' : 'https://support.openmediation.com/hc/en-us/articles/360050663934-Mediation-rule-settings' }`"
        :guideTitle="$t('mediation.guide_t8_tip')"
        :guideContent="$t('mediation.guide_c8_tip')"
        @nextGuideNum="() => guideRlNum++"
        @closeGuide="closeGuide"
        @laterGuide="laterGuide"
      />
      <a-form-model ref="ruleForm" :model="mediationRuleInfo" :rules="rules" :hideRequiredMark="true">
        <a-card class="card-noline om-card-style" :title="$t('mediation.basicInformation')" :bordered="false" >
          <om-form-model field="name" :label="$t('comm.name')" :tip="this.$t('mediation.rule_name_tip')">
            <a-input :max-length="500" :placeholder="$t('comm.name')" v-model="mediationRuleInfo.name" />
          </om-form-model>
          <!-- <om-form-model field="autoOpt" :label="$t('mediation.optimizedType')" :tip="this.$t('mediation.optimized_type_tip')">
            <a-select :label="$t('ab.manual')" v-model="mediationRuleInfo.autoOpt" >
              <a-select-option :value="0">{{ $t('ab.manual') }}</a-select-option>
              <a-select-option :value="1">{{ $t('ab.auto') }}</a-select-option>
            </a-select>
          </om-form-model> -->
          <om-form-model :label="$t('comm.regions')" field="regions" :tip="this.$t('mediation.regions_tip')">
            <regions-select
              mode="multiple"
              :default-selected="mediationRuleInfo.regions"
              @change="(v)=>{mediationRuleInfo.regions=v}"
              style="width: 100%"/>
          </om-form-model>
          <om-form-model :label="$t('mediation.tracking_allowed')" field="appTracking" :tip="mediationRuleInfo.appTracking ? this.$t('mediation.app_tracking_allowed_tip_on') : this.$t('mediation.app_tracking_allowed_tip_off')">
            <a-switch v-model="mediationRuleInfo.appTracking" >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
            {{ mediationRuleInfo.appTracking? $t('mediation.app_tracking_open'): $t('mediation.app_tracking_close') }}
          </om-form-model>
          <om-form-model :label="$t('ab.channel')" field="channel" :fill="false">
            <a-input-group style="width:100%" compact>
              <a-select v-model="mediationRuleInfo.channelBow">
                <a-select-option :value="1">{{ $t('placements.include') }}</a-select-option>
                <a-select-option :value="0">{{ $t('placements.exclude') }}</a-select-option>
              </a-select>
              <a-select allowClear v-model="mediationRuleInfo.channel" mode="tags" style="width: 73%">
              </a-select>
            </a-input-group>
          </om-form-model>
          <a-row style="margin-bottom: 16px;">
            <!-- <a-col :span="8" style="text-align: right; padding-right: 8px;"><a @click="visible = !visible">Advanced Options <img src="/icon/d.svg"></a></a-col> -->
            <a-divider></a-divider>
            <a-col :span="24" style="text-align: center; padding-right: 8px;"><a @click="visible = !visible">{{ $t('mediation.advancedOptions') }} <span class="iconfont">{{ visible ? '&#xe603;' : '&#xe602;' }}</span></a></a-col>
            <!-- <a-col :span="16"></a-col> -->
            <!-- <a-divider><a @click="visible = !visible">{{ $t('mediation.advancedOptions') }} <span class="iconfont">{{ visible ? '&#xe603;' : '&#xe602;' }}</span></a></a-divider> -->
          </a-row>
          <div v-show="visible" style="background-color: #FBFBFB; padding: 16px 0 16px 0;">
            <om-form-model :label="$t('mediation.appVersions')" field="appvExp" :fill="false" :tip="$t('mediation.appv_exp_tip')" >
              <a-input placeholder="e.g.1.0.1;1.0.2" :max-length="100" style="width:100%" v-model="mediationRuleInfo.appvExp"/>
            </om-form-model>
            <om-form-model :label="$t('mediation.OSVersions')" :fill="false" field="osvmin" :tip="$t('mediation.osv_exp_tip')">
              <OsVersion
                :plat="currentAppInfo().plat"
                @change="(v)=>{mediationRuleInfo.osvmin=v}"
                :max="mediationRuleInfo.osvmax"
                :default-value="mediationRuleInfo.osvmin"
                :hint="$t('comm.minimum')"
                :type="0"
                style="width: 150px;"/> ~
              <a-form-model-item prop="osvmax" style="display: inline-block;margin-bottom: 16px;"><OsVersion
                :min="mediationRuleInfo.osvmin"
                :default-value="mediationRuleInfo.osvmax"
                @change="(v)=>{
                  mediationRuleInfo.osvmax=v
                }"
                @maxv="(v)=>{maxv=v}"
                style="width: 150px"
                :plat="currentAppInfo().plat"
                :type="1"
                :hint="$t('comm.maximum')" /></a-form-model-item>
            </om-form-model>
            <om-form-model :label="$t('mediation.SDKVersions')" style="margin-top: -16px;" field="sdkvExp" :fill="false" :tip="$t('mediation.sdkv_exp_tip')" >
              <a-input :max-length="100" placeholder="e.g.1.0.1;1.0.2" style="width:100%" v-model="mediationRuleInfo.sdkvExp"/>
            </om-form-model>
            <om-form-model :label="$t('mediation.frequency')" field="frequency" :fill="false" :tip="$t('mediation.frequency_tip')" >
              <a-input-number
                ref="iap-min"
                style="width:100%"
                type="number"
                :min="0"
                :max="500"
                v-model="mediationRuleInfo.frequency"/>
            </om-form-model>
            <om-form-model
              :label="$t('mediation.IAPUSD')"
              field="iap"
              :tip="$t('mediation.iap_tip')"
              :fill="false">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="9999"
                  ref="iapmin"
                  @change="(v)=>iap[0]=v"
                  v-model="mediationRuleInfo.iapMin"
                  style=" width: 100px; text-align: center"
                  :placeholder="$t('comm.minimum')" />
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
                  :placeholder="$t('comm.maximum')" />
              </a-input-group>
            </om-form-model>
            <om-form-model :label="$t('mediation.gender')" field="gender" :tip="$t('mediation.gender_tip')" :fill="false">
              <a-checkbox-group v-model="mediationRuleInfo.gender">
                <a-checkbox :value="0">{{ $t('mediation.male') }}</a-checkbox>
                <a-checkbox :value="1">{{ $t('mediation.female') }}</a-checkbox>
              </a-checkbox-group>
            </om-form-model>
            <om-form-model
              :label="$t('mediation.age')"
              field="age"
              :tip="this.$t('mediation.age_tip')"
              :fill="false">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="200"
                  ref="agemin"
                  @change="(v)=>age[0]=v"
                  v-model="mediationRuleInfo.ageMin"
                  style=" width: 100px; text-align: center"
                  :placeholder="$t('comm.miniage')" />
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
                  :placeholder="$t('comm.maxiage')" />
              </a-input-group>
            </om-form-model>
            <om-form-model :label="$t('mediation.connectionTypes')" field="conType" :fill="false" :tip="this.$t('mediation.contype_tip')" >
              <a-select :placeholder="$t('mediation.connectionTypes')" v-model="mediationRuleInfo.conType" mode="multiple">
                <a-select-option :value="0">WIFI</a-select-option>
                <a-select-option :value="1">2G</a-select-option>
                <a-select-option :value="2">3G</a-select-option>
                <a-select-option :value="3">4G</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model :label="$t('mediation.modelType')" field="modelType" :fill="false" :tip="this.$t('mediation.model_type_tip')" >
              <a-select :placeholder="$t('mediation.modelType')" v-model="mediationRuleInfo.deviceModelType" mode="multiple" style="width: 100%;">
                <a-select-option :value="0">Phone</a-select-option>
                <a-select-option :value="1">Pad</a-select-option>
                <a-select-option :value="2">TV</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model :label="$t('mediation.deviceBrand')" field="brand" :tip="this.$t('mediation.brand_tip')" :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.brandType">
                  <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
                  <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  @search="selectBrand"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.brandList"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in deviceBrandData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </om-form-model>
            <om-form-model :label="$t('mediation.deviceModel')" field="model" :tip="this.$t('mediation.model_tip')" :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.modelType">
                  <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
                  <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  @search="selectModel"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.modelList"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in deviceModelData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </om-form-model>
            <om-form-model :label="$t('mediation.customTags')" :fill="false" field="customParams">
              <a-table
                v-if="customList.length"
                rowKey="id"
                style="margin-top: 8px;margin-bottom: 8px;border: 1px solid #D8D8D8;width: 740px"
                :dataSource="customList"
                ref="table"
                size="default"
                :pagination="false"
                :columns="customColumn">
                <span slot="name" slot-scope="text, record">
                  <a-input :placeholder="$t('ab.enterName')" v-model="record.name" />
                </span>
                <span slot="type" slot-scope="text, record">
                  <a-select v-model="record.type" @change="record.value=''" :placeholder="$t('comm.select')">
                    <a-select-option :value="0">String</a-select-option>
                    <a-select-option :value="1">Integer</a-select-option>
                    <a-select-option :value="2">Float</a-select-option>
                  </a-select>
                </span>
                <span slot="operator" slot-scope="text, record">
                  <a-select v-model="record.operator" :placeholder="$t('comm.select')">
                    <a-select-option value=">">Greater than</a-select-option>
                    <a-select-option value=">=">Greater or equal to</a-select-option>
                    <a-select-option value="<">Less than</a-select-option>
                    <a-select-option value="<=">Less or equal to</a-select-option>
                    <a-select-option value="=">Equals</a-select-option>
                    <a-select-option value="!=">Not equals</a-select-option>
                    <a-select-option value="in">In</a-select-option>
                    <a-select-option value="notin">Not in</a-select-option>
                  </a-select>
                </span>
                <span slot="value" slot-scope="text, record">
                  <a-textarea v-if="record.type===0" placeholder="e.g.1.0.1" auto-size v-model="record.value" />
                  <a-input-number v-else v-model="record.value" />
                </span>
                <span slot="remove" slot-scope="text">
                  <img src="/icon/Button-Delete.svg" @click="customList.splice(customList.findIndex(row=>row.id===text), 1)">
                </span>
              </a-table>
              <a-button
                type="dashed"
                ghost
                :disabled="!!customList.find(row=>{return !row.name || !row.operator || !row.value})"
                style="width: 240px; height: 32px;"
                @click="addCustomTag">+ {{ $t('mediation.addParameter') }}</a-button>
            </om-form-model>
          </div>
        </a-card>
        <a-card class="card-noline om-card-style" :bordered="false" style="margin-top:8px;" >
          <a-form :form="form" :hideRequiredMark="true">
            <a-row type="flex" justify="start" style="height: 44px;margin-top:16px;position: relative;">
              <OmAdNetworkSelect
                name="adnetworkSelect"
                :pubAppId="appId"
                @change="adnChange"
                size="default"
                width="180px"
                style="margin-left:24px;margin-right:8px; display:inline-block; "/>
              <OmInstanceSelect
                name="instanceSelect"
                @change="insSelectChange"
                :adnIds="adnIds"
                :hb="true"
                :allowClear="true"
                width="180px"
                modelName="instanceId"
                :placementId="this.placementId" />
              <a-form-item :style=" guideRlNum === 2 ? `position: relative; z-index: 1003;` : ``">
                <RegionsSelect :defaultSelected="resionDefaultArrs" @change="regoinsSelectedId" size="default" style="margin-left: 8px;margin-top:2px;width:180px;" />
                <GuideModel
                  :visible="guideRlNum === 2"
                  :totalNum="3"
                  :currentNum="2"
                  :type="3"
                  placement="bottomLeft"
                  top="30px"
                  left="50px"
                  :guideTitle="$t('mediation.guide_t10_tip')"
                  :guideContent="$t('mediation.guide_c10_tip')"
                  @preGuideNum="() => guideRlNum--"
                  @nextGuideNum="() => guideRlNum++"
                  @closeGuide="closeGuide"/>
              </a-form-item>
              <a-form-item>
                <DaysSelect ref="daySelect" style="margin-left: 8px;" @change="daysSelectedId" size="default"/>
              </a-form-item>
              <div :style="`position: absolute; right: 24px; top: 4px; ${ guideRlNum === 1 ? 'z-index: 1003' : '' }`">
                <a-button type="primary" ghost @click="instanceAdd"><span class="iconfont" style="margin-right: 4px;">&#xe609;</span>{{ $t('mediation.AddInstance') }}</a-button>
                <GuideModel
                  :visible="guideRlNum === 1"
                  :totalNum="3"
                  :currentNum="1"
                  :type="2"
                  placement="bottomRight"
                  top="28px"
                  left="120px"
                  :guideTitle="$t('mediation.guide_t9_tip')"
                  :guideContent="$t('mediation.guide_c9_tip')"
                  :guideImg="$i18n.locale === 'zhCN' ? '/mediation/zh/rule.webp' : '/mediation/en/rule.webp'"
                  @preGuideNum="() => guideRlNum--"
                  @nextGuideNum="() => guideRlNum++"
                  @closeGuide="closeGuide"/>
              </div>
            </a-row>
          </a-form>
          <a-divider style="margin-top: 12px;"></a-divider>
          <a-spin :spinning="fetching">
            <ZeroTip :width="$i18n.locale === 'zhCN' ? '650px' : '882px'" top="16px" bottom="16px" v-if="!!ruleId"/>
            <BiddingPane ref="biddingPane" :dataSources="dataSources_bidding"/>
            <WaterfallPane
              ref="waterfallPane"
              :dataSources="dataSources_waterfall"
              :waterfallRefresh="waterfallRefresh"
              :initAuto="!!ruleId"
              :regionsTier="regionsTier"
              :guideRlNum="guideRlNum"
              @addEndableInstance="instanceAdd"
              @preGuideNum="() => guideRlNum--"
              @nextGuideNum="() => guideRlNum++"
              @closeGuide="closeGuide"
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
import AdNetwork from '@/components/om/AdNetwork'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmInstanceSelect from './InstanceSelect'
import WaterfallTable from './WaterfallTable'
import WaterfallPane from './WaterfallPane'
import BiddingPane from './BiddingPane'
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'
import numerify from 'numerify'
import OmPageAction from '@/components/OmPageAction'
import OmFormModel from '@/components/OmFormModel'
import { mapState } from 'vuex'
import RegionsSelect from '@/components/om/RegionsSelect'
import { modelSearch, brandSearch } from '@/api/publisher'
import OsVersion from '@/views/campaign/OsVersion'
import { arrDiff } from '@/utils/util'
import { generateUUID } from 'ant-design-vue/lib/vc-select/util'
import DaysSelect from './DaysSelect'
import OmFocus from '@/components/OmFocus'
import AddInstance from './AddInstances'
import GuideModel from './GuideModel'
import ZeroTip from './ZeroTip'
import { getGuideInfo, setGuideInfo } from './utils'

const VERSION_RANGE_REG_EX = /^[[(]([^,]+)?,([^,]+)?[)\]]$/i

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
    RegionsSelect,
    OsVersion,
    WaterfallPane,
    BiddingPane,
    DaysSelect,
    OmFocus,
    AddInstance,
    GuideModel,
    ZeroTip
  },
  data () {
    const type = this.$route.query.type
    const columnsHB = [
      {
        title: this.$t('mediation.AdNetwork'),
        dataIndex: 'className',
        width: '40%',
        scopedSlots: { customRender: 'className' }
      },
      {
        title: this.$t('mediation.instances'),
        dataIndex: 'name',
        width: '40%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: this.$t('comm.operations'),
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      }
    ]
    const customColumn = [
      {
        title: this.$t('comm.name'),
        dataIndex: 'name',
        width: 200,
        scopedSlots: { customRender: 'name' }
      },
      {
        title: this.$t('mediation.dataType'),
        dataIndex: 'type',
        width: 150,
        scopedSlots: { customRender: 'type' }
      },
      {
        title: this.$t('mediation.operator'),
        dataIndex: 'operator',
        width: 200,
        scopedSlots: { customRender: 'operator' }
      },
      {
        title: this.$t('mediation.value'),
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      },
      {
        title: '',
        width: 10,
        dataIndex: 'id',
        scopedSlots: { customRender: 'remove' }
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
    const validateCustomParams = (rule, value, callback) => {
      if (!this.customList) {
        callback()
      } else {
        callback()
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
      customList: [],
      customColumn,
      lastFetchId: 0,
      fetching: false,
      value: [],
      iap: [],
      age: [],
      maxv: null,
      smaxv: null,
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
        gender: [],
        requireDid: undefined,
        appTracking: false,
        osvmax: undefined,
        osvmin: undefined,
        sdkmax: undefined,
        sdkmin: undefined,
        sdkvExp: undefined,
        appvExp: undefined
      },
      rules: {
        name: [
          { required: true, whitespace: true, message: this.$t('mediation.name_empty'), trigger: 'change' }
        ],
        regions: [
          { required: true, message: this.$t('mediation.regions_empty'), trigger: 'change' }
        ],
        iap: [
          { validator: validateIap, trigger: 'change' }
        ],
        age: [
          { validator: validateAge, trigger: 'change' }
        ],
        customParams: [
          { validator: validateCustomParams, trigger: 'change' }
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
      regionsTier: [],
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
      changeInstance: false,
      dataSources_bidding: [],
      dataSources_waterfall: [],
      waterfallRefresh: 0,
      daysSelected: 1,
      addModel: false,
      resionDefaultArrs: null,
      dataSources_waterfall_copy: [],
      form: this.$form.createForm(this),
      guideRlFirst: false,
      guideRlNum: -1,
      isSaving: false
    }
  },
  computed: mapState({
    isNgp: state => state.user.info.isNgp,
    apps: state => state.publisher.apps,
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    addModel (f) {
      if (f) {
        document.documentElement.scrollTop = 0
        document.body.style.height = '100vh'
        document.body.style['overflow-y'] = 'hidden'
      } else {
        document.body.style.height = 'unset'
        document.body.style['overflow-y'] = 'auto'
      }
    }
  },
  mounted () {
    if (this.ruleId) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      segmentGet(params).then(res => {
        if (res.code) {
          this.$message.error(`${res.code}, ${res.msg}`)
          return
        }
        this.segmentId = res.data.segmentId
        if (res.data.countries) {
          if (res.data.countries && res.data.countries.indexOf('00') > -1) {
            res.data.countries.splice(res.data.countries.indexOf('00'), 1)
            res.data.countries.push('ALL')
          }
          res.data.regions = res.data.countries
        }
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
        const arr = VERSION_RANGE_REG_EX.exec(res.data.osvExp)
        if (arr) {
          this.mediationRuleInfo.osvmin = arr.length > 1 && arr[1] || undefined
          this.mediationRuleInfo.osvmax = arr.length > 2 && arr[2] || undefined
        }
        this.customList = this.parseCustomTags(res.data.customTags)
        this.mediationRuleInfo.appTracking = !!res.data.requireDid
        Object.assign(this.mediationRuleInfo, res.data)
        this.oldData = JSON.parse(JSON.stringify(this.mediationRuleInfo))
        this.oldData.customList = JSON.parse(JSON.stringify(this.customList))
        this.spinning = false
      }).finally(() => {
        this.spinning = false
      })
    }
    this.search()
    setTimeout(() => {
      if (!getGuideInfo('rl') && !getGuideInfo('rl_l')) {
        this.guideRlFirst = true
        this.guideRlNum = 0
      }
    }, 1000)
  },
  methods: {
    onGuideModel () {
      this.guideRlNum++
      if (this.guideRlNum === 4) {
        this.closeGuide()
      }
    },
    closeGuide () {
      setGuideInfo('rl', 1)
      this.closeGuideModel()
    },
    laterGuide () {
      setGuideInfo('rl_l', 1)
      this.closeGuideModel()
    },
    closeGuideModel () {
      this.guideRlNum = -1
      this.guideRlFirst = false
    },
    afterAddInstances (datas) {
      const dataSourcesBiddingTemp = []
      const dataSourcesWaterfallTemp = []
      let originDatas = []
      if (datas.length) {
        this.form.resetFields(['adnetworkSelect'])
        this.form.resetFields(['instanceSelect'])
        this.adnIds = []
        this.instanceIds = []
        if (this.waterfallRefresh === 1) {
          originDatas = this.getInstanceFromReamin()
        } else {
          originDatas = this.getInstanceFromTier()
        }
        this.waterfallRefresh = 0
      }
      setTimeout(() => {
        datas.forEach(row => {
          this.setRowData(row)
          row.priority = 1
          row.newItem = true
          if (row.hbStatus === 1) {
            dataSourcesBiddingTemp.push(row)
          } else {
            row.editPriority = false
            dataSourcesWaterfallTemp.push(row)
          }
        })
        if (dataSourcesBiddingTemp.length) {
          this.dataSources_bidding = this.dataSources_bidding.concat(dataSourcesBiddingTemp)
        }
        if (dataSourcesWaterfallTemp.length) {
          this.dataSources_waterfall = originDatas.concat(dataSourcesWaterfallTemp)
        }
      }, 0)
    },
    instanceAdd () {
      this.addModel = true
    },
    addCustomTag () {
      const id = generateUUID()
      this.customList.push({ id, name: '', type: 0, operator: undefined, value: '' })
    },
    parseCustomTags (json) {
      const list = []
      if (!json) return list
      try {
        const o = JSON.parse(json)
        for (const [k, v] of Object.entries(o)) {
          const { type, conditions } = v
          for (const cond of conditions) {
            const { operator, value } = cond
            const id = generateUUID()
            list.push({ id, name: k, type, operator, value })
          }
        }
      } catch (e) {
        console.warn('parse customTags error', e)
      }
      return list
    },
    stringifyCustomTags (list) {
      const o = {}
      for (const l of list) {
        const { name, type, operator, value } = l
        let v = o[name]
        if (!v) {
          v = o[name] = { type, conditions: [] }
        }
        v.conditions.push({ operator, value })
      }
      return JSON.stringify(o)
    },
    currentAppInfo () {
      if (this.apps.length && this.searchApp) {
        return this.apps.find(row => row.id === this.searchApp)
      }
    },
    hourChange (val) {
      this.hourBefore = val
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
      const tempCountries = JSON.parse(JSON.stringify(this.regionsTier))
      if (this.regionsTier && this.regionsTier.indexOf('ALL') > -1) {
        tempCountries.splice(tempCountries.indexOf('ALL'), 1)
        tempCountries.push('00')
      }
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      const formSearch = { instanceId: this.instanceIds, adnId: this.adnIds, countries: tempCountries.join(','), lastDays: this.daysSelected }
      this.fetching = true
      if (formSearch.instanceId) {
        params.instanceId = formSearch.instanceId
      }
      if (formSearch.adnId) {
        params.adNetworkIds = formSearch.adnId.join(',')
      }
      if (formSearch.countries) {
        params.countries = formSearch.countries
      }
      if (formSearch.lastDays) {
        params.lastDays = formSearch.lastDays
      }
      if (!type) {
        mediationRuleInstanceList(params).then(res => {
          if (!res.code) {
            res.data.forEach(row => {
              this.setRowData(row)
              if (row.hbStatus === 1) {
                if (!row.priority) {
                  row.priority = 0
                }
                this.dataSources_bidding.push(row)
              } else {
                row.editPriority = false
                this.dataSources_waterfall.push(row)
              }
            })
          }
        }).finally(() => {
          this.fetching = false
          this.spinning = false
        })
        console.log(this.dataSources_waterfall)
        this.dataSources_waterfall_copy = JSON.parse(JSON.stringify(this.dataSources_waterfall))
      } else {
        const dataSourcesBiddingTemp = []
        const dataSourcesWaterfallTemp = []
        if (params.instanceId > 0 || formSearch.adnId.length) {
          this.waterfallRefresh = 1
        } else if (this.waterfallRefresh === 1) {
          this.waterfallRefresh = 2
        } else {
          this.waterfallRefresh = 0
        }
        mediationRuleInstanceList(params).then(res => {
          if (!res.code) {
            res.data.forEach(row => {
              this.setRowData(row)
              if (row.hbStatus === 1) {
                if (!row.priority) {
                  row.priority = 0
                }
                dataSourcesBiddingTemp.push(row)
              } else {
                row.editPriority = false
                dataSourcesWaterfallTemp.push(row)
              }
            })
            if (this.waterfallRefresh !== 0) {
              this.dataSources_waterfall = dataSourcesWaterfallTemp
            } else {
              this.$refs['waterfallPane'].filterData(dataSourcesWaterfallTemp)
            }
            this.dataSources_bidding = dataSourcesBiddingTemp
          }
        }).finally(() => {
          this.fetching = false
          this.spinning = false
        })
      }
    },
    setRowData (row) {
      // watfall
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
      if (row.mediationImprLatest) {
        row.impressionGrowth = numerify(row.mediationImprLatest / (row.mediationImprSecondLatest || 1) - 1, '0,0.00a%')
      } else {
        row.impressionGrowth = '--'
      }
      // bidding
      row.bidRate = row.bidRequestLatest > 0 ? row.bidResponseLatest / row.bidRequestLatest : 0
      row.bidRate2 = row.bidRequestSecondLatest > 0 ? row.bidResponseSecondLatest / row.bidRequestSecondLatest : 0
      row.winRate = row.bidResponseLatest > 0 ? row.bidWinLatest / row.bidResponseLatest : 0
      row.winRate2 = row.bidResponseSecondLatest > 0 ? row.bidWinSecondLatest / row.bidResponseSecondLatest : 0
      row.bidEcpm = row.bidImpressionLatest > 0 ? row.bidWinPriceLatest / row.bidImpressionLatest : 0
      row.bidEcpm2 = row.bidImpressionSecondLatest > 0 ? row.bidWinPriceSecondLatest / row.bidImpressionSecondLatest : 0
      if (row.bidRequestLatest) {
        row.bidRequestGrowth = numerify(row.bidRequestLatest / (row.bidRequestSecondLatest || 1) - 1, '0,0.00a%')
      } else {
        row.bidRequestGrowth = '--'
      }
      if (row.bidRate2) {
        row.bidRateGrowth = numerify(row.bidRate / (row.bidRate2 || 1) - 1, '0,0.00a%')
      } else {
        row.bidRateGrowth = '--'
      }
      if (row.bidWinLatest) {
        row.bidWinGrowth = numerify(row.bidWinLatest / (row.bidWinSecondLatest || 1) - 1, '0,0.00a%')
      } else {
        row.bidWinGrowth = '--'
      }
      if (row.bidImpressionLatest) {
        row.bidImpressionGrowth = numerify(row.bidImpressionLatest / (row.bidImpressionSecondLatest || 1) - 1, '0,0.00a%')
      } else {
        row.bidImpressionGrowth = '--'
      }
      if (row.bidClickLatest) {
        row.bidClickGrowth = numerify(row.bidClickLatest / (row.bidClickSecondLatest || 1) - 1, '0,0.00a%')
      } else {
        row.bidClickGrowth = '--'
      }
      // bidWinPriceLatest bidWinPriceSecondLatest
      if (row.winRate) {
        row.winRateGrowth = numerify(row.winRate / (row.winRate2 || 1) - 1, '0,0.00a%')
      } else {
        row.winRateGrowth = '--'
      }
      if (row.bidEcpm) {
        row.bidEcpmGrowth = numerify(row.bidEcpm / (row.bidEcpm2 || 1) - 1, '0,0.00a%')
      } else {
        row.bidEcpmGrowth = '--'
      }
    },
    search2 (type) {
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
      const _this = this
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
              if (row.hbStatus === 1) {
                if (!row.priority) {
                  row.priority = 0
                }
                hb.push(row)
              } else {
                if (row.placementRuleInstanceId > 0) {
                } else {
                  row.placementRuleInstanceId = _this.count
                  _this.count--
                }
                ins.push(row)
              }
            })
            _this.instances = ins
            _this.templist = JSON.parse(JSON.stringify(ins))
            _this.headerbidding = hb
          }
        }).finally(() => {
          _this.fetching = false
          _this.spinning = false
        })
      } else {
        // 本地查询
        this.templist = JSON.parse(JSON.stringify(this.instances))
        if (params.instanceId > 0 || formSearch.adnId.length) {
          this.waterfallRefresh = 1
        } else {
          this.waterfallRefresh = 2
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

            _this.instances.forEach(d => {
              Object.assign(d, ins.find(item => item.id === d.id))
            })
            _this.templist.forEach(d => {
              Object.assign(d, ins.find(item => item.id === d.id))
            })
          }
        }).finally(() => {
          _this.fetching = false
          _this.spinning = false
        })
      }
    },
    getInstanceFromReamin () {
      let result = []
      let waterfallArrs = []
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierRemainData(1))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierRemainData(2))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierRemainData(3))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].dataSources_tier_remain_d)
      result = result.concat(waterfallArrs)
      return result
    },
    getInstanceFromTier () {
      let result = []
      let waterfallArrs = []
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierData(1))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierData(2))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].getTierData(3))
      waterfallArrs = waterfallArrs.concat(this.$refs['waterfallPane'].dataSources_tier_d)
      result = result.concat(waterfallArrs)
      return result
    },
    getBiddingFromTier () {
      return this.$refs['biddingPane'].getTierData()
    },
    segmentSave () {
      if (this.isSaving) {
        return
      }
      this.isSaving = true
      setTimeout(() => {
        this.isSaving = false
      }, 5000)
      this.loading = true
      const params = { pubAppId: this.appId, placementId: this.placementId }
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
      if (this.customList.length) {
        let flagT = true
        this.customList.forEach(v => {
          if (!v.name) {
            flagT = false
            this.$message.error("Custom Tags Name can't empty!")
          } else if (!v.operator) {
            flagT = false
            this.$message.error("Custom Tags Data Type can't empty!")
          } else if (!v.value) {
            this.$message.error("Custom Tags Value can't empty!")
            flagT = false
          }
        })
        if (flagT) {
          values.customTags = this.stringifyCustomTags(this.customList)
        } else {
          return false
        }
      } else {
        values.customTags = ''
      }
      values.pubAppId = this.appId
      values.placementId = this.placementId
      let ct = 0
      for (const i in values.conType) { ct |= (1 << values.conType[i]) }
      if (values.channel && values.channel.length) {
        values.channel = values.channel.join(',')
        if (values.channel.length > 1000) {
          this.$message.error(this.$t('mediation.channel_too_long'))
          return false
        }
      } else {
        values.channel = ''
      }
      values.conType = ct
      let mt = 0
      for (const i in values.deviceModelType) { mt |= (1 << values.deviceModelType[i]) }
      values.deviceModelType = mt
      let gd = 0
      for (const i in values.gender) { gd |= (1 << values.gender[i]) }
      values.gender = gd
      values.brandWhitelist = values.brandType === 'include' && values.brandList ? values.brandList.join('\n') : ''
      values.brandBlacklist = values.brandType === 'exclude' && values.brandList ? values.brandList.join('\n') : ''
      values.modelWhitelist = values.modelType === 'include' && values.modelList ? values.modelList.join('\n') : ''
      values.modelBlacklist = values.modelType === 'exclude' && values.modelList ? values.modelList.join('\n') : ''
      // const countries = values.regions
      const countries = values.regions
      if (countries && countries.indexOf('ALL') > -1) {
        countries.splice(countries.indexOf('ALL'), 1)
        countries.push('00')
      }
      values.countries = countries && countries.join(',')
      Object.assign(params, values)
      // params.instances = this.instances
      params.instances = this.getInstanceFromTier()
      params.headerbidding = this.getBiddingFromTier()
      let osv = '[' + values.osvmin + ','
      if (values.osvmax === this.maxv) {
        osv = osv + ')'
      } else if (values.osvmax === undefined) {
        osv = osv + ')'
      } else {
        osv = osv + values.osvmax + ']'
      }
      params.osvExp = osv
      params.requireDid = values.appTracking ? 1 : 0

      if (this.ruleId && this.type !== 'Duplicate') {
        params.id = this.ruleId
        params.segmentId = this.segmentId
        segmentUpdateWithInstance(params).then(res => {
          if (res.code === 0) {
            this.$message.success(this.$t('mediation.update_success'))
            this.$router.push({
              name: 'Mediation',
              query: {
                type: '2'
              }
            })
          }
        }).finally(() => { this.loading = false })
      } else {
        params.id = -100
        segmentUpdateWithInstance(params).then(res => {
          if (res.code === 0) {
            this.ruleId = res.data.id
            this.$router.push({
              name: 'Mediation',
              query: {
                type: '2'
              }
            })
            this.$message.success(this.$t('mediation.create_success'))
          }
        }).finally(() => { this.loading = false })
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
      // const { channel, channelBow } = this.oldData
      // const normalFields = ['name', 'autoOpt', 'frequency', 'iapMin', 'brandType', 'brandList', 'modelType', 'modelList', 'gender', 'ageMax', 'ageMin', 'conType', 'deviceModelType', 'regions']
      try {
        for (const f of Object.keys(temp)) {
          if (f === 'osvmax') continue
          if (Array.isArray(temp[f])) {
            if (arrDiff(temp[f], this.oldData[f])) {
              return true
            }
          } else {
            if (temp[f] !== this.oldData[f]) {
              return true
            }
          }
        }
        if (arrDiff(this.customList, this.oldData.customList)) {
          return true
        }
        // if (this.isNgp) {
        //   if (temp.channel !== channel) {
        //     return true
        //   }
        //   if (temp.channelBow !== channelBow) {
        //     return true
        //   }
        // }
      } catch (e) {
        return true
      }
      return false
    },
    instanceHbStatusUpdate (record) {
      this.changeInstance = true
      const status = record.priority > 0 ? 0 : 1
      if (status === 1) {
        if (this.headerbidding.find(row => { return row.adnId === record.adnId && row.priority > 0 })) {
          this.$message.error(this.$t('mediation.already_existed_hb'))
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
    },
    adnChange (val) {
      this.adnIds = val
      this.instanceIds = []
      this.search(true)
    },
    insSelectChange (val) {
      this.instanceIds = val
      this.search(true)
    },
    regoinsSelectedId (val) {
      this.regionsTier = val
      this.search(true)
    },
    daysSelectedId (val) {
      this.daysSelected = val
      this.search(true)
    }
  }
}
</script>

<style lang="less" scoped>
.water-fall /deep/ .ant-card-head-wrapper {
  margin-left: -8px;
}
/deep/ .ant-divider.ant-divider-horizontal {
  margin: 0 0 10px 0;
  height: 1px;
}
</style>
