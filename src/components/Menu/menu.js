import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'
import AppMenuSelect from './AppMenuSelect'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: [],
      open: false,
      subMenuVisible: false
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      // this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys) {
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      if (this.open === true) {
        return
      }
      this.open = true
      if (!openKeys.includes('/publisher')) {
        openKeys.push('/publisher')
      }
      this.openKeys = openKeys
    },
    appChange (action, empty) {
      if (empty) {
        this.subMenuVisible = false
        if (this.open) {
          this.open = false
        }
        return false
      }
      if (action === 'change' || action === 'visible') {
        this.subMenuVisible = true
        if (this.$route.path === '/app/dashboard') {
          this.selectedKeys = ['/appdashboard']
        }
      }
      if (this.open) {
        this.open = false
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }
      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },

    // render
    renderItem (menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem (menu) {
      const target = menu.meta.target || null
      const tag = target && 'a' || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children && menu.hideChildrenInMenu) {
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      if (menu.meta.title === 'Apps') {
        return (
          <Item disabled {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span><AppMenuSelect style="width: 256px;margin-left: -40px;" { ...{ on: { appChange: this.appChange } } } collapsed={this.collapsed} openSelect={this.open}></AppMenuSelect></span>
            </tag>
          </Item>
        )
      } else if (menu.meta.title === 'Ad Network Accounts') {
        return (
          <Item style="padding-top: 8px;" {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </tag>
            <img style="margin-top:-138px;margin-left:-4px;" src='/menu/menu-line.svg' />
          </Item>
        )
      } else {
        return (
          <Item {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </tag>
          </Item>
        )
      }
    },
    renderSubMenu (menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      if (menu.meta.title === 'Apps') {
        return (
          <SubMenu class={this.subMenuVisible ? 'show-sub' : 'hide-sub'} {...{ key: menu.path }}>
            <span slot="title">
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
              <img style="right: 16px;top: 14px;position: absolute;" src='/menu/right.svg' />
            </span>
            {itemArr}
          </SubMenu>
        )
      } else {
        return (
          <SubMenu class={this.subMenuVisible ? 'show-sub' : 'hide-sub'} {...{ key: menu.path }}>
            <span slot="title">
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </span>
            {itemArr}
          </SubMenu>
        )
      }
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <Icon theme='filled' {... { props } }/>
      )
    }
  },

  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }
    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
