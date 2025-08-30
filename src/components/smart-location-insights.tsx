'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Train, 
  Wifi, 
  Shield, 
  Heart,
  Star,
  Clock,
  DollarSign,
  Building,
  Trees
} from 'lucide-react'

interface LocationInsight {
  area: string
  city: string
  state: string
  coordinates: {
    lat: number
    lng: number
  }
  vibeScore: number
  safetyScore: number
  accessibilityScore: number
  affordabilityScore: number
  lifestyleScore: number
}

interface NeighborhoodVibe {
  name: string
  score: number
  color: string
  icon: React.ReactNode
  description: string
  highlights: string[]
}

interface SmartLocationInsightsProps {
  property: any
  className?: string
}

export default function SmartLocationInsights({ property, className = '' }: SmartLocationInsightsProps) {
  const [insights, setInsights] = useState<LocationInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [vibes, setVibes] = useState<NeighborhoodVibe[]>([])

  // Generate location insights based on property location
  useEffect(() => {
    const generateLocationInsights = async () => {
      setLoading(true)
      
      // Simulate API call with realistic data generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const locationInsight: LocationInsight = {
        area: property.address || 'Downtown',
        city: property.city || 'Lagos',
        state: property.state || 'Lagos State',
        coordinates: {
          lat: 6.5244 + (Math.random() - 0.5) * 0.1,
          lng: 3.3792 + (Math.random() - 0.5) * 0.1
        },
        vibeScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
        safetyScore: Math.floor(Math.random() * 25) + 75,
        accessibilityScore: Math.floor(Math.random() * 35) + 65,
        affordabilityScore: Math.floor(Math.random() * 40) + 60,
        lifestyleScore: Math.floor(Math.random() * 30) + 70
      }

      const neighborhoodVibes: NeighborhoodVibe[] = [
        {
          name: 'Professional Hub',
          score: 92,
          color: 'from-blue-500 to-cyan-500',
          icon: <Building className="w-5 h-5" />,
          description: 'Perfect for career-focused individuals',
          highlights: ['Close to business district', 'Networking opportunities', 'Modern co-working spaces']
        },
        {
          name: 'Cultural Hotspot',
          score: 88,
          color: 'from-purple-500 to-pink-500',
          icon: <Star className="w-5 h-5" />,
          description: 'Rich in arts, entertainment, and culture',
          highlights: ['Art galleries nearby', 'Live music venues', 'Cultural festivals']
        },
        {
          name: 'Green Sanctuary',
          score: 85,
          color: 'from-green-500 to-emerald-500',
          icon: <Trees className="w-5 h-5" />,
          description: 'Nature lovers paradise',
          highlights: ['Parks and gardens', 'Jogging trails', 'Clean air quality']
        },
        {
          name: 'Foodie Paradise',
          score: 90,
          color: 'from-orange-500 to-red-500',
          icon: <Coffee className="w-5 h-5" />,
          description: 'Culinary adventures await',
          highlights: ['Diverse restaurants', 'Food markets', 'Street food culture']
        },
        {
          name: 'Shopping Haven',
          score: 86,
          color: 'from-indigo-500 to-purple-500',
          icon: <ShoppingBag className="w-5 h-5" />,
          description: 'Retail therapy at its finest',
          highlights: ['Shopping malls', 'Local markets', 'Fashion outlets']
        },
        {
          name: 'Transport Hub',
          score: 94,
          color: 'from-teal-500 to-blue-500',
          icon: <Train className="w-5 h-5" />,
          description: 'Excellent connectivity options',
          highlights: ['Metro stations', 'Bus terminals', 'Ride-share availability']
        }
      ]

      setInsights(locationInsight)
      setVibes(neighborhoodVibes)
      setLoading(false)
    }

    if (property) {
      generateLocationInsights()
    }
  }, [property])

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Smart Location Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Insights Card */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Smart Location Insights
            <Badge variant="secondary" className="ml-auto">
              AI Powered
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {insights.area}, {insights.city}, {insights.state}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Vibe Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-3"
            >
              <div className="relative mx-auto w-20 h-20">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl`}>
                  {insights.vibeScore}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Neighborhood Vibe</h3>
                <p className="text-sm text-muted-foreground">Overall atmosphere</p>
              </div>
            </motion.div>

            {/* Safety Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold">Safety</span>
                <span className="ml-auto text-lg font-bold">{insights.safetyScore}/100</span>
              </div>
              <Progress value={insights.safetyScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Well-lit streets, low crime rate</p>
            </motion.div>

            {/* Accessibility Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Accessibility</span>
                <span className="ml-auto text-lg font-bold">{insights.accessibilityScore}/100</span>
              </div>
              <Progress value={insights.accessibilityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Public transport, walkability</p>
            </motion.div>

            {/* Affordability Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">Affordability</span>
                <span className="ml-auto text-lg font-bold">{insights.affordabilityScore}/100</span>
              </div>
              <Progress value={insights.affordabilityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Living costs, amenities pricing</p>
            </motion.div>

            {/* Lifestyle Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="font-semibold">Lifestyle</span>
                <span className="ml-auto text-lg font-bold">{insights.lifestyleScore}/100</span>
              </div>
              <Progress value={insights.lifestyleScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Entertainment, social life</p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold">Growth</span>
                <Badge variant="secondary" className="ml-auto">+12%</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Property value trending up</p>
                <p>• New developments nearby</p>
                <p>• Population growth steady</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Neighborhood Vibe Meter */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Neighborhood Vibe Meter
            <Badge variant="outline" className="ml-auto">
              Live Data
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover what makes this area special
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vibes.map((vibe, index) => (
              <motion.div
                key={vibe.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${vibe.color}`} />
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${vibe.color} text-white`}>
                    {vibe.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{vibe.name}</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={vibe.score} className="h-1 flex-1" />
                      <span className="text-xs font-medium">{vibe.score}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{vibe.description}</p>

                <div className="space-y-1">
                  {vibe.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          View on Map
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Price Trends
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Community Info
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Commute Times
        </Button>
      </div>
    </div>
  )
}