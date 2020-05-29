<template>
  <div class="user-wrapper" >
    <div class="content-box" style="text-align:right">
      <span @click="click" class="">
        <a href="#" style="width:64px; height:64px;">
          <a-avatar class="avatar" size="small" src="/icon/User.svg"/>
        </a>
      </span>
    </div>
    <a-select
      style="width:264px;opacity: 0;z-index:0;display:none;"
      class="select-org"
      :dropdownMatchSelectWidth="false"
      size="default"
      :showArrow="false"
      @dropdownVisibleChange="dropdownVisibleChange"
      v-model="value"
      :open="open"
      @select="select"
      dropdownClassName="um-dropdown-class">
      <div
        slot="dropdownRender"
        :style="{left:left}"
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
        <div style="height:32px;"><a @click="settings" style="padding-right:8px;padding-bottom:16px;position: absolute;left: 10px;"> {{ userInfo.email }}</a><a @click="handleLogout" style="padding-right:8px;padding-bottom:16px;position: absolute;right: 0px;font-size: 16px;"><a-icon :component="logout" /> </a></div>
      </div>
      <a-select-option style="height: 56px;" v-for="org in tempOption" :key="org.id" :title="org.name">
        <div class="selected-app">
          <img style="width:32px;height:32px;" src="/icon/org.svg">
          <div class="info-title">
            <div>
              <ellipsis :length="25">{{ org.name }}</ellipsis>
            </div>
            <div style="color:#999999;font-size: 10px;margin-top: 4px;">
              <ellipsis :length="28">{{ org.roleName }}</ellipsis>
            </div>
          </div>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Ellipsis } from '@/components'
import { orgSelectList, switchPublisher } from '../../api/usermanage'
import logout from '../../../public/icon/logout.svg'

export default {
  name: 'UserMenu',
  components: {
    Ellipsis,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo', 'updateList'])
  },
  watch: {
    updateList (curVal) {
      if (curVal) {
        this.updateSelectList()
      }
    }
  },
  created () {
    this.updateSelectList()
  },
  data () {
    return {
      pubList: [],
      value: null,
      open: false,
      logout,
      tempOption: {},
      left: window.innerWidth - 16,
      lock: false,
      hasPrem: this.$auth('usermanage.query')
    }
  },
  methods: {
    click () {
      this.open = true
    },
    ...mapActions(['Logout', 'GetInfo']),
    handleLogout () {
      this.$confirm({
        title: 'Tips',
        content: 'Do you really want to log out ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: 'error',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    setUserInfo () {
      this.GetInfo().then(res => {
        const result = res.data
        if (result.perms && result.perms.length > 0) {
          const pmap = {}
          const perms = {}
          result.perms.forEach(m => {
            pmap[m.pid] || (pmap[m.pid] = [])
            pmap[m.pid].push(m)
            if (m.type === 'perm' || m.type === 'menu') {
              perms[m.name] = m
            }
          })
          Object.values(perms).forEach(m => {
            const children = pmap[m.id]
            if (children) {
              m.actions = children.filter(item => item.type === 'action').map(item => item.name)
            }
          })

          result.perms = perms
          result.roles = result.roles.map(r => r instanceof String ? r : r.name)

          this.$store.commit('SET_ROLES', { roles: result.roles, perms })
          this.$store.commit('SET_INFO', result)
        }
      })
    },
    updateSelectList () {
      const that = this
      orgSelectList({ userId: this.$store.state.user.info.id })
        .then(res => {
          if (res.code === 0 && res.data.length) {
            that.pubList = res.data
            that.tempOption = [ ...res.data ]
            that.tempOption = that.tempOption.splice(0, 20)
            this.value = res.data[0].id
            if (localStorage.getItem('currentOrgId')) {
              const localOrg = localStorage.getItem('currentOrgId')
              const row = res.data.find(item => item.id === parseInt(localOrg))
              if (row) {
                that.value = parseInt(localOrg)
                switchPublisher({ pubId: parseInt(localOrg), roleId: row.roleId }).then(res => {
                  if (res.code === 0) {
                    that.$store.commit('SET_ORG', that.value)
                    that.setUserInfo(res.data)
                    // that.$store.commit('SET_ROLES', [])
                  }
                })
                if (!that.tempOption.find(item => item.id === parseInt(localOrg))) {
                  that.tempOption.unshift(row)
                }
              } else {
                that.value = that.pubList[0].id
                switchPublisher({ pubId: that.pubList[0].id, roleId: that.pubList[0].roleId }).then(res => {
                  if (res.code === 0) {
                    this.$store.commit('SET_ORG', that.pubList[0].id)
                    that.setUserInfo(res.data)
                    // this.$store.commit('SET_ROLES', [])
                  }
                })
                if (!that.tempOption.find(item => item.id === that.value)) {
                  that.tempOption.unshift(that.pubList[0])
                }
              }
            } else {
              that.value = that.pubList[0].id
              switchPublisher({ pubId: that.pubList[0].id, roleId: that.pubList[0].roleId }).then(res => {
                if (res.code === 0) {
                  this.$store.commit('SET_ORG', that.pubList[0].id)
                  that.setUserInfo(res.data)
                  // this.$store.commit('SET_ROLES', [])
                }
              })
              if (!that.tempOption.find(item => item.id === that.value)) {
                that.tempOption.unshift(that.pubList[0])
              }
            }
          }
        })
    },
    select (v) {
      const row = this.pubList.find(item => item.id === v)
      this.dropdownVisibleChange(false)
      this.lock = false
      // this.$refs.searchinput.stateValue = ''
      switchPublisher({ pubId: v, roleId: row.roleId }).then(res => {
        if (res.code === 0) {
          this.$store.commit('SET_ORG', v)
          this.$router.push({ path: '/overview/dashboard' })
          window.location.reload()
        }
      })
    },
    settings () {
      if (this.hasPrem) {
        this.$router.push({
          path: '/um/user-manage'
        })
      }
      this.open = false
    },
    mouseDown (VNode) {
      this.lock = true
    },
    blur (VNode) {
      this.lock = false
      this.dropdownVisibleChange(false)
    },
    dropdownVisibleChange (e) {
      if (this.lock) return false
      this.open = e
    },
    inputSearch (e) {
      const v = e.target.value
      const temp = [ ...this.pubList ]
      this.pubList.forEach(element => {
        const mathStr = element.roleName + '' + element.name + '' + element.id
        if (!v) { return }
        if (mathStr.toLowerCase().indexOf(v.toLowerCase()) === -1) {
          temp.splice(temp.findIndex(o => o.id === element.id), 1)
        }
      })
      this.tempOption = temp.splice(0, 20)
      if (!v) {
        if (!this.tempOption.find(item => item.id === this.value)) {
          this.tempOption.unshift(this.pubList.find(item => item.id === this.value))
        }
      }
    }
  }
}
</script>

<style type="less" scoped>
  .ant-select {
    line-height: 1;
  }
  .select-org >>> .ant-select-selection__rendered {
    line-height: 1;
  }
  .select-org >>> .ant-select-selection-selected-value {
    float: initial;
    margin-top: 3px;
    margin-left: 5px;
  }
  .select-org >>> .ant-select-selection {
    background-color: #070100;
    border: none;
  }
  .select-org >>> .ant-select-open .ant-select-selection {
    border: none !important;
    box-shadow: none !important;
    color: #070100 !important;
  }
  .select-org >>> .ant-select-selection {
    border: none !important;
    box-shadow: none !important;
    color: #070100 !important;
  }
  .select-org >>> .ant-select-focused {
    border: none !important;
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.2) !important;
    color: #070100 !important;
    border-color: #070100 !important;
  }
  .select-org >>> .info-title {
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
  .um-dropdown-class .ant-divider {
    margin:0;
    margin-top: -4px;
    height: 1px;
  }
  .info-title {
    color:#333333;font-size: 14px;
    display: inline-block;vertical-align: middle;margin-left: 16px;
  }
</style>
