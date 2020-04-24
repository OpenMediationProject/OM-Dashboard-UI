<!-- Report UserActivity tab -->
<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-pub-app-select/>
      <a-form-item>
        <om-regions-select @change="countryChange" :ignoreApp="true" style="width: 220px"/>
      </a-form-item>
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
        optionLabelProp="title"
        :showArrow="false"
        :defaultValue="chartGroupBy"
        @change="handleDim4ChartChange">
        <a-select-option v-for="o in dimList4Chart" :key="o.id" :title="o.title">{{ o.title }}</a-select-option>
      </a-select>

      <a-row :gutter="16">
        <a-col :span="8">
          <om-report-chart
            title="DAU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="dau"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="8">
          <om-report-chart
            title="ARPDAU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="arpDau"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="8">
          <om-report-chart
            title="Impression per DAU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="imprDau"
            :group-by="chartGroupViewDim" />
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="8">
          <om-report-chart
            title="DEU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="deu"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="8">
          <om-report-chart
            title="ARPDEU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="arpDeu"
            :group-by="chartGroupViewDim" />
        </a-col>
        <a-col :span="8">
          <om-report-chart
            title="Impression per DEU"
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="imprDeu"
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
        :allowClear="true"
        :showArrow="false"
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
import { OmRegionsSelect, OmReportDatePicker, OmPubAppSelect } from '../../components/om'
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
  pubAppId: 'Apps'
}

const dimColumnMapper = {
  pubAppId: 'pubAppName',
  placementId: 'placementName',
  adnId: 'adnName',
  instanceId: 'instanceName'
}

export default {
  name: 'OmUserActivityReport',
  components: {
    OmPubAppSelect,
    OmReportChart,
    OmReportDatePicker,
    OmRegionsSelect,
    Ellipsis
  },
  data () {
    return {
      form: this.$form.createForm(this),
      country: [],
      supportedMetrics: {
        dau: { title: 'DAU' },
        arpDau: { title: 'ARPDAU' },
        imprDau: { title: 'Impressions / DAU', format: '0.00 %' },
        deu: { title: 'DEU' },
        arpDeu: { title: 'ARPDEU' },
        imprDeu: { title: 'Impressions / DEU', format: '0.00 %' },
        engagementRate: { title: 'Engagement Rate', format: '0.00 %' }
      },
      dimList4Chart: this.filterDim('pubAppId', 'country'),
      dimList4Table: this.filterDim('day', 'country', 'pubAppId', 'placementId', 'adnId', 'instanceId'),
      loading: false,
      chartGroupBy: 'pubAppId',
      chartData: [],
      table: {
        loading: false,
        dimension: ['day'],
        metric: ['dau', 'deu'],
        data: [],
        columns: []
      }
    }
  },
  computed: {
    chartGroupViewDim () {
      return dimColumnMapper[this.chartGroupBy] || this.chartGroupBy
    }
  },
  mounted () {
    this.reloadChart()
    this.reloadTable('dimension')
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
      ps.type = ['dau', 'api']
      ps.dimension = ['day'].concat(this.chartGroupBy)
      return ps
    },
    reloadChart () {
      const ps = this.buildBaseParams()
      this.loading = true
      getReportList(ps)
        .then(res => {
          if (!res.code) {
            this.chartData = res.data.map(this.mapMetrics)
          }
        })
        .finally(_ => {
          this.loading = false
        })
    },
    reloadTable (triggerType) {
      const { dimension, metric } = this.table
      if (dimension.length === 0 || metric.length === 0) {
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
              this.table.data = res.data.map(this.mapMetrics)
            }
          })
          .finally(_ => {
            this.table.loading = false
          })
      }
    },
    mapMetrics (row) {
      row = {
        id: generateUUID(),
        apiImpr: 0,
        cost: 0,
        deu: 0,
        dau: 0,
        ...row
      }
      row.impr = row.apiImpr
      row.arpDau = row.arpDeu = row.imprDau = row.imprDeu = row.engagementRate = 0

      if (row.dau > 0) {
        row.arpDau = row.cost / row.dau
        row.imprDau = row.impr / row.dau
        row.engagementRate = row.deu / row.dau
      }
      if (row.deu > 0) {
        row.arpDeu = row.cost / row.deu
        row.imprDeu = row.impr / row.deu
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
