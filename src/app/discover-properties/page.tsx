'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { 
  Search, 
  Heart, 
  MapPin, 
  Filter, 
  Building,
  Star,
  Bed,
  Bath,
  Square,
  ArrowRight,
  SlidersHorizontal,
  Grid3X3,
  List
} from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: string
  propertyTitle: string
  propertyType: string
  city: string
  state: string
  country: string
  monthlyRent: number
  bedroomCount: number
  bathroomCount: number
  squareFootage: number
  images: string[]
  description: string
  amenities: string[]
  status: string
  isFeatured: boolean
  landlordId: string
  createdAt: Date
}

// Mock properties data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    propertyTitle: 'Modern 2BR Apartment in Victoria Island',
    propertyType: 'apartment',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    monthlyRent: 850000,
    bedroomCount: 2,
    bathroomCount: 2,
    squareFootage: 1200,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    description: 'Beautiful modern apartment with stunning city views',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
    status: 'approved',
    isFeatured: true,
    landlordId: 'landlord1',
    createdAt: new Date()
  },
  {
    id: '2', 
    propertyTitle: 'Luxury 3BR House in Lekki',
    propertyType: 'house',
    city: 'Lagos',
    state: 'Lagos', 
    country: 'Nigeria',
    monthlyRent: 1200000,
    bedroomCount: 3,
    bathroomCount: 3,
    squareFootage: 1800,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    description: 'Spacious family home in prime location',
    amenities: ['Garden', 'Garage', 'Security', 'Generator'],
    status: 'approved',
    isFeatured: false,
    landlordId: 'landlord2',
    createdAt: new Date()
  },
  {
    id: '3',
    propertyTitle: 'Cozy Studio in Accra Central',
    propertyType: 'studio',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    monthlyRent: 450000,
    bedroomCount: 1,
    bathroomCount: 1,
    squareFootage: 600,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    description: 'Perfect for young professionals',
    amenities: ['WiFi', 'AC', 'Furnished'],
    status: 'approved',
    isFeatured: true,
    landlordId: 'landlord3',
    createdAt: new Date()
  }
]

export default function DiscoverPropertiesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Favorites state (mock)
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Filter properties based on search criteria
  const filteredProperties = mockProperties.filter(property => {
    const matchesQuery = !searchQuery || 
      property.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLocation = !selectedLocation || 
      property.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      property.state.toLowerCase().includes(selectedLocation.toLowerCase())
    
    const matchesType = !selectedType || property.propertyType === selectedType
    
    const matchesMinPrice = !minPrice || property.monthlyRent >= parseInt(minPrice)
    const matchesMaxPrice = !maxPrice || property.monthlyRent <= parseInt(maxPrice)
    const matchesBedrooms = !bedrooms || property.bedroomCount >= parseInt(bedrooms)
    
    return matchesQuery && matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice && matchesBedrooms
  })
  
  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLocation('')
    setSelectedType('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building className="h-8 w-8 mr-3 text-lavender-600" />
                Discover Properties
              </h1>
              <p className="text-gray-600 mt-1">
                Find your perfect home from {filteredProperties.length} available properties
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">← Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by location, property type, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="h-12 px-8">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                      <SelectItem value="abuja">Abuja, Nigeria</SelectItem>
                      <SelectItem value="accra">Accra, Ghana</SelectItem>
                      <SelectItem value="cape-town">Cape Town, South Africa</SelectItem>
                      <SelectItem value="new-york">New York, US</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setMinPrice(value)
                    }}
                    type="text"
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  
                  <Input
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setMaxPrice(value)
                    }}
                    type="text"
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ Bedroom</SelectItem>
                      <SelectItem value="2">2+ Bedrooms</SelectItem>
                      <SelectItem value="3">3+ Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                  <div className="text-sm text-gray-500">
                    {filteredProperties.length} properties found
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}
            >
              {/* Property Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-80 h-48' : 'aspect-video'}`}>
                <img
                  src={property.images[0]}
                  alt={property.propertyTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-lavender-600">
                    {property.propertyType}
                  </Badge>
                </div>
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      favorites.includes(property.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
                {property.isFeatured && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Property Details */}
              <div className="p-6 flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.propertyTitle}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.city}, {property.state}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                {/* Property Features */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedroomCount} bed
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathroomCount} bath
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.squareFootage} sqft
                  </div>
                </div>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-lavender-600">
                      {formatPrice(property.monthlyRent)}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clearing filters
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}