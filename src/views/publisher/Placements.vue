<!-- Placement list page router '/publisher/placement/list' -->
<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row type="flex" justify="start" style="height: 44px;margin-top: 7px;">
          <a-form-item style="margin-right:8px;">
            <a-select
              style="width:220px;"
              mode="multiple"
              placeholder="Type"
              allowClear
              :maxTagCount="1"
              @change="handleChange"
              v-decorator="['queryAdType']">
              <a-select-option value="2">Reward Video</a-select-option>
              <a-select-option value="3">Interstitial</a-select-option>
              <a-select-option value="1">Native</a-select-option>
              <a-select-option value="0">Banner</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span class="table-page-search-submitButtons">
              <a-button type="primary" ghost @click="searchTable()">Apply</a-button>
            </span>
          </a-form-item>
          <a-form-item style="position:absolute; right:16px;">
            <span class="table-page-search-submitButtons" >
              <a-button type="primary" v-action:add @click="addPlacement()">Add Placement</a-button>
            </span>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
    <a-card :bordered="false" class="ant-card-table-default">
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :scroll="{ y: scroll, x: 1340 }"
        :pagination="false"
        @change="tableChange"
      >
        <span slot="name" slot-scope="text, record">
          <om-placement-info
            :type="record.adType"
            :status="record.status"
            :name="record.name"
            :id="record.id"
          />
        </span>
        <span slot="adType" slot-scope="text, record">
          <a-tag :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text | typeFilter }}</a-tag>
        </span>
        <span slot="scenes" slot-scope="text, record">
          <span :style="record.status===0 ? 'opacity: 0.3;' : null">{{ (record.adType === 1 || record.adType=== 0)? '--' : record.sceneSize || '0' }} </span>
        </span>
        <span slot="sceneSize" slot-scope="text, record">
          <div :style="record.status===0 ? 'opacity: 0.3;' : null" >
            <div style="margin-top: -4px;">Placement-level: {{ record.frequencyCap===0 && record.frequencyInterval===0 && record.brandList.length===0 && record.modelList.length===0 ? 'All' : 'Limited' }}<br></div>
            <div style="margin-top: 8px;">Scene-level: {{ !record.scenes || record.scenes.findIndex(item => item.frequencyCap !== 0 || item.frequencyInterval !== 0) === -1 ? 'All': 'Limited' }}</div>
          </div>
        </span>
        <span slot="status" slot-scope="text, record">
          <span>
            <span v-if="canEdit">
              <a @click="handleUpdate(record)">Edit</a>
              <a-divider type="vertical" />
              <a herf="#" @click="handleEdit(record)">{{ text===0?'Enable' : 'Disable' }}</a>
            </span>
            <span v-else>
              <a @click="viewPlacement(record)">Details</a>
            </span>
          </span>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
import { placementList, placementUpdate } from '@/api/publisher'
import OmPlacementInfo from '@/components/om/PlacementInfo'
import { mapState } from 'vuex'

const adTypeMap = {
  0: {
    adType: 0,
    text: 'Banner'
  },
  1: {
    adType: 0,
    text: 'Native'
  },
  2: {
    adType: 0,
    text: 'Rewarded Video'
  },
  3: {
    adType: 0,
    text: 'Interstitial'
  },
  4: {
    adType: 0,
    text: 'Splash'
  }
}

export default {
  name: 'TableList',
  components: {
    Ellipsis,
    OmPlacementInfo
  },
  created () {
    this.scroll = window.innerHeight - 210
    if (this.searchApp) {
      this.searchTable()
    }
  },
  data () {
    return {
      data: [],
      scroll: 200,
      queryParam: {},
      adType: [],
      sortOrder: '',
      loading: false,
      canEdit: this.$auth('placement.edit'),
      columns: [
        {
          title: 'Placement',
          dataIndex: 'name',
          width: '300px',
          fixed: 'left',
          sorter: this.buildSorter((a, b) => {
            return a.name.localeCompare(b.name)
          }),
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Type',
          width: '12%',
          dataIndex: 'adType',
          sorter: this.buildSorter((a, b) => {
            return a.typeStr.localeCompare(b.typeStr)
          }),
          scopedSlots: { customRender: 'adType' }
        },
        {
          title: 'Enable Scenes',
          width: '20%',
          align: 'center',
          dataIndex: 'scenes',
          scopedSlots: { customRender: 'scenes' }
        },
        {
          title: 'Traffic Control',
          dataIndex: 'sceneSize',
          scopedSlots: { customRender: 'sceneSize' }
        },
        {
          fixed: 'right',
          width: '250px',
          title: 'Operations',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]
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
  filters: {
    typeFilter (type) {
      return adTypeMap[type].text
    }
  },
  methods: {
    searchTable () {
      this.loading = true
      const params = { pubAppId: this.searchApp, placementTypes: this.adType }
      return placementList(Object.assign(params, this.queryParam))
        .then(res => {
          this.arraySort(res.data)
          res.data.forEach(item => {
            item.typeStr = adTypeMap[item.adType].text
          })
          this.data = res.data
        }).finally(() => {
          this.loading = false
        })
    },
    handleChange (value) {
      this.adType = value.join(',')
    },
    addPlacement () {
      this.$router.push({
        path: '/publisher/placement/add',
        query: { type: 'Add' }
      })
    },
    handleEdit (record) {
      const status = record.status === 0 ? 1 : 0
      placementUpdate(Object.assign(record, { status: status }))
        .then(res => {
          if (res.code === 0) {
            record.status = status
            this.arraySort(this.data)
            this.$message.success(`update success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleUpdate (record) {
      this.$router.push({
        path: '/publisher/placement/add',
        query: { placementId: record.id, type: 'Edit' }
      })
    },
    viewPlacement (record) {
      this.$router.push({
        path: '/publisher/placement/details',
        query: { placementId: record.id, type: 'Details' }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    tableChange (pagination, filters, sorter) {
      this.sortOrder = sorter.order
    },
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return b.createTime - a.createTime
        } else {
          return b.status - a.status
        }
      })
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
    }
  }
}
</script>
