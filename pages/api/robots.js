export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /auth/

Sitemap: https://www.parho.net/sitemap.xml

# Google
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /auth/

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /auth/

# Facebook
User-agent: facebookexternalhit
Allow: /

# Twitter
User-agent: Twitterbot
Allow: /`
  
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate') // 24 hours cache
  res.status(200).send(robots)
}