const util = require('util')
const path = require('path')
const fs = require('fs')
const { v4 } = require('uuid')
const { pipeline } = require('stream')
const pline = util.promisify(pipeline)
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, done) {
  const uploadPath = opts.uploadPath || path.resolve(__dirname, '../../upload')
  const { db } = fastify
  fastify.post('/api/upload/:id', async function (req, reply) {
    const files = await req.files()
    for await (const data of files) {
      const uuid = v4()
      const filePath = path.join(uploadPath, uuid)
      await pline(data.file, fs.createWriteStream(filePath))
      await db.add(req.params.id, { uuid, path: filePath, name: data.filename, type: data.mimetype })
    }
    return { success: true, message: 'Файлы успешно загружены' }
  })
  fastify.get('/api/upload/:id', async function (req, reply) {
    const files = db.list(req.params.id)
    return { success: true, message: `Загружен список файлов для объекта с ID ${req.params.id}`, files }
  })
  fastify.get('/api/upload/files/:uuid', async function (req, reply) {
    const file = db.get(req.params.uuid)
    reply.header('Content-Type', file.type)
    return reply.send(fs.createReadStream(file.path))
  })
  fastify.delete('/api/upload/files/:uuid', async function (req, reply) {
    await db.delete(req.params.uuid)
    return { success: true, message: `Успешно удален файл с UUID: ${req.params.uuid}` }
  })
  done()
})
