'use client'

import React from 'react'
import { toast } from 'react-hot-toast'
import { AlertTriangle, XCircle, Info, CheckCircle } from 'lucide-react'
import { getErrorCategory, getErrorAction, getAuthErrorMessage } from '@/utils/firebase-errors'

interface ErrorToastOptions {
  title?: string
  duration?: number
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
  showAction?: boolean
}

export const showErrorToast = (
  error: any, 
  context?: string, 
  options: ErrorToastOptions = {}
) => {
  const errorCode = error?.code || 'unknown'
  const errorMessage = getAuthErrorMessage(error)
  const category = getErrorCategory(errorCode)
  const suggestedAction = getErrorAction(errorCode)
  
  const {
    title = 'Error',
    duration = 6000,
    position = 'top-center',
    showAction = true
  } = options

  const getIcon = () => {
    switch (category) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'error':
      default:
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (category) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'error':
      default:
        return 'bg-red-50 border-red-200'
    }
  }

  const customToast = (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border ${getBackgroundColor()} max-w-md`}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">
          {title}
        </p>
        <p className="text-gray-700 text-sm mt-1">
          {errorMessage}
        </p>
        {showAction && suggestedAction && (
          <p className="text-gray-600 text-xs mt-2 font-medium">
            💡 Try: {suggestedAction}
          </p>
        )}
        {context && (
          <p className="text-gray-500 text-xs mt-1">
            Context: {context}
          </p>
        )}
      </div>
    </div>
  )

  toast.custom(customToast, {
    duration,
    position,
    id: `error-${errorCode}-${Date.now()}`
  })
}

export const showSuccessToast = (
  message: string,
  options: Omit<ErrorToastOptions, 'showAction'> = {}
) => {
  const {
    title = 'Success',
    duration = 4000,
    position = 'top-center'
  } = options

  const customToast = (
    <div className="flex items-start space-x-3 p-4 rounded-lg border bg-green-50 border-green-200 max-w-md">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">
          {title}
        </p>
        <p className="text-gray-700 text-sm mt-1">
          {message}
        </p>
      </div>
    </div>
  )

  toast.custom(customToast, {
    duration,
    position,
    id: `success-${Date.now()}`
  })
}

// Quick utility functions for common use cases
export const showAuthError = (error: any) => {
  showErrorToast(error, 'Authentication', {
    title: 'Authentication Error',
    showAction: true
  })
}

export const showPropertyError = (error: any) => {
  showErrorToast(error, 'Property', {
    title: 'Property Error',
    showAction: false
  })
}

export const showApplicationError = (error: any) => {
  showErrorToast(error, 'Application', {
    title: 'Application Error',
    showAction: true
  })
}

export const showProfileError = (error: any) => {
  showErrorToast(error, 'Profile', {
    title: 'Profile Error',
    showAction: true
  })
}