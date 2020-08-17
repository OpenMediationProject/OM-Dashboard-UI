<template>
  <div>
    <a-form :form="form">
      <a-row v-action:edit type="flex" justify="start" style="height: 50px;margin-top: 7px;margin-bottom: 5px;">
        <a-form-item style="position:absolute; right:16px;" >
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="default" @click="addDevice()">Add Device</a-button>
          </span>
        </a-form-item>
      </a-row>
      <div style="background-color:#ffffff">
        <a-table
          ref="table"
          class="ant-card-table-default"
          rowKey="id"
          fixed="true"
          :dataSource="data"
          :scroll="{ y: scroll }"
          :columns="columns"
          @change="tableChange"
          :pagination="{current:current, hideOnSinglePage:true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, change: (val) => this.current = current}"
        >
          <span v-action:edit slot="status" slot-scope="text, record">
            <template>
              <div v-if="record.createNew">
                <a herf="#" @click="handleSaveEdit(record)">add</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handleDeviceCancel(record)">Cancel</a>
              </div>
              <div v-else>
                <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="handleDelDevice(record)">
                  <a herf="#">Delete</a>
                </a-popconfirm>
              </div>
            </template>
          </span>
          <span slot="deviceName" slot-scope="text, record" >
            <span>
              <a-form-item>
                <a-input
                  v-if="record.createNew"
                  placeholder="name"
                  v-decorator="[record.id + 'deviceName',{initialValue: record.deviceName,rules: [{ required: true, message: $msg('sdk.device_name_empty') }]}]"
                />
                <template v-else >{{ text }}</template>
              </a-form-item>
            </span>
          </span>
          <span slot="deviceId" slot-scope="text, record" >
            <template>
              <a-form-item>
                <a-input
                  v-if="record.createNew"
                  placeholder="id"
                  v-decorator="[record.id + 'deviceId',{initialValue: record.deviceId,rules: [{ required: true, message: $msg('sdk.id_empty') }]}]"
                />
                <span v-else >{{ text }}</span>
              </a-form-item>
            </template>
          </span>
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="c => searchInput = c"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
            >Search</a-button
            >
            <a-button
              @click="() => handleReset(clearFilters)"
              size="small"
              style="width: 90px"
            >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
        </a-table>
      </div>
    </a-form>
  </div>
</template>

<script>
import { deviceList, createDevice, deleteDevice } from '@/api/sdk'

export default {
  name: 'Integration',
  components: {

  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      data: [],
      count: -100,
      scroll: 500,
      columns: [
        {
          title: 'Device Name',
          dataIndex: 'deviceName',
          width: '33%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'deviceName'
          },
          onFilter: (value, record) => {
            if (record.id < 0) {
              return true
            }
            if (!record.deviceName) {
              return false
            }
            return record.deviceName.toString().toLowerCase().includes(value.toLowerCase())
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: 'ID(IDFA/GAID)',
          dataIndex: 'deviceId',
          width: '33%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'deviceId'
          },
          onFilter: (value, record) => {
            if (record.id < 0) {
              return true
            }
            if (!record.deviceId) {
              return false
            }
            return record.deviceId.toString().toLowerCase().includes(value.toLowerCase())
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          width: '33%',
          scopedSlots: { customRender: 'status' }
        }
      ],
      current: 1,
      searchText: '',
      searchInput: null,
      searchedColumn: ''
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 270
    deviceList().then(res => {
      this.data = res.data
    })
  },
  methods: {
    tableChange (pagination, filters, sorter) {
      this.current = pagination.current
    },
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    addDevice () {
      const newItem = {
        id: this.count,
        deviceName: '',
        deviceId: '',
        createNew: true
      }
      this.tableChange({ current: 1 })
      this.count--
      this.data.unshift(newItem)
    },
    handleDeviceCancel (record) {
      this.data.shift()
    },
    handleSaveEdit (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.deviceName = values[record.id + 'deviceName']
          item.deviceId = values[record.id + 'deviceId']
          createDevice(item).then(res => {
            if (res.code === 0) {
              record.createNew = false
              record = Object.assign(record, res.data)
              this.$message.success(`create success`)
            }
          })
        }
      })
    },
    handleDelDevice (record) {
      const params = { id: record.id }
      deleteDevice(params).then(res => {
        if (res.code === 0) {
          this.$message.success(`delete success`)
          this.data.splice(this.data.findIndex(i => i.id === record.id), 1)
        }
      })
    }
  }
}
</script>
