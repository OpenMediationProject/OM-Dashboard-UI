<!-- Report Performance tab -->
<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-pub-app-select width="200px"/>
      <a-form-item>
        <om-regions-select :maxTagCount="1" :ignoreApp="true" @change="countryChange" style="width: 161px"/>
      </a-form-item>
      <om-placement-select-simple :form="form" width="200px"/>
      <om-ad-network-select width="200px"/>
      <a-form-item>
        <a-button ghost @click="handleApply" type="primary" style="width: 84px;">Apply</a-button>
      </a-form-item>
      <om-report-date-picker/>
    </a-form>

    <div style="background-color: white; margin-top: 8px; padding: 16px">
      <div style="margin-bottom: 16px;">
        <span style="font-size: 16px;color: #333333;font-weight:500;margin-right: 4px;">Breakdown by</span>
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
            y-format="$0,0.000"
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
            y-format="$0,0.00"
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
        style="width:320px;margin:0 0 16px 16px;"
        placeholder="Metrics"
        mode="multiple"
        :maxTagCount="2"
        :allowClear="true"
        optionLabelProp="title"
        @change="handleMetricsChange"
        :value="table.metric">
        <a-select-option v-for="(o, key) in supportedMetrics" :key="key" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a @click="handleDownload" style="float: right; margin-right: 16px;margin-top: 4px;" :disabled="table.data.length===0">CSV</a>
      <a-table
        v-if="table.data.length"
        class="ant-card-table-default"
        :scroll="{x: true}"
        :loading="table.loading"
        :dataSource="table.data"
        :columns="table.columns"
        @change="tableChange"
        row-key="id"
        :pagination="false"/>
      <div v-else class="performance_no_data">
        <div class="no_data">
          <img src="/icon/empty.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { OmAdNetworkSelect, OmRegionsSelect, OmReportDatePicker, OmPubAppSelect, OmPlacementSelectSimple } from '../../components/om'
import OmReportChart from './ChartCardG2.js'
import { getReportList } from '../../api/report'
import { generateUUID } from 'ant-design-vue/lib/vc-select/util'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'
numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

const supportedDimensions = {
  day: 'Day',
  country: 'Regions',
  placementId: 'Placements',
  adnId: 'AdNetworks',
  pubAppId: 'Apps',
  instanceId: 'Instance',
  sceneId: 'Scenes'
}

const dimColumnMapper = {
  pubAppId: 'pubAppName',
  placementId: 'placementName',
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
    Ellipsis
  },
  data () {
    return {
      form: this.$form.createForm(this),
      country: [],
      metricFields: {
        request: 'waterfallRequest',
        filled: 'waterfallFilled',
        click: 'apiClick',
        impr: 'apiImpr'
      },
      supportedMetrics: {
        request: { title: 'Requests' },
        filled: { title: 'Fills' },
        fillRate: { title: 'FillRate', format: '0.00 %' },
        click: { title: 'Clicks' },
        impr: { title: 'Impressions' },
        ctr: { title: 'CTR', format: '0.00 %' },
        cost: { title: 'Revenue', format: '$ 0,0.00' },
        ecpm: { title: 'eCPM', format: '$ 0,0.00' },
        isReady: { title: 'Ad-Availability Check' },
        isReadyTrue: { title: 'Ad-Availability Response' },
        readyRate: { title: 'Ad-Availability Rate', format: '0.00 %' }
      },
      dimList4Chart: this.filterDim('pubAppId', 'country', 'adnId'),
      // dimList4Table: this.filterDim('day', 'country', 'pubAppId', 'placementId', 'adnId', 'instanceId', 'sceneId'),
      dimList4Table: this.filterDim('day', 'country', 'pubAppId', 'placementId', 'adnId', 'instanceId'),
      loading: false,
      chartGroupBy: 'pubAppId',
      chartData: [],
      disableds: [],
      dimension: ['day'],
      table: {
        loading: false,
        metric: ['impr', 'cost'],
        data: [],
        columns: []
      }
    }
  },
  mounted () {
    this.reloadChart()
    this.reloadTable('dimension')
  },
  computed: {
    chartGroupViewDim () {
      return dimColumnMapper[this.chartGroupBy] || this.chartGroupBy
    },
    chartGroupBreakdown () {
      return supportedDimensions[this.chartGroupBy] || this.chartGroupBy
    }
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
    }
  },
  methods: {
    disabledField (key) {
      return this.disableds.includes(key)
    },
    tableChange (pagination, filters, sorter) {
      this.sorter = sorter
    },
    filterDim (...ids) {
      return ids.map(id => {
        return { id, title: supportedDimensions[id] }
      })
    },
    countryChange (val) {
      this.country = val
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
      this.table.metric = val
      this.reloadTable('metric')
    },
    buildBaseParams () {
      const ps = this.form.getFieldsValue()
      ps.dateBegin = ps.dateRange[0].format('YYYY-MM-DD')
      ps.dateEnd = ps.dateRange[1].format('YYYY-MM-DD')
      delete ps.dateRange
      ps.country = this.country
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
            if (this.metricFields.request === 'waterfallRequest' && this.chartGroupBy === 'adnId') {
              this.metricFields.request = 'instanceRequest'
              this.metricFields.filled = 'instanceFilled'
            }
            this.chartData = res.data.map(this.mapMetrics).sort((a, b) => (b.cost || 0) - a.cost || 0)
          }
        })
        .finally(_ => {
          this.loading = false
        })
    },
    reloadTable (triggerType) {
      const { metric } = this.table
      const dimension = this.dimension
      if (metric.length === 0) {
        this.table.columns = []
        this.table.data = []
        return
      }
      const ps = this.buildBaseParams()
      ps.dimension = dimension
      ps.metric = metric
      const columns = dimension.map(dim => {
        const di = dimColumnMapper[dim] || dim
        return {
          title: supportedDimensions[dim],
          dataIndex: di,
          sorter: (a, b) => a[di].localeCompare(b[di])
        }
      })
      metric.forEach(name => {
        const metric = this.supportedMetrics[name]
        if (!metric.format) {
          metric.format = '0,0'
        }
        columns.push({
          title: metric.title,
          dataIndex: name,
          customRender (v, row, i) {
            return numerify(v, metric.format)
          },
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
              if (dimension.includes('adnId') || dimension.includes('instanceId')) {
                this.metricFields.request = 'instanceRequest'
                this.metricFields.filled = 'instanceFilled'
              }
              this.table.data = res.data.map(this.mapMetrics).sort((a, b) => {
                if (b.day) {
                  return b.day.localeCompare(a.day)
                }
                return 0
              })
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
      row.ecpm = 0
      row.ctr = 0
      row.fillRate = row.ctr = 0
      if (row.filled > 0) {
        row.fillRate = row.filled / row.request
      }
      if (row.click > 0) {
        row.ctr = row.click / row.impr
      }
      if (row.impr > 0) {
        row.ecpm = row.cost * 1000 / row.impr
      }
      row.isReady = row.isReadyTrue + row.isReadyFalse
      if (row.isReadyTrue > 0) {
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
      const header = this.table.columns.map(col => col.title).join(',')
      let data = [...this.table.data]
      const that = this
      if (this.sorter) {
        data = data.sort((a, b) => {
          if (that.sorter.order === 'ascend') {
            return (a[that.sorter.field] + '').localeCompare(b[that.sorter.field] + '')
          } else {
            return (b[that.sorter.field] + '').localeCompare(a[that.sorter.field] + '')
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
<style lang="less" scoped>
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
</style>
