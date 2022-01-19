const Fastify = require('fastify')

module.exports = opts => {
  const {
    logger = false,
    printRoutes = true,
    publicPath
  } = opts
  const fastify = Fastify({
    logger
  })
    .register(require('fastify-cors'))
    .register(require('fastify-multipart'), {
      limits: {
        fields: 0,
        fileSize: 2097152,
        files: 6
      }
    })
    .register(require('fastify-static'), {
      root: publicPath
    })
    .register(require('./plugins/db'))
    .register(require('./services/upload'))
    .setErrorHandler((error, request, reply) => {
      const { statusCode = 500, message } = error
      const response = { message }
      reply.status(statusCode).send(response)
    })
  fastify.ready(error => {
    if (error) console.error(error)
    if (printRoutes) console.log(fastify.printRoutes({ commonPrefix: false }))
  })
  return fastify
}
