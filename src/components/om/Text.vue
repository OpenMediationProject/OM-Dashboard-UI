<template>
  <ellipsis :style="status ? null:'opacity: 0.3;'" :length="length" :tooltip="tooltip">{{ text }}</ellipsis>
</template>

<script>
import { Ellipsis } from '@/components'

export default {
  name: 'OmText',
  props: {
    length: {
      type: Number,
      default: 30
    },
    text: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: false,
      default: 1
    },
    tooltip: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Ellipsis
  }
}
</script>
