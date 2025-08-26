import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

const SearchBox = ({ className = '', onClose }) => {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    const searchArticles = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // Mock search - replace with actual API call
        const mockResults = [
          {
            id: '1',
            title: 'Breaking: Sample search result',
            section: 'Politics',
            slug: 'sample-article-1',
            date: new Date().toISOString()
          }
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase())
        )
        
        setResults(mockResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchArticles, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsExpanded(false)
      setQuery('')
      onClose?.()
    }
  }

  const handleResultClick = (slug) => {
    router.push(`/article/${slug}`)
    setIsExpanded(false)
    setQuery('')
    onClose?.()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsExpanded(false)
      setQuery('')
      onClose?.()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Search articles"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      ) : (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 sm:relative sm:bg-transparent sm:z-auto">
          <div className="absolute top-0 left-0 right-0 bg-white shadow-lg sm:relative sm:shadow-none">
            <form onSubmit={handleSubmit} className="flex items-center p-4 sm:p-0">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoComplete="off"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false)
                  setQuery('')
                  onClose?.()
                }}
                className="ml-2 p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>

            {/* Search Results */}
            {query.length >= 2 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="inline-block animate-spin w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {result.section}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No articles found for "{query}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox