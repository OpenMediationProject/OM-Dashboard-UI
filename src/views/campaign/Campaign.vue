<template>
  <div class="campaign">
    <div style="width: 100%;text-align: right;"><a-button type="primary" ghost @click="add">Add Campaign</a-button></div>
    <a-table
      style="margin-top: 8px;"
      class="om-card-style"
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :scroll="{ x: 1400, y: 'auto' }"
      :pagination="false"
      @change="tableChange"
    >
      <span slot="status" slot-scope="text, record">
        <a-switch @change="(value)=>{statusUppdate(value, record)}" v-model="record.checked" :loading="record.loading">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="campaignName" slot-scope="text, record">
        {{ text }}
      </span>
      <div :style="record.status===0 ? 'opacity: 0.3;' : null" slot="startTime" slot-scope="text, record">
        <div>
          From: {{ formatDate(text) }}
        </div>
        <div>to:<span style="margin-left: 24.5px;">{{ formatDate(record.endTime) }}</span></div>
      </div>
      <span slot="id" slot-scope="text, record">
        <a @click="edit(record)">Edit</a>
        <a-popconfirm title="Are you really sure？" @confirm="remove(record)" okText="Yes" cancelText="No">
          <a-divider type="vertical" />
          <a>Remove</a>
        </a-popconfirm>
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="impr" slot-scope="text, record">
        {{ customFormat(text) }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="click" slot-scope="text, record">
        {{ customFormat(text) }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="ctr" slot-scope="text, record">
        {{ customFormat(text, '0.00 %') }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="cvr" slot-scope="text, record">
        {{ customFormat(text, '0.00 %') }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="cost" slot-scope="text, record">
        {{ customFormat(text, '$ 0,0.00') }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="cpi" slot-scope="text, record">
        {{ customFormat(text, '$ 0,0.000') }}
      </span>
      <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="cpm" slot-scope="text, record">
        {{ customFormat(text, '$ 0,0.00') }}
      </span>

      <span slot="Impr"><tip tip="" title="Impr"></tip></span>
      <span slot="Click"><tip tip="" title="Click"></tip></span>
      <span slot="CTR"><tip tip="" title="CTR"></tip></span>
      <span slot="CVR"><tip tip="" title="CVR"></tip></span>
      <span slot="Cost"><tip tip="" title="Cost"></tip></span>
      <span slot="CPI"><tip tip="" title="CPI"></tip></span>
      <span slot="CPM"><tip tip="" title="CPM"></tip></span>
    </a-table>
  </div>
</template>

<script>
import Tip from '@/views/report/Tip'
import OmAppInfo from '@/components/om/AppInfo'
import OmPlacementInfo from '@/components/om/PlacementInfo'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'
import { campaignList, campaignStatusUpdate } from '@/api/campaign'
import moment from 'moment'
numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

export default {
  name: 'Campaign',
  components: {
    Tip,
    OmAppInfo,
    OmPlacementInfo
  },
  created () {
    this.load()
  },
  data () {
    return {
      loading: false,
      data: [],
      sortOrder: '',
      columns: [
        {
          title: 'Status',
          dataIndex: 'status',
          width: 100,
          sorter (a, b) {
            return a['status'] - b['status']
          },
          fixed: 'left',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Campaign',
          width: 220,
          fixed: 'left',
          dataIndex: 'name',
          scopedSlots: { customRender: 'campaignName' }
        },
        {
          title: 'Lifecycle',
          width: 200,
          fixed: 'left',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          t: 'Impr',
          width: 120,
          align: 'right',
          dataIndex: 'impr',
          slots: { title: 'Impr' },
          scopedSlots: { customRender: 'impr' },
          sorter: this.buildSorter((a, b) => {
            return a.impr - b.impr
          })
        },
        {
          t: 'Click',
          width: 120,
          align: 'right',
          dataIndex: 'click',
          scopedSlots: { customRender: 'click' },
          slots: { title: 'Click' },
          sorter: this.buildSorter((a, b) => {
            return a.click - b.click
          })
        },
        {
          t: 'CTR',
          width: 120,
          align: 'right',
          dataIndex: 'ctr',
          scopedSlots: { customRender: 'ctr' },
          slots: { title: 'CTR' },
          sorter: this.buildSorter((a, b) => {
            return a.ctr - b.ctr
          })
        },
        {
          t: 'CVR',
          width: 120,
          align: 'right',
          dataIndex: 'cvr',
          scopedSlots: { customRender: 'cvr' },
          slots: { title: 'CVR' },
          sorter: this.buildSorter((a, b) => {
            return a.cvr - b.cvr
          })
        },
        {
          t: 'Cost',
          width: 120,
          align: 'right',
          dataIndex: 'imprCost',
          scopedSlots: { customRender: 'cost' },
          slots: { title: 'Cost' },
          sorter: this.buildSorter((a, b) => {
            return a.cost - b.cost
          })
        },
        {
          t: 'CPI',
          dataIndex: 'cpi',
          align: 'right',
          width: 120,
          scopedSlots: { customRender: 'cpi' },
          slots: { title: 'CPI' },
          sorter: this.buildSorter((a, b) => {
            return a.cpi - b.cpi
          })
        },
        {
          t: 'CPM',
          width: 120,
          align: 'right',
          dataIndex: 'cpm',
          slots: { title: 'CPM' },
          scopedSlots: { customRender: 'cpm' },
          sorter: this.buildSorter((a, b) => {
            return a.cpm - b.cpm
          })
        },
        {
          title: 'Operations',
          fixed: 'right',
          width: 180,
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        }
      ]
    }
  },
  watch: {
  },
  methods: {
    load () {
      campaignList().then(res => {
        res.data.forEach(row => {
          row.impr = row.impression || 0
          row.click = row.click || 0
          row.installs = row.install || 0
          row.imprCost = row.imprCost || 0
          if (row.impr > 0) {
            row.ctr = row.click / row.impr
            row.cpm = row.imprCost / row.impr * 1000
          }
          if (row.click > 0) {
            row.cvr = row.installs / row.click
          }
          if (row.installs) {
            row.cpi = row.imprCost / row.installs
          }
          row.loading = false
          row.checked = !!row.status
        })
        this.arraySort(res.data)
        this.data = res.data
      })
    },
    formatDate (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    add () {
      this.$router.push({ path: '/campaign/edit', query: { type: 'Add' } })
    },
    edit (record) {
      this.$router.push({ path: '/campaign/edit', query: { type: 'Edit', id: record.id } })
    },
    creative () {
      this.$router.push({ path: '/campaign/creative' })
    },
    remove (record) {
      campaignStatusUpdate({ campaignId: record.id, status: 3 }).then(res => {
        this.data.splice(this.data.findIndex(row => row.id === record.id), 1)
      })
    },
    statusUppdate (checked, record) {
      record.loading = true
      campaignStatusUpdate({ campaignId: record.id, status: checked ? 1 : 0 }).then(res => {
        record.status = checked ? 1 : 0
        record.loading = false
        this.arraySort(this.data)
      }).finally(() => {
        record.loading = false
      })
    },
    customFormat (v, format) {
      if (!format) {
        format = '0,0'
      }
      return numerify(v, format)
    },
    tableChange (pagination, filters, sorter) {
      this.sortOrder = sorter.order
    },
    buildSorter (sortor) {
      return (a, b) => {
        const cv = this.commonCompare(a, b)
        if (cv !== 0) {
          return cv
        }
        return sortor(a, b)
      }
    },
    commonCompare (a, b) {
      if (this.sortOrder === 'ascend') {
        return b.status - a.status
      }
      return a.status - b.status
    },
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return b.createTime - a.createTime
        } else {
          return b.status - a.status
        }
      })
    }
  }
}
</script>
<style type="less" scoped>
  .trees {
    height: 64px;
  }
</style>
