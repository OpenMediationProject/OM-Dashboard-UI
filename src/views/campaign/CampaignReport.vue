<template>
  <div>
    <a-form layout="inline" :form="form" >
      <om-report-date-picker @ok="handleApply"/>
      <om-pub-app-select :defaultValue="def.defaultApps" @change="appSelect" width="240px"/>
      <a-form-item>
        <om-regions-select :defaultSelected="def.defaultRegions" :maxTagCount="1" :ignoreApp="true" @change="countryChange" style="width: 154px"/>
      </a-form-item>
      <om-placement-select-simple :pubAppIds="pubAppIds" :defaultValue="def.defaultPlacements" :form="form" width="225px"/>
      <!--      <promote-app-select :defaultValue="def.defaultPromoteApps" width="185px"/>-->
      <a-form-item>
        <a-button ghost @click="handleApply" type="primary" style="width: 64px;">Apply</a-button>
      </a-form-item>
    </a-form>
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
        <span slot="Target App"><tip tip="" title="Target App"></tip></span>
        <span slot="Region"><tip tip="" title="Region"></tip></span>
        <span slot="Promote App"><tip tip="" title="Promote App"></tip></span>
        <span slot="Placement"><tip tip="" title="Placement"></tip></span>
        <span slot="Campaign"><tip tip="" title="Campaign"></tip></span>
        <span slot="Ads"><tip tip="" title="Ads"></tip></span>

        <span slot="Impressions"><tip tip="" title="Impressions"></tip></span>
        <span slot="Clicks"><tip tip="" title="Clicks"></tip></span>
        <span slot="CTR"><tip tip="" title="CTR"></tip></span>
        <span slot="Installs"><tip tip="" title="Installs"></tip></span>
        <span slot="CVR"><tip tip="" title="CVR"></tip></span>
        <span slot="Cost"><tip tip="" title="Cost"></tip></span>
        <span slot="CPI"><tip tip="" title="CPI"></tip></span>
        <span slot="CPM"><tip tip="" title="CPM"></tip></span>

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
import { Ellipsis } from '@/components'
import { OmAdNetworkSelect, OmReportDatePicker, OmPubAppSelect, OmPlacementSelectSimple, PromoteAppSelect } from '@/components/om'
import OmRegionsSelect from '@/components/om/RegionsSelect'
import { promoteReportList } from '@/api/campaign'

import { generateUUID } from 'ant-design-vue/lib/vc-select/util'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'
import Tip from '@/views/report/Tip'
numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

const supportedDimensions = {
  hour: 'Hour',
  day: 'Day',
  country: 'Region',
  pubAppId: 'Target App',
  creativeId: 'Ads',
  placementId: 'Placement',
  campaignId: 'Campaign',
  appId: 'Promote App'
}

const dimColumnMapper = {
  day: 'day',
  hour: 'hour',
  country: 'country',
  pubAppId: 'pubAppName',
  placementId: 'placementName',
  appId: 'appId',
  campaignId: 'campaignName',
  creativeId: 'creativeName'
}

export default {
  name: 'CampaignReport',
  components: {
    OmPubAppSelect,
    OmAdNetworkSelect,
    OmReportDatePicker,
    OmRegionsSelect,
    OmPlacementSelectSimple,
    Ellipsis,
    Tip,
    PromoteAppSelect
  },
  data () {
    const def = {
      defaultApps: [],
      defaultRegions: [],
      defaultPlacements: [],
      defaultPromoteApps: [],
      dimension: ['day'],
      metric: ['impr', 'ctr', 'cvr', 'cpm']
    }
    return {
      conditions: {},
      def,
      form: this.$form.createForm(this),
      regions: def.defaultRegions || [],
      country: [],
      pubAppIds: [],
      metricFields: {
        impr: 'impression',
        click: 'click',
        installs: 'install',
        cost: 'imprCost'
      },
      supportedMetrics: {
        impr: { title: 'Impressions', format: '0,0' },
        click: { title: 'Clicks', format: '0,0' },
        ctr: { title: 'CTR', format: '0.00 %' },
        installs: { title: 'Installs', format: '0,0' },
        cvr: { title: 'CVR', format: '0.00 %' },
        cost: { title: 'Cost', format: '$ 0,0.00' },
        cpi: { title: 'CPI', format: '$ 0,0.000' },
        cpm: { title: 'CPM', format: '$ 0,0.00' }
      },
      dimList4Table: this.filterDim('day', 'hour', 'pubAppId', 'placementId', 'country', 'appId', 'campaignId', 'creativeId'),
      sorter: null,
      dimension: def.dimension,
      disableds: [],
      current: 1,
      allMetrics: ['impr', 'click', 'ctr', 'installs', 'cvr', 'cost', 'cpi', 'cpm'],
      table: {
        loading: false,
        metric: def.metric,
        data: [],
        columns: []
      }
    }
  },
  watch: {
    dimension (val) {
      if (!val) {
        this.disableds = []
      }
    }
  },
  mounted () {
    this.reloadTable('dimension')
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
      this.reloadTable('dimension')
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
      this.$emit('change', ps.dateRange)
      delete ps.dateRange
      ps.country = this.regions
      ps.dimension = ['day']
      return ps
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
      const { pubAppId, placementId, country, appId } = { ...ps }
      ps.dimension = dimension
      ps.metric = metric
      this.conditions = { pubAppId, placementId, country, appId, dimension, metric }
      const columns = dimension.map(dim => {
        const di = dimColumnMapper[dim] || dim
        return {
          dataIndex: di,
          width: ['Target App', 'Placement', 'Promote App'].includes(supportedDimensions[dim]) ? '350px' : '180px',
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
        if (!metric) {
          return
        }
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
        promoteReportList(ps)
          .then(res => {
            if (!res.code) {
              this.table.data = res.data.map(this.mapMetrics).sort((a, b) => {
                if (b.day) {
                  return b.day.localeCompare(a.day)
                }
                return 0
              })
              const sumData = { impr: 0, click: 0, installs: 0, cost: 0, cpi: 0, crv: 0, ctr: 0, cpm: 0 }
              this.table.data.forEach(row => {
                sumData.impr += row.impr
                sumData.click += row.click
                sumData.installs += row.installs
                sumData.cost += row.cost
              })
              if (sumData.impr > 0) {
                sumData.ctr = sumData.click / sumData.impr
                sumData.cpm = sumData.cost / sumData.impr * 1000
              }
              if (sumData.click > 0) {
                sumData.cvr = sumData.installs / sumData.click
              }
              if (sumData.installs) {
                sumData.cpi = sumData.cost / sumData.installs
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
      row.impr = row[this.metricFields.impr] || 0
      row.click = row[this.metricFields.click] || 0
      row.installs = row[this.metricFields.installs] || 0
      row.cost = row[this.metricFields.cost] || 0
      row.cpi = 0
      row.cvr = 0
      row.ctr = 0
      row.cpm = 0
      if (row.impr > 0) {
        row.ctr = row.click / row.impr
        row.cpm = row.cost / row.impr * 1000
      }
      if (row.click > 0) {
        row.cvr = row.installs / row.click
      }
      if (row.installs) {
        row.cpi = row.cost / row.installs
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
      if (!row.campaignName) {
        row.campaignName = '(Empty)'
      }
      if (!row.promoteAppName) {
        row.promoteAppName = '(Empty)'
      }
      if (!row.creativeName) {
        row.creativeName = '(Empty)'
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
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), header + '\n' + data], { type: 'text/csv;charset=UTF-8' })
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
