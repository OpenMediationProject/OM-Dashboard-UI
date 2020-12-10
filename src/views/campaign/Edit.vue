<template>
  <div class="main-content" v-if="!spinning">
    <OmPageAction :has-change="hasChange" :loading="loading" @save="onSubmit" :can-edit="true"/>
    <a-affix :offset-top="64">
      <div class="conf-box" :style="{zIndex: 2}">
        <div style="font-size: 24px;color: #333333;font-weight: normal;line-height: 32px;margin-bottom: 24px;">Complete the following steps to go live with your campaign</div>
        <a-anchor :showInkInFixed="false" :targetOffset="224" class="campaign-anchor"	>
          <a-anchor-link v-for="item of anchors" :key="item.title" :href="item.href" target="_self">
            <a-tag slot="title" class="campaign-tag">
              <img :src="item.icon"> {{ item.title }} <img src="/icon/cam-right.svg" style="margin-top: -2px;">
            </a-tag>
          </a-anchor-link>
        </a-anchor>
      </div>
    </a-affix>
    <div class="conf-box" style="margin-top: 16px;">
      <div id="basic" class="conf-title">Basic Information</div>
      <a-form-model ref="basicForm" :model="form" :rules="rules.basic" :hideRequiredMark="true">
        <om-form-model field="name" label="Name">
          <a-input :max-length="500" placeholder="Name" v-model="form.name" />
        </om-form-model>
        <om-form-model field="type" label="Type">
          <a-select disabled v-model="form.type">
            <a-select-option :value="0">House Ads</a-select-option>
            <a-select-option :value="1">Direct Sold</a-select-option>
          </a-select>
        </om-form-model>
        <om-form-model field="appid" v-if="!campaignId" label="Promote App">
          <a-form-model-item
            v-if="!promote.appId"
            :colon="false"
            prop="storeUrl">
            <a-input v-model="form.storeUrl" placeholder="Search by app ID, or input store URL" style="width: 338px;margin-right: 8px;" /><a-button type="primary" :loading="searching" ghost @click="appsearch(form.storeUrl)">Search</a-button>
          </a-form-model-item>
          <a-form-model-item
            v-else
            :colon="false"
            prop="selectapp">
            <div style="width: 409px;height: 48px;padding: 4px 8px; background-color:white;border: 1px solid rgb(216, 216, 216);border-radius: 4px;">
              <PromoteApp style="width: 260px;display: inline-block;" :app="promote"/>
              <img
                @click="()=>{promote={appId: null}
                             form.storeUrl=''}"
                src="/icon/Button-Delete.svg"
                style="float:right;margin-left: 8px;margin-top: 8px;">
              <!--              <img @click="promote=storeapp" src="/icon/submit.svg" style="float:right;margin-top: 8px;">-->
            </div>
          </a-form-model-item>
        </om-form-model>
        <om-form-model field="appid" v-else label="Promote App">
          <div style="width: 409px;height: 48px;padding: 4px 8px; background-color:white;border: 1px solid rgb(216, 216, 216);border-radius: 4px;">
            <PromoteApp style="width: 260px;display: inline-block;" :app="promote"/>
          </div>
        </om-form-model>
        <om-form-model :wrapper-col="{ lg: { span: 12 }, sm: { span: 12 } }" label="Target Placements" field="placementTargetingList">
          <a-button type="dashed" ghost style="width: 100%; height: 48px;" :disabled="form.placementTargetingList.filter(r=>r.editStatus).length>0" @click="form.placementTargetingList.unshift({pubAppId: undefined, type: 2, placementId: undefined, editStatus: true, value: undefined, id: Math.random()})">+ Add Target Placement</a-button>
          <a-table
            v-if="form.placementTargetingList.length"
            rowKey="id"
            style="margin-top: 8px;margin-bottom: 8px;"
            class="om-card-style"
            :dataSource="form.placementTargetingList"
            ref="table"
            size="default"
            :pagination="false"
            :columns="placementColumns">
            <span slot="pubAppId" slot-scope="text, record">
              <span v-if="record.editStatus">
                <a-form-model-item ref="plcAppId" prop="plcAppId" :colon="false">
                  <om-pub-app-select
                    @change="(v)=>{
                      record.pubAppId = v
                      form.plcAppId = v
                    }"
                    :clear="false"
                    mode="normal"
                    width="250px"/>
                </a-form-model-item>
              </span>
              <span v-else>
                <app-info :app-id="record.pubAppId"/>
              </span>
            </span>
            <span slot="placementId" slot-scope="text, record">
              <span v-if="record.editStatus">
                <a-form-model-item ref="placementId" prop="placementId" :colon="false">
                  <OmPlacementSelect
                    :selecteds="selectedPlacements()"
                    :pubAppId="record.pubAppId"
                    @change="(v)=>{
                      if (v) {
                        record.placementId = v
                        form.placementId = v
                      } else {
                        record.placementId = undefined
                        form.placementId = undefined
                      }
                    }"
                    :clear="false"
                    mode="normal"
                    width="250px"/>
                </a-form-model-item>
              </span>
              <span v-else><placement-info :id="record.placementId" /></span>
            </span>
            <span slot="remove" slot-scope="text, record">
              <img v-if="record.editStatus && record.pubAppId && record.placementId" @click="placementConfirm(record)" src="/icon/submit.svg">
              <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="removePlacement(record)">
                <img style="margin-left: 16px;" src="/icon/Button-Delete.svg">
              </a-popconfirm>
            </span>
          </a-table>
        </om-form-model>
        <om-form-model field="clickUrl" label="Tracking URL">
          <a-input :max-length="1000" :disabled="campaignId>0" placeholder="Https://" v-model="form.clickUrl" />
        </om-form-model>
        <om-form-model label="Schedule" :wrapper-col="{ lg: { span: 9 }, sm: { span: 9 } }">
          <div style="display: inline-block;">
            From     <a-form-model-item prop="startTime" style="display: inline-block;width: 195px;"><a-date-picker
              @change="(v)=>form.startTime=v"
              :allowClear="false"
              v-model="form.startTime"
              style="display: inline-block;width: 195px;"
              show-time
              placeholder="Start Date" /></a-form-model-item> To
            <a-form-model-item prop="endTime" style="display: inline-block;width: 195px;"><a-date-picker
              @change="(v)=>form.endTime=v"
              :allowClear="false"
              v-model="form.endTime"
              style="display: inline-block;width: 195px;"
              show-time
              placeholder="End Date" /></a-form-model-item>
          </div>
        </om-form-model>
        <!--        <om-form-model :fill="false" field="imprCap" label="Frequency Capping">-->
        <!--          Limit to <a-input-number-->
        <!--            :min="0"-->
        <!--            :max="2147483647"-->
        <!--            v-model="form.imprCap"-->
        <!--            style="width:100px;"/> impr. per Day on this Campaign-->
        <!--        </om-form-model>-->
        <!--        <om-form-model :fill="false" field="imprFreq" label="">-->
        <!--          Limit to <a-input-number-->
        <!--            :min="0"-->
        <!--            :max="2147483647"-->
        <!--            v-model="form.imprFreq"-->
        <!--            style="width:100px;"/> impr. per Day on one Device-->
        <!--        </om-form-model>-->
      </a-form-model>
    </div>
    <div id="targeting" class="conf-box">
      <div class="conf-title">Targeting</div>
      <a-form-model ref="targetForm" :model="form" :rules="rules.target" :hideRequiredMark="true">
        <om-form-model label="Regions" field="regions">
          <regions-select
            mode="multiple"
            :default-selected="form.regions"
            @change="(v)=>{form.regions=v}"
            style="width: 100%"/>
        </om-form-model>
        <om-form-model label="Connection Types" field="conType">
          <a-select v-model="form.conType" mode="multiple" style="width: 100%;">
            <a-select-option :value="0">WIFI</a-select-option>
            <a-select-option :value="1">2G</a-select-option>
            <a-select-option :value="2">3G</a-select-option>
            <a-select-option :value="3">4G</a-select-option>
          </a-select>
        </om-form-model>
        <om-form-model label="Device Types" field="deviceType">
          <a-select placeholder="Device Types" v-model="form.deviceType" mode="multiple" style="width: 100%;">
            <a-select-option :value="0">Phone</a-select-option>
            <a-select-option :value="1">Pad</a-select-option>
            <a-select-option :value="2">TV</a-select-option>
          </a-select>
        </om-form-model>
        <om-form-model v-if="promote.appId" label="OS Versions" field="osvmin">
          <OsVersion
            :plat="promote.plat"
            @change="(v)=>{form.osvmin=v}"
            :max="form.osvmax"
            :default-value="form.osvmin"
            hint="Minimum"
            :type="0"
            style="width: 150px"/> ~
          <a-form-model-item prop="osvmax" style="display: inline-block;"><OsVersion
            :min="form.osvmin"
            :default-value="form.osvmax"
            @change="(v)=>{
              form.osvmax=v
            }"
            @maxv="(v)=>{maxv=v}"
            style="width: 150px"
            :plat="promote.plat"
            :type="1"
            hint="Maximum" /></a-form-model-item>
        </om-form-model>
      </a-form-model>
    </div>
    <div id="pricing" class="conf-box">
      <div class="conf-title">Pricing</div>
      <a-form-model ref="pricingForm" :model="form" :rules="rules.pricing" :hideRequiredMark="true">
        <om-form-model label="Goal Type" field="globalPricing">
          <a-select v-model="form.globalPricing">
            <a-select-option :value="0">Optimized for Backfill</a-select-option>
            <a-select-option :value="1">Manual eCPM</a-select-option>
          </a-select>
        </om-form-model>
        <om-form-model v-if="form.globalPricing===1" label="Global Pricing" :fill="false" tip="" field="bidprice">
          $ <a-input style="width: 100px;" v-model="form.bidprice" /> per milli.
        </om-form-model>
        <om-form-model v-if="form.globalPricing===1" label="Specific Regions" :fill="false" field="bidPriceList">
          <a-button
            type="dashed"
            ghost
            style="width: 100%; height: 48px;"
            :disabled="form.bidPriceList.filter(r=>r.editStatus).length>0"
            @click="()=>{
              form.country = undefined
              form.bidPriceList.unshift({country: null, bidprice: 0.01, editStatus: true, id: -Math.random()}
              )
            }">+ Specific Region</a-button>
          <a-table
            v-if="form.bidPriceList.length"
            rowKey="id"
            style="margin-top: 8px;margin-bottom: 8px;"
            class="om-card-style"
            :dataSource="form.bidPriceList"
            ref="table"
            size="default"
            :pagination="false"
            :columns="regionsColumns">
            <span slot="region" slot-scope="text, record">
              <span v-if="record.editStatus">
                <a-form-model-item ref="country" prop="country" :colon="false">
                  <om-regions-select
                    :selecteds="selectedRegions()"
                    @change="(v)=>{
                      form.country = v
                      record.country=v}"
                    mode="unset"/>
                </a-form-model-item>
              </span>
              <span v-else>
                {{ text }}
              </span>
            </span>
            <span slot="pricing" slot-scope="text, record">
              <span v-if="record.editStatus">
                <a-form-model-item ref="pricing" prop="pricing" :colon="false">
                  $ <a-input v-model="record.bidprice" style="width: 100px;" /> per milli.
                </a-form-model-item>
              </span>
              <span v-else>$ {{ record.bidprice }} per milli. </span>
            </span>
            <span slot="removeRegion" slot-scope="text, record">
              <img v-if="record.editStatus && record.country && record.bidprice" @click="regionConfirm(record)" src="/icon/submit.svg">
              <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="removeRegion(record)">
                <img style="margin-left: 16px;" src="/icon/Button-Delete.svg">
              </a-popconfirm>
            </span>
          </a-table>
        </om-form-model>
      </a-form-model>
    </div>
    <div id="ads" class="conf-box">
      <a-form-model ref="adsForm" :model="form" :rules="rules.ads" :hideRequiredMark="true">
        <a-form-model-item prop="creatives" :colon="false">
          <div class="conf-title">Ads</div>
        </a-form-model-item>
      </a-form-model>
      <creative
        @change="creativeChange"
        @add="(v)=>form.creativeList.unshift(v)"
        :app="promote"
        :campaign="campaignId"
        :data="form.creativeList"
        :plcs="form.placementTargetingList"
        style="padding: 0 64px;margin-top: 16px;" />
    </div>
  </div>
  <a-spin v-else :spinning="true" size="large" style="text-align: center; margin-top: 100px; width: 100%" >
  </a-spin>
</template>

<script>
import OmPageAction from '@/components/OmPageAction'
import Creative from './Creative'
import OmFormModel from '@/components/OmFormModel'
import RegionsSelect from '@/components/om/RegionsSelect'
import OmRegionsSelect from '@/components/om/RegionSelect'
import OmPlacementSelect from './PlacementSelect'
import OmPubAppSelect from './AppSelect'
import AppInfo from './AppInfo'
import PlacementInfo from './PlacementInfo'
import { getCampaign, campaignUpdate, campaignCreate } from '@/api/campaign'
import { searchAppFromStore } from '@/api/publisher'
import PromoteApp from './PromoteApp'
import OsVersion from './OsVersion'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'CampaignEdit',
  components: {
    OmPageAction,
    Creative,
    OmFormModel,
    RegionsSelect,
    OmPubAppSelect,
    OmPlacementSelect,
    AppInfo,
    PlacementInfo,
    PromoteApp,
    OsVersion,
    OmRegionsSelect
  },
  created () {
    if (this.campaignId) {
      getCampaign({ campaignId: this.campaignId }).then(res => {
        searchAppFromStore({ appId: res.data.appId }).then(rv => {
          if (rv.code === 0 && rv.data) {
            this.promote = rv.data
          }
          if (res.data.placementTargetingList.length) {
            res.data.placementTargetingList.forEach(row => {
              row.placementId = parseInt(row.content)
            })
          }
          if (res.data.bidPriceList.length || res.data.bidprice !== 0.01) {
            this.form.globalPricing = 1
          }
          if (res.data.targetingList.length) {
            res.data.targetingList.forEach(row => {
              if (row.type === 17) {
                if (this.form.regions && this.form.regions[0] === 'ALL') {
                  this.form.regions = []
                }
                this.form.regions.push(row.content)
              } else if (row.type === 12) {
                if (row.content) {
                  const carr = []
                  const ct = parseInt(row.content)
                  for (let i = 0; i < 4; ++i) {
                    if ((ct & (1 << i)) === (1 << i)) carr.push(i)
                  }
                  this.form.conType = carr
                }
              } else if (row.type === 10) {
                if (row.content) {
                  const dt = []
                  const mt = parseInt(row.content)
                  for (var x = 0; x < 3; ++x) {
                    if ((mt & (1 << x)) === (1 << x)) dt.push(x)
                  }
                  this.form.deviceType = dt
                }
              } else if (row.type === 15) {
                // [x.x,)
                if (row.content.startsWith('[')) {
                  const s = row.content.replace('[', '').replace(']', '')
                  const arrs = s.split(',')
                  this.form.osvmin = arrs[0]
                  if (arrs[1] === ')') {
                    this.form.osvmax = undefined
                  } else {
                    this.form.osvmax = arrs[1]
                  }
                }
              }
            })
          }
          this.form = Object.assign(this.form, res.data)
          this.oldCampaign = JSON.parse(JSON.stringify(res.data))
          this.form.startTime = moment(res.data.startTime).format('YYYY-MM-DD HH:mm:ss')
          this.form.endTime = moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')
          this.spinning = false
        }).finally(() => {
          this.spinning = false
        })
      }).catch((e) => {
        this.$message.error('App not found')
        this.spinning = false
      })
    } else {
      this.spinning = false
    }
  },
  data () {
    const _this = this
    const validateStartTime = (rule, value, callback) => {
      if (typeof value === 'string') {
        value = moment(value)
        if (typeof _this.form.endTime === 'string') {
          _this.form.endTime = moment(_this.form.endTime)
        }
      }
      if (!value) {
        callback(new Error('Please select Start Time'))
      } else {
        if (_this.form.endTime && _this.form.endTime.isBefore(value)) {
          callback(new Error('开始时间不能大于结束时间.'))
        } else {
          callback()
        }
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (typeof value === 'string') {
        value = moment(value)
        if (typeof _this.form.startTime === 'string') {
          _this.form.startTime = moment(_this.form.startTime)
        }
      }
      if (!value) {
        callback(new Error('Please select End Time'))
      } else {
        if (value.isBefore(moment(new Date()).add(-10, 'seconds'))) {
          callback(new Error('结束时间不能小于当前时间'))
        } else if (_this.form.startTime && value.isBefore(_this.form.startTime)) {
          callback(new Error('结束时间不能小于开始时间'))
        } else {
          callback()
        }
      }
    }
    const validateStoreUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Pleash input store URL'))
      } else {
        const appId = this.getAppId(value)
        if (appId) {
          callback()
        } else {
          callback(new Error('Incorrect format.'))
        }
      }
    }
    const validateCreative = (rule, value, callback) => {
      const _this = this
      const list = _this.form.creativeList.filter(row => {
        return row.status
      })
      if (_this.form.placementTargetingList.length) {
        const typeMap = {
          2: { templateId: 1, title: 'Video' },
          0: { templateId: 3, title: 'Banner' },
          1: { templateId: 4, title: 'Native' },
          3: { templateId: 5, title: 'CP' }
        }
        const types = []
        const needAdd = {}
        _this.form.placementTargetingList.forEach(p => {
          if (p.placementId) {
            types.push(_this.placements.find(row => row.id === p.placementId).adType)
          }
        })
        types.forEach(t => {
          if (t === 0) {
            needAdd[0] = typeMap[0]
          } else if (t === 1) {
            needAdd[1] = typeMap[1]
          } else if (t === 2 || t === 4) {
            needAdd[2] = typeMap[2]
          } else if (t === 9) {
            needAdd[3] = typeMap[3]
          }
        })
        if (list.length) {
          list.forEach(row => {
            delete needAdd[row.type]
          })
        }
        if (Object.keys(needAdd).length) {
          callback(new Error('Please add ads with the following ad type'))
        } else {
          callback()
        }
      } else {
        if (list.length) {
          callback()
        } else {
          callback(new Error('Please set Ads.'))
        }
      }
    }
    return {
      oldCampaign: {},
      spinning: true,
      campaignId: parseInt(this.$route.query.id),
      loading: false,
      promote: { appId: null },
      moment,
      vResult: { basic: '/icon/check.svg', targeting: '/icon/check.svg', pricing: '/icon/check.svg', ads: '/icon/check.svg' },
      anchors: {
        basic: { icon: '/icon/check.svg', title: 'Add Basic Infomation', href: '#basic' },
        targeting: { icon: '/icon/check.svg', title: 'Add Targeting App', href: '#targeting' },
        pricing: { icon: '/icon/check.svg', title: 'Add Pricing', href: '#pricing' },
        ads: { icon: '/icon/check.svg', title: 'Setup ads', href: '#ads' }
      },
      fieldsChaned: false,
      searching: false,
      maxv: null,
      form: {
        name: '',
        regions: ['ALL'],
        deviceType: [0, 1, 2],
        type: 0,
        placementTargetingList: [],
        plcAppId: undefined,
        placementId: undefined,
        clickUrl: '',
        startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().add(1, 'years').format('YYYY-MM-DD HH:mm:ss'),
        imprCap: 0,
        conType: [0, 1, 2, 3],
        globalPricing: 0,
        osvmax: undefined,
        osvmin: undefined,
        bidprice: 0.01,
        bidPriceList: [],
        creativeList: [],
        storeUrl: '',
        country: undefined,
        imprFreq: 1
      },
      rules: {
        basic: {
          name: [
            { required: true, whitespace: true, message: 'Campaign name can not be empty', trigger: 'change' }
          ],
          placementTargetingList: [
            { required: true, message: 'Placements can not be empty', trigger: 'change' }
          ],
          placementId: [
            { required: true, message: 'Placement can not be empty', trigger: 'change' }
          ],
          storeUrl: [
            { validator: validateStoreUrl, trigger: 'change' }
          ],
          plcAppId: [
            { required: true, message: 'App can not be empty', trigger: 'change' }
          ],
          clickUrl: [
            { required: true, message: 'Tracking URL can not be empty', trigger: 'change' },
            { pattern: /^(?=^.{3,255}$)(http(s)?:\/\/)?[a-zA-Z0-9.-]{1,250}(?:\.[a-zA-Z]{2,})+.*$/, message: 'Illegal URL', trigger: 'change' }
          ],
          startTime: [
            { validator: validateStartTime, trigger: 'change' }
          ],
          endTime: [
            { validator: validateEndTime, trigger: 'change' }
          ]
        },
        target: {
          regions: [
            { required: true, message: 'Regions can not be empty', trigger: 'change' }
          ],
          deviceType: [
            { required: true, message: 'Device Type can not be empty', trigger: 'change' }
          ],
          conType: [
            { required: true, message: 'Connection Type can not be empty', trigger: 'change' }
          ],
          osvmax: [
            { required: true, message: 'OS Versions can not be empty', trigger: 'change' }
          ],
          osvmin: [
            { required: true, message: 'OS Versions can not be empty', trigger: 'change' }
          ]
        },
        pricing: {
          bidprice: [
            { required: true, message: 'Global Pricing can not be empty', trigger: 'change' }
          ],
          country: [
            { required: true, message: 'Region can not be empty', trigger: 'change' }
          ]
        },
        ads: {
          creatives: [
            { validator: validateCreative, trigger: 'change' }
          ]
        }
      },
      placementColumns: [
        {
          title: 'App',
          width: '40%',
          dataIndex: 'pubAppId',
          scopedSlots: { customRender: 'pubAppId' }
        },
        {
          title: 'Placement',
          dataIndex: 'placementId',
          width: '40%',
          scopedSlots: { customRender: 'placementId' }
        },
        {
          title: '',
          dataIndex: 'editStatus',
          scopedSlots: { customRender: 'remove' }
        }
      ],
      regionsColumns: [
        {
          title: 'Regions',
          width: '40%',
          dataIndex: 'country',
          scopedSlots: { customRender: 'region' }
        },
        {
          title: 'Pricing',
          dataIndex: 'bidprice',
          width: '40%',
          scopedSlots: { customRender: 'pricing' }
        },
        {
          title: '',
          dataIndex: 'editStatus',
          scopedSlots: { customRender: 'removeRegion' }
        }
      ]
    }
  },
  computed: mapState({
    apps: state => state.publisher.apps,
    placements: state => state.publisher.placements
  }),
  watch: {
    form: {
      handler () {
        this.fieldChange()
      },
      deep: true
    }
  },
  methods: {
    async appsearch (appId) {
      this.searching = true
      const id = this.getAppId(appId)
      try {
        const res = await searchAppFromStore({ appId: id })
        if (res.code === 0 && res.data) {
          this.promote = res.data
        }
      } catch (e) {
        this.$message.error(this.$msg('pubapp.app_not_found'))
      } finally {
        this.searching = false
      }
    },
    getAppId (s) {
      s = s.trim()
      if (!isNaN(s)) { // appleId
        return s
      }
      if (/^https?:/i.test(s)) {
        const url = new URL(s)
        if (url.hostname.search('.google.com') !== -1) {
          return url.searchParams.get('id')
        } else {
          const rv = /id(\d+)/i.exec(url.pathname)
          if (rv && rv.length > 1) {
            return rv[1]
          }
        }
      }
      if (/^([a-zA-Z_][a-zA-Z0-9_]*)+([.][a-zA-Z_][a-zA-Z0-9_]*)+/.test(s)) {
        return s
      }
      return null
    },
    selectedPlacements () {
      const ids = []
      this.form.placementTargetingList.forEach(p => {
        if (p.placementId) { ids.push(p.placementId) }
      })
      return ids
    },
    selectedRegions () {
      const ids = []
      this.form.bidPriceList.forEach(p => {
        if (p.country) { ids.push(p.country) }
      })
      return ids
    },
    fieldChange () {
      const _this = this
      let tag = true
      try {
        _this.$refs.basicForm.validate((b) => {
          if (b) {
            _this.anchors.basic.icon = '/icon/checked.svg'
          } else {
            tag = false
            _this.anchors.basic.icon = '/icon/check.svg'
          }
        })
        _this.$refs.targetForm.validate((t) => {
          if (t) {
            _this.anchors.targeting.icon = '/icon/checked.svg'
          } else {
            tag = false
            _this.anchors.targeting.icon = '/icon/check.svg'
          }
        })
        _this.$refs.pricingForm.validate((p) => {
          if (p) {
            _this.anchors.pricing.icon = '/icon/checked.svg'
          } else {
            tag = false
            _this.anchors.pricing.icon = '/icon/check.svg'
          }
        })
        _this.$refs.adsForm.validate((p) => {
          if (p) {
            _this.anchors.ads.icon = '/icon/checked.svg'
          } else {
            tag = false
            _this.anchors.ads.icon = '/icon/check.svg'
          }
        })
      } catch (e) {
        _this.anchors.basic.icon = '/icon/checked.svg'
        _this.anchors.targeting.icon = '/icon/checked.svg'
        _this.anchors.pricing.icon = '/icon/checked.svg'
        _this.anchors.ads.icon = '/icon/checked.svg'
      }
      return tag
    },
    removePlacement (item) {
      this.form.placementTargetingList.splice(this.form.placementTargetingList.findIndex((row) => { return row.placementId === item.placementId }), 1)
      const _this = this
      setTimeout(function () {
        _this.fieldChange()
      }, 100)
    },
    placementConfirm (item) {
      item.editStatus = false
      this.form.placementTargetingList.unshift({})
      this.form.placementTargetingList.splice(0, 1)
    },
    removeRegion (item) {
      this.form.bidPriceList.splice(this.form.bidPriceList.findIndex((row) => { return row.country === item.country }), 1)
      const _this = this
      setTimeout(function () {
        _this.fieldChange()
      }, 100)
    },
    regionConfirm (item) {
      item.editStatus = false
    },
    creativeChange (v) {
      this.form.creativeList = v
      this.fieldChange()
    },
    hasChange () {
      this.fieldsChaned = false
      const { oldCampaign: old, form: cam } = this
      // let st
      // let et
      // if (typeof cam.startTime === 'string') {
      //   st = moment(cam.startTime).valueOf()
      // } else {
      //   st = cam.startTime.valueOf()
      // }
      // if (typeof cam.endTime === 'string') {
      //   et = moment(cam.endTime).valueOf()
      // } else {
      //   et = cam.endTime.valueOf()
      // }
      if (old.name !== cam.name) {
        this.fieldsChaned = true
      } else if (old.appId !== cam.appId) {
        this.fieldsChaned = true
      } else if (old.placementTargetingList.length !== cam.placementTargetingList.length) {
        this.fieldsChaned = true
      // } else if (st !== old.endTime) {
      //   this.fieldsChaned = true
      // } else if (et !== old.startTime) {
      //   this.fieldsChaned = true
      } else if (old.imprCap !== cam.imprCap) {
        this.fieldsChaned = true
      } else if (old.imprFreq !== cam.imprFreq) {
        this.fieldsChaned = true
      } else if (old.bidprice !== cam.bidprice) {
        this.fieldsChaned = true
      } else if (old.bidPriceList.length !== cam.bidPriceList.length) {
        this.fieldsChaned = true
      } else if (old.creativeList.length !== cam.creativeList.length) {
        this.fieldsChaned = true
      } else if (old.targetingList.length !== cam.targetingList.length) {
        this.fieldsChaned = true
      }
      return this.fieldsChaned
    },
    onSubmit () {
      if (!this.fieldChange()) {
        return false
      }
      let ct = 0
      for (const i in this.form.conType) { ct |= (1 << this.form.conType[i]) }
      let dt = 0
      for (const i in this.form.deviceType) { dt |= (1 << this.form.deviceType[i]) }
      this.form.appId = this.promote.appId
      if (this.form.globalPricing === 0) {
        this.form.bidPriceList = []
        this.form.bidprice = 0.01
      } else {
        this.form.bidPriceList = this.form.bidPriceList.filter(row => {
          return row.editStatus === false
        })
      }
      const params = { ...this.oldCampaign }
      params.bidPriceList = this.form.bidPriceList
      params.bidprice = this.form.bidprice
      params.placementTargetingList = this.form.placementTargetingList
      params.placementTargetingList.forEach(p => {
        p.content = p.placementId
        p.type = 2
      })
      const targetings = []
      this.form.regions.forEach(r => {
        if (r === 'ALL') {
          return false
        }
        const country = { campaignId: this.campaignId, type: 17, content: r }
        targetings.push(country)
      })
      targetings.push({ campaignId: this.campaignId, type: 12, content: ct })
      targetings.push({ campaignId: this.campaignId, type: 10, content: dt })
      let osv = '[' + this.form.osvmin + ','
      if (this.form.osvmax === this.maxv) {
        osv = osv + ')'
      } else {
        osv = osv + this.form.osvmax + ']'
      }
      targetings.push({ campaignId: this.campaignId, type: 15, content: osv })
      params.targetingList = targetings
      params.name = this.form.name
      params.type = this.form.type
      params.appId = this.form.appId
      params.platform = this.promote.plat
      params.appName = this.promote.appName
      params.clickUrl = this.form.clickUrl
      params.imprCap = this.form.imprCap
      if (typeof this.form.startTime === 'string') {
        params.startTime = moment(this.form.startTime).valueOf()
      } else {
        params.startTime = this.form.startTime.valueOf()
      }
      if (typeof this.form.endTime === 'string') {
        params.endTime = moment(this.form.endTime).valueOf()
      } else {
        params.endTime = this.form.endTime.valueOf()
      }
      params.bidPriceList = this.form.bidPriceList
      params.bidPriceList.forEach(b => {
        b.campaignId = this.campaignId
      })
      params.lastmodify = moment().valueOf()
      params.price = 0.00
      params.creativeList = this.form.creativeList
      if (this.campaignId) {
        campaignUpdate(params).then(res => {
          this.$router.push('/campaign/list')
        })
      } else {
        params.status = 1
        campaignCreate(params).then(res => {
          this.$router.push('/campaign/list')
        })
      }
    }
  }
}
</script>
<style type="less" scoped>
  .conf-box {
    padding: 12px 24px;
    margin-bottom: 16px;
    background-color: white;
  }
  .conf-title {
    font-size: 18px;color: #333333;font-weight: 500;line-height: 24px;
  }
  @media screen and (max-width: 1900px) {
    .main-content {
      margin-left: -120px;margin-right: -120px;
    }
  }
  @media screen and (min-width: 1900px) {
    .main-content {
      position: relative;
    }
  }
  .campaign-tag {
    padding:3px 8px;border: #1A7DF1 1px solid; background-color: white; height: 32px;color: #1A7DF1;margin-bottom: 8px;
  }
  .campaign-anchor >>> .ant-anchor-ink {
    display: none;
  }
  .campaign-anchor >>> .ant-anchor-link {
    display: inline-table;
    padding: 0;
  }
  .main-content >>> .ant-form-item {
    margin-bottom: 0;
  }
  .main-content >>> .ant-form-explain, .ant-form-extra {
    line-height: 1.5;
    margin-bottom: -20px;
  }
  .campaign >>> .ant-calendar-time-picker-btn {
    display: block;
  }
</style>
