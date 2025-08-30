'use client'

/**
 * Hero Section Component
 * Compelling landing page hero with search functionality
 * 
 * Features:
 * - Dynamic property search with location autocomplete
 * - Animated call-to-action buttons
 * - Statistics display for platform credibility
 * - Responsive design with modern gradients
 * - Mobile-optimized layout
 * 
 * @author RentNova Development Team
 * @version 1.0.0
 */

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Filter, Bed, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/lib/queries/properties'
import { PropertyMatchIndicator } from '@/components/property-match-indicator'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCountry } from '@/contexts/country-context'

export function HeroSection() {
  const [searchLocation, setSearchLocation] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { formatPrice } = useCountry()

  // Get properties for live search results (limit to 6 for preview)
  const { data: allProperties = [], isLoading } = useProperties()

  // Filter properties based on search term with same logic as properties page
  const searchResults = useMemo(() => {
    if (!searchLocation.trim() || searchLocation.length < 2) return []
    
    const searchTerm = searchLocation.toLowerCase().trim()
    
    // Filter properties with location matching
    const filtered = allProperties.filter(property => {
      const address = property.address?.toLowerCase() || ''
      const city = property.city?.toLowerCase() || ''
      const state = property.state?.toLowerCase() || ''
      const country = property.country?.toLowerCase() || ''
      
      // Create full location string for comprehensive search
      const fullLocation = `${address} ${city} ${state} ${country}`.toLowerCase()
      
      // Check if search term matches any part of the location
      return (
        address.includes(searchTerm) ||
        city.includes(searchTerm) ||
        state.includes(searchTerm) ||
        country.includes(searchTerm) ||
        fullLocation.includes(searchTerm) ||
        // Word-based matching
        searchTerm.split(/\s+/).some(word => 
          word.length > 2 && (
            address.includes(word) ||
            city.includes(word) ||
            state.includes(word) ||
            country.includes(word)
          )
        )
      )
    })

    // Sort by relevance using same scoring as properties page
    return filtered.slice().sort((a, b) => {
      const aScore = getLocationMatchScore(a, searchTerm)
      const bScore = getLocationMatchScore(b, searchTerm)
      return bScore - aScore
    }).slice(0, 6) // Limit to 6 results for preview
  }, [allProperties, searchLocation])

  // Location match scoring function (same as properties page)
  function getLocationMatchScore(property: any, searchTerm: string): number {
    const search = searchTerm.toLowerCase().trim()
    const address = property.address?.toLowerCase() || ''
    const city = property.city?.toLowerCase() || ''
    const state = property.state?.toLowerCase() || ''
    
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
    
    // Word-based matching
    const searchWords = search.split(/\s+/).filter(word => word.length > 2)
    searchWords.forEach(word => {
      if (address.includes(word)) score += 15
      if (city.includes(word)) score += 10
      if (state.includes(word)) score += 5
    })
    
    return score
  }

  const handleSearch = () => {
    if (searchLocation.trim()) {
      // Navigate to properties page with location filter
      const searchParams = new URLSearchParams()
      searchParams.set('location', searchLocation.trim())
      router.push(`/properties?${searchParams.toString()}`)
    } else {
      // No search term, just go to properties page
      router.push('/properties')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchLocation(value)
    setShowResults(value.length >= 2)
    setIsSearching(value.length >= 2)
  }

  const handleInputFocus = () => {
    if (searchLocation.length >= 2) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowResults(false)
      setIsSearching(false)
    }, 200)
  }

  return (
    <section className="relative bg-gradient-to-br from-lavender-50 via-white to-lavender-100 py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 sm:px-0">
            Find Your Perfect
            <span className="block text-lavender-600">Rental Home</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
            Discover amazing rental properties, streamline applications, and manage your rental journey with our comprehensive platform designed for modern tenants and landlords.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Enter address, city, state..."
                  className="pl-9 sm:pl-10 h-10 sm:h-12 border-0 text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
                  value={searchLocation}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />

                {/* Live Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-80 sm:max-h-96 overflow-y-auto mx-2 sm:mx-0"
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                          Found {searchResults.length} properties
                        </h3>
                        <button
                          onClick={handleSearch}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all →
                        </button>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        {searchResults.map((property) => (
                          <Link 
                            key={property.id} 
                            href={`/properties/${property.id}`}
                            className="block"
                          >
                            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {property.imageUrls?.[0] ? (
                                  <Image
                                    src={property.imageUrls[0]}
                                    alt={property.propertyTitle || 'Property'}
                                    fill
                                    sizes="(max-width: 640px) 48px, 64px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {property.address || `${property.city}, ${property.state}`}
                                </p>
                                
                                {/* Property Match Indicator */}
                                <div className="mt-1">
                                  <PropertyMatchIndicator 
                                    property={property} 
                                    searchTerm={searchLocation} 
                                  />
                                </div>
                              </div>
                              
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs sm:text-sm font-semibold text-green-600">
                                  {formatPrice(property.price)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {property.bedroomCount}BR • {property.toiletCount}BA
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* No Results Message */}
                {showResults && searchLocation.length >= 2 && searchResults.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 p-4"
                  >
                    <div className="text-center py-4">
                      <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        No properties found for "{searchLocation}"
                      </p>
                      <button
                        onClick={handleSearch}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                      >
                        Search all properties →
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-10 sm:h-12 px-6 sm:px-8 text-base sm:text-lg"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  <Search className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{isLoading ? 'Searching...' : 'Search Properties'}</span>
                  <span className="sm:hidden">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/register?role=tenant">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                I'm Looking to Rent
              </Button>
            </Link>
            <Link href="/auth/register?role=landlord">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                I'm a Property Owner
              </Button>
            </Link>
          </div>

          {/* AI Recommendations CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or let AI find your perfect match</p>
            <Link href="/recommendations">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                🤖 Get AI Property Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}