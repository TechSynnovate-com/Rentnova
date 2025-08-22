'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const AMENITY_OPTIONS = [
  'Air Conditioning', 'Parking', 'Swimming Pool', 'Gym/Fitness Center', 
  'Security System', 'Balcony/Terrace', 'Garden', 'Elevator',
  'Generator', 'Water Heater', 'Internet/WiFi', 'Cable TV',
  'Furnished', 'Washing Machine', 'Dishwasher', 'Microwave',
  'Refrigerator', 'Study Room', 'Guest Room', 'Storage Room',
  'Playground', 'Shopping Center Nearby', 'School Nearby', 'Hospital Nearby'
]
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  Camera, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Plus, 
  X,
  Upload,
  Save,
  Eye,
  Star,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'

interface PropertyFormData {
  // Basic Information
  propertyTitle: string
  description: string
  propertyType: string
  address: string
  city: string
  state: string
  country: string
  
  // Property Details
  bedrooms: number
  bathrooms: number
  squareFootage: number
  furnishingStatus: string
  yearBuilt: string
  
  // Pricing
  price: number
  securityDeposit: number
  serviceCharge: number
  currency: string
  
  // Amenities
  amenities: string[]
  
  // Images
  imageUrls: string[]
  
  // Availability
  availableFrom: string
  leaseDuration: string[]
  
  // Rules & Preferences
  petPolicy: string
  smokingPolicy: string
  minimumTenancyPeriod: string
  
  // Contact
  showContactInfo: boolean
  preferredContactMethod: string
}

const AMENITY_OPTIONS = [
  'Air Conditioning', 'Balcony', 'Parking', 'Swimming Pool', 'Gym/Fitness Center',
  '24/7 Security', 'Elevator', 'Generator/Backup Power', 'Garden/Outdoor Space',
  'Wifi/Internet', 'Laundry', 'Storage', 'Concierge', 'Playground', 'Cable TV',
  'Dishwasher', 'Microwave', 'Refrigerator', 'Washing Machine', 'Dryer'
]

const PROPERTY_TYPES = [
  'Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Duplex', 'Villa', 'Penthouse'
]

const CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Kaduna', 'Jos'
]

export default function NewPropertyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editPropertyId = searchParams.get('edit')
  const isEditing = !!editPropertyId
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyTitle: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    furnishingStatus: 'unfurnished',
    yearBuilt: '',
    price: 0,
    securityDeposit: 0,
    serviceCharge: 0,
    currency: 'NGN',
    amenities: [],
    imageUrls: [],
    availableFrom: '',
    leaseDuration: ['12 months'],
    petPolicy: 'not-allowed',
    smokingPolicy: 'not-allowed',
    minimumTenancyPeriod: '12 months',
    showContactInfo: true,
    preferredContactMethod: 'phone'
  })

  const updateField = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const addImage = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    if (!formData.propertyTitle || !formData.description || !formData.propertyType || 
        !formData.address || !formData.city || !formData.state || !formData.price) {
      toast.error('Please fill in all required fields')
      return false
    }
    return true
  }

  const handleImageUpload = async (file: File) => {
    // Mock image upload - in real app, this would upload to Firebase Storage
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://storage.firebase.com/properties/${user?.id}/${Date.now()}_${file.name}`
        resolve(mockUrl)
      }, 1000)
    })
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      for (const file of files) {
        const url = await handleImageUpload(file)
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, url]
        }))
        toast.success('Image uploaded successfully!')
      }
    }
    input.click()
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const required = ['propertyTitle', 'description', 'propertyType', 'address', 'city', 'state']
    const missing = required.filter(field => !formData[field as keyof PropertyFormData])
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`)
      return false
    }
    
    if (formData.price <= 0) {
      toast.error('Please enter a valid rental price')
      return false
    }
    
    return true
  }

  // Load property data when editing
  useEffect(() => {
    const loadPropertyData = async () => {
      if (!isEditing || !editPropertyId) return
      
      setLoading(true)
      try {
        const propertyDoc = await getDoc(doc(db, 'properties', editPropertyId))
        if (propertyDoc.exists()) {
          const data = propertyDoc.data()
          setFormData({
            propertyTitle: data.propertyTitle || '',
            description: data.description || '',
            propertyType: data.propertyType || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || 'Nigeria',
            bedrooms: data.bedrooms || 1,
            bathrooms: data.bathrooms || 1,
            squareFootage: data.squareFootage || 0,
            furnishingStatus: data.furnishingStatus || 'unfurnished',
            yearBuilt: data.yearBuilt || '',
            price: data.price || 0,
            securityDeposit: data.securityDeposit || 0,
            serviceCharge: data.serviceCharge || 0,
            currency: data.currency || 'NGN',
            amenities: data.amenities || [],
            imageUrls: data.imageUrls || [],
            availableFrom: data.availableFrom || '',
            leaseDuration: data.leaseDuration || ['12 months'],
            petPolicy: data.petPolicy || 'not-allowed',
            smokingPolicy: data.smokingPolicy || 'not-allowed',
            minimumTenancyPeriod: data.minimumTenancyPeriod || '12 months',
            showContactInfo: data.showContactInfo || true,
            preferredContactMethod: data.preferredContactMethod || 'phone'
          })
        }
      } catch (error) {
        console.error('Error loading property:', error)
        toast.error('Failed to load property data')
      } finally {
        setLoading(false)
      }
    }
    
    loadPropertyData()
  }, [isEditing, editPropertyId])

  const saveProperty = async () => {
    if (!validateForm()) return
    
    setSaving(true)
    try {
      const propertyData = {
        ...formData,
        landlordId: user?.id,
        landlordEmail: user?.email,
        landlordName: user?.displayName || user?.email,
        updatedAt: serverTimestamp(),
        status: 'active',
        views: 0,
        favorites: 0,
        isFeatured: false,
        isApproved: false
      }

      if (isEditing && editPropertyId) {
        // Update existing property
        await updateDoc(doc(db, 'properties', editPropertyId), propertyData)
        toast.success('Property updated successfully!')
      } else {
        // Create new property
        await addDoc(collection(db, 'properties'), {
          ...propertyData,
          createdAt: serverTimestamp(),
          isApproved: false // Admin approval required for new properties
        })
        toast.success('Property listed successfully!')
      }
      
      router.push('/dashboard/landlord/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      toast.error('Failed to save property. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: Home },
    { id: 2, title: 'Details', icon: Square },
    { id: 3, title: 'Pricing', icon: DollarSign },
    { id: 4, title: 'Amenities', icon: Star },
    { id: 5, title: 'Images', icon: Camera },
    { id: 6, title: 'Availability', icon: MapPin }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/landlord/properties" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{isEditing ? 'Edit Property' : 'List New Property'}</h1>
              <p className="text-blue-200">{isEditing ? 'Update your property details' : 'Add your property to start receiving tenant applications'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step) => {
                  const IconComponent = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                        isActive 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : isCompleted
                          ? 'bg-green-50 text-green-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-blue-500 text-white' :
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-300 text-gray-600'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Home className="h-6 w-6 mr-2 text-blue-600" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Provide the essential details about your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="propertyTitle">Property Title *</Label>
                        <Input
                          id="propertyTitle"
                          value={formData.propertyTitle}
                          onChange={(e) => updateField('propertyTitle', e.target.value)}
                          placeholder="e.g., Beautiful 2-Bedroom Apartment in Victoria Island"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type *</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => updateField('propertyType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Select value={formData.city} onValueChange={(value) => updateField('city', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {CITIES.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Full Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => updateField('address', e.target.value)}
                          placeholder="Enter the complete address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          placeholder="e.g., Lagos State"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => updateField('country', e.target.value)}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="description">Property Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => updateField('description', e.target.value)}
                          placeholder="Describe your property in detail..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Property Details */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Square className="h-6 w-6 mr-2 text-blue-600" />
                      Property Details
                    </CardTitle>
                    <CardDescription>
                      Add specific details about rooms and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms *</Label>
                        <Select value={formData.bedrooms.toString()} onValueChange={(value) => updateField('bedrooms', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} Bedroom{num > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms *</Label>
                        <Select value={formData.bathrooms.toString()} onValueChange={(value) => updateField('bathrooms', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bathrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} Bathroom{num > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="squareFootage">Square Footage</Label>
                        <Input
                          id="squareFootage"
                          type="text"
                          value={formData.squareFootage || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateField('squareFootage', value ? parseInt(value) : 0)
                          }}
                          placeholder="e.g., 1200"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="furnishingStatus">Furnishing Status</Label>
                        <Select value={formData.furnishingStatus} onValueChange={(value) => updateField('furnishingStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select furnishing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                            <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          value={formData.yearBuilt}
                          onChange={(e) => updateField('yearBuilt', e.target.value)}
                          placeholder="e.g., 2020"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Pricing */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-6 w-6 mr-2 text-blue-600" />
                      Pricing Information
                    </CardTitle>
                    <CardDescription>
                      Set your rental price and deposit requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price">Monthly Rent *</Label>
                        <Input
                          id="price"
                          type="text"
                          value={formData.price || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateField('price', value ? parseInt(value) : 0)
                          }}
                          placeholder="e.g., 150000"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="securityDeposit">Security Deposit</Label>
                        <Input
                          id="securityDeposit"
                          type="text"
                          value={formData.securityDeposit || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateField('securityDeposit', value ? parseInt(value) : 0)
                          }}
                          placeholder="e.g., 300000"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceCharge">Service Charge (Optional)</Label>
                        <Input
                          id="serviceCharge"
                          type="text"
                          value={formData.serviceCharge || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateField('serviceCharge', value ? parseInt(value) : 0)
                          }}
                          placeholder="e.g., 20000"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Amenities */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-6 w-6 mr-2 text-blue-600" />
                      Amenities & Features
                    </CardTitle>
                    <CardDescription>
                      Select the amenities available in your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {AMENITY_OPTIONS.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Images */}
              {currentStep === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-6 w-6 mr-2 text-blue-600" />
                      Property Images
                    </CardTitle>
                    <CardDescription>
                      Add photos to showcase your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={addImage}
                        className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Add Image</span>
                        </div>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 6: Availability */}
              {currentStep === 6 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                      Availability & Preferences
                    </CardTitle>
                    <CardDescription>
                      Set availability dates and tenant preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="availableFrom">Available From</Label>
                        <Input
                          id="availableFrom"
                          type="date"
                          value={formData.availableFrom}
                          onChange={(e) => updateField('availableFrom', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimumTenancyPeriod">Minimum Tenancy Period</Label>
                        <Select value={formData.minimumTenancyPeriod} onValueChange={(value) => updateField('minimumTenancyPeriod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select minimum period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6 months">6 Months</SelectItem>
                            <SelectItem value="12 months">12 Months</SelectItem>
                            <SelectItem value="24 months">24 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="petPolicy">Pet Policy</Label>
                        <Select value={formData.petPolicy} onValueChange={(value) => updateField('petPolicy', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-allowed">No Pets Allowed</SelectItem>
                            <SelectItem value="allowed-with-fee">Pets Allowed (with fee)</SelectItem>
                            <SelectItem value="allowed">Pets Allowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smokingPolicy">Smoking Policy</Label>
                        <Select value={formData.smokingPolicy} onValueChange={(value) => updateField('smokingPolicy', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select smoking policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-allowed">No Smoking</SelectItem>
                            <SelectItem value="outdoor-only">Outdoor Only</SelectItem>
                            <SelectItem value="allowed">Smoking Allowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Switch
                            checked={formData.showContactInfo}
                            onCheckedChange={(checked) => updateField('showContactInfo', checked)}
                          />
                          <span>Show my contact information to interested tenants</span>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 6 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={saveProperty}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        List Property
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}