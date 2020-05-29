<template>
  <div class="ant-table ant-table-body ant-table-scroll-position-left ant-table-default ant-card-table-default-noshadow" style="max-height: 640px; overflow-y: scroll;">
    <div class="ant-table-content">
      <div class="ant-table-scroll">
        <div class="ant-table-header">
          <table>
            <colgroup v-if="disable===0"><col style="width: 35%; min-width: 35%;"><col style="width: 30%; min-width: 30%;"><col style="width: 200px; min-width: 200px;"><col></colgroup>
            <colgroup v-else><col style="width: 40%; min-width: 40%;"><col style="width: 40%; min-width: 40%;"><col></colgroup>
            <thead class="ant-table-thead">
              <tr style="background: #FFFFFF;">
                <th><div>Ad Network</div></th>
                <th><div>Instance</div></th>
                <th v-if="disable===0" key="priority" style="text-align: center;"><div>Priority</div></th>
                <th v-if="canEdit" key="status"><div>Operations</div></th>
              </tr>
            </thead>
            <draggable
              class="ant-table-tbody"
              v-model="list"
              tag="tbody"
              :delay="2"
              @end="sortEnd"
              handle=".sortcell"
              filter=".disable">
              <tr
                style="background:#FFFFFF;"
                :class="(item.priority>0 && disable===0) ?'ant-table-row ant-table-row-level-0 enable':'ant-table-row ant-table-row-level-0 disable'"
                :data-row-key="item.id"
                v-for="item in list"
                :key="item.id">
                <td scope="row">
                  <ad-network
                    :className="item.className"
                    :id="item.id"
                    :status="item.priority>0?1:0"
                  />
                </td>
                <td class="water-table">
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' "><a-tooltip :title="item.placementKey">{{ item.name }}</a-tooltip><a-button
                    v-if="item.hbStatus"
                    type="danger"
                    style="width: 100px;
                    font-size: 12px;
                    margin-left: 10px;
                    height: 25px;"
                    ghost>Header bidding</a-button></span>
                </td>
                <td v-if="disable===0" style="text-align: center;">
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' ">
                    <editable-cell v-if="item.priority>0 && canEdit" :text="item.priority || '--'" @change="change(item, 'priority', $event)" />
                    <span v-else>{{ item.priority || '--' }}</span>
                  </span>
                </td>
                <td v-if="canEdit">
                  <span>
                    <a herf="#" @click="update(item)">{{ item.priority >0 ? 'Disable' : 'Enable' }}</a>
                    <span :class="(item.priority>0 && disable===0) ?'sortcell':null" style="float:right" v-if="item.priority >0 && disable===0 && canEdit">
                      <img src="/icon/Drag.svg"/>
                    </span>
                  </span>
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import AdNetwork from '@/components/Mediation/AdNetwork'
import EditableCell from '@/components/EditableCell'
import OmText from '@/components/om/Text'

export default {
  name: 'WaterfallTable',
  display: 'Table',
  order: 8,
  components: {
    draggable,
    AdNetwork,
    EditableCell,
    OmText
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    autoOpt: {
      type: Number,
      default: 0
    }
  },
  data () {
    const type = this.$route.query.type
    return {
      list: this.data,
      dragging: false,
      disable: this.autoOpt,
      canEdit: this.$auth('mediation.edit') && type !== 'Details'
    }
  },
  watch: {
    data (val) {
      this.list = []
      this.$nextTick(() => {
        this.list = val
      })
    },
    autoOpt (val) {
      this.disable = val
    }
  },
  methods: {
    sortEnd (e) {
      const priority = e.newIndex + 1
      const item = this.list[e.newIndex]
      this.$emit('sortEnd', item.placementRuleInstanceId, priority)
    },
    update (item) {
      this.$emit('updateStatus', item, 'instance')
    },
    change (record, dataIndex, value) {
      if (record.priority === value) {
        return false
      }
      this.$emit('priorityUpdate', record, dataIndex, value)
    }
  }
}
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.sortcell {
cursor: move;
}
.water-table >>> .ant-btn {
  padding: 0 0;
}
</style>
