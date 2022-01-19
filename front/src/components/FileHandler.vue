<template lang='pug'>
.column.q-gutter-y-md
  .text-h4.text-primary Тут форма для какого-то объекта с ID {{ id }}
  q-toggle(v-model='multiple' label='Включить множественный режим загрузки файлов')
  FilePicker(:id='id' :multiple='multiple' @update='handleLoad(id)')
  FileList(:files='files' @update='handleLoad(id)')
</template>

<script>
import FilePicker from './FilePicker'
import FileList from './FileList'
export default {
  name: 'FileHandler',
  props: {
    id: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      files: [],
      multiple: false

    }
  },
  watch: {
    id: {
      handler (id) {
        this.handleLoad(id)
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    handleLoad (id) {
      this.$nextTick(async () => {
        try {
          this.$q.loading.show()
          const { files } = await fetch(`/api/upload/${id}`)
            .then(responce => {
              if (responce.status >= 200 && responce.status < 300) return responce
              const error = new Error(responce.statusText)
              error.responce = responce
              throw error
            })
            .then(responce => responce.json())
          this.files = files
        } catch (e) {
          this.$q.notify({
            message: 'Произошла ошибка при попытке загрузить список файлов по объекту',
            caption: e.message,
            color: 'error'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    }
  },
  components: { FilePicker, FileList }
}
</script>
