import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { fetchGuardianArticles, validateDateRange } from '../../lib/guardian-api'
import { articleExistsByGuardianId, saveArticleAsMDX } from '../../lib/articles'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
  const { fromDate, toDate } = req.body
  
  if (!fromDate || !toDate) {
    return res.status(400).json({ 
      message: 'From date and to date are required' 
    })
  }
  
  // Validate date range
  const dateValidation = validateDateRange(fromDate, toDate)
  if (!dateValidation.valid) {
    return res.status(400).json({ 
      message: dateValidation.error 
    })
  }
  
  try {
    // Fetch articles from Guardian API
    const result = await fetchGuardianArticles(fromDate, toDate)
    
    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to fetch articles from Guardian API',
        error: result.error
      })
    }
    
    let newArticles = 0
    let duplicates = 0
    let errors = 0
    
    // Process each article
    for (const article of result.articles) {
      try {
        // Check if article already exists
        if (articleExistsByGuardianId(article.id)) {
          duplicates++
          continue
        }
        
        // Save new article
        saveArticleAsMDX(article)
        newArticles++
        
      } catch (error) {
        console.error('Error saving article:', article.id, error)
        errors++
      }
    }
    
    return res.status(200).json({
      success: true,
      stats: {
        fetched: result.total,
        new: newArticles,
        duplicates: duplicates,
        errors: errors
      },
      message: `Successfully processed ${result.total} articles. ${newArticles} new articles saved, ${duplicates} duplicates skipped.`
    })
    
  } catch (error) {
    console.error('Error in fetch-articles API:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    })
  }
}