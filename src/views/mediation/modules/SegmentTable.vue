<template>
  <div class="ant-table ant-table-scroll-position-left ant-table-default ant-card-table-default-noshadow" >
    <div class="ant-table-content">
      <div class="ant-table-scroll">
        <div class="ant-table-header">
          <table>
            <colgroup><col style="width: 25%; min-width: 25%;"><col style="width: 20%; min-width: 20%;"><col style="width: 150px; min-width: 150px;"><col><col style="width: 20%; min-width: 20%;"><col></colgroup>
            <thead class="ant-table-thead">
              <tr style="background: #FFFFFF;">
                <th><div>Segment</div></th>
                <th><div>Optimize Type</div></th>
                <th style="text-align: center;"><div>Priority</div></th>
                <th><div>Active Instances</div></th>
                <th><div>Operations</div></th>
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
                  <span :style="item.status >0 ? null: 'opacity: 0.3;'"><om-text :text="item.name"/></span>
                </td>
                <td>
                  <span :style="item.status >0 ? null: 'opacity: 0.3;'"><om-text :text="item.autoOpt"/></span>
                </td>
                <td style="text-align: center;">
                  <span :style="item.status >0 ? null: 'opacity: 0.3;' ">
                    <editable-cell v-if="canEdit" :text="item.priority || '--'" @change="change(item, 'priority', $event)" />
                    <span v-else>{{ item.priority || '--' }}</span>
                  </span>
                </td>
                <td><span :style="item.status >0 ? null: 'opacity: 0.3;'"><om-text :text="item.ruleInstanceSize"/></span></td>
                <td>
                  <div v-if="canEdit">
                    <a herf="#" @click="handleEdit(item)">Edit</a>
                    <a-divider type="vertical" />
                    <a herf="#" @click="segmentStatusUpdate(item)">{{ text===0?'Enable' : 'Disable' }}</a>
                    <span style="float:right" v-if="!item.expandStatus" @click="handleOpen(item)" ><img src="/assets/down.svg"/></span>
                    <span style="float:right" v-else @click="handleOpen(item)"><img src="/assets/up.svg"/></span>
                  </div>
                  <div v-else>
                    <a herf="#" @click="viewMediation(item)">Details</a>
                  </div>
                </td>
              </tr>
              <tr class="ant-table-expanded-row ant-table-expanded-row-level-1">
                <td colspan="5">
                  <div data-v-f372ec52="" class="ant-table-wrapper">
                    <div class="ant-spin-nested-loading">
                      <div class="ant-spin-container">
                        <div class="ant-table ant-table-scroll-position-left ant-table-default">
                          <div class="ant-table-content"><!---->
                            <div class="ant-table-body">
                              <table class="">
                                <colgroup>
                                  <col style="width: 10%; min-width: 10%;">
                                  <col style="width: 25%; min-width: 25%;">
                                  <col style="width: 15%; min-width: 15%;">
                                  <col style="width: 20%; min-width: 20%;">
                                  <col>
                                </colgroup>
                                <thead class="ant-table-thead">
                                  <tr>
                                    <th key="0" class="">
                                      <div></div>
                                    </th>
                                    <th key="className" class="">
                                      <div>Ad Network</div>
                                    </th>
                                    <th key="instanceName" class="">
                                      <div>Instance</div>
                                    </th>
                                    <th key="priority" class="ant-table-align-center" style="text-align: center;">
                                      <div>Priority</div>
                                    </th>
                                    <th key="operation" class="">
                                      <div>Operations</div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody class="ant-table-tbody">
                                  <tr class="ant-table-row ant-table-row-level-0" data-row-key="159">
                                    <td><span
                                      class="ant-table-row-indent indent-level-0"
                                      style="padding-left: 0px;"></span><!----></td>
                                    <td><span data-v-f372ec52=""><div
                                      data-v-154ef414=""
                                      data-v-f372ec52=""
                                      id="3"><img
                                        data-v-154ef414=""
                                        src="/logo/Facebook.svg"></div></span>
                                    </td>
                                    <td><span data-v-f372ec52=""><span data-v-f372ec52=""> tttttt </span></span>
                                    </td>
                                    <td style="text-align: center;"><span data-v-f372ec52=""><span
                                      data-v-f372ec52=""> 1 </span></span></td>
                                    <td><span data-v-f372ec52=""><div data-v-f372ec52=""><a
                                      data-v-f372ec52=""
                                      herf="#">Disable</a></div></span>
                                    </td>
                                  </tr>
                                  <tr class="ant-table-row ant-table-row-level-0" data-row-key="156">
                                    <td><span
                                      class="ant-table-row-indent indent-level-0"
                                      style="padding-left: 0px;"></span><!----></td>
                                    <td><span data-v-f372ec52=""><div
                                      data-v-154ef414=""
                                      data-v-f372ec52=""
                                      id="2"><img
                                        data-v-154ef414=""
                                        src="/logo/AdMob.svg"></div></span>
                                    </td>
                                    <td><span data-v-f372ec52=""><span data-v-f372ec52=""> update </span></span>
                                    </td>
                                    <td style="text-align: center;"><span data-v-f372ec52=""><span
                                      data-v-f372ec52=""> 2 </span></span></td>
                                    <td><span data-v-f372ec52=""><div data-v-f372ec52=""><a
                                      data-v-f372ec52=""
                                      herf="#">Disable</a></div></span>
                                    </td>
                                  </tr>
                                  <tr class="ant-table-row ant-table-row-level-0" data-row-key="158">
                                    <td><span
                                      class="ant-table-row-indent indent-level-0"
                                      style="padding-left: 0px;"></span><!----></td>
                                    <td><span data-v-f372ec52=""><div
                                      data-v-154ef414=""
                                      data-v-f372ec52=""
                                      id="3"><img
                                        data-v-154ef414=""
                                        src="/logo/Facebook.svg"></div></span>
                                    </td>
                                    <td><span data-v-f372ec52=""><span data-v-f372ec52=""> 119inst </span></span>
                                    </td>
                                    <td style="text-align: center;"><span data-v-f372ec52=""><span
                                      data-v-f372ec52=""> 3 </span></span></td>
                                    <td><span data-v-f372ec52=""><div data-v-f372ec52=""><a
                                      data-v-f372ec52=""
                                      herf="#">Disable</a></div></span>
                                    </td>
                                  </tr>
                                  <tr class="ant-table-row ant-table-row-level-0" data-row-key="160">
                                    <td><span
                                      class="ant-table-row-indent indent-level-0"
                                      style="padding-left: 0px;"></span><!----></td>
                                    <td><span data-v-f372ec52=""><div
                                      data-v-154ef414=""
                                      data-v-f372ec52=""
                                      id="3"><img
                                        data-v-154ef414=""
                                        src="/logo/Facebook.svg"></div></span>
                                    </td>
                                    <td><span data-v-f372ec52=""><span data-v-f372ec52=""> t2 </span></span></td>
                                    <td style="text-align: center;"><span data-v-f372ec52=""><span
                                      data-v-f372ec52=""> 4 </span></span></td>
                                    <td><span data-v-f372ec52=""><div data-v-f372ec52=""><a
                                      data-v-f372ec52=""
                                      herf="#">Disable</a></div></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
  name: 'SegmentTable',
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
    return {
      list: this.data,
      dragging: false,
      canEdit: this.$auth('mediation.edit')
    }
  },
  watch: {
    data (val) {
      this.list = val
    }
  },
  methods: {
    sortEnd () {
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
</style>
