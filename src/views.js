const Router = require('koa-router')
const getBalance = require('./services/getBalance')
const getContributions = require('./services/getContributions')
const configuration = require('./services/configuration')

const router = new Router()

const render = async (ctx) => {
  const config = await configuration.get()

  ctx.state = {
    ...config,
    ...ctx.state,
  }

  await ctx.render('index')
}

router.get('/', async (ctx) => {
  ctx.state = {
    balance: (await getBalance()).data
  }

  await render(ctx)
})

router.post('/', async (ctx) => {
  const { body } = ctx.request

  const config = {
    wages: [
      { name: 'delphine', value: +body['wage-delphine'] },
      { name: 'fabien', value: +body['wage-fabien'] },
    ],
    rent: +body['rent'],
    monthly: body['monthly'] === 'on',
    balance: (await getBalance()).data,
    wantedBalance: +body['wanted-balance'],
  }
  await configuration.put(config)

  ctx.state = {
    contributions: getContributions(config),
  }

  await render(ctx)
})

module.exports = router
