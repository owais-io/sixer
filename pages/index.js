import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles } from '../lib/articles'
import { generatePageMetadata, generateHomePageStructuredData, extractDescription } from '../lib/seo'
import Layout from '../components/Layout'

export default function HomePage({ articles, featuredArticles, sectionArticles, breakingNews, metadata, structuredData }) {
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
        {articles.length > 0 ? (
          <>
            {/* Breaking News Banner */}
            {breakingNews && (
              <div className="bg-red-600 text-white py-2 sm:py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center">
                    <span className="bg-white text-red-600 px-2 sm:px-3 py-1 text-xs font-bold uppercase mr-3 sm:mr-4 rounded flex-shrink-0">
                      Breaking
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm sm:text-base font-medium whitespace-nowrap animate-marquee">
                        {breakingNews.webTitle} • Stay tuned for more updates on parho.net
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {/* Hero Section - Above the Fold */}
              <section className="mb-8 sm:mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Main Featured Story */}
                  <div className="lg:col-span-2">
                    {featuredArticles[0] && (
                      <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <Link href={`/article/${featuredArticles[0].slug}`}>
                          <div className="cursor-pointer">
                            {featuredArticles[0].thumbnail && (
                              <div className="relative aspect-[16/9] sm:aspect-[5/4] lg:aspect-[16/9]">
                                <Image
                                  src={featuredArticles[0].thumbnail}
                                  alt={featuredArticles[0].webTitle}
                                  fill
                                  className="object-cover"
                                  priority
                                  sizes="(max-width: 1024px) 100vw, 66vw"
                                />
                                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                  <span className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs font-bold uppercase rounded">
                                    {featuredArticles[0].sectionName}
                                  </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                                  <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2">
                                    {featuredArticles[0].webTitle}
                                  </h1>
                                  <div className="text-white/90 text-xs sm:text-sm">
                                    <time dateTime={featuredArticles[0].webPublicationDate}>
                                      {format(new Date(featuredArticles[0].webPublicationDate), 'MMM dd, yyyy • h:mm a')}
                                    </time>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      </article>
                    )}
                  </div>

                  {/* Secondary Stories */}
                  <div className="space-y-4 sm:space-y-6">
                    {featuredArticles.slice(1, 4).map((article) => (
                      <article key={article.guardianId} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                        <Link href={`/article/${article.slug}`}>
                          <div className="cursor-pointer p-4">
                            <div className="flex space-x-3">
                              {article.thumbnail && (
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                                  <Image
                                    src={article.thumbnail}
                                    alt={article.webTitle}
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 640px) 80px, 96px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="mb-2">
                                  <span className="text-xs font-semibold text-blue-600 uppercase">
                                    {article.sectionName}
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-3 hover:text-red-600 transition-colors leading-tight">
                                  {article.webTitle}
                                </h3>
                                <time className="text-xs text-gray-500" dateTime={article.webPublicationDate}>
                                  {format(new Date(article.webPublicationDate), 'MMM dd, h:mm a')}
                                </time>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section-Based Content Areas */}
              <section className="mb-8 sm:mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {Object.entries(sectionArticles).map(([section, sectionArticlesList]) => (
                    <div key={section} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      {/* Section Header */}
                      <div className="bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">{section}</h2>
                      </div>
                      
                      {/* Section Articles */}
                      <div className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                          {sectionArticlesList.slice(0, 4).map((article, index) => (
                            <article key={article.guardianId}>
                              <Link href={`/article/${article.slug}`}>
                                <div className="cursor-pointer">
                                  {index === 0 && article.thumbnail ? (
                                    // First article with image
                                    <div>
                                      <div className="relative aspect-[5/4] mb-3 rounded-lg overflow-hidden">
                                        <Image
                                          src={article.thumbnail}
                                          alt={article.webTitle}
                                          fill
                                          className="object-cover hover:scale-105 transition-transform duration-300"
                                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                      </div>
                                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-3 hover:text-red-600 transition-colors leading-tight">
                                        {article.webTitle}
                                      </h3>
                                      <div className="text-xs sm:text-sm text-gray-500">
                                        <time dateTime={article.webPublicationDate}>
                                          {format(new Date(article.webPublicationDate), 'MMM dd')}
                                        </time>
                                      </div>
                                    </div>
                                  ) : (
                                    // Other articles - text only
                                    <div className={`${index > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
                                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-red-600 transition-colors leading-tight">
                                        {article.webTitle}
                                      </h4>
                                      <div className="text-xs text-gray-500">
                                        <time dateTime={article.webPublicationDate}>
                                          {format(new Date(article.webPublicationDate), 'MMM dd')}
                                        </time>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Latest News Ticker/Feed */}
              <section className="mb-8 sm:mb-12">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                      <span className="w-3 h-3 bg-red-600 rounded-full mr-3 animate-pulse"></span>
                      Latest Updates
                    </h2>
                    <Link href="/latest" className="text-sm text-red-600 hover:text-red-700 font-semibold uppercase">
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {articles.slice(4, 8).map((article) => (
                      <article key={article.guardianId} className="bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <Link href={`/article/${article.slug}`}>
                          <div className="cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-blue-600 uppercase">
                                {article.sectionName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(article.webPublicationDate), 'h:mm a')}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-3 hover:text-red-600 transition-colors leading-tight">
                              {article.webTitle}
                            </h4>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* More Stories Section */}
              <section>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-xl font-bold">More Stories</h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {articles.slice(8, 17).map((article) => (
                        <article key={article.guardianId} className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                          <Link href={`/article/${article.slug}`}>
                            <div className="cursor-pointer">
                              <div className="flex space-x-3">
                                {article.thumbnail && (
                                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                    <Image
                                      src={article.thumbnail}
                                      alt={article.webTitle}
                                      fill
                                      className="object-cover rounded"
                                      sizes="(max-width: 640px) 64px, 80px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-blue-600 uppercase">
                                      {article.sectionName}
                                    </span>
                                    <time className="text-xs text-gray-500" dateTime={article.webPublicationDate}>
                                      {format(new Date(article.webPublicationDate), 'MMM dd')}
                                    </time>
                                  </div>
                                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-3 hover:text-red-600 transition-colors leading-tight">
                                    {article.webTitle}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                    
                    {/* Load More */}
                    <div className="text-center mt-6 sm:mt-8">
                      <Link 
                        href="/archive"
                        className="inline-block px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Load More Stories
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Parho.net
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your trusted source for breaking news and global coverage. Articles will appear here once they are fetched from our news sources.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Use the admin panel to fetch the latest news articles and start building your news website.
                </p>
                <a 
                  href="/admin"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Access Admin Panel
                </a>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  try {
    const allArticles = getAllArticles()
    // Limit articles for better performance
    const articles = allArticles.slice(0, 30).map(article => ({
      guardianId: article.guardianId,
      webTitle: article.webTitle,
      sectionName: article.sectionName,
      webPublicationDate: article.webPublicationDate,
      headline: article.headline,
      thumbnail: article.thumbnail,
      slug: article.slug,
    }))

    // Get featured articles (top 4)
    const featuredArticles = articles.slice(0, 4)

    // Get breaking news (most recent article)
    const breakingNews = articles.length > 0 ? articles[0] : null

    // Group articles by section for section-based display (limit to 6 sections)
    const sections = [...new Set(articles.map(a => a.sectionName))].slice(0, 6)
    const sectionArticles = {}
    
    sections.forEach(section => {
      sectionArticles[section] = articles.filter(a => a.sectionName === section).slice(0, 4)
    })
    
    const metadata = generatePageMetadata({
      title: 'Breaking News & Global Coverage',
      description: 'Stay informed with breaking news, latest updates, and in-depth coverage from around the world on Parho.net',
      path: ''
    })
    
    const structuredData = generateHomePageStructuredData(articles.slice(0, 10))
    
    return {
      props: {
        articles,
        featuredArticles,
        sectionArticles,
        breakingNews,
        metadata,
        structuredData
      },
      revalidate: 1800, // Revalidate every 30 minutes for news
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        articles: [],
        featuredArticles: [],
        sectionArticles: {},
        breakingNews: null,
        metadata: generatePageMetadata({}),
        structuredData: generateHomePageStructuredData([])
      },
      revalidate: 300,
    }
  }
}