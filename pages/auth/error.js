import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/Layout'

const errors = {
  Configuration: {
    title: 'Configuration Error',
    message: 'There is a problem with the server configuration.',
  },
  AccessDenied: {
    title: 'Access Denied',
    message: 'You do not have permission to access the admin panel. Only authorized users can sign in.',
  },
  Verification: {
    title: 'Verification Error',
    message: 'The verification token has expired or is invalid.',
  },
  Default: {
    title: 'Authentication Error',
    message: 'An error occurred during authentication. Please try again.',
  },
}

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query
  
  const errorInfo = errors[error] || errors.Default

  return (
    <>
      <Head>
        <title>{errorInfo.title} - Parho.net</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-6">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {errorInfo.title}
              </h1>
              
              <p className="text-gray-600 mb-8">
                {errorInfo.message}
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/auth/signin"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  Try Again
                </Link>
                
                <Link
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
                >
                  Back to Home
                </Link>
              </div>
              
              {error === 'AccessDenied' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Need access?</strong> Contact the administrator to get your email address added to the authorized users list.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}