/**
 * Type Definitions Index
 * Central export point for all TypeScript type definitions
 */

// Re-export all Firebase types
export * from './firebase'

// Re-export component types if any
export * from './components'

// Application-specific types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}

export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterState {
  [key: string]: any
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// Navigation and routing types
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType
  children?: NavigationItem[]
}

// Theme and UI types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
}

// Auth context types
export interface AuthContextType {
  user: any | null
  firebaseUser: any
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, userData: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: any) => Promise<void>
  isAuthenticated: () => boolean
}

// Query and mutation types
export interface QueryOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
  cacheTime?: number
}

export interface MutationOptions<T, V> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: (data: T | undefined, error: Error | null) => void
}

// File upload types
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface FileUploadResult {
  url: string
  name: string
  size: number
}

// Search and discovery types
export interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface AutocompleteOption {
  value: string
  label: string
  category?: string
}

// Map and location types
export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
  coordinates?: Coordinates
}

// Payment and billing types
export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer' | 'ussd'
  last4?: string
  brand?: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  createdAt: string
  paymentMethod: PaymentMethod
}

// Export commonly used utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>