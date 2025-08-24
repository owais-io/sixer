import { getAllArticles } from '../../lib/articles'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  try {
    // Get all articles
    const articles = getAllArticles()
    
    // Count articles by section
    const sectionCounts = {}
    
    articles.forEach(article => {
      const sectionName = article.sectionName
      if (sectionName) {
        sectionCounts[sectionName] = (sectionCounts[sectionName] || 0) + 1
      }
    })
    
    // Convert to array and sort by count (descending)
    const sortedSections = Object.entries(sectionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 sections
    
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600') // 5 minutes cache
    
    return res.status(200).json({
      success: true,
      sections: sortedSections,
      totalSections: Object.keys(sectionCounts).length,
      totalArticles: articles.length
    })
    
  } catch (error) {
    console.error('Error getting top sections:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Failed to load sections',
      sections: []
    })
  }
}