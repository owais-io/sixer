import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import Layout from '../components/Layout'

export default function AdminPage() {
  const { data: session, status } = useSession()
  
  // Form states
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [keyword, setKeyword] = useState('')
  const [maxArticles, setMaxArticles] = useState(100)
  
  // Process states
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  
  // Statistics states
  const [stats, setStats] = useState(null)
  const [recentFetches, setRecentFetches] = useState([])

  // Quick date presets
  const datePresets = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 3 Days', days: 3 },
    { label: 'Last Week', days: 7 },
    { label: 'Last Month', days: 30 }
  ]

  const sections = [
    'All Sections',
    'Politics', 
    'World', 
    'Business', 
    'Sports', 
    'Technology', 
    'Health',
    'Science',
    'Environment',
    'Culture'
  ]

  // Load statistics on component mount
  useEffect(() => {
    if (session) {
      loadStatistics()
      loadRecentFetches()
    }
  }, [session])

  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
  }

  const loadRecentFetches = async () => {
    try {
      const response = await fetch('/api/admin/recent-fetches')
      if (response.ok) {
        const data = await response.json()
        setRecentFetches(data)
      }
    } catch (error) {
      console.error('Failed to load recent fetches:', error)
    }
  }

  const setDatePreset = (days) => {
    const today = new Date()
    const from = days === 0 ? today : subDays(today, days)
    const to = today
    
    setFromDate(format(from, 'yyyy-MM-dd'))
    setToDate(format(to, 'yyyy-MM-dd'))
  }

  const handleFetchArticles = async (e) => {
    e.preventDefault()
    
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates')
      return
    }
    
    setIsLoading(true)
    setError('')
    setResult(null)
    setProgress({ current: 0, total: 1, articlesLoaded: 0, status: 'Starting...' })
    
    try {
      const response = await fetch('/api/fetch-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromDate,
          toDate,
          section: selectedSection === 'All Sections' ? '' : selectedSection,
          keyword: keyword.trim(),
          maxArticles: parseInt(maxArticles)
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch articles')
      }
      
      setResult(data)
      setProgress(null)
      
      // Refresh statistics and recent fetches
      loadStatistics()
      loadRecentFetches()
      
    } catch (err) {
      setError(err.message || 'An error occurred while fetching articles')
      setProgress(null)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllArticles = async () => {
    if (!confirm('Are you sure you want to delete ALL articles? This cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch('/api/admin/clear-articles', {
        method: 'POST'
      })
      
      if (response.ok) {
        setResult({ message: 'All articles cleared successfully', stats: { cleared: 'all' } })
        loadStatistics()
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to clear articles')
      }
    } catch (error) {
      setError('An error occurred while clearing articles')
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Not authenticated
  if (!session) {
    return (
      <>
        <Head>
          <title>Admin Panel - Access Required | Parho.net</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <Layout>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Admin Access Required
                </h1>
                <p className="text-gray-600 mb-8">
                  Please sign in with your authorized Google account to access the admin panel.
                </p>
                <button
                  onClick={() => signIn('google')}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  // Authenticated - show enhanced admin panel
  return (
    <>
      <Head>
        <title>Admin Panel - Content Management | Parho.net</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {session.user.name} • Content Management System
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Website
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Statistics Cards */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-blue-900">{stats.totalArticles || 0}</p>
                        <p className="text-blue-700 text-sm">Total Articles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-green-900">{stats.todayArticles || 0}</p>
                        <p className="text-green-700 text-sm">Today's Articles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-purple-900">{stats.totalSections || 0}</p>
                        <p className="text-purple-700 text-sm">News Sections</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 sm:p-6 border border-orange-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-orange-900">{stats.lastFetchCount || 0}</p>
                        <p className="text-orange-700 text-sm">Last Fetch</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Fetch Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Fetch Guardian Articles
                </h2>

                {/* Quick Date Presets */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {datePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setDatePreset(preset.days)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleFetchArticles} className="space-y-6">
                  {/* Date Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                        From Date *
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                        To Date *
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                        Section Filter
                      </label>
                      <select
                        id="section"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        {sections.map((section) => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="maxArticles" className="block text-sm font-medium text-gray-700 mb-2">
                        Max Articles
                      </label>
                      <select
                        id="maxArticles"
                        value={maxArticles}
                        onChange={(e) => setMaxArticles(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="50">50 Articles</option>
                        <option value="100">100 Articles</option>
                        <option value="200">200 Articles</option>
                        <option value="500">500 Articles</option>
                        <option value="1000">1000 Articles</option>
                      </select>
                    </div>
                  </div>

                  {/* Keyword Filter */}
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                      Keyword Filter (Optional)
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g., climate, election, technology..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to fetch all articles from the selected date range</p>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Fetch Articles
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={clearAllArticles}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear All
                    </button>
                  </div>
                </form>
              </div>

              {/* Progress Bar */}
              {progress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-blue-900">
                      {progress.status}
                    </span>
                    <span className="text-sm text-blue-700">
                      {progress.articlesLoaded} articles processed
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((progress.current / progress.total) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-blue-600 text-center">
                    {progress.current} / {progress.total} API calls completed
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Result */}
              {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-green-800 mb-3">
                        Operation Completed Successfully
                      </h3>
                      
                      {result.stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xl font-bold text-blue-600">
                              {result.stats.fetched || 0}
                            </div>
                            <div className="text-xs text-gray-600">Fetched</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xl font-bold text-green-600">
                              {result.stats.new || 0}
                            </div>
                            <div className="text-xs text-gray-600">New</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xl font-bold text-yellow-600">
                              {result.stats.duplicates || 0}
                            </div>
                            <div className="text-xs text-gray-600">Duplicates</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xl font-bold text-red-600">
                              {result.stats.errors || 0}
                            </div>
                            <div className="text-xs text-gray-600">Errors</div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-green-700 mb-4">
                        {result.message}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/"
                          className="inline-block px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                        >
                          View Homepage
                        </Link>
                        <button
                          onClick={() => setResult(null)}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                    </svg>
                    View Homepage
                  </Link>
                  
                  <button
                    onClick={() => window.open('/sitemap.xml', '_blank')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Sitemap
                  </button>

                  <button
                    onClick={loadStatistics}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Stats
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Fetches</h3>
                {recentFetches.length > 0 ? (
                  <div className="space-y-3">
                    {recentFetches.map((fetch, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">
                            {fetch.articles || 0} articles
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(fetch.date), 'MMM dd, h:mm a')}
                          </p>
                          {fetch.section && (
                            <p className="text-xs text-blue-600">{fetch.section}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No recent activity</p>
                )}
              </div>

              {/* System Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Guardian API</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">File System</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">Healthy</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Help & Tips */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <p>Fetch articles in smaller batches (50-100) for better performance</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <p>Use section filters to organize content by category</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <p>Keyword filters help find specific topics</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <p>Recent articles get better SEO performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Footer */}
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Select Dates</h4>
                <p>Choose your date range or use quick presets. Recent articles perform better for SEO.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Apply Filters</h4>
                <p>Filter by section or add keywords to find specific content types.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Fetch Articles</h4>
                <p>Click fetch and monitor progress. The system prevents duplicates automatically.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">4. Review Results</h4>
                <p>Check statistics and visit your website to see the new content live.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}