<!-- Organization select component the props value is the default checked  -->
<template>
  <a-form-item>
    <a-select
      v-if="this.value"
      placeholder="Organization"
      size="default"
      :showArrow="false"
      v-decorator="[name, {initialValue: value, rules: [{ required: true, message: 'Organization can not be empty.'}] }]">
      <a-select-option v-for="org in pubList" :key="org.id" :title="org.name">
        <ellipsis :length="25" tooltip>{{ org.name }}</ellipsis>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      placeholder="Organization"
      size="default"
      :showArrow="false"
      v-decorator="[name, {rules: [{ required: true, message: 'Organization can not be empty.'}] }]">
      <a-select-option v-for="org in pubList" :key="org.id" :title="org.name">
        <ellipsis :length="25" tooltip>{{ org.name }}</ellipsis>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '@/components'
import { orgList } from '../../api/usermanage'

export default {
  name: 'OmOrgSelect',
  components: {
    Ellipsis
  },
  created () {
    this.updateSelectList()
  },
  data () {
    return {
      pubList: []
    }
  },
  props: {
    name: {
      type: String,
      default: 'orgId'
    },
    value: {
      type: Number,
      default: null
    }
  },
  methods: {
    updateSelectList () {
      const that = this
      orgList({ userId: this.$store.state.user.info.id })
        .then(res => {
          if (res.code === 0 && res.data.length) {
            that.pubList = res.data
          }
        })
    }
  }
}
</script>

<style type="less" scoped>
</style>
