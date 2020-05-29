<!-- Regions select component  the props defaultSelected is the default value with tree select  -->
<template>
  <a-form-item>
    <a-select
      showSearch
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      :showArrow="required"
      :allowClear="!required"
      :mode="mode"
      :disabled="!edit"
      optionLabelProp="value"
      :filterTreeNode="filterTreeNode"
      @change="onChange"
      v-decorator="[name, {initialValue: mode==='null' ? defaultSelected: [], rules: [{ required: required, message: 'Country can not be empty.'}] }]">
      <a-select-option v-for="item in data" :key="item.key">
        {{ item.title }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { mapState } from 'vuex'
import { regionList } from '@/api/mediation'

export default {
  name: 'OmRegionsSelect',
  data () {
    return {
      value: this.defaultSelected,
      data: []
    }
  },
  props: {
    defaultSelected: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: null
    },
    name: {
      type: String,
      default: 'country'
    },
    required: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'null'
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.updateRegions(this.selectedPubAppId)
  },
  computed: mapState({
    selectedPubAppId: state => state.publisher.searchApp
  }),
  watch: {
    selectedPubAppId (pubAppId) {
      this.updateRegions(pubAppId)
    },
    defaultSelected (val) {
      this.value = val
    }
  },
  methods: {
    onChange (val) {
      this.value = val
      this.$emit('change', val)
    },
    buildNode (a) {
      return { key: a.a2, title: a.a3 + ' - ' + a.name, value: a.a3, text: [a.a2, a.a3, a.name].join(' ').toLowerCase() }
    },
    updateRegions () {
      regionList()
        .then(res => {
          const { top, all } = res.data
          const list = []
          top.forEach(item => {
            list.push(this.buildNode(item))
          })
          all.forEach(item => {
            list.push(this.buildNode(item))
          })
          this.data = list
        })
    },
    filterTreeNode (input, option) {
      const text = option.componentOptions.propsData.dataRef.text
      return text && text.indexOf(input.toLowerCase()) > -1
    }
  }
}
</script>
