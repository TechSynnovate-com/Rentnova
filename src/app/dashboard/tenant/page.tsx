'use client'

import { useAuth } from '@/contexts/auth-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useOnboarding } from '@/hooks/use-onboarding'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, FileText, MessageSquare, Settings, Bell, Heart, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import OnboardingTutorial from '@/components/onboarding/onboarding-tutorial'

export default function TenantDashboard() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const { 
    isOnboardingOpen, 
    startOnboarding, 
    completeOnboarding, 
    closeOnboarding,
    hasCompletedOnboarding 
  } = useOnboarding()

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Simple Page Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.displayName}</h1>
                <p className="text-gray-600 mt-1">Manage your rental applications and find your perfect home</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={startOnboarding}
                className="text-lavender-600 border-lavender-200 hover:bg-lavender-50"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Take Tour
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/properties" data-tour="browse-properties">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-lavender-600" />
                    <CardTitle className="text-lg">Browse Properties</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Find your perfect rental home</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/tenant/favorites" data-tour="favorites">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-lavender-600" />
                    <CardTitle className="text-lg">My Favorites</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {favorites.length} saved properties
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/tenant/applications" data-tour="applications">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-lavender-600" />
                    <CardTitle className="text-lg">My Applications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Track your rental applications</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/tenant/messages" data-tour="messages">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-lavender-600" />
                    <CardTitle className="text-lg">Messages</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Chat with landlords</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card data-tour="profile-status">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-lavender-600">Complete</div>
                <p className="text-xs text-gray-600">Your rental profile is ready</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Active Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2</div>
                <p className="text-xs text-gray-600">Properties you've applied to</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Resident Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-gray-600">Your tenant services portal</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on RentNova</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-lavender-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application submitted</p>
                    <p className="text-xs text-gray-600">Google Building 43 - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Property saved to favorites</p>
                    <p className="text-xs text-gray-600">Modern apartment in downtown - 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile completed</p>
                    <p className="text-xs text-gray-600">Rental profile verification - 2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Profile</CardTitle>
                <CardDescription>Manage your rental application profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Complete</span>
                    <span className="text-sm text-green-600 font-medium">✓ Yes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documents Uploaded</span>
                    <span className="text-sm text-green-600 font-medium">✓ Complete</span>
                  </div>
                  <Link href="/dashboard/tenant/rental-profile">
                    <Button className="w-full" variant="outline">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card data-tour="quick-search">
              <CardHeader>
                <CardTitle>Property Search</CardTitle>
                <CardDescription>Find your next rental home</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Browse through our collection of verified rental properties.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/properties">
                      <Button className="w-full" size="sm">
                        Browse All
                      </Button>
                    </Link>
                    <Link href="/properties?featured=true">
                      <Button className="w-full" size="sm" variant="outline">
                        Featured
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Onboarding Tutorial */}
      <OnboardingTutorial 
        isOpen={isOnboardingOpen}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
      />
    </div>
  )
}