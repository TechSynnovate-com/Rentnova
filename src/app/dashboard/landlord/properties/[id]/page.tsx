'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, MapPin, Home, Square, Bed, Bath, Car, Wifi, Zap, Shield, Camera, Edit, Settings, Users, Calendar, DollarSign, Star, X } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCountry } from '@/contexts/country-context'
import { toast } from 'react-hot-toast'

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const { formatPrice: formatCountryPrice } = useCountry()
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  
  const PROMOTION_FEE = 29999 // NGN

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const docRef = doc(db, 'properties', propertyId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        return { 
          id: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        }
      }
      throw new Error('Property not found')
    },
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Button asChild>
            <Link href="/dashboard/landlord/properties">Back to Properties</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/landlord/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Property Details</h1>
              <p className="text-gray-400">View and manage your property information</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button asChild>
              <Link href={`/dashboard/landlord/properties/new?edit=${propertyId}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
              </Link>
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-0">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={`${property.propertyType} in ${property.city}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Camera className="h-24 w-24 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={property.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {property.isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{property.propertyType} in {property.city}</span>
                    <div className="text-2xl font-bold text-purple-300">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal">/{property.rentPeriod}</span>
                    </div>
                  </CardTitle>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.address}, {property.city}, {property.state}, {property.country}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Bed className="h-5 w-5" />
                      <span>{property.bedroomCount} Bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Bath className="h-5 w-5" />
                      <span>{property.toiletCount} Bathrooms</span>
                    </div>
                    {property.size && (
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Square className="h-5 w-5" />
                        <span>{property.size} sqm</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Home className="h-5 w-5" />
                      <span>{property.propertyType}</span>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {property.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Features */}
                  {(property.utilities?.length > 0 || property.kitchenFeatures?.length > 0 || property.furnishings?.length > 0) && (
                    <>
                      <Separator className="bg-white/20" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Features & Amenities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {property.utilities?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-purple-300 mb-2">Utilities</h4>
                              <ul className="space-y-1 text-gray-300">
                                {property.utilities.map((utility: string, index: number) => (
                                  <li key={index} className="flex items-center">
                                    <Zap className="h-3 w-3 mr-2" />
                                    {utility}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {property.kitchenFeatures?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-purple-300 mb-2">Kitchen</h4>
                              <ul className="space-y-1 text-gray-300">
                                {property.kitchenFeatures.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-center">
                                    <Home className="h-3 w-3 mr-2" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {property.furnishings?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-purple-300 mb-2">Furnishings</h4>
                              <ul className="space-y-1 text-gray-300">
                                {property.furnishings.map((item: string, index: number) => (
                                  <li key={index} className="flex items-center">
                                    <Home className="h-3 w-3 mr-2" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Property Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Availability:</span>
                    <Badge className={property.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {property.isAvailable ? 'Available' : 'Occupied'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Views:</span>
                    <span className="text-white">{property.viewCount || 0}</span>
                  </div>
                  {property.requiresUpfrontDeposit && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Deposit:</span>
                      <span className="text-white">{property.depositYears} year{property.depositYears > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/landlord/properties/new?edit=${propertyId}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Property
                    </Link>
                  </Button>
                  
                  <Dialog open={showPromoteModal} onOpenChange={setShowPromoteModal}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        <Star className="h-4 w-4 mr-2" />
                        Promote Listing
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Promote Your Listing
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Property Preview */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {property?.propertyTitle}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property?.address}, {property?.city}
                          </p>
                          <p className="text-lg font-bold text-green-600 mt-2">
                            {formatPrice(property?.price || 0)}/month
                          </p>
                        </div>

                        {/* Promotion Benefits */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-3">Promotion Benefits:</h4>
                          <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              Appear at top of all search results
                            </li>
                            <li className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              Get 3x more views and inquiries
                            </li>
                            <li className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              Featured for 30 days
                            </li>
                          </ul>
                        </div>

                        {/* Pricing */}
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="text-3xl font-bold text-orange-600 mb-2">
                            {formatCountryPrice(PROMOTION_FEE)}
                          </div>
                          <p className="text-gray-600 text-sm">One-time payment for 30 days</p>
                        </div>

                        {/* Status Check */}
                        {property?.isFeatured ? (
                          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-medium">Property Already Featured!</p>
                            <p className="text-green-600 text-sm">Your listing is currently promoted</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button 
                              className="w-full bg-gray-400 cursor-not-allowed" 
                              disabled={true}
                            >
                              Checkout - Coming Soon
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                              Payment integration will be available soon
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Tenants
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Owner Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white">{property.ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white text-sm">{property.ownerEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Listed:</span>
                    <span className="text-white text-sm">
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Not available'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}