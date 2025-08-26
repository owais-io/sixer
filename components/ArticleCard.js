import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

const ArticleCard = ({ 
  article, 
  variant = 'default', 
  priority = false,
  className = '' 
}) => {
  const baseUrl = 'https://parho.net'
  
  if (variant === 'featured') {
    return (
      <article className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${className}`}>
        <Link href={`/article/${article.slug}`} aria-label={`Read article: ${article.webTitle}`}>
          <div className="cursor-pointer">
            {article.thumbnail && (
              <div className="relative aspect-[16/9] sm:aspect-[5/4] lg:aspect-[16/9]">
                <Image
                  src={article.thumbnail}
                  alt={article.webTitle}
                  fill
                  className="object-cover"
                  priority={priority}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhiuNvAN2cMhZHjvvRDyenBycfai2q1rWbczfSEfaKWTB8XR7xTnxBxYOGcGSg2E7YXjp5jHzR+D8fTVf/Z"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="bg-purple-600 text-white px-2 sm:px-3 py-1 text-xs font-bold uppercase rounded">
                    {article.sectionName}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                  <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2">
                    {article.webTitle}
                  </h1>
                  <div className="text-white/90 text-xs sm:text-sm">
                    <time dateTime={article.webPublicationDate}>
                      {format(new Date(article.webPublicationDate), 'MMM dd, yyyy • h:mm a')}
                    </time>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
        <Link href={`/article/${article.slug}`} aria-label={`Read article: ${article.webTitle}`}>
          <div className="cursor-pointer p-4">
            <div className="flex space-x-3">
              {article.thumbnail && (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                  <Image
                    src={article.thumbnail}
                    alt={article.webTitle}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 640px) 80px, 96px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhiuNvAN2cMhZHjvvRDyenBycfai2q1rWbczfSEfaKWTB8XR7xTnxBxYOGcGSg2E7YXjp5jHzR+D8fTVf/Z"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    {article.sectionName}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-3 hover:text-purple-600 transition-colors leading-tight">
                  {article.webTitle}
                </h3>
                <time className="text-xs text-gray-500" dateTime={article.webPublicationDate}>
                  {format(new Date(article.webPublicationDate), 'MMM dd, h:mm a')}
                </time>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'list') {
    return (
      <article className={`pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 ${className}`}>
        <Link href={`/article/${article.slug}`} aria-label={`Read article: ${article.webTitle}`}>
          <div className="cursor-pointer">
            <div className="flex space-x-3">
              {article.thumbnail && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  <Image
                    src={article.thumbnail}
                    alt={article.webTitle}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 640px) 64px, 80px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhiuNvAN2cMhZHjvvRDyenBycfai2q1rWbczfSEfaKWTB8XR7xTnxBxYOGcGSg2E7YXjp5jHzR+D8fTVf/Z"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    {article.sectionName}
                  </span>
                  <time className="text-xs text-gray-500" dateTime={article.webPublicationDate}>
                    {format(new Date(article.webPublicationDate), 'MMM dd')}
                  </time>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-3 hover:text-purple-600 transition-colors leading-tight">
                  {article.webTitle}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Default variant
  return (
    <article className={`bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow ${className}`}>
      <Link href={`/article/${article.slug}`} aria-label={`Read article: ${article.webTitle}`}>
        <div className="cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {article.sectionName}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(article.webPublicationDate), 'h:mm a')}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-3 hover:text-purple-600 transition-colors leading-tight">
            {article.webTitle}
          </h4>
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard