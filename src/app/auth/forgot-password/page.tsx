'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Building, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getAuthErrorMessage, logAuthError } from '@/utils/firebase-errors'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send password reset email without custom action code settings
      // Firebase will use default template and redirect to Firebase's hosted UI
      await sendPasswordResetEmail(auth, email)
      setEmailSent(true)
      toast.success('Password reset email sent! Check your inbox and spam folder.')
    } catch (error: any) {
      logAuthError(error, 'forgot_password')
      
      // More specific error handling for password reset
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email address. Please check your email or create a new account.')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many password reset attempts. Please wait before trying again.')
      } else {
        toast.error(getAuthErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-lavender-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">RentNova</span>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Didn't receive the email? Check your spam folder or</p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-lavender-600 hover:text-lavender-700 font-medium block mx-auto"
                >
                  try a different email address
                </button>
                <p className="pt-2">
                  <Link 
                    href="/auth/password-reset-instructions" 
                    className="text-lavender-600 hover:text-lavender-700 font-medium"
                  >
                    Need help with email setup?
                  </Link>
                </p>
              </div>
              
              <Button 
                onClick={() => router.push('/auth/login')} 
                variant="outline" 
                className="w-full"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center text-lavender-600 hover:text-lavender-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-lavender-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">RentNova</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Your Password?</CardTitle>
            <CardDescription>
              No worries! Enter your email and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-lavender-600 hover:text-lavender-700 font-medium">
                  Sign in
                </Link>
              </p>
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs text-gray-500 mb-2">Having trouble with email delivery?</p>
                <div className="flex flex-col space-y-1">
                  <Link 
                    href="/auth/password-reset-instructions" 
                    className="text-xs text-lavender-600 hover:text-lavender-700 font-medium"
                  >
                    Firebase setup instructions →
                  </Link>
                  <Link 
                    href="/auth/domain-setup" 
                    className="text-xs text-lavender-600 hover:text-lavender-700 font-medium"
                  >
                    Fix domain authorization →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}