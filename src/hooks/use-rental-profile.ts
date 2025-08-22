import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { getAuthErrorMessage, logAuthError } from '@/utils/firebase-errors'

interface RentalProfile {
  // Basic Information
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  alternateEmail?: string
  currentAddress: string
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
  }
  
  // Employment Information
  employmentStatus: 'employed' | 'self-employed' | 'student' | 'unemployed' | 'retired'
  employer?: string
  jobTitle?: string
  workAddress?: string
  monthlyIncome: number
  employmentDuration?: string
  supervisorContact?: string
  
  // Financial Information
  bankName?: string
  accountType?: string
  creditScore?: number
  monthlyDebts?: number
  hasGuarantor: boolean
  guarantorInfo?: {
    name: string
    relationship: string
    phoneNumber: string
    address: string
    occupation: string
  }
  
  // Rental History
  rentalHistory: {
    currentlyRenting: boolean
    previousAddress?: string
    landlordName?: string
    landlordContact?: string
    rentAmount?: number
    tenancyDuration?: string
    reasonForLeaving?: string
  }
  
  // Preferences
  preferences: {
    preferredLocation: string[]
    maxBudget: number
    minBedrooms: number
    maxBedrooms: number
    preferredPropertyType: string[]
    moveInDate: string
    leaseDuration: string
    petOwner: boolean
    smokingPreference: 'non-smoker' | 'smoker' | 'occasional'
    additionalRequirements?: string
  }
  
  // Documents Status
  documents: {
    governmentId: boolean
    proofOfIncome: boolean
    bankStatements: boolean
    employmentLetter: boolean
    references: boolean
    guarantorDocuments: boolean
  }
  
  // Profile Metadata
  completionPercentage: number
  lastUpdated: any
  isVerified: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  createdAt: any
}

export function useRentalProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<RentalProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.id, 'rental_profile', 'data'),
      async (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data() as RentalProfile
            // Ensure all nested objects exist with default values
            const profileWithDefaults = {
              ...data,
              emergencyContact: data.emergencyContact || {
                name: '',
                relationship: '',
                phoneNumber: ''
              },
              rentalHistory: data.rentalHistory || {
                currentlyRenting: false,
                previousAddress: '',
                landlordName: '',
                landlordContact: '',
                rentAmount: 0,
                tenancyDuration: '',
                reasonForLeaving: ''
              },
              preferences: data.preferences || {
                preferredLocation: [],
                maxBudget: 0,
                minBedrooms: 1,
                maxBedrooms: 5,
                preferredPropertyType: [],
                moveInDate: '',
                leaseDuration: '12 months',
                petOwner: false,
                smokingPreference: 'non-smoker' as const,
                additionalRequirements: ''
              },
              documents: data.documents || {
                governmentId: false,
                proofOfIncome: false,
                bankStatements: false,
                employmentLetter: false,
                references: false,
                guarantorDocuments: false
              }
            }
            setProfile(profileWithDefaults)
          } else {
            // Auto-create empty profile for new users
            const newProfile = {
              fullName: user.displayName || '',
              dateOfBirth: '',
              phoneNumber: '',
              currentAddress: '',
              emergencyContact: {
                name: '',
                relationship: '',
                phoneNumber: ''
              },
              employmentStatus: 'employed' as const,
              monthlyIncome: 0,
              hasGuarantor: false,
              rentalHistory: {
                currentlyRenting: false,
                previousAddress: '',
                landlordName: '',
                landlordContact: '',
                rentAmount: 0,
                tenancyDuration: '',
                reasonForLeaving: ''
              },
              preferences: {
                preferredLocation: [],
                maxBudget: 0,
                minBedrooms: 1,
                maxBedrooms: 5,
                preferredPropertyType: [],
                moveInDate: '',
                leaseDuration: '12 months',
                petOwner: false,
                smokingPreference: 'non-smoker' as const,
                additionalRequirements: ''
              },
              documents: {
                governmentId: false,
                proofOfIncome: false,
                bankStatements: false,
                employmentLetter: false,
                references: false,
                guarantorDocuments: false
              },
              completionPercentage: 0,
              isVerified: false,
              verificationStatus: 'pending' as const,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastUpdated: serverTimestamp()
            }
            
            // Create the profile in Firebase in the correct nested collection
            const profileRef = doc(db, 'users', user.id, 'rental_profile', 'data')
            await setDoc(profileRef, newProfile)
            setProfile(newProfile)
          }
          setLoading(false)
        } catch (error) {
          console.error('Error handling rental profile:', error)
          setError('Error loading rental profile')
          setLoading(false)
        }
      },
      (error) => {
        console.error('Error fetching rental profile:', error)
        setError('Error loading rental profile')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const calculateCompletionPercentage = (profile: RentalProfile): number => {
    if (!profile) return 0
    
    let completed = 0
    let total = 0

    // Basic Information (30%)
    const basicFields = [
      profile.fullName,
      profile.dateOfBirth,
      profile.phoneNumber,
      profile.currentAddress,
      profile.emergencyContact?.name,
      profile.emergencyContact?.phoneNumber
    ]
    completed += basicFields.filter(field => field && field.trim() !== '').length * 5
    total += basicFields.length * 5

    // Employment (25%)
    if (profile.employmentStatus) completed += 5
    if (profile.monthlyIncome > 0) completed += 10
    if (profile.employer) completed += 5
    if (profile.jobTitle) completed += 5
    total += 25

    // Preferences (20%)
    if (profile.preferences?.preferredLocation?.length > 0) completed += 5
    if (profile.preferences?.maxBudget > 0) completed += 5
    if (profile.preferences?.moveInDate) completed += 5
    if (profile.preferences?.preferredPropertyType?.length > 0) completed += 5
    total += 20

    // Documents (25%)
    const documentCount = Object.values(profile.documents || {}).filter(Boolean).length
    completed += documentCount * 4
    total += Object.keys(profile.documents || {}).length * 4

    return Math.round((completed / total) * 100)
  }

  const isProfileComplete = (): boolean => {
    if (!profile) return false
    return calculateCompletionPercentage(profile) >= 70 // Minimum 70% completion
  }

  const getProfileStatus = () => {
    if (!profile) return { status: 'not-created', message: 'Create your rental profile to apply for properties' }
    
    const percentage = calculateCompletionPercentage(profile)
    if (percentage >= 90) return { status: 'complete', message: 'Profile complete - ready to apply!' }
    if (percentage >= 70) return { status: 'good', message: 'Profile mostly complete - you can apply for properties' }
    if (percentage >= 40) return { status: 'partial', message: 'Profile partially complete - complete more sections to improve your application' }
    return { status: 'incomplete', message: 'Profile incomplete - complete your profile to apply for properties' }
  }

  const getMissingFields = (): string[] => {
    if (!profile) return ['Complete profile setup']
    
    const missing: string[] = []
    
    // Check basic fields
    if (!profile.fullName?.trim()) missing.push('Full name')
    if (!profile.dateOfBirth) missing.push('Date of birth')
    if (!profile.phoneNumber?.trim()) missing.push('Phone number')
    if (!profile.currentAddress?.trim()) missing.push('Current address')
    if (!profile.emergencyContact?.name?.trim()) missing.push('Emergency contact name')
    if (!profile.emergencyContact.phoneNumber?.trim()) missing.push('Emergency contact phone')
    
    // Check employment
    if (profile.monthlyIncome <= 0) missing.push('Monthly income')
    if (profile.employmentStatus === 'employed' && !profile.employer?.trim()) missing.push('Employer name')
    
    // Check preferences
    if (profile.preferences.maxBudget <= 0) missing.push('Budget preference')
    if (!profile.preferences.moveInDate) missing.push('Preferred move-in date')
    
    // Check documents
    const requiredDocs = ['governmentId', 'proofOfIncome', 'bankStatements']
    const missingDocs = requiredDocs.filter(doc => !profile.documents[doc as keyof typeof profile.documents])
    if (missingDocs.length > 0) {
      missing.push(`Required documents: ${missingDocs.join(', ')}`)
    }
    
    return missing
  }

  const updateProfile = async (updates: Partial<RentalProfile>) => {
    if (!user) return

    try {
      const docRef = doc(db, 'users', user.id, 'rental_profile', 'data')
      const profileData = {
        ...profile,
        ...updates,
        lastUpdated: new Date(),
        updatedAt: new Date()
      }
      
      // Calculate completion percentage
      profileData.completionPercentage = calculateCompletionPercentage(profileData)
      
      await setDoc(docRef, profileData, { merge: true })
      
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const createProfile = async (profileData: Partial<RentalProfile>) => {
    if (!user) return

    try {
      const docRef = doc(db, 'users', user.id, 'rental_profile', 'data')
      const newProfile = {
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        currentAddress: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phoneNumber: ''
        },
        employmentStatus: 'employed' as const,
        monthlyIncome: 0,
        hasGuarantor: false,
        rentalHistory: {
          currentlyRenting: false
        },
        preferences: {
          preferredLocation: [],
          maxBudget: 0,
          minBedrooms: 1,
          maxBedrooms: 5,
          preferredPropertyType: [],
          moveInDate: '',
          leaseDuration: '12 months',
          petOwner: false,
          smokingPreference: 'non-smoker' as const
        },
        documents: {
          governmentId: false,
          proofOfIncome: false,
          bankStatements: false,
          employmentLetter: false,
          references: false,
          guarantorDocuments: false
        },
        completionPercentage: 0,
        isVerified: false,
        verificationStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...profileData
      }
      
      newProfile.completionPercentage = calculateCompletionPercentage(newProfile)
      
      await setDoc(docRef, newProfile)
      
      toast.success('Rental profile created successfully')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    }
  }

  const getCompletionPercentage = () => {
    if (!profile) return 0
    return calculateCompletionPercentage(profile)
  }

  return {
    profile,
    loading,
    error,
    isProfileComplete,
    getProfileStatus,
    getMissingFields,
    updateProfile,
    createProfile,
    getCompletionPercentage
  }
}