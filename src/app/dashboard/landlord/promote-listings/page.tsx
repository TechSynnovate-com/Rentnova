'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useCountry } from '@/contexts/country-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  TrendingUp, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react'
import { motion } from 'framer-motion'

import { FirebaseProperty } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'

// Mock data for landlord properties (in real app, fetch from Firebase)
const mockProperties: FirebaseProperty[] = [
  {
    id: '1',
    propertyTitle: 'Modern 3BR Apartment in Victoria Island',
    address: '15 Ahmadu Bello Way, Victoria Island',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    description: 'Luxury apartment with ocean view',
    propertyType: 'apartment',
    price: 2500000,
    bedroomCount: 3,
    toiletCount: 2,
    imageUrls: ['/placeholder-property.jpg'],
    status: 'approved',
    isFeatured: false,
    viewCount: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    propertyTitle: 'Executive 4BR House in Ikoyi',
    address: '8 Banana Island Road, Ikoyi',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    description: 'Spacious family home with garden',
    propertyType: 'house',
    price: 4500000,
    bedroomCount: 4,
    toiletCount: 3,
    imageUrls: ['/placeholder-property.jpg'],
    status: 'approved',
    isFeatured: true,
    viewCount: 128,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function PromoteListingsPage() {
  const { user } = useAuth()
  const { formatPrice } = useCountry()

  const [properties, setProperties] = useState<FirebaseProperty[]>(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  const PROMOTION_FEE = 29999 // NGN

  const filteredProperties = properties.filter(property =>
    property.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePromoteProperty = async (propertyId: string) => {
    setProcessingPayment(propertyId)
    
    try {
      // In a real app, integrate with Stripe/Paystack for payment
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate payment processing
      
      // Update property to featured
      const propertyRef = doc(db, 'properties', propertyId)
      const featuredUntil = new Date()
      featuredUntil.setDate(featuredUntil.getDate() + 30) // Featured for 30 days
      
      await updateDoc(propertyRef, {
        isFeatured: true,
        featuredUntil: featuredUntil,
        updatedAt: new Date()
      })

      // Update local state
      setProperties(prev => prev.map(property => 
        property.id === propertyId 
          ? { ...property, isFeatured: true, featuredUntil }
          : property
      ))

      toast.success("Property Promoted Successfully! Your listing is now featured and will appear at the top of search results for 30 days.")
    } catch (error) {
      console.error('Error promoting property:', error)
      toast.error("Promotion Failed: There was an error processing your payment. Please try again.")
    } finally {
      setProcessingPayment(null)
    }
  }

  const getFeaturedStatus = (property: FirebaseProperty) => {
    if (!property.isFeatured) return { status: 'not-featured', text: 'Not Featured', color: 'gray' }
    return { status: 'active', text: 'Currently Featured', color: 'green' }
  }

  const getDaysRemaining = () => {
    return 30 // Simplified for demo
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Star className="h-10 w-10 text-yellow-500" />
            Promote Your Listings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Boost your property visibility and get more inquiries by featuring your listings at the top of search results.
          </p>
          
          {/* Promotion Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 mb-2">3x More Views</h3>
                <p className="text-blue-700 text-sm">Featured listings get 300% more views than regular listings</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 mb-2">Top Position</h3>
                <p className="text-green-700 text-sm">Appear at the top of all search results and homepage</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 mb-2">30 Days Featured</h3>
                <p className="text-purple-700 text-sm">Your listing stays featured for a full month</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-8 text-center">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Your Listing</h2>
              <div className="text-4xl font-bold text-orange-600 mb-4">
                {formatPrice(PROMOTION_FEE)}
              </div>
              <p className="text-gray-600 mb-4">One-time payment for 30 days of premium visibility</p>
              <div className="flex items-center justify-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Guaranteed top position in search results
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Properties */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search your properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Properties List */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredProperties.map((property) => {
            const featuredStatus = getFeaturedStatus(property)
            const daysRemaining = getDaysRemaining()
            
            return (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={property.imageUrls[0] || '/placeholder-property.jpg'}
                    alt={property.propertyTitle || 'Property'}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className={`${
                        featuredStatus.color === 'green' 
                          ? 'bg-green-500 text-white' 
                          : featuredStatus.color === 'orange'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {featuredStatus.status === 'active' && <Star className="h-3 w-3 mr-1" />}
                      {featuredStatus.text}
                    </Badge>
                  </div>
                  
                  {/* View Count */}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    <Eye className="h-3 w-3 inline mr-1" />
                    {property.viewCount || 0} views
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {property.propertyTitle}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.city}, {property.state}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedroomCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.toiletCount}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">
                      {formatPrice(property.price)}/month
                    </div>
                  </div>

                  {/* Featured Status and Action */}
                  {featuredStatus.status === 'active' ? (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-green-800 font-medium text-sm">
                        Featured for {daysRemaining} more days
                      </p>
                    </div>
                  ) : featuredStatus.status === 'expired' ? (
                    <div className="text-center">
                      <AlertCircle className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                      <p className="text-orange-800 text-sm mb-3">Feature has expired</p>
                      <Button
                        onClick={() => handlePromoteProperty(property.id)}
                        disabled={processingPayment === property.id}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {processingPayment === property.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Promote Again - {formatPrice(PROMOTION_FEE)}
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Button
                        onClick={() => handlePromoteProperty(property.id)}
                        disabled={processingPayment === property.id}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        {processingPayment === property.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Processing Payment...
                          </div>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Promote for {formatPrice(PROMOTION_FEE)}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 
                `No properties match "${searchTerm}". Try a different search term.` :
                'You don\'t have any properties yet. Create your first listing to get started.'
              }
            </p>
          </div>
        )}
      </div>
      
    </div>
  )
}