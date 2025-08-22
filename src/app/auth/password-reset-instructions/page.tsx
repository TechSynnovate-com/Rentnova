'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'

export default function PasswordResetInstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Setup</h1>
          <p className="text-gray-600">Currently using demo Firebase configuration</p>
        </div>

        <div className="space-y-6">
          {/* Current Status */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-900">Demo Mode Active</CardTitle>
              </div>
              <CardDescription className="text-yellow-800">
                Password reset emails require real Firebase configuration. Currently using demo settings.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Enable Password Reset Emails</CardTitle>
              <CardDescription>
                Follow these steps to set up email authentication in your Firebase project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Configure Firebase Environment</h3>
                  <p className="text-gray-600 mb-3">
                    Add your real Firebase credentials to the environment variables in <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <div>NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</div>
                    <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</div>
                    <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</div>
                    <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com</div>
                    <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</div>
                    <div>NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id</div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enable Email/Password Authentication</h3>
                  <p className="text-gray-600 mb-3">
                    In Firebase Console:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Go to Authentication → Sign-in method</li>
                    <li>Enable "Email/Password" provider</li>
                    <li>Save the changes</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Configure Authorized Domains</h3>
                  <p className="text-gray-600 mb-3">
                    Add your domains to the authorized domains list:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Development: <code className="bg-gray-100 px-2 py-1 rounded">localhost</code></li>
                    <li>Replit: <code className="bg-gray-100 px-2 py-1 rounded">*.replit.dev</code></li>
                    <li>Production: Your custom domain</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customize Email Templates (Optional)</h3>
                  <p className="text-gray-600 mb-3">
                    In Firebase Console → Authentication → Templates:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Customize password reset email template</li>
                    <li>Add your app name and branding</li>
                    <li>Set the action URL to your login page</li>
                  </ul>
                </div>
              </div>

              {/* Test Instructions */}
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Test Your Setup</h3>
                </div>
                <p className="text-green-800 text-sm">
                  After configuring Firebase, restart your application and try the password reset feature. 
                  You should receive emails in your inbox (check spam folder too).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button asChild>
                  <Link href="/auth/forgot-password">
                    Try Password Reset
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">
                    Back to Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Solution */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Alternative: Create New Account</CardTitle>
              <CardDescription className="text-blue-800">
                If you can't access your current account, you can create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">
                  Create New Account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}