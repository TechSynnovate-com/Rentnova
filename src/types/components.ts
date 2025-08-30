/**
 * Component Type Definitions
 * Types specifically for React components and their props
 */

import type { ReactNode, ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

// Base component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Button component types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Input component types
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date'
  placeholder?: string
  value?: string | number
  defaultValue?: string | number
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  error?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
}

// Card component types
export interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  hover?: boolean
}

// Modal/Dialog component types
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// Form component types
export interface FormFieldProps extends BaseComponentProps {
  label?: string
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  onChange?: (value: string | string[]) => void
}

// Table component types
export interface TableColumn<T> {
  key: keyof T | string
  title: string
  width?: string | number
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: T, index: number) => ReactNode
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  selection?: {
    selectedRowKeys: string[]
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void
  }
  expandable?: {
    expandedRowRender: (record: T) => ReactNode
    rowExpandable?: (record: T) => boolean
  }
}

// Navigation component types
export interface NavItem {
  key: string
  label: string
  icon?: LucideIcon
  href?: string
  children?: NavItem[]
  badge?: string | number
  disabled?: boolean
}

export interface NavigationProps extends BaseComponentProps {
  items: NavItem[]
  activeKey?: string
  collapsed?: boolean
  onItemClick?: (item: NavItem) => void
}

// Layout component types
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode
  sidebar?: ReactNode
  footer?: ReactNode
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
}

// Dashboard component types
export interface DashboardCardProps extends BaseComponentProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

export interface ChartProps extends BaseComponentProps {
  data: any[]
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  height?: number
  responsive?: boolean
  legend?: boolean
  tooltip?: boolean
}

// Property component types
export interface PropertyCardProps extends BaseComponentProps {
  property: any
  showFavorite?: boolean
  showEdit?: boolean
  onFavoriteClick?: (propertyId: string) => void
  onEditClick?: (propertyId: string) => void
  onViewClick?: (propertyId: string) => void
}

export interface PropertyFilterProps extends BaseComponentProps {
  filters: any
  onFiltersChange: (filters: any) => void
  onClear: () => void
}

// Application component types
export interface ApplicationCardProps extends BaseComponentProps {
  application: any
  showActions?: boolean
  onApprove?: (applicationId: string) => void
  onReject?: (applicationId: string) => void
  onView?: (applicationId: string) => void
}

// Maintenance component types
export interface MaintenanceRequestCardProps extends BaseComponentProps {
  request: any
  showActions?: boolean
  onStatusUpdate?: (requestId: string, status: any) => void
  onAssign?: (requestId: string, assignee: string) => void
}

// Message component types
export interface MessageBubbleProps extends BaseComponentProps {
  message: any
  isOwn: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
}

export interface ChatInputProps extends BaseComponentProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

// Upload component types
export interface FileUploadProps extends BaseComponentProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onUpload: (files: File[]) => void
  onProgress?: (progress: any) => void
  onError?: (error: string) => void
}

export interface ImageUploadProps extends FileUploadProps {
  preview?: boolean
  crop?: boolean
  aspectRatio?: number
}

// Search component types
export interface SearchInputProps extends BaseComponentProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  suggestions?: any[]
  loading?: boolean
  debounceMs?: number
}

// Pagination component types
export interface PaginationProps extends BaseComponentProps {
  current: number
  total: number
  pageSize: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
  onChange: (page: number, pageSize: number) => void
}

// Loading component types
export interface LoaderProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
  overlay?: boolean
}

export interface SkeletonProps extends BaseComponentProps {
  lines?: number
  avatar?: boolean
  width?: string | number
  height?: string | number
}

// Toast/Notification component types
export interface ToastProps {
  id: string
  type: any
  title: string
  message: string
  duration?: number
  closable?: boolean
  actions?: any[]
}

// Error boundary types
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: any
  onError?: (error: Error, errorInfo: any) => void
}

// HOC and utility component types
export interface WithLoadingProps {
  loading: boolean
  error?: string
  retry?: () => void
}

export interface ConditionalProps extends BaseComponentProps {
  condition: boolean
  fallback?: any
}

// All types are already exported above with their interface declarations