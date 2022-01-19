<template lang='pug'>
q-file(
  outlined
  v-model='value'
  ref='filepicker'
  :multiple='multiple'
  :append='multiple'
  :display-value='displayValue'
  accept='.jpg, .pdf, .docx, .doc, .xlsx, .xls, image/*'
  max-file-size='2097152'
  max-total-size='12582912'
  max-files='6'
  @rejected='handleReject'
  )
  template(#append)
    q-icon.cursor-pointer(name='attach_file' @click='handlePick')
  template(#after)
    q-btn(
      round
      flat
      :disable='!value'
      @click='handleUpload'
      icon='upload'
      )
      q-tooltip(v-if='value') {{ tooltip }}
</template>

<script>
export default {
  name: 'FilePicker',
  props: {
    id: {
      type: String,
      default: '1'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: null
    }
  },
  watch: {
    multiple () {
      this.value = null
    },
    id () {
      this.value = null
    }
  },
  computed: {
    displayValue () {
      if (!this.value) return ''
      if (this.value?.length) return this.value.map(el => el.name).join('; ')
      return this.value.name
    },
    tooltip () {
      if (this.multiple) return 'Нажмите для загрузки выбранных файлов на сервер'
      return 'Нажмите для загрузки выбранного файла на сервер'
    }
  },
  methods: {
    handleReject () {
      this.$q.notify({
        message: 'Нарушены ограничения при попытке добавить файл',
        color: 'error'
      })
    },
    handlePick () {
      this.$refs.filepicker.pickFiles()
    },
    async handleUpload () {
      if (!this.value || !this.id) return
      const formData = new FormData()
      if (this.value?.length) {
        for (const file of this.value) {
          console.log(file)
          formData.append('files', file)
        }
      } else {
        formData.append('file', this.value)
      }
      try {
        this.$q.loading.show()
        await fetch(`/api/upload/${this.id}`, {
          method: 'POST',
          body: formData
        }).then(responce => {
          if (responce.status >= 200 && responce.status < 300) return responce
          const error = new Error(responce.statusText)
          error.responce = responce
          throw error
        })
        this.value = null
        this.$emit('update')
      } catch (e) {
        this.$q.notify({
          message: 'Произошла ошибка при попытке загрузить файл(ы) на сервер',
          caption: e.message,
          color: 'error'
        })
      } finally {
        this.$q.loading.hide()
        this.$emit('update-files')
      }
    }
  },
  created () {},
  mounted () {},
  components: {}
}
</script>

<style lang='scss' scoped>
</style>
