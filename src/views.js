const Router = require('koa-router')
const getSolde = require('./services/getSolde')
const getContributions = require('./services/getContributions')

const router = new Router()

const render = async (ctx) => {
  const balance = ctx.state.balance || (await getSolde()).data

  // TODO: from database
  ctx.state = {
    balance: balance.data,
    wantedBalance: 500,
    wages: [
      { name: 'delphine', value: 90 },
      { name: 'fabien', value: 100 },
    ],
    rent: 361,
    ...ctx.state,
  }

  await ctx.render('index')
}

router.get('/', render)
router.post('/', async (ctx) => {
  const { body } = ctx.request

  // TODO: save to database
  const configuration = {
    wages: [
      { name: 'delphine', value: +body['wage-delphine'] },
      { name: 'fabien', value: +body['wage-fabien'] },
    ],
    rent: +body['rent'],
    monthly: body['monthly'] === 'on',
    balance: (await getSolde()).data,
    wantedBalance: +body['wanted-balance'],
  }

  ctx.state = {
    ...configuration,
    contributions: getContributions(configuration),
  }

  await render(ctx)
})

module.exports = router
