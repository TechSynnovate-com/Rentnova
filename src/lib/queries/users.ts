import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FirebaseTenant, FirebaseLandlord } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  tenant: (id: string) => [...userKeys.all, 'tenant', id] as const,
  landlord: (id: string) => [...userKeys.all, 'landlord', id] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
}

// Fetch user profile (tenant or landlord)
export function useUserProfile(userId: string, userType: 'tenant' | 'landlord') {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: async () => {
      const collection = userType === 'tenant' ? 'tenants' : 'landlords'
      const docRef = doc(db, collection, userId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }
      
      return {
        uid: docSnap.id,
        ...docSnap.data()
      } as unknown as FirebaseTenant | FirebaseLandlord
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
  })
}

// Fetch tenant data
export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: userKeys.tenant(tenantId),
    queryFn: async () => {
      const docRef = doc(db, 'tenants', tenantId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }
      
      return {
        uid: docSnap.id,
        ...docSnap.data()
      } as unknown as FirebaseTenant
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!tenantId,
  })
}

// Fetch landlord data
export function useLandlord(landlordId: string) {
  return useQuery({
    queryKey: userKeys.landlord(landlordId),
    queryFn: async () => {
      const docRef = doc(db, 'landlords', landlordId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }
      
      return {
        uid: docSnap.id,
        ...docSnap.data()
      } as unknown as FirebaseLandlord
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!landlordId,
  })
}

// Update user profile mutation
export function useUpdateUserProfile(userType: 'tenant' | 'landlord') {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      updates 
    }: { 
      userId: string
      updates: Partial<FirebaseTenant | FirebaseLandlord> 
    }) => {
      const collection = userType === 'tenant' ? 'tenants' : 'landlords'
      const userRef = doc(db, collection, userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { userId, updates }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.profile(data.userId) })
      if (userType === 'tenant') {
        queryClient.invalidateQueries({ queryKey: userKeys.tenant(data.userId) })
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.landlord(data.userId) })
      }
      
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    },
  })
}