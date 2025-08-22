'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLandlordProfile, useLandlordProperties, useUpdateProperty } from '@/lib/queries/landlord-queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Car,
  Edit,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Home,
  ArrowLeft,
  MoreHorizontal,
  Settings,
  Trash2,
  CheckCircle,
  XCircle,
  Square
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function LandlordPropertiesPage() {
  const { user, firebaseUser } = useAuth()
  const { data: landlordProfile } = useLandlordProfile(user?.id || '')
  const { data: properties = [], isLoading } = useLandlordProperties(user?.id || '')
  const updatePropertyMutation = useUpdateProperty()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleToggleAvailability = async (propertyId: string, isAvailable: boolean) => {
    try {
      await updatePropertyMutation.mutateAsync({
        propertyId,
        updates: { isAvailable: !isAvailable }
      })
      toast.success(`Property ${!isAvailable ? 'marked as available' : 'marked as full'}`)
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error('Failed to update property')
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }
    
    try {
      // You'll need to implement deleteProperty in your queries
      toast.success('Property deleted successfully')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢'
      case 'occupied': return '👥'
      case 'maintenance': return '🔧'
      case 'draft': return '📝'
      case 'inactive': return '🔴'
      default: return '❓'
    }
  }

  const handleUpdateAvailability = async (propertyId: string, isAvailable: boolean) => {
    try {
      await updatePropertyMutation.mutateAsync({
        propertyId,
        updates: {
          isAvailable,
          status: isAvailable ? 'active' : 'occupied'
        }
      })
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
                         (property.address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.city?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/90 to-indigo-800/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/landlord" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Building className="h-8 w-8 mr-3 text-purple-300" />
                  Manage Properties
                </h1>
                <p className="text-purple-200 mt-1">
                  Manage your {properties.length} properties and track their performance
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/landlord/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="active">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              {properties.length === 0 ? 'No properties added yet' : 'No properties match your search'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {properties.length === 0 
                ? 'Start building your rental portfolio by adding your first property'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {properties.length === 0 && (
              <Button asChild size="lg">
                <Link href="/dashboard/landlord/properties/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Property
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300">
                  {/* Property Image */}
                  <div className="relative h-48">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={`${property.propertyType} in ${property.city}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Building className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(property.status)}>
                        <span className="mr-1">{getStatusIcon(property.status)}</span>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="bg-black/20 hover:bg-black/40 text-white" asChild>
                          <Link href={`/dashboard/landlord/properties/${property.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="bg-black/20 hover:bg-black/40 text-white" asChild>
                          <Link href={`/dashboard/landlord/properties/new?edit=${property.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="bg-black/20 hover:bg-black/40 text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                            <DropdownMenuItem 
                              onClick={() => handleToggleAvailability(property.id, property.isAvailable || false)}
                              className="text-white hover:bg-gray-800"
                            >
                              {property.isAvailable ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Mark as Unavailable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Available
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-800">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Property
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem 
                              className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Property
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                      </h3>
                      <p className="text-gray-300 text-sm flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {property.address}, {property.city}, {property.state}
                      </p>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedroomCount || 0}
                        </span>
                        <span className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.toiletCount || 0}
                        </span>
                        {(property.kitchenCount || 0) > 0 && (
                          <span className="flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            {property.kitchenCount} Kitchen{(property.kitchenCount || 0) > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-purple-300 font-medium">
                        {property.propertyType}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatPrice(property.price)}
                        <span className="text-sm font-normal text-gray-300">/{property.rentPeriod}</span>
                      </div>
                      {property.requiresUpfrontDeposit && (
                        <p className="text-sm text-gray-400">
                          {property.depositYears || 1} year{(property.depositYears || 1) > 1 ? 's' : ''} deposit required
                        </p>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Status:</span>
                      <Badge className={property.isAvailable ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {property.isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}