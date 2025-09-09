import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Get all content settings
      const { data: content, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true })

      if (error) {
        console.error('Error fetching content:', error)
        return res.status(500).json({ error: 'Failed to fetch content' })
      }

      // Convert array to object for easier use
      const contentObj = content?.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {}) || {}

      return res.json({
        content: contentObj
      })
    } catch (error) {
      console.error('Error in content GET handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { key, value } = req.body
      
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' })
      }

      // Upsert the content (update if exists, insert if not)
      const { data, error } = await supabase
        .from('site_content')
        .upsert({ key, value }, { onConflict: 'key' })
        .select()

      if (error) {
        console.error('Error updating content:', error)
        return res.status(500).json({ error: 'Failed to update content' })
      }

      return res.json({
        success: true,
        message: 'Content updated successfully',
        content: data[0]
      })
    } catch (error) {
      console.error('Error in content PUT handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
