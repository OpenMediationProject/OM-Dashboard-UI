<!-- Placement Scenes edit -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <a-row v-if="canEdit" type="flex" justify="start" style="height: 44px;margin-top:-8px">
      <a-form-item v-action:edit style="position:absolute; right:0;">
        <span class="table-page-search-submitButtons" >
          <a-button type="primary" ghost @click="handleAddSence">Add Scene</a-button>
        </span>
      </a-form-item>
    </a-row>
    <a-table
      class="ant-card-table-default-noshadow"
      style="margin-bottom:64px;"
      ref="table"
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
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-form-item
          label="Frequency Cap"
          :colon="false"
          style="margin-bottom: 0px;"
          :labelCol="{lg: { span: 10 }, sm: { span: 10 }}"
          :wrapperCol="{lg: { span: 10 }, sm: { span: 10 } }">
          Limit to <a-input-number
            type="number"
            size="small"
            :disabled="!record.editStatus"
            :min="0"
            :max="9999"
            style="width:66px;"
            v-decorator="[record.id+'frequencyCap',{initialValue: record.frequencyCap}]"/> impressions per
          <a-input-number
            type="number"
            size="small"
            :min="1"
            :disabled="!record.editStatus"
            :max="24"
            style="width:50px;"
            v-decorator="[record.id+'frequencyUnit',{initialValue: record.frequencyUnit}]"/> hour(s)
        </a-form-item>
      </p>
      <span slot="frequencyCap" slot-scope="text, record">
        <span :style="record.status===0 ? 'opacity: 0.3;' : null" v-if="record.frequencyCap===0">
          <a-icon style="margin-tottom:5px;" class="expand-icon" @click="handleExpand(record)" :type="record.expandStatus ? 'minus':'plus'" /> All
        </span>
        <span v-else>
          <div :style="record.status===0 ? 'opacity: 0.3;' : null">
            <div style="margin-top:-4px;"><a-icon class="expand-icon" @click="handleExpand(record)" :type="record.expandStatus ? 'minus':'plus'" />Frequency Cap: <span style="color:#1890ff;">{{ record.frequencyCap }} impr / {{ record.frequencyUnit }} h</span><br></div>
          </div>
        </span>
      </span>
      <span slot="status" slot-scope="text, record">
        <template>
          <div v-if="record.editStatus">
            <a herf="#" @click="handleSceneSave(record)">Save</a>
            <a-divider type="vertical" />
            <a herf="#" @click="handleCancel(record)">Cancel</a>
          </div>
          <div v-else>
            <a herf="#" @click="handleEdit(record)">Edit</a>
            <a-divider type="vertical" />
            <a herf="#" @click="handelSceneStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
          </div>
        </template>
      </span>
      <span class="row-edit" slot="name" slot-scope="text, record">
        <a-form-item v-if="record.editStatus" :style="record.status===0 ? 'opacity: 0.3;' : null">
          <a-input
            placeholder="scene name"
            v-decorator="[record.id+'name',{initialValue: record.name,rules: [{ required: true, message: 'Scene Name can not be empty.' }]}]"
          />
        </a-form-item>
        <span :style="record.status===0 ? 'opacity: 0.3;' : null" v-else >{{ text }}</span>
      </span>
    </a-table>
  </a-form>
</template>

<script>
import { placementScenesUpdate, placementScenesCreate } from '@/api/publisher'
import OmForm from '@/components/OmForm'

export default {
  name: 'ScenesEdit',
  components: {
    OmForm
  },
  data () {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '400px',
        sorter: (a, b) => {
          return a.name.localeCompare(b.name)
        },
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Traffic Control',
        dataIndex: 'frequencyCap',
        scopedSlots: { customRender: 'frequencyCap' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        width: '150px',
        scopedSlots: { customRender: 'status' }
      }
    ]
    if ((!this.$auth('placement.edit') && !this.$auth('placement.add')) || this.$route.query.type === 'Details') {
      columns.pop()
    }
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      name: '',
      height: '500px',
      count: -100,
      activeKey: '1',
      canEdit: (this.$auth('placement.edit') || this.$auth('placement.add')) && this.$route.query.type !== 'Details',
      placementId: this.$route.query.placementId,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      data: this.list,
      columns: columns,
      scroll: 500
    }
  },
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  mounted () {
    this.height = (window.innerHeight - 209) + 'px'
    this.scroll = window.innerHeight - 350
  },
  methods: {
    handleSceneSave (record) {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.name = values[record.id + 'name']
          item.frequencyCap = values[record.id + 'frequencyCap']
          item.frequencyUnit = values[record.id + 'frequencyUnit']
          if (record.createNew) {
            item.placementId = that.placementId
            placementScenesCreate(item).then(res => {
              if (res.code === 0) {
                Object.assign(record, res.data)
                record.expandStatus = false
                record.editStatus = false
                record.createNew = false
                this.handleExpand(item)
                this.$message.success(`create scene success`)
              } else {
                this.$message.error(`create scene error`)
              }
            })
          } else {
            placementScenesUpdate(item).then(res => {
              if (res.code === 0) {
                this.$message.success(`update scene success`)
                Object.assign(record, item)
                record.editStatus = false
                this.handleExpand(record)
              } else {
                this.$message.error(`update scene error`)
              }
            })
          }
        }
      })
    },
    handleEdit (record) {
      record.editStatus = true
      if (!record.expandStatus) {
        this.handleExpand(record)
      }
    },
    handleExpand (record) {
      record.expandStatus = !record.expandStatus
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          record.editStatus = false
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
          this.data.forEach(item => {
            if (item.id !== record.id) {
              item.expandStatus = false
              item.editStatus = false
            }
          })
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleCancel (record) {
      if (record.createNew) {
        this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
      }
      this.handleExpand(record)
    },
    handelSceneStatusUpdate (record) {
      placementScenesUpdate(Object.assign(record, { status: record.status === 0 ? 1 : 0 }))
        .then(res => {
          if (res.code === 0) {
            this.$message.success(`update success`)
            this.arraySort(this.data)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleAddSence () {
      this.data.forEach(item => {
        item.expandStatus = false
        item.editStatus = false
      })
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      const newItem = {
        id: this.count,
        name: '',
        expandStatus: true,
        frequencyCap: 0,
        frequencyUnit: 1,
        createNew: true,
        editStatus: true
      }
      this.count = this.count - 1
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
      this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
        node.scrollTop = 0
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
.expand-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    text-align: center;
    background: #fff;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.plcedit >>> .ant-card-head-title {
  margin-left: -8px;
  margin-top: -6px;
}
.plcedit >>> .ant-card-head {
  height: 48px;
}
.plcedit >>> .ant-form-item {
  margin-bottom: 0;
}
.plcedit >>> .ant-form-explain, .ant-form-extra {
  line-height: 1.5;
  margin-bottom: -20px;
}
</style>
