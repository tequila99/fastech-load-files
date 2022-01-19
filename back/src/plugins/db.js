const path = require('path')
const fs = require('fs/promises')
const fp = require('fastify-plugin')
let data = {}
module.exports = fp(async function (fastify, opts, done) {
  const dbPath = opts.dbPath || path.resolve(__dirname, '../../db')
  const filePath = path.join(dbPath, 'db.json')
  const db = {
    async exist () {
      try {
        await fs.access(path.join(dbPath, 'db.json'))
        return true
      } catch (e) {
        return false
      }
    },
    async create () {
      await fs.writeFile(filePath, JSON.stringify([{ id: 1, files: [] }, { id: 2, files: [] }, { id: 3, files: [] }]), { encoding: 'utf8' })
    },
    async open () {
      data = await fs.readFile(filePath, { encoding: 'utf8' }).then(text => JSON.parse(text))
    },
    async save () {
      await fs.writeFile(filePath, JSON.stringify(data), { encoding: 'utf8' })
    },
    list (id) {
      const record = data.find(el => parseInt(el.id, 10) === parseInt(id, 10))
      if (!record) throw new Error('Не найдена запись с указанным ID объекта')
      return record.files.map(({ path, ...args }) => args) || []
    },
    async add (id, { uuid, name, path, type }) {
      const record = data.find(el => parseInt(el.id, 10) === parseInt(id, 10))
      if (!record) throw new Error('Не найдена запись с указанным ID объекта')
      record.files.push({ uuid, name, path, type })
      await db.save()
    },
    get (uuid) {
      const file = data.map(el => el.files).flat().find(el => el.uuid === uuid)
      if (!file) throw new Error('Не найден файл с указанным UUID')
      return file
    },
    async delete (uuid) {
      let filePath
      let record
      for (const el of data) {
        const file = el.files.find(fl => fl.uuid === uuid)
        if (file) {
          record = el
          filePath = file.path
          break
        }
      }
      if (!filePath) throw new Error('Не найдена запись с указанным UUID файла')
      record.files = record.files.filter(el => el.uuid !== uuid)
      await fs.unlink(filePath)
      await db.save()
    }
  }
  const exist = await db.exist()
  if (!exist) {
    await db.create()
  }
  await db.open()  
  fastify.decorate('db', db)
  done()
})
