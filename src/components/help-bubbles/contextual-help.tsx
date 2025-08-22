'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  DollarSign, 
  MapPin, 
  Home, 
  Star,
  Clock,
  Shield,
  MessageSquare
} from 'lucide-react'

interface HelpBubbleData {
  id: string
  title: string
  content: string
  icon: any
  color: string
  tips: string[]
}

const helpContent: Record<string, HelpBubbleData> = {
  'property-price': {
    id: 'property-price',
    title: 'Understanding Property Pricing',
    content: 'This price includes the monthly rent. Additional costs like utilities, parking, or amenities may apply.',
    icon: DollarSign,
    color: 'green',
    tips: [
      'Ask about what utilities are included',
      'Factor in parking costs if needed',
      'Check for any additional fees or deposits',
      'Compare price per square foot with similar properties'
    ]
  },
  'property-location': {
    id: 'property-location',
    title: 'Location Insights',
    content: 'Location affects your daily commute, lifestyle, and long-term satisfaction. Consider these factors.',
    icon: MapPin,
    color: 'blue',
    tips: [
      'Check public transportation options',
      'Research neighborhood safety ratings',
      'Look for nearby grocery stores and services',
      'Consider proximity to work and social activities'
    ]
  },
  'property-features': {
    id: 'property-features',
    title: 'Property Features Guide',
    content: 'These features can significantly impact your daily comfort and lifestyle.',
    icon: Home,
    color: 'lavender',
    tips: [
      'Prioritize features that match your daily routine',
      'Consider maintenance responsibilities',
      'Ask about which amenities have additional costs',
      'Think about long-term needs and lifestyle changes'
    ]
  },
  'application-process': {
    id: 'application-process',
    title: 'Smart Application Strategy',
    content: 'A complete rental profile increases your chances of approval and speeds up the process.',
    icon: Star,
    color: 'yellow',
    tips: [
      'Complete your rental profile before applying',
      'Have all documents ready in digital format',
      'Apply quickly in competitive markets',
      'Follow up professionally with landlords'
    ]
  },
  'rental-timeline': {
    id: 'rental-timeline',
    title: 'Rental Process Timeline',
    content: 'Understanding the typical timeline helps you plan your move and set realistic expectations.',
    icon: Clock,
    color: 'orange',
    tips: [
      'Application review: 1-3 business days',
      'Background check: 2-5 business days',
      'Lease signing: 1-2 days after approval',
      'Move-in preparation: 1-2 weeks'
    ]
  },
  'tenant-rights': {
    id: 'tenant-rights',
    title: 'Know Your Rights',
    content: 'Understanding tenant rights protects you and ensures a positive rental experience.',
    icon: Shield,
    color: 'red',
    tips: [
      'Right to a habitable living space',
      'Privacy rights for property visits',
      'Protection against discrimination',
      'Proper notice for rent increases or eviction'
    ]
  }
}

interface ContextualHelpProps {
  helpKey: string
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export default function ContextualHelp({ helpKey, children, placement = 'top' }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const helpData = helpContent[helpKey]

  useEffect(() => {
    // Show hint animation after a delay
    const timer = setTimeout(() => {
      setShowHint(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!helpData) return <>{children}</>

  const Icon = helpData.icon

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'text-green-600 bg-green-100 border-green-200',
      blue: 'text-blue-600 bg-blue-100 border-blue-200',
      lavender: 'text-lavender-600 bg-lavender-100 border-lavender-200',
      yellow: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      orange: 'text-orange-600 bg-orange-100 border-orange-200',
      red: 'text-red-600 bg-red-100 border-red-200'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.lavender
  }

  return (
    <div className="relative inline-block">
      {children}
      
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: showHint ? 1 : 0, 
          opacity: showHint ? 1 : 0 
        }}
        transition={{ 
          delay: showHint ? 0.5 : 0,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 ${getColorClasses(helpData.color)} hover:scale-110 transition-transform z-10`}
      >
        <HelpCircle className="h-3 w-3 mx-auto" />
      </motion.button>

      {/* Pulsing Ring Animation */}
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 pointer-events-none ${getColorClasses(helpData.color).split(' ')[2]}`}
          />
        )}
      </AnimatePresence>

      {/* Help Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute z-50 w-80 ${
              placement === 'top' ? 'bottom-full mb-2 right-0' :
              placement === 'bottom' ? 'top-full mt-2 right-0' :
              placement === 'left' ? 'right-full mr-2 top-0' :
              'left-full ml-2 top-0'
            }`}
          >
            <Card className="shadow-xl border-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(helpData.color)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{helpData.title}</h4>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {helpData.content}
                </p>

                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">Pro Tips:</span>
                  </div>
                  <ul className="space-y-1">
                    {helpData.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Need more help?</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 text-xs text-lavender-600 hover:text-lavender-700"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Ask AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}