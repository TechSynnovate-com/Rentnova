'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Home, 
  DollarSign, 
  MapPin, 
  Users, 
  Calendar,
  CheckCircle,
  Lightbulb,
  Heart,
  Brain,
  Shield,
  Zap
} from 'lucide-react'

interface PersonalityQuestion {
  id: string
  question: string
  options: {
    id: string
    text: string
    personality: 'practical' | 'luxury' | 'budget' | 'social' | 'minimalist'
    weight: number
  }[]
}

interface RentalAdvice {
  personality: string
  description: string
  recommendations: string[]
  budgetTips: string[]
  locationAdvice: string[]
  priorityFeatures: string[]
}

const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 'lifestyle',
    question: 'What best describes your ideal weekend?',
    options: [
      { id: 'a', text: 'Hosting friends for dinner at home', personality: 'social', weight: 3 },
      { id: 'b', text: 'Exploring new neighborhoods and cafes', personality: 'luxury', weight: 2 },
      { id: 'c', text: 'Staying in with a good book', personality: 'minimalist', weight: 3 },
      { id: 'd', text: 'Working on home improvement projects', personality: 'practical', weight: 3 }
    ]
  },
  {
    id: 'budget',
    question: 'How do you approach major purchases?',
    options: [
      { id: 'a', text: 'Research extensively for the best value', personality: 'practical', weight: 3 },
      { id: 'b', text: 'Look for premium quality, even if it costs more', personality: 'luxury', weight: 3 },
      { id: 'c', text: 'Find the most affordable option that meets basic needs', personality: 'budget', weight: 3 },
      { id: 'd', text: 'Buy only what I absolutely need', personality: 'minimalist', weight: 2 }
    ]
  },
  {
    id: 'space',
    question: 'What matters most in your living space?',
    options: [
      { id: 'a', text: 'Lots of room for entertaining', personality: 'social', weight: 3 },
      { id: 'b', text: 'High-end finishes and modern amenities', personality: 'luxury', weight: 3 },
      { id: 'c', text: 'Functional layout and storage', personality: 'practical', weight: 2 },
      { id: 'd', text: 'Clean, uncluttered environment', personality: 'minimalist', weight: 3 }
    ]
  },
  {
    id: 'location',
    question: 'Your ideal neighborhood has:',
    options: [
      { id: 'a', text: 'Trendy restaurants and nightlife', personality: 'social', weight: 2 },
      { id: 'b', text: 'Upscale shopping and fine dining', personality: 'luxury', weight: 3 },
      { id: 'c', text: 'Good value and practical amenities', personality: 'budget', weight: 3 },
      { id: 'd', text: 'Peace and quiet with easy commute', personality: 'practical', weight: 2 }
    ]
  },
  {
    id: 'priorities',
    question: 'When viewing properties, you focus on:',
    options: [
      { id: 'a', text: 'Natural light and open layout', personality: 'minimalist', weight: 2 },
      { id: 'b', text: 'Kitchen size and entertainment areas', personality: 'social', weight: 3 },
      { id: 'c', text: 'Price per square foot and utilities', personality: 'budget', weight: 3 },
      { id: 'd', text: 'Premium features and building amenities', personality: 'luxury', weight: 2 }
    ]
  }
]

const personalityProfiles: Record<string, RentalAdvice> = {
  practical: {
    personality: 'The Practical Renter',
    description: 'You value functionality, efficiency, and smart decision-making. You want a home that works well for your lifestyle without unnecessary frills.',
    recommendations: [
      'Focus on properties with good layouts and storage',
      'Prioritize reliable landlords with good maintenance records',
      'Look for energy-efficient features to save on utilities',
      'Consider slightly older buildings with character and lower rent'
    ],
    budgetTips: [
      'Aim for 25-30% of income on rent to maintain financial flexibility',
      'Factor in utilities, parking, and maintenance costs',
      'Negotiate on move-in fees and deposits',
      'Consider properties slightly outside prime areas for better value'
    ],
    locationAdvice: [
      'Prioritize good public transportation or easy commute',
      'Look for established neighborhoods with essential services',
      'Consider areas with grocery stores, banks, and healthcare nearby',
      'Research neighborhood safety and community resources'
    ],
    priorityFeatures: ['In-unit laundry', 'Parking', 'Storage space', 'Good cell coverage', 'Reliable heating/AC']
  },
  luxury: {
    personality: 'The Luxury Seeker',
    description: 'You appreciate the finer things in life and want your home to reflect your refined taste. Quality and aesthetics are important to you.',
    recommendations: [
      'Focus on newly renovated or high-end properties',
      'Look for buildings with premium amenities like gym, rooftop, concierge',
      'Prioritize desirable neighborhoods and addresses',
      'Consider properties with designer finishes and modern appliances'
    ],
    budgetTips: [
      'Budget 30-35% of income for premium location and features',
      'Factor in higher utility costs for larger spaces',
      'Consider the value of time saved with premium services',
      'Look for properties that will maintain or increase in value'
    ],
    locationAdvice: [
      'Target trendy neighborhoods with dining and entertainment',
      'Look for areas with cultural attractions and upscale shopping',
      'Consider proximity to business districts or tech hubs',
      'Research future development plans that might affect property values'
    ],
    priorityFeatures: ['High-end appliances', 'Hardwood floors', 'City views', 'Gym/fitness center', 'Doorman/concierge']
  },
  budget: {
    personality: 'The Smart Saver',
    description: 'You are financially savvy and want to maximize value while minimizing costs. Every dollar saved on rent can go toward your other goals.',
    recommendations: [
      'Look for properties in up-and-coming neighborhoods',
      'Consider smaller spaces or studio apartments',
      'Look for rent-stabilized or rent-controlled units',
      'Consider properties that include utilities in rent'
    ],
    budgetTips: [
      'Keep rent under 25% of income to maximize savings',
      'Look for inclusive rent deals (utilities, internet included)',
      'Consider roommates to split costs',
      'Negotiate longer lease terms for lower monthly rent'
    ],
    locationAdvice: [
      'Look slightly outside city centers for better prices',
      'Consider neighborhoods with good public transportation',
      'Research areas where young professionals are moving',
      'Look for areas with free parking and lower cost of living'
    ],
    priorityFeatures: ['All utilities included', 'Free parking', 'No broker fees', 'Move-in specials', 'Public transportation']
  },
  social: {
    personality: 'The Social Butterfly',
    description: 'You love being around people and want a home that facilitates connection and entertainment. Community and location matter most.',
    recommendations: [
      'Look for buildings with common areas and social spaces',
      'Prioritize open-plan layouts for entertaining',
      'Consider properties near restaurants, bars, and entertainment',
      'Look for neighborhoods with active community events'
    ],
    budgetTips: [
      'Budget for entertaining and social activities',
      'Consider the cost of frequent dining out in trendy areas',
      'Look for properties with included social amenities',
      'Factor in higher utility costs for frequent entertaining'
    ],
    locationAdvice: [
      'Prioritize vibrant neighborhoods with nightlife',
      'Look for areas with community centers and events',
      'Consider proximity to friends and social networks',
      'Research neighborhood demographics and community vibe'
    ],
    priorityFeatures: ['Open floor plan', 'Rooftop/common areas', 'Near restaurants/bars', 'Guest parking', 'Sound-friendly for entertaining']
  },
  minimalist: {
    personality: 'The Mindful Minimalist',
    description: 'You value simplicity, quality over quantity, and a peaceful living environment. Less is more in your ideal home.',
    recommendations: [
      'Look for clean, modern spaces with built-in storage',
      'Prioritize natural light and uncluttered layouts',
      'Consider smaller, well-designed spaces over larger cluttered ones',
      'Look for properties in quiet, peaceful neighborhoods'
    ],
    budgetTips: [
      'Focus on quality over size - pay more for better-designed smaller space',
      'Save money on furniture by choosing multipurpose pieces',
      'Look for properties with built-in storage solutions',
      'Consider the mental value of less maintenance and cleaning'
    ],
    locationAdvice: [
      'Prioritize peaceful, quiet neighborhoods',
      'Look for areas with parks and green spaces',
      'Consider proximity to meditation centers, yoga studios',
      'Research noise levels and overall neighborhood tranquility'
    ],
    priorityFeatures: ['Natural light', 'Built-in storage', 'Quiet location', 'Minimal maintenance', 'Clean modern design']
  }
}

interface RentalAdviceWizardProps {
  isOpen: boolean
  onClose: () => void
  propertyData?: any
}

export default function RentalAdviceWizard({ isOpen, onClose, propertyData }: RentalAdviceWizardProps) {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'results'>('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [personalityResult, setPersonalityResult] = useState<string | null>(null)
  const [advice, setAdvice] = useState<RentalAdvice | null>(null)

  const calculatePersonality = () => {
    const scores: Record<string, number> = {
      practical: 0,
      luxury: 0,
      budget: 0,
      social: 0,
      minimalist: 0
    }

    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = personalityQuestions.find(q => q.id === questionId)
      const option = question?.options.find(o => o.id === answerId)
      if (option && option.personality && option.weight) {
        scores[option.personality] = (scores[option.personality] || 0) + option.weight
      }
    })

    const topPersonality = Object.entries(scores).reduce((a, b) => 
      (scores[a[0]] || 0) > (scores[b[0]] || 0) ? a : b
    )[0]

    setPersonalityResult(topPersonality)
    setAdvice(personalityProfiles[topPersonality] || null)
    setStep('results')
  }

  const handleAnswer = (answerId: string) => {
    const currentQ = personalityQuestions[currentQuestion]
    if (!currentQ) return
    const newAnswers = { ...answers, [currentQ.id]: answerId }
    setAnswers(newAnswers)

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculatePersonality()
    }
  }

  const resetWizard = () => {
    setStep('welcome')
    setCurrentQuestion(0)
    setAnswers({})
    setPersonalityResult(null)
    setAdvice(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl mx-4"
      >
        <Card className="shadow-2xl border-lavender-200">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-lavender-600" />
                </div>
                <CardTitle className="text-xl">AI Rental Advisor</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-lavender-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Get Personalized Rental Advice</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Take our quick personality quiz to receive tailored recommendations for your rental search. 
                      I'll analyze your preferences and provide insights on budget, location, and features that matter most to you.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="text-center">
                      <Home className="h-8 w-8 text-lavender-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Property Match</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Budget Tips</p>
                    </div>
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Location Guide</p>
                    </div>
                    <div className="text-center">
                      <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Smart Insights</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button onClick={onClose} variant="outline">
                      Maybe Later
                    </Button>
                    <Button onClick={() => setStep('quiz')} className="bg-lavender-600 hover:bg-lavender-700">
                      Start Quiz
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lavender-600">
                      Question {currentQuestion + 1} of {personalityQuestions.length}
                    </Badge>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-lavender-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {personalityQuestions[currentQuestion]?.question || 'Loading...'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {personalityQuestions[currentQuestion]?.options.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.id)}
                        className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-lavender-300 hover:bg-lavender-50 transition-all duration-200"
                      >
                        <p className="font-medium text-gray-900">{option.text}</p>
                      </motion.button>
                    ))}
                  </div>

                  {currentQuestion > 0 && (
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'results' && advice && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-full flex items-center justify-center mx-auto">
                      {personalityResult === 'practical' && <Shield className="h-8 w-8 text-lavender-600" />}
                      {personalityResult === 'luxury' && <Sparkles className="h-8 w-8 text-lavender-600" />}
                      {personalityResult === 'budget' && <DollarSign className="h-8 w-8 text-lavender-600" />}
                      {personalityResult === 'social' && <Users className="h-8 w-8 text-lavender-600" />}
                      {personalityResult === 'minimalist' && <Zap className="h-8 w-8 text-lavender-600" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{advice.personality}</h2>
                    <p className="text-gray-600 leading-relaxed">{advice.description}</p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Home className="h-4 w-4 mr-2 text-lavender-600" />
                        Property Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {advice.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        Budget Strategy
                      </h4>
                      <ul className="space-y-2">
                        {advice.budgetTips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        Location Insights
                      </h4>
                      <ul className="space-y-2">
                        {advice.locationAdvice.map((loc, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{loc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-lavender-600" />
                        Priority Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {advice.priorityFeatures.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="bg-lavender-100 text-lavender-800">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 pt-4 border-t">
                    <Button onClick={resetWizard} variant="outline">
                      Retake Quiz
                    </Button>
                    <Button onClick={onClose} className="bg-lavender-600 hover:bg-lavender-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Got It!
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}