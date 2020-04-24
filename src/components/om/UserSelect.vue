<template>
  <a-form-item>
    <a-select
      v-if="this.value"
      style="width:260px;"
      placeholder="User"
      :showArrow="false"
      size="default"
      v-decorator="[name, {initialValue: value}]">
      <a-select-option v-for="user in data" :key="user.id" :title="user.email">
        <ellipsis :length="25" tooltip>{{ user.email }}</ellipsis>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      style="width:260px;"
      placeholder="User"
      size="default"
      v-decorator="[name]">
      <a-select-option v-for="user in data" :key="user.id" :title="user.email">
        <ellipsis :length="25" tooltip>{{ user.email }}</ellipsis>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '@/components'
import { userSelectList } from '@/api/usermanage'

export default {
  name: 'OmUserSelect',
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
      default: 'userId'
    },
    value: {
      type: Number,
      default: null
    },
    publisherId: {
      type: Number,
      default: null
    }
  },
  methods: {
    search () {
      userSelectList({ publisherId: this.publisherId }).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    }
  },
  watch: {
    publisherId (val) {
      this.search()
    }
  },
  created () {
    this.search()
  }
}
</script>

<style type="less" scoped>
</style>
