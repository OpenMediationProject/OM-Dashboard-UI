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

    <div style="background-color: white; margin-top: 16px; padding: 16px">
      <a-select
        showSearch
        style="width:220px;margin-bottom: 16px;"
        placeholder="Breakdown"
        :showArrow="false"
        optionLabelProp="title"
        :defaultValue="chartGroupBy"
        @change="handleDim4ChartChange">
        <a-select-option v-for="o in dimList4Chart" :key="o.id" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a-row :gutter="16">
        <a-col :span="12">
          <om-report-chart
            title="Impressions"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
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
            y-format="$0,0"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="12">
          <om-report-chart
            title="Request"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="request"
            :group-by="chartGroupViewDim" />
        </a-col>
      </a-row>
    </div>

    <div style="background-color: white; margin-top: 16px; padding: 16px">
      <a-select
        showSearch
        style="width:240px;margin-bottom:16px;"
        placeholder="Breakdown"
        mode="multiple"
        :maxTagCount="1"
        :allowClear="false"
        optionLabelProp="title"
        @change="handleDim4TableChange"
        :value="table.dimension">
        <a-select-option v-for="o in dimList4Table" :key="o.id" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a-select
        showSearch
        style="width:304px;margin:0 0 16px 16px;"
        placeholder="Metrics"
        mode="multiple"
        :maxTagCount="2"
        :allowClear="true"
        :showArrow="false"
        optionLabelProp="title"
        @change="handleMetricsChange"
        :value="table.metric">
        <a-select-option v-for="(o, key) in supportedMetrics" :key="key" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a @click="handleDownload" style="float: right; margin-right: 16px" :disabled="table.data.length===0">CSV</a>
      <a-table
        v-if="table.data.length"
        class="ant-card-table-default"
        :scroll="{x: true}"
        :loading="table.loading"
        :dataSource="table.data"
        :columns="table.columns"
        row-key="id"
        :pagination="false"/>
      <div v-else class="performance_no_data">
        <div class="no_data">
          <div>No data available</div>
          <div>Try changing your filters</div>
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
  instanceId: 'Instance'
}

const dimColumnMapper = {
  pubAppId: 'pubAppName',
  placementId: 'placementName',
  adnId: 'adnName',
  instanceId: 'instanceName'
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
      dimList4Table: this.filterDim('day', 'country', 'pubAppId', 'placementId', 'adnId', 'instanceId'),
      loading: false,
      chartGroupBy: 'pubAppId',
      chartData: [],
      table: {
        loading: false,
        dimension: ['day'],
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
    }
  },
  methods: {
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
      this.chartGroupBy = dim
      this.reloadChart()
    },
    handleDim4TableChange (dim) {
      this.table.dimension = dim
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
            this.chartData = res.data.map(this.mapMetrics)
          }
        })
        .finally(_ => {
          this.loading = false
        })
    },
    reloadTable (triggerType) {
      const { dimension, metric } = this.table
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
              this.table.data = res.data.map(this.mapMetrics)
            }
          })
          .finally(_ => {
            this.table.loading = false
          })
      }
    },
    mapMetrics (row) {
      row.id = generateUUID()

      row.request = row[this.metricFields.request]
      row.filled = row[this.metricFields.filled]
      row.click = row[this.metricFields.click]
      row.impr = row[this.metricFields.impr]
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
      return row
    },
    handleDownload () {
      const header = this.table.columns.map(col => col.title).join(',')
      const data = this.table.data.map(row => {
        return this.table.columns.map(col => {
          return row[col.dataIndex]
        }).join(',')
      }).join('\n')
      const blob = new Blob([header + '\n' + data], { type: 'text/csv,charset=UTF-8' })
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
    background: #E5E7EA;
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
