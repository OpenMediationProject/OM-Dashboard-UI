<!-- Report Lifetime Value tab -->
<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-report-date-picker :value="dateRange" @ok="handleApply"/>
      <om-pub-app-select width="200px" :defaultValue="def.defaultApps" @change="appSelect"/>
      <a-form-item>
        <om-regions-select :maxTagCount="1" :ignoreApp="true" :defaultSelected="def.defaultRegions" @change="countryChange" style="width: 200px"/>
      </a-form-item>
      <a-form-item>
        <a-select mode="multiple" v-decorator="['queryPaymentType', {initialValue: def.defaultPaymentType || []}]" placeholder="IAA/IAP" style="width: 200px">
          <a-select-option v-for="name in ['IAA', 'IAP']" :showArrow="false" :key="name" :title="name">
            <span>{{ name }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button ghost @click="handleApply" type="primary" style="width: 64px;">Apply</a-button>
      </a-form-item>
    </a-form>

    <div style="background-color: white; margin-top: 8px; padding: 16px">
      <!-- Lifetime Value by -->
      <span style="font-size: 16px;color: #333333;font-weight:500;margin-right: 4px;">Lifetime Value by</span>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" style="font-size:16px;font-weight:bold" @click="e => e.preventDefault()">
          {{ chartGroupBreakdown }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item v-for="s in dimList4Chart" :key="s.id" :title="s.title">
            <a href="javascript:;" @click="handleDim4ChartChange(s)">{{ s.title }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="24">
          <om-report-chart
            title=""
            :loading="loading"
            :data="chartData"
            :height="248"
            x-column="day"
            y-column="value"
            y-format="$0.000"
            :group-by="chartGroupViewDim" />
        </a-col>
      </a-row>
    </div>

    <div style="background-color: white; margin-top: 16px; padding: 16px">
      <div style="height: 24px;margin-bottom:16px;"><a @click="handleDownload" style="float: right; margin-right: 16px;" :disabled="table.data.length===0">CSV</a></div>
      <a-table
        v-if="table.data.length"
        class="custom-cell-style"
        :scroll="{x: true}"
        bordered
        :loading="table.loading"
        :dataSource="table.data"
        :columns="table.columns"
        row-key="id"
        :pagination="false">
        <span slot="format" slot-scope="v">
          <div :class="classRender(v)">{{ formatValue(v) }}</div>
        </span>
        <span slot="dayUser" slot-scope="v">
          <div style="height: 64px;padding: 25px 16px;">{{ v }}</div>
        </span>
      </a-table>
      <div v-else class="performance_no_data">
        <div class="no_data">
          <div>No data available</div>
          <div>Try changing your filters</div>
        </div>
      </div>
    </div>
    <ul v-if="table.data.length" style="list-style:disc;margin-left: -16px;margin-top:8px;color: #999999;">
      <li>All reports and dates are in UTC</li>
    </ul>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { OmAdNetworkSelect, OmRegionsSelect, OmReportDatePicker, OmPubAppSelect, OmPlacementSelectSimple } from '../../components/om'
import OmReportChart from './ChartCardG2.js'
import { reportLtv, reportLtvChart } from '../../api/report'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'

numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

const supportedDimensions = {
  base_date: 'Date',
  user_cnt_new: 'New Users',
  country: 'Regions',
  media_source: 'Media Source',
  campaign: 'Campaign',
  publisher_app_id: 'Apps'
}

const dimColumnMapper = {
  publisher_app_id: 'appName',
  base_date: 'base_date',
  user_cnt_new: 'user_cnt_new',
  country: 'country'
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
    const def = {
      defaultApps: [],
      defaultRegions: [],
      defaultPaymentType: []
    }
    return {
      defaultDate: this.dateRange,
      def,
      conditions: {},
      form: this.$form.createForm(this),
      regions: [],
      dimList4Chart: this.filterDim('publisher_app_id', 'country', 'base_date'),
      loading: false,
      chartGroupBy: 'publisher_app_id',
      chartData: [],
      table: {
        loading: false,
        dimension: ['base_date', 'user_cnt_new'],
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
  props: {
    dateRange: {
      type: Array,
      default: null
    },
    commParams: {
      type: Object,
      default: null
    }
  },
  watch: {
    dateRange (v) {
      this.defaultDate = v
    },
    commParams (v) {
      this.regions = v.regions
      this.def.defaultRegions = v.regions
      this.def.defaultApps = v.pubAppId || []
      this.defaultDate = v.dateRange
      this.form.setFieldsValue({ 'pubAppId': this.def.defaultApps })
    }
  },
  methods: {
    appSelect (val) {
      // this.reloadChart()
      // this.reloadTable('dimension')
    },
    classRender (v) {
      if (!v && v !== 0) {
        return 'level_6'
      }
      let c = 'level_5'
      if (v >= 1) {
        c = 'level_1'
      } else if (v >= 0.5) {
        c = 'level_2'
      } else if (v >= 0.25) {
        c = 'level_3'
      } else if (v >= 0.13) {
        c = 'level_4'
      }
      return c
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
    buildBaseParams () {
      const ps = this.form.getFieldsValue()
      if (ps.pubAppId && ps.pubAppId.length) {
        ps.s_publisher_app_id = ps.pubAppId
        ps.pubAppId = null
      }
      if (this.regions && this.regions.length) {
        ps.s_country = this.regions
      }
      ps.dimensions = ['retention_day', 'base_date']
      ps.dateBegin = ps.dateRange[0].format('YYYY-MM-DD')
      ps.dateEnd = ps.dateRange[1].format('YYYY-MM-DD')
      this.$emit('change', { pubAppId: ps.s_publisher_app_id || [], regions: this.regions, dateRange: ps.dateRange, queryPaymentType: ps.queryPaymentType })
      delete ps.dateRange
      return ps
    },
    reloadChart () {
      const ps = this.buildBaseParams()
      ps.dimensions.push(this.chartGroupBy)
      if (this.chartGroupBy === 'base_date') {
        const ps = this.buildBaseParams()
        this.loading = true
        ps.granularity = 'day'
        reportLtv(ps)
          .then(res => {
            if (!res.code) {
              const newList = []
              if (res.data && res.data.length) {
                const mean = res.data.find(item => { return item.base_date === 'Mean' })
                mean.user_cnt_new = mean.day0_u_c
                for (let i = 0; i < res.data.length; i++) {
                  const item = res.data[i]
                  const fieldsSize = item.base_date === 'Mean' ? (Object.keys(item).length - 2) / 2 : (Object.keys(item).length - 9) / 2
                  for (let n = 0; n < fieldsSize; n++) {
                    const _new = {}
                    if (!item.d) {
                      _new['base_date'] = 'Mean'
                    } else {
                      _new['base_date'] = item.d + ' '
                    }
                    _new['day'] = n
                    _new['value'] = item['day' + n + '_u_c'] ? item['day' + n + '_r_c'] / item['day' + n + '_u_c'] : 0
                    newList.push(_new)
                  }
                }
              }
              this.chartData = newList.sort((a, b) => a.day - b.day)
            }
          })
          .finally(_ => {
            this.loading = false
          })
        return false
      }
      this.loading = true
      ps.granularity = ['day', this.chartGroupBy]
      reportLtvChart(ps)
        .then(res => {
          if (!res.code && res.data) {
            this.chartData = res.data.map(row => {
              const { ['day' + row.day + '_u_c']: uc, ['day' + row.day + '_r_c']: rc } = row
              row.value = uc > 0 ? ((rc || 0) / uc) : 0
              return row
            })
            this.chartData = res.data.sort((a, b) => a.day - b.day)
          }
        })
        .finally(_ => {
          this.loading = false
        })
    },
    reloadTable (triggerType) {
      const { dimension } = this.table
      const ps = this.buildBaseParams()
      this.conditions = { pubAppId: ps.s_publisher_app_id, paymentType: ps.queryPaymentType, country: ps.s_country }
      const columns = dimension.map(dim => {
        const di = dimColumnMapper[dim] || dim
        return {
          title: supportedDimensions[dim],
          dataIndex: di,
          scopedSlots: {
            customRender: 'dayUser'
          }
        }
      })
      this.table.columns = columns
      if (this.table.data.length === 0 || triggerType === 'dimension') {
        this.table.loading = true
        ps.granularity = 'day'
        reportLtv(ps)
          .then(res => {
            if (!res.code) {
              if (res.data && res.data.length) {
                const mean = res.data.find(item => { return item.base_date === 'Mean' })
                mean.user_cnt_new = mean.day0_u_c
                const size = (Object.keys(mean).length - 2) / 2
                const cl = columns
                res.data.map((item, index) => {
                  const fieldsSize = item.base_date === 'Mean' ? (Object.keys(item).length - 2) / 2 : (Object.keys(item).length - 9) / 2
                  for (let n = 0; n < fieldsSize; n++) {
                    item['day' + n] = item['day' + n + '_u_c'] ? item['day' + n + '_r_c'] / item['day' + n + '_u_c'] : 0
                  }
                  item.base_date = item.base_date === 'Mean' ? 'Mean' : item.base_date.toString().substr(0, 4) + '-' + item.base_date.substr(4, 2) + '-' + item.base_date.substr(6, 2)
                  return item
                })
                for (let i = 0; i < size; i++) {
                  cl.push({
                    title: 'Day' + i,
                    dataIndex: 'day' + i,
                    scopedSlots: {
                      customRender: 'format'
                    }
                  })
                }
                this.table.columns = cl
                this.table.data = res.data
              }
            }
          })
          .finally(_ => {
            this.table.loading = false
          })
      }
    },
    formatValue (v) {
      if (!v && v !== 0) {
        return ''
      } else {
        return numerify(v, '$0.000')
      }
    },
    handleDownload () {
      const header = this.table.columns.map(col => col.title).join(',')
      const data = this.table.data.map(row => {
        return this.table.columns.map(col => {
          return row[col.dataIndex]
        }).join(',')
      }).join('\n')
      const blob = new Blob([header + '\n' + data], { type: 'text/csv;charset=UTF-8' })
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
  }
  .ant-form-item button {
      width: 100px
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
  .custom-cell-style >>> .ant-table-tbody > tr > td {
    padding: 0;
}
  .level_1 {
    background: #3DADFF;height: 64px;padding: 25px 16px;
  }
  .level_2 {
    background: rgba(61, 173, 255, 0.8);height: 64px;padding: 25px 16px;
  }
  .level_3 {
    background: rgba(61, 173, 255, 0.6);height: 64px;padding: 25px 16px;
  }
  .level_4 {
    background: rgba(61, 173, 255, 0.4);height: 64px;padding: 25px 16px;
  }
  .level_5 {
    background: rgba(61, 173, 255, 0.2);height: 64px;padding: 25px 16px;
  }
  .level_6 {
    height: 64px;padding: 25px 16px;
  }
</style>
