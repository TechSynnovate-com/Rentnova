'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useCountry } from '@/contexts/country-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Share2,
  Eye,
  Calendar,
  Building
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { FirebaseProperty, FIREBASE_COLLECTIONS } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

import { Footer } from '@/components/layout/footer'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, removeFromFavorites, loading: favoritesLoading } = useFavorites()
  const { formatPrice } = useCountry()
  const [favoriteProperties, setFavoriteProperties] = useState<FirebaseProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavoriteProperties = async () => {
      if (!favorites.length) {
        setFavoriteProperties([])
        setLoading(false)
        return
      }

      try {
        const propertyPromises = favorites.map(async (propertyId) => {
          const propertyRef = doc(db, 'properties', propertyId)
          const propertySnap = await getDoc(propertyRef)
          
          if (propertySnap.exists()) {
            return {
              id: propertySnap.id,
              ...propertySnap.data()
            } as FirebaseProperty
          }
          return null
        })

        const properties = await Promise.all(propertyPromises)
        const validProperties = properties.filter(Boolean) as FirebaseProperty[]
        setFavoriteProperties(validProperties)
      } catch (error) {
        console.error('Error loading favorite properties:', error)
        toast.error('Failed to load favorite properties')
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteProperties()
  }, [favorites])

  const handleRemoveFromFavorites = async (propertyId: string) => {
    await removeFromFavorites(propertyId)
  }

  const handleShare = (property: FirebaseProperty) => {
    const shareUrl = `${window.location.origin}/properties/${property.id}`
    const shareText = `Check out this property: ${property.propertyTitle || `${property.propertyType} in ${property.city}`} - ${formatPrice(property.price)}/month`
    
    if (navigator.share) {
      navigator.share({
        title: property.propertyTitle || `${property.propertyType} in ${property.city}`,
        text: shareText,
        url: shareUrl,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Property link copied to clipboard!')
      })
    }
  }

  if (loading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tenant">
                <Button variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">
                  {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'property' : 'properties'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span className="text-sm text-gray-600">{favoriteProperties.length} Favorites</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 mb-6">
                Start browsing properties and save your favorites for easy access later.
              </p>
              <Link href="/properties">
                <Button className="bg-lavender-600 hover:bg-lavender-700">
                  <Building className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-200 relative">
                      <Image
                        src={property.imageUrls?.[0] || '/api/placeholder/600/400'}
                        alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-lavender-600">
                          Saved
                        </Badge>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromFavorites(property.id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-1 truncate">
                          {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 text-xs">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{property.address || `${property.city}, ${property.state}`}</span>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-lg font-bold text-lavender-600">
                          {formatPrice(property.price)}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        {property.bedroomCount}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        {property.toiletCount}
                      </div>
                      {property.size && (
                        <div className="flex items-center">
                          <Square className="h-3 w-3 mr-1" />
                          {property.size}sf
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Link href={`/properties/${property.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(property)}
                        className="px-2"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>
      <Footer />
    </div>
  )
}