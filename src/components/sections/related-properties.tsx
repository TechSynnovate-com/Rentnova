'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Square, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProperties } from '@/lib/queries/properties'
import { useCountry } from '@/contexts/country-context'
import { useFavorites } from '@/contexts/favorites-context'
import { motion, AnimatePresence } from 'framer-motion'
import { FirebaseProperty } from '@/types/firebase-schema'

interface RelatedPropertiesProps {
  currentProperty?: FirebaseProperty
  searchLocation?: string
  maxProperties?: number
}

export function RelatedProperties({ 
  currentProperty, 
  searchLocation,
  maxProperties = 12 
}: RelatedPropertiesProps) {
  const { formatPrice } = useCountry()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [relatedProperties, setRelatedProperties] = useState<FirebaseProperty[]>([])

  // Determine search criteria based on current property or search location
  const searchCriteria = currentProperty ? {
    location: `${currentProperty.city} ${currentProperty.state}`.trim()
  } : searchLocation ? {
    location: searchLocation
  } : {}

  const { data: properties = [], isLoading } = useProperties(searchCriteria)

  useEffect(() => {
    if (properties.length > 0) {
      let filtered = properties

      // Filter out current property if we're showing related properties
      if (currentProperty) {
        filtered = properties.filter(p => p.id !== currentProperty.id)
      }

      // If we have a location-based search, sort by relevance
      if (searchLocation || currentProperty) {
        const searchTerm = searchLocation || `${currentProperty?.city} ${currentProperty?.state}`.trim()
        
        // Sort by location relevance 
        filtered.sort((a, b) => {
          const aRelevance = calculateLocationRelevance(a, searchTerm)
          const bRelevance = calculateLocationRelevance(b, searchTerm)
          return bRelevance - aRelevance
        })
      }

      // Limit the number of properties
      setRelatedProperties(filtered.slice(0, maxProperties))
    }
  }, [properties, currentProperty, searchLocation, maxProperties])

  function calculateLocationRelevance(property: FirebaseProperty, searchTerm: string): number {
    const search = searchTerm.toLowerCase()
    const address = property.address?.toLowerCase() || ''
    const city = property.city?.toLowerCase() || ''
    const state = property.state?.toLowerCase() || ''
    
    let score = 0
    
    if (address.includes(search)) score += 50
    if (city.includes(search)) score += 30
    if (state.includes(search)) score += 20
    
    // Check individual words
    const searchWords = search.split(/\s+/)
    searchWords.forEach(word => {
      if (word.length > 2) {
        if (city.includes(word)) score += 15
        if (state.includes(word)) score += 10
        if (address.includes(word)) score += 25
      }
    })
    
    return score
  }

  const handleFavoriteToggle = async (property: FirebaseProperty) => {
    try {
      if (isFavorite(property.id)) {
        await removeFromFavorites(property.id)
      } else {
        await addToFavorites(property.id)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % relatedProperties.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + relatedProperties.length) % relatedProperties.length)
  }

  const getDisplayedProperties = () => {
    const displayed = []
    for (let i = 0; i < Math.min(3, relatedProperties.length); i++) {
      const index = (currentIndex + i) % relatedProperties.length
      displayed.push(relatedProperties[index])
    }
    return displayed
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentProperty ? 'Related Properties' : 'Properties Near You'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (relatedProperties.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentProperty ? 'Related Properties' : 'Properties Near You'}
            </h2>
            <p className="text-gray-600 mb-8">
              No related properties found in this area. Explore our full listings.
            </p>
            <Link href="/properties">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const title = currentProperty 
    ? `Related Properties in ${currentProperty.city || currentProperty.state || 'this area'}`
    : searchLocation 
    ? `Properties in ${searchLocation}`
    : 'Related Properties'

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600">
              Discover similar properties in the area
            </p>
          </motion.div>

          {relatedProperties.length > 3 && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="bg-white shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="bg-white shadow-md hover:shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {getDisplayedProperties().map((property, index) => (
              <motion.div
                key={`${property.id}-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={property.images?.[0] || property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'}
                        alt={property.propertyTitle || 'Property'}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Property Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant={property.status === 'approved' || property.status === 'active' ? 'default' : 'secondary'}
                        className="bg-white/90 text-gray-800 font-medium"
                      >
                        {property.status === 'approved' || property.status === 'active' ? 'Available' : 'Occupied'}
                      </Badge>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                      onClick={() => handleFavoriteToggle(property)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          isFavorite(property.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                        {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">
                          {property.city && property.state 
                            ? `${property.city}, ${property.state}`
                            : property.city || property.state || 'Location not specified'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedroomCount || 0}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.toiletCount || 0}
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.size || 'N/A'} sqm
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-lavender-600">
                          {formatPrice(property.price)}
                        </span>
                        <span className="text-gray-600 text-sm">/month</span>
                      </div>
                      
                      <Link href={`/properties/${property.id}`}>
                        <Button size="sm" className="bg-lavender-600 hover:bg-lavender-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {relatedProperties.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/properties">
              <Button variant="outline" size="lg">
                View All Properties in Area
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}