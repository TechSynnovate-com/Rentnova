'use client'

/**
 * New Property Creation Page
 * Multi-step form for landlords to create and edit property listings
 * 
 * Features:
 * - 6-step property creation wizard
 * - Type-safe form validation
 * - Image upload and management
 * - Real-time form state management
 * - Edit mode for existing properties
 * 
 * @author RentNova Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Image from 'next/image'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

// Icons
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

// Firebase
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

// Contexts
import { useAuth } from '@/contexts/auth-context'

// Types and Constants
import type { PropertyFormData } from '@/types/firebase'
import { 
  AMENITY_OPTIONS, 
  PROPERTY_TYPES, 
  NIGERIAN_CITIES, 
  NIGERIAN_STATES,
  FURNISHING_STATUS,
  PET_POLICIES,
  SMOKING_POLICIES,
  CONTACT_METHODS,
  LEASE_DURATIONS,
  DEFAULT_VALUES
} from '@/lib/constants'

/**
 * Property Creation Form Component
 * Handles both new property creation and existing property editing
 */
function NewPropertyContent(): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Check if we're in edit mode
  const editPropertyId = searchParams?.get('edit') ?? undefined
  const isEditing = Boolean(editPropertyId)
  
  // Form state management
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  
  // Initialize form data with proper typing and default values
  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    propertyTitle: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    country: DEFAULT_VALUES.PROPERTY_FORM.country,
    
    // Property Details  
    bedrooms: DEFAULT_VALUES.PROPERTY_FORM.bedrooms,
    bathrooms: DEFAULT_VALUES.PROPERTY_FORM.bathrooms,
    squareFootage: 0,
    furnishingStatus: DEFAULT_VALUES.PROPERTY_FORM.furnishingStatus,
    yearBuilt: '',
    
    // Pricing
    price: 0,
    securityDeposit: 0,
    serviceCharge: 0,
    currency: DEFAULT_VALUES.PROPERTY_FORM.currency,
    
    // Amenities
    amenities: [],
    
    // Images
    imageUrls: [],
    
    // Availability
    availableFrom: '',
    leaseDuration: [...DEFAULT_VALUES.PROPERTY_FORM.leaseDuration],
    
    // Policies
    petPolicy: DEFAULT_VALUES.PROPERTY_FORM.petPolicy,
    smokingPolicy: DEFAULT_VALUES.PROPERTY_FORM.smokingPolicy,
    minimumTenancyPeriod: DEFAULT_VALUES.PROPERTY_FORM.minimumTenancyPeriod,
    showContactInfo: DEFAULT_VALUES.PROPERTY_FORM.showContactInfo,
    preferredContactMethod: DEFAULT_VALUES.PROPERTY_FORM.preferredContactMethod
  })

  /**
   * Updates a specific field in the form data
   */
  const updateField = (field: keyof PropertyFormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Toggles an amenity in the amenities array
   */
  const toggleAmenity = (amenity: string): void => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  /**
   * Handles file upload for property images
   */
  const handleImageUpload = async (file: File): Promise<string> => {
    // Mock image upload - in real app, this would upload to Firebase Storage
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://storage.firebase.com/properties/${user?.id}/${Date.now()}_${file.name}`
        resolve(mockUrl)
      }, 1000)
    })
  }

  /**
   * Adds a new image to the property
   */
  const addImage = async (): Promise<void> => {
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

  /**
   * Removes an image from the property
   */
  const removeImage = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  /**
   * Validates the current form data
   */
  const validateForm = (): boolean => {
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

  /**
   * Load property data when editing
   */
  useEffect(() => {
    if (!isEditing || !editPropertyId) return
    
    const loadPropertyData = async (): Promise<void> => {
      setLoading(true)
      try {
        const propertyDoc = await getDoc(doc(db, 'properties', editPropertyId))
        if (propertyDoc.exists()) {
          const data = propertyDoc.data() as PropertyFormData
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

  /**
   * Saves the property to Firebase
   */
  const saveProperty = async (): Promise<void> => {
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

  /**
   * Form step configuration
   */
  const steps = [
    {
      title: 'Basic Information',
      description: 'Property title, type and location',
      icon: Home,
      fields: ['propertyTitle', 'description', 'propertyType', 'address', 'city', 'state']
    },
    {
      title: 'Property Details',
      description: 'Bedrooms, bathrooms and size',
      icon: Bed,
      fields: ['bedrooms', 'bathrooms', 'squareFootage', 'furnishingStatus', 'yearBuilt']
    },
    {
      title: 'Pricing',
      description: 'Rental price and additional charges',
      icon: DollarSign,
      fields: ['price', 'securityDeposit', 'serviceCharge', 'currency']
    },
    {
      title: 'Amenities',
      description: 'Property features and amenities',
      icon: Star,
      fields: ['amenities']
    },
    {
      title: 'Images',
      description: 'Property photos and galleries',
      icon: Camera,
      fields: ['imageUrls']
    },
    {
      title: 'Availability',
      description: 'Lease terms and contact preferences',
      icon: MapPin,
      fields: ['availableFrom', 'leaseDuration', 'petPolicy', 'smokingPolicy', 'minimumTenancyPeriod', 'showContactInfo', 'preferredContactMethod']
    }
  ]

  /**
   * Navigation functions
   */
  const goToNextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number): void => {
    setCurrentStep(stepIndex)
  }

  /**
   * Handle price input to prevent leading zeros
   */
  const handlePriceChange = (field: 'price' | 'securityDeposit' | 'serviceCharge', value: string): void => {
    // Remove any leading zeros and non-numeric characters
    const cleanValue = value.replace(/^0+/, '').replace(/[^0-9]/g, '')
    const numericValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10)
    updateField(field, numericValue)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/landlord/properties"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Properties
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Property' : 'List New Property'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Update your property details' : 'Create a new rental listing'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <div 
                  key={index}
                  className={`flex items-center cursor-pointer transition-all ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                  onClick={() => goToStep(index)}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-blue-600 bg-blue-50' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-300 bg-white'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-current' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-6 w-12 h-0.5 transition-all ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {React.createElement(steps[currentStep]?.icon || Home, { className: "h-6 w-6 mr-2" })}
                {steps[currentStep]?.title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="propertyTitle">Property Title *</Label>
                    <Input
                      id="propertyTitle"
                      value={formData.propertyTitle}
                      onChange={(e) => updateField('propertyTitle', e.target.value)}
                      placeholder="e.g., Modern 2BR Apartment in Victoria Island"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Describe your property in detail..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select value={formData.propertyType} onValueChange={(value) => updateField('propertyType', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Street address"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={(value) => updateField('city', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIAN_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => updateField('state', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="mt-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Select value={formData.bedrooms.toString()} onValueChange={(value) => updateField('bedrooms', parseInt(value))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num} Bedroom{num > 1 ? 's' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Select value={formData.bathrooms.toString()} onValueChange={(value) => updateField('bathrooms', parseInt(value))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num} Bathroom{num > 1 ? 's' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input
                        id="squareFootage"
                        type="text"
                        value={formData.squareFootage === 0 ? '' : formData.squareFootage.toString()}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          updateField('squareFootage', value === '' ? 0 : parseInt(value))
                        }}
                        placeholder="e.g., 1200"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="furnishingStatus">Furnishing Status</Label>
                      <Select value={formData.furnishingStatus} onValueChange={(value) => updateField('furnishingStatus', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FURNISHING_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="yearBuilt">Year Built</Label>
                      <Input
                        id="yearBuilt"
                        type="text"
                        value={formData.yearBuilt}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                          updateField('yearBuilt', value)
                        }}
                        placeholder="e.g., 2020"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price">Monthly Rent *</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <Input
                          id="price"
                          type="text"
                          value={formData.price === 0 ? '' : formData.price.toString()}
                          onChange={(e) => handlePriceChange('price', e.target.value)}
                          placeholder="0"
                          className="pl-8 no-spinner"
                          style={{ 
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="securityDeposit">Security Deposit</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <Input
                          id="securityDeposit"
                          type="text"
                          value={formData.securityDeposit === 0 ? '' : formData.securityDeposit.toString()}
                          onChange={(e) => handlePriceChange('securityDeposit', e.target.value)}
                          placeholder="0"
                          className="pl-8 no-spinner"
                          style={{ 
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceCharge">Service Charge</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <Input
                          id="serviceCharge"
                          type="text"
                          value={formData.serviceCharge === 0 ? '' : formData.serviceCharge.toString()}
                          onChange={(e) => handlePriceChange('serviceCharge', e.target.value)}
                          placeholder="0"
                          className="pl-8 no-spinner"
                          style={{ 
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Amenities */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Property Amenities</Label>
                    <p className="text-sm text-gray-600 mt-1">Select all amenities that apply to your property</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <div
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          formData.amenities.includes(amenity)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{amenity}</span>
                          {formData.amenities.includes(amenity) && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Selected amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleAmenity(amenity)
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Images */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Property Images</Label>
                    <p className="text-sm text-gray-600 mt-1">Add photos to showcase your property</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Property ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={addImage}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      <span className="text-sm">Add Image</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Availability */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="availableFrom">Available From</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => updateField('availableFrom', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimumTenancyPeriod">Minimum Tenancy Period</Label>
                      <Select value={formData.minimumTenancyPeriod} onValueChange={(value) => updateField('minimumTenancyPeriod', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEASE_DURATIONS.map((duration) => (
                            <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="petPolicy">Pet Policy</Label>
                      <Select value={formData.petPolicy} onValueChange={(value) => updateField('petPolicy', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PET_POLICIES.map((policy) => (
                            <SelectItem key={policy} value={policy}>
                              {policy.charAt(0).toUpperCase() + policy.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="smokingPolicy">Smoking Policy</Label>
                      <Select value={formData.smokingPolicy} onValueChange={(value) => updateField('smokingPolicy', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SMOKING_POLICIES.map((policy) => (
                            <SelectItem key={policy} value={policy}>
                              {policy.charAt(0).toUpperCase() + policy.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                      <Select value={formData.preferredContactMethod} onValueChange={(value) => updateField('preferredContactMethod', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTACT_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.charAt(0).toUpperCase() + method.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 mt-8">
                      <Switch
                        id="showContactInfo"
                        checked={formData.showContactInfo}
                        onCheckedChange={(checked) => updateField('showContactInfo', checked)}
                      />
                      <Label htmlFor="showContactInfo">Show my contact information publicly</Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={saveProperty}
                disabled={saving}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding number input arrows */}
      <style jsx>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}

export default function NewPropertyPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPropertyContent />
    </Suspense>
  )
}