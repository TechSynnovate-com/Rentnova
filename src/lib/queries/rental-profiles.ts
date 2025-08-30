import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FIREBASE_COLLECTIONS, FirebaseApplication } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

// Query keys
export const RENTAL_PROFILE_KEYS = {
  all: ['rental-profiles'] as const,
  byUserId: (userId: string) => [...RENTAL_PROFILE_KEYS.all, userId] as const,
}

// Get rental profile by user ID
export function useRentalProfile(userId: string | null) {
  return useQuery({
    queryKey: RENTAL_PROFILE_KEYS.byUserId(userId || ''),
    queryFn: async () => {
      if (!userId) return null
      
      const docRef = doc(db, FIREBASE_COLLECTIONS.RENTAL_PROFILES, userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as any
        return data
      }
      
      return null
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create rental profile mutation
export function useCreateRentalProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, profileData }: { userId: string; profileData: any }) => {
      const docRef = doc(db, FIREBASE_COLLECTIONS.RENTAL_PROFILES, userId)
      
      const newProfile: any = {
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        currentAddress: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phoneNumber: ''
        },
        employmentStatus: 'employed',
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
          smokingPreference: 'non-smoker'
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
        verificationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastUpdated: new Date(),
        ...profileData
      }
      
      await setDoc(docRef, newProfile)
      return newProfile
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: RENTAL_PROFILE_KEYS.byUserId(variables.userId) })
      toast.success('Rental profile created successfully')
    },
    onError: (error) => {
      console.error('Error creating rental profile:', error)
      toast.error('Failed to create rental profile')
    }
  })
}

// Update rental profile mutation
export function useUpdateRentalProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const docRef = doc(db, FIREBASE_COLLECTIONS.RENTAL_PROFILES, userId)
      
      const updateData = {
        ...updates,
        lastUpdated: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(docRef, updateData, { merge: true })
      return updateData
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: RENTAL_PROFILE_KEYS.byUserId(variables.userId) })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      console.error('Error updating rental profile:', error)
      toast.error('Failed to update profile')
    }
  })
}

// Utility function to calculate completion percentage
export function calculateCompletionPercentage(profile: any): number {
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
  completed += basicFields.filter(field => field && field.toString().trim() !== '').length * 5
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

// Set up real-time listener for rental profile
export function useRentalProfileListener(userId: string | null, callback: (profile: any) => void) {
  return {
    subscribe: () => {
      if (!userId) return () => {}
      
      const docRef = doc(db, FIREBASE_COLLECTIONS.RENTAL_PROFILES, userId)
      
      return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data() as any
          // Ensure all nested objects exist with default values
          const profileWithDefaults = {
            ...data,
            emergencyContact: data.emergencyContact || {
              name: '',
              relationship: '',
              phoneNumber: ''
            },
            rentalHistory: data.rentalHistory || {
              currentlyRenting: false
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
              smokingPreference: 'non-smoker' as const
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
          callback(profileWithDefaults)
        } else {
          callback(null)
        }
      }, (error) => {
        console.error('Error in rental profile listener:', error)
        callback(null)
      })
    }
  }
}