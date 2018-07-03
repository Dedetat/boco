const path = require('path')
const PouchDB = require('pouchdb')

const DB_PATH = process.env.DB_PATH

if (!DB_PATH) {
  console.trace('DB_PATH environment variable has to be set')
  process.exit(-1)
}

// singleton
let _db
const getDb = () => {
  if (!_db) _db = new PouchDB(path.resolve(DB_PATH, 'db'), { revs_limit: 1 })
  return _db
}

const get = async (id) => {
  let data = {}

  try {
    data = await getDb().get(id)
  } catch (e) {
    if (e.status !== 404) throw e
  }

  return data
}

const put = id => async (data) => {
  // get previous _rev (if exists)
  const { _rev } = await get(id)

  // save new object with _rev from previous
  await getDb().put({
    ...data,
    _rev,
    _id: id,
  })
}

module.exports = {
  get,
  put,
}
