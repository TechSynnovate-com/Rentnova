'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, Shield, CreditCard, Bell, Eye, Lock, Smartphone, Mail, Globe, Calendar, User, Building } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'react-hot-toast'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AccountPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    businessName: '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    verified: false,
    totalProperties: 0,
    activeRentals: 0,
    monthlyRevenue: 0,
    joinedAt: null
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  })
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }
      
      try {
        console.log('Fetching user data for:', user.uid)
        // Try landlords collection first
        const landlordRef = doc(db, 'landlords', user.uid)
        const landlordSnap = await getDoc(landlordRef)
        
        if (landlordSnap.exists()) {
          const data = landlordSnap.data()
          console.log('Landlord data found:', data)
          setUserData(prev => ({
            ...prev,
            businessName: data.businessName || '',
            verified: data.verified || false,
            totalProperties: data.totalProperties || 0,
            activeRentals: data.activeRentals || 0,
            monthlyRevenue: data.monthlyRevenue || 0,
            joinedAt: data.joinedAt
          }))
          
          // Load settings if available
          if (data.settings) {
            setNotifications(prev => ({
              ...prev,
              email: data.settings.notifications ?? true,
              push: data.settings.maintenanceNotifications ?? false
            }))
          }
        } else {
          console.log('No landlord data found, trying users collection')
          // Try users collection as fallback
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            const data = userSnap.data()
            console.log('User data found:', data)
            setUserData(prev => ({
              ...prev,
              verified: data.verified || false,
              joinedAt: data.createdAt
            }))
          } else {
            console.log('No user data found in either collection')
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load account data')
      } finally {
        setLoading(false)
      }
    }

    // Always set loading to false after a timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    if (user?.uid) {
      fetchUserData()
    } else if (user === null) {
      // User is not authenticated
      setLoading(false)
    }

    return () => clearTimeout(timeout)
  }, [user?.uid])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const accountInfo = [
    { label: 'Account ID', value: user?.uid?.slice(0, 8) + '...', icon: Settings },
    { label: 'Business Name', value: userData.businessName || 'Individual', icon: Building },
    { label: 'Member Since', value: formatDate(userData.joinedAt), icon: Calendar },
    { label: 'Verification Status', value: userData.verified ? 'Verified' : 'Pending', icon: userData.verified ? Shield : Eye }
  ]

  const securityFeatures = [
    { title: 'Two-Factor Authentication', description: 'Add an extra layer of security', enabled: false, icon: Smartphone },
    { title: 'Login Alerts', description: 'Get notified of suspicious login attempts', enabled: true, icon: Bell },
    { title: 'Session Management', description: 'Manage active sessions and devices', enabled: true, icon: Globe },
    { title: 'Password Protection', description: 'Strong password requirements', enabled: true, icon: Lock }
  ]

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    
    // Save to Firebase
    try {
      if (user?.uid) {
        const landlordRef = doc(db, 'landlords', user.uid)
        const landlordSnap = await getDoc(landlordRef)
        
        if (landlordSnap.exists()) {
          await updateDoc(landlordRef, {
            [`settings.notifications`]: key === 'email' ? value : notifications.email,
            [`settings.maintenanceNotifications`]: key === 'push' ? value : notifications.push,
            updatedAt: new Date()
          })
        }
      }
      toast.success('Notification settings updated')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
    toast.success('Privacy settings updated')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view account settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-6 rounded-full">
                <Settings className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Account Settings
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-6">
              Manage your account preferences, security, and privacy settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Account Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {accountInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{info.label}</h3>
                  <p className="text-lg font-semibold text-gray-900">{info.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Settings */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Shield className="mr-3 h-6 w-6" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Badge className={feature.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {feature.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                )
              })}

              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Advanced Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Bell className="mr-3 h-6 w-6" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Get text message alerts</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Browser and app notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Marketing Updates</h4>
                    <p className="text-sm text-gray-600">Promotional content and offers</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Settings */}
        <Card className="mt-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6">
            <CardTitle className="text-2xl flex items-center">
              <Eye className="mr-3 h-6 w-6" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Profile Visibility</h4>
                    <p className="text-sm text-gray-600">Make your profile visible to others</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Show Email</h4>
                    <p className="text-sm text-gray-600">Display email on public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Show Phone</h4>
                    <p className="text-sm text-gray-600">Display phone number publicly</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Allow Messages</h4>
                    <p className="text-sm text-gray-600">Let others send you messages</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="mt-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
            <CardTitle className="text-2xl">Account Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Lock className="mr-2 h-4 w-4" />
                Account Backup
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Settings className="mr-2 h-4 w-4" />
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}