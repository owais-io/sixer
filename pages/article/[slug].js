import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles, getArticleBySlug } from '../../lib/articles'
import { 
  generatePageMetadata, 
  generateArticleStructuredData, 
  generateBreadcrumbStructuredData,
  extractDescription 
} from '../../lib/seo'
import Layout from '../../components/Layout'

export default function ArticlePage({ article, relatedArticles, metadata, structuredData, breadcrumbData }) {
  if (!article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                The article you're looking for doesn't exist or may have been moved.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
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
    )
  }

  const readingTime = Math.ceil((article.bodyText?.length || 0) / 1000) || 1 // Rough estimate

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="author" content={metadata.authors[0].name} />
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
        <meta property="article:published_time" content={metadata.openGraph.publishedTime} />
        <meta property="article:section" content={metadata.openGraph.section} />
        
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
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbData }}
        />
      </Head>
      
      <Layout>
        <div className="bg-white">
          {/* Article Container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-700 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link 
                    href={`/section/${article.sectionName.toLowerCase()}`}
                    className="hover:text-gray-700 transition-colors capitalize"
                  >
                    {article.sectionName}
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="font-medium text-gray-900 truncate">
                  {article.webTitle.length > 50 ? `${article.webTitle.substring(0, 50)}...` : article.webTitle}
                </li>
              </ol>
            </nav>

            <article className="prose prose-lg max-w-none">
              {/* Article Header */}
              <header className="mb-8 sm:mb-10">
                {/* Category Badge */}
                <div className="mb-4 sm:mb-6">
                  <Link href={`/section/${article.sectionName.toLowerCase()}`}>
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors uppercase">
                      {article.sectionName}
                    </span>
                  </Link>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {article.webTitle}
                </h1>
                
                {/* Subheading/Deck */}
                {article.headline && article.headline !== article.webTitle && (
                  <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-medium">
                    {article.headline}
                  </h2>
                )}
                
                {/* Article Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200">
                  <div className="flex items-center space-x-4">
                    {/* Author */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">The Guardian</p>
                        <p className="text-xs text-gray-500">News Organization</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* Publication Date */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <time dateTime={article.webPublicationDate}>
                        {format(new Date(article.webPublicationDate), 'MMMM dd, yyyy')}
                      </time>
                    </div>
                    
                    {/* Reading Time */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Share Buttons */}
                <div className="flex items-center justify-between mt-4 sm:mt-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 font-medium">Share:</span>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save Article
                  </button>
                </div>
              </header>

              {/* Featured Image */}
              {article.thumbnail && (
                <figure className="mb-8 sm:mb-10">
                  <div className="relative aspect-[5/4] sm:aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src={article.thumbnail}
                      alt={article.webTitle}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-gray-600 text-center italic">
                    {article.webTitle}
                  </figcaption>
                </figure>
              )}

              {/* Article Content */}
              <div className="prose prose-lg prose-gray max-w-none">
                {article.bodyText ? (
                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: article.bodyText
                        .replace(/\n\n/g, '</p><p class="mb-6">')
                        .replace(/\n/g, '<br>')
                        .replace(/^/, '<p class="mb-6">')
                        .replace(/$/, '</p>')
                    }}
                  />
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-blue-800 font-medium mb-2">Full Article Available</p>
                        <p className="text-blue-700">
                          This is a preview. Read the complete article with full details and analysis on The Guardian.
                        </p>
                        <a 
                          href={article.webUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Read Full Article
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Source:</strong>{' '}
                      <a 
                        href={article.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        The Guardian
                      </a>
                    </p>
                    <p>
                      Originally published on {format(new Date(article.webPublicationDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <Link 
                    href="/"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Back to All Articles
                  </Link>
                </div>
              </footer>
            </article>
          </div>

          {/* Related Articles Sidebar */}
          {relatedArticles.length > 0 && (
            <aside className="bg-gray-50 py-8 sm:py-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <article key={relatedArticle.guardianId} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                      <Link href={`/article/${relatedArticle.slug}`}>
                        <div className="cursor-pointer">
                          {relatedArticle.thumbnail && (
                            <div className="relative aspect-[5/4]">
                              <Image
                                src={relatedArticle.thumbnail}
                                alt={relatedArticle.webTitle}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-blue-600 uppercase">
                                {relatedArticle.sectionName}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                              {relatedArticle.webTitle}
                            </h4>
                            <time className="text-xs text-gray-500" dateTime={relatedArticle.webPublicationDate}>
                              {format(new Date(relatedArticle.webPublicationDate), 'MMM dd, yyyy')}
                            </time>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </Layout>
    </>
  )
}

export async function getStaticPaths() {
  try {
    const articles = getAllArticles()
    const paths = articles.slice(0, 100).map((article) => ({
      params: { slug: article.slug },
    }))

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new articles
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
    const article = getArticleBySlug(params.slug)

    if (!article) {
      return {
        notFound: true,
      }
    }

    // Get related articles from same section
    const allArticles = getAllArticles()
    const relatedArticles = allArticles
      .filter(a => a.sectionName === article.sectionName && a.slug !== article.slug)
      .slice(0, 3)
      .map(a => ({
        guardianId: a.guardianId,
        webTitle: a.webTitle,
        sectionName: a.sectionName,
        webPublicationDate: a.webPublicationDate,
        thumbnail: a.thumbnail,
        slug: a.slug,
      }))

    const description = extractDescription(article.bodyText || article.headline, 160)
    
    const metadata = generatePageMetadata({
      title: article.webTitle,
      description: description,
      path: `/article/${article.slug}`,
      image: article.thumbnail,
      type: 'article',
      publishedTime: article.webPublicationDate,
      author: 'The Guardian',
      section: article.sectionName
    })
    
    const structuredData = generateArticleStructuredData(article)
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', path: '' },
      { name: article.sectionName, path: `/section/${article.sectionName.toLowerCase()}` },
      { name: article.webTitle, path: `/article/${article.slug}` }
    ])

    return {
      props: {
        article,
        relatedArticles,
        metadata,
        structuredData,
        breadcrumbData
      },
      revalidate: 86400, // Revalidate once per day
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true,
    }
  }
}