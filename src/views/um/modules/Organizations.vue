<!-- User Management Organizations tab -->
<template>
  <div class="table-page-search-wrapper">
    <a-form :form="form" layout="inline">
      <a-row v-if="canAdd" :gutter="48">
        <a-col>
          <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden', marginTop: '12px', marginBottom: '12px' } || {} ">
            <a-button type="primary" size="default" @click="addOrganizations()">Add Organization</a-button>
          </span>
        </a-col>
      </a-row>
      <div style="background-color:#ffffff">
        <a-table
          ref="table"
          class="ant-card-table-default"
          rowKey="id"
          fixed="true"
          :dataSource="data"
          :scroll="{ y: scroll }"
          :expandedRowKeys="curExpandedRowKeys"
          :columns="columns"
          :expandIconAsCell="false"
          :expandIconColumnIndex="-1"
          :pagination="false"
        >

          <span slot="status" slot-scope="text, record">
            <template>
              <div v-if="record.expandStatus">
                <a herf="#" @click="handleOrgSave(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handleSceneCancel(record)">Cancel</a>
              </div>
              <div v-else>
                <a herf="#" @click="handleSceneEdit(record)">Edit</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handelOrgStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
              </div>
            </template>
          </span>
          <span slot="name" slot-scope="text, record" >
            <a-form-item v-if="record.expandStatus">
              <a-input
                placeholder="name"
                v-decorator="[record.id + 'name',{initialValue: record.name,rules: [{ required: true, message: 'Name can not be empty.' }]}]"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null" >{{ text }}</span>
          </span>
          <span slot="revenueSharing" slot-scope="text, record">
            <a-form-item v-if="record.expandStatus">
              <a-input
                style="width: 50%"
                placeholder="100.00%"
                v-decorator="[record.id + 'revenueSharing',{initialValue: record.revenueSharing * 100 +'%',rules: [{ required: true, message: 'Revenue Share can not be empty.' }]}]"
              /> /
              <span >{{ 100 - record.revenueSharing * 100 + '%' }}</span>
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null">{{ record.revenueSharing * 100 +'%' }}</span>
          </span>
          <span slot="email" slot-scope="text, record">
            <a-form-item v-if="record.expandStatus && record.roleId === 1">
              <a-input
                placeholder="email"
                v-decorator="[record.id + 'email',{initialValue: record.email,rules: [{ required: true, message: 'Email can not be empty.' }, {
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: 'Incorrect mailbox format',
                }]}]"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text }}</span>
          </span>
          <span slot="phone" slot-scope="text, record">
            <a-form-item v-if="record.expandStatus">
              <a-input
                placeholder="phone"
                v-decorator="[record.id + 'phone',{initialValue: record.phone}]"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text }}</span>
          </span>
        </a-table>
      </div>
    </a-form>
  </div>
</template>

<script>
import { orgList, publisherUpdate, publisherCreate } from '@/api/usermanage'

export default {
  name: 'UmUsers',
  components: {
  },
  data () {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Revenue Share',
        dataIndex: 'revenueSharing',
        width: '20%',
        scopedSlots: { customRender: 'revenueSharing' }
      },
      {
        title: 'Owner',
        dataIndex: 'email',
        width: '20%',
        scopedSlots: { customRender: 'email' }
      },
      {
        title: 'Contact Info',
        dataIndex: 'phone',
        width: '20%',
        scopedSlots: { customRender: 'phone' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        width: '20%',
        scopedSlots: { customRender: 'status' }
      }
    ]
    const canEdit = this.$auth('um_orgs.edit')
    if (!canEdit) {
      columns.pop()
    }
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      canAdd: this.$auth('um_orgs.add'),
      canEdit: this.$auth('um_orgs.edit'),
      count: -1,
      params: {},
      name: '',
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      data: [],
      deviceData: [],
      lastFetchId: 0,
      scroll: 500,
      value: [],
      fetching: false,
      columns: columns
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 270
    this.search()
  },
  methods: {
    search () {
      orgList().then(res => {
        this.arraySort(res.data)
        this.data = res.data
      })
    },
    handleOrgSave (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.name = values[record.id + 'name']
          item.email = values[record.id + 'email']
          var revenue = values[record.id + 'revenueSharing'].substring(0, values[record.id + 'revenueSharing'].length - 1)
          item.revenueSharing = revenue / 100
          item.phone = values[record.id + 'phone']
          if (record.createNew) {
            publisherCreate(item).then(res => {
              if (res.code === 0) {
                this.$store.commit('UPDATESELECTLIST', new Date().getTime())
                record.expandStatus = false
                record.createNew = false
                this.search()
                this.handleExpand(item)
                this.$message.success(`create Organizations success`)
              } else {
                this.$message.error(`create Organizations error`)
              }
            })
          } else {
            item.id = record.id
            publisherUpdate(item).then(res => {
              if (res.code === 0) {
                this.$store.commit('UPDATESELECTLIST', new Date().getTime())
                this.$message.success(`update Organizations success`)
                record.expandStatus = false
                this.search()
                this.handleExpand(item)
              } else {
                this.$message.error(`update Organizations error`)
              }
            })
          }
        }
      })
    },
    handleExpand (record) {
      record['expandStatus'] = !record['expandStatus']
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleSceneEdit (record) {
      const target = this.data.filter(item => record.id === item.id)[0]
      if (target) {
        target['expandStatus'] = true
      }
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleSceneCancel (record) {
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      const chanceRow = this.data.filter(item => record.id === item.id)[0]
      chanceRow['expandStatus'] = false
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      if (record.createNew) {
        this.data.shift()
      }
    },
    addOrganizations () {
      const newItem = {
        id: this.count,
        name: '',
        expandStatus: true,
        email: '',
        roleId: 1,
        revenueSharing: '',
        phone: '',
        createNew: true
      }
      this.count--
      this.data.unshift(newItem)
      this.currentExpandedStatOpen = true
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(newItem.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(newItem.id)
        }
      } else {
        this.curExpandedRowKeys.push(newItem.id)
      }
    },
    handelOrgStatusUpdate (record) {
      publisherUpdate(Object.assign(record, { status: record.status === 0 ? 1 : 0 }))
        .then(res => {
          if (res.code === 0) {
            this.arraySort(this.data)
            this.$store.commit('UPDATESELECTLIST', new Date().getTime())
            this.$message.success(`update success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return b.id - a.id
        } else {
          return b.status - a.status
        }
      })
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
