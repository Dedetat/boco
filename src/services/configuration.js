const db = require('./db')

const get = async () => {
  const config = await db.get('configuration')

  // init
  if (!config.wages) {
    return {
      wages: [
        { name: 'delphine', value: 0 },
        { name: 'fabien', value: 0 },
      ],
      rent: 0,
      monthly: true,
      balance: 0,
      wantedBalance: 0,
    }
  }

  return config
}

const put = async (configuration) => {
  const old = await get()

  return db.put('configuration')({ ...old, ...configuration })
}

module.exports = {
  get,
  put
}
