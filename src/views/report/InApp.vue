<!-- Report Performance tab -->
<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-pub-app-select :defaultValue="def.defaultApps" @change="appSelect" width="240px"/>
      <a-form-item>
        <om-regions-select :defaultSelected="def.defaultRegions" :maxTagCount="1" :ignoreApp="true" @change="countryChange" style="width: 154px"/>
      </a-form-item>
      <om-placement-select-simple :pubAppIds="pubAppIds" :defaultValue="def.defaultPlacements" :form="form" width="225px"/>
      <om-ad-network-select v-if="this.adnshow" :defaultValue="def.defaultAdns" width="185px"/>
      <a-form-item>
        <a-button ghost @click="handleApply" type="primary" style="width: 84px;">Apply</a-button>
      </a-form-item>
      <om-report-date-picker @ok="handleApply"/>
    </a-form>

    <div style="background-color: white; margin-top: 8px; padding: 16px">
      <div style="margin-bottom: 16px;">
        <span style="font-size: 16px;color: #333333;font-weight:500;margin-right: 4px;">In-app Bidding by</span>
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
            y-column="impr"
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
            y-column="winPrice"
            y-format="$0a[.]00"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="12">
          <om-report-chart
            title="Bid Request"
            v-show="requestshow"
            :loading="loading"
            :data="chartData"
            :height="248"
            y-format="0,0.[00]a"
            x-column="day"
            y-column="bidRequest"
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
        style="width:380px;margin:0 0 16px 16px;"
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
        <span slot="Day"><tip tip="" title="Day"></tip></span>
        <span slot="Hour"><tip tip="" title="Hour"></tip></span>
        <span slot="Apps"><tip tip="" title="Apps"></tip></span>
        <span slot="Regions"><tip tip="" title="Regions"></tip></span>
        <span slot="Ad Type"><tip tip="" title="Ad Type"></tip></span>
        <span slot="Placements"><tip tip="" title="Placements"></tip></span>
        <span slot="Bid Source"><tip tip="" title="Bid Source"></tip></span>
        <span slot="Instance"><tip tip="" title="Instance"></tip></span>

        <span slot="Bid Requests"><tip tip="The number of requests made to an In-app Bidding ad network." title="Bid Requests"></tip></span>
        <span slot="Bids in auction"><tip tip="The number of bids submitted by the ad network that participated in In-app Bidding auctions. " title="Bids in auction"></tip></span>
        <span slot="Bids rate"><tip tip="The percentage of bids that participated in In-app Bidding auctions. " title="Bids rate"></tip></span>
        <span slot="Win"><tip tip="The number of bids that won in an request." title="Win"></tip></span>
        <span slot="Win rate"><tip tip="The percentage of bids that won an In-app Bidding auction." title="Win rate"></tip></span>
        <span slot="Impressions"><tip tip="" title="Impressions"></tip></span>
        <span slot="Revenue"><tip tip="" title="Revenue"></tip></span>
        <span slot="eCPM"><tip tip="" title="eCPM"></tip></span>
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
import { OmAdNetworkSelect, OmReportDatePicker, OmRegionsSelect, OmPubAppSelect, OmPlacementSelectSimple } from '../../components/om'
import OmReportChart from './ChartCardG2.js'
import { getReportList } from '../../api/report'

import { generateUUID } from 'ant-design-vue/lib/vc-select/util'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'
import { mapState } from 'vuex'
import Tip from './Tip'
numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

const supportedDimensions = {
  hour: 'Hour',
  day: 'Day',
  country: 'Regions',
  pubAppId: 'Apps',
  adType: 'Ad Type',
  placementId: 'Placements',
  instanceId: 'Instance',
  sceneId: 'Scenes',
  adnId: 'Bid Source'
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
      currentOrgId: state => state.publisher.currentOrgId,
      userId: state => state.user.info.id
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
      metric: ['impr', 'winPrice', 'ecpm']
    }
    let lastCondition = localStorage.getItem('condition-i-' + this.$store.state.publisher.currentOrgId)
    if (lastCondition) {
      lastCondition = JSON.parse(lastCondition)
      const { pubAppId = [], placementId = [], country = [], adnId = [], dimension = ['day'], metric = ['impr', 'winPrice', 'ecpm'] } = { ...lastCondition }
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
        bidRequest: 'bidReq',
        bidResponse: 'bidResp',
        bidRate: 'bidRate',
        win: 'bidWin',
        winRate: 'winRate',
        impr: 'impr',
        winPrice: 'bidWinPrice'
      },
      supportedMetrics: {
        bidRequest: { title: 'Bid Requests', format: '0,0' },
        bidResponse: { title: 'Bids in auction' },
        bidRate: { title: 'Bids rate', format: '0.00 %' },
        win: { title: 'Win', format: '0,0' },
        winRate: { title: 'Win rate', format: '0.00 %' },
        impr: { title: 'Impressions', format: '0,0' },
        winPrice: { title: 'Revenue', format: '$ 0,0.00' },
        ecpm: { title: 'eCPM', format: '$ 0,0.00' }
      },
      dimList4Chart: this.filterDim('pubAppId', 'country', 'adnId'),
      dimList4Table: this.filterDim('day', 'hour', 'pubAppId', 'country', 'adType', 'placementId', 'adnId', 'instanceId'),
      loading: false,
      chartGroupBy: 'pubAppId',
      chartData: [],
      sorter: null,
      dimension: def.dimension,
      disableds: [],
      requestshow: true,
      adnshow: true,
      current: 1,
      allMetrics: ['bidRequest', 'bidResponse', 'bidRate', 'win', 'winRate', 'impr', 'winPrice', 'ecpm'],
      table: {
        loading: false,
        metric: def.metric,
        data: [],
        columns: []
      }
    }
  },
  mounted () {
    this.reloadChart()
    this.reloadTable('dimension')
  },
  watch: {
    dimension (val) {
      if (!val) {
        this.disableds = []
      }
    }
  },
  methods: {
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
      ps.bid = [1]
      delete ps.dateRange
      ps.country = JSON.parse(JSON.stringify(this.regions))
      if (ps.country && ps.country.indexOf('ALL') > -1) {
        ps.country.splice(ps.country.indexOf('ALL'), 1)
        ps.country.push('00')
      }
      ps.type = ['lr']
      ps.dimension = ['day', this.chartGroupBy]
      return ps
    },
    reloadChart () {
      const ps = this.buildBaseParams()
      this.loading = true
      getReportList(ps)
        .then(res => {
          if (!res.code) {
            this.chartData = res.data.map(this.mapMetrics).sort((a, b) => (b.winPrice || 0) - a.winPrice || 0)
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
      localStorage.setItem('condition-i-' + this.currentOrgId, JSON.stringify(cond))
      const columns = dimension.map(dim => {
        const di = dimColumnMapper[dim] || dim
        return {
          dataIndex: di,
          width: '180px',
          t: supportedDimensions[dim],
          customHeaderCell: (custom) => {
            return {
              style: { borderBottom: 'none' },
              class: 'adt-cell-blue'
            }
          },
          slots: { title: supportedDimensions[dim] },
          sorter: (a, b) => a[di].localeCompare(b[di])
        }
      })
      metric.forEach(name => {
        const metric = this.supportedMetrics[name]
        if (!metric.format) {
          metric.format = '0,0'
        }
        columns.push({
          dataIndex: name,
          t: metric.title,
          customRender (v, row, i) {
            return numerify(v, metric.format)
          },
          customHeaderCell: (custom) => {
            return {
              style: { borderBottom: 'none' },
              class: 'adt-cell-green'
            }
          },
          align: 'right',
          width: '180px',
          slots: { title: metric.title },
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
              this.table.data = res.data.map(this.mapMetrics).sort((a, b) => {
                if (b.day) {
                  return b.day.localeCompare(a.day)
                }
                return 0
              })
              const sumData = { bidRequest: 0, bidResponse: 0, impr: 0, ecpm: 0, bidRate: 0, winRate: 0, winPrice: 0, win: 0 }
              this.table.data.forEach(row => {
                sumData.bidRequest += row.bidRequest
                sumData.bidResponse += row.bidResponse
                sumData.impr += row.impr
                sumData.win += row.win
                sumData.winPrice += row.winPrice
              })
              if (sumData.impr > 0) {
                sumData.ecpm = sumData.winPrice * 1000 / sumData.impr
              }
              if (sumData.bidRequest > 0) {
                sumData.bidRate = sumData.bidResponse / sumData.bidRequest
              }
              if (sumData.bidResponse > 0) {
                sumData.winRate = sumData.win / sumData.bidResponse
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
      row.bidRequest = row[this.metricFields.bidRequest] || 0
      row.bidResponse = row[this.metricFields.bidResponse] || 0
      row.bidRate = 0
      row.win = row[this.metricFields.win] || 0
      row.winRate = 0
      row.impr = row[this.metricFields.impr] || 0
      row.winPrice = row[this.metricFields.winPrice] || 0
      row.ecpm = 0
      if (row.impr > 0) {
        row.ecpm = row.winPrice * 1000 / row.impr
      }
      if (row.bidResponse) {
        row.winRate = row.win / row.bidResponse
      }
      if (row.bidRequest) {
        row.bidRate = row.bidResponse / row.bidRequest
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
