import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FirebaseProperty } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

// Query Keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: any) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  landlord: (landlordId: string) => [...propertyKeys.all, 'landlord', landlordId] as const,
  featured: () => [...propertyKeys.all, 'featured'] as const,
}

// Fetch all approved properties with caching
export function useProperties(filters?: {
  city?: string
  state?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  location?: string // New location search parameter
}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async () => {
      let q = query(
        collection(db, 'properties'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      )

      // For specific city/state filters (from UI dropdowns)
      if (filters?.city && !filters?.location) {
        q = query(q, where('city', '==', filters.city))
      }
      if (filters?.state && !filters?.location) {
        q = query(q, where('state', '==', filters.state))
      }
      if (filters?.propertyType) {
        q = query(q, where('propertyType', '==', filters.propertyType))
      }

      const snapshot = await getDocs(q)
      let properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProperty[]

      // Apply location-based filtering with fuzzy matching
      if (filters?.location) {
        const searchTerm = filters.location.toLowerCase().trim()
        console.log('Applying location filter:', searchTerm)
        console.log('Properties before filtering:', properties.length)
        
        properties = properties.filter(property => {
          const address = property.address?.toLowerCase() || ''
          const city = property.city?.toLowerCase() || ''
          const state = property.state?.toLowerCase() || ''
          const country = property.country?.toLowerCase() || ''
          
          // Create full location string for comprehensive search
          const fullLocation = `${address} ${city} ${state} ${country}`.toLowerCase()
          
          // Debug each property
          const matches = {
            fullLocation: fullLocation.includes(searchTerm),
            address: address.includes(searchTerm),
            city: city.includes(searchTerm),
            state: state.includes(searchTerm),
            country: country.includes(searchTerm)
          }
          
          // Check for exact matches first
          if (fullLocation.includes(searchTerm)) {
            console.log(`Match found in ${property.id}:`, { city, state, matches })
            return true
          }
          
          // Check individual components
          if (address.includes(searchTerm) || city.includes(searchTerm) || state.includes(searchTerm) || country.includes(searchTerm)) {
            console.log(`Component match found in ${property.id}:`, { city, state, matches })
            return true
          }
          
          // Split search term and check for partial matches
          const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2)
          const wordMatch = searchWords.some(word => 
            address.includes(word) || 
            city.includes(word) || 
            state.includes(word) ||
            country.includes(word)
          )
          
          if (wordMatch) {
            console.log(`Word match found in ${property.id}:`, { city, state, searchWords })
            return true
          }
          
          return false
        })
        
        console.log('Properties after location filtering:', properties.length)
        
        // Sort by relevance - exact matches first, then partial matches
        properties.sort((a, b) => {
          const aScore = calculateLocationRelevance(a, searchTerm)
          const bScore = calculateLocationRelevance(b, searchTerm)
          return bScore - aScore
        })
      }

      // Apply client-side filters for price and bedrooms
      if (filters?.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice!)
      }
      if (filters?.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!)
      }
      if (filters?.bedrooms) {
        properties = properties.filter(p => p.bedroomCount >= filters.bedrooms!)
      }

      console.log(`Found ${properties.length} approved properties`)
      return properties
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Helper function to calculate location relevance score
function calculateLocationRelevance(property: FirebaseProperty, searchTerm: string): number {
  const address = property.address?.toLowerCase() || ''
  const city = property.city?.toLowerCase() || ''
  const state = property.state?.toLowerCase() || ''
  const country = property.country?.toLowerCase() || ''
  
  let score = 0
  
  // Exact matches get highest score
  if (address === searchTerm) score += 100
  if (city === searchTerm) score += 90
  if (state === searchTerm) score += 80
  
  // Partial matches in address get high score
  if (address.includes(searchTerm)) score += 70
  
  // Starts with matches
  if (address.startsWith(searchTerm)) score += 60
  if (city.startsWith(searchTerm)) score += 50
  if (state.startsWith(searchTerm)) score += 40
  
  // Contains matches
  if (city.includes(searchTerm)) score += 30
  if (state.includes(searchTerm)) score += 20
  if (country.includes(searchTerm)) score += 10
  
  // Word-based matching
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2)
  searchWords.forEach(word => {
    if (address.includes(word)) score += 15
    if (city.includes(word)) score += 10
    if (state.includes(word)) score += 5
  })
  
  return score
}

// Fetch single property with caching
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async () => {
      const docRef = doc(db, 'properties', id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        throw new Error('Property not found')
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseProperty
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch featured properties
export function useFeaturedProperties() {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: async () => {
      const q = query(
        collection(db, 'properties'),
        where('status', '==', 'approved'),
        where('featured', '==', true),
        orderBy('viewCount', 'desc'),
        limit(6)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProperty[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch landlord's properties
export function useLandlordProperties(landlordId: string) {
  return useQuery({
    queryKey: propertyKeys.landlord(landlordId),
    queryFn: async () => {
      const q = query(
        collection(db, 'properties'),
        where('ownerId', '==', landlordId),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProperty[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for owner's properties
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!landlordId,
  })
}

// Update property mutation
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      updates 
    }: { 
      propertyId: string
      updates: Partial<FirebaseProperty> 
    }) => {
      const propertyRef = doc(db, 'properties', propertyId)
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { propertyId, updates }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.propertyId) })
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() })
      
      toast.success('Property updated successfully')
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      toast.error('Failed to update property')
    },
  })
}

// Increment view count mutation
export function useIncrementViewCount() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const propertyRef = doc(db, 'properties', propertyId)
      const propertyDoc = await getDoc(propertyRef)
      
      if (propertyDoc.exists()) {
        const currentViews = propertyDoc.data().viewCount || 0
        await updateDoc(propertyRef, {
          viewCount: currentViews + 1,
          lastViewed: serverTimestamp()
        })
      }
    },
    onSuccess: (_, propertyId) => {
      // Update the cache optimistically
      queryClient.setQueryData(propertyKeys.detail(propertyId), (old: any) => {
        if (old) {
          return {
            ...old,
            viewCount: (old.viewCount || 0) + 1
          }
        }
        return old
      })
    },
  })
}