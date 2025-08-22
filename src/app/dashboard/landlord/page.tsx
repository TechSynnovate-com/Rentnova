'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useFavorites } from '@/contexts/favorites-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  Plus,
  Home,
  Users,
  DollarSign,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  TrendingUp,
  Building,
  Star,
  Calendar,
  MapPin,
  AlertCircle,
  User,
  Heart,
  Bed,
  Bath
} from 'lucide-react'
import Link from 'next/link'
import { 
  useLandlordProfile, 
  useLandlordProperties, 
  useLandlordTenants,
  useLandlordApplications,
  useLandlordAnalytics,
  useUpdateApplicationStatus
} from '@/lib/queries/landlord-queries'

export default function LandlordDashboard() {
  const { user, loading } = useAuth()
  const { favorites } = useFavorites()
  const router = useRouter()
  
  // Fetch landlord data with real Firebase queries
  const { data: landlordProfile, isLoading: profileLoading } = useLandlordProfile(user?.id || '')
  const { data: properties = [], isLoading: propertiesLoading } = useLandlordProperties(user?.id || '')
  const { data: tenants = [], isLoading: tenantsLoading } = useLandlordTenants(landlordProfile?.id || '')
  const { data: applications = [], isLoading: applicationsLoading } = useLandlordApplications(landlordProfile?.id || '')
  const { data: analytics, isLoading: analyticsLoading } = useLandlordAnalytics(landlordProfile?.id || '')
  
  const updateApplicationMutation = useUpdateApplicationStatus()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'landlord') {
      router.push('/dashboard')
      return
    }
  }, [user, loading, router])

  const handleApplicationAction = async (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (!landlordProfile?.id) return
    
    await updateApplicationMutation.mutateAsync({
      applicationId,
      status,
      reviewNotes: notes,
      landlordId: landlordProfile.id
    })
  }

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return '₦0'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800'
      case 'vacant': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under-review': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || profileLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your landlord dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'landlord' || !landlordProfile) return null

  // Calculate real-time stats from actual data
  const stats = analytics || {
    totalProperties: properties.length,
    activeRentals: properties.filter(p => !p.isAvailable).length,
    monthlyRevenue: properties.reduce((sum, p) => sum + (p.price || 0), 0),
    occupancyRate: properties.length > 0 ? Math.round((properties.filter(p => !p.isAvailable).length / properties.length) * 100) : 0,
    totalTenants: tenants.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/90 to-indigo-800/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Building className="h-8 w-8 mr-3 text-purple-300" />
                Landlord Dashboard
              </h1>
              <p className="text-purple-200 mt-1">
                Welcome back, {user.displayName}! Manage your properties and tenants
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-purple-100 text-purple-800">
                {user.role}
              </Badge>
              <Button asChild>
                <Link href="/dashboard/landlord/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">{formatPrice(stats.monthlyRevenue)}</p>
                    <p className="text-emerald-200 text-xs">This month</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Properties</p>
                    <p className="text-3xl font-bold">{properties.length}</p>
                    <p className="text-blue-200 text-xs">{properties.filter(p => !p.isAvailable).length} occupied</p>
                  </div>
                  <Building className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Applications</p>
                    <p className="text-3xl font-bold">{applications.length}</p>
                    <p className="text-orange-200 text-xs">Pending review</p>
                  </div>
                  <Users className="h-12 w-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Occupancy Rate</p>
                    <p className="text-3xl font-bold">{properties.length > 0 ? Math.round((properties.filter(p => !p.isAvailable).length / properties.length) * 100) : 0}%</p>
                    <p className="text-purple-200 text-xs">Above average</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild className="h-20 text-left justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <Link href="/dashboard/landlord/properties">
                <div>
                  <Building className="h-6 w-6 mb-2" />
                  <div className="font-semibold">Manage Properties</div>
                  <div className="text-xs opacity-70">{properties.length} properties</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild className="h-20 text-left justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <Link href="/dashboard/landlord/tenants">
                <div>
                  <Users className="h-6 w-6 mb-2" />
                  <div className="font-semibold">Manage Tenants</div>
                  <div className="text-xs opacity-70">{tenants.length} tenants</div>
                </div>
              </Link>
            </Button>
            
            <Button className="h-20 text-left justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <div>
                <MessageSquare className="h-6 w-6 mb-2" />
                <div className="font-semibold">Messages</div>
                <div className="text-xs opacity-70">0 unread</div>
              </div>
            </Button>
            
            <Button asChild className="h-20 text-left justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <Link href="/dashboard/landlord/profile">
                <div>
                  <User className="h-6 w-6 mb-2" />
                  <div className="font-semibold">Profile Settings</div>
                  <div className="text-xs opacity-70">Manage account</div>
                </div>
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Your Properties</span>
                  <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white" asChild>
                    <Link href="/dashboard/landlord/properties">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No properties added yet</p>
                      <Button asChild size="sm" className="mt-4">
                        <Link href="/dashboard/landlord/properties/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Property
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        {property.imageUrls && property.imageUrls.length > 0 ? (
                          <img
                            src={property.imageUrls[0]}
                            alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                            <Building className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                          </h3>
                          <p className="text-gray-300 text-sm flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {property.city}, {property.state}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-purple-300 font-medium">
                              {formatPrice(property.price)}/{property.rentPeriod}
                            </span>
                            <Badge className={property.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {property.isAvailable ? 'Available' : 'Occupied'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white" asChild>
                            <Link href={`/dashboard/landlord/properties/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white" asChild>
                            <Link href={`/dashboard/landlord/properties/new?edit=${property.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Recent Applications</span>
                  <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No pending applications</p>
                      <p className="text-gray-500 text-sm mt-2">Applications will appear here when tenants apply for your properties</p>
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div key={application.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{application.personalInfo.fullName}</h3>
                          <Badge className={getApplicationStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">Property ID: {application.propertyId}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300">Income: {formatPrice(application.employmentInfo.monthlyIncome)}</span>
                          <span className="text-gray-400">{new Date(application.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-400 hover:text-green-300"
                            onClick={() => handleApplicationAction(application.id, 'approved', 'Application approved')}
                            disabled={updateApplicationMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleApplicationAction(application.id, 'rejected', 'Application rejected')}
                            disabled={updateApplicationMutation.isPending}
                          >
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Saved Properties Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-400" />
                    Saved Properties
                  </span>
                  <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white" asChild>
                    <Link href="/favorites">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favorites.length === 0 ? (
                    <div className="text-center py-6">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No saved properties yet</p>
                      <p className="text-sm text-gray-500">Save properties to track your rental market research</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.slice(0, 3).map((propertyId) => (
                        <div key={propertyId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Heart className="h-4 w-4 text-red-400" />
                            <div>
                              <p className="text-white text-sm font-medium">Saved Property</p>
                              <p className="text-gray-400 text-xs">Property ID: {propertyId.slice(0, 8)}...</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white" asChild>
                            <Link href={`/properties/${propertyId}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}