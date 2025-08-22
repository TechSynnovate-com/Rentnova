'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useFeaturedProperties } from '@/lib/queries/properties'
import { useCountry } from '@/contexts/country-context'
import { motion } from 'framer-motion'

export function FeaturedPropertiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { data: allProperties = [], isLoading } = useFeaturedProperties()
  
  // Filter only featured properties
  const properties = allProperties.filter(property => property.isFeatured)
  const { formatPrice } = useCountry()
  const carouselRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Featured Properties</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Featured Properties</h2>
            <p className="text-sm sm:text-base text-gray-600">No featured properties available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, properties.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, properties.length - 2)) % Math.max(1, properties.length - 2))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our handpicked selection of premium properties across Nigeria, Ghana, South Africa, and the US
          </motion.p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="bg-white shadow-md hover:shadow-lg w-8 h-8 sm:w-10 sm:h-10"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="bg-white shadow-md hover:shadow-lg w-8 h-8 sm:w-10 sm:h-10"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="bg-white shadow-md hover:shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2">
                <span className="hidden sm:inline">View All Properties</span>
                <span className="sm:hidden">View All</span>
              </Button>
            </Link>
          </div>

          {/* Mobile: Show single property */}
          <div className="sm:hidden">
            <div className="grid grid-cols-1 gap-4">
              {properties.slice(currentIndex, currentIndex + 1).map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={property.imageUrls?.[0] || '/placeholder-property.jpg'}
                        alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white text-xs">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600">
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/properties/${property.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                          {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        </h3>
                      </Link>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span className="text-sm truncate">{property.city}, {property.state}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            <span>{property.bedroomCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 mr-1" />
                            <span>{property.toiletCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(property.price)}
                          <span className="text-xs font-normal text-gray-500">/month</span>
                        </div>
                        <Link href={`/properties/${property.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-3">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Show carousel */}
          <div 
            ref={carouselRef}
            className="hidden sm:block overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={property.imageUrls?.[0] || '/placeholder-property.jpg'}
                        alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        width={400}
                        height={250}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <Badge className="bg-green-500 text-white text-xs sm:text-sm">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center space-x-1 text-white text-sm">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        </h3>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{property.city}, {property.state}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedroomCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.toiletCount}</span>
                          </div>
                          {property.size && (
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              <span>{property.size} sqft</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(property.price)}
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        </div>
                        <Link href={`/properties/${property.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}