'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Building, FileText, Upload, Phone, Mail, MapPin, Briefcase, Shield, Heart, Plus, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function TenantRentalProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    nin: '',
    bvn: '',
    maritalStatus: '',
    
    // Current Address
    currentAddress: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: ''
    },
    
    // Employment Information
    employment: {
      status: '', // employed, self-employed, student, unemployed
      employer: '',
      position: '',
      workAddress: '',
      monthlyIncome: '',
      employmentStartDate: '',
      workEmail: '',
      workPhone: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      relationship: user?.emergencyContact?.relationship || '',
      phone: user?.emergencyContact?.phone || '',
      email: '',
      address: ''
    },
    
    // Guarantor Information
    guarantor: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      occupation: '',
      employer: '',
      monthlyIncome: '',
      nin: ''
    },
    
    // Next of Kin
    nextOfKin: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    },
    
    // Bank Information
    bankInfo: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      bvn: ''
    },
    
    // Rental Preferences
    preferences: {
      propertyTypes: [],
      maxRent: '',
      preferredLocations: [],
      moveInDate: '',
      leaseDuration: '',
      hasPets: false,
      petDetails: '',
      smokingAllowed: false,
      additionalRequirements: ''
    },
    
    // Previous Rental History
    rentalHistory: [
      {
        address: '',
        landlordName: '',
        landlordPhone: '',
        monthlyRent: '',
        moveInDate: '',
        moveOutDate: '',
        reasonForLeaving: ''
      }
    ],
    
    // References
    references: [
      {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        occupation: '',
        yearsKnown: ''
      }
    ]
  })

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === 'root') {
      setProfileData(prev => ({ ...prev, [field]: value }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }))
    }
  }

  const addRentalHistory = () => {
    setProfileData(prev => ({
      ...prev,
      rentalHistory: [...prev.rentalHistory, {
        address: '',
        landlordName: '',
        landlordPhone: '',
        monthlyRent: '',
        moveInDate: '',
        moveOutDate: '',
        reasonForLeaving: ''
      }]
    }))
  }

  const addReference = () => {
    setProfileData(prev => ({
      ...prev,
      references: [...prev.references, {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        occupation: '',
        yearsKnown: ''
      }]
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Here you would save to Firebase
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      toast.success('Rental profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const getProfileCompleteness = () => {
    const requiredFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phoneNumber,
      profileData.nin,
      profileData.employment.status,
      profileData.employment.monthlyIncome,
      profileData.emergencyContact.name,
      profileData.guarantor.name,
      profileData.nextOfKin.name,
      profileData.bankInfo.accountNumber
    ]
    const completedFields = requiredFields.filter(field => field && field.trim() !== '').length
    return Math.round((completedFields / requiredFields.length) * 100)
  }

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Rental Profile</h1>
              <p className="text-gray-600">Build your comprehensive rental application profile</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {getProfileCompleteness()}% Complete
              </Badge>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal details for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('root', 'firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('root', 'lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange('root', 'phoneNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="nin">National ID Number (NIN) *</Label>
                  <Input
                    id="nin"
                    value={profileData.nin}
                    onChange={(e) => handleInputChange('root', 'nin', e.target.value)}
                    disabled={!isEditing}
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                  <Input
                    id="bvn"
                    value={profileData.bvn}
                    onChange={(e) => handleInputChange('root', 'bvn', e.target.value)}
                    disabled={!isEditing}
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('root', 'dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profileData.maritalStatus}
                    onChange={(e) => handleInputChange('root', 'maritalStatus', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Current Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={profileData.currentAddress.street}
                    onChange={(e) => handleInputChange('currentAddress', 'street', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.currentAddress.city}
                    onChange={(e) => handleInputChange('currentAddress', 'city', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profileData.currentAddress.state}
                    onChange={(e) => handleInputChange('currentAddress', 'state', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={profileData.currentAddress.postalCode}
                    onChange={(e) => handleInputChange('currentAddress', 'postalCode', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employmentStatus">Employment Status *</Label>
                  <select
                    id="employmentStatus"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profileData.employment.status}
                    onChange={(e) => handleInputChange('employment', 'status', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="employer">Employer/Company</Label>
                  <Input
                    id="employer"
                    value={profileData.employment.employer}
                    onChange={(e) => handleInputChange('employment', 'employer', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Job Title/Position</Label>
                  <Input
                    id="position"
                    value={profileData.employment.position}
                    onChange={(e) => handleInputChange('employment', 'position', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (₦) *</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={profileData.employment.monthlyIncome}
                    onChange={(e) => handleInputChange('employment', 'monthlyIncome', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    value={profileData.employment.workEmail}
                    onChange={(e) => handleInputChange('employment', 'workEmail', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="workPhone">Work Phone</Label>
                  <Input
                    id="workPhone"
                    value={profileData.employment.workPhone}
                    onChange={(e) => handleInputChange('employment', 'workPhone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Full Name *</Label>
                  <Input
                    id="emergencyName"
                    value={profileData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={profileData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={profileData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guarantor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Guarantor Information
              </CardTitle>
              <CardDescription>
                A guarantor provides additional security for your rental application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="guarantorName">Full Name *</Label>
                  <Input
                    id="guarantorName"
                    value={profileData.guarantor.name}
                    onChange={(e) => handleInputChange('guarantor', 'name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorRelationship">Relationship</Label>
                  <Input
                    id="guarantorRelationship"
                    value={profileData.guarantor.relationship}
                    onChange={(e) => handleInputChange('guarantor', 'relationship', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorPhone">Phone Number</Label>
                  <Input
                    id="guarantorPhone"
                    value={profileData.guarantor.phone}
                    onChange={(e) => handleInputChange('guarantor', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorEmail">Email Address</Label>
                  <Input
                    id="guarantorEmail"
                    type="email"
                    value={profileData.guarantor.email}
                    onChange={(e) => handleInputChange('guarantor', 'email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorOccupation">Occupation</Label>
                  <Input
                    id="guarantorOccupation"
                    value={profileData.guarantor.occupation}
                    onChange={(e) => handleInputChange('guarantor', 'occupation', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorIncome">Monthly Income (₦)</Label>
                  <Input
                    id="guarantorIncome"
                    type="number"
                    value={profileData.guarantor.monthlyIncome}
                    onChange={(e) => handleInputChange('guarantor', 'monthlyIncome', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next of Kin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Next of Kin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nokName">Full Name *</Label>
                  <Input
                    id="nokName"
                    value={profileData.nextOfKin.name}
                    onChange={(e) => handleInputChange('nextOfKin', 'name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="nokRelationship">Relationship</Label>
                  <Input
                    id="nokRelationship"
                    value={profileData.nextOfKin.relationship}
                    onChange={(e) => handleInputChange('nextOfKin', 'relationship', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="nokPhone">Phone Number</Label>
                  <Input
                    id="nokPhone"
                    value={profileData.nextOfKin.phone}
                    onChange={(e) => handleInputChange('nextOfKin', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <select
                    id="bankName"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profileData.bankInfo.bankName}
                    onChange={(e) => handleInputChange('bankInfo', 'bankName', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select bank</option>
                    <option value="access">Access Bank</option>
                    <option value="gtbank">Guaranty Trust Bank</option>
                    <option value="firstbank">First Bank of Nigeria</option>
                    <option value="zenith">Zenith Bank</option>
                    <option value="uba">United Bank for Africa</option>
                    <option value="fcmb">First City Monument Bank</option>
                    <option value="union">Union Bank</option>
                    <option value="sterling">Sterling Bank</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={profileData.bankInfo.accountNumber}
                    onChange={(e) => handleInputChange('bankInfo', 'accountNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={profileData.bankInfo.accountName}
                    onChange={(e) => handleInputChange('bankInfo', 'accountName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Profile {getProfileCompleteness()}% complete
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button className="bg-lavender-600 hover:bg-lavender-700">
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}