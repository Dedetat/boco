module.exports = ({ cookieJar, referer, origin }) => {
  const headers = {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
    'Origin': origin || 'https://mabanque.fortuneo.fr',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': referer,
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
  }

  if (cookieJar) headers['Cookie'] = cookieJar.getCookieStringSync('https://mabanque.fortuneo.fr', {}) // // TODO: open issue/PR to {}
  if (referer) headers['Referer'] = referer
  if (origin === false) delete headers['Origin']

  return headers
}
