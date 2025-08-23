// Guardian API utility functions
export async function fetchGuardianArticles(fromDate, toDate) {
  const apiKey = process.env.GUARDIAN_API_KEY
  
  if (!apiKey) {
    throw new Error('Guardian API key not found')
  }
  
  // Format dates for Guardian API (YYYY-MM-DD)
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }
  
  const params = new URLSearchParams({
    'api-key': apiKey,
    'from-date': formatDate(fromDate),
    'to-date': formatDate(toDate),
    'show-fields': 'bodyText,headline,thumbnail',
    'page-size': '50', // Maximum allowed by Guardian API
    'order-by': 'newest'
  })
  
  let allArticles = []
  let currentPage = 1
  let totalPages = 1
  
  try {
    // Fetch all pages
    while (currentPage <= totalPages) {
      params.set('page', currentPage.toString())
      
      const response = await fetch(`https://content.guardianapis.com/search?${params}`)
      
      if (!response.ok) {
        throw new Error(`Guardian API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.response.status !== 'ok') {
        throw new Error(`Guardian API response error: ${data.response.message}`)
      }
      
      allArticles.push(...data.response.results)
      totalPages = data.response.pages
      currentPage++
      
      // Add a small delay to be respectful to the API
      if (currentPage <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return {
      success: true,
      articles: allArticles,
      total: allArticles.length
    }
    
  } catch (error) {
    console.error('Error fetching Guardian articles:', error)
    return {
      success: false,
      error: error.message,
      articles: [],
      total: 0
    }
  }
}

// Get article details by Guardian ID
export async function getGuardianArticleById(articleId) {
  const apiKey = process.env.GUARDIAN_API_KEY
  
  if (!apiKey) {
    throw new Error('Guardian API key not found')
  }
  
  const params = new URLSearchParams({
    'api-key': apiKey,
    'show-fields': 'bodyText,headline,thumbnail'
  })
  
  try {
    const response = await fetch(`https://content.guardianapis.com/${articleId}?${params}`)
    
    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.response.status !== 'ok') {
      throw new Error(`Guardian API response error: ${data.response.message}`)
    }
    
    return {
      success: true,
      article: data.response.content
    }
    
  } catch (error) {
    console.error('Error fetching Guardian article:', error)
    return {
      success: false,
      error: error.message,
      article: null
    }
  }
}

// Validate date range
export function validateDateRange(fromDate, toDate) {
  const from = new Date(fromDate)
  const to = new Date(toDate)
  const today = new Date()
  
  // Set today to end of day for comparison
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  
  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return { valid: false, error: 'Invalid date format' }
  }
  
  if (from > to) {
    return { valid: false, error: 'From date must be before to date' }
  }
  
  // Allow today's date - only reject if to date is after today
  if (to > endOfToday) {
    return { valid: false, error: 'To date cannot be in the future' }
  }
  
  // Guardian API has a limit on how far back you can go
  const earliestDate = new Date('1999-01-01')
  if (from < earliestDate) {
    return { valid: false, error: 'From date cannot be earlier than 1999-01-01' }
  }
  
  return { valid: true }
}