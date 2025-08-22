'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const ONBOARDING_STORAGE_KEY = 'rentnova_onboarding_completed'

export function useOnboarding() {
  const { user } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          // Check Firebase for persistent status
          const userDocRef = doc(db, 'users', user.id)
          const userDoc = await getDoc(userDocRef)
          
          let hasCompleted = false
          if (userDoc.exists()) {
            hasCompleted = userDoc.data().hasSeenOnboarding || false
          }
          
          // Fallback to localStorage if Firebase doesn't have the flag
          if (!hasCompleted) {
            const localCompleted = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}_${user.id}`)
            hasCompleted = localCompleted === 'true'
          }
          
          setHasCompletedOnboarding(hasCompleted)
          
          // DISABLED: Auto-open tour for new users 
          // Tour will only open when user clicks "Take Tour" button
          
        } catch (error) {
          console.error('Error checking onboarding status:', error)
          // Fallback to localStorage only
          const localCompleted = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}_${user.id}`)
          const hasCompleted = localCompleted === 'true'
          setHasCompletedOnboarding(hasCompleted)
        }
      }
    }

    checkOnboardingStatus()
  }, [user])

  const startOnboarding = () => {
    if (user) {
      setIsOnboardingOpen(true)
    }
  }

  const completeOnboarding = async () => {
    if (user) {
      try {
        // Save to Firebase for persistent tracking
        const userDocRef = doc(db, 'users', user.id)
        await setDoc(userDocRef, { hasSeenOnboarding: true }, { merge: true })
        
        // Also save to localStorage as backup
        localStorage.setItem(`${ONBOARDING_STORAGE_KEY}_${user.id}`, 'true')
        
        setHasCompletedOnboarding(true)
        setIsOnboardingOpen(false)
      } catch (error) {
        console.error('Error saving onboarding completion:', error)
        // Fallback to localStorage only
        localStorage.setItem(`${ONBOARDING_STORAGE_KEY}_${user.id}`, 'true')
        setHasCompletedOnboarding(true)
        setIsOnboardingOpen(false)
      }
    }
  }

  const closeOnboarding = () => {
    setIsOnboardingOpen(false)
  }

  return {
    isOnboardingOpen,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    closeOnboarding
  }
}