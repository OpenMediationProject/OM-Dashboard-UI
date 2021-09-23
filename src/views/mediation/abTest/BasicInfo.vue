<template>
  <a-spin :spinning="spinning" size="large">
    <div v-show="!spinning" class="water-fall" style="position: relative;">
      <OmPageAction :loading="loading" @save="segmentSave" :canEdit="abTestStatus === 0"/>
      <PageHeaderPlacement />
      <a-form-model
        ref="ruleForm1"
        :model="mediationRuleInfo"
        :hideRequiredMark="true">
        <a-card class="card-noline om-card-style" :title="$t('mediation.basicInformation')" :bordered="false">
          <om-form-model
            field="name"
            :label="$t('comm.name')"
            :tip="this.$t('mediation.rule_name_tip')">
            <a-input :max-length="500" :placeholder="$t('comm.name')" v-model="mediationRuleInfo.name" :disabled="true" />
          </om-form-model>
          <om-form-model
            field="regions"
            :label="$t('comm.regions')"
            :tip="this.$t('mediation.regions_tip')">
            <RegionsSelect
              mode="multiple"
              :disabled="true"
              :default-selected="mediationRuleInfo.regions"
              @change="(v)=>{mediationRuleInfo.regions=v}"
              style="width: 100%"/>
          </om-form-model>
          <om-form-model
            field="appTracking"
            :label="$t('mediation.tracking_allowed')"
            :tip="mediationRuleInfo.appTracking ? this.$t('mediation.app_tracking_allowed_tip_on') : this.$t('mediation.app_tracking_allowed_tip_off')">
            <a-switch v-model="mediationRuleInfo.appTracking" :disabled="true">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
            {{ mediationRuleInfo.appTracking ? $t('mediation.app_tracking_open') : $t('mediation.app_tracking_close') }}
          </om-form-model>
          <om-form-model :label="$t('ab.channel')" field="channel" :fill="false">
            <a-input-group style="width:100%" compact>
              <a-select v-model="mediationRuleInfo.channelBow" :disabled="true">
                <a-select-option :value="1">{{ $t('placements.include') }}</a-select-option>
                <a-select-option :value="0">{{ $t('placements.exclude') }}</a-select-option>
              </a-select>
              <a-select allowClear v-model="mediationRuleInfo.channel" mode="tags" style="width: 73%" :disabled="true"></a-select>
            </a-input-group>
          </om-form-model>
          <a-row style="margin-bottom: 16px;">
            <a-divider></a-divider>
            <a-col :span="24" style="text-align: center; padding-right: 8px;"><a @click="visible = !visible">{{ $t('mediation.advancedOptions') }} <span class="iconfont">{{ visible ? '&#xe603;' : '&#xe602;' }}</span></a></a-col>
          </a-row>
          <div v-show="visible" style="background-color: #FBFBFB; padding: 16px 0 16px 0;">
            <om-form-model
              field="appvExp"
              :label="$t('mediation.appVersions')"
              :fill="false"
              :tip="$t('mediation.appv_exp_tip')">
              <a-input placeholder="e.g.1.0.1;1.0.2" :max-length="100" style="width:100%" v-model="mediationRuleInfo.appvExp" :disabled="true"/>
            </om-form-model>
            <om-form-model
              field="osvmin"
              :label="$t('mediation.OSVersions')"
              :fill="false"
              :tip="$t('mediation.osv_exp_tip')">
              <OsVersion
                :plat="currentAppInfo().plat"
                @change="(v)=>{
                  mediationRuleInfo.osvmin=v
                }"
                :max="mediationRuleInfo.osvmax"
                :default-value="mediationRuleInfo.osvmin"
                :hint="$t('comm.minimum')"
                :type="0"
                style="width: 150px;"
                :disabled="true"/> ~
              <a-form-model-item prop="osvmax" style="display: inline-block;margin-bottom: 16px;">
                <OsVersion
                  :min="mediationRuleInfo.osvmin"
                  :default-value="mediationRuleInfo.osvmax"
                  @change="(v)=>{
                    mediationRuleInfo.osvmax=v
                  }"
                  @maxv="(v)=>{maxv=v}"
                  style="width: 150px"
                  :plat="currentAppInfo().plat"
                  :type="1"
                  :hint="$t('comm.maximum')"
                  :disabled="true"/>
              </a-form-model-item>
            </om-form-model>
            <om-form-model
              field="sdkvExp"
              :label="$t('mediation.SDKVersions')"
              style="margin-top: -16px;"
              :fill="false"
              :tip="$t('mediation.sdkv_exp_tip')">
              <a-input :max-length="100" placeholder="e.g.1.0.1;1.0.2" style="width:100%" v-model="mediationRuleInfo.sdkvExp" :disabled="true"/>
            </om-form-model>
            <om-form-model
              field="frequency"
              :label="$t('mediation.frequency')"
              :fill="false"
              :tip="$t('mediation.frequency_tip')">
              <a-input-number
                ref="iap-min"
                style="width:100%"
                type="number"
                :min="0"
                :max="500"
                v-model="mediationRuleInfo.frequency"
                :disabled="true"/>
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
                  :placeholder="$t('comm.minimum')"
                  :disabled="true"/>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none;"
                  placeholder="~"
                  disabled />
                <a-input-number
                  ref="iapmax"
                  :min="0"
                  @change="(v)=>iap[1]=v"
                  :max="9999"
                  v-model="mediationRuleInfo.iapMax"
                  style="width: 100px; text-align: center; border-left: 0"
                  :placeholder="$t('comm.maximum')"
                  :disabled="true"/>
              </a-input-group>
            </om-form-model>
            <om-form-model
              field="gender"
              :label="$t('mediation.gender')"
              :tip="$t('mediation.gender_tip')"
              :fill="false">
              <a-checkbox-group v-model="mediationRuleInfo.gender" :disabled="true">
                <a-checkbox :value="0">{{ $t('mediation.male') }}</a-checkbox>
                <a-checkbox :value="1">{{ $t('mediation.female') }}</a-checkbox>
              </a-checkbox-group>
            </om-form-model>
            <om-form-model
              field="age"
              :label="$t('mediation.age')"
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
                  :placeholder="$t('comm.miniage')"
                  :disabled="true"/>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none;"
                  placeholder="~"
                  disabled />
                <a-input-number
                  ref="agemax"
                  :min="0"
                  @change="(v)=>age[1]=v"
                  :max="200"
                  v-model="mediationRuleInfo.ageMax"
                  style="width: 100px; text-align: center; border-left: 0"
                  :placeholder="$t('comm.maxiage')"
                  :disabled="true"/>
              </a-input-group>
            </om-form-model>
            <om-form-model
              field="conType"
              :label="$t('mediation.connectionTypes')"
              :fill="false"
              :tip="this.$t('mediation.contype_tip')" >
              <a-select :placeholder="$t('mediation.connectionTypes')" v-model="mediationRuleInfo.conType" mode="multiple" :disabled="true">
                <a-select-option :value="0">WIFI</a-select-option>
                <a-select-option :value="1">2G</a-select-option>
                <a-select-option :value="2">3G</a-select-option>
                <a-select-option :value="3">4G</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model
              field="modelType"
              :label="$t('mediation.modelType')"
              :fill="false"
              :tip="this.$t('mediation.model_type_tip')" >
              <a-select :placeholder="$t('mediation.modelType')" v-model="mediationRuleInfo.deviceModelType" mode="multiple" style="width: 100%;" :disabled="true">
                <a-select-option :value="0">Phone</a-select-option>
                <a-select-option :value="1">Pad</a-select-option>
                <a-select-option :value="2">TV</a-select-option>
              </a-select>
            </om-form-model>
            <om-form-model
              field="brand"
              :label="$t('mediation.deviceBrand')"
              :tip="this.$t('mediation.brand_tip')"
              :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.brandType" :disabled="true">
                  <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
                  <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.brandList"
                  mode="multiple"
                  :disabled="true">
                </a-select>
              </a-input-group>
            </om-form-model>
            <om-form-model
              field="model"
              :label="$t('mediation.deviceModel')"
              :tip="this.$t('mediation.model_tip')"
              :fill="false">
              <a-input-group style="width:100%" compact>
                <a-select v-model="mediationRuleInfo.modelType" :disabled="true">
                  <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
                  <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
                </a-select>
                <a-select
                  style="width: 73%"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-model="mediationRuleInfo.modelList"
                  mode="multiple"
                  :disabled="true">
                </a-select>
              </a-input-group>
            </om-form-model>
            <om-form-model
              field="customParams"
              :label="$t('mediation.customTags')"
              :fill="false">
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
                  <a-input :placeholder="$t('ab.enterName')" v-model="record.name" :disabled="true"/>
                </span>
                <span slot="type" slot-scope="text, record">
                  <a-select v-model="record.type" @change="record.value=''" :placeholder="$t('comm.select')" :disabled="true">
                    <a-select-option :value="0">String</a-select-option>
                    <a-select-option :value="1">Integer</a-select-option>
                    <a-select-option :value="2">Float</a-select-option>
                  </a-select>
                </span>
                <span slot="operator" slot-scope="text, record">
                  <a-select v-model="record.operator" :placeholder="$t('comm.select')" :disabled="true">
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
                  <a-textarea v-if="record.type===0" placeholder="e.g.1.0.1" auto-size v-model="record.value" :disabled="true"/>
                  <a-input-number v-else v-model="record.value" :disabled="true"/>
                </span>
                <span slot="remove" slot-scope="text" v-if="false">
                  <img src="/icon/Button-Delete.svg" @click="customList.splice(customList.findIndex(row=>row.id===text), 1)">
                </span>
              </a-table>
            </om-form-model>
          </div>
        </a-card>
      </a-form-model>
      <a-form-model
        ref="ruleForm2"
        :model="testSettingInfo"
        :hideRequiredMark="true"
        :rules="rules"
        v-if="abTestStatus === 0"
      >
        <a-card class="card-noline om-card-style settingBox" title="AB Test Setting" :bordered="false">
          <div class="settingForm">
            <om-form-model
              :labelerCol="{ lg: { span: 8 }, sm: { span: 8 } }"
              :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }"
              field="testName"
              label="Test Name"
              :fill="true">
              <a-input placeholder="Test Name" v-model="testSettingInfo.testName"/>
            </om-form-model>
            <om-form-model
              :labelerCol="{ lg: { span: 8 }, sm: { span: 8 } }"
              :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }"
              label="User Allocation"
              :fill="false">
              <div class="alloBox">
                <div class="boxTop">
                  <div class="boxRate">50%</div>
                  <div class="boxGraph">
                    <div class="ga">A</div>
                    <div class="gb">B</div>
                  </div>
                  <div class="boxRate">50%</div>
                </div>
                <div class="boxBottom">
                  <span>Control Group</span>
                  <span>Test Group</span>
                </div>
              </div>
            </om-form-model>
          </div>
          <div class="settingTip">
            <ABTestTip />
          </div>
        </a-card>
      </a-form-model>
    </div>
    <div v-show="spinning" style="height:500px; width: 100%;"></div>
  </a-spin>
</template>

<script>
import OmFormModel from '@/components/OmFormModel'
import OmPageAction from '@/components/OmPageAction'
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'
import RegionsSelect from '@/components/om/RegionsSelect'
import OsVersion from '@/views/campaign/OsVersion'
import ABTestTip from './ABTestTip'

import { segmentGet } from '@/api/mediation'
import { mapState } from 'vuex'
import { generateUUID } from 'ant-design-vue/lib/vc-select/util'

const VERSION_RANGE_REG_EX = /^[[(]([^,]+)?,([^,]+)?[)\]]$/i

export default {
  name: 'BasicInfo',
  components: {
    OmPageAction,
    PageHeaderPlacement,
    RegionsSelect,
    OsVersion,
    OmFormModel,
    ABTestTip
  },
  computed: mapState({
    isNgp: state => state.user.info.isNgp,
    apps: state => state.publisher.apps,
    searchApp: state => state.publisher.searchApp
  }),
  props: {
    appId: {
      type: Number,
      default: 0
    },
    placementId: {
      type: Number,
      default: 0
    },
    ruleId: {
      type: Number,
      default: 0
    },
    abTestStatus: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      spinning: false,
      loading: false,
      visible: false,
      iap: [],
      age: [],
      fetching: false,
      customList: [],
      segmentId: null,
      countries: [],
      isSaving: false,
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
      mediationRuleInfo_copy: null,
      testSettingInfo: {
        testName: ''
      },
      rules: {
        testName: [{ required: true, message: "Test Name can't empty!", trigger: 'blur' }]
      },
      customColumn: [
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
    }
  },
  mounted () {
    this.getDatas()
  },
  methods: {
    getDatas () {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId }
      segmentGet(params).then(res => {
        if (res.code) {
          this.$message.error(`${res.code}, ${res.msg}`)
          return
        }
        this.mediationRuleInfo_copy = JSON.parse(JSON.stringify(res.data))
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
        this.spinning = false
      }).finally(() => {
        this.spinning = false
      })
    },
    currentAppInfo () {
      if (this.apps.length && this.searchApp) {
        return this.apps.find(row => row.id === this.searchApp)
      }
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
    segmentSave () {
      if (this.isSaving) {
        return
      }
      this.isSaving = true
      setTimeout(() => {
        this.isSaving = false
      }, 5000)
      let tag = true
      this.$refs.ruleForm2.validate((b) => {
        if (!b) {
          tag = false
        }
      })
      if (!tag) {
        this.$message.error('Please check your Test Name!')
        return false
      }
      const countries = this.mediationRuleInfo_copy.countries
      if (countries && countries.indexOf('ALL') > -1) {
        countries.splice(countries.indexOf('ALL'), 1)
        countries.push('00')
      }
      if (this.mediationRuleInfo_copy.countries && this.mediationRuleInfo_copy.countries.length && Array.isArray(this.mediationRuleInfo_copy.countries)) {
        this.mediationRuleInfo_copy.countries = this.mediationRuleInfo_copy.countries.join(',')
      }
      this.mediationRuleInfo_copy.testName = this.testSettingInfo.testName
      if (this.mediationRuleInfo_copy.abTest === 0) {
        this.mediationRuleInfo_copy.abTest = 1
      }
      this.$emit('segmentSave', this.mediationRuleInfo_copy)
    }
  }
}
</script>

<style lang="less" scoped>
@AColor: #F87E49;
@BColor: #0FCCAA;
/deep/ .ant-divider.ant-divider-horizontal {
  margin: 0 0 10px 0;
  height: 1px;
}
.settingBox {
  /deep/ .ant-card-body {
    display: flex;
    .settingForm {
      flex: 1;
      padding-top: 42px;
    }
    .settingTip {
      margin-left: 12px;
      margin-right: 23px;
    }
  }
}
.alloBox {
  width: 100%;
  height: 52px;
  .boxTop {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    .boxRate {
      height: 100%;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 28px;
      line-height: 32px;
      color: #333333;
    }
    .boxGraph {
      flex: 1;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      & > div {
        width: 45%;
        height: 20px;
        display: flex;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 20px;
        color: #FFFFFF;
        padding: 0 9px;
      }
      .ga {
        background: @AColor;
        border-radius: 10px 0 0 10px;
        justify-content: flex-start;
      }
      .gb {
        background: @BColor;
        border-radius: 0 10px 10px 0;
        margin-left: 2px;
        justify-content: flex-end;
      }
    }
  }
  .boxBottom {
    width: 100%;
    height: 14px;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    & > span {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: #999999;
    }
  }
}
</style>
