import type  { VercelRequest, VercelResponse } from  '@vercel/node';
import chromium from 'chrome-aws-lambda'
import isURL from 'is-url'

type Extension =  'png' | 'jpeg' | 'webp'

const screenShot = async (
  embedUrl: string, 
  type: Extension
) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    defaultViewport: chromium.defaultViewport
  })
  try {
    const page = await browser.newPage()
    await page.goto(embedUrl, { waitUntil: 'domcontentloaded'})
    return await page.screenshot({ type })
  } finally {
    browser.close()
  }
}

const isValidBandCampURL = (url: string): url is string => isURL(url)

const isValidImageType = (type: string): type is Extension => (type === 'png' || type === 'jpg' || type === 'webp')

const buildEmbedURL = (albumURL: string): string => {
  const embedURL = new URL("player", "https://w.bandcamp.com")
  embedURL.searchParams.set("url", albumURL)
  embedURL.searchParams.set("show_artwork", "true")
  return embedURL.toString()
};

const api = async (req: VercelRequest, res: VercelResponse) => {
  const { url: albumURL, type: imageType = 'png' } = req.query

  if (typeof albumURL !== 'string' || !isValidBandCampURL(albumURL)) {
    return res.status(400).write('Invalid album url')
  }
  if (typeof imageType !== 'string' || !isValidImageType(imageType)) {
    return res.status(400).write('Invalid image type')
  }

  const embedURL = buildEmbedURL(albumURL) 

  try {
    const image = await screenShot(embedURL, imageType)

    res.setHeader("X-Robots-Tag", "noindex");
    res.setHeader("Link", `<${embedURL}>; rel="canonical"`);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=86400, public, stale-while-revalidate");
    res.send(image);
  } catch {
    return res.status(500)
  }
};

export default api