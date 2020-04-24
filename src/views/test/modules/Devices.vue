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
          :scroll="{ y: 500 }"
          :columns="columns"
          :pagination="false"
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
                  v-decorator="[record.id + 'deviceName',{initialValue: record.deviceName,rules: [{ required: true, message: '.' }]}]"
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
                  v-decorator="[record.id + 'deviceId',{initialValue: record.deviceId,rules: [{ required: true, message: '.' }]}]"
                />
                <span v-else >{{ text }}</span>
              </a-form-item>
            </template>
          </span>
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
      columns: [
        {
          title: 'Device Name',
          dataIndex: 'deviceName',
          width: '33%',
          scopedSlots: { customRender: 'deviceName' }
        },
        {
          title: 'ID(IDFA/GAID)',
          dataIndex: 'deviceId',
          width: '33%',
          scopedSlots: { customRender: 'deviceId' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          width: '33%',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  mounted () {
    deviceList().then(res => {
      this.data = res.data
    })
  },
  methods: {
    addDevice () {
      const newItem = {
        id: this.count,
        deviceName: '',
        deviceId: '',
        createNew: true
      }
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
