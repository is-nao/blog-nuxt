import { load } from 'cheerio'
import { H3Error } from 'h3'

/**
 * @see https://nitro.unjs.io/guide/cache
 */
export default cachedEventHandler(async event => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    const error = new H3Error('invalid URL')
    error.statusCode = 400 // Bad Request
    return sendError(event, error)
  }

  try {
    const $ = await fetch(url, { method: 'GET' })
      .then(async response => await response.text())
      .then(load)

    return {
      title: $('meta[property="og:title"]').attr('content') || $('title').text(),
      image: $('meta[property="og:image"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      // favicon: await fetchFavicon(url),
    }

  } catch {
    const error = new H3Error('failed to fetch OGP data')
    error.statusCode = 500 // Internal Server Error
    return sendError(event, error)
  }
}, {
  maxAge: 3600, // 1 hour
  getKey: event => getQuery(event).url as string
})

// const fetchFavicon = async (url: string) => {
//   try {
//     const hostname = new URL(url).hostname
//     const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=14`

//     const result = await fetch(faviconUrl, { method: 'HEAD' })

//     if (!result.ok) return ''

//     return faviconUrl

//   } catch {
//     return ''
//   }
// }
