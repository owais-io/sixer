import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary'
import { getAllArticles } from '../lib/articles'

export default function SearchPage({ allArticles }) {
  const router = useRouter()
  const { q } = router.query
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchTerm(q)
      performSearch(q)
    }
  }, [q, allArticles])

  const performSearch = async (query) => {
    setLoading(true)
    try {
      // Client-side search through articles
      const searchResults = allArticles.filter(article =>
        article.webTitle.toLowerCase().includes(query.toLowerCase()) ||
        article.sectionName.toLowerCase().includes(query.toLowerCase())
      )
      
      setResults(searchResults.slice(0, 50)) // Limit results
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <>
      <Head>
        <title>{q ? `Search results for "${q}"` : 'Search'} - Parho.net</title>
        <meta 
          name="description" 
          content={q ? `Search results for "${q}" on Parho.net` : 'Search articles on Parho.net'} 
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {q ? `Search Results` : 'Search Articles'}
                </h1>
                {q && (
                  <p className="text-gray-600">
                    {loading ? 'Searching...' : `${results.length} results found for "${q}"`}
                  </p>
                )}
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoComplete="off"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <ErrorBoundary>
            {/* Search Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-8">
                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((article) => (
                    <ArticleCard
                      key={article.guardianId}
                      article={article}
                      variant="compact"
                      className="touch-manipulation"
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {results.length >= 50 && (
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Showing first 50 results. Refine your search for more specific results.
                    </p>
                  </div>
                )}
              </div>
            ) : q ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any articles matching "{q}". Try different keywords or browse our sections.
                  </p>
                </div>
                
                {/* Suggestions */}
                <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li>• Try different keywords or synonyms</li>
                    <li>• Use fewer words in your search</li>
                    <li>• Check your spelling</li>
                    <li>• Browse our sections: Politics, World, Business, Sports, Technology</li>
                  </ul>
                </div>
                
                <div className="mt-8">
                  <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Articles</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Enter keywords in the search box above to find relevant articles and news stories.
                  </p>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  try {
    const allArticles = getAllArticles().slice(0, 1000) // Limit for performance
    
    // Only include necessary fields for search
    const searchableArticles = allArticles.map(article => ({
      guardianId: article.guardianId,
      webTitle: article.webTitle,
      sectionName: article.sectionName,
      webPublicationDate: article.webPublicationDate,
      thumbnail: article.thumbnail,
      slug: article.slug,
    }))
    
    return {
      props: {
        allArticles: searchableArticles
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error in search getStaticProps:', error)
    return {
      props: {
        allArticles: []
      },
      revalidate: 300,
    }
  }
}