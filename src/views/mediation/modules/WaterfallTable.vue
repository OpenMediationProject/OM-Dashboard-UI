<template>
  <div class="ant-table ant-table-fixed-header ant-table-scroll-position-left ant-table-default ant-table-layout-fixed ant-card-table-default-noshadow">
    <div class="ant-table-content">
      <div class="ant-table-scroll">
        <div
          class="ant-table-header"
          style="margin-bottom: -36px; min-width: 0px; overflow: scroll hidden;">
          <table class="">
            <colgroup v-if="disable===0">
              <col style="width: 15%; min-width: 15%;">
              <col style="width: 25%; min-width: 25%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col >
              <col v-if="canEdit">
            </colgroup>
            <colgroup v-else>
              <col style="width: 15%; min-width: 15%;">
              <col style="width: 25%; min-width: 25%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col v-if="canEdit">
            </colgroup>
            <thead class="ant-table-thead">
              <tr style="background: #FFFFFF;">
                <th><div>Ad Network</div></th>
                <th><div>Instance</div></th>
                <th><div>Requests</div></th>
                <th><div>Fill Rate</div></th>
                <th><div>eCPM</div></th>
                <th v-if="disable===0" key="priority" style="text-align: center;"><div>Priority</div></th>
                <th v-if="canEdit" key="status"><div>Operations</div></th>
              </tr>
            </thead>
          </table>
        </div>
        <div tabindex="-1" class="ant-table-body">
          <table class="">
            <colgroup v-if="disable===0">
              <col style="width: 15%; min-width: 15%;">
              <col style="width: 25%; min-width: 25%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col >
              <col v-if="canEdit">
            </colgroup>
            <colgroup v-else>
              <col style="width: 15%; min-width: 15%;">
              <col style="width: 25%; min-width: 25%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 10%; min-width: 10%;">
              <col v-if="canEdit">
            </colgroup>
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
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' "><a-tooltip :title="item.placementKey">{{ item.name }}</a-tooltip>
                  </span>
                </td>
                <td>
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' ">
                    <a-tooltip :title="toolTip">
                      <div>{{ f(item.instanceRequestLatest) }}</div>
                      <div :style="(item.instanceRequestLatest>item.instanceRequestSecondLatest || item.reqGrowth === '--')?'color: #18921D;padding-top: 4px;':'color: #D5432F;padding-top: 4px;'">{{ item.reqGrowth }}</div>
                    </a-tooltip>
                  </span>
                </td>
                <td>
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' ">
                    <a-tooltip :title="toolTip">
                      <div>{{ f(item.fillRate, '0.00 %') }}</div>
                      <div :style="item.fillRate>=item.fillRate2 || item.fillGrowth === '--'?'color: #18921D;padding-top: 4px;':'color: #D5432F;padding-top: 4px;'">{{ item.fillGrowth }}</div>
                    </a-tooltip>
                  </span>
                </td>
                <td>
                  <span :style="item.priority >0 ? null: 'opacity: 0.3;' ">
                    <a-tooltip :title="toolTip">
                      <div>{{ f(item.ecpm,'$ 0,0.00') }}</div>
                      <div :style="item.ecpm>=item.ecpm2|| item.ecpmGrowth === '--'?'color: #18921D;padding-top: 4px;':'color: #D5432F;padding-top: 4px;'">{{ item.ecpmGrowth }}</div>
                    </a-tooltip>
                  </span>
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
                    <span :class="(item.priority>0 && disable===0) ?'sortcell':null" style="float:right" v-if="item.priority >0 && disable===0 && canEdit && !sortdisable">
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
import numerify from 'numerify'

numerify('1', '0,0')
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
    },
    sortdisable: {
      type: Boolean,
      default: false
    },
    hour: {
      type: Number,
      default: 24
    }
  },
  data () {
    const type = this.$route.query.type
    return {
      list: this.data,
      dragging: false,
      disable: this.autoOpt,
      toolTip: 'Last ' + this.hour + ' hours vs Previous' + this.hour + ' hours',
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
    hour (val) {
      this.toolTip = 'Last ' + val + ' hours vs Previous' + val + ' hours'
    },
    autoOpt (val) {
      this.disable = val
    }
  },
  methods: {
    f (v, f) {
      if (!f) {
        f = '0,0'
      }
      return numerify(v, f)
    },
    sortEnd (e) {
      this.$emit('sortEnd', this.list.filter(item => item.priority > 0))
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
  .ant-table-header {
    background:white ;
  }
</style>
