'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Search, 
  Heart, 
  FileText, 
  MessageSquare,
  Sparkles
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: string
}

interface OnboardingTutorialProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to RentNova! 🏠',
    description: 'Let me show you around your new tenant dashboard. This quick tour will help you get started with finding your perfect rental home.',
    target: '.dashboard-header',
    position: 'bottom'
  },
  {
    id: 'browse-properties',
    title: 'Browse Properties',
    description: 'Start your search here! Browse through our verified rental properties with advanced filters and high-quality photos.',
    target: '[data-tour="browse-properties"]',
    position: 'top',
    action: 'Click to explore properties'
  },
  {
    id: 'favorites',
    title: 'Save Your Favorites ❤️',
    description: 'Found something you like? Save properties to your favorites for easy access later. You currently have saved properties here.',
    target: '[data-tour="favorites"]',
    position: 'top',
    action: 'Manage your saved properties'
  },
  {
    id: 'applications',
    title: 'Track Applications',
    description: 'Monitor all your rental applications in one place. See status updates, upload documents, and communicate with landlords.',
    target: '[data-tour="applications"]',
    position: 'top',
    action: 'View your applications'
  },
  {
    id: 'messages',
    title: 'Direct Communication',
    description: 'Chat directly with landlords, ask questions about properties, and negotiate rental terms securely through our platform.',
    target: '[data-tour="messages"]',
    position: 'top',
    action: 'Start conversations'
  },
  {
    id: 'profile-status',
    title: 'Complete Your Profile',
    description: 'Keep your rental profile up-to-date to increase your chances of approval. Landlords prefer tenants with complete profiles.',
    target: '[data-tour="profile-status"]',
    position: 'left',
    action: 'View profile details'
  },
  {
    id: 'quick-search',
    title: 'Quick Property Search',
    description: 'Use our smart search to find properties that match your specific needs. Filter by location, price, amenities, and more.',
    target: '[data-tour="quick-search"]',
    position: 'top',
    action: 'Try searching now'
  }
]

export default function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Scroll to the target element when step changes
      const target = onboardingSteps[currentStep]?.target
      const targetElement = target ? document.querySelector(target) : null
      if (targetElement) {
        // Scroll to target with better positioning for mobile
        const rect = targetElement.getBoundingClientRect()
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight
        
        if (!isInView) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
        }
      }
    }
  }, [currentStep, isOpen])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen) return null

  const currentStepData = onboardingSteps[currentStep]
  const targetElement = currentStepData?.target ? document.querySelector(currentStepData.target) : null

  if (!targetElement || !currentStepData) {
    return null
  }

  const rect = targetElement.getBoundingClientRect()
  const tooltipPosition = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  }

  const getTooltipStyle = () => {
    const offset = 20
    const tooltipWidth = 320 // Card width (w-80 = 320px)
    const tooltipHeight = 280 // Estimated tooltip height
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    
    let position = { top: 0, left: 0, transform: '' }
    
    // Calculate initial position based on preferred position
    switch (currentStepData.position) {
      case 'top':
        position = {
          top: tooltipPosition.top - offset - tooltipHeight,
          left: tooltipPosition.left + tooltipPosition.width / 2,
          transform: 'translate(-50%, 0)'
        }
        break
      case 'bottom':
        position = {
          top: tooltipPosition.top + tooltipPosition.height + offset,
          left: tooltipPosition.left + tooltipPosition.width / 2,
          transform: 'translate(-50%, 0)'
        }
        break
      case 'left':
        position = {
          top: tooltipPosition.top + tooltipPosition.height / 2,
          left: tooltipPosition.left - offset - tooltipWidth,
          transform: 'translate(0, -50%)'
        }
        break
      case 'right':
        position = {
          top: tooltipPosition.top + tooltipPosition.height / 2,
          left: tooltipPosition.left + tooltipPosition.width + offset,
          transform: 'translate(0, -50%)'
        }
        break
      default:
        position = {
          top: tooltipPosition.top + tooltipPosition.height + offset,
          left: tooltipPosition.left + tooltipPosition.width / 2,
          transform: 'translate(-50%, 0)'
        }
    }
    
    // Adjust for viewport boundaries
    const margin = 20
    
    // Check horizontal bounds
    if (position.left < margin) {
      position.left = margin
      position.transform = 'translate(0, -50%)'
    } else if (position.left + tooltipWidth > viewport.width - margin) {
      position.left = viewport.width - tooltipWidth - margin
      position.transform = 'translate(0, -50%)'
    }
    
    // Check vertical bounds
    if (position.top < margin) {
      position.top = margin
    } else if (position.top + tooltipHeight > viewport.height - margin) {
      position.top = viewport.height - tooltipHeight - margin
    }
    
    return position
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Spotlight on target element */}
      <div 
        className="absolute bg-white bg-opacity-10 rounded-lg border-2 border-lavender-400 shadow-2xl"
        style={{
          top: tooltipPosition.top - 8,
          left: tooltipPosition.left - 8,
          width: tooltipPosition.width + 16,
          height: tooltipPosition.height + 16,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          zIndex: 51
        }}
      />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute z-52"
          style={getTooltipStyle()}
        >
          <Card className="w-80 max-w-[90vw] shadow-2xl border-lavender-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-lavender-600" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Step {currentStep + 1} of {onboardingSteps.length}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentStepData.description}
                </p>
                {currentStepData.action && (
                  <div className="mt-3 p-2 bg-lavender-50 rounded-md">
                    <p className="text-xs text-lavender-700 font-medium">
                      💡 {currentStepData.action}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-lavender-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {currentStep > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevious}
                      disabled={isAnimating}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSkip}
                    className="text-gray-500"
                  >
                    Skip Tour
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={isAnimating}
                    className="bg-lavender-600 hover:bg-lavender-700"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Finish
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Pulsing indicators for interactive elements */}
      <motion.div
        className="absolute z-52 pointer-events-none"
        style={{
          top: tooltipPosition.top + tooltipPosition.height / 2,
          left: tooltipPosition.left + tooltipPosition.width / 2,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <motion.div
          className="w-4 h-4 bg-lavender-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}