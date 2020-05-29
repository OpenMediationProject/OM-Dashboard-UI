<!-- Report ReportBuilder tab -->
<template>
  <div>
    <div style="margin-top:16px;margin-bottom: 16px;height: 32px">
      <a-button type="primary" @click="handleAdd()" :disabled="disableEdit || table.data.length>9" style="float: right" >Add Reporting</a-button>
    </div>

    <a-form :form="form">
      <a-table
        style="background-color: white"
        class="ant-card-table-default"
        :scroll="{x: true}"
        :loading="loading"
        :dataSource="table.data"
        :columns="table.columns"
        row-key="id"
        :expandedRowKeys="table.expandedRowKeys"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :pagination="false">
        <span slot="name" slot-scope="v,row">
          <a-form-item v-if="row.editing">
            <a-input v-model.trim="row.name" required/>
          </a-form-item>
          <span v-else>{{ row.name }}</span>
        </span>
        <span slot="dataSource" slot-scope="v,row">
          <a-form-item v-if="row.editing">
            <a-select v-model="row.dataSource">
              <a-select-option v-for="(name, i) in dataSourceArray" :key="i" v-if="i">{{ name }}</a-select-option>
            </a-select>
          </a-form-item>
          <span v-else>{{ dataSourceArray[row.dataSource] }}</span>
        </span>
        <span slot="recipients" slot-scope="v,row">
          <a-form-item v-if="row.editing">
            <a-input v-model.trim="row.recipients" />
          </a-form-item>
          <span v-else>{{ row.recipients }}</span>
        </span>
        <span slot="schedule" slot-scope="v,row">
          <a-form-item v-if="row.editing">
            <a-cascader
              :options="scheduleOptions"
              v-model="row.schedule"
              expandTrigger="hover"
              :showArrow="false"
              :changeOnSelect="true"
              @change="val => handleScheduleChange(val,row)"/>
          </a-form-item>
          <span v-else>{{ row.schedule[0] === 2 ? scheduleTypes[2] + ' / ' + weekDays[row.schedule[1]] : scheduleTypes[row.schedule[0]] === 'Daily' ? scheduleTypes[row.schedule[0]] + '(Data last 7 days)': scheduleTypes[row.schedule[0]] }}</span>
        </span>
        <span slot="nextExecuteTime" slot-scope="v,row">
          <span>{{ renderNextExecuteTime(row) }}</span>
        </span>
        <span slot="status" slot-scope="v">
          <span :style="{color: ['#D5432F','green'][v]}">{{ statusArray[v] }}</span>
        </span>
        <span slot="action" slot-scope="v,row">
          <div v-if="row.editing">
            <a @click="handleSave(row)">Save</a>
            <a-divider type="vertical" />
            <a @click="handleCancel(row)">Cancel</a>
            <a style="float:right" @click="handleCancel(row)">
              <img src="/assets/up.svg"/>
            </a>
          </div>
          <div v-else-if="row.expand || !disableEdit">
            <a @click="handleEdit(row)">Edit</a>
            <a-divider type="vertical" />
            <a v-if="row.status === 0" @click="handleStatusUpdate(row,1)">Run</a>
            <a v-if="row.status === 1" @click="handleStatusUpdate(row,0)">Stop</a>
            <!--            <a-divider type="vertical" />-->
            <!--            <a-popconfirm @confirm="handleTest(row)" title="Are you sure test this Reporting?" okText="Yes" cancelText="No">-->
            <!--              <a>Test</a>-->
            <!--            </a-popconfirm>-->
            <a-divider type="vertical" />
            <a-popconfirm @confirm="handleRemove(row)" title="Are you sure remove this Reporting?" okText="Yes" cancelText="No">
              <a>Remove</a>
            </a-popconfirm>
            <a style="float:right" @click="handleExpand(row)">
              <img src="/assets/up.svg" v-if="row.expand"/>
              <img src="/assets/down.svg" v-else/>
            </a>
          </div>
        </span>
        <span slot="expandedRowRender" slot-scope="row">
          <div style="margin:16px 0 0 8px;">
            <div style="font-weight: bold;font-size: 16px;margin-bottom: 18px">Breakdown</div>
            <a-row :gutter="8">
              <a-col :span="24 / dimensions[row.dataSource].length" v-for="(item,i) in dimensions[row.dataSource]" :key="i">
                <a-select
                  :placeholder="'Column'+(i+1)"
                  :allowClear="true"
                  :disabled="!row.editing"
                  :showArrow="false"
                  :value="row.dimensions[i]"
                  @change="val => handleDimensionChange(val, i, row)">
                  <a-select-option
                    v-for="d in dimensions[row.dataSource]"
                    :disabled="row.dimSelected[d.key]"
                    :key="d.key">{{ d.title }}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row :gutter="8" style="margin-top: 16px">
              <a-col :span="24 / dimensions[row.dataSource].length" v-for="(o,i) in dimensions[row.dataSource]" :key="i">
                <a-select
                  v-if="row.dimensions[i] === 'day'"
                  placeholder="Date"
                  :showArrow="false"
                  v-model="row.condDayPeriod"
                  :disabled="!row.editing || row.schedule[0] === 3">
                  <a-select-option v-for="(days, name) in dateOptions" :key="days">{{ name }}</a-select-option>
                </a-select>
                <om-ad-network-select
                  width="100%"
                  v-if="row.dimensions[i] === 'adnId'"
                  :disabled="!row.editing"
                  :defaultValue="row.condAdnList"
                  @change="v=>row.condAdnList=v" />
                <om-regions-select
                  width="100%"
                  v-if="row.dimensions[i] === 'country'"
                  :disabled="!row.editing"
                  :defaultSelected="row.condCountryList"
                  @change="v=>row.condCountryList=v" />
                <om-pub-app-select
                  width="100%"
                  v-if="row.dimensions[i] === 'pubAppId'"
                  :disabled="!row.editing"
                  :defaultValue="row.condPubAppList"
                  @change="v=>row.condPubAppList=v" />
                <om-placement-select-simple
                  width="100%"
                  v-if="row.dimensions[i] === 'placementId'"
                  :disabled="!row.editing"
                  :form="form"
                  :defaultValue="row.condPlacementList"
                  @change="v=>row.condPlacementList=v" />
                <om-instance-select
                  width="100%"
                  v-if="row.dimensions[i] === 'instanceId'"
                  :disabled="!row.editing"
                  mode="multiple"
                  :defaultValue="row.condInstanceList"
                  @change="v=>row.condInstanceList=v" />
              </a-col>
            </a-row>

            <div style="font-weight: bold;font-size: 16px;margin: 16px 0">Metrics</div>
            <a-checkbox-group
              style="margin-bottom: 32px"
              :disabled="!row.editing"
              :options="metrics[row.dataSource]"
              v-model="row.metrics"
              @change="v=>row.metrics=v" />
          </div>
        </span>
      </a-table>
    </a-form>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { Cascader } from 'ant-design-vue'
import {
  OmRegionsSelect,
  OmPubAppSelect,
  OmAdNetworkSelect,
  OmPlacementSelectSimple,
  OmInstanceSelect
} from '../../components/om'
import {
  getReportBuilderList,
  removeReportBuilder,
  testReportBuilder,
  createReportBuilder,
  updateReportBuilder,
  updateReportBuilderStatus
} from '../../api/report'
import moment from 'moment'

const allDims = [
  { key: 'day', title: 'Date', cond: null },
  { key: 'country', title: 'Regions', cond: 'condCountryList' },
  { key: 'pubAppId', title: 'Apps', cond: 'condPubAppList' },
  { key: 'placementId', title: 'Placement', cond: 'condPlacementList' },
  { key: 'instanceId', title: 'Instance', cond: 'condInstanceList' },
  { key: 'adnId', title: 'AdNetwork', cond: 'condAdnList' }
]

export default {
  name: 'OmReportingBuilder',
  components: {
    OmPubAppSelect,
    OmRegionsSelect,
    OmAdNetworkSelect,
    OmPlacementSelectSimple,
    OmInstanceSelect,
    Ellipsis,
    ACascader: Cascader
  },
  computed: {
    disableEdit () {
      return this.table.expandedRowKeys.length > 0
    }
  },
  data () {
    const scheduleOptions = [
      { label: 'Daily', value: 1 },
      { label: 'Weekly', value: 2, children: [] },
      { label: 'Monthly', value: 3 }
    ]
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    weekDays.forEach((label, value) => {
      scheduleOptions[1].children.push({ label, value })
    })

    return {
      form: this.$form.createForm(this),
      editingRows: {},
      country: [],
      // dimensions and metrics depend on DataSource, 1:Performance,2:UserActivity
      dimensions: [null, allDims, allDims.slice(0, 2)],
      metrics: [null,
        [
          { value: 'request', label: 'Requests' },
          { value: 'filled', label: 'Fills' },
          { value: 'fillRate', label: 'Fill Rate' },
          { value: 'isReady', label: 'Ad-Availability Check' },
          { value: 'isReadyTrue', label: 'Ad-Availability Response' },
          { value: 'isReadyRate', label: 'Availability Rate' },
          { value: 'impr', label: 'Impressions' },
          { value: 'click', label: 'Clicks' },
          { value: 'ctr', label: 'CTR' },
          { value: 'cost', label: 'Revenue' },
          { value: 'ecpm', label: 'eCPM' }
        ],
        [
          { value: 'dau', label: 'DAU' },
          { value: 'imprDau', label: 'Impressions per DAU' },
          { value: 'arpDau', label: 'ARPDAU' },
          { value: 'deu', label: 'DEU' },
          { value: 'imprDeu', label: 'Impressions per DEU' },
          { value: 'arpDeu', label: 'ARPDEU' },
          { value: 'engagementRate', label: 'Engagement Rate' }
        ]
      ],
      dataSourceArray: ['', 'Performance', 'User Activity'],
      scheduleTypes: ['', 'Daily', 'Weekly', 'Monthly'],
      scheduleOptions,
      weekDays,
      statusArray: ['Stopped', 'Running'],
      dateOptions: { 'Yesterday': 1, 'Last 7 days': 7, 'Last 14 days': 14, 'Last 28 days': 28 },
      loading: false,
      table: {
        expandedRowKeys: [],
        data: [],
        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: 'Data Source',
            dataIndex: 'dataSource',
            scopedSlots: { customRender: 'dataSource' }
          },
          {
            title: 'Recipients',
            dataIndex: 'recipients',
            scopedSlots: { customRender: 'recipients' }
          },
          {
            title: 'Schedule',
            dataIndex: 'schedule',
            scopedSlots: { customRender: 'schedule' }
          },
          {
            title: 'Next Reporting',
            scopedSlots: { customRender: 'nextExecuteTime' }
          },
          {
            title: 'Status',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: 'Operations',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
    }
  },
  mounted () {
    this.reloadTable()
  },
  methods: {
    handleDimensionChange (dim, i, row) {
      const old = row.dimensions[i]
      row.dimensions[i] = dim
      if (old) {
        this.$set(row.dimSelected, old, false)
      }
      if (dim) {
        this.$set(row.dimSelected, dim, true)
      }
    },
    handleScheduleChange (val, row) {
      if (val[0] === 2 && val.length === 1) {
        row.schedule = [2, 1]
      }
    },
    renderNextExecuteTime (row) {
      if (row.status === 0) {
        return '-'
      }
      const format = 'YYYY-MM-DD'
      const now = moment().utc()
      if (row.schedule[0] === 1) {
        return now.add(1, 'd').format(format)
      } else if (row.schedule[0] === 3) {
        return now.add(1, 'M').startOf('M').format(format)
      } else {
        row.weeklyDay = row.schedule[1]
        const nt = now.clone().startOf('w').add(row.weeklyDay, 'd')
        if (nt < now) {
          nt.add(1, 'w')
        }
        return nt.format(format)
      }
    },
    async handleTest (row) {
      try {
        await testReportBuilder({ id: row.id })
        this.$message.success('Test success')
      } catch (e) {
        this.$message.error('Test error')
        console.log('test error', e)
      }
    },
    handleExpand (row) {
      if (row.expand) {
        const index = this.table.expandedRowKeys.findIndex(v => v === row.id)
        if (index !== -1) {
          this.table.expandedRowKeys.splice(index, 1)
        }
      } else {
        this.table.expandedRowKeys.push(row.id)
      }
      row.expand = !row.expand
    },
    handleAdd () {
      const o = this.buildDefaultRow()
      o.id = Math.round(Math.random() * -10000)
      this.table.data.unshift(o)
      this.handleEdit(this.table.data[0])
    },
    handleEdit (row) {
      row.editing = row.expand = true
      this.editingRows[row.id] = JSON.parse(JSON.stringify(row))
      const index = this.table.expandedRowKeys.findIndex(v => v === row.id)
      if (index === -1) {
        this.table.expandedRowKeys.push(row.id)
      }
    },
    handleCancel (row) {
      row.editing = row.expand = false
      const oriData = this.editingRows[row.id]
      delete this.editingRows[row.id]
      const i = this.table.data.findIndex(r => r.id === row.id)
      if (i !== -1) {
        if (row.id > 0) {
          oriData.editing = oriData.expand = false
          this.$set(this.table.data, i, oriData)
        } else {
          this.table.data.splice(i, 1)
        }
      } else {
        console.error('table row lost', row)
      }
      const index = this.table.expandedRowKeys.findIndex(v => v === row.id)
      if (index !== -1) {
        this.table.expandedRowKeys.splice(index, 1)
      }
    },
    async handleSave (row) {
      this.loading = true
      try {
        const ds = row.dataSource
        const dims = row.dimensions.filter(d => d && this.dimensions[ds].find(dim => dim.key === d))
        if (!dims.length) {
          this.$message.error('At least one column is required')
          return
        }
        const ms = row.metrics.filter(m => this.metrics[ds].find(item => item.value === m))
        if (!ms.length) {
          this.$message.error('At least one metric is required')
          return
        }
        row.dimensions = dims
        row.metrics = ms
        allDims.forEach(d => {
          const { key, cond } = d
          if (cond && !dims.includes(key)) {
            row[cond] = []
          }
        })

        const o = JSON.parse(JSON.stringify(row))
        for (const f of ['expand', 'lastmodify', 'status', 'dimSelected']) {
          delete o[f]
        }
        if (o.schedule[0] === 2) {
          o.weeklyDay = o.schedule[1]
        }
        o.schedule = o.schedule[0]
        if (o.id > 0) {
          await updateReportBuilder(o)
        } else {
          delete o.id
          await createReportBuilder(o)
        }
        await this.reloadTable()
        this.table.expandedRowKeys.pop()
      } catch (e) {
        console.log('save error', e)
      } finally {
        this.loading = false
      }
    },
    async handleStatusUpdate (row, status) {
      this.loading = true
      try {
        await updateReportBuilderStatus({ id: row.id, status })
        await this.reloadTable()
      } catch (e) {
        console.log('remove error', e)
      } finally {
        this.loading = false
      }
    },
    async handleRemove (row) {
      this.loading = true
      try {
        await removeReportBuilder({ id: row.id })
        await this.reloadTable()
      } catch (e) {
        console.log('remove error', e)
      } finally {
        this.loading = false
      }
    },
    async reloadTable () {
      const { publisherId } = this.$store.getters
      this.loading = true
      try {
        const res = await getReportBuilderList({ publisherId })
        this.table.data = res.data.map(row => {
          if (row.schedule === 2) {
            row.schedule = [row.schedule, row.weeklyDay]
          } else {
            row.schedule = [row.schedule]
          }
          row = {
            ...this.buildDefaultRow(),
            ...row
          }
          for (const dim of row.dimensions) {
            row.dimSelected[dim] = true
          }
          return row
        })
      } finally {
        this.loading = false
      }
    },
    buildDefaultRow () {
      return {
        expand: false,
        editing: false,
        dimensions: [],
        dimSelected: {},
        condDayPeriod: 1,
        condAdnList: [],
        condPubAppList: [],
        condCountryList: [],
        condPlacementList: [],
        condInstanceList: [],
        name: '',
        recipients: '',
        dataSource: 1,
        schedule: [2, 1],
        weeklyDay: 0,
        status: 0
      }
    }
  }
}
</script>
<style type="less" scoped>
.ant-card-table-default >>> .ant-card-head-title {
  margin-left: -8px;
  margin-top: -6px;
}
.ant-card-table-default >>> .ant-card-head {
  height: 48px;
}
.ant-card-table-default >>> .ant-form-item {
  margin-bottom: 0;
}
.ant-card-table-default >>> .ant-form-explain, .ant-form-extra {
  line-height: 1.5;
  margin-bottom: -20px;
}
.ant-card-table-default >>> .ant-form-item-control {
  line-height: 0;
}
</style>
