<template lang='pug'>
q-layout(view='lHh Lpr lFf')
  MainHeader(@toggle='leftDrawerOpen=!leftDrawerOpen')
  MainMenu(v-model='leftDrawerOpen')
  q-page-container
    router-view
</template>

<script>
import MainMenu from './MainMenu.vue'
import MainHeader from './MainHeader.vue'
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  components: { MainMenu, MainHeader }
}
</script>
