import { useState, useEffect } from 'react'

const useTopSections = () => {
  const [topSections, setTopSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTopSections = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/top-sections')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      setTopSections(data.sections || [])
    } catch (error) {
      console.error('Failed to load top sections:', error)
      setError(error.message)
      
      // Fallback to default sections if API fails
      setTopSections([
        { name: 'Politics', count: 0 },
        { name: 'World', count: 0 },
        { name: 'Business', count: 0 },
        { name: 'Sports', count: 0 },
        { name: 'Technology', count: 0 }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopSections()
  }, [])

  const refetch = () => {
    fetchTopSections()
  }

  return { 
    topSections, 
    loading, 
    error, 
    refetch 
  }
}

export default useTopSections