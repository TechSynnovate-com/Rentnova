'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useCountry } from '@/contexts/country-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  MessageSquare,
  Home,
  Wifi,
  Car,
  Shield,
  Droplets,
  Zap,
  CheckCircle,
  Star,
  User,
  Clock,
  Eye,
  Camera,
  MapPinIcon,
  Building,
  ParkingCircle,
  Thermometer,
  Wind,
  Sun,
  Navigation,
  Copy,
  Check,
  FileText
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { FirebaseProperty, FirebaseChatRoom, FIREBASE_COLLECTIONS } from '@/types/firebase-schema'
import { useFavorites } from '@/contexts/favorites-context'
import QuickApplyWorkflow from '@/components/quick-apply-workflow'

import { Footer } from '@/components/layout/footer'
import ContextualHelp from '@/components/help-bubbles/contextual-help'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { formatPrice } = useCountry()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [property, setProperty] = useState<FirebaseProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showApplyModal, setShowApplyModal] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      if (!params.id) return
      
      const propertyDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.PROPERTIES, params.id as string))
      if (propertyDoc.exists()) {
        const propertyData = propertyDoc.data() as FirebaseProperty
        setProperty({ ...propertyData, id: propertyDoc.id })
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Error loading property details')
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to save favorites')
      return
    }

    try {
      const propertyId = params.id as string
      if (isFavorite(propertyId)) {
        await removeFromFavorites(propertyId)
        toast.success('Removed from favorites')
      } else {
        await addToFavorites(propertyId)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast.error('Error updating favorites')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const startChat = async () => {
    if (!user) {
      toast.error('Please log in to message the landlord')
      return
    }

    if (!property) return

    try {
      const chatRoom: Omit<FirebaseChatRoom, 'id'> = {
        propertyId: params.id as string,
        tenantId: user.uid,
        landlordId: property.ownerId,
        lastMessage: {
          text: `Hi! I'm interested in your property: ${property.propertyTitle || property.description}`,
          senderId: user.uid,
          timestamp: serverTimestamp(),
          read: false
        },
        participants: [user.uid, property.ownerId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, FIREBASE_COLLECTIONS.CHAT_ROOMS), chatRoom)
      toast.success('Chat started! You can now message the landlord.')
      router.push('/dashboard/tenant/messages')
    } catch (error) {
      console.error('Error starting chat:', error)
      toast.error('Error starting chat')
    }
  }

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Security': Shield,
    'Water': Droplets,
    'Electricity': Zap,
    'Air Conditioning': Wind,
    'Heating': Thermometer,
    'Furnished': Home,
    'Gym': Building,
    'Swimming Pool': Droplets,
    'Garden': Sun,
    'Balcony': Home,
    'Elevator': Building,
    'Pet Friendly': Heart,
    'Laundry': Home,
    'Kitchen': Home,
    'Internet': Wifi,
    'Cable TV': Home,
    'Dishwasher': Home,
    'Microwave': Home,
    'Refrigerator': Home,
    'Washer/Dryer': Home,
    'Fireplace': Home,
    'Patio': Home,
    'Deck': Home,
    'Yard': Sun,
    'Storage': Home,
    'Walk-in Closet': Home,
    'Hardwood Floors': Home,
    'Carpet': Home,
    'Tile': Home,
    'Central Air': Wind,
    'Ceiling Fan': Wind,
    'Blinds': Home,
    'Curtains': Home,
    'Intercom': Home,
    'Doorman': User,
    'Concierge': User,
    'Fitness Center': Building,
    'Business Center': Building,
    'Conference Room': Building,
    'Rooftop': Building,
    'Clubhouse': Building,
    'Tennis Court': Building,
    'Basketball Court': Building,
    'Playground': Building,
    'Barbecue Area': Sun,
    'Picnic Area': Sun,
    'Fire Pit': Sun,
    'Hot Tub': Droplets,
    'Sauna': Thermometer,
    'Steam Room': Droplets,
    'Spa': Droplets,
    'Massage Room': Home,
    'Game Room': Home,
    'Library': Home,
    'Study Room': Home,
    'Media Room': Home,
    'Theater': Home,
    'Music Room': Home,
    'Art Studio': Home,
    'Workshop': Home,
    'Tool Shed': Home,
    'Greenhouse': Sun,
    'Gazebo': Sun,
    'Pergola': Sun,
    'Trellis': Sun,
    'Fence': Shield,
    'Gate': Shield,
    'Alarm System': Shield,
    'Security Camera': Shield,
    'Motion Sensor': Shield,
    'Smoke Detector': Shield,
    'Carbon Monoxide Detector': Shield,
    'Fire Extinguisher': Shield,
    'First Aid Kit': Shield,
    'Emergency Kit': Shield,
    'Backup Generator': Zap,
    'Solar Panels': Sun,
    'Wind Turbine': Wind,
    'Geothermal': Thermometer,
    'Radiant Floor Heating': Thermometer,
    'Baseboard Heating': Thermometer,
    'Forced Air Heating': Wind,
    'Heat Pump': Thermometer,
    'Boiler': Thermometer,
    'Radiator': Thermometer,
    'Electric Heating': Zap,
    'Gas Heating': Zap,
    'Oil Heating': Zap,
    'Propane Heating': Zap,
    'Wood Heating': Sun,
    'Pellet Heating': Sun,
    'Coal Heating': Sun,
    'Biomass Heating': Sun,
    'District Heating': Building,
    'Chilled Water': Droplets,
    'Evaporative Cooling': Droplets,
    'Swamp Cooler': Droplets,
    'Window Unit': Wind,
    'Portable AC': Wind,
    'Ductless Mini-Split': Wind,
    'Central Vacuum': Home,
    'Intercom System': Home,
    'Smart Home': Home,
    'Home Automation': Home,
    'Smart Thermostat': Thermometer,
    'Smart Lights': Sun,
    'Smart Locks': Shield,
    'Smart Doorbell': Shield,
    'Smart Security': Shield,
    'Smart Appliances': Home,
    'Smart TV': Home,
    'Smart Speakers': Home,
    'Smart Plugs': Zap,
    'Smart Switches': Zap,
    'Smart Outlets': Zap,
    'USB Outlets': Zap,
    'GFCI Outlets': Zap,
    'Surge Protection': Zap,
    'Uninterruptible Power Supply': Zap,
    'Battery Backup': Zap,
    'Emergency Lighting': Sun,
    'Exit Signs': Sun,
    'Fire Doors': Shield,
    'Fire Stairs': Shield,
    'Fire Escape': Shield,
    'Sprinkler System': Droplets,
    'Fire Alarm': Shield,
    'Smoke Alarm': Shield,
    'Heat Detector': Thermometer,
    'Gas Detector': Zap,
    'Leak Detector': Droplets,
    'Water Shut-off': Droplets,
    'Gas Shut-off': Zap,
    'Circuit Breaker': Zap,
    'Fuse Box': Zap,
    'Electrical Panel': Zap,
    'Meter': Zap,
    'Transformer': Zap,
    'Generator': Zap,
    'Inverter': Zap,
    'Battery Bank': Zap,
    'Charge Controller': Zap,
    'Power Inverter': Zap,
    'Power Converter': Zap,
    'Power Supply': Zap,
    'Power Conditioner': Zap,
    'Power Filter': Zap,
    'Power Amplifier': Zap,
    'Power Meter': Zap,
    'Power Monitor': Zap,
    'Power Analyzer': Zap,
    'Power Logger': Zap,
    'Power Recorder': Zap,
    'Power Tester': Zap,
    'Power Calibrator': Zap,
    'Power Standard': Zap,
    'Power Reference': Zap,
    'Power Source': Zap,
    'Power Load': Zap,
    'Power Resistor': Zap,
    'Power Capacitor': Zap,
    'Power Inductor': Zap,
    'Power Transformer': Zap,
    'Power Relay': Zap,
    'Power Switch': Zap,
    'Power Connector': Zap,
    'Power Cable': Zap,
    'Power Cord': Zap,
    'Power Strip': Zap,
    'Power Outlet': Zap,
    'Power Socket': Zap,
    'Power Plug': Zap,
    'Power Adapter': Zap,
    'Power Charger': Zap,
    'Power Bank': Zap,
    'Power Pack': Zap,
    'Power Module': Zap,
    'Power Unit': Zap,
    'Power System': Zap,
    'Power Grid': Zap,
    'Power Line': Zap,
    'Power Tower': Zap,
    'Power Pole': Zap,
    'Power Station': Zap,
    'Power Plant': Zap,
    'Power Generation': Zap,
    'Power Distribution': Zap,
    'Power Transmission': Zap,
    'Power Substation': Zap,
    'Power Switchyard': Zap,
    'Power Control': Zap,
    'Power Management': Zap,
    'Power Protection': Zap,
    'Power Quality': Zap,
    'Power Factor': Zap,
    'Power Efficiency': Zap,
    'Power Consumption': Zap,
    'Power Demand': Zap,
    'Power Load': Zap,
    'Power Peak': Zap,
    'Power Base': Zap,
    'Power Reserve': Zap,
    'Power Backup': Zap,
    'Power Emergency': Zap,
    'Power Outage': Zap,
    'Power Failure': Zap,
    'Power Surge': Zap,
    'Power Spike': Zap,
    'Power Dip': Zap,
    'Power Sag': Zap,
    'Power Brownout': Zap,
    'Power Blackout': Zap
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/properties')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = property.imageUrls || property.images || []
  const hasImages = images.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section with Images */}
      <div className="relative">
        {hasImages ? (
          <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
            <Image
              src={images[currentImageIndex] || '/placeholder-property.jpg'}
              alt={property.propertyTitle || property.description || 'Property'}
              fill
              className="object-cover"
              priority
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                console.log('Image load error:', e)
                setImageLoading(false)
              }}
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        ) : (
          <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images available</p>
            </div>
          </div>
        )}
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="bg-white/90 hover:bg-white border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white border-white/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            className="bg-white/90 hover:bg-white border-white/20"
          >
            <Heart className={`h-4 w-4 ${isFavorite(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.propertyTitle || property.description}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.address || 'Address not available'}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{property.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Available {property.readyToLiveDate || 'Now'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatPrice(property.price || 0)}
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                  <Badge variant={property.status === 'approved' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{property.bedroomCount || 0}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{property.toiletCount || 0}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{property.size || 0}</div>
                  <div className="text-sm text-gray-500">Sq ft</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{property.propertyType || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Type</div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'location', label: 'Location' },
                    { id: 'policies', label: 'Policies' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {property.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Type</span>
                            <span className="font-medium capitalize">{property.propertyType || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Purpose</span>
                            <span className="font-medium capitalize">{property.propertyPurpose || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ready to Live</span>
                            <span className="font-medium">{property.readyToLive ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ceiling Type</span>
                            <span className="font-medium capitalize">{property.ceilingType || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Floor Type</span>
                            <span className="font-medium capitalize">{property.floorType || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kitchen Count</span>
                            <span className="font-medium">{property.kitchenCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Master Bedrooms</span>
                            <span className="font-medium">{property.masterBedroomCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available From</span>
                            <span className="font-medium">{property.readyToLiveDate || 'Now'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                    {property.amenities && property.amenities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {property.amenities.map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || CheckCircle
                          return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <IconComponent className="h-5 w-5 text-purple-600" />
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">No amenities listed.</p>
                    )}
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Neighborhood</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{property.address || 'Address not available'}</p>
                          <p className="text-gray-600">{property.city}, {property.state} {property.country}</p>
                        </div>
                      </div>
                      
                      {property.nearbyAmenities && property.nearbyAmenities.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Nearby Features</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {property.nearbyAmenities.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Navigation className="h-4 w-4 text-purple-600" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Placeholder for map */}
                      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center">
                          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Interactive map coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Policies</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Lease Terms</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Purpose</span>
                            <span className="font-medium capitalize">{property.propertyPurpose || 'For rent'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rent</span>
                            <span className="font-medium">{formatPrice(property.price || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ready to Live</span>
                            <span className="font-medium">{property.readyToLive ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {property.termsAndConditions && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 text-sm">{property.termsAndConditions}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Landlord</CardTitle>
                  <CardDescription>Get in touch about this property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Property Owner</h3>
                    <p className="text-sm text-gray-600">Verified landlord</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={startChat}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    
                    <Link href={`/properties/${property.id}/apply`} className="block">
                      <Button variant="outline" className="w-full">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowApplyModal(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Apply for Property
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={startChat}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Landlord
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleFavorite}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite(property.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </Button>
                </CardContent>
              </Card>

              {/* Property Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="font-medium">{property.viewCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Listed</span>
                      <span className="font-medium">{property.createdAt ? new Date(property.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Updated</span>
                      <span className="font-medium">{property.updatedAt ? new Date(property.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contextual Help */}
      <ContextualHelp
        page="property-details"
        helpText="Use the tabs to explore different aspects of the property. Click 'Apply Now' to start your rental application, or 'Send Message' to contact the landlord directly."
      />

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <QuickApplyWorkflow
              propertyId={params.id as string}
              propertyTitle={property.propertyTitle || property.description || 'Property'}
              propertyPrice={property.price || 0}
              landlordId={property.ownerId}
              onComplete={() => {
                setShowApplyModal(false)
                toast.success('Application submitted successfully!')
              }}
              onCancel={() => setShowApplyModal(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}