// SEO utility functions for generating meta tags and structured data

export const DEFAULT_SEO = {
  title: 'Parho.net - Latest News & Articles',
  description: 'Stay updated with the latest news, articles, and stories from around the world on Parho.net',
  siteName: 'Parho.net',
  url: 'https://www.parho.net',
  image: 'https://www.parho.net/og-image.png',
  type: 'website'
}

// Generate page metadata for Next.js 13+ app directory
export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section
}) {
  const url = `${DEFAULT_SEO.url}${path}`
  const fullTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title
  
  const metadata = {
    title: fullTitle,
    description: description || DEFAULT_SEO.description,
    keywords: section ? [section, 'news', 'articles', 'parho.net'] : ['news', 'articles', 'latest news'],
    authors: author ? [{ name: author }] : [{ name: 'Parho.net' }],
    creator: 'Parho.net',
    publisher: 'Parho.net',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description || DEFAULT_SEO.description,
      url: url,
      siteName: DEFAULT_SEO.siteName,
      images: [
        {
          url: image || DEFAULT_SEO.image,
          width: 1200,
          height: 630,
          alt: title || DEFAULT_SEO.title,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || DEFAULT_SEO.description,
      images: [image || DEFAULT_SEO.image],
      creator: '@parho_net',
      site: '@parho_net',
    },
    alternates: {
      canonical: url,
    },
    other: {
      'google-site-verification': 'your-google-site-verification-code', // Add your verification code
    },
  }
  
  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph.publishedTime = publishedTime
    if (modifiedTime) {
      metadata.openGraph.modifiedTime = modifiedTime
    }
    if (author) {
      metadata.openGraph.authors = [author]
    }
    if (section) {
      metadata.openGraph.section = section
    }
  }
  
  return metadata
}

// Generate structured data (JSON-LD) for articles
export function generateArticleStructuredData(article) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.webTitle,
    description: article.headline || article.webTitle,
    image: article.thumbnail ? [article.thumbnail] : [DEFAULT_SEO.image],
    datePublished: article.webPublicationDate,
    dateModified: article.webPublicationDate,
    author: {
      '@type': 'Organization',
      name: 'The Guardian',
      url: 'https://www.theguardian.com'
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SEO.siteName,
      url: DEFAULT_SEO.url,
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_SEO.url}/logo.png`,
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${DEFAULT_SEO.url}/article/${article.slug}`
    },
    articleSection: article.sectionName,
    isAccessibleForFree: true,
    inLanguage: 'en-US'
  }
  
  return JSON.stringify(structuredData)
}

// Generate structured data for the homepage
export function generateHomePageStructuredData(articles) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SEO.siteName,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${DEFAULT_SEO.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          headline: article.webTitle,
          url: `${DEFAULT_SEO.url}/article/${article.slug}`,
          datePublished: article.webPublicationDate,
          image: article.thumbnail
        }
      }))
    }
  }
  
  return JSON.stringify(structuredData)
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DEFAULT_SEO.url}${item.path}`
    }))
  }
  
  return JSON.stringify(structuredData)
}

// Truncate text for meta descriptions
export function truncateText(text, maxLength = 160) {
  if (!text) return ''
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '')
  
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substr(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  return lastSpaceIndex > 0 
    ? cleanText.substr(0, lastSpaceIndex) + '...'
    : cleanText.substr(0, maxLength) + '...'
}

// Extract first paragraph or sentence for description
export function extractDescription(bodyText, maxLength = 160) {
  if (!bodyText) return ''
  
  // Remove HTML tags
  let cleanText = bodyText.replace(/<[^>]*>/g, '')
  
  // Get first paragraph or first few sentences
  const paragraphs = cleanText.split(/\n\s*\n/)
  let description = paragraphs[0] || cleanText
  
  // If first paragraph is too long, get first sentence
  if (description.length > maxLength) {
    const sentences = description.split(/[.!?]+/)
    description = sentences[0] + '.'
  }
  
  return truncateText(description, maxLength)
}