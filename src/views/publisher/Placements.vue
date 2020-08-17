<!-- Placement list page router '/publisher/placement/list' -->
<template>
  <div>
    <om-alert v-if="this.$route.query.isnew && canEdit" @click="alertAdn" :message="alertAdnMessage"></om-alert>
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
              <a-select-option value="2">Rewarded Video</a-select-option>
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
    <a-card :bordered="false" class="ant-card-table-default" style="margin-bottom: 16px;">
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :scroll="{ y: 'auto'}"
        :pagination="false"
        @change="tableChange"
      >
        <span slot="name" slot-scope="text, record">
          <om-placement-info
            :copy-id="true"
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
          <span :style="record.status===0 ? 'opacity: 0.3;' : null">
            <span v-if="[1, 0].includes(record.adType)">--</span>
            <a v-else @click="editScene(record.id)">{{ record.sceneSize || '0' }}</a>
          </span>
        </span>
        <span slot="instanceSize" slot-scope="text, record">
          <span :style="record.status===0 ? 'opacity: 0.3;' : null"><a @click="editInstance(record.id)">{{ record.instanceSize.length || '0' }}</a></span>
        </span>
        <span slot="status" slot-scope="text, record">
          <span>
            <span v-if="canEdit">
              <a @click="handleUpdate(record)">Edit</a>
              <a-divider type="vertical" />
              <a herf="#" @click="handleEdit(record)">{{ text===0?'Enable' : 'Disable' }}</a>
              <a-divider type="vertical" v-if="record.status" />
              <a herf="#" v-if="record.status" @click="editInstance(record.id)">Instances</a>
              <a-divider v-if="record.status" type="vertical" />
              <a herf="#" v-if="record.status" @click="editMediation(record.id)">Mediation</a>
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
import { Ellipsis, OmAlert } from '@/components'
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
    OmPlacementInfo,
    OmAlert
  },
  created () {
    this.scroll = window.innerHeight - 210
    if (this.searchApp) {
      this.searchTable()
    }
  },
  destroyed () {
    if (!this.$route.query.isnew && this.$route.path !== '/publisher/placement/add') {
      localStorage.removeItem('isnew_plc')
    }
  },
  data () {
    const isnewPlc = parseInt(localStorage.getItem('isnew_plc')) || 0
    return {
      alertAdnMessage: {
        title: 'Your Placement is created successfully.',
        content: 'Next steps: Setup ad network settings for monetize',
        button: 'Setup Ad Network'
      },
      data: [],
      isnewPlc,
      scroll: 200,
      showAlert: false,
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
          ellipsis: true,
          sorter: this.buildSorter((a, b) => {
            return a.name.localeCompare(b.name)
          }),
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Type',
          width: '15%',
          dataIndex: 'adType',
          sorter: this.buildSorter((a, b) => {
            return a.typeStr.localeCompare(b.typeStr)
          }),
          scopedSlots: { customRender: 'adType' }
        },
        {
          title: 'Enabled Instance',
          width: '15%',
          align: 'center',
          dataIndex: 'instanceSize',
          scopedSlots: { customRender: 'instanceSize' }
        },
        {
          title: 'Enable Scenes',
          width: '15%',
          align: 'center',
          dataIndex: 'scenes',
          scopedSlots: { customRender: 'scenes' }
        },
        {
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
    alertAdn () {
      localStorage.setItem('isnew_plc', this.$route.query.newplc)
      this.$router.push({
        path: '/adn/list',
        query: { isnew: 1, newplc: this.$route.query.newplc }
      })
    },
    editInstance (id) {
      const target = this.data.filter(row => { return row.id === parseInt(id) })[0]
      if (target) {
        this.$store.commit('SET_PLACEMENT', target)
      }
      this.$router.push({
        path: '/mediation/mediation/list'
      })
    },
    editMediation (id) {
      const target = this.data.filter(row => { return row.id === parseInt(id) })[0]
      if (target) {
        this.$store.commit('SET_PLACEMENT', target)
      }
      this.$router.push({
        path: '/mediation/mediation/list',
        query: { placementId: id, type: '2' }
      })
    },
    editScene (id) {
      this.$router.push({
        path: '/publisher/placement/add',
        query: { placementId: id, type: 'Edit', key: '2' }
      })
    },
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
      if (this.isnewPlc) {
        localStorage.removeItem('isnew_plc')
      }
      if (this.$route.query.isnew) {
        this.$router.push({
          path: '/publisher/placement/add',
          query: { type: 'Add', isnew: '2' }
        })
      } else {
        this.$router.push({
          path: '/publisher/placement/add',
          query: { type: 'Add' }
        })
      }
    },
    handleEdit (record) {
      const status = record.status === 0 ? 1 : 0
      placementUpdate(Object.assign(record, { status: status }))
        .then(res => {
          if (res.code === 0) {
            record.status = status
            this.arraySort(this.data)
            this.$message.success(this.$msg('placement.update_success'))
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleUpdate (record) {
      if (this.isnewPlc) {
        localStorage.removeItem('isnew_plc')
      }
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
