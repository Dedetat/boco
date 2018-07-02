const Router = require('koa-router')
const getSolde = require('./services/getSolde')

const router = new Router({ prefix: '/api' })

router.get('/balance', async (ctx) => {
  try {
    ctx.body = await getSolde()
  } catch (e) {
    console.trace(e)

    const { code, payload } = e
    ctx.status = 500
    ctx.body = { errors: [ { code, payload } ] }
  }
})

module.exports = router
