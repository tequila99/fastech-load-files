<template lang='pug'>
q-drawer(
  :model-value='modelValue'
  show-if-above
  bordered
  @input='$emit("input", false)'
)
  q-list.text-grey-7(separator)
    q-item-label(header) Основное меню
    q-item(clickable to='/object/1')
      q-item-section(avatar)
        q-icon(name='apartment')
      q-item-section Первый тестовый объект
    q-item(clickable to='/object/2')
      q-item-section(avatar)
        q-icon(name='villa')
      q-item-section Второй тестовый объект
    q-item(clickable to='/object/3')
      q-item-section(avatar)
        q-icon(name='gite')
      q-item-section Третий тестовый объект
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  }
}
</script>
