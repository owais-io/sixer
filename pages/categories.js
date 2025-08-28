import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles, getAllSections, getArticlesBySection } from '../lib/articles'
import { generatePageMetadata, generateHomePageStructuredData } from '../lib/seo'
import Layout from '../components/Layout'
import SearchBox from '../components/SearchBox'

export default function CategoriesPage({ 
  categoriesData, 
  totalCategories, 
  totalArticles, 
  metadata, 
  structuredData 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popularity') // 'popularity' or 'alphabetical'
  const [filteredCategories, setFilteredCategories] = useState(categoriesData)

  // Filter and sort categories based on search and sort preference
  useEffect(() => {
    let filtered = categoriesData.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.articleCount - a.articleCount)
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredCategories(filtered)
  }, [searchTerm, sortBy, categoriesData])

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.alternates.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </Head>
      
      <Layout>
        <div className="bg-white">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-purple-100">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="font-medium text-white">
                    Categories
                  </li>
                </ol>
              </nav>

              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Browse All Categories
                </h1>
                <p className="text-xl sm:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto">
                  Explore news by topic and discover stories that matter to you across {totalCategories} categories
                </p>
                
                {/* Stats */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-8">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {totalCategories}
                    </div>
                    <div className="text-purple-200 text-sm uppercase tracking-wide">
                      Categories
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {totalArticles.toLocaleString()}
                    </div>
                    <div className="text-purple-200 text-sm uppercase tracking-wide">
                      Articles
                    </div>
                  </div>
                </div>

                {/* Search and Sort Controls */}
                <div className="max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-3 pl-12 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Sort */}
                    <div className="sm:w-48">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="popularity">Most Popular</option>
                        <option value="alphabetical">A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {filteredCategories.length > 0 ? (
              <>
                {/* Results Info */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-gray-600">
                      {searchTerm ? (
                        <>Showing <span className="font-semibold">{filteredCategories.length}</span> categories matching "{searchTerm}"</>
                      ) : (
                        <>Showing all <span className="font-semibold">{filteredCategories.length}</span> categories</>
                      )}
                    </p>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCategories.map((category) => (
                    <Link 
                      key={category.name}
                      href={`/section/${category.name.toLowerCase()}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
                        {/* Category Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 group-hover:from-purple-50 group-hover:to-purple-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-3xl">
                              {category.icon}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-purple-600">
                                {category.articleCount}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Articles
                              </div>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors capitalize">
                            {category.name}
                          </h3>
                        </div>

                        {/* Category Description */}
                        <div className="px-6 py-4">
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {category.description}
                          </p>

                          {/* Recent Articles */}
                          {category.recentArticles.length > 0 && (
                            <div className="space-y-3">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Recent Articles
                              </div>
                              <div className="space-y-2">
                                {category.recentArticles.slice(0, 2).map((article) => (
                                  <div key={article.guardianId} className="text-sm">
                                    <h4 className="text-gray-900 line-clamp-2 font-medium group-hover:text-purple-600 transition-colors">
                                      {article.webTitle}
                                    </h4>
                                    <time className="text-xs text-gray-500" dateTime={article.webPublicationDate}>
                                      {format(new Date(article.webPublicationDate), 'MMM dd, yyyy')}
                                    </time>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* View All Link */}
                        <div className="px-6 py-4 bg-gray-50 group-hover:bg-purple-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                              View all articles
                            </span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              /* No Results State */
              <div className="text-center py-12">
                <div className="mb-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    No categories found
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find any categories matching "{searchTerm}". Try a different search term.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Show All Categories
                  </button>
                </div>
              </div>
            )}

            {/* Back to Home */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

// Helper function to get section descriptions
function getSectionDescription(sectionName) {
  const descriptions = {
    politics: 'Stay informed with the latest political developments, government policies, elections, and political analysis from around the world.',
    world: 'Global news coverage featuring international affairs, conflicts, diplomacy, and major events shaping our world.',
    business: 'Business news, market updates, economic trends, corporate developments, and financial insights.',
    sports: 'Complete sports coverage including live scores, match reports, player news, and analysis across all major sports.',
    technology: 'Latest technology news, innovation stories, product launches, and digital transformation insights.',
    health: 'Health and medical news covering breakthrough research, public health updates, and wellness information.',
    science: 'Scientific discoveries, research breakthroughs, and developments in various fields of science.',
    environment: 'Environmental news, climate change updates, sustainability stories, and conservation efforts.',
    culture: 'Arts, entertainment, lifestyle, and cultural stories from around the globe.',
    opinion: 'Expert analysis, editorial content, and opinion pieces on current affairs and trending topics.',
    'us news': 'Breaking news and in-depth coverage of events, politics, and issues across the United States.',
    'uk news': 'Comprehensive coverage of British news, politics, society, and current affairs.',
    'australia news': 'Latest Australian news covering politics, society, economy, and local affairs.',
    lifestyle: 'Lifestyle content covering fashion, food, travel, relationships, and personal wellbeing.',
    film: 'Movie news, reviews, celebrity interviews, and entertainment industry coverage.',
    music: 'Music news, album reviews, artist interviews, and coverage of the music industry.',
    books: 'Book reviews, author interviews, literary news, and publishing industry updates.',
    football: 'Football news, match reports, transfer updates, and analysis from leagues worldwide.',
    fashion: 'Fashion news, style trends, designer updates, and industry insights.',
    food: 'Food and dining news, recipes, restaurant reviews, and culinary trends.',
    travel: 'Travel guides, destination reviews, travel tips, and tourism industry news.',
    money: 'Personal finance advice, market analysis, investment tips, and economic news.',
    education: 'Education news, policy updates, academic research, and learning resources.',
    media: 'Media industry news, journalism updates, and analysis of news coverage.',
    law: 'Legal news, court cases, policy changes, and analysis of legal developments.',
    'global development': 'International development news, humanitarian issues, and global poverty coverage.',
    artanddesign: 'Art and design news, exhibition reviews, artist profiles, and creative industry updates.',
    stage: 'Theater news, play reviews, Broadway updates, and performing arts coverage.',
    television: 'TV news, show reviews, celebrity interviews, and television industry updates.',
    games: 'Video game news, reviews, industry updates, and gaming culture coverage.',
    crosswords: 'Crossword puzzles, word games, and puzzle-solving tips and strategies.',
    weather: 'Weather forecasts, climate news, and meteorological information.'
  }
  return descriptions[sectionName.toLowerCase()] || `Latest ${sectionName} news and updates from trusted sources around the world.`
}

// Helper function to get section icons
function getSectionIcon(sectionName) {
  const icons = {
    politics: '🏛️',
    world: '🌍',
    business: '💼',
    sports: '⚽',
    technology: '💻',
    health: '🏥',
    science: '🔬',
    environment: '🌱',
    culture: '🎭',
    opinion: '💭',
    'us news': '🇺🇸',
    'uk news': '🇬🇧',
    'australia news': '🇦🇺',
    lifestyle: '✨',
    film: '🎬',
    music: '🎵',
    books: '📚',
    football: '⚽',
    fashion: '👗',
    food: '🍽️',
    travel: '✈️',
    money: '💰',
    education: '🎓',
    media: '📺',
    law: '⚖️',
    'global development': '🌐',
    artanddesign: '🎨',
    stage: '🎭',
    television: '📺',
    games: '🎮',
    crosswords: '🧩',
    weather: '🌤️'
  }
  return icons[sectionName.toLowerCase()] || '📰'
}

export async function getStaticProps() {
  try {
    const allArticles = getAllArticles()
    const allSections = getAllSections()
    
    // Create detailed category data
    const categoriesData = allSections.map(sectionName => {
      const sectionArticles = getArticlesBySection(sectionName)
      const recentArticles = sectionArticles.slice(0, 3).map(article => ({
        guardianId: article.guardianId,
        webTitle: article.webTitle,
        webPublicationDate: article.webPublicationDate,
        slug: article.slug
      }))
      
      return {
        name: sectionName,
        description: getSectionDescription(sectionName),
        icon: getSectionIcon(sectionName),
        articleCount: sectionArticles.length,
        recentArticles: recentArticles
      }
    })

    // Sort by popularity (article count) by default
    categoriesData.sort((a, b) => b.articleCount - a.articleCount)
    
    const metadata = generatePageMetadata({
      title: 'All Categories - Browse News by Topic',
      description: `Explore news across ${allSections.length} categories. Find breaking news, analysis, and stories on politics, world news, business, sports, technology, and more.`,
      path: '/categories',
      keywords: ['news categories', 'topics', 'sections', 'browse news', ...allSections]
    })
    
    const structuredData = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "News Categories",
      "description": `Browse news by category across ${allSections.length} topics`,
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://parho.net'}/categories`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": allSections.length,
        "itemListElement": categoriesData.map((category, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "name": category.name,
            "description": category.description,
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://parho.net'}/section/${category.name.toLowerCase()}`
          }
        }))
      }
    })
    
    return {
      props: {
        categoriesData,
        totalCategories: allSections.length,
        totalArticles: allArticles.length,
        metadata,
        structuredData
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        categoriesData: [],
        totalCategories: 0,
        totalArticles: 0,
        metadata: generatePageMetadata({
          title: 'Categories',
          description: 'Browse news categories',
          path: '/categories'
        }),
        structuredData: JSON.stringify({})
      },
      revalidate: 300,
    }
  }
}