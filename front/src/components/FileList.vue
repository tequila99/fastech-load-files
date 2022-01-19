<template lang='pug'>
div.q-pa-md
  q-chip.file__link(
    v-for='file in files'
    :key='file.uuid'
    :label='file.name'
    :ripple='false'
    clickable
    removable
    flat
    @click='handleDownload(file)'
    @remove='handleRemove(file)'
    )
</template>

<script>
import { exportFile } from 'quasar'

export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {},
  methods: {
    async handleDownload ({ uuid, name, type }) {
      try {
        this.$q.loading.show()
        const rawData = await fetch(`/api/upload/files/${uuid}`)
          .then(responce => {
            if (responce.status >= 200 && responce.status < 300) return responce
            const error = new Error(responce.statusText)
            error.responce = responce
            throw error
          })
          .then(responce => responce.blob())
        exportFile(name, rawData, { mimeType: type })
      } catch (e) {
        this.$q.notify({
          message: 'Произошла ошибка при попытке скачать файл с сервера',
          caption: e.message,
          color: 'error'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    handleRemove ({ uuid, name }) {
      this.$q.dialog({
        title: 'Подтвердите действие',
        message: `Вы действтительно хотите удалить файл ${name} ?`,
        ok: {
          label: 'Да'
        },
        cancel: {
          label: 'Нет'
        },
        persistent: true
      }).onOk(async () => {
        try {
          this.$q.loading.show()
          await fetch(`/api/upload/files/${uuid}`, { method: 'DELETE' })
            .then(responce => {
              if (responce.status >= 200 && responce.status < 300) return responce
              const error = new Error(responce.statusText)
              error.responce = responce
              throw error
            })
            .then(responce => responce.json())
          this.$q.notify({
            message: `Файл с UUID: ${uuid} успешно удален`,
            color: 'primary'
          })
        } catch (e) {
          this.$q.notify({
            message: 'Произошла ошибка при попытке удалить файл',
            caption: e.message,
            color: 'error'
          })
        } finally {
          this.$q.loading.hide()
          this.$emit('update')
        }
      })
    }
  },
  created () {},
  mounted () {},
  components: {}
}
</script>

<style lang='scss'>
.file__link {
  background-color: transparent;
  .q-chip__content {
    text-decoration: underline;
  }
  .q-focus-helper {
    opacity: 0 !important;
  }
  &:hover {
    color: blue;
  }
  &:focus {
    box-shadow: unset !important;
  }
}
</style>
