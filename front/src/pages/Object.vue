<template lang='pug'>
q-page.q-pa-xl.column
  FileHandler(:id='id')
</template>

<script>
import FileHandler from 'components/FileHandler'
export default {
  name: 'Object',
  props: {
    id: {
      type: String,
      default: '1'
    }
  },
  components: { FileHandler }
}
</script>
