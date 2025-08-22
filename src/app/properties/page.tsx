'use client'

import { useState, useMemo, useEffect } from 'react'


import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Star,
  Loader2,
  Building,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCountry } from '@/contexts/country-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useProperties } from '@/lib/queries/properties'
import { PropertyMatchIndicator } from '@/components/property-match-indicator'
import { motion } from 'framer-motion'

// Search filters interface
interface SearchFilters {
  query: string
  city: string
  state: string
  propertyType: string
  minPrice: number
  maxPrice: number
  bedrooms: number
}

export default function PropertiesPage() {
  const { formatPrice } = useCountry()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  // Search filters state
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: '',
    state: '',
    propertyType: '',
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0
  })
  const [showFilters, setShowFilters] = useState(false)

  // Read URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const locationParam = searchParams.get('location')
      const queryParam = searchParams.get('query')
      
      console.log('URL parameters:', {
        location: locationParam,
        query: queryParam,
        allParams: Object.fromEntries(searchParams.entries())
      })
      
      if (locationParam || queryParam) {
        setFilters(prevFilters => ({
          ...prevFilters,
          query: queryParam || locationParam || '',
          city: searchParams.get('city') || '',
          state: searchParams.get('state') || '',
          propertyType: searchParams.get('propertyType') || '',
          minPrice: parseInt(searchParams.get('minPrice') || '0'),
          maxPrice: parseInt(searchParams.get('maxPrice') || '10000000'),
          bedrooms: parseInt(searchParams.get('bedrooms') || '0')
        }))
      }
    }
  }, [])

  // Fetch properties with filters using TanStack Query
  const { data: properties = [], isLoading, error } = useProperties({
    city: filters.city || undefined,
    state: filters.state || undefined,
    propertyType: filters.propertyType || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice < 10000000 ? filters.maxPrice : undefined,
    bedrooms: filters.bedrooms || undefined,
    location: filters.query || undefined // Use query as location search
  })

  // Sort properties by relevance when there's a search query
  const filteredProperties = useMemo(() => {
    console.log('Filtering properties with query:', filters.query)
    console.log('Available properties:', properties.length)
    
    if (!filters.query) {
      console.log('No query, returning all properties')
      return properties
    }
    
    // The properties should already be filtered by the backend query
    // Here we just sort by relevance for display
    const sorted = properties.slice().sort((a, b) => {
      const aScore = getLocationMatchScore(a, filters.query)
      const bScore = getLocationMatchScore(b, filters.query)
      return bScore - aScore
    })
    
    console.log('Filtered and sorted properties:', sorted.length)
    return sorted
  }, [properties, filters.query])

  // Import the scoring function from the match indicator
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

  // Update filter function
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Properties</h2>
            <p className="text-gray-600">We encountered an issue loading properties. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0">
              Find Your Perfect Property
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-4 sm:px-0">
              {filters.query ? 
                `Showing results for "${filters.query}"` : 
                'Discover amazing properties across Nigeria, Ghana, South Africa, and the US'
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-3 sm:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by location, property type..."
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    className="h-10 sm:h-12 text-base sm:text-lg text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="h-10 sm:h-12 px-4 sm:px-6"
                >
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
                <Button className="h-10 sm:h-12 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Go</span>
                </Button>
              </div>
              
              {/* Advanced Filters */}
              {showFilters && (
                <motion.div 
                  className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <select
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                      className="h-10 rounded-md border border-gray-300 px-3 text-gray-700"
                    >
                      <option value="">All Cities</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Accra">Accra</option>
                      <option value="Cape Town">Cape Town</option>
                      <option value="New York">New York</option>
                    </select>
                    
                    <select
                      value={filters.propertyType}
                      onChange={(e) => updateFilter('propertyType', e.target.value)}
                      className="h-10 rounded-md border border-gray-300 px-3 text-gray-700"
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="duplex">Duplex</option>
                      <option value="bungalow">Bungalow</option>
                    </select>
                    
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => updateFilter('bedrooms', parseInt(e.target.value) || 0)}
                      className="h-10 rounded-md border border-gray-300 px-3 text-gray-700"
                    >
                      <option value="0">Any Bedrooms</option>
                      <option value="1">1+ Bedrooms</option>
                      <option value="2">2+ Bedrooms</option>
                      <option value="3">3+ Bedrooms</option>
                      <option value="4">4+ Bedrooms</option>
                    </select>
                    
                    <select
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 10000000)}
                      className="h-10 rounded-md border border-gray-300 px-3 text-gray-700"
                    >
                      <option value="10000000">Any Price</option>
                      <option value="500000">Under ₦500K</option>
                      <option value="1000000">Under ₦1M</option>
                      <option value="2000000">Under ₦2M</option>
                      <option value="5000000">Under ₦5M</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  `${filteredProperties.length} Properties Found`
                )}
              </h2>
              {!isLoading && (
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {filters.query 
                    ? `Search results for "${filters.query}" - sorted by relevance`
                    : 'Showing all available properties'
                  }
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && filteredProperties.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden h-full">
                    <div className="relative">
                      <Image
                        src={property.imageUrls?.[0] || '/placeholder-property.jpg'}
                        alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        width={400}
                        height={250}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <Badge 
                          className={`text-xs sm:text-sm ${property.propertyType === 'house' 
                            ? 'bg-green-500' 
                            : property.propertyType === 'apartment' 
                            ? 'bg-blue-500' 
                            : 'bg-purple-500'
                          } text-white`}
                        >
                          {property.propertyType}
                        </Badge>
                      </div>
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (isFavorite(property.id!)) {
                              removeFromFavorites(property.id!)
                            } else {
                              addToFavorites(property.id!)
                            }
                          }}
                          className={`w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm hover:bg-white ${
                            isFavorite(property.id!) ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite(property.id!) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                        <div className="flex items-center space-x-1 text-white text-xs sm:text-sm">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6 flex-1">
                      <Link href={`/properties/${property.id}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                          {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        </h3>
                      </Link>
                      <div className="flex items-center text-gray-600 mb-3 sm:mb-4">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{property.city}, {property.state}</span>
                      </div>
                      
                      {/* Property Match Indicator */}
                      {filters.query && (
                        <div className="mb-4">
                          <PropertyMatchIndicator 
                            property={property} 
                            searchTerm={filters.query} 
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span>{property.bedroomCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span>{property.toiletCount}</span>
                          </div>
                          {property.size && (
                            <div className="flex items-center">
                              <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">{property.size} sqft</span>
                              <span className="sm:hidden">{property.size}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.viewCount || 0} views
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">
                          {formatPrice(property.price)}
                          <span className="text-xs sm:text-sm font-normal text-gray-500">/month</span>
                        </div>
                        <Link href={`/properties/${property.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4">
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProperties.length === 0 && (
            <motion.div 
              className="text-center py-12 sm:py-16 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Properties Found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                {filters.query ? 
                  `No properties match your search "${filters.query}". Try adjusting your filters.` :
                  'No properties are currently available. Check back later for new listings.'
                }
              </p>
              <Button 
                onClick={() => setFilters({
                  query: '',
                  city: '',
                  state: '',
                  propertyType: '',
                  minPrice: 0,
                  maxPrice: 10000000,
                  bedrooms: 0
                })}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  )
}