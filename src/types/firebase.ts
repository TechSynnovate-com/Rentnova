/**
 * Firebase Type Definitions
 * Centralized type definitions for Firebase Firestore collections
 * Used throughout the application for type safety
 */

import type { Timestamp } from 'firebase/firestore'

// Base types for all entities
export interface BaseEntity {
  id: string
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
}

// User and Authentication Types
export interface User extends BaseEntity {
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  phoneNumber?: string
  dateOfBirth?: string
  nin?: string
  emergencyContact?: EmergencyContact
  preferences?: UserPreferences
}

export type UserRole = 'tenant' | 'landlord' | 'admin'

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
  emailUpdates: boolean
}

// Property Types
export interface Property extends BaseEntity {
  // Basic Information
  propertyTitle: string
  description: string
  propertyType: PropertyType
  address: string
  city: string
  state: string
  country: string
  
  // Property Details
  bedrooms: number
  bathrooms: number
  squareFootage?: number
  furnishingStatus: FurnishingStatus
  yearBuilt?: string
  
  // Pricing
  price: number
  securityDeposit?: number
  serviceCharge?: number
  currency: Currency
  rentPeriod: RentPeriod
  
  // Landlord Information
  landlordId: string
  landlordEmail: string
  landlordName: string
  
  // Amenities and Features
  amenities: string[]
  
  // Images
  imageUrls: string[]
  
  // Availability
  isAvailable: boolean
  availableFrom?: string
  leaseDuration: string[]
  
  // Rules and Preferences
  petPolicy: PetPolicy
  smokingPolicy: SmokingPolicy
  minimumTenancyPeriod: string
  
  // Contact Preferences
  showContactInfo: boolean
  preferredContactMethod: ContactMethod
  
  // Platform Features
  status: PropertyStatus
  views: number
  favorites: number
  isFeatured: boolean
  isApproved: boolean
}

export type PropertyType = 
  | 'Apartment' 
  | 'House' 
  | 'Condo' 
  | 'Townhouse' 
  | 'Studio' 
  | 'Duplex' 
  | 'Penthouse' 
  | 'Shared'

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished'
export type Currency = 'NGN' | 'USD'
export type RentPeriod = 'monthly' | 'yearly'
export type PetPolicy = 'not-allowed' | 'allowed-with-fee' | 'allowed'
export type SmokingPolicy = 'not-allowed' | 'outdoor-only' | 'allowed'
export type ContactMethod = 'phone' | 'email' | 'both'
export type PropertyStatus = 'active' | 'inactive' | 'pending' | 'suspended'

// Application Types
export interface Application extends BaseEntity {
  // Property and User Information
  propertyId: string
  tenantId: string
  landlordId: string
  
  // Application Status
  status: ApplicationStatus
  submittedAt: Timestamp | string
  reviewedAt?: Timestamp | string
  reviewNotes?: string
  
  // Personal Information
  personalInfo: PersonalInfo
  
  // Employment Information
  employmentInfo: EmploymentInfo
  
  // Application Specifics
  moveInDate: string
  leaseDuration: string
  coverLetter: string
  
  // Document References
  documents: DocumentReference[]
  
  // Background Checks
  hasCompletedBackgroundCheck?: boolean
  backgroundCheckResults?: BackgroundCheckResults
}

export type ApplicationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'withdrawn'

export interface PersonalInfo {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  nin: string
  currentAddress: string
  emergencyContact: EmergencyContact
}

export interface EmploymentInfo {
  employmentStatus: EmploymentStatus
  employerName?: string
  jobTitle?: string
  monthlyIncome: number
  employmentDuration?: string
  employerContact?: string
}

export type EmploymentStatus = 
  | 'employed' 
  | 'self-employed' 
  | 'unemployed' 
  | 'student' 
  | 'retired'

export interface DocumentReference {
  id: string
  name: string
  type: DocumentType
  url: string
  uploadedAt: Timestamp | string
  verified: boolean
}

export type DocumentType = 
  | 'id_document' 
  | 'proof_of_income' 
  | 'employment_letter' 
  | 'bank_statement' 
  | 'reference_letter'

export interface BackgroundCheckResults {
  creditScore?: number
  criminalRecord: boolean
  evictionHistory: boolean
  verificationStatus: VerificationStatus
  checkCompletedAt: Timestamp | string
}

export type VerificationStatus = 'verified' | 'pending' | 'failed'

// Maintenance Request Types
export interface MaintenanceRequest extends BaseEntity {
  // Basic Information
  title: string
  description: string
  category: MaintenanceCategory
  priority: MaintenancePriority
  
  // Property and User Information
  propertyId: string
  tenantId: string
  landlordId: string
  
  // Request Status
  status: MaintenanceStatus
  submittedAt: Timestamp | string
  assignedAt?: Timestamp | string
  completedAt?: Timestamp | string
  
  // Service Provider
  assignedTo?: string
  serviceProviderContact?: string
  estimatedCost?: number
  actualCost?: number
  
  // Media and Updates
  imageUrls: string[]
  updates: MaintenanceUpdate[]
}

export type MaintenanceCategory = 
  | 'plumbing' 
  | 'electrical' 
  | 'hvac' 
  | 'appliances' 
  | 'structural' 
  | 'pest_control' 
  | 'cleaning' 
  | 'other'

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency'

export type MaintenanceStatus = 
  | 'submitted' 
  | 'acknowledged' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'

export interface MaintenanceUpdate {
  message: string
  timestamp: Timestamp | string
  author: string
  authorRole: UserRole
  imageUrls?: string[]
}

// Message/Communication Types
export interface Message extends BaseEntity {
  // Participants
  senderId: string
  receiverId: string
  propertyId?: string
  
  // Message Content
  content: string
  type: MessageType
  
  // Message Status
  read: boolean
  readAt?: Timestamp | string
  
  // Media
  attachments?: MessageAttachment[]
}

export type MessageType = 'text' | 'image' | 'document' | 'system'

export interface MessageAttachment {
  type: 'image' | 'document'
  url: string
  name: string
  size: number
}

// Favorites and User Interactions
export interface UserFavorites extends BaseEntity {
  userId: string
  properties: string[]
}

// Search and Filter Types
export interface SearchFilters {
  location?: string[]
  propertyType?: PropertyType[]
  priceRange?: {
    min: number
    max: number
  }
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  furnished?: FurnishingStatus[]
}

// Analytics and Reporting Types
export interface PropertyAnalytics extends BaseEntity {
  propertyId: string
  landlordId: string
  period: AnalyticsPeriod
  
  // View Statistics
  totalViews: number
  uniqueViews: number
  averageViewDuration: number
  
  // Application Statistics
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  
  // Financial Metrics
  revenue: number
  occupancyRate: number
  
  // Performance Metrics
  responseTime: number
  tenantSatisfaction?: number
}

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Form Types
export interface PropertyFormData {
  // Basic Information
  propertyTitle: string
  description: string
  propertyType: string
  address: string
  city: string
  state: string
  country: string
  
  // Property Details
  bedrooms: number
  bathrooms: number
  squareFootage: number
  furnishingStatus: string
  yearBuilt: string
  
  // Pricing
  price: number
  securityDeposit: number
  serviceCharge: number
  currency: string
  
  // Amenities
  amenities: string[]
  
  // Images
  imageUrls: string[]
  
  // Availability
  availableFrom: string
  leaseDuration: string[]
  
  // Rules and Preferences
  petPolicy: string
  smokingPolicy: string
  minimumTenancyPeriod: string
  showContactInfo: boolean
  preferredContactMethod: string
}

// All types are already exported above with their interface declarations