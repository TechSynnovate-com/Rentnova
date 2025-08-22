'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Shield, Palette, Globe, Database, Smartphone, Mail, Key, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const [generalSettings, setGeneralSettings] = useState({
    darkMode: false,
    language: 'English',
    timezone: 'WAT (West Africa Time)',
    autoSave: true
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    propertyAlerts: true,
    messageNotifications: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showContactInfo: false,
    dataSharing: false,
    analyticsTracking: true
  })

  const handleGeneralChange = (key: string, value: boolean | string) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
    toast.success('Settings updated')
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
    toast.success('Notification preferences updated')
  }

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    toast.success('Privacy settings updated')
  }

  const settingsCategories = [
    { name: 'General', icon: Settings, color: 'bg-blue-500', description: 'Basic app preferences' },
    { name: 'Notifications', icon: Bell, color: 'bg-green-500', description: 'Alert preferences' },
    { name: 'Privacy', icon: Shield, color: 'bg-purple-500', description: 'Data & visibility' },
    { name: 'Security', icon: Key, color: 'bg-red-500', description: 'Account protection' }
  ]

  const getDashboardPath = () => {
    if (user?.role === 'landlord') return '/dashboard/landlord'
    if (user?.role === 'tenant') return '/dashboard/tenant'
    return '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link href={getDashboardPath()}>
              <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-6 rounded-full">
                <Settings className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Settings
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-6">
              Customize your RentNova experience and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Settings Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {settingsCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Settings className="mr-3 h-6 w-6" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Use dark theme for better visibility</p>
                </div>
                <Switch
                  checked={generalSettings.darkMode}
                  onCheckedChange={(checked) => handleGeneralChange('darkMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Auto Save</h4>
                  <p className="text-sm text-gray-600">Automatically save your work</p>
                </div>
                <Switch
                  checked={generalSettings.autoSave}
                  onCheckedChange={(checked) => handleGeneralChange('autoSave', checked)}
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Language</h4>
                  <Badge className="bg-blue-100 text-blue-800">{generalSettings.language}</Badge>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Timezone</h4>
                  <Badge className="bg-green-100 text-green-800">{generalSettings.timezone}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Bell className="mr-3 h-6 w-6" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Browser notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Text message alerts</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Property Alerts</h4>
                  <p className="text-sm text-gray-600">New property notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.propertyAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('propertyAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Message Notifications</h4>
                  <p className="text-sm text-gray-600">Chat and message alerts</p>
                </div>
                <Switch
                  checked={notificationSettings.messageNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('messageNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Shield className="mr-3 h-6 w-6" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Show Contact Info</h4>
                  <p className="text-sm text-gray-600">Display contact details publicly</p>
                </div>
                <Switch
                  checked={privacySettings.showContactInfo}
                  onCheckedChange={(checked) => handlePrivacyChange('showContactInfo', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Data Sharing</h4>
                  <p className="text-sm text-gray-600">Share data with partners</p>
                </div>
                <Switch
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900">Analytics Tracking</h4>
                  <p className="text-sm text-gray-600">Help improve our service</p>
                </div>
                <Switch
                  checked={privacySettings.analyticsTracking}
                  onCheckedChange={(checked) => handlePrivacyChange('analyticsTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <Key className="mr-3 h-6 w-6" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Smartphone className="mr-2 h-4 w-4" />
                Two-Factor Authentication
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Update Email Address
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Download My Data
              </Button>

              <Button className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Settings */}
        <Card className="mt-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white p-6">
            <CardTitle className="text-2xl flex items-center">
              <Globe className="mr-3 h-6 w-6" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-16 flex-col">
                <Database className="h-6 w-6 mb-2" />
                <span>Backup Data</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col border-orange-200 text-orange-600 hover:bg-orange-50">
                <Globe className="h-6 w-6 mb-2" />
                <span>Export Settings</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col border-purple-200 text-purple-600 hover:bg-purple-50">
                <Settings className="h-6 w-6 mb-2" />
                <span>Reset to Default</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}