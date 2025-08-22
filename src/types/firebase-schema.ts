// Firebase Schema Types for RentNova

export interface FirebaseLandlord {
  id: string
  userId: string // Reference to auth user
  businessName?: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
  bankDetails?: {
    accountName: string
    accountNumber: string
    bankName: string
    routingNumber?: string
  }
  profileImage?: string
  verified: boolean
  totalProperties: number
  activeRentals: number
  monthlyRevenue: number
  joinedAt: Date
  settings: {
    notifications: boolean
    autoApproveApplications: boolean
    maintenanceNotifications: boolean
  }
}

export interface FirebaseSupportMessage {
  id: string
  userId?: string
  userEmail: string
  phone?: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  response?: string
  isUserMessage: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface FirebaseProperty {
  id: string
  ownerId?: string // Firebase UID of property owner
  landlordId?: string // Landlord profile ID
  ownerName?: string
  ownerEmail?: string
  propertyTitle?: string
  address: string // Simple string address for compatibility
  city?: string
  state?: string
  country?: string
  description: string
  propertyType: string // 'apartment' | 'house' | 'studio' | 'condo' | 'townhouse' | 'commercial'
  propertyPurpose?: string // 'rent' | 'sale'
  
  // Pricing
  price: number // Monthly rent or sale price
  rentPeriod?: string // 'monthly' | 'yearly' | 'weekly'
  requiresUpfrontDeposit?: boolean
  depositYears?: number
  
  // Property Details
  bedroomCount: number
  masterBedroomCount?: number
  kitchenCount?: number
  toiletCount?: number // Also serves as bathroomCount
  parkingCount?: number
  size?: number // Square meters
  
  // Features and Amenities
  features?: string[]
  amenities?: string[] // Legacy field
  furnishings?: string[]
  kitchenFeatures?: string[]
  bathroomFeatures?: string[]
  buildingAmenities?: string[]
  utilities?: string[]
  
  // Property Characteristics
  ceilingType?: string
  floorType?: string
  
  // Availability
  isAvailable?: boolean
  readyToLive?: boolean
  readyToLiveDate?: string
  isFeatured?: boolean
  
  // Media
  imageUrls: string[] // Primary image field
  images?: string[] // Alternative/compatibility field
  videoUrl?: string
  
  // Status and Metadata
  status: 'draft' | 'pending' | 'approved' | 'active' | 'occupied' | 'maintenance' | 'inactive'
  viewCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseTenant {
  id: string
  userId: string // Reference to auth user
  landlordId: string
  propertyId: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    dateOfBirth: Date
    emergencyContact: {
      name: string
      phone: string
      relationship: string
    }
  }
  leaseInfo: {
    startDate: Date
    endDate: Date
    monthlyRent: number
    securityDeposit: number
    leaseStatus: 'active' | 'expired' | 'terminated' | 'pending'
  }
  paymentInfo: {
    nextPaymentDue: Date
    lastPaymentDate?: Date
    totalPaid: number
    outstandingBalance: number
    paymentMethod?: string
  }
  documents: {
    leaseAgreement?: string
    idVerification?: string
    incomeProof?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseMaintenanceRequest {
  id: string
  tenantId: string
  landlordId: string
  propertyId: string
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliances' | 'structural' | 'pest' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'submitted' | 'in-progress' | 'completed' | 'cancelled'
  images?: string[]
  estimatedCost?: number
  actualCost?: number
  assignedTo?: string // Contractor/maintenance person
  scheduledDate?: Date
  completedDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseRentPayment {
  id: string
  tenantId: string
  landlordId: string
  propertyId: string
  amount: number
  paymentDate: Date
  dueDate: Date
  paymentMethod: 'bank_transfer' | 'card' | 'cash' | 'check' | 'mobile_money'
  status: 'pending' | 'completed' | 'failed' | 'late' | 'partial'
  transactionId?: string
  notes?: string
  lateFee?: number
  createdAt: Date
}

export interface FirebaseMessage {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  subject?: string
  message: string
  messageType: 'general' | 'maintenance' | 'payment' | 'lease' | 'complaint'
  attachments?: string[]
  isRead: boolean
  isArchived: boolean
  createdAt: Date
}

export interface FirebaseLeaseAgreement {
  id: string
  landlordId: string
  tenantId: string
  propertyId: string
  terms: {
    startDate: Date
    endDate: Date
    monthlyRent: number
    securityDeposit: number
    latePaymentFee: number
    petDeposit?: number
    utilitiesIncluded: string[]
  }
  conditions: {
    smokingAllowed: boolean
    petsAllowed: boolean
    maxOccupants: number
    renewalOption: boolean
  }
  status: 'draft' | 'pending_signature' | 'signed' | 'active' | 'expired' | 'terminated'
  signatures: {
    landlordSigned: boolean
    tenantSigned: boolean
    landlordSignedAt?: Date
    tenantSignedAt?: Date
  }
  documentUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Application status tracking
export interface FirebaseApplication {
  id: string
  propertyId: string
  landlordId: string
  applicantId: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    dateOfBirth: Date
  }
  employmentInfo: {
    employer: string
    position: string
    monthlyIncome: number
    employmentLetter?: string
  }
  rentalHistory: {
    previousAddress?: string
    previousLandlord?: string
    reasonForLeaving?: string
  }
  documents: {
    idDocument?: string
    incomeProof?: string
    bankStatement?: string
    references?: string[]
  }
  applicationFee: {
    amount: number
    paid: boolean
    transactionId?: string
  }
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired'
  reviewNotes?: string
  submittedAt: Date
  reviewedAt?: Date
}

// Firebase Collections Constants
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  LANDLORDS: 'landlords',
  TENANTS: 'tenants',
  RENTAL_PROFILES: 'rental_profiles',
  APPLICATIONS: 'applications',
  FAVORITES: 'favorites',
  MAINTENANCE_REQUESTS: 'maintenance_requests',
  PAYMENTS: 'payments',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications'
} as const