/**
 * Firebase Authentication Error Handler
 * Converts Firebase error codes to user-friendly messages
 */

export interface FirebaseErrorCode {
  code: string
  message: string
}

export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Authentication errors
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email address. Please check your email or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    
    // Registration errors
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-password': 'Please enter a valid password (at least 6 characters).',
    'auth/missing-password': 'Please enter a password.',
    'auth/requires-recent-login': 'For security reasons, please sign in again to continue.',
    
    // Profile and verification errors
    'auth/unverified-email': 'Please verify your email address before continuing.',
    'auth/expired-action-code': 'The verification link has expired. Please request a new one.',
    'auth/invalid-action-code': 'Invalid verification code. Please try again.',
    'auth/user-token-expired': 'Your session has expired. Please sign in again.',
    
    // Password reset errors
    'auth/invalid-continue-uri': 'Invalid reset link. Please request a new password reset.',
    'auth/missing-continue-uri': 'Password reset link is incomplete. Please try again.',
    'auth/unauthorized-continue-uri': 'Domain not authorized for password reset. Please contact support or try creating a new account.',
    
    // Generic errors
    'auth/internal-error': 'Something went wrong. Please try again later.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups and try again.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    
    // Custom validation errors
    'auth/missing-email': 'Please enter your email address.',
    'auth/invalid-display-name': 'Please enter a valid name.',
    'auth/missing-phone-number': 'Please enter your phone number.',
    'auth/invalid-phone-number': 'Please enter a valid phone number.',
    
    // Profile completion errors
    'profile/incomplete': 'Please complete your profile before continuing.',
    'profile/invalid-role': 'Please select a valid account type.',
    'profile/missing-required-fields': 'Please fill in all required fields.',
    'profile/document-upload-failed': 'Failed to upload document. Please try again.',
    
    // Application errors
    'application/insufficient-profile': 'Your profile needs to be at least 70% complete to apply.',
    'application/missing-documents': 'Please upload required documents before applying.',
    'application/already-applied': 'You have already applied for this property.',
    'application/property-unavailable': 'This property is no longer available for applications.',
    'application/missing-cover-letter': 'Please write a cover letter explaining why you want to rent this property.',
    'application/missing-move-date': 'Please specify when you would like to move in.',
    
    // Property errors
    'property/not-found': 'Property not found or has been removed.',
    'property/access-denied': 'You do not have permission to view this property.',
    'property/images-failed': 'Failed to load property images. Please refresh the page.',
    
    // Chat/messaging errors
    'chat/permission-denied': 'You do not have permission to access this conversation.',
    'chat/message-failed': 'Failed to send message. Please try again.',
    'chat/room-not-found': 'Conversation not found.',
    
    // Payment errors
    'payment/insufficient-funds': 'Insufficient funds. Please check your payment method.',
    'payment/card-declined': 'Your card was declined. Please try a different payment method.',
    'payment/expired-card': 'Your card has expired. Please update your payment method.',
    'payment/invalid-amount': 'Invalid payment amount.',
    
    // Generic fallback
    'unknown': 'An unexpected error occurred. Please try again or contact support if the problem persists.'
  }

  return errorMessages[errorCode] || errorMessages['unknown']
}

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return getFirebaseErrorMessage('unknown')
  
  // Handle Firebase AuthError
  if (error.code) {
    return getFirebaseErrorMessage(error.code)
  }
  
  // Handle generic errors
  if (error.message) {
    // Check for common error patterns
    if (error.message.includes('network')) {
      return getFirebaseErrorMessage('auth/network-request-failed')
    }
    if (error.message.includes('password')) {
      return getFirebaseErrorMessage('auth/weak-password')
    }
    if (error.message.includes('email')) {
      return getFirebaseErrorMessage('auth/invalid-email')
    }
  }
  
  return getFirebaseErrorMessage('unknown')
}

// Error logging utility
export const logAuthError = (error: any, context: string) => {
  console.error(`Auth Error (${context}):`, {
    code: error?.code || 'unknown',
    message: error?.message || 'No message',
    stack: error?.stack || 'No stack trace',
    timestamp: new Date().toISOString()
  })
}

// User-friendly error categories
export const getErrorCategory = (errorCode: string): 'warning' | 'error' | 'info' => {
  const warningCodes = [
    'auth/too-many-requests',
    'auth/requires-recent-login',
    'auth/unverified-email',
    'profile/incomplete'
  ]
  
  const infoCodes = [
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request'
  ]
  
  if (warningCodes.includes(errorCode)) return 'warning'
  if (infoCodes.includes(errorCode)) return 'info'
  return 'error'
}

// Suggested actions for different error types
export const getErrorAction = (errorCode: string): string | null => {
  const actions: Record<string, string> = {
    'auth/user-not-found': 'Create a new account',
    'auth/email-already-in-use': 'Sign in instead',
    'auth/weak-password': 'Use a stronger password',
    'auth/too-many-requests': 'Wait a few minutes',
    'auth/network-request-failed': 'Check your connection',
    'auth/unverified-email': 'Verify your email',
    'profile/incomplete': 'Complete your profile',
    'application/insufficient-profile': 'Update your rental profile'
  }
  
  return actions[errorCode] || null
}