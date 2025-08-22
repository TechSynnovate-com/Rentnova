'use client'

import { Badge } from '@/components/ui/badge'
import { MapPin, Star } from 'lucide-react'
import { FirebaseProperty } from '@/types/firebase-schema'

interface PropertyMatchIndicatorProps {
  property: FirebaseProperty
  searchTerm?: string
}

export function PropertyMatchIndicator({ property, searchTerm }: PropertyMatchIndicatorProps) {
  if (!searchTerm) return null

  const getMatchType = (): { type: 'exact' | 'high' | 'partial' | 'similar'; score: number; text: string } => {
    const search = searchTerm.toLowerCase().trim()
    const address = property.address?.toLowerCase() || ''
    const city = property.city?.toLowerCase() || ''
    const state = property.state?.toLowerCase() || ''
    const country = property.country?.toLowerCase() || ''
    
    // Exact address match
    if (address === search) {
      return { type: 'exact', score: 100, text: 'Exact Address Match' }
    }
    
    // Exact city or state match
    if (city === search || state === search) {
      return { type: 'exact', score: 95, text: 'Exact Location Match' }
    }
    
    // Address contains search term
    if (address.includes(search)) {
      return { type: 'high', score: 85, text: 'Address Match' }
    }
    
    // Address starts with search term
    if (address.startsWith(search)) {
      return { type: 'high', score: 80, text: 'Address Match' }
    }
    
    // City contains or starts with search term
    if (city.includes(search) || city.startsWith(search)) {
      return { type: 'high', score: 75, text: 'City Match' }
    }
    
    // State contains search term
    if (state.includes(search) || state.startsWith(search)) {
      return { type: 'partial', score: 60, text: 'State Match' }
    }
    
    // Word-based matching
    const searchWords = search.split(/\s+/).filter(word => word.length > 2)
    let wordMatches = 0
    let bestMatch = ''
    
    searchWords.forEach(word => {
      if (address.includes(word)) {
        wordMatches++
        bestMatch = 'Address'
      } else if (city.includes(word)) {
        wordMatches++
        bestMatch = bestMatch || 'City'
      } else if (state.includes(word)) {
        wordMatches++
        bestMatch = bestMatch || 'State'
      }
    })
    
    if (wordMatches > 0) {
      const score = Math.min(70, 30 + (wordMatches * 10))
      return { 
        type: wordMatches >= searchWords.length / 2 ? 'partial' : 'similar', 
        score, 
        text: `${bestMatch} Similar` 
      }
    }
    
    return { type: 'similar', score: 10, text: 'Area Match' }
  }

  const match = getMatchType()
  
  const getVariantAndColor = () => {
    switch (match.type) {
      case 'exact':
        return { variant: 'default' as const, className: 'bg-green-500 text-white' }
      case 'high':
        return { variant: 'default' as const, className: 'bg-blue-500 text-white' }
      case 'partial':
        return { variant: 'secondary' as const, className: 'bg-yellow-500 text-white' }
      case 'similar':
        return { variant: 'outline' as const, className: 'border-gray-300' }
      default:
        return { variant: 'outline' as const, className: 'border-gray-300' }
    }
  }

  const { variant, className } = getVariantAndColor()

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant={variant} className={className}>
        <Star className="h-3 w-3 mr-1" />
        {match.text}
      </Badge>
      <div className="flex items-center text-gray-500">
        <MapPin className="h-3 w-3 mr-1" />
        <span className="truncate max-w-[200px]">
          {property.address || `${property.city}, ${property.state}` || 'Location not specified'}
        </span>
      </div>
    </div>
  )
}

export function getLocationMatchScore(property: FirebaseProperty, searchTerm: string): number {
  const search = searchTerm.toLowerCase().trim()
  const address = property.address?.toLowerCase() || ''
  const city = property.city?.toLowerCase() || ''
  const state = property.state?.toLowerCase() || ''
  const country = property.country?.toLowerCase() || ''
  
  let score = 0
  
  // Exact matches get highest score
  if (address === search) score += 100
  if (city === search) score += 90
  if (state === search) score += 80
  
  // Partial matches in address get high score
  if (address.includes(search)) score += 70
  
  // Starts with matches
  if (address.startsWith(search)) score += 60
  if (city.startsWith(search)) score += 50
  if (state.startsWith(search)) score += 40
  
  // Contains matches
  if (city.includes(search)) score += 30
  if (state.includes(search)) score += 20
  if (country.includes(search)) score += 10
  
  // Word-based matching
  const searchWords = search.split(/\s+/).filter(word => word.length > 2)
  searchWords.forEach(word => {
    if (address.includes(word)) score += 15
    if (city.includes(word)) score += 10
    if (state.includes(word)) score += 5
  })
  
  return score
}