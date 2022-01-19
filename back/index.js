const path = require('path')
const App = require('./src/app.js')

const PORT = process.env.PORT || 3600
const publicPath = path.join(__dirname, process.env.PUBLIC_PATH || 'public')

const app = App({
  logger: true, publicPath
})

app.listen(PORT, '0.0.0.0', err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
