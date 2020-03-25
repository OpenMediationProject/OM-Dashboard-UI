<!-- AdNetwork list page router '/mediation/adn/list' -->
<template>
  <div>
    <a-card :bordered="false" class="ant-card-table-default" style="margin-top:48px;">
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :scroll="{ y: scroll, x: 1350 }"
      >
        <span slot="className" slot-scope="text, record">
          <ad-network
            :className="text"
            :id="record.id"
            :status="record.status"
          />
        </span>
        <span slot="reportapiStatus" slot-scope="text, record">
          <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
            <span v-if="text==='Running'" style="color:#18A81E;">
              {{ record.status===0? 'OFF' :text }}
            </span>
            <span v-else-if="text==='Delayed'" style="color:#FCA600;">
              {{ record.status===0? 'OFF' :text }}
            </span>
            <span v-else>
              {{ record.status===0? 'OFF' :text }}
            </span>
          </span>
        </span>
        <span slot="adTypes" slot-scope="text, record">
          <ad-type :status="record.status" :adTypes="text"/>
        </span>
        <span slot="instanceSize" slot-scope="text, record">
          <span :style="record.status===0 ? 'opacity: 0.3;' : null" >{{ text }}</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <template>
            <span v-if="canEdit">
              <a @click="handleEdit(record)">Edit</a>
              <span v-if="record.adNetworkAppId && record.instanceSize > 0">
                <a herf="#" @click="handleStatusEdit(record)" v-if="text===0 && record.instanceSize > 0"><a-divider v-if="record.adNetworkAppId" type="vertical" />{{ 'Enable' }}</a>
                <a herf="#" @click="handleStatusEdit(record)" v-else><a-divider v-if="record.adNetworkAppId" type="vertical" />{{ 'Disable' }}</a>
              </span>
            </span>
            <span v-else>
              <span v-if="record.adNetworkAppId">
                <a herf="#" @click="viewAdn(record)">Details</a>
              </span>
            </span>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { adNetworkList, adNetworkAppStatusUpdate, adNetworkInstancesList } from '@/api/mediation'
import AdNetwork from '@/components/Mediation/AdNetwork'
import AdType from './modules/AdType'

import { mapState } from 'vuex'

export default {
  name: 'TableList',
  components: {
    AdNetwork,
    AdType
  },
  data () {
    return {
      data: [],
      scroll: 500,
      canEdit: this.$auth('adn.edit'),
      loading: false,
      columns: [
        {
          title: 'Ad Network',
          dataIndex: 'className',
          fixed: 'left',
          width: '250px',
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Ad Units Supported',
          dataIndex: 'adTypes',
          scopedSlots: { customRender: 'adTypes' }
        },
        {
          title: 'Report API Status',
          dataIndex: 'reportapiStatus',
          width: '200px',
          scopedSlots: { customRender: 'reportapiStatus' }
        },
        {
          title: 'Instances',
          width: '150px',
          align: 'center',
          dataIndex: 'instanceSize',
          scopedSlots: { customRender: 'instanceSize' }
        },
        {
          title: 'Operations',
          width: '280px',
          fixed: 'right',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  created () {
    this.scroll = window.innerHeight - 196
    if (this.searchApp) {
      this.searchTable()
    }
  },
  computed: mapState({
    visible: state => state.publisher.searchAppVisible,
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    searchApp (curVal) {
      this.searchTable()
    }
  },
  methods: {
    handleEdit (record) {
      const params = {}
      params.pubAppId = this.$store.state.publisher.searchApp
      if (record.id) {
        params.adNetworkId = record.id
      }
      if (!params.pubAppId) {
        return
      }
      adNetworkInstancesList(params)
        .then(res => {
          if (res.code === 0) {
            this.$router.push({
              name: 'EditAdNetwork',
              params: {
                name: record.descn,
                adTypes: record.adTypes,
                id: record.id,
                adNetworkAppId: record.adNetworkAppId,
                list: res.data
              },
              query: {
                type: 'Edit'
              }
            })
          }
        })
    },
    viewAdn (record) {
      const params = {}
      params.pubAppId = this.searchApp
      if (record.id) {
        params.adNetworkId = record.id
      }
      adNetworkInstancesList(params)
        .then(res => {
          if (res.code === 0) {
            this.$router.push({
              name: 'AdNetworkDetail',
              params: {
                name: record.descn,
                adTypes: record.adTypes,
                id: record.id,
                adNetworkAppId: record.adNetworkAppId,
                list: res.data
              },
              query: {
                type: 'Details'
              }
            })
          }
        })
    },
    handleStatusEdit (record) {
      adNetworkAppStatusUpdate({ status: record.status === 0 ? 1 : 0, adNetworkAppId: record.adNetworkAppId })
        .then(res => {
          if (res.code === 0) {
            Object.assign(record, { status: record.status === 0 ? 1 : 0 })
            this.searchTable()
            this.$message.success(`update success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    searchTable () {
      this.loading = true
      adNetworkList({ pubAppId: this.searchApp })
        .then(res => {
          this.data = res.data
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
  .search {
    margin-right: 16px;
  }
  .disable-row {
    opacity: 0.3;
  }
</style>
