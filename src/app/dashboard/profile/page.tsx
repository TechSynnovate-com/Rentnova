'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, Camera, Shield, CheckCircle, Building, DollarSign, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'react-hot-toast'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    businessName: '',
    profileImage: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: ''
    },
    contactInfo: {
      address: '',
      email: user?.email || '',
      phone: ''
    },
    settings: {
      notifications: true,
      maintenanceNotifications: false,
      autoApproveApplications: false
    },
    verified: false,
    totalProperties: 0,
    activeRentals: 0,
    monthlyRevenue: 0
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        return
      }
      
      try {
        // Try landlords collection first
        const landlordRef = doc(db, 'landlords', user.uid)
        const landlordSnap = await getDoc(landlordRef)
        
        if (landlordSnap.exists()) {
          const data = landlordSnap.data()
          setProfileData(prev => ({
            ...prev,
            displayName: user.displayName || '',
            email: user.email || '',
            businessName: data.businessName || '',
            profileImage: data.profileImage || '',
            bankDetails: {
              accountName: data.bankDetails?.accountName || '',
              accountNumber: data.bankDetails?.accountNumber || '',
              bankName: data.bankDetails?.bankName || '',
              routingNumber: data.bankDetails?.routingNumber || ''
            },
            contactInfo: {
              address: data.contactInfo?.address || '',
              email: data.contactInfo?.email || user.email || '',
              phone: data.contactInfo?.phone || ''
            },
            settings: {
              notifications: data.settings?.notifications ?? true,
              maintenanceNotifications: data.settings?.maintenanceNotifications ?? false,
              autoApproveApplications: data.settings?.autoApproveApplications ?? false
            },
            verified: data.verified || false,
            totalProperties: data.totalProperties || 0,
            activeRentals: data.activeRentals || 0,
            monthlyRevenue: data.monthlyRevenue || 0
          }))
        } else {
          // Try users collection as fallback
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            const data = userSnap.data()
            setProfileData(prev => ({
              ...prev,
              displayName: user.displayName || '',
              email: user.email || '',
              contactInfo: {
                ...prev.contactInfo,
                email: user.email || '',
                phone: data.phone || '',
                address: data.address || ''
              },
              verified: data.verified || false
            }))
          } else {
            // Set default profile data if no document exists
            setProfileData(prev => ({
              ...prev,
              displayName: user.displayName || '',
              contactInfo: {
                ...prev.contactInfo,
                email: user.email || ''
              }
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    if (user?.uid) {
      fetchProfile()
    }
  }, [user?.uid])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    if (!user?.uid) return
    
    try {
      setLoading(true)
      
      // Try to update landlords collection first
      const landlordRef = doc(db, 'landlords', user.uid)
      const landlordSnap = await getDoc(landlordRef)
      
      if (landlordSnap.exists()) {
        await updateDoc(landlordRef, {
          businessName: profileData.businessName,
          contactInfo: profileData.contactInfo,
          bankDetails: profileData.bankDetails,
          settings: profileData.settings,
          updatedAt: new Date()
        })
      } else {
        // Update users collection as fallback
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          phone: profileData.phone,
          address: profileData.address,
          updatedAt: new Date()
        })
      }
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const profileStats = [
    { 
      label: 'Total Properties', 
      value: profileData.totalProperties.toString(), 
      color: 'bg-blue-100 text-blue-800',
      icon: Building
    },
    { 
      label: 'Active Rentals', 
      value: profileData.activeRentals.toString(), 
      color: 'bg-green-100 text-green-800',
      icon: User
    },
    { 
      label: 'Monthly Revenue', 
      value: `₦${profileData.monthlyRevenue.toLocaleString()}`, 
      color: 'bg-purple-100 text-purple-800',
      icon: DollarSign
    },
    { 
      label: 'Verification', 
      value: profileData.verified ? 'Verified' : 'Pending', 
      color: profileData.verified ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800',
      icon: Shield
    }
  ]

  // Show loading if still fetching data or if user auth is not ready
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {profileData.profileImage ? (
                  <img 
                    src={profileData.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="bg-white/20 p-6 rounded-full">
                    <User className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {profileData.businessName || profileData.displayName || 'Your Profile'}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6">
              Manage your personal information and account settings
            </p>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-indigo-600 hover:bg-blue-50"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Profile Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {profileStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
                  <Badge className={`${stat.color} text-sm px-3 py-1`}>
                    {stat.value}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <User className="mr-3 h-6 w-6" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    disabled={true}
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.contactInfo.email}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.contactInfo.phone}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="+234 123 456 7890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Business Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={profileData.contactInfo.address}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                  placeholder="Your business address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Banking & Settings */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <CardTitle className="text-2xl flex items-center">
                <DollarSign className="mr-3 h-6 w-6" />
                Banking & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">
                    Account Name
                  </Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={profileData.bankDetails.accountName}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountName: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={profileData.bankDetails.bankName}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Your bank name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={profileData.bankDetails.accountNumber}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Your account number"
                  />
                </div>
                <div>
                  <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-700">
                    Routing Number
                  </Label>
                  <Input
                    id="routingNumber"
                    name="routingNumber"
                    value={profileData.bankDetails.routingNumber}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, routingNumber: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Bank routing number"
                  />
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-900">Account Status</h4>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-lg ${profileData.verified ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div className="flex items-center space-x-3">
                      <Shield className={`h-5 w-5 ${profileData.verified ? 'text-green-600' : 'text-yellow-600'}`} />
                      <span className="text-sm font-medium text-gray-700">Account Verification</span>
                    </div>
                    <Badge className={profileData.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {profileData.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Notifications</span>
                    </div>
                    <Badge className={profileData.settings.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {profileData.settings.notifications ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>

              {isEditing && (
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="mt-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6">
            <CardTitle className="text-2xl">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Change Email
              </Button>
              <Button variant="outline" className="justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="justify-start text-red-600 border-red-200 hover:bg-red-50">
                <User className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}