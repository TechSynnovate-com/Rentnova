import { z } from 'zod'

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  role: z.enum(['tenant', 'landlord', 'admin']),
  phoneNumber: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

// Property schema
export const propertySchema = z.object({
  id: z.string(),
  landlordId: z.string(),
  title: z.string(),
  description: z.string(),
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse', 'studio', 'room', 'commercial']),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  details: z.object({
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    squareFootage: z.number().optional(),
    petPolicy: z.enum(['allowed', 'not-allowed', 'cats-only', 'dogs-only']),
    furnished: z.boolean(),
    availableDate: z.string(),
  }),
  pricing: z.object({
    monthlyRent: z.number(),
    securityDeposit: z.number(),
    applicationFee: z.number().optional(),
  }),
  media: z.object({
    images: z.array(z.string()),
    virtualTour: z.string().optional(),
  }),
  amenities: z.array(z.string()),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'inactive']),
  availability: z.enum(['available', 'rented', 'pending', 'maintenance']),
  viewCount: z.number().default(0),
  featured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Property = z.infer<typeof propertySchema>

// Application schema
export const applicationSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  tenantId: z.string(),
  landlordId: z.string(),
  status: z.enum(['draft', 'submitted', 'under-review', 'approved', 'rejected', 'withdrawn']),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    dateOfBirth: z.string(),
  }),
  employment: z.object({
    employer: z.string(),
    position: z.string(),
    monthlyIncome: z.number(),
    startDate: z.string(),
  }),
  preferences: z.object({
    moveInDate: z.string(),
    leaseTerm: z.string(),
  }),
  landlordNotes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Application = z.infer<typeof applicationSchema>

// Property filters
export const propertyFiltersSchema = z.object({
  propertyType: z.array(z.string()).optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  bedrooms: z.array(z.number()).optional(),
  bathrooms: z.array(z.number()).optional(),
  location: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  furnished: z.boolean().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'date-newest', 'date-oldest', 'relevance']).optional(),
})

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>