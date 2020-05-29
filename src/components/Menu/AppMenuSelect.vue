<!-- App selection in menu-->
<template>
  <div>
    <a-select
      class="select-app"
      :dropdownMatchSelectWidth="false"
      size="large"
      :showArrow="false"
      @dropdownVisibleChange="dropdownVisibleChange"
      v-model="selected"
      :open="open"
      @select="select"
      dropdownClassName="dropdown-class">
      <div
        slot="dropdownRender"
        slot-scope="menu"
      >
        <a-input
          class="search-input"
          ref="searchinput"
          @mousedown="mouseDown"
          @blur="blur"
          @change="inputSearch"
          style="border:0px;"
        >
          <img src="/icon/appsearch.svg" slot="prefix" style="padding-right: 8px;padding-top: 10px;">
        </a-input>
        <a-divider style="padding:0px;margin:0px;" />
        <v-nodes :vnodes="menu" />
        <a-divider style="margin: 1px 0;" />
        <div style="height:32px;"><a v-if="canAddApp" @click="addApp" style="padding-right:8px;padding-bottom:16px;position: absolute;left: 10px;"> Add App</a><a @click="viewAppList" style="padding-right:8px;padding-bottom:16px;position: absolute;right: 0px;"> View All Apps</a></div>
      </div>
      <a-select-option style="margin-left:256px;height: 56px;" v-for="appInfo in tempOption" :key="appInfo.id">
        <om-app-info
          :showtip="false"
          :icon="appInfo.icon"
          :app-name="appInfo.appName"
          :app-id="appInfo.appId"
          :plat="appInfo.plat"
        />
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { appSelectList } from '@/api/publisher'
import { mapState } from 'vuex'
import OmAppInfo from '@/components/om/AppInfo'

export default {
  name: 'OmAppInfoSelect',
  components: {
    OmAppInfo,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    openSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      appList: {},
      tempOption: {},
      selected: '',
      open: this.openSelect,
      lock: false,
      value: '',
      canAddApp: this.$auth('pubapp.add')
    }
  },
  methods: {
    search () {
      var _this = this
      if (!this.currentOrgId) return
      appSelectList({ userId: this.$store.state.user.info.id })
        .then(res => {
          _this.appList = res.data
          _this.tempOption = res.data
          if (localStorage.getItem('searchApp')) {
            const localApp = localStorage.getItem('searchApp')
            if (localApp) {
              if (res.data.find(item => item.id === parseInt(localApp))) {
                _this.selected = parseInt(localApp)
                _this.$store.commit('SET_APP', _this.selected)
              } else {
                if (_this.appList.length) {
                  _this.selected = _this.appList[0].id
                  _this.$store.commit('SET_APP', _this.appList[0].id)
                }
              }
            }
          } else {
            _this.selected = _this.appList[0].id
            this.$store.commit('SET_APP', _this.appList[0].id)
          }
        })
    },
    viewAppList () {
      this.$emit('appChange', 'view')
      this.$router.push({
        name: 'PublisherApps'
      })
    },
    addApp () {
      this.$emit('appChange', 'view')
      this.$router.push({
        path: '/publisher/app/add',
        query: { type: 'Add' }
      })
    },
    select (v) {
      this.$store.commit('SET_APP', v)
      this.lock = false
      this.tempOption = [ ...this.appList ]
      this.$refs.searchinput.stateValue = ''
      this.$router.push({ path: '/app/dashboard', query: { pubAppId: v } })
      this.$emit('appChange', 'change')
    },
    mouseDown (VNode) {
      this.lock = true
    },
    blur (VNode) {
      this.lock = false
    },
    dropdownVisibleChange (e) {
      if (this.lock) return false
      let empty = false
      if (!this.tempOption || !this.tempOption.length) {
        empty = true
      }
      this.$emit('appChange', 'visible', empty)
    },
    inputSearch (e) {
      const v = e.target.value
      this.tempOption = [ ...this.appList ]
      this.appList.forEach(element => {
        const mathStr = element.appName + '' + element.appId + '' + element.id
        if (!v) { return }
        if (mathStr.toLowerCase().indexOf(v.toLowerCase()) === -1) {
          this.tempOption.splice(this.tempOption.findIndex(o => o.id === element.id), 1)
        }
      })
    }
  },
  created () {
    this.search()
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    updateList: state => state.publisher.updateList,
    currentOrgId: state => state.publisher.currentOrgId
  }),
  watch: {
    searchApp (val) {
      this.selected = val
    },
    openSelect (val) {
      this.open = val
    },
    currentOrgId (val) {
      if (val) {
        this.search()
      }
    },
    updateList (curVal) {
      if (curVal) {
        this.search()
      }
    }
  }
}
</script>

<style type="less" scoped>
  .ant-select {
    line-height: 1;
  }
  .select-app >>> .ant-select-selection__rendered {
    line-height: 1;
  }
  .select-app >>> .ant-select-selection-selected-value {
    float: initial;
    margin-top: 3px;
    margin-left: 5px;
  }
  .select-app >>> .ant-select-selection {
    background-color: #070100;
    border: none;
  }
  .select-app >>> .ant-select-open .ant-select-selection {
    border: none !important;
    box-shadow: none !important;
    color: #070100 !important;
  }
  .select-app >>> .ant-select-selection {
    border: none !important;
    box-shadow: none !important;
    color: #070100 !important;
  }
  .select-app >>> .ant-select-focused {
    border: none !important;
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.2) !important;
    color: #070100 !important;
    border-color: #070100 !important;
  }
  .select-app >>> .info-title {
    color: #FFFFFF;
  }
  .search-input >>> .ant-input {
    border: 0;
    border-radius: 2px;
    box-shadow: none;
    padding-left: 40px;
    margin-bottom: -8px;
    padding-top: 16px;
  }
  .dropdown-class .ant-divider {
    margin:0;
    margin-top: -4px;
    height: 1px;
  }
</style>
