import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles, getAllSections } from '../../lib/articles'
import { generatePageMetadata, generateHomePageStructuredData, extractDescription } from '../../lib/seo'
import Layout from '../../components/Layout'

export default function SectionPage({ 
  sectionName, 
  articles, 
  featuredArticle, 
  otherSections, 
  totalArticles,
  metadata, 
  structuredData 
}) {
  const sectionDisplayName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
  
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
          {/* Section Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-red-100">
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
                    {sectionDisplayName}
                  </li>
                </ol>
              </nav>

              {/* Section Title and Description */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  {sectionDisplayName} News
                </h1>
                <p className="text-lg sm:text-xl text-red-100 mb-6 max-w-3xl">
                  {getSectionDescription(sectionName)}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center text-red-100">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-sm">
                      {totalArticles} {totalArticles === 1 ? 'article' : 'articles'} available
                    </span>
                  </div>
                  <div className="flex items-center text-red-100">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Updated daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {articles.length > 0 ? (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <section className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <span className="w-1 h-8 bg-red-600 mr-3"></span>
                        Featured Story
                      </h2>
                    </div>
                    
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <Link href={`/article/${featuredArticle.slug}`}>
                        <div className="cursor-pointer">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Image */}
                            {featuredArticle.thumbnail && (
                              <div className="relative aspect-[5/4] lg:aspect-[4/3]">
                                <Image
                                  src={featuredArticle.thumbnail}
                                  alt={featuredArticle.webTitle}
                                  fill
                                  className="object-cover"
                                  priority
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                              </div>
                            )}
                            
                            {/* Content */}
                            <div className="p-6 sm:p-8 flex flex-col justify-center">
                              <div className="mb-4">
                                <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase rounded">
                                  Featured
                                </span>
                              </div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 hover:text-red-600 transition-colors leading-tight">
                                {featuredArticle.webTitle}
                              </h3>
                              {featuredArticle.headline && featuredArticle.headline !== featuredArticle.webTitle && (
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                  {extractDescription(featuredArticle.headline, 150)}
                                </p>
                              )}
                              <div className="flex items-center text-sm text-gray-500">
                                <time dateTime={featuredArticle.webPublicationDate}>
                                  {format(new Date(featuredArticle.webPublicationDate), 'MMM dd, yyyy • h:mm a')}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </section>
                )}

                {/* All Articles Grid */}
                <section className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <span className="w-1 h-8 bg-gray-900 mr-3"></span>
                      Latest {sectionDisplayName} Articles
                    </h2>
                    
                    {/* Sort/Filter Options */}
                    <div className="flex items-center space-x-4">
                      <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {articles.map((article) => (
                      <article key={article.guardianId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <Link href={`/article/${article.slug}`}>
                          <div className="cursor-pointer">
                            {/* Article Image */}
                            {article.thumbnail && (
                              <div className="relative aspect-[5/4]">
                                <Image
                                  src={article.thumbnail}
                                  alt={article.webTitle}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              </div>
                            )}
                            
                            {/* Article Content */}
                            <div className="p-4 sm:p-6">
                              {/* Title */}
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 line-clamp-3 hover:text-red-600 transition-colors leading-tight">
                                {article.webTitle}
                              </h3>
                              
                              {/* Description */}
                              {article.headline && article.headline !== article.webTitle && (
                                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                                  {extractDescription(article.headline, 100)}
                                </p>
                              )}
                              
                              {/* Meta */}
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <time dateTime={article.webPublicationDate}>
                                  {format(new Date(article.webPublicationDate), 'MMM dd, yyyy')}
                                </time>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {Math.ceil((article.bodyText?.length || 1000) / 1000)} min read
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                  
                  {/* Load More / Pagination */}
                  {articles.length >= 12 && (
                    <div className="text-center mt-8 sm:mt-12">
                      <button className="px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                        Load More Articles
                      </button>
                    </div>
                  )}
                </section>

                {/* Other Sections */}
                <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                      Explore Other Sections
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {otherSections.map((section) => (
                        <Link 
                          key={section} 
                          href={`/section/${section.toLowerCase()}`}
                          className="group"
                        >
                          <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600 transition-colors">
                              <span className="text-2xl group-hover:text-white transition-colors">
                                {getSectionIcon(section)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm capitalize group-hover:text-red-600 transition-colors">
                              {section}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* No Articles State */
              <div className="text-center py-12 sm:py-16">
                <div className="mb-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    No {sectionDisplayName} Articles Yet
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    We haven't fetched any {sectionDisplayName.toLowerCase()} articles yet. Check back soon or explore other sections.
                  </p>
                  <Link 
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Back to Homepage
                  </Link>
                </div>
              </div>
            )}
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
    opinion: 'Expert analysis, editorial content, and opinion pieces on current affairs and trending topics.'
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
    opinion: '💭'
  }
  return icons[sectionName.toLowerCase()] || '📰'
}

export async function getStaticPaths() {
  try {
    const sections = getAllSections()
    const paths = sections.map((section) => ({
      params: { section: section.toLowerCase() },
    }))

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({ params }) {
  try {
    const sectionName = params.section.toLowerCase()
    const allArticles = getAllArticles()
    const allSections = getAllSections()
    
    // Filter articles by section (case-insensitive)
    const sectionArticles = allArticles.filter(article => 
      article.sectionName.toLowerCase() === sectionName
    )
    
    if (sectionArticles.length === 0 && !allSections.some(s => s.toLowerCase() === sectionName)) {
      return {
        notFound: true,
      }
    }
    
    // Limit articles for performance
    const articles = sectionArticles.slice(0, 20).map(article => ({
      guardianId: article.guardianId,
      webTitle: article.webTitle,
      sectionName: article.sectionName,
      webPublicationDate: article.webPublicationDate,
      headline: article.headline,
      thumbnail: article.thumbnail,
      slug: article.slug,
      bodyText: article.bodyText // For reading time calculation
    }))
    
    const featuredArticle = articles[0] || null
    const otherSections = allSections.filter(s => s.toLowerCase() !== sectionName).slice(0, 6)
    
    const sectionDisplayName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
    
    const metadata = generatePageMetadata({
      title: `${sectionDisplayName} News - Latest Updates & Analysis`,
      description: getSectionDescription(sectionName),
      path: `/section/${sectionName}`,
      image: featuredArticle?.thumbnail
    })
    
    const structuredData = generateHomePageStructuredData(articles.slice(0, 10))
    
    return {
      props: {
        sectionName,
        articles: articles.slice(1), // Exclude featured article from main grid
        featuredArticle,
        otherSections,
        totalArticles: sectionArticles.length,
        metadata,
        structuredData
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true,
    }
  }
}