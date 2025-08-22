import OpenAI from 'openai'
import { FirebaseProperty } from '@/types/firebase-schema'

// User preference types
export interface UserPreferences {
  budget: { min: number; max: number }
  location: string[]
  propertyTypes: string[]
  bedrooms: number
  lifestyle: string
  workStyle: 'remote' | 'office' | 'hybrid' | 'student'
  familySize: number
  petOwner: boolean
  commutePriority: boolean
  amenityPreferences: string[]
  moveInTimeframe: string
}

export interface RecommendationScore {
  propertyId: string
  score: number
  reasons: string[]
  matchPercentage: number
}

export interface RecommendationResult {
  recommendations: (FirebaseProperty & { score: RecommendationScore })[]
  summary: string
  cached: boolean
}

// Cache implementation to reduce API calls
class RecommendationCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttlMinutes: number = 60) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    })
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  generateKey(preferences: UserPreferences, propertyCount: number): string {
    return `rec_${JSON.stringify(preferences)}_${propertyCount}`.replace(/\s/g, '')
  }
}

const cache = new RecommendationCache()

// Local scoring algorithm (no API needed)
function calculateLocalScore(property: FirebaseProperty, preferences: UserPreferences): RecommendationScore {
  let score = 0
  const reasons: string[] = []
  const maxScore = 100
  
  // Budget matching (25 points)
  if (property.price >= preferences.budget.min && property.price <= preferences.budget.max) {
    score += 25
    reasons.push('Within your budget range')
  } else if (property.price < preferences.budget.max * 1.1) {
    score += 15
    reasons.push('Slightly above budget but good value')
  }
  
  // Location preference (20 points)
  if (preferences.location.some(loc => 
    property.city.toLowerCase().includes(loc.toLowerCase()) || 
    property.state.toLowerCase().includes(loc.toLowerCase())
  )) {
    score += 20
    reasons.push('In your preferred location')
  }
  
  // Property type (15 points)
  if (preferences.propertyTypes.includes(property.propertyType)) {
    score += 15
    reasons.push(`Matches your ${property.propertyType} preference`)
  }
  
  // Bedroom count (15 points)
  if (property.bedroomCount === preferences.bedrooms) {
    score += 15
    reasons.push('Perfect bedroom count match')
  } else if (Math.abs(property.bedroomCount - preferences.bedrooms) === 1) {
    score += 8
    reasons.push('Close to ideal bedroom count')
  }
  
  // Amenities matching (15 points)
  const propertyAmenities = [
    ...(property.buildingAmenities || []),
    ...(property.utilities || []),
    ...(property.furnishings || [])
  ].map(a => a.toLowerCase())
  
  const matchedAmenities = preferences.amenityPreferences.filter(pref =>
    propertyAmenities.some(amenity => amenity.includes(pref.toLowerCase()))
  )
  
  if (matchedAmenities.length > 0) {
    const amenityScore = Math.min(15, (matchedAmenities.length / preferences.amenityPreferences.length) * 15)
    score += amenityScore
    reasons.push(`Has ${matchedAmenities.length} of your preferred amenities`)
  }
  
  // Lifestyle matching (10 points)
  if (preferences.lifestyle === 'luxury' && property.propertyType === 'penthouse') {
    score += 10
    reasons.push('Matches luxury lifestyle')
  } else if (preferences.lifestyle === 'minimalist' && property.propertyType === 'studio') {
    score += 10
    reasons.push('Perfect for minimalist lifestyle')
  } else if (preferences.lifestyle === 'family' && property.bedroomCount >= 3) {
    score += 10
    reasons.push('Great for family living')
  }
  
  return {
    propertyId: property.id!,
    score,
    reasons,
    matchPercentage: Math.round((score / maxScore) * 100)
  }
}

// AI enhancement (only used sparingly)
async function enhanceWithAI(
  topProperties: (FirebaseProperty & { score: RecommendationScore })[],
  preferences: UserPreferences
): Promise<string> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    })
    
    const prompt = `Based on user preferences for ${preferences.lifestyle} lifestyle, ${preferences.workStyle} work style, budget ${preferences.budget.min}-${preferences.budget.max}, and ${preferences.bedrooms} bedrooms in ${preferences.location.join(', ')}, create a brief personalized summary (max 150 words) for these top property matches:

${topProperties.slice(0, 3).map(p => 
  `- ${p.propertyTitle || p.propertyType} in ${p.city} (${p.score.matchPercentage}% match): ${p.score.reasons.join(', ')}`
).join('\n')}

Make it conversational and highlight why these are perfect for their lifestyle.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use cheaper model for cost efficiency
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    })
    
    return response.choices[0].message.content || 'Here are your personalized property recommendations based on your preferences.'
  } catch (error) {
    console.warn('AI enhancement failed, using fallback:', error)
    return `Based on your ${preferences.lifestyle} lifestyle and ${preferences.workStyle} work preference, I've found ${topProperties.length} properties that match your criteria. These selections prioritize your budget range and location preferences while considering your need for ${preferences.bedrooms} bedrooms.`
  }
}

export class RecommendationEngine {
  static async getRecommendations(
    properties: FirebaseProperty[],
    preferences: UserPreferences,
    useAI: boolean = false
  ): Promise<RecommendationResult> {
    // Check cache first
    const cacheKey = cache.generateKey(preferences, properties.length)
    const cached = cache.get(cacheKey)
    
    if (cached) {
      return { ...cached, cached: true }
    }
    
    // Calculate local scores for all properties
    const scoredProperties = properties
      .map(property => ({
        ...property,
        score: calculateLocalScore(property, preferences)
      }))
      .filter(p => p.score.score > 20) // Only include decent matches
      .sort((a, b) => b.score.score - a.score.score)
      .slice(0, 10) // Top 10 matches
    
    // Use AI enhancement sparingly (only for top results and if explicitly requested)
    let summary = ''
    if (useAI && scoredProperties.length > 0) {
      summary = await enhanceWithAI(scoredProperties, preferences)
    } else {
      // Fallback summary without AI
      const avgScore = scoredProperties.reduce((sum, p) => sum + p.score.matchPercentage, 0) / scoredProperties.length
      summary = `I found ${scoredProperties.length} properties matching your preferences with an average compatibility of ${Math.round(avgScore)}%. These selections consider your budget, location, and lifestyle requirements.`
    }
    
    const result: RecommendationResult = {
      recommendations: scoredProperties,
      summary,
      cached: false
    }
    
    // Cache results for 1 hour
    cache.set(cacheKey, result, 60)
    
    return result
  }
  
  // Quick preference-based filtering (no AI needed)
  static getQuickMatches(
    properties: FirebaseProperty[],
    preferences: Partial<UserPreferences>
  ): FirebaseProperty[] {
    return properties
      .filter(property => {
        if (preferences.budget && 
           (property.price < preferences.budget.min || property.price > preferences.budget.max)) {
          return false
        }
        
        if (preferences.propertyTypes && 
            !preferences.propertyTypes.includes(property.propertyType)) {
          return false
        }
        
        if (preferences.bedrooms && property.bedroomCount < preferences.bedrooms) {
          return false
        }
        
        if (preferences.location && 
            !preferences.location.some(loc =>
              property.city.toLowerCase().includes(loc.toLowerCase()) ||
              property.state.toLowerCase().includes(loc.toLowerCase())
            )) {
          return false
        }
        
        return true
      })
      .slice(0, 20) // Limit results
  }
}

// Preset recommendation templates (no AI needed)
export const RECOMMENDATION_PRESETS = {
  student: {
    propertyTypes: ['apartment', 'studio'],
    amenityPreferences: ['wifi', 'study area', 'public transport'],
    lifestyle: 'minimalist',
    workStyle: 'student' as const
  },
  young_professional: {
    propertyTypes: ['apartment', 'condo'],
    amenityPreferences: ['gym', 'wifi', 'parking', 'security'],
    lifestyle: 'modern',
    workStyle: 'hybrid' as const
  },
  family: {
    propertyTypes: ['house', 'duplex'],
    amenityPreferences: ['garden', 'parking', 'schools nearby', 'playground'],
    lifestyle: 'family',
    workStyle: 'office' as const
  },
  luxury_seeker: {
    propertyTypes: ['penthouse', 'luxury apartment'],
    amenityPreferences: ['pool', 'concierge', 'gym', 'spa', 'valet'],
    lifestyle: 'luxury',
    workStyle: 'remote' as const
  }
} as const