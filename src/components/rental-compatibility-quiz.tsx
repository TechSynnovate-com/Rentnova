'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  Home, 
  DollarSign, 
  MapPin, 
  Clock, 
  Users, 
  Car, 
  Wifi, 
  PawPrint,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  TrendingUp,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: {
    value: string
    label: string
    icon?: React.ReactNode
  }[]
  category: 'budget' | 'location' | 'lifestyle' | 'amenities' | 'preferences'
}

interface CompatibilityResult {
  score: number
  category: string
  strengths: string[]
  concerns: string[]
  recommendations: string[]
}

interface RentalCompatibilityQuizProps {
  property: any
  onComplete?: (result: CompatibilityResult) => void
  className?: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'budget',
    question: 'What\'s your ideal monthly budget range?',
    category: 'budget',
    options: [
      { value: 'low', label: '₦50,000 - ₦150,000', icon: <DollarSign className="w-4 h-4" /> },
      { value: 'mid', label: '₦150,000 - ₦300,000', icon: <DollarSign className="w-4 h-4" /> },
      { value: 'high', label: '₦300,000 - ₦500,000', icon: <DollarSign className="w-4 h-4" /> },
      { value: 'premium', label: '₦500,000+', icon: <DollarSign className="w-4 h-4" /> }
    ]
  },
  {
    id: 'commute',
    question: 'How important is proximity to your workplace?',
    category: 'location',
    options: [
      { value: 'critical', label: 'Very Important - Under 30 mins', icon: <Clock className="w-4 h-4" /> },
      { value: 'important', label: 'Important - Under 1 hour', icon: <Clock className="w-4 h-4" /> },
      { value: 'moderate', label: 'Moderate - Under 1.5 hours', icon: <Clock className="w-4 h-4" /> },
      { value: 'flexible', label: 'Flexible - Remote/flexible work', icon: <Wifi className="w-4 h-4" /> }
    ]
  },
  {
    id: 'lifestyle',
    question: 'What best describes your lifestyle?',
    category: 'lifestyle',
    options: [
      { value: 'homebody', label: 'Homebody - Love staying in', icon: <Home className="w-4 h-4" /> },
      { value: 'social', label: 'Social butterfly - Always out', icon: <Users className="w-4 h-4" /> },
      { value: 'balanced', label: 'Balanced - Mix of both', icon: <Heart className="w-4 h-4" /> },
      { value: 'workaholic', label: 'Career-focused - Work first', icon: <TrendingUp className="w-4 h-4" /> }
    ]
  },
  {
    id: 'transportation',
    question: 'What\'s your preferred mode of transportation?',
    category: 'preferences',
    options: [
      { value: 'car', label: 'Own car - Need parking', icon: <Car className="w-4 h-4" /> },
      { value: 'public', label: 'Public transport', icon: <MapPin className="w-4 h-4" /> },
      { value: 'rideshare', label: 'Ride-sharing services', icon: <Users className="w-4 h-4" /> },
      { value: 'walk', label: 'Walking/cycling', icon: <Home className="w-4 h-4" /> }
    ]
  },
  {
    id: 'priorities',
    question: 'What\'s your top priority in a rental?',
    category: 'amenities',
    options: [
      { value: 'size', label: 'Spacious living area', icon: <Home className="w-4 h-4" /> },
      { value: 'location', label: 'Prime location', icon: <MapPin className="w-4 h-4" /> },
      { value: 'amenities', label: 'Modern amenities', icon: <Star className="w-4 h-4" /> },
      { value: 'value', label: 'Best value for money', icon: <DollarSign className="w-4 h-4" /> }
    ]
  },
  {
    id: 'household',
    question: 'Who will be living in this property?',
    category: 'lifestyle',
    options: [
      { value: 'single', label: 'Just me', icon: <Users className="w-4 h-4" /> },
      { value: 'couple', label: 'Me and partner', icon: <Heart className="w-4 h-4" /> },
      { value: 'family', label: 'Family with children', icon: <Users className="w-4 h-4" /> },
      { value: 'roommates', label: 'Sharing with roommates', icon: <Users className="w-4 h-4" /> }
    ]
  }
]

export default function RentalCompatibilityQuiz({ 
  property, 
  onComplete,
  className = '' 
}: RentalCompatibilityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateCompatibility()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateCompatibility = async () => {
    setIsCalculating(true)
    
    // Simulate AI calculation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const compatibility = analyzeCompatibility(answers, property)
    setResult(compatibility)
    setIsCompleted(true)
    setIsCalculating(false)
    
    if (onComplete) {
      onComplete(compatibility)
    }
  }

  const analyzeCompatibility = (userAnswers: Record<string, string>, prop: any): CompatibilityResult => {
    let score = 0
    const strengths: string[] = []
    const concerns: string[] = []
    const recommendations: string[] = []

    // Budget compatibility
    const budget = userAnswers.budget
    const propertyPrice = prop?.price || 200000
    
    if (budget === 'low' && propertyPrice <= 150000) {
      score += 25
      strengths.push('Perfect budget match - well within your range')
    } else if (budget === 'mid' && propertyPrice <= 300000) {
      score += 25
      strengths.push('Excellent value for your budget range')
    } else if (budget === 'high' && propertyPrice <= 500000) {
      score += 25
      strengths.push('Premium choice within your budget')
    } else if (budget === 'premium') {
      score += 25
      strengths.push('Unlimited budget flexibility')
    } else {
      concerns.push('Property price may stretch your budget')
      recommendations.push('Consider negotiating rent or look for similar properties in a lower price range')
    }

    // Location & Commute
    const commute = userAnswers.commute
    if (commute === 'critical') {
      if (prop?.city === 'Lagos' || prop?.city === 'Abuja') {
        score += 20
        strengths.push('Located in major business hub - short commute likely')
      } else {
        concerns.push('May not be ideal for critical commute requirements')
      }
    } else if (commute === 'flexible') {
      score += 20
      strengths.push('Remote work flexibility makes location perfect')
    } else {
      score += 15
      strengths.push('Reasonable commute expectations align well')
    }

    // Lifestyle compatibility
    const lifestyle = userAnswers.lifestyle
    if (lifestyle === 'social' && (prop?.city === 'Lagos' || prop?.area?.includes('Island'))) {
      score += 20
      strengths.push('Vibrant social scene and nightlife nearby')
    } else if (lifestyle === 'homebody') {
      score += 15
      strengths.push('Peaceful environment perfect for quiet lifestyle')
    } else if (lifestyle === 'balanced') {
      score += 18
      strengths.push('Well-balanced location with home and social options')
    }

    // Household compatibility
    const household = userAnswers.household
    const bedrooms = prop?.bedroomCount || 2
    
    if (household === 'single' && bedrooms >= 1) {
      score += 15
      strengths.push('Perfect size for single occupancy')
    } else if (household === 'couple' && bedrooms >= 1) {
      score += 15
      strengths.push('Ideal space for couples')
    } else if (household === 'family' && bedrooms >= 2) {
      score += 20
      strengths.push('Family-friendly with adequate bedrooms')
    } else if (household === 'roommates' && bedrooms >= 2) {
      score += 18
      strengths.push('Great for sharing with roommates')
    }

    // Generate recommendations
    if (score >= 80) {
      recommendations.push('This property is an excellent match - schedule a viewing ASAP!')
      recommendations.push('Consider making an offer quickly as this is likely to be competitive')
    } else if (score >= 65) {
      recommendations.push('Good compatibility - worth a viewing to see if it feels right')
      recommendations.push('Ask about flexible lease terms or included utilities')
    } else {
      recommendations.push('Consider viewing but keep looking at other options')
      recommendations.push('Use this as a benchmark to compare with other properties')
    }

    // Additional recommendations based on concerns
    if (concerns.length > 0) {
      recommendations.push('Schedule a viewing to assess concerns in person')
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      category: score >= 80 ? 'Excellent Match' : score >= 65 ? 'Good Match' : score >= 50 ? 'Moderate Match' : 'Consider Other Options',
      strengths,
      concerns,
      recommendations
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsCompleted(false)
    setResult(null)
    setIsCalculating(false)
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const currentQ = quizQuestions[currentQuestion]
  
  if (!currentQ) {
    return null
  }

  if (isCalculating) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <h3 className="text-xl font-semibold">Calculating Your Compatibility...</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing your preferences against this property
            </p>
            <div className="w-full max-w-xs mx-auto">
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isCompleted && result) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Compatibility Analysis Complete
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${result.score >= 80 ? 'text-green-500' : result.score >= 65 ? 'text-yellow-500' : 'text-orange-500'}`}>
                {result.score}%
              </div>
              <p className="text-sm text-muted-foreground">Compatibility</p>
            </div>
            <div className="text-center">
              <Badge 
                variant={result.score >= 80 ? 'default' : result.score >= 65 ? 'secondary' : 'outline'}
                className="text-lg px-4 py-2"
              >
                {result.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                What Works Great
              </h4>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {result.concerns.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Things to Consider
              </h4>
              <ul className="space-y-2">
                {result.concerns.map((concern, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <XCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{concern}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Our Recommendations
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              className="flex-1" 
              size="lg"
              variant={result.score >= 65 ? 'default' : 'secondary'}
            >
              {result.score >= 80 ? 'Schedule Viewing Now' : result.score >= 65 ? 'View Property' : 'Keep Browsing'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={resetQuiz}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          One-Click Rental Compatibility Quiz
          <Badge variant="secondary" className="ml-auto">
            {currentQuestion + 1} of {quizQuestions.length}
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Quick assessment to see how well this property matches your needs
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentQ.question}</h3>
              
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent/50 p-3 rounded-lg transition-colors"
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="flex items-center gap-2"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Get Results' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}