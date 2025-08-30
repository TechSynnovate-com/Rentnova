/**
 * Application constants and configuration values
 * Centralized location for all application-wide constants
 * 
 * @author RentNova Development Team
 * @version 1.0.0
 */

// Property Types
export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Townhouse', 
  'Condo',
  'Studio',
  'Room',
  'Duplex',
  'Villa',
  'Penthouse',
  'Shared Accommodation'
] as const

export type PropertyType = typeof PROPERTY_TYPES[number]

// Nigerian Cities
export const NIGERIAN_CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Kaduna',
  'Jos',
  'Warri',
  'Calabar',
  'Aba',
  'Onitsha',
  'Enugu',
  'Ilorin',
  'Akure',
  'Abeokuta',
  'Osogbo',
  'Uyo',
  'Makurdi',
  'Bauchi'
] as const

export type NigerianCity = typeof NIGERIAN_CITIES[number]

// Available Amenities
export const AMENITY_OPTIONS = [
  'Air Conditioning',
  'Parking',
  'Swimming Pool',
  'Gym/Fitness Center',
  'Security System',
  'CCTV Surveillance',
  'Balcony/Terrace',
  'Garden',
  'Elevator',
  'Generator',
  'Solar Power',
  'Water Heater',
  'Internet/WiFi',
  'Cable TV',
  'Furnished',
  'Washing Machine',
  'Dishwasher',
  'Microwave',
  'Refrigerator',
  'Kitchen Appliances',
  'Guest Room',
  'Storage Room',
  'Playground',
  'Shopping Center Nearby',
  'School Nearby',
  'Hospital Nearby'
] as const

export type AmenityOption = typeof AMENITY_OPTIONS[number]

// Lease Duration Options
export const LEASE_DURATIONS = [
  '6 months',
  '12 months',
  '18 months',
  '24 months',
  '36 months'
] as const

export type LeaseDuration = typeof LEASE_DURATIONS[number]

// Rent Periods
export const RENT_PERIODS = [
  'monthly',
  'yearly'
] as const

export type RentPeriod = typeof RENT_PERIODS[number]

// Furnishing Status
export const FURNISHING_STATUS = [
  'unfurnished',
  'semi-furnished',
  'fully-furnished'
] as const

export type FurnishingStatus = typeof FURNISHING_STATUS[number]

// Pet Policies
export const PET_POLICIES = [
  'not-allowed',
  'allowed-with-fee',
  'allowed'
] as const

export type PetPolicy = typeof PET_POLICIES[number]

// Smoking Policies
export const SMOKING_POLICIES = [
  'not-allowed',
  'outdoor-only',
  'allowed'
] as const

export type SmokingPolicy = typeof SMOKING_POLICIES[number]

// Contact Methods
export const CONTACT_METHODS = [
  'phone',
  'email',
  'both'
] as const

export type ContactMethod = typeof CONTACT_METHODS[number]

// User Roles
export const USER_ROLES = [
  'tenant',
  'landlord',
  'admin'
] as const

export type UserRole = typeof USER_ROLES[number]

// Application Statuses
export const APPLICATION_STATUSES = [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'withdrawn'
] as const

export type ApplicationStatus = typeof APPLICATION_STATUSES[number]

// Property Statuses
export const PROPERTY_STATUSES = [
  'active',
  'inactive',
  'pending',
  'suspended'
] as const

export type PropertyStatus = typeof PROPERTY_STATUSES[number]

// Maintenance Categories
export const MAINTENANCE_CATEGORIES = [
  'plumbing',
  'electrical',
  'hvac',
  'appliances',
  'structural',
  'pest_control',
  'cleaning',
  'other'
] as const

export type MaintenanceCategory = typeof MAINTENANCE_CATEGORIES[number]

// Maintenance Priorities
export const MAINTENANCE_PRIORITIES = [
  'low',
  'medium',
  'high',
  'emergency'
] as const

export type MaintenancePriority = typeof MAINTENANCE_PRIORITIES[number]

// Maintenance Statuses
export const MAINTENANCE_STATUSES = [
  'submitted',
  'acknowledged',
  'assigned',
  'in_progress',
  'completed',
  'cancelled'
] as const

export type MaintenanceStatus = typeof MAINTENANCE_STATUSES[number]

// Employment Statuses
export const EMPLOYMENT_STATUSES = [
  'employed',
  'self-employed',
  'unemployed',
  'student',
  'retired'
] as const

export type EmploymentStatus = typeof EMPLOYMENT_STATUSES[number]

// Document Types
export const DOCUMENT_TYPES = [
  'id_document',
  'proof_of_income',
  'employment_letter',
  'bank_statement',
  'reference_letter'
] as const

export type DocumentType = typeof DOCUMENT_TYPES[number]

// Currencies
export const CURRENCIES = [
  'NGN',
  'USD'
] as const

export type Currency = typeof CURRENCIES[number]

// Price Ranges for Search Filters (in NGN)
export const PRICE_RANGES = [
  { label: 'Under ₦50,000', min: 0, max: 50000 },
  { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
  { label: '₦100,000 - ₦200,000', min: 100000, max: 200000 },
  { label: '₦200,000 - ₦500,000', min: 200000, max: 500000 },
  { label: '₦500,000 - ₦1,000,000', min: 500000, max: 1000000 },
  { label: 'Above ₦1,000,000', min: 1000000, max: Infinity }
] as const

// Bedroom Options
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const

// Bathroom Options  
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const

// Nigerian States
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory'
] as const

export type NigerianState = typeof NIGERIAN_STATES[number]

// Default Values
export const DEFAULT_VALUES = {
  PROPERTY_FORM: {
    propertyType: '',
    furnishingStatus: 'unfurnished' as FurnishingStatus,
    bedrooms: 1,
    bathrooms: 1,
    country: 'Nigeria',
    currency: 'NGN' as Currency,
    petPolicy: 'not-allowed' as PetPolicy,
    smokingPolicy: 'not-allowed' as SmokingPolicy,
    minimumTenancyPeriod: '12 months',
    showContactInfo: true,
    preferredContactMethod: 'phone' as ContactMethod,
    leaseDuration: ['12 months']
  },
  SEARCH_FILTERS: {
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: 1,
    bathrooms: 1
  },
  PAGINATION: {
    page: 1,
    limit: 12,
    total: 0
  }
} as const

// API Endpoints (if using external APIs)
export const API_ENDPOINTS = {
  PLACES_AUTOCOMPLETE: '/api/places/autocomplete',
  PROPERTY_ANALYTICS: '/api/analytics/properties',
  USER_ANALYTICS: '/api/analytics/users'
} as const

// Firebase Collection Names
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  APPLICATIONS: 'applications',
  MAINTENANCE_REQUESTS: 'maintenanceRequests',
  MESSAGES: 'messages',
  FAVORITES: 'favorites',
  ANALYTICS: 'analytics'
} as const

// Storage Paths
export const STORAGE_PATHS = {
  PROPERTY_IMAGES: 'properties',
  USER_DOCUMENTS: 'user-documents',
  MAINTENANCE_IMAGES: 'maintenance',
  AVATARS: 'avatars'
} as const

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: '64px',
  SIDEBAR_WIDTH: '256px',
  SIDEBAR_COLLAPSED_WIDTH: '64px',
  MOBILE_BREAKPOINT: '768px',
  TABLET_BREAKPOINT: '1024px',
  DESKTOP_BREAKPOINT: '1280px'
} as const

// Time Constants
export const TIME_CONSTANTS = {
  TOAST_DURATION: 5000,
  SEARCH_DEBOUNCE: 300,
  AUTO_SAVE_INTERVAL: 30000,
  SESSION_TIMEOUT: 3600000 // 1 hour
} as const

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  NIN_LENGTH: 11,
  MAX_PROPERTY_IMAGES: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_PAYMENTS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_PROPERTY_TOURS: false,
  ENABLE_AI_RECOMMENDATIONS: false
} as const