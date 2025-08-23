import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { format } from 'date-fns'
import slugify from 'slugify'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

// Ensure content directory exists
export function ensureContentDirectory() {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true })
  }
}

// Get all articles sorted by publication date (newest first)
export function getAllArticles() {
  ensureContentDirectory()
  
  const fileNames = fs.readdirSync(articlesDirectory).filter(name => name.endsWith('.mdx'))
  
  const allArticlesData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '')
    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      ...data,
    }
  })

  // Sort by webPublicationDate (newest first)
  return allArticlesData.sort((a, b) => {
    return new Date(b.webPublicationDate) - new Date(a.webPublicationDate)
  })
}

// Get article by slug
export function getArticleBySlug(slug) {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    ...data,
  }
}

// Check if article exists by Guardian ID
export function articleExistsByGuardianId(guardianId) {
  ensureContentDirectory()
  
  const fileNames = fs.readdirSync(articlesDirectory).filter(name => name.endsWith('.mdx'))
  
  for (const fileName of fileNames) {
    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    
    if (data.guardianId === guardianId) {
      return true
    }
  }
  
  return false
}

// Create slug from title
export function createSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
}

// Save article as MDX file
export function saveArticleAsMDX(article) {
  ensureContentDirectory()
  
  const slug = createSlug(article.webTitle)
  const fileName = `${slug}.mdx`
  const filePath = path.join(articlesDirectory, fileName)
  
  // Create frontmatter
  const frontmatter = {
    guardianId: article.id,
    webTitle: article.webTitle,
    sectionName: article.sectionName,
    webPublicationDate: article.webPublicationDate,
    bodyText: article.fields?.bodyText || '',
    headline: article.fields?.headline || article.webTitle,
    thumbnail: article.fields?.thumbnail || '',
    slug: slug,
    webUrl: article.webUrl
  }
  
  // Create content with frontmatter
  const content = matter.stringify(article.fields?.bodyText || '', frontmatter)
  
  // Write file
  fs.writeFileSync(filePath, content)
  
  return slug
}

// Get articles for sitemap
export function getArticlesForSitemap() {
  const articles = getAllArticles()
  return articles.map(article => ({
    slug: article.slug,
    lastModified: article.webPublicationDate
  }))
}

// Get recent articles for homepage
export function getRecentArticles(limit = 10) {
  const articles = getAllArticles()
  return articles.slice(0, limit)
}

// Get articles by section
export function getArticlesBySection(sectionName) {
  const articles = getAllArticles()
  return articles.filter(article => 
    article.sectionName.toLowerCase() === sectionName.toLowerCase()
  )
}

// Get unique sections
export function getAllSections() {
  const articles = getAllArticles()
  const sections = [...new Set(articles.map(article => article.sectionName))]
  return sections.sort()
}