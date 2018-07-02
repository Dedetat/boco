/* eslint-disable global-require */
const Koa = require('koa')
const getSolde = require('./services/getSolde')

const PORT = process.env.PORT || 3000
const LISTEN_HOST = process.env.LISTEN_HOST || '0.0.0.0'

const app = new Koa()

app.use(async (ctx) => {
  try {
    ctx.body = await getSolde()
  } catch (e) {
    console.trace(e)

    const { code, payload } = e
    ctx.status = 500
    ctx.body = { errors: [ { code, payload } ] }
  }
})

const server = app.listen(PORT, LISTEN_HOST, () => {
  console.log(`Listening to ${LISTEN_HOST}:${PORT}`)
})

const interrupt = sigName => () => {
  console.info(`caught interrupt signal -${sigName}-`)

  console.info('closing HTTP socket...')
  server.close(() => {
    process.exit(0)
  })
}

['SIGUSR1', 'SIGINT', 'SIGTERM', 'SIGPIPE', 'SIGHUP', 'SIGBREAK', 'SIGWINCH'].forEach((sigName) => {
  process.on(sigName, interrupt(sigName))
})
