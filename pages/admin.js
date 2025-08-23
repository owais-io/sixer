import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import { format } from 'date-fns'
import Layout from '../components/Layout'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFetchArticles = async (e) => {
    e.preventDefault()
    
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates')
      return
    }
    
    setIsLoading(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/fetch-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromDate,
          toDate,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch articles')
      }
      
      setResult(data)
      
    } catch (err) {
      setError(err.message || 'An error occurred while fetching articles')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
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
          <title>Admin Panel - Parho.net</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <Layout>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Admin Panel Access
                </h1>
                <p className="text-gray-600 mb-8">
                  Please sign in with your Google account to access the admin panel.
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

  // Authenticated - show admin panel
  return (
    <>
      <Head>
        <title>Admin Panel - Parho.net</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Admin Panel
                </h1>
                <p className="text-gray-600">
                  Welcome back, {session.user.name}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Fetch Articles Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Fetch Guardian Articles
            </h2>
            
            <form onSubmit={handleFetchArticles} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Fetching Articles...
                    </>
                  ) : (
                    'Fetch Articles'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
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
                    Articles Fetched Successfully
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.stats.fetched}
                      </div>
                      <div className="text-xs text-gray-600">Fetched</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.stats.new}
                      </div>
                      <div className="text-xs text-gray-600">New</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {result.stats.duplicates}
                      </div>
                      <div className="text-xs text-gray-600">Duplicates</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {result.stats.errors || 0}
                      </div>
                      <div className="text-xs text-gray-600">Errors</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-green-700">
                    {result.message}
                  </p>
                  
                  <div className="mt-4">
                    <a
                      href="/"
                      className="inline-block px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Articles on Homepage
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Select Date Range:</strong> Choose the from and to dates to fetch articles from The Guardian API.
              </p>
              <p>
                <strong>2. Fetch Articles:</strong> Click the "Fetch Articles" button to start the process.
              </p>
              <p>
                <strong>3. View Results:</strong> The system will show you statistics including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Fetched:</strong> Total articles retrieved from Guardian API</li>
                <li><strong>New:</strong> Articles saved as new MDX files</li>
                <li><strong>Duplicates:</strong> Articles skipped because they already exist</li>
                <li><strong>Errors:</strong> Articles that failed to save</li>
              </ul>
              <p>
                <strong>4. Automatic Publishing:</strong> All new articles are automatically published and will appear on the homepage.
              </p>
              <p className="text-yellow-700 bg-yellow-100 p-2 rounded">
                <strong>Note:</strong> Duplicate detection is based on Guardian article IDs stored in the frontmatter of existing MDX files.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}