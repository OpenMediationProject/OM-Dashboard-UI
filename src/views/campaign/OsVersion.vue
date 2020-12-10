<template>
  <a-select
    :placeholder="hint"
    :filterOption="filterOption"
    v-model="initValue"
    :dropdownMatchSelectWidth="false"
    @change="handleChange">
    <a-select-option
      :disabled="(max?parseFloat(o.subVersion) > parseFloat(max): false) || (min?parseFloat(o.subVersion) < parseFloat(min): false) "
      v-for="(o, index) in list"
      :key="o.subVersion"
      :title="o.title">
      <p style="display:none;">{{ o.subVersion + '-' + o.version + '-' + o.title }}</p>
      {{ (type===1 && index===0) ? 'Latest' :o.subVersion }}
    </a-select-option>
  </a-select>
</template>

<script>
import { osVersions } from '../../api/campaign'

export default {
  name: 'OSV',
  props: {
    defaultValue: {
      type: String,
      default: undefined
    },
    plat: {
      type: Number,
      default: null
    },
    hint: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    type: {
      type: Number,
      default: 0
    }
  },
  components: {
  },
  watch: {
    defaultValue (v) {
      this.initValue = v
    },
    plat (v) {
      this.list = this.list.filter(row => { return row.plat === v })
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      list: {}
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('change', val)
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  },
  async created () {
    try {
      const res = await osVersions()
      if (this.plat !== null) {
        res.data = res.data.filter(row => {
          return row.plat === this.plat
        })
      }
      res.data = res.data.sort((a, b) => {
        if (this.type) {
          return b.id - a.id
        } else {
          return a.id - b.id
        }
      })
      this.list = res.data
      if (!this.initValue) {
        this.initValue = this.list[0].subVersion
        this.$emit('change', this.initValue)
      }
      if (this.type) {
        this.$emit('maxv', this.list[0].subVersion)
      }
    } catch (e) {
    }
  }
}
</script>

<style type="less" scoped>
</style>
