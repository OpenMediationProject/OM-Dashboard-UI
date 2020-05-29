<!-- All App page router '/publisher/app' -->
<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-action:add>
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden', marginTop: '12px', marginBottom: '8px' } || {} ">
              <a-button type="primary" size="default" @click="addApp()">Add App</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-card :bordered="false" class="ant-card-table-default">
      <a-table
        class="om-table"
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :loading="loading"
        :scroll="{ y: scroll, x: 1350 }"
        :dataSource="data"
        :pagination="false"
        @change="tableChange"
      >
        <span slot="appName" slot-scope="text, record">
          <span @click="changeName(record)">
            <om-app-info
              style="cursor: pointer;"
              :titleColor="curApp === record.id? '#1A7DF1':''"
              :status="record.status"
              :icon="record.icon"
              :app-name="record.appName"
              :app-id="record.appId"
              :plat="record.plat"
            />
          </span>
        </span>
        <span slot="plat" slot-scope="text, record">
          <div v-if="text===0" :style="record.status===0 ? 'opacity: 0.3;' : null">iOS</div>
          <div v-if="text===1" :style="record.status===0 ? 'opacity: 0.3;' : null">Android</div>
        </span>
        <span slot="appKey" slot-scope="text, record">
          <div :style="record.status===0 ? 'opacity: 0.3;' : null" >
            <a-tooltip placement="bottom" :title="text" :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
              <a herf="#"><img src="/icon/View.svg" style="margin-right:16px;" @mouseenter="enterView" @mouseleave="leaveView" class="search"></a>
            </a-tooltip>
            <a-tooltip placement="bottom" title="Copy" :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
              <a herf="#"><img src="/icon/copy.svg" @mouseenter="enter" @mouseleave="leave" @click="handleCopyAppKey(text)" alt="Copy"></a>
            </a-tooltip>
          </div>
        </span>
        <span :style="record.status===0 ? 'opacity: 0.3;' : null" slot="placementSummary" slot-scope="text, record">
          <a-tag v-if="text && text.RewardedVideo">Rewarded Video x {{ text.RewardedVideo }}</a-tag>
          <a-tag v-if="text && text.Interstitial">Interstitial x {{ text.Interstitial }}</a-tag>
          <a-tag v-if="text && text.Native">Native x {{ text.Native }}</a-tag>
          <a-tag v-if="text && text.Banner">Banner x {{ text.Banner }}</a-tag>
          <a-tag v-if="text && text.Splash">Splash x {{ text.Splash }}</a-tag>
        </span>
        <span slot="status" slot-scope="text, record">
          <a herf="#" @click="handleEdit(record)">{{ text===0?'Enable' : 'Disable' }}</a>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CreateApp from './modules/CreateApp'
import { updateApp, getAppList } from '@/api/publisher'
import OmAppInfo from '@/components/om/AppInfo'

export default {
  name: 'AppList',
  components: {
    OmAppInfo,
    Ellipsis,
    CreateApp
  },
  created () {
    this.scroll = window.innerHeight - 202
    this.search()
  },
  data () {
    const columns = [
      {
        title: 'App',
        dataIndex: 'appName',
        width: '300px',
        fixed: 'left',
        sorter: this.buildSorter((a, b) => {
          return a.appName.localeCompare(b.appName)
        }),
        scopedSlots: { customRender: 'appName' }
      },
      {
        title: 'Platform',
        dataIndex: 'plat',
        width: '150px',
        sorter: this.buildSorter((a, b) => {
          return a.plat - b.plat
        }),
        scopedSlots: { customRender: 'plat' }
      },
      {
        title: 'App Key',
        dataIndex: 'appKey',
        width: '150px',
        needTotal: true,
        scopedSlots: { customRender: 'appKey' }
      },
      {
        title: 'Active Placements',
        dataIndex: 'placementSummary',
        scopedSlots: { customRender: 'placementSummary' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        width: '250px',
        fixed: 'right',
        scopedSlots: { customRender: 'status' }
      }
    ]
    if (!this.$auth('pubapp.edit')) {
      columns.pop()
    }

    return {
      data: [],
      sortOrder: '',
      loading: false,
      scroll: 650,
      columns: columns,
      curApp: this.$store.state.publisher.searchApp
    }
  },
  methods: {
    search () {
      this.loading = true
      getAppList()
        .then(res => {
          this.arraySort(res.data)
          this.data = res.data
        }).finally(() => {
          this.loading = false
        })
    },
    changeName (appInfo) {
      this.$store.commit('SET_APP', appInfo.id)
      this.curApp = appInfo.id
    },
    enter (e) {
      e.target.src = '/icon/copy-hover.svg'
    },
    leave (e) {
      e.target.src = '/icon/copy.svg'
    },
    enterView (e) {
      e.target.src = '/icon/View-hover.svg'
    },
    leaveView (e) {
      e.target.src = '/icon/View.svg'
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
    handleEdit (record) {
      const status = record.status === 0 ? 1 : 0
      updateApp({ id: record.id, status })
        .then(res => {
          if (res.code === 0) {
            record.status = status
            this.$message.success(`update success`)
            // update menu app select options
            this.$store.commit('UPDATESELECTLIST', new Date().getTime())
            this.arraySort(this.data)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleCopyAppKey (text) {
      this.$copyText(text).then(function (e) {
      }, function (e) {
      })
      this.$message.success(`Copied App Key value to the clipboard`, 1)
    },
    addApp () {
      this.$router.push({
        path: '/publisher/app/add',
        query: { type: 'Add' }
      })
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
  .search {
    margin-right: 8px;
  }
</style>
