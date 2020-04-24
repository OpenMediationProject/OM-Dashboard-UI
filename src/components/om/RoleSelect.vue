<template>
  <a-form-item>
    <a-select
      v-if="this.value"
      style="width:260px;"
      placeholder="Role"
      size="default"
      allowClear
      :showArrow="false"
      @change="change"
      v-decorator="[name, {initialValue: value}]">
      <a-select-option v-for="role in data" :key="role.id" :title="role.name">
        <ellipsis :length="25" tooltip>{{ role.name }}</ellipsis>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      style="width:260px;"
      placeholder="Role"
      size="default"
      @change="change"
      allowClear
      :showArrow="false"
      v-decorator="[name]">
      <a-select-option v-for="role in data" :key="role.id" :title="role.name">
        <ellipsis :length="25" tooltip>{{ role.name }}</ellipsis>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '@/components'
import { userRoleSelectList } from '@/api/usermanage'

export default {
  name: 'OmRoleSelect',
  components: {
    Ellipsis
  },
  data () {
    return {
      data: []
    }
  },
  props: {
    name: {
      type: String,
      default: 'roleId'
    },
    value: {
      type: Number,
      default: null
    }
  },
  methods: {
    change (v) {
      this.$emit('change', v)
    }
  },
  created () {
    userRoleSelectList().then(res => {
      if (res.code === 0) {
        this.data = res.data
      }
    })
  }
}
</script>

<style type="less" scoped>
</style>
