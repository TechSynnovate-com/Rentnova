'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SmartLocationInsights from '@/components/smart-location-insights'
import RentalCompatibilityQuiz from '@/components/rental-compatibility-quiz'
import { 
  Brain, 
  MapPin, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Home,
  Lightbulb
} from 'lucide-react'

// Sample property for demonstration
const sampleProperty = {
  id: 'demo-property',
  propertyTitle: 'Modern 3-Bedroom Apartment in Victoria Island',
  address: 'Plot 1234, Tiamiyu Savage Street',
  city: 'Lagos',
  state: 'Lagos State',
  price: 250000,
  bedroomCount: 3,
  bathroomCount: 2,
  propertyType: 'apartment',
  description: 'Beautiful modern apartment with stunning city views, premium amenities, and excellent connectivity.',
  imageUrls: ['/placeholder-property.jpg']
}

export default function SmartInsightsShowcase() {
  const [activeFeature, setActiveFeature] = useState<'insights' | 'quiz' | null>(null)

  const features = [
    {
      id: 'insights',
      title: 'Smart Location Insights',
      description: 'AI-powered neighborhood analysis with vibe meter',
      icon: <MapPin className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      highlights: [
        'Neighborhood vibe scoring',
        'Safety and accessibility metrics',
        'Real-time local insights',
        'Community demographics',
        'Growth trend analysis'
      ]
    },
    {
      id: 'quiz',
      title: 'One-Click Compatibility Quiz',
      description: 'Instant property-to-person matching algorithm',
      icon: <Target className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      highlights: [
        'Personalized compatibility scoring',
        'Budget and lifestyle analysis',
        'Smart recommendations',
        'Decision support insights',
        'Quick 2-minute assessment'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Brain className="w-5 h-5 mr-2" />
              AI-Powered Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Smart Location Insights &
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Compatibility Quiz
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary AI features that transform how you discover and evaluate rental properties. 
              Get personalized insights and compatibility scores in seconds.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => setActiveFeature(feature.id as 'insights' | 'quiz')}
                    className={`w-full bg-gradient-to-r ${feature.color} text-white border-0 hover:opacity-90 transition-opacity`}
                  >
                    Try {feature.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-2xl p-8 mb-12 border border-gray-200/50">
          <h2 className="text-3xl font-bold text-center mb-8">Why These Features Matter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Data-Driven Decisions</h3>
              <p className="text-gray-600 text-sm">Make informed choices with AI-analyzed neighborhood data and personalized compatibility scores.</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Perfect Property Matching</h3>
              <p className="text-gray-600 text-sm">Our compatibility algorithm matches properties to your lifestyle, budget, and preferences.</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Save Time & Energy</h3>
              <p className="text-gray-600 text-sm">Skip properties that don't match your needs. Focus only on your best options.</p>
            </div>
          </div>
        </div>

        {/* Live Demo Section */}
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Live Demo</h2>
              <p className="text-gray-600">
                Try out the {activeFeature === 'insights' ? 'Smart Location Insights' : 'Rental Compatibility Quiz'} 
                {' '}with our sample property below.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant={activeFeature === 'insights' ? 'default' : 'outline'}
                  onClick={() => setActiveFeature('insights')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Location Insights
                </Button>
                <Button
                  variant={activeFeature === 'quiz' ? 'default' : 'outline'}
                  onClick={() => setActiveFeature('quiz')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Compatibility Quiz
                </Button>
              </div>
            </div>

            {/* Sample Property Card */}
            <Card className="max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Demo Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{sampleProperty.propertyTitle}</h3>
                  <p className="text-gray-600">{sampleProperty.address}, {sampleProperty.city}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{sampleProperty.bedroomCount} bedrooms</span>
                    <span>{sampleProperty.bathroomCount} bathrooms</span>
                    <span>₦{sampleProperty.price.toLocaleString()}/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Demo */}
            <div className="max-w-4xl mx-auto">
              {activeFeature === 'insights' && (
                <SmartLocationInsights 
                  property={sampleProperty}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                />
              )}
              
              {activeFeature === 'quiz' && (
                <RentalCompatibilityQuiz 
                  property={sampleProperty}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                />
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8">
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <Lightbulb className="w-12 h-12 mx-auto" />
                    <h3 className="text-2xl font-bold">Ready to Find Your Perfect Property?</h3>
                    <p className="text-purple-100">
                      Use these smart features on any property listing to make informed rental decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        variant="secondary" 
                        size="lg"
                        onClick={() => window.location.href = '/properties'}
                      >
                        Browse Properties
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-purple-600"
                        onClick={() => window.location.href = '/dashboard'}
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {!activeFeature && (
          <div className="text-center">
            <p className="text-gray-500 mb-6">Click on a feature above to see it in action!</p>
          </div>
        )}
      </div>
    </div>
  )
}