<template>
  <a-form-item>
    <a-select
      v-if="this.value"
      size="default"
      :disabled="!edit"
      @change="change"
      :showArrow="false"
      v-decorator="[name, {initialValue: value, rules: [{ required: true, message: 'Ad Network Account can not be empty.'}]}]">
      <a-select-option v-for="org in this.pubList" :key="org.id" :title="org.name">
        <ellipsis :length="25" tooltip>{{ org.name }}</ellipsis>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      size="default"
      @change="change"
      :disabled="!edit"
      :showArrow="false"
      v-decorator="[name, {rules: [{ required: true, message: 'Ad Network Account can not be empty.'}]}]">
      <a-select-option v-for="org in this.pubList" :key="org.id" :title="org.name">
        <ellipsis :length="25" tooltip>{{ org.name }}</ellipsis>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '@/components'
import { accountSelectList } from '@/api/account'

export default {
  name: 'AccountSelect',
  components: {
    Ellipsis
  },
  data () {
    return {
      pubList: []
    }
  },
  created () {
    this.updateSelectList()
    if (this.value === 0) {
      this.value = null
    }
  },
  props: {
    name: {
      type: String,
      default: 'reportAccountId'
    },
    value: {
      type: Number,
      default: null
    },
    adnId: {
      type: Number,
      default: null
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    updateSelectList () {
      const that = this
      accountSelectList({ adnId: this.adnId })
        .then(res => {
          if (res.code === 0 && res.data.length) {
            that.pubList = res.data
          }
        })
    },
    change () {
      this.$emit('change', this.record)
    }
  }
}
</script>

<style type="less" scoped>
</style>
