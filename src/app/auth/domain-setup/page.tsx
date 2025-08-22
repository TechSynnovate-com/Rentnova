'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, ArrowLeft, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function DomainSetupPage() {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your-domain'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth/forgot-password" className="inline-flex items-center text-lavender-600 hover:text-lavender-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to password reset
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-lavender-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">RentNova</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firebase Domain Setup</h1>
          <p className="text-gray-600">Add authorized domains for password reset emails</p>
        </div>

        <div className="space-y-6">
          {/* Current Issue */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-900">Domain Authorization Required</CardTitle>
              </div>
              <CardDescription className="text-yellow-800">
                Your current domain <Badge variant="outline" className="ml-1">{currentDomain}</Badge> needs to be added to Firebase authorized domains.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Add Authorized Domains in Firebase Console</CardTitle>
              <CardDescription>
                Follow these steps to enable password reset emails for your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Open Firebase Console</h3>
                  <p className="text-gray-600 mb-3">
                    Go to your Firebase project console:
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://console.firebase.google.com/project/synnovateapp-97d1e/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Open Firebase Console <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Navigate to Authentication Settings</h3>
                  <p className="text-gray-600 mb-3">
                    In the Firebase Console:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Click on "Authentication" in the left sidebar</li>
                    <li>Go to the "Settings" tab</li>
                    <li>Scroll down to "Authorized domains"</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Add Your Domains</h3>
                  <p className="text-gray-600 mb-3">
                    Click "Add domain" and add these domains one by one:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">localhost</code>
                      <Badge variant="secondary">Development</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{currentDomain}</code>
                      <Badge variant="default">Current Domain</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">*.replit.dev</code>
                      <Badge variant="secondary">Replit</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">*.replit.app</code>
                      <Badge variant="secondary">Replit Deploy</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-lavender-600">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Save and Test</h3>
                  <p className="text-gray-600 mb-3">
                    After adding the domains:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Click "Save" in Firebase Console</li>
                    <li>Wait 1-2 minutes for changes to propagate</li>
                    <li>Return to password reset and try again</li>
                  </ul>
                </div>
              </div>

              {/* Success indicator */}
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">After Setup Complete</h3>
                </div>
                <p className="text-green-800 text-sm">
                  Password reset emails will work from any authorized domain. Users will receive email links 
                  that redirect to Firebase's hosted password reset page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button asChild>
                  <Link href="/auth/forgot-password">
                    Try Password Reset Again
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://console.firebase.google.com/project/synnovateapp-97d1e/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Firebase Console
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Fix Note */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Quick Alternative</CardTitle>
              <CardDescription className="text-blue-800">
                Password reset now works without custom domains using Firebase's default flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 text-sm mb-3">
                I've updated the password reset to use Firebase's default email template. This should work 
                immediately, but adding your domains will enable custom branding and better user experience.
              </p>
              <Button variant="outline" asChild>
                <Link href="/auth/forgot-password">
                  Test Password Reset Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}