import { getArticlesForSitemap } from '../../lib/articles'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  try {
    const articles = getArticlesForSitemap()
    const baseUrl = 'https://www.parho.net'
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/admin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
${articles
  .map((article) => {
    const publishedDate = new Date(article.lastModified)
    const isRecent = (new Date() - publishedDate) < (30 * 24 * 60 * 60 * 1000) // 30 days
    
    return `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${publishedDate.toISOString()}</lastmod>
    <changefreq>${isRecent ? 'daily' : 'monthly'}</changefreq>
    <priority>${isRecent ? '0.8' : '0.6'}</priority>
  </url>`
  })
  .join('\n')}
</urlset>`
    
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate') // 24 hours cache
    res.status(200).send(sitemap)
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).json({ message: 'Error generating sitemap' })
  }
}