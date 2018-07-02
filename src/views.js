const Router = require('koa-router')
const getSolde = require('./services/getSolde')

const router = new Router()

const render = async (ctx) => {
  const balance = await getSolde()

  // TODO: from database
  ctx.state = {
    ...ctx.state,
    balance: balance.data,
    wantedBalance: 500,
    wages: [
      { name: 'delphine', value: 2200 },
      { name: 'fabien', value: 2500 },
    ],
    rent: 361,
  }

  await ctx.render('index')
}

router.get('/', render)
router.post('/', async (ctx) => {
  // TODO: to database
  // ctx.request.body

  // TODO: service
  ctx.state = {
    contributions: [
      { name: 'fabien', value: (Math.random() * 150).toFixed(2) },
      { name: 'delphine', value: (Math.random() * 150).toFixed(2) },
    ]
  }

  await render(ctx)
})

module.exports = router
