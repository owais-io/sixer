import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles } from '../lib/articles'
import { generatePageMetadata, generateHomePageStructuredData, extractDescription } from '../lib/seo'
import Layout from '../components/Layout'
import ArticleCard from '../components/ArticleCard'
import SectionGrid from '../components/SectionGrid'
import ErrorBoundary from '../components/ErrorBoundary'
import { LoadingCard } from '../components/LoadingSpinner'
import usePullToRefresh from '../hooks/usePullToRefresh'

export default function HomePage({ articles, featuredArticles, sectionArticles, breakingNews, metadata, structuredData }) {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  
  const handleRefresh = async () => {
    // Trigger page refresh or refetch data
    window.location.reload()
  }

  const { elementRef, isRefreshing, shouldShowIndicator, pullIndicatorStyle } = usePullToRefresh(handleRefresh)

  // Auto-rotate breaking news every 5 seconds
  useEffect(() => {
    if (breakingNews && breakingNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % breakingNews.length)
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [breakingNews])

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
        <div ref={elementRef} className="touch-manipulation">
          {/* Pull to Refresh Indicator */}
          {shouldShowIndicator && (
            <div 
              className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 bg-blue-600 text-white px-4 py-2 rounded-b-lg flex items-center space-x-2"
              style={pullIndicatorStyle}
            >
              {isRefreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Refreshing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium">Pull to refresh</span>
                </>
              )}
            </div>
          )}

          {articles.length > 0 ? (
            <ErrorBoundary>
              {/* Breaking News Banner */}
              {breakingNews && breakingNews.length > 0 && (
                <div className="bg-purple-600 text-white py-2 sm:py-3">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                      <span className="bg-white text-purple-600 px-2 sm:px-3 py-1 text-xs font-bold uppercase mr-3 sm:mr-4 rounded flex-shrink-0">
                        Breaking
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <div className="relative h-6 sm:h-7">
                          {breakingNews.map((news, index) => (
                            <Link
                              key={news.guardianId}
                              href={`/article/${news.slug}`}
                              className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out hover:text-purple-200"
                              style={{
                                opacity: index === currentNewsIndex ? 1 : 0,
                                transform: `translateY(${index === currentNewsIndex ? '0' : '10px'})`,
                                pointerEvents: index === currentNewsIndex ? 'auto' : 'none'
                              }}
                            >
                              <p className="text-sm sm:text-base font-medium cursor-pointer">
                                {news.webTitle} • Click to read more
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Navigation dots */}
                      <div className="hidden sm:flex items-center space-x-1 ml-4">
                        {breakingNews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentNewsIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`View news ${index + 1}`}
                          />
                        ))}
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
                        <ArticleCard 
                          article={featuredArticles[0]} 
                          variant="featured" 
                          priority={true}
                          className="touch-manipulation"
                        />
                      )}
                    </div>

                    {/* Secondary Stories */}
                    <div className="space-y-4 sm:space-y-6">
                      {featuredArticles.slice(1, 4).map((article) => (
                        <ArticleCard 
                          key={article.guardianId}
                          article={article}
                          variant="compact"
                          className="touch-manipulation"
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section-Based Content Areas */}
                <SectionGrid sectionArticles={sectionArticles} />

                {/* Latest News Ticker/Feed */}
                <section className="mb-8 sm:mb-12">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 animate-pulse"></span>
                        Latest Updates
                      </h2>
                      <Link href="/latest" className="text-sm text-purple-600 hover:text-purple-700 font-semibold uppercase">
                        View All →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {articles.slice(4, 8).map((article) => (
                        <ArticleCard 
                          key={article.guardianId}
                          article={article}
                          variant="default"
                          className="touch-manipulation"
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* More Stories Section */}
                <section>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-lg sm:text-xl font-bold">More Stories</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {articles.slice(8, 17).map((article) => (
                          <ArticleCard 
                            key={article.guardianId}
                            article={article}
                            variant="list"
                            className="touch-manipulation"
                          />
                        ))}
                      </div>
                      
                      {/* Load More */}
                      <div className="text-center mt-6 sm:mt-8">
                        <Link 
                          href="/"
                          className="inline-block px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                          Back to Top
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </ErrorBoundary>
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
        </div>
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

    // Priority sections for featured article selection
    const prioritySections = ['US news', 'World news', 'UK news', 'Business', 'Politics', 'Australia news']
    
    // Get featured articles - first article from priority sections, then fill with others
    let featuredArticles = []
    
    // Find the latest article from priority sections
    const priorityArticle = articles.find(article => 
      prioritySections.includes(article.sectionName)
    )
    
    if (priorityArticle) {
      featuredArticles.push(priorityArticle)
      // Add remaining articles excluding the selected priority article
      const remainingArticles = articles.filter(article => 
        article.guardianId !== priorityArticle.guardianId
      )
      featuredArticles = featuredArticles.concat(remainingArticles.slice(0, 3))
    } else {
      // Fallback to top 4 if no priority articles found
      featuredArticles = articles.slice(0, 4)
    }

    // Get breaking news (top 5 recent articles)
    const breakingNews = articles.length > 0 ? articles.slice(0, 5) : []

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
        breakingNews: [],
        metadata: generatePageMetadata({}),
        structuredData: generateHomePageStructuredData([])
      },
      revalidate: 300,
    }
  }
}