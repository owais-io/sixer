import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Optional: Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Head>
        <title>Page Not Found - Parho.net</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Parho.net homepage for the latest news." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="mx-auto w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-6xl sm:text-8xl font-bold text-purple-600 mb-4">404</h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, you can find plenty of breaking news and stories on our homepage.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Homepage
              </Link>
              
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link 
                  href="/section/world"
                  className="p-3 bg-gray-50 rounded-lg text-center hover:bg-purple-50 hover:text-purple-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-4 h-4 text-purple-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">World</span>
                </Link>
                
                <Link 
                  href="/section/politics"
                  className="p-3 bg-gray-50 rounded-lg text-center hover:bg-purple-50 hover:text-purple-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-4 h-4 text-purple-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Politics</span>
                </Link>
                
                <Link 
                  href="/section/business"
                  className="p-3 bg-gray-50 rounded-lg text-center hover:bg-purple-50 hover:text-purple-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-4 h-4 text-purple-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Business</span>
                </Link>
                
                <Link 
                  href="/section/sport"
                  className="p-3 bg-gray-50 rounded-lg text-center hover:bg-purple-50 hover:text-purple-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-4 h-4 text-purple-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Sports</span>
                </Link>
              </div>
            </div>

            {/* Auto-redirect notification */}
            <div className="mt-6 text-sm text-gray-500">
              You'll be automatically redirected to the homepage in 10 seconds
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}