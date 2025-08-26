import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import useTopSections from '../hooks/useTopSections'
import SearchBox from './SearchBox'

export default function Layout({ children }) {
  const { data: session } = useSession()
  const { topSections, loading: sectionsLoading } = useTopSections()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      }))
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    }

    // Update immediately
    updateTime()
    
    // Update every minute
    const interval = setInterval(updateTime, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Top Utility Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">
                {currentDate}
              </span>
              <span className="sm:hidden">
                {currentDate ? new Date(currentDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                }) : ''}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Updated every 5 minutes</span>
              <span>•</span>
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-2 border-purple-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo and Masthead */}
          <div className="py-4 sm:py-6 text-center border-b border-gray-200">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-600 hover:text-purple-700 transition-colors leading-tight">
                parho.net
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 uppercase tracking-wide font-medium">
                Breaking News • Latest Updates • Global Coverage
              </p>
            </Link>
          </div>
          
          {/* Primary Navigation */}
          <nav className="py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button 
                className="sm:hidden p-2 text-gray-600 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-4 lg:space-x-6 flex-1">
                <Link 
                  href="/"
                  className="text-gray-800 hover:text-purple-600 font-semibold text-sm lg:text-base uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-purple-600 py-1"
                >
                  Home
                </Link>
                {topSections.slice(0, 6).map((section) => (
                  <Link 
                    key={section.name}
                    href={`/section/${section.name.toLowerCase()}`}
                    className="text-gray-800 hover:text-purple-600 font-semibold text-sm lg:text-base uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-purple-600 py-1 flex items-center"
                  >
                    {section.name}
                  </Link>
                ))}
                {topSections.length > 6 && (
                  <div className="relative group">
                    <button className="text-gray-800 hover:text-purple-600 font-semibold text-sm lg:text-base uppercase tracking-wide transition-colors border-b-2 border-transparent hover:border-purple-600 py-1 flex items-center">
                      More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {topSections.slice(6).map((section) => (
                        <Link
                          key={section.name}
                          href={`/section/${section.name.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                        >
                          <span className="capitalize">{section.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Search and Time Display */}
              <div className="flex items-center space-x-3">
                <SearchBox />
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Updated: </span>
                  <span>{currentTime ? currentTime.replace(/\s.*$/, '') : ''}</span>
                </div>
              </div>

              {/* Admin Access (Hidden) */}
              {session && (
                <Link 
                  href="/admin"
                  className="hidden opacity-0"
                  title="Admin Panel"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div id="mobile-menu" className="sm:hidden mt-4 pt-4 border-t border-gray-200 animate-fade-in" role="menu">
                <div className="grid grid-cols-1 gap-1">
                  <Link 
                    href="/" 
                    className="text-gray-800 hover:text-purple-600 font-semibold text-sm uppercase py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between focus:outline-none focus:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    <span>Home</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {topSections.map((section) => (
                    <Link 
                      key={section.name}
                      href={`/section/${section.name.toLowerCase()}`} 
                      className="text-gray-800 hover:text-purple-600 font-semibold text-sm uppercase py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between focus:outline-none focus:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      <span>{section.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Menu Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Last updated: {currentTime ? currentTime.replace(/\s.*$/, '') : ''}
                  </p>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* About */}
            <div className="lg:col-span-2">
              <Link href="/" className="text-2xl sm:text-3xl font-bold text-purple-500 mb-4 inline-block">
                parho.net
              </Link>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Your trusted source for breaking news, global coverage, and in-depth analysis. 
                Delivering accurate, timely journalism from around the world.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Dynamic Sections */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 uppercase">Top Sections</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm">
                {topSections.slice(0, 8).map((section) => (
                  <li key={`footer-${section.name}`}>
                    <Link 
                      href={`/section/${section.name.toLowerCase()}`} 
                      className="text-gray-300 hover:text-white transition-colors capitalize"
                    >
                      {section.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Information */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 uppercase">Information</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-400">
                © {new Date().getFullYear()} Parho.net. All rights reserved. 
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Content sourced from{' '}
                <a 
                  href="https://www.theguardian.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  The Guardian
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
