import { getAllArticles } from '../../lib/articles'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  try {
    const { section, page = 1, limit = 12 } = req.query
    
    if (!section) {
      return res.status(400).json({ message: 'Section parameter is required' })
    }
    
    // Get all articles and filter by section
    const allArticles = getAllArticles()
    const sectionArticles = allArticles.filter(article => 
      article.sectionName.toLowerCase() === section.toLowerCase()
    )
    
    // Calculate pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    
    // Skip featured article on first page (it's shown separately)
    const adjustedStartIndex = pageNum === 1 ? startIndex + 1 : startIndex + 1
    const adjustedEndIndex = pageNum === 1 ? endIndex + 1 : endIndex + 1
    
    // Get paginated articles
    const paginatedArticles = sectionArticles.slice(adjustedStartIndex, adjustedEndIndex)
    
    // Prepare response data (minimal fields for performance)
    const articles = paginatedArticles.map(article => ({
      guardianId: article.guardianId,
      webTitle: article.webTitle,
      sectionName: article.sectionName,
      webPublicationDate: article.webPublicationDate,
      headline: article.headline,
      thumbnail: article.thumbnail,
      slug: article.slug,
    }))
    
    // Check if there are more articles
    const hasMore = adjustedEndIndex < sectionArticles.length
    const totalPages = Math.ceil((sectionArticles.length - 1) / limitNum) // -1 for featured article
    
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600') // 5 minutes cache
    
    return res.status(200).json({
      success: true,
      articles,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalArticles: sectionArticles.length,
        articlesPerPage: limitNum,
        hasMore,
        startIndex: adjustedStartIndex,
        endIndex: adjustedEndIndex
      }
    })
    
  } catch (error) {
    console.error('Error fetching section articles:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Failed to load articles',
      articles: [],
      hasMore: false
    })
  }
}