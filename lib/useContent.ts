import { useState, useEffect } from 'react'

interface ContentData {
  [key: string]: string
}

export const useContent = () => {
  const [content, setContent] = useState<ContentData>({
    hero_title: 'Book Your Perfect Event',
    hero_subtitle: 'Reserve our beautiful orangerie for your special occasions, parties, and gatherings. A stunning venue surrounded by nature.',
    feature1_title: 'Beautiful Venue',
    feature1_description: 'A stunning glass orangerie perfect for weddings, parties, and corporate events.',
    feature2_title: 'Easy Booking',
    feature2_description: 'Simple online booking system with real-time availability checking.',
    feature3_title: 'Full Service',
    feature3_description: 'Complete event support with catering options and event planning assistance.'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContent(prev => ({ ...prev, ...data.content }))
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      // Keep default content if API fails
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      })

      if (response.ok) {
        setContent(prev => ({ ...prev, [key]: value }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating content:', error)
      return false
    }
  }

  return { content, loading, updateContent, refetch: fetchContent }
}
