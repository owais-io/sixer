import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

const SectionGrid = ({ sectionArticles }) => {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Object.entries(sectionArticles).map(([section, sectionArticlesList]) => (
          <div key={section} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">{section}</h2>
            </div>
            
            {/* Section Articles */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {sectionArticlesList.slice(0, 4).map((article, index) => (
                  <article key={article.guardianId}>
                    <Link href={`/article/${article.slug}`} aria-label={`Read article: ${article.webTitle}`}>
                      <div className="cursor-pointer">
                        {index === 0 && article.thumbnail ? (
                          // First article with image
                          <div>
                            <div className="relative aspect-[5/4] mb-3 rounded-lg overflow-hidden">
                              <Image
                                src={article.thumbnail}
                                alt={article.webTitle}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhiuNvAN2cMhZHjvvRDyenBycfai2q1rWbczfSEfaKWTB8XR7xTnxBxYOGcGSg2E7YXjp5jHzR+D8fTVf/Z"
                              />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-3 hover:text-purple-600 transition-colors leading-tight">
                              {article.webTitle}
                            </h3>
                            <div className="text-xs sm:text-sm text-gray-500">
                              <time dateTime={article.webPublicationDate}>
                                {format(new Date(article.webPublicationDate), 'MMM dd')}
                              </time>
                            </div>
                          </div>
                        ) : (
                          // Other articles - text only
                          <div className={`${index > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-purple-600 transition-colors leading-tight">
                              {article.webTitle}
                            </h4>
                            <div className="text-xs text-gray-500">
                              <time dateTime={article.webPublicationDate}>
                                {format(new Date(article.webPublicationDate), 'MMM dd')}
                              </time>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SectionGrid