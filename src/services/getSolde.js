const fetch = require('node-fetch')
const cheerio = require('cheerio')
const getNewSession = require('./getNewSession')
const getHeaders = require('./getHeaders')

const MAX_SOLDE_RETRY = process.env.MAX_SOLDE_RETRY || 5

const getSolde = async () => {
  const summary = await fetch(
    'https://mabanque.fortuneo.fr/fr/prive/mes-comptes/synthese-globale/synthese-mes-comptes.jsp',
    {
      headers: getHeaders({
        cookieJar: await getNewSession(),
        referer: 'https://mabanque.fortuneo.fr/fr/prive/default.jsp?ANav=1'
      }),
    }
  )

  const summaryHTML = await summary.text()
  const $ = cheerio.load(summaryHTML)
  const soldeStr = $('span.synthese_solde_compte').text()
  return +soldeStr.replace(/[+|EUR]/g, '').trim().replace(',', '.')
}

// with retry
module.exports = async () => {
  let solde = 0
  let retry = -1
  while (solde === 0 && retry < MAX_SOLDE_RETRY) {
    retry += 1
    solde = await getSolde()
  }

  if (retry >= MAX_SOLDE_RETRY) {
    const error = new Error('retry_exceed')
    error.payload = { max: MAX_SOLDE_RETRY }
    console.trace(error)
    throw error
  }

  return { data: solde, metadata: { retry } }
}
