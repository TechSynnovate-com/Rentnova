export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'tenant' | 'landlord' | 'admin'
  phoneNumber?: string
  dateOfBirth?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  employmentInfo?: {
    employer: string
    position: string
    monthlyIncome: number
    startDate: string
  }
  documents?: {
    idVerification?: string
    incomeProof?: string
    references?: string[]
  }
  preferences?: {
    notifications: boolean
    emailUpdates: boolean
    theme: 'light' | 'dark' | 'system'
  }
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  landlordId: string
  title: string
  description: string
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'room' | 'commercial'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  details: {
    bedrooms?: number
    bathrooms?: number
    squareFootage?: number
    yearBuilt?: number
    parkingSpaces?: number
    petPolicy: 'allowed' | 'not-allowed' | 'cats-only' | 'dogs-only'
    furnished: boolean
    availableDate: string
  }
  pricing: {
    monthlyRent: number
    securityDeposit: number
    applicationFee?: number
    brokerFee?: number
    utilities?: {
      electricity: boolean
      water: boolean
      gas: boolean
      internet: boolean
      cable: boolean
    }
  }
  media: {
    images: string[]
    virtualTour?: string
    floorPlan?: string
  }
  amenities: string[]
  nearbyFeatures: string[]
  rules: string[]
  documents: {
    lease?: string
    propertyDisclosure?: string
    certificates?: string[]
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive'
  availability: 'available' | 'rented' | 'pending' | 'maintenance'
  viewCount: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'withdrawn'
  personalInfo: {
    fullName: string
    email: string
    phone: string
    dateOfBirth: string
    emergencyContact: {
      name: string
      phone: string
      relationship: string
    }
  }
  rentalHistory: {
    currentAddress?: string
    landlordContact?: string
    monthlyRent?: number
    moveInDate?: string
    moveOutDate?: string
    reasonForLeaving?: string
  }[]
  employment: {
    employer: string
    position: string
    monthlyIncome: number
    startDate: string
    supervisorContact?: string
  }
  financialInfo: {
    bankName?: string
    accountType?: string
    creditScore?: number
    monthlyDebts?: number
    additionalIncome?: number
  }
  references: {
    name: string
    relationship: string
    phone: string
    email?: string
  }[]
  documents: {
    idVerification: string
    incomeProof: string
    bankStatements?: string[]
    references?: string[]
    additionalDocs?: string[]
  }
  preferences: {
    moveInDate: string
    leaseTerm: string
    additionalOccupants?: {
      name: string
      relationship: string
      dateOfBirth: string
    }[]
    pets?: {
      type: string
      breed: string
      weight: number
      name: string
    }[]
  }
  landlordNotes?: string
  adminNotes?: string
  communicationHistory: {
    id: string
    from: string
    to: string
    message: string
    timestamp: Date
    read: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Lease {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  applicationId: string
  status: 'active' | 'expired' | 'terminated' | 'pending'
  terms: {
    startDate: string
    endDate: string
    monthlyRent: number
    securityDeposit: number
    lateFeePeriod: number
    lateFeeAmount: number
    renewalOption: boolean
  }
  payments: {
    id: string
    amount: number
    dueDate: string
    paidDate?: string
    status: 'pending' | 'paid' | 'late' | 'failed'
    method?: string
    transactionId?: string
  }[]
  maintenanceRequests: MaintenanceRequest[]
  documents: {
    signedLease: string
    moveInInspection?: string
    moveOutInspection?: string
    keyHandover?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceRequest {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  leaseId?: string
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliances' | 'structural' | 'cosmetic' | 'other'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  images?: string[]
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
  scheduledDate?: string
  completedDate?: string
  tenantNotes?: string
  landlordNotes?: string
  contractorNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  leaseId: string
  tenantId: string
  landlordId: string
  amount: number
  type: 'rent' | 'security-deposit' | 'late-fee' | 'utility' | 'other'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  method: 'credit-card' | 'bank-transfer' | 'cash' | 'check' | 'online'
  dueDate: string
  paidDate?: string
  description?: string
  receiptUrl?: string
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface PropertyFilters {
  propertyType?: string[]
  priceRange?: [number, number]
  bedrooms?: number[]
  bathrooms?: number[]
  location?: string
  amenities?: string[]
  petPolicy?: string[]
  furnished?: boolean
  availableDate?: string
  sortBy?: 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest' | 'relevance'
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'application' | 'payment' | 'maintenance' | 'lease' | 'system'
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface Analytics {
  propertyViews: number
  applications: number
  leases: number
  revenue: number
  occupancyRate: number
  averageRent: number
  maintenanceRequests: number
  period: 'day' | 'week' | 'month' | 'year'
}