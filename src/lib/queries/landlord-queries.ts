import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  doc,
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FirebaseLandlord, 
  FirebaseProperty, 
  FirebaseTenant,
  FirebaseMaintenanceRequest,
  FirebaseRentPayment,
  FirebaseApplication
} from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

// Query Keys
export const landlordKeys = {
  all: ['landlord'] as const,
  profile: (landlordId: string) => [...landlordKeys.all, 'profile', landlordId] as const,
  properties: (landlordId: string) => [...landlordKeys.all, 'properties', landlordId] as const,
  tenants: (landlordId: string) => [...landlordKeys.all, 'tenants', landlordId] as const,
  applications: (landlordId: string) => [...landlordKeys.all, 'applications', landlordId] as const,
  maintenance: (landlordId: string) => [...landlordKeys.all, 'maintenance', landlordId] as const,
  payments: (landlordId: string) => [...landlordKeys.all, 'payments', landlordId] as const,
  analytics: (landlordId: string) => [...landlordKeys.all, 'analytics', landlordId] as const,
}

// Get or create landlord profile
export function useLandlordProfile(userId: string) {
  return useQuery({
    queryKey: landlordKeys.profile(userId),
    queryFn: async () => {
      try {
        // First check if landlord profile exists
        const landlordQuery = query(
          collection(db, 'landlords'),
          where('userId', '==', userId)
        )
        const landlordSnapshot = await getDocs(landlordQuery)
        
        if (!landlordSnapshot.empty && landlordSnapshot.docs[0]) {
          const landlordDoc = landlordSnapshot.docs[0]
          return {
            id: landlordDoc.id,
            ...landlordDoc.data()
          } as FirebaseLandlord
        }
        
        // Create new landlord profile if doesn't exist
        const newLandlordData = {
          userId,
          contactInfo: {
            phone: '',
            email: '',
            address: ''
          },
          verified: false,
          totalProperties: 0,
          activeRentals: 0,
          monthlyRevenue: 0,
          joinedAt: new Date(),
          settings: {
            notifications: true,
            autoApproveApplications: false,
            maintenanceNotifications: true
          }
        }
        
        const docRef = await addDoc(collection(db, 'landlords'), newLandlordData)
        console.log('Created new landlord profile:', docRef.id)
        
        return {
          id: docRef.id,
          ...newLandlordData
        } as FirebaseLandlord
        
      } catch (error: any) {
        console.error('Error fetching landlord profile:', error)
        
        // Handle Firebase collection doesn't exist error - auto-create profile
        if (error.code === 'failed-precondition') {
          console.log('Landlord profile does not exist, creating new profile')
          try {
            const newLandlordProfile = {
              userId,
              businessName: '',
              contactInfo: {
                phone: '',
                email: '',
                address: ''
              },
              bankDetails: {
                accountName: '',
                accountNumber: '',
                bankName: '',
                routingNumber: ''
              },
              settings: {
                notifications: true,
                autoApproveApplications: false,
                maintenanceNotifications: true
              },
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            const docRef = await addDoc(collection(db, 'landlords'), newLandlordProfile)
            console.log('Created new landlord profile:', docRef.id)
            
            return {
              id: docRef.id,
              ...newLandlordProfile,
              verified: false,
              totalProperties: 0,
              activeRentals: 0,
              monthlyRevenue: 0,
              joinedAt: new Date()
            } as FirebaseLandlord
          } catch (createError) {
            console.error('Failed to create landlord profile:', createError)
            return null
          }
        }
        throw new Error('Failed to load landlord profile')
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId
  })
}

// Get landlord's properties
export function useLandlordProperties(landlordId: string) {
  return useQuery({
    queryKey: ['landlord', 'properties', landlordId],
    queryFn: async () => {
      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('ownerId', '==', landlordId),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(propertiesQuery)
        const properties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as FirebaseProperty[]
        
        console.log(`Found ${properties.length} properties for owner ${landlordId}:`, properties)
        return properties
      } catch (error: any) {
        console.error('Error fetching properties:', error)
        
        // Handle Firebase collection doesn't exist error
        if (error.code === 'failed-precondition') {
          console.log('Properties collection does not exist yet')
          return []
        }
        throw new Error('Failed to load properties')
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!landlordId
  })
}

// Get landlord's tenants
export function useLandlordTenants(landlordId: string) {
  return useQuery({
    queryKey: landlordKeys.tenants(landlordId),
    queryFn: async () => {
      try {
        const tenantsQuery = query(
          collection(db, 'tenants'),
          where('landlordId', '==', landlordId)
        )
        const snapshot = await getDocs(tenantsQuery)
        const tenants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          personalInfo: {
            ...doc.data().personalInfo,
            dateOfBirth: doc.data().personalInfo?.dateOfBirth?.toDate() || new Date()
          },
          leaseInfo: {
            ...doc.data().leaseInfo,
            startDate: doc.data().leaseInfo?.startDate?.toDate() || new Date(),
            endDate: doc.data().leaseInfo?.endDate?.toDate() || new Date()
          },
          paymentInfo: {
            ...doc.data().paymentInfo,
            nextPaymentDue: doc.data().paymentInfo?.nextPaymentDue?.toDate() || new Date(),
            lastPaymentDate: doc.data().paymentInfo?.lastPaymentDate?.toDate() || null
          }
        })) as FirebaseTenant[]
        
        console.log(`Found ${tenants.length} tenants for landlord ${landlordId}`)
        // Sort in memory to avoid composite index requirement
        return tenants.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      } catch (error: any) {
        console.error('Error fetching tenants:', error)
        
        // Handle Firebase collection doesn't exist error
        if (error.code === 'failed-precondition') {
          console.log('Tenants collection does not exist yet')
          return []
        }
        throw new Error('Failed to load tenants')
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!landlordId
  })
}

// Get pending applications for landlord
export function useLandlordApplications(landlordId: string) {
  return useQuery({
    queryKey: landlordKeys.applications(landlordId),
    queryFn: async () => {
      try {
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('landlordId', '==', landlordId),
          where('status', 'in', ['submitted', 'under_review'])
        )
        const snapshot = await getDocs(applicationsQuery)
        const applications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate() || new Date(),
          reviewedAt: doc.data().reviewedAt?.toDate() || null,
          personalInfo: {
            ...doc.data().personalInfo,
            dateOfBirth: doc.data().personalInfo?.dateOfBirth?.toDate() || new Date()
          }
        })) as FirebaseApplication[]
        
        console.log(`Found ${applications.length} pending applications for landlord ${landlordId}`)
        // Sort in memory to avoid composite index requirement
        return applications.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      } catch (error: any) {
        console.error('Error fetching applications:', error)
        
        // Handle Firebase collection doesn't exist error
        if (error.code === 'failed-precondition') {
          console.log('Applications collection does not exist yet')
          return []
        }
        throw new Error('Failed to load applications')
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for more real-time updates
    enabled: !!landlordId
  })
}

// Get maintenance requests for landlord
export function useLandlordMaintenanceRequests(landlordId: string) {
  return useQuery({
    queryKey: landlordKeys.maintenance(landlordId),
    queryFn: async () => {
      try {
        const maintenanceQuery = query(
          collection(db, 'maintenance_requests'),
          where('landlordId', '==', landlordId)
        )
        const snapshot = await getDocs(maintenanceQuery)
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          scheduledDate: doc.data().scheduledDate?.toDate() || null,
          completedDate: doc.data().completedDate?.toDate() || null
        })) as FirebaseMaintenanceRequest[]
        
        console.log(`Found ${requests.length} maintenance requests for landlord ${landlordId}`)
        // Sort in memory and limit to avoid composite index requirement
        return requests
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 50)
      } catch (error: any) {
        console.error('Error fetching maintenance requests:', error)
        
        // Handle Firebase collection doesn't exist error
        if (error.code === 'failed-precondition') {
          console.log('Maintenance requests collection does not exist yet')
          return []
        }
        throw new Error('Failed to load maintenance requests')
      }
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!landlordId
  })
}

// Get payment history for landlord
export function useLandlordPayments(landlordId: string) {
  return useQuery({
    queryKey: landlordKeys.payments(landlordId),
    queryFn: async () => {
      try {
        const paymentsQuery = query(
          collection(db, 'rent_payments'),
          where('landlordId', '==', landlordId),
          orderBy('paymentDate', 'desc'),
          limit(100)
        )
        const snapshot = await getDocs(paymentsQuery)
        const payments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          paymentDate: doc.data().paymentDate?.toDate() || new Date(),
          dueDate: doc.data().dueDate?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as FirebaseRentPayment[]
        
        console.log(`Found ${payments.length} payments for landlord ${landlordId}`)
        return payments
      } catch (error) {
        console.error('Error fetching payments:', error)
        throw new Error('Failed to load payments')
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!landlordId
  })
}

// Analytics/Dashboard data
export function useLandlordAnalytics(landlordId: string) {
  return useQuery({
    queryKey: landlordKeys.analytics(landlordId),
    queryFn: async () => {
      try {
        // Get all data needed for analytics
        const [propertiesSnapshot, tenantsSnapshot, paymentsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'properties'), where('landlordId', '==', landlordId))),
          getDocs(query(collection(db, 'tenants'), where('landlordId', '==', landlordId))),
          getDocs(query(
            collection(db, 'rent_payments'), 
            where('landlordId', '==', landlordId),
            where('status', '==', 'completed')
          ))
        ])
        
        const properties = propertiesSnapshot.docs.map(doc => doc.data())
        const tenants = tenantsSnapshot.docs.map(doc => doc.data())
        const payments = paymentsSnapshot.docs.map(doc => doc.data())
        
        const totalProperties = properties.length
        const activeRentals = properties.filter(p => p.status === 'occupied').length
        const vacantProperties = properties.filter(p => p.status === 'active').length
        
        // Calculate monthly revenue (current month)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue = payments
          .filter(p => {
            const paymentDate = p.paymentDate?.toDate() || new Date()
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
          })
          .reduce((sum, payment) => sum + (payment.amount || 0), 0)
        
        const occupancyRate = totalProperties > 0 ? (activeRentals / totalProperties) * 100 : 0
        
        // Recent activity
        const recentPayments = payments
          .sort((a, b) => (b.paymentDate?.toDate() || new Date()).getTime() - (a.paymentDate?.toDate() || new Date()).getTime())
          .slice(0, 5)
          
        return {
          totalProperties,
          activeRentals,
          vacantProperties,
          monthlyRevenue,
          occupancyRate: Math.round(occupancyRate * 100) / 100,
          totalTenants: tenants.length,
          recentPayments,
          lastUpdated: new Date()
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        throw new Error('Failed to load analytics data')
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!landlordId
  })
}

// Mutation to update landlord profile
export function useUpdateLandlordProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ landlordId, updates }: { landlordId: string, updates: Partial<FirebaseLandlord> }) => {
      const landlordRef = doc(db, 'landlords', landlordId)
      
      // Clean the updates object to ensure Firebase compatibility
      const cleanUpdates = { ...updates }
      
      // Handle profile image specially - ensure it's a valid format
      if (cleanUpdates.profileImage) {
        if (typeof cleanUpdates.profileImage === 'string') {
          // Check if it's a valid data URL or HTTP URL
          if (!cleanUpdates.profileImage.match(/^(data:image\/[a-zA-Z]*;base64,|https?:\/\/)/)) {
            console.warn('Invalid profile image format, removing from update')
            delete cleanUpdates.profileImage
          }
        } else {
          console.warn('Profile image must be a string, removing from update')
          delete cleanUpdates.profileImage
        }
      }

      await updateDoc(landlordRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      })
      return { landlordId, updates: cleanUpdates }
    },
    onSuccess: ({ landlordId }) => {
      queryClient.invalidateQueries({ queryKey: landlordKeys.profile(landlordId) })
      // Don't show toast here - let the calling component handle it
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      // Don't show toast here - let the calling component handle it with specific error
      throw error
    }
  })
}

// Get single property by ID
export function usePropertyById(propertyId: string) {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) return null
      
      try {
        const docRef = doc(db, 'properties', propertyId)
        const docSnap = await getDoc(docRef)
        
        if (!docSnap.exists()) return null
        
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as FirebaseProperty
      } catch (error) {
        console.error('Error fetching property:', error)
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!propertyId
  })
}

// Mutation to update property
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ propertyId, updates }: { propertyId: string, updates: Partial<FirebaseProperty> }) => {
      const propertyRef = doc(db, 'properties', propertyId)
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { propertyId, updates }
    },
    onSuccess: ({ propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
      queryClient.invalidateQueries({ queryKey: ['landlord', 'properties'] })
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      throw error
    }
  })
}

// Mutation to approve/reject application
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      reviewNotes,
      landlordId 
    }: { 
      applicationId: string
      status: 'approved' | 'rejected'
      reviewNotes?: string
      landlordId: string
    }) => {
      const applicationRef = doc(db, 'applications', applicationId)
      await updateDoc(applicationRef, {
        status,
        reviewNotes: reviewNotes || '',
        reviewedAt: serverTimestamp()
      })
      return { applicationId, status, landlordId }
    },
    onSuccess: ({ landlordId, status }) => {
      queryClient.invalidateQueries({ queryKey: landlordKeys.applications(landlordId) })
      toast.success(`Application ${status} successfully!`)
    },
    onError: (error) => {
      console.error('Error updating application:', error)
      toast.error('Failed to update application')
    }
  })
}
