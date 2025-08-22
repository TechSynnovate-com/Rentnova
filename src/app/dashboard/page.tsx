'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { 
  Search, 
  Home, 
  Heart, 
  FileText, 
  User, 
  MapPin, 
  Filter, 
  Sparkles,
  ArrowRight,
  Building,
  Star,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
// import { useFeaturedProperties } from '@/lib/queries/properties'
// import { useRentalProfile } from '@/hooks/use-rental-profile'
// import { useFavorites } from '@/contexts/favorites-context'
// import { useCountry } from '@/contexts/country-context'
// import QuickApplyButton from '@/components/quick-apply-button'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  
  // const { profile, loading: profileLoading } = useRentalProfile()
  // const { favorites } = useFavorites()
  // const { formatPrice } = useCountry()
  // const { data: featuredProperties = [], isLoading: propertiesLoading } = useFeaturedProperties()
  
  const profileLoading = false
  const profile = null
  const favorites: string[] = []
  const featuredProperties: any[] = []
  const propertiesLoading = false

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Always redirect to role-specific dashboard to avoid confusion
    if (user.role === 'landlord') {
      router.push('/dashboard/landlord')
      return
    } else if (user.role === 'tenant') {
      router.push('/dashboard/tenant')
      return
    } else if (user.role === 'admin') {
      router.push('/dashboard/admin')
      return
    }
  }, [user, loading, router])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    if (searchLocation) params.set('location', searchLocation)
    if (propertyType) params.set('type', propertyType)
    
    router.push(`/properties?${params.toString()}`)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'discover':
        router.push('/properties')
        break
      case 'favorites':
        router.push('/dashboard/tenant/favorites')
        break
      case 'applications':
        router.push('/dashboard/tenant/applications')
        break
      case 'profile':
        router.push('/dashboard/tenant/rental-profile')
        break
      case 'recommendations':
        router.push('/recommendations')
        break
    }
  }

  const getProfileStatus = () => {
    const completion = 0 // profile?.completionPercentage || 0
    if (completion >= 80) return { status: 'complete', color: 'bg-green-100 text-green-800' }
    if (completion >= 40) return { status: 'in progress', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'incomplete', color: 'bg-red-100 text-red-800' }
  }

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lavender-600"></div>
      </div>
    )
  }

  if (!user) return null

  const profileStatus = getProfileStatus()
  const isProfileIncomplete = !user.phoneNumber || !user.dateOfBirth

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Welcome back, {user.displayName || 'User'}! 👋
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Ready to find your perfect home?
              </motion.p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={profileStatus.color} variant="secondary">
                Profile {profileStatus.status}
              </Badge>
              {user.role && (
                <Badge variant="outline">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Alert */}
        {isProfileIncomplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-900">Complete Your Profile</CardTitle>
                </div>
                <CardDescription className="text-yellow-800">
                  Complete your profile to unlock one-click property applications and personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => router.push('/auth/complete-profile')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Complete Profile <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-lavender-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Search className="h-6 w-6 mr-2" />
                Discover Your Perfect Home
              </CardTitle>
              <CardDescription className="text-lavender-100">
                Search from thousands of verified properties across Nigeria, Ghana, South Africa, and the US
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-gray-900"
                  />
                </div>
                <Select value={searchLocation} onValueChange={setSearchLocation}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lagos">Lagos, Nigeria</SelectItem>
                    <SelectItem value="Abuja">Abuja, Nigeria</SelectItem>
                    <SelectItem value="Accra">Accra, Ghana</SelectItem>
                    <SelectItem value="Cape Town">Cape Town, South Africa</SelectItem>
                    <SelectItem value="New York">New York, US</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSearch} className="bg-white text-lavender-600 hover:bg-lavender-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('discover')} className="border-white text-white hover:bg-white hover:text-lavender-600">
                  <Building className="h-4 w-4 mr-2" />
                  Browse All
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('recommendations')} className="border-white text-white hover:bg-white hover:text-lavender-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleQuickAction('discover')}
            >
              <CardContent className="p-6 text-center">
                <Building className="h-8 w-8 text-lavender-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Discover Properties</h3>
                <p className="text-sm text-gray-600">Find your next home</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleQuickAction('favorites')}
            >
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">My Favorites</h3>
                <p className="text-sm text-gray-600">{favorites.length} saved properties</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleQuickAction('applications')}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Applications</h3>
                <p className="text-sm text-gray-600">Track applications</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleQuickAction('profile')}
            >
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Rental Profile</h3>
                <p className="text-sm text-gray-600">0% complete</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Featured Properties */}
        {!propertiesLoading && featuredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <Link href="/properties" className="text-lavender-600 hover:text-lavender-700 font-medium">
                View all <ArrowRight className="h-4 w-4 inline ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <img
                      src={property.images?.[0] || '/placeholder-property.jpg'}
                      alt={property.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-lavender-600">
                        {property.propertyType}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{property.propertyTitle}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-lavender-600">
                          ₦{property.monthlyRent?.toLocaleString() || '0'}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                      <div className="flex items-center space-x-2">
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
          </motion.div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Profile Completion</p>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                  </div>
                  {0 >= 80 ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Featured Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{featuredProperties.length}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}