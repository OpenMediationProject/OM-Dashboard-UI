<template>
  <a-modal
    width="658px"
    :visible="show"
    :closable="true"
    :bodyStyle="{padding: 8}"
    :footer="null"
    :centered="true"
    @cancel="()=>{
      show = false
      $emit('change', false)
    }">
    <span slot="closeIcon">
      <img src="/menu/close.svg" />
    </span>
    <div>
      <div style="colo:#333333;font-size: 20px;margin-top: -8px">Export to CSV</div>
      <OmDatePicker :form="form" @change="(v)=>this.csvdate=v" style="padding-top: 32px;"/>
      <div style="display: inline-flex;position: relative;width: 100%;">
        <div style="width: 280px;margin-right:8px;height: 232px;background-color: #F2FBFF;padding:8px 16px;color: #333333; font-weight: bold;font-size: 16px;">
          Breakdown <a-checkbox style="padding-left: 16px;" :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">All</a-checkbox>
          <span style="font-size: 12px;color:#BDBDBD;float: right;font-weight: normal;padding-top: 4px;">{{ checkedListB.length }} selected</span>
          <img src="/icon/green-line.svg" style="position: relative;top: -4px;" />
          <a-checkbox-group v-model="checkedListB" style="line-height: 2.2;margin-top: 8px;" @change="onChange">
            <a-checkbox value="day">
              Day
            </a-checkbox><br>
            <a-checkbox value="pubAppId">
              App
            </a-checkbox><br>
            <!--            <a-checkbox value="plat">-->
            <!--              Platform-->
            <!--            </a-checkbox><br>-->
            <a-checkbox value="country">
              Regions
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <div style="width: 320px;height: 232px;background-color: #F2FBF4;padding:8px 16px;color: #333333; font-weight: bold;font-size: 16px;">
          Metrics <a-checkbox :indeterminate="indeterminateM" :checked="checkAllM" @change="onCheckAllChangeM">All</a-checkbox>
          <span style="font-size: 12px;color:#BDBDBD;float: right;font-weight: normal;padding-top: 4px;">{{ checkedListM.length }} selected</span>
          <img src="/icon/blue-line.svg" style="position: relative;top: -4px;" />
          <a-checkbox-group v-model="checkedListM" style="width: 100%;line-height: 2.2;margin-top: 8px;" @change="onChangeM">
            <a-row>
              <a-col :span="12">
                <a-checkbox value="cost">
                  Revenue
                </a-checkbox>
              </a-col>
              <a-col :span="12">
                <a-checkbox value="dau">
                  DAU
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-checkbox value="ecpm">
                  eCPM
                </a-checkbox>
              </a-col>
              <a-col :span="12">
                <a-checkbox value="arpDau">
                  ARPDAU
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-checkbox value="fillRate">
                  Fill Rate
                </a-checkbox>
              </a-col>
              <a-col :span="12">
                <a-checkbox value="deu">
                  DEU
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-checkbox value="mediationImpr">
                  Impressions
                </a-checkbox>
              </a-col>
              <a-col :span="12">
                <a-checkbox value="arpDeu">
                  ARPDEU
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
              </a-col>
              <a-col :span="12">
                <a-checkbox value="engagement">
                  Engagement
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
      <div style="padding-top:24px;width: 100%;text-align: right;">
        <a-button
          type="primary"
          @click="()=>{
            show=false
            $emit('change', false)
          }"
          ghost>Cancel</a-button>
        <a-button type="primary" style="margin-left: 40px;" @click="downloadCSV" :disabled="!checkedListM.length" :loading="loading">Download</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import OmDatePicker from './OmDatePicker'
import { getReportList } from '@/api/report'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import AddApp from '@/views/guidance/AddApp'
import Apps from '@/views/publisher/Apps'

numerify.register('currency', numerifyCurrency)

export default {
  name: 'CsvModal',
  components: {
    AddApp,
    Apps,
    OmDatePicker
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: this.visible,
      loading: false,
      csvdate: [],
      fieldsMap: {
        'day': 'Day',
        'pubAppName': 'App Name',
        'country': 'Region',
        'plat': 'Platform',
        'cost': 'Revenue',
        'dau': 'DAU',
        'ecpm': 'eCPM',
        'arpDau': 'ARPDAU',
        'fillRate': 'Fill Rate',
        'deu': 'DEU',
        'mediationImpr': 'Impressions',
        'arpDeu': 'ARPDEU',
        'engagement': 'Engagement'
      },
      mOptions: ['cost', 'dau', 'ecpm', 'arpDau', 'fillRate', 'deu', 'mediationImpr', 'arpDeu', 'engagement'],
      bOptions: ['day', 'pubAppId', 'country'],
      checkedListB: [],
      checkedListM: [],
      indeterminate: false,
      indeterminateM: false,
      checkAll: false,
      checkAllM: false,
      data: [],
      columns: []
    }
  },
  watch: {
    visible (v) {
      this.show = v
    }
  },
  created () {
  },
  methods: {
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.bOptions.length
      this.checkAll = checkedList.length === this.bOptions.length
    },
    onChangeM (checkedList) {
      this.indeterminateM = !!checkedList.length && checkedList.length < this.mOptions.length
      this.checkAllM = checkedList.length === this.mOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedListB: e.target.checked ? this.bOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onCheckAllChangeM (e) {
      Object.assign(this, {
        checkedListM: e.target.checked ? this.mOptions : [],
        indeterminate: false,
        checkAllM: e.target.checked
      })
    },
    downloadCSV () {
      const ps = {}
      ps.dateBegin = this.csvdate[0].format('YYYY-MM-DD')
      ps.dateEnd = this.csvdate[1].format('YYYY-MM-DD')
      ps.type = ['lr', 'api', 'dau']
      ps.dimension = this.checkedListB
      this.loading = true
      const _this = this
      getReportList(ps).then(res => {
        _this.data = res.data.map(row => {
          row.dau = row.dau || 0
          row.deu = row.deu || 0
          row.mediationImpr = row.mediationImpr || 0
          row.request = row.waterfallRequest
          row.filled = row.waterfallFilled
          row.revenue = row.cost || 0
          row.fillRate = row.ecpm = row.arpDau = row.arpDeu = row.engagement = 0
          if (row.request > 0) {
            row.fillRate = row.filled / row.request
          }
          if (row.impr > 0) {
            row.ecpm = row.revenue * 1000 / row.impr
          }
          if (row.dau > 0) {
            row.arpDau = row.cost / row.dau
            row.engagement = row.deu / row.dau
          }
          if (row.deu > 0) {
            row.arpDeu = row.cost / row.deu
          }
          return row
        })
        this.columns = []
        if (_this.checkedListB.length) {
          _this.checkedListB.forEach(r => {
            if (r === 'pubAppId') {
              r = 'pubAppName'
            }
            this.columns.push({
              field: r,
              title: this.fieldsMap[r]
            })
          })
        }
        if (_this.checkedListM.length) {
          _this.checkedListM.forEach(r => {
            this.columns.push({
              field: r,
              title: this.fieldsMap[r]
            })
          })
        }
        const header = this.columns.map(col => col.title).join(',')
        let data = [...this.data]
        data = data.map(row => {
          return this.columns.map(col => {
            return row[col.field]
          }).join(',')
        }).join('\n')
        const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), header + '\n' + data], { type: 'text/csv;charset=UTF-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'download.csv'
        link.click()
        URL.revokeObjectURL(link.href)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
