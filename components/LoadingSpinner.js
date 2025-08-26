const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Loading">
      <svg 
        className={`animate-spin ${sizeClasses[size]} text-blue-600`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export const LoadingSkeleton = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={`loading-shimmer h-4 rounded ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden animate-pulse ${className}`}>
      <div className="p-4">
        <div className="flex space-x-3">
          <div className="loading-shimmer w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="loading-shimmer h-3 w-16 rounded" />
            <div className="space-y-2">
              <div className="loading-shimmer h-4 w-full rounded" />
              <div className="loading-shimmer h-4 w-4/5 rounded" />
            </div>
            <div className="loading-shimmer h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner