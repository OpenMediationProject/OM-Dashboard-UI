<!-- Report Performance tab -->
<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-pub-app-select :defaultValue="def.defaultApps" @change="appSelect" width="240px"/>
      <a-form-item>
        <om-regions-select :defaultSelected="def.defaultRegions" :maxTagCount="1" :ignoreApp="true" @change="countryChange" style="width: 154px"/>
      </a-form-item>
      <om-placement-select-simple :pubAppIds="pubAppIds" :defaultValue="def.defaultPlacements" :form="form" width="225px"/>
      <om-ad-network-select :defaultValue="def.defaultAdns" width="185px"/>
      <a-form-item>
        <a-button ghost @click="handleApply" type="primary" style="width: 84px;">Apply</a-button>
      </a-form-item>
      <om-report-date-picker @ok="handleApply"/>
    </a-form>

    <div style="background-color: white; margin-top: 8px; padding: 16px">
      <div style="margin-bottom: 16px;">
        <span style="font-size: 16px;color: #333333;font-weight:500;margin-right: 4px;">Performance by</span>
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" style="font-size:16px;font-weight:bold;" @click="e => e.preventDefault()">
            {{ chartGroupBreakdown }} <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="s in dimList4Chart" :key="s.id" :title="s.title">
              <a href="javascript:;" @click="handleDim4ChartChange(s)">{{ s.title }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <a-row :gutter="16">
        <a-col :span="12">
          <om-report-chart
            title="Impressions"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-format="0,0.[00]a"
            y-column="sdkImpr"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="12">
          <om-report-chart
            title="eCPM"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="ecpm"
            y-format="$0a[.]00"
            :group-by="chartGroupViewDim" />
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="12">
          <om-report-chart
            title="Revenue"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="cost"
            y-format="$0a[.]00"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="12">
          <om-report-chart
            title="Request"
            :loading="loading"
            :data="chartData"
            :height="248"
            y-format="0,0.[00]a"
            x-column="day"
            y-column="request"
            :group-by="chartGroupViewDim" />
        </a-col>
      </a-row>
    </div>

    <div style="background-color: white; margin-top: 16px; padding: 16px">
      <div style="margin-bottom: 4px;color: #999999;">
        <div style="display: inline-block;">Breakdown</div>
        <div style="position: absolute; margin-top: -20px; margin-left: 338px;">Metrics</div>
      </div>
      <a-select
        showSearch
        style="width:320px;margin-bottom:16px;"
        placeholder="Breakdown"
        mode="multiple"
        :maxTagCount="2"
        :allowClear="true"
        optionLabelProp="title"
        @change="handleDim4TableChange"
        :value="dimension">
        <a-select-option v-for="o in dimList4Table" :key="o.id" :disabled="disabledField(o.id)" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>
      <a-select
        showSearch
        style="width:480px;margin:0 0 16px 16px;"
        placeholder="Metrics"
        mode="multiple"
        :maxTagCount="2"
        :allowClear="true"
        optionLabelProp="title"
        :filterOption="filterOption"
        @change="handleMetricsChange"
        :value="table.metric">
        <a-select-option v-for="(o, key) in supportedMetrics" :key="key" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a @click="handleDownload" style="float: right; margin-right: 16px;margin-top: 4px;" :disabled="table.data.length===0">CSV</a>
      <a-table
        v-if="table.data.length"
        ref="TableInfo"
        class="ant-card-table-default"
        :scroll="{x: 500}"
        fixed="true"
        :loading="table.loading"
        :dataSource="table.data"
        :columns="table.columns"
        @change="tableChange"
        :footer="handleFooterShow"
        row-key="id"
        :pagination="{current:current,defaultPageSize:10, showSizeChanger:true,pageSizeOptions: ['10', '20', '50', '100'], hideOnSinglePage:true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, change: (val) => this.current = current}"
      >
        <span slot="Day"><tip tip="View performance by Date" title="Day"></tip></span>
        <span slot="Regions"><tip tip="View performance broken down by the region of visitors that have viewed ads on your app." title="Regions"></tip></span>
        <span slot="Ad Type"><tip tip="View performance by ad type (e.g., Banner, Interstitial)." title="Ad Type"></tip></span>
        <span slot="Placements"><tip tip="View performance for individual ad placements." title="Placements"></tip></span>
        <span slot="AdNetworks"><tip tip="View performance by ad network" title="AdNetworks"></tip></span>
        <span slot="Apps"><tip tip="View performance by app." title="Apps"></tip></span>
        <span slot="Requests"><tip tip="Breakdown by Instance or Ad Network: The number of requests your app has made to each ad network recorded by OM SDK Breakdown by Placement or above: The number of times your app has requested an ad through AdTIming Mediation  recorded by OM SDK. Each mediation request counted here may represent multiple requests sent to different ad networks." title="Requests"></tip></span>
        <span slot="API Requests"><tip tip="The number of times your app has requested an ad recorded by ad network" title="API Requests"></tip></span>
        <span slot="Instance"><tip tip="View performance across the unique instances of each ad network that appear in this report." title="Instance"></tip></span>
        <span slot="Scenes"><tip tip="View performance for individual scenes" title="Scenes"></tip></span>
        <span slot="Hour"><tip tip="View performance by Hour" title="Hour"></tip></span>
        <span slot="CTR"><tip tip="The number of clicks compared to the number of impressions recorded by OM SDK. CTR is calculated as clicks divided by impressions." title="CTR"></tip></span>
        <span slot="API CTR"><tip tip="The number of clicks compared to the number of impressions recorded by ad network. API CTR is calculated as API clicks divided by API impressions." title="API CTR"></tip></span>
        <span slot="Fills"><tip tip="The number of times the ad network returns an ad in response to an ad request recorded by OM SDK. " title="Fills"></tip></span>
        <span slot="API Fills"><tip tip="The number of times the ad network returns an ad in response to an ad request recorded by ad network. " title="API Fills"></tip></span>
        <span slot="FillRate"><tip tip="The number of ads that ad network returns compared to the number of ads requested recorded by OM SDK. Fill rate is calculated as fills divided by requests." title="FillRate"></tip></span>
        <span slot="API FillRate"><tip tip="The number of ads that ad network returns compared to the number of ads requested recorded by ad network. API Fill rate is calculated as API fills divided by API requests." title="API FillRate"></tip></span>
        <span slot="API Clicks"><tip tip="The number of clicks on your ads recorded by ad network" title="API Clicks"></tip></span>
        <span slot="Clicks"><tip tip="The number of clicks on your ads recorded by OM SDK." title="Clicks"></tip></span>
        <span slot="API Impressions"><tip tip="Total number of times the ad is shown recorded by ad network." title="API Impressions"></tip></span>
        <span slot="Impressions"><tip tip="Total number of times the ad is shown recorded by OM SDK." title="Impressions"></tip></span>
        <span slot="Revenue"><tip tip="The total amount of revenue generated" title="Revenue"></tip></span>
        <span slot="API eCPM"><tip tip="" title="API eCPM"></tip></span>
        <span slot="eCPM"><tip tip="Effective cost per thousand Impressions; calculated as (Revenue / Impressions) * 1000" title="eCPM"></tip></span>
        <span slot="Ad-Availability Check"><tip tip="The number of times an ad source is asked whether it is ready to show an ad" title="Ad-Availability Check"></tip></span>
        <span slot="Ad-Availability Response"><tip tip="The number of times an ad source had an ad available to show at the time of the request" title="Ad-Availability Response"></tip></span>
        <span slot="Ad-Availability Rate"><tip tip="The rate at which an ad source had an ad available when an ad was requested" title="Ad-Availability Rate"></tip></span>
        <span slot="Video Completions"><tip tip="The amount of Video Completions" title="Video Completions"></tip></span>
        <span slot="Video Start"><tip tip="The amount of Video Start" title="Video Start"></tip></span>
        <span slot="instanceId" slot-scope="text, record">
          <span v-if="record.bid===1">
            <a-row>
              <a-col :span="16" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;margin-top: 4px;">{{ text }}</a-col>
              <a-col :span="8"><a-button type="danger" style="font-size: 12px;height: 25px;float: right;" ghost>In-app Bidding</a-button></a-col>
            </a-row>
          </span>
          <span v-else>{{ text }}</span>
        </span>
      </a-table>
      <div v-else class="performance_no_data">
        <div class="no_data">
          <img src="/icon/empty.svg" />
        </div>
      </div>
    </div>
    <ul v-if="table.data.length" style="list-style:disc;margin-left: -16px;margin-top:8px;color: #999999;">
      <li>All reports and dates are in UTC</li>
      <li>The payment of the revenues displayed for Ad Networks other than AdTiming is subject to the Ad Networks' terms and conditions.</li>
    </ul>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { OmAdNetworkSelect, OmRegionsSelect, OmReportDatePicker, OmPubAppSelect, OmPlacementSelectSimple } from '../../components/om'
import OmReportChart from './ChartCardG2.js'
import { getReportList } from '../../api/report'
import Tip from './Tip'

import { generateUUID } from 'ant-design-vue/lib/vc-select/util'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'
import { mapState } from 'vuex'
numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

const supportedDimensions = {
  hour: 'Hour',
  day: 'Day',
  country: 'Regions',
  pubAppId: 'Apps',
  adType: 'Ad Type',
  placementId: 'Placements',
  adnId: 'AdNetworks',
  instanceId: 'Instance',
  sceneId: 'Scenes'
}

const dimColumnMapper = {
  day: 'day',
  hour: 'hour',
  country: 'country',
  pubAppId: 'pubAppName',
  placementId: 'placementName',
  adType: 'adType',
  adnId: 'adnName',
  instanceId: 'instanceName',
  sceneId: 'sceneName'
}

export default {
  name: 'OmPerformanceReport',
  components: {
    OmPubAppSelect,
    OmReportChart,
    OmAdNetworkSelect,
    OmReportDatePicker,
    OmRegionsSelect,
    OmPlacementSelectSimple,
    Ellipsis,
    Tip
  },
  computed: {
    chartGroupViewDim () {
      return dimColumnMapper[this.chartGroupBy] || this.chartGroupBy
    },
    ...mapState({
      currentOrgId: state => state.publisher.currentOrgId
    }),
    chartGroupBreakdown () {
      return supportedDimensions[this.chartGroupBy] || this.chartGroupBy
    }
  },
  data () {
    let pubids = null
    const def = {
      defaultApps: [],
      defaultRegions: [],
      defaultPlacements: [],
      defaultAdns: [],
      dimension: ['day'],
      metric: ['impr', 'cost', 'ecpm']
    }
    let lastCondition = localStorage.getItem('condition-p-' + this.$store.state.publisher.currentOrgId)
    if (lastCondition) {
      lastCondition = JSON.parse(lastCondition)
      const { pubAppId = [], placementId = [], country = [], adnId = [], dimension = ['day'], metric = ['impr', 'cost', 'ecpm'] } = { ...lastCondition }
      def.defaultApps = pubAppId
      def.defaultPlacements = placementId
      def.defaultRegions = country
      def.defaultAdns = adnId
      def.dimension = dimension
      def.metric = metric
      pubids = pubAppId
    }
    let queryPubAppId = this.$route.query.pubAppId
    if (queryPubAppId) {
      queryPubAppId = parseInt(queryPubAppId)
      def.defaultApps = [queryPubAppId]
      pubids = [queryPubAppId]
    }
    return {
      lastCondition,
      def,
      form: this.$form.createForm(this),
      regions: def.defaultRegions || [],
      country: [],
      pubAppIds: pubids,
      metricFields: {
        request: 'waterfallRequest',
        filled: 'waterfallFilled',
        click: 'apiClick',
        impr: 'apiImpr',
        apiRequest: 'apiRequest',
        apiFilled: 'apiFilled',
        sdkClick: 'mediationClick',
        sdkImpr: 'mediationImpr',
        videoCompletion: 'videoComplete',
        videoStart: 'videoStart'
      },
      supportedMetrics: {
        impr: { title: 'API Impressions', sort: 7, format: '0,0' },
        sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
        click: { title: 'API Clicks', sort: 9 },
        sdkClick: { title: 'Clicks', sort: 10 },
        ctr: { title: 'API CTR', sort: 11, format: '0.00 %' },
        sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' },
        ecpm: { title: 'eCPM', sort: 13, format: '$ 0,0.00' },
        cost: { title: 'Revenue', sort: 15, format: '$ 0,0.00' },
        isReady: { title: 'Ad-Availability Check', sort: 16 },
        isReadyTrue: { title: 'Ad-Availability Response', sort: 17 },
        readyRate: { title: 'Ad-Availability Rate', format: '0.00 %', sort: 18 },
        videoStart: { title: 'Video Start', sort: 19, format: '0,0' },
        videoCompletion: { title: 'Video Completions', sort: 20, format: '0,0' }
      },
      dimList4Chart: this.filterDim('pubAppId', 'country', 'adnId'),
      dimList4Table: this.filterDim('day', 'hour', 'country', 'pubAppId', 'adType', 'placementId', 'adnId', 'instanceId', 'sceneId'),
      loading: false,
      chartGroupBy: 'pubAppId',
      chartData: [],
      sorter: null,
      dimension: def.dimension,
      disableds: [],
      requestshow: true,
      adnshow: true,
      current: 1,
      allMetrics: ['apiRequest', 'request', 'apiFilled', 'filled', 'apiFillRate', 'fillRate', 'impr', 'sdkImpr', 'click', 'sdkClick', 'ctr', 'sdkCtr', 'ecpm', 'cost', 'isReady', 'isReadyTrue', 'readyRate', 'videoStart', 'videoCompletion'],
      table: {
        loading: false,
        metric: def.metric,
        data: [],
        columns: []
      }
    }
  },
  mounted () {
    if (this.dimension.includes('sceneId')) {
      this.disableds = ['adnId', 'instanceId']
    }
    if (this.dimension.includes('adnId') || this.dimension.includes('instanceId')) {
      this.disableds = ['sceneId']
    }
    if (!this.dimension.includes('sceneId') && !this.dimension.includes('instanceId') && !this.dimension.includes('adnId')) {
      this.disableds = []
    }
    if (this.dimension.includes('sceneId')) {
      this.table.metric = this.table.metric.filter(a => ['sdkImpr', 'sdkClick'].includes(a))
      this.supportedMetrics = {
        sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
        sdkClick: { title: 'Clicks', sort: 10 }
      }
      this.reloadTable('metric')
    } else if (this.dimension.includes('hour')) {
      this.table.metric = this.table.metric.filter(a => ['request', 'filled', 'fillRate', 'sdkImpr', 'sdkClick', 'sdkCtr'].includes(a))
      this.supportedMetrics = {
        request: { title: 'Requests', sort: 2, format: '0,0' },
        filled: { title: 'Fills', sort: 4 },
        fillRate: { title: 'FillRate', sort: 6, format: '0.00 %' },
        sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
        sdkClick: { title: 'Clicks', sort: 10 },
        sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' }
      }
      if (!this.dimension.includes('day')) {
        this.dimension.unshift('day')
      }
      this.reloadTable('metric')
    } else if (this.dimension.includes('adnId') || this.dimension.includes('instanceId')) {
      this.table.metric = this.table.metric.filter(a => ['apiRequest', 'request', 'apiFilled', 'filled', 'apiFillRate', 'fillRate', 'impr', 'sdkImpr', 'click', 'sdkClick', 'ctr', 'sdkCtr', 'ecpm', 'cost', 'videoStart', 'videoCompletion'].includes(a))
      this.supportedMetrics = {
        apiRequest: { title: 'API Requests', sort: 1, format: '0,0' },
        request: { title: 'Requests', sort: 2, format: '0,0' },
        apiFilled: { title: 'API Fills', sort: 3 },
        filled: { title: 'Fills', sort: 4 },
        apiFillRate: { title: 'API FillRate', sort: 5, format: '0.00 %' },
        fillRate: { title: 'FillRate', sort: 6, format: '0.00 %' },
        impr: { title: 'API Impressions', sort: 7, format: '0,0' },
        sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
        click: { title: 'API Clicks', sort: 9 },
        sdkClick: { title: 'Clicks', sort: 10 },
        ctr: { title: 'API CTR', sort: 11, format: '0.00 %' },
        sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' },
        ecpm: { title: 'eCPM', sort: 13, format: '$ 0,0.00' },
        cost: { title: 'Revenue', sort: 15, format: '$ 0,0.00' },
        videoStart: { title: 'Video Start', sort: 19, format: '0,0' },
        videoCompletion: { title: 'Video Completions', sort: 20, format: '0,0' }
      }
      this.reloadTable('metric')
    } else {
      this.resetMetrics()
      this.reloadTable('dimension')
    }
    this.reloadChart()
  },
  watch: {
    dimension (val) {
      if (!val) {
        this.disableds = []
      }
      if (this.dimension.includes('sceneId')) {
        this.disableds = ['adnId', 'instanceId']
      }
      if (this.dimension.includes('adnId') || this.dimension.includes('instanceId')) {
        this.disableds = ['sceneId']
      }
      if (!this.dimension.includes('sceneId') && !this.dimension.includes('instanceId') && !this.dimension.includes('adnId')) {
        this.disableds = []
      }
      if (this.dimension.includes('sceneId')) {
        this.table.metric = this.table.metric.filter(a => ['sdkImpr', 'sdkClick'].includes(a))
        this.supportedMetrics = {
          sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
          sdkClick: { title: 'Clicks', sort: 10 }
        }
        this.reloadTable('metric')
      } else if (this.dimension.includes('hour')) {
        this.table.metric = this.table.metric.filter(a => ['request', 'filled', 'fillRate', 'sdkImpr', 'sdkClick', 'sdkCtr'].includes(a))
        this.supportedMetrics = {
          request: { title: 'Requests', sort: 2, format: '0,0' },
          filled: { title: 'Fills', sort: 4 },
          fillRate: { title: 'FillRate', sort: 6, format: '0.00 %' },
          sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
          sdkClick: { title: 'Clicks', sort: 10 },
          sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' }
        }
        if (!this.dimension.includes('day')) {
          this.dimension.unshift('day')
        }
        this.reloadTable('metric')
      } else if (this.dimension.includes('adnId') || this.dimension.includes('instanceId')) {
        this.table.metric = this.table.metric.filter(a => ['apiRequest', 'request', 'apiFilled', 'filled', 'apiFillRate', 'fillRate', 'impr', 'sdkImpr', 'click', 'sdkClick', 'ctr', 'sdkCtr', 'ecpm', 'cost', 'videoStart', 'videoCompletion'].includes(a))
        this.supportedMetrics = {
          apiRequest: { title: 'API Requests', sort: 1, format: '0,0' },
          request: { title: 'Requests', sort: 2, format: '0,0' },
          apiFilled: { title: 'API Fills', sort: 3 },
          filled: { title: 'Fills', sort: 4 },
          apiFillRate: { title: 'API FillRate', sort: 5, format: '0.00 %' },
          fillRate: { title: 'FillRate', sort: 6, format: '0.00 %' },
          impr: { title: 'API Impressions', sort: 7, format: '0,0' },
          sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
          click: { title: 'API Clicks', sort: 9 },
          sdkClick: { title: 'Clicks', sort: 10 },
          ctr: { title: 'API CTR', sort: 11, format: '0.00 %' },
          sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' },
          ecpm: { title: 'eCPM', sort: 13, format: '$ 0,0.00' },
          cost: { title: 'Revenue', sort: 15, format: '$ 0,0.00' },
          videoStart: { title: 'Video Start', sort: 19, format: '0,0' },
          videoCompletion: { title: 'Video Completions', sort: 20, format: '0,0' }
        }
        this.reloadTable('metric')
      } else {
        this.resetMetrics()
      }
    }
  },
  methods: {
    resetMetrics () {
      if (this.requestshow) {
        this.supportedMetrics = {
          apiRequest: { title: 'API Requests', sort: 1, format: '0,0' },
          request: { title: 'Requests', sort: 2, format: '0,0' },
          apiFilled: { title: 'API Fills', sort: 3 },
          filled: { title: 'Fills', sort: 4 },
          apiFillRate: { title: 'API FillRate', sort: 5, format: '0.00 %' },
          fillRate: { title: 'FillRate', sort: 6, format: '0.00 %' },
          impr: { title: 'API Impressions', sort: 7, format: '0,0' },
          sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
          click: { title: 'API Clicks', sort: 9 },
          sdkClick: { title: 'Clicks', sort: 10 },
          ctr: { title: 'API CTR', sort: 11, format: '0.00 %' },
          sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' },
          ecpm: { title: 'eCPM', sort: 13, format: '$ 0,0.00' },
          cost: { title: 'Revenue', sort: 15, format: '$ 0,0.00' },
          isReady: { title: 'Ad-Availability Check', sort: 16 },
          isReadyTrue: { title: 'Ad-Availability Response', sort: 17 },
          readyRate: { title: 'Ad-Availability Rate', format: '0.00 %', sort: 18 },
          videoStart: { title: 'Video Start', sort: 19, format: '0,0' },
          videoCompletion: { title: 'Video Completions', sort: 20, format: '0,0' }
        }
      } else {
        this.supportedMetrics = {
          impr: { title: 'API Impressions', sort: 7, format: '0,0' },
          sdkImpr: { title: 'Impressions', sort: 8, format: '0,0' },
          click: { title: 'API Clicks', sort: 9 },
          sdkClick: { title: 'Clicks', sort: 10 },
          ctr: { title: 'API CTR', sort: 11, format: '0.00 %' },
          sdkCtr: { title: 'CTR', sort: 12, format: '0.00 %' },
          ecpm: { title: 'eCPM', sort: 13, format: '$ 0,0.00' },
          cost: { title: 'Revenue', sort: 15, format: '$ 0,0.00' },
          isReady: { title: 'Ad-Availability Check', sort: 16 },
          isReadyTrue: { title: 'Ad-Availability Response', sort: 17 },
          readyRate: { title: 'Ad-Availability Rate', format: '0.00 %', sort: 18 },
          videoStart: { title: 'Video Start', sort: 19, format: '0,0' },
          videoCompletion: { title: 'Video Completions', sort: 20, format: '0,0' }
        }
      }
    },
    handleFooterShow () {
      if (this.dimension.length > 0) {
        return (
          <a-table
            rowKey={Math.random}
            bordered={false}
            pagination={false}
            columns={this.table.columns}
            scroll={{ x: 500 }}
            dataSource={[this.table.sum]}
            showHeader={false}
          ></a-table>
        )
      }
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    disabledField (key) {
      return this.disableds.includes(key)
    },
    appSelect (val) {
      this.pubAppIds = val
      console.log(val)
    },
    tableChange (pagination, filters, sorter) {
      this.sorter = sorter
      this.current = pagination.current
    },
    filterDim (...ids) {
      return ids.map(id => {
        return { id, title: supportedDimensions[id] }
      })
    },
    countryChange (val) {
      this.regions = val
    },
    handleApply () {
      this.reloadChart()
      this.reloadTable('dimension')
    },
    handleDim4ChartChange (dim) {
      this.chartGroupBy = dim.id
      this.reloadChart()
    },
    handleDim4TableChange (dim) {
      this.dimension = dim
      this.reloadTable('dimension')
    },
    handleMetricsChange (val) {
      this.table.metric = this.allMetrics.filter(v => val.includes(v))
      this.reloadTable('metric')
    },
    buildBaseParams () {
      const ps = this.form.getFieldsValue()
      ps.dateBegin = ps.dateRange[0].format('YYYY-MM-DD')
      ps.dateEnd = ps.dateRange[1].format('YYYY-MM-DD')
      delete ps.dateRange
      ps.country = JSON.parse(JSON.stringify(this.regions))
      if (ps.country && ps.country.indexOf('ALL') > -1) {
        ps.country.splice(ps.country.indexOf('ALL'), 1)
        ps.country.push('00')
      }
      ps.type = ['lr', 'api']
      ps.dimension = ['day', this.chartGroupBy]
      if (ps.adnId && ps.adnId.length) {
        this.metricFields.request = 'instanceRequest'
        this.metricFields.filled = 'instanceFilled'
      } else {
        this.metricFields.request = 'waterfallRequest'
        this.metricFields.filled = 'waterfallFilled'
      }
      return ps
    },
    reloadChart () {
      const ps = this.buildBaseParams()
      this.loading = true
      getReportList(ps)
        .then(res => {
          if (!res.code) {
            this.chartData = res.data.map(this.mapMetricsChart).sort((a, b) => (b.cost || 0) - a.cost || 0)
          }
        })
        .finally(_ => {
          this.loading = false
        })
    },
    reloadTable (triggerType) {
      this.current = 1
      const { metric } = this.table
      const dimension = this.dimension
      const _this = this
      if (metric.length === 0) {
        this.table.columns = []
        this.table.data = []
        return
      }
      const ps = this.buildBaseParams()
      const { pubAppId, placementId, country, adnId } = { ...ps }
      ps.dimension = dimension
      ps.metric = metric
      const cond = { pubAppId, placementId, country, adnId, dimension, metric }
      localStorage.setItem('condition-p-' + this.currentOrgId, JSON.stringify(cond))
      const columns = dimension.map(dim => {
        const di = dimColumnMapper[dim] || dim
        return {
          dataIndex: di,
          width: ['Apps', 'Placements', 'Instance'].includes(supportedDimensions[dim]) ? '350px' : '180px',
          t: supportedDimensions[dim],
          customHeaderCell: (custom) => {
            return {
              style: { borderBottom: 'none' },
              class: 'adt-cell-blue'
            }
          },
          slots: { title: supportedDimensions[dim] },
          scopedSlots: { customRender: dim },
          sorter: (a, b) => {
            return a[di].localeCompare ? a[di].localeCompare(b[di]) : a[di] - b[di]
          }
        }
      })
      metric.forEach(name => {
        const _metric = this.supportedMetrics[name]
        if (!_metric.format) {
          _metric.format = '0,0'
        }
        columns.push({
          dataIndex: name,
          t: _metric.title,
          customRender (v, row, i) {
            return numerify(v, _metric.format)
          },
          customHeaderCell: (custom) => {
            return {
              style: { borderBottom: 'none' },
              class: 'adt-cell-green'
            }
          },
          align: 'right',
          width: ['Ad-Availability Check', 'Ad-Availability Response', 'Ad-Availability Rate', 'Video Completions'].includes(_metric.title) ? '250px' : '180px',
          slots: { title: _metric.title },
          sorter (a, b) {
            return a[name] - b[name]
          }
        })
      })
      this.table.columns = columns

      if (this.table.data.length === 0 || triggerType === 'dimension') {
        this.table.loading = true
        getReportList(ps)
          .then(res => {
            if (!res.code) {
              if ((ps.adnId && ps.adnId.length) || dimension.includes('adnId') || dimension.includes('instanceId')) {
                this.metricFields.request = 'instanceRequest'
                this.metricFields.filled = 'instanceFilled'
              } else {
                this.metricFields.request = 'waterfallRequest'
                this.metricFields.filled = 'waterfallFilled'
              }
              this.table.data = res.data.map(this.mapMetrics).sort((a, b) => {
                if (b.day) {
                  return b.day.localeCompare(a.day)
                }
                return 0
              })
              const sumData = { apiRequest: 0, request: 0, click: 0, sdkClick: 0, apiFilled: 0, filled: 0, impr: 0, sdkImpr: 0, ecpm: 0, ctr: 0, sdkCtr: 0, apiFillRate: 0, fillRate: 0, cost: 0, videoCompletion: 0, videoStart: 0, isReady: 0, isReadyTrue: 0, readyRate: 0 }
              this.table.data.forEach(row => {
                sumData.request += row.request
                sumData.apiRequest += row.apiRequest
                sumData.click += row.click
                sumData.sdkClick += row.sdkClick
                sumData.filled += row.filled
                sumData.apiFilled += row.apiFilled
                sumData.impr += row.impr
                sumData.sdkImpr += row.sdkImpr
                sumData.cost += row.cost
                sumData.videoStart += row.videoStart
                sumData.videoCompletion += row.videoCompletion
                sumData.isReady += row.isReady
                sumData.isReadyTrue += row.isReadyTrue
              })
              if (sumData.request > 0) {
                sumData.fillRate = sumData.filled / sumData.request
              }
              if (sumData.isReady > 0) {
                sumData.readyRate = sumData.isReadyTrue / sumData.isReady
              }
              if (sumData.impr > 0) {
                sumData.ctr = sumData.click / sumData.impr
                sumData.ecpm = sumData.cost * 1000 / sumData.impr
              }
              if (sumData.apiRequest > 0) {
                sumData.apiFillRate = sumData.apiFilled / sumData.apiRequest
              }
              if (sumData.sdkImpr > 0) {
                sumData.sdkCtr = sumData.sdkClick / sumData.sdkImpr
              }
              if (dimension.length > 0) {
                sumData[dimColumnMapper[dimension[dimension.length - 1]]] = 'Total'
              }
              _this.table.sum = sumData
              setTimeout(function () {
                const dom = _this.$vnode.elm.querySelectorAll('.ant-table-body')[0]
                if (dom) {
                  dom.addEventListener(
                    'scroll',
                    () => {
                      _this.$vnode.elm.querySelectorAll('.ant-table-body')[1].scrollLeft = dom.scrollLeft
                    },
                    true
                  )
                }
              }, 500)
            }
          })
          .finally(_ => {
            this.table.loading = false
          })
      }
    },
    mapMetrics (row) {
      row.id = generateUUID()
      row.request = row[this.metricFields.request] || 0
      row.filled = row[this.metricFields.filled] || 0
      row.click = row[this.metricFields.click] || 0
      row.impr = row[this.metricFields.impr] || 0
      row.apiRequest = row[this.metricFields.apiRequest] || 0
      row.apiFilled = row[this.metricFields.apiFilled] || 0
      row.sdkClick = row[this.metricFields.sdkClick] || 0
      row.sdkImpr = row[this.metricFields.sdkImpr] || 0
      row.videoCompletion = row[this.metricFields.videoCompletion] || 0
      row.videoStart = row[this.metricFields.videoStart] || 0
      row.videoStart = row[this.metricFields.videoStart] || 0
      row.isReadyTrue = row.isReadyTrue || 0
      row.isReadyFalse = row.isReadyFalse || 0
      row.cost = row.cost || 0
      row.isReady = 0
      row.readyRate = 0
      row.ecpm = 0
      row.ctr = 0
      row.fillRate = row.ctr = 0
      row.sdkCtr = 0
      row.apiFillRate = row.sdkCtr = 0
      if (row.request > 0) {
        row.fillRate = row.filled / row.request
      }
      if (row.apiRequest > 0) {
        row.apiFillRate = row.apiFilled / row.apiRequest
      }
      if (row.impr > 0) {
        row.ctr = row.click / row.impr
        row.ecpm = row.cost * 1000 / row.impr
      }
      if (row.sdkImpr > 0) {
        row.sdkCtr = row.sdkClick / row.sdkImpr
      }
      row.isReady = row.isReadyTrue + row.isReadyFalse
      if (row.isReady > 0) {
        row.readyRate = row.isReadyTrue / row.isReady
      }
      if (!row.country) {
        row.country = '(Empty)'
      }
      if (!row.placementName) {
        row.placementName = '(Empty)'
      }
      if (!row.pubAppName) {
        row.pubAppName = '(Empty)'
      }
      if (!row.adnName) {
        row.adnName = '(Empty)'
      }
      if (!row.instanceName) {
        row.instanceName = '(Empty)'
      }
      if (!row.sceneName) {
        row.sceneName = '(Empty)'
      }
      return row
    },
    mapMetricsChart (row) {
      const ps = this.form.getFieldsValue()
      row.id = generateUUID()
      if ((ps.adnId && ps.adnId.length) || this.chartGroupBy === 'adnId') {
        this.metricFields.request = 'instanceRequest'
        this.metricFields.filled = 'instanceFilled'
      } else {
        this.metricFields.request = 'waterfallRequest'
        this.metricFields.filled = 'waterfallFilled'
      }
      row.request = row[this.metricFields.request] || 0
      row.filled = row[this.metricFields.filled] || 0
      row.click = row[this.metricFields.click] || 0
      row.impr = row[this.metricFields.impr] || 0
      row.apiRequest = row[this.metricFields.apiRequest] || 0
      row.apiFilled = row[this.metricFields.apiFilled] || 0
      row.sdkClick = row[this.metricFields.sdkClick] || 0
      row.sdkImpr = row[this.metricFields.sdkImpr] || 0
      row.videoCompletion = row[this.metricFields.videoCompletion] || 0
      row.videoStart = row[this.metricFields.videoStart] || 0
      row.videoStart = row[this.metricFields.videoStart] || 0
      row.isReadyTrue = row.isReadyTrue || 0
      row.isReadyFalse = row.isReadyFalse || 0
      row.cost = row.cost || 0
      row.isReady = 0
      row.readyRate = 0
      row.ecpm = 0
      row.ctr = 0
      row.fillRate = row.ctr = 0
      row.sdkCtr = 0
      row.apiFillRate = row.sdkCtr = 0
      if (row.request > 0) {
        row.fillRate = row.filled / row.request
      }
      if (row.apiRequest > 0) {
        row.apiFillRate = row.apiFilled / row.apiRequest
      }
      if (row.impr > 0) {
        row.ctr = row.click / row.impr
        row.ecpm = row.cost * 1000 / row.impr
      }
      if (row.sdkImpr > 0) {
        row.sdkCtr = row.sdkClick / row.sdkImpr
      }
      row.isReady = row.isReadyTrue + row.isReadyFalse
      if (row.isReady > 0) {
        row.readyRate = row.isReadyTrue / row.isReady
      }
      if (!row.country) {
        row.country = '(Empty)'
      }
      if (!row.placementName) {
        row.placementName = '(Empty)'
      }
      if (!row.pubAppName) {
        row.pubAppName = '(Empty)'
      }
      if (!row.adnName) {
        row.adnName = '(Empty)'
      }
      if (!row.instanceName) {
        row.instanceName = '(Empty)'
      }
      if (!row.sceneName) {
        row.sceneName = '(Empty)'
      }
      return row
    },
    handleDownload () {
      const header = this.table.columns.map(col => col.t).join(',')
      let data = [...this.table.data]
      const that = this
      if (this.sorter) {
        data = data.sort((a, b) => {
          if (that.sorter.order === 'ascend') {
            return a[that.sorter.field].localeCompare ? a[that.sorter.field].localeCompare(b[that.sorter.field]) : a[that.sorter.field] - b[that.sorter.field]
          } else {
            return b[that.sorter.field].localeCompare ? b[that.sorter.field].localeCompare(a[that.sorter.field]) : b[that.sorter.field] - a[that.sorter.field]
          }
        })
      }
      data = data.map(row => {
        return this.table.columns.map(col => {
          return row[col.dataIndex]
        }).join(',')
      }).join('\n')
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), header + '\n' + data], { type: 'text/csv,charset=UTF-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'download.csv'
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }
}
</script>
<style type="less" scoped>
  .ant-form-item {
    margin-right: 8px;
    button {
      width: 100px;
    }
  }
  .performance_no_data {
    background: #FBFBFB;
    height: 176px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .performance_no_data div > div {
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
  }
  /deep/ .ant-table-footer .ant-table-body{
    overflow: hidden !important;
  }
</style>
