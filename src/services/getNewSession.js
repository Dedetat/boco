/* eslint-disable global-require */
const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const { parse, CookieJar } = require('tough-cookie')
const getHeaders = require('./getHeaders')

const FORTUNEO_LOGIN = process.env.FORTUNEO_LOGIN
const FORTUNEO_PASSWORD = process.env.FORTUNEO_PASSWORD

if (FORTUNEO_LOGIN === undefined || FORTUNEO_PASSWORD === undefined) {
  console.error("Both FORTUNEO_LOGIN and FORTUNEO_PASSWORD environment variables should be set")
  process.exit(-1)
}

const getRawCookies = response => response.headers
  .get('set-cookie')
  .split(',')
  .map(cookie => parse(cookie))
  .filter(Boolean)

const addToJar = cookieJar => response => {
  getRawCookies(response).forEach((cookie) => {
    cookieJar.setCookieSync(cookie, 'https://mabanque.fortuneo.fr', {}) // TODO: open an issue/PR to fix the {}
  })
}

const getLoginCookies = async (cookieJar) => {
  // first load
  const load = await fetch(
    'https://mabanque.fortuneo.fr/fr/prive/default.jsp?ANav=1',
    {
      method: 'GET',
      headers: getHeaders({ cookieJar, origin: false }),
    }
  )
  addToJar(cookieJar)(load)


  // params
  const params = new URLSearchParams();
  params.append('locale', 'fr')
  params.append('fingerprint', '')
  params.append('login', FORTUNEO_LOGIN)
  params.append('passwd', FORTUNEO_PASSWORD)
  params.append('idDyn', 'false')

  const login = await fetch(
    'https://mabanque.fortuneo.fr/checkacces',
    {
      method: 'POST',
      body: params,
      headers: getHeaders({ cookieJar }),
    },
  )
  addToJar(cookieJar)(login)

  return cookieJar
}

module.exports = () => getLoginCookies(new CookieJar())
