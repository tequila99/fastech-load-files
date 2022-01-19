<template lang='pug'>
q-header
  q-toolbar
    q-btn(
      flat
      dense
      round
      icon='menu'
      aria-label="Menu"
      @click='$emit("toggle")'
    )
    q-toolbar-title Пример загрузки файлов
</template>

<script>
export default {
  name: 'MainHeader'
}
</script>
