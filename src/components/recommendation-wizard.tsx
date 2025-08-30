'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Wand2, 
  Home, 
  DollarSign, 
  MapPin, 
  Users, 
  Briefcase,
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Star,
  Bed,
  Bath,
  Square
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProperties } from '@/lib/queries/properties'
import { RecommendationEngine, UserPreferences, RECOMMENDATION_PRESETS } from '@/lib/recommendation-engine'
import { useCountry } from '@/contexts/country-context'
import { FirebaseProperty } from '@/types/firebase-schema'
import Link from 'next/link'
import Image from 'next/image'

interface WizardStep {
  title: string
  icon: React.ReactNode
  description: string
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: 'Budget & Location',
    icon: <DollarSign className="h-5 w-5" />,
    description: 'Tell us your budget and preferred areas'
  },
  {
    title: 'Property Preferences',
    icon: <Home className="h-5 w-5" />,
    description: 'What type of property suits you best?'
  },
  {
    title: 'Lifestyle & Work',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Help us understand your lifestyle'
  },
  {
    title: 'Amenities & Features',
    icon: <Heart className="h-5 w-5" />,
    description: 'What amenities matter most to you?'
  },
  {
    title: 'AI Recommendations',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Get your personalized matches'
  }
]

const AMENITY_OPTIONS = [
  'Swimming Pool', 'Gym/Fitness Center', 'Parking', '24/7 Security',
  'Elevator', 'Generator/Backup Power', 'Air Conditioning', 'Balcony',
  'Garden/Outdoor Space', 'Wifi/Internet', 'Laundry', 'Storage',
  'Concierge', 'Playground', 'Pet-Friendly', 'Public Transport Access'
]

const LIFESTYLE_OPTIONS = [
  { id: 'minimalist', label: 'Minimalist', description: 'Simple, clean, and efficient living' },
  { id: 'luxury', label: 'Luxury', description: 'Premium amenities and high-end finishes' },
  { id: 'family', label: 'Family-Oriented', description: 'Child-friendly with family amenities' },
  { id: 'social', label: 'Social', description: 'Community spaces and social amenities' },
  { id: 'eco', label: 'Eco-Conscious', description: 'Sustainable and environmentally friendly' },
  { id: 'modern', label: 'Modern', description: 'Contemporary design and smart features' }
]

export default function RecommendationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    budget: { min: 0, max: 5000000 },
    location: [],
    propertyTypes: [],
    bedrooms: 2,
    lifestyle: 'modern',
    workStyle: 'hybrid',
    familySize: 1,
    petOwner: false,
    commutePriority: false,
    amenityPreferences: [],
    moveInTimeframe: '1-3 months'
  })
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  
  const { data: allProperties = [] } = useProperties({})
  const { formatPrice } = useCountry()

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (presetKey: string) => {
    const preset = RECOMMENDATION_PRESETS[presetKey as keyof typeof RECOMMENDATION_PRESETS]
    if (preset) {
      setPreferences(prev => ({
        ...prev,
        ...preset,
        propertyTypes: [...preset.propertyTypes],
        amenityPreferences: [...preset.amenityPreferences]
      }))
      setSelectedPreset(presetKey)
    }
  }

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateRecommendations = async (useAI: boolean = false) => {
    setLoading(true)
    try {
      const result = await RecommendationEngine.getRecommendations(
        allProperties,
        preferences as UserPreferences,
        useAI
      )
      setRecommendations(result)
      setCurrentStep(WIZARD_STEPS.length - 1)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Budget & Location
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Budget & Location Preferences</h3>
                <p className="text-gray-600">Let's start with your budget range and preferred locations</p>
              </div>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(RECOMMENDATION_PRESETS).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={selectedPreset === key ? "default" : "outline"}
                    onClick={() => applyPreset(key)}
                    className="p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <span className="capitalize font-medium">{key.replace('_', ' ')}</span>
                    <span className="text-xs text-center opacity-70">Quick setup</span>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="minBudget">Minimum Budget (₦/month)</Label>
                  <Input
                    id="minBudget"
                    type="number"
                    value={preferences.budget?.min || 0}
                    onChange={(e) => updatePreference('budget', {
                      ...preferences.budget,
                      min: parseInt(e.target.value) || 0
                    })}
                    placeholder="e.g., 200000"
                  />
                </div>
                <div>
                  <Label htmlFor="maxBudget">Maximum Budget (₦/month)</Label>
                  <Input
                    id="maxBudget"
                    type="number"
                    value={preferences.budget?.max || 5000000}
                    onChange={(e) => updatePreference('budget', {
                      ...preferences.budget,
                      max: parseInt(e.target.value) || 5000000
                    })}
                    placeholder="e.g., 1000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="locations">Preferred Locations (separate with commas)</Label>
                <Input
                  id="locations"
                  value={preferences.location?.join(', ') || ''}
                  onChange={(e) => updatePreference('location', 
                    e.target.value.split(',').map(l => l.trim()).filter(l => l)
                  )}
                  placeholder="e.g., Lagos, Abuja, Victoria Island"
                />
              </div>
            </div>
          </motion.div>
        )

      case 1: // Property Preferences
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Preferences</h3>
                <p className="text-gray-600">What type of property are you looking for?</p>
              </div>

              <div>
                <Label>Property Types (select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {['apartment', 'house', 'duplex', 'studio', 'penthouse', 'bungalow'].map(type => (
                    <Button
                      key={type}
                      variant={preferences.propertyTypes?.includes(type) ? "default" : "outline"}
                      onClick={() => {
                        const current = preferences.propertyTypes || []
                        const updated = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type]
                        updatePreference('propertyTypes', updated)
                      }}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                  <select
                    id="bedrooms"
                    value={preferences.bedrooms || 2}
                    onChange={(e) => updatePreference('bedrooms', parseInt(e.target.value))}
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4 Bedrooms</option>
                    <option value={5}>5+ Bedrooms</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="familySize">Family/Household Size</Label>
                  <select
                    id="familySize"
                    value={preferences.familySize || 1}
                    onChange={(e) => updatePreference('familySize', parseInt(e.target.value))}
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                  >
                    <option value={1}>Just me</option>
                    <option value={2}>2 people</option>
                    <option value={3}>3 people</option>
                    <option value={4}>4 people</option>
                    <option value={5}>5+ people</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 2: // Lifestyle & Work
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle & Work Style</h3>
                <p className="text-gray-600">Help us understand how you live and work</p>
              </div>

              <div>
                <Label>Lifestyle Preference</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {LIFESTYLE_OPTIONS.map(option => (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all ${
                        preferences.lifestyle === option.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => updatePreference('lifestyle', option.id)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="workStyle">Work Style</Label>
                  <select
                    id="workStyle"
                    value={preferences.workStyle || 'hybrid'}
                    onChange={(e) => updatePreference('workStyle', e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                  >
                    <option value="remote">Work from Home</option>
                    <option value="office">Office-based</option>
                    <option value="hybrid">Hybrid (Mix)</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="moveInTimeframe">Move-in Timeframe</Label>
                  <select
                    id="moveInTimeframe"
                    value={preferences.moveInTimeframe || '1-3 months'}
                    onChange={(e) => updatePreference('moveInTimeframe', e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                  >
                    <option value="immediately">Immediately</option>
                    <option value="1 month">Within 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.petOwner || false}
                    onChange={(e) => updatePreference('petOwner', e.target.checked)}
                    className="rounded"
                  />
                  <span>I have pets</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.commutePriority || false}
                    onChange={(e) => updatePreference('commutePriority', e.target.checked)}
                    className="rounded"
                  />
                  <span>Easy commute is important</span>
                </label>
              </div>
            </div>
          </motion.div>
        )

      case 3: // Amenities
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Amenities & Features</h3>
                <p className="text-gray-600">Select the amenities that matter most to you</p>
              </div>

              <div>
                <Label>Important Amenities (select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {AMENITY_OPTIONS.map(amenity => (
                    <Button
                      key={amenity}
                      variant={preferences.amenityPreferences?.includes(amenity) ? "default" : "outline"}
                      onClick={() => {
                        const current = preferences.amenityPreferences || []
                        const updated = current.includes(amenity)
                          ? current.filter(a => a !== amenity)
                          : [...current, amenity]
                        updatePreference('amenityPreferences', updated)
                      }}
                      className="text-sm h-auto p-3"
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pro tip:</strong> Select 3-5 amenities that are most important to you for better recommendations.
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 4: // Recommendations
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            {!recommendations ? (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Recommendations</h3>
                  <p className="text-gray-600">Choose how you'd like to get your property matches</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => generateRecommendations(false)}>
                    <CardContent className="p-6 text-center">
                      <Wand2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h4 className="font-bold text-lg mb-2">Smart Matching</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Get instant recommendations using our smart algorithm (Free)
                      </p>
                      <Button className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Recommendations'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => generateRecommendations(true)}>
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <h4 className="font-bold text-lg mb-2">AI-Enhanced</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Get AI-powered insights and personalized explanations
                      </p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get AI Recommendations'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg max-w-2xl mx-auto">
                  <p className="text-sm text-gray-600">
                    Both options use the same smart matching algorithm. AI-Enhanced adds personalized explanations but uses API credits.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h3>
                  <p className="text-gray-600">{recommendations.summary}</p>
                  {recommendations.cached && (
                    <Badge variant="outline" className="mt-2">Cached Results</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.recommendations.slice(0, 6).map((property: FirebaseProperty & { score: any }) => (
                    <Card key={property.id} className="hover:shadow-lg transition-all">
                      <div className="relative">
                        <Image
                          src={property.imageUrls?.[0] || '/placeholder-property.jpg'}
                          alt={property.propertyTitle || `${property.propertyType} in ${property.city}`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500 text-white">
                            {property.score.matchPercentage}% Match
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-lg mb-2">
                          {property.propertyTitle || `${property.propertyType} in ${property.city}`}
                        </h4>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.city}, {property.state}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedroomCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.toiletCount}</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-600 mb-3">
                          {formatPrice(property.price)}/month
                        </div>
                        <div className="space-y-1 mb-4">
                          {property.score.reasons.slice(0, 2).map((reason: string, index: number) => (
                            <div key={index} className="flex items-center text-xs text-blue-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {reason}
                            </div>
                          ))}
                        </div>
                        <Link href={`/properties/${property.id}`}>
                          <Button className="w-full">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRecommendations(null)
                      setCurrentStep(0)
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {WIZARD_STEPS.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {index < currentStep ? <CheckCircle className="h-5 w-5" /> : step.icon}
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{WIZARD_STEPS[currentStep]?.title || 'Loading...'}</h2>
          <p className="text-gray-600">{WIZARD_STEPS[currentStep]?.description || ''}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < WIZARD_STEPS.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}