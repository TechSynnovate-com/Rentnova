'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useRentalProfile } from '@/hooks/use-rental-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { 
  User, 
  Briefcase, 
  Home, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Edit,
  Save,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Building,
  Users,
  Shield,
  Clock,
  Star,
  Upload,
  Eye,
  Download,
  Trash2,
  Plus,
  Camera,
  Heart,
  Settings,
  Award,
  Target,
  TrendingUp
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function RentalProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { 
    profile, 
    loading, 
    isProfileComplete, 
    getProfileStatus, 
    getMissingFields,
    updateProfile,
    getCompletionPercentage 
  } = useRentalProfile()
  
  const [editing, setEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [localProfile, setLocalProfile] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    currentAddress: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    },
    employmentStatus: 'employed' as const,
    employer: '',
    jobTitle: '',
    monthlyIncome: 0,
    preferences: {
      preferredLocation: [] as string[],
      maxBudget: 0,
      minBedrooms: 1,
      maxBedrooms: 3,
      preferredPropertyType: [] as string[],
      moveInDate: '',
      leaseDuration: '12 months',
      petOwner: false,
      smokingPreference: 'non-smoker' as const
    },
    documents: {
      proofOfEmployment: null as string | null,
      proofOfIncome: null as string | null,
      guarantorLetter: null as string | null,
      governmentId: null as string | null
    }
  })

  // Sync Firebase profile data to local state
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        fullName: profile.fullName || '',
        dateOfBirth: profile.dateOfBirth || '',
        phoneNumber: profile.phoneNumber || '',
        currentAddress: profile.currentAddress || '',
        emergencyContact: {
          name: profile.emergencyContact?.name || '',
          relationship: profile.emergencyContact?.relationship || '',
          phoneNumber: profile.emergencyContact?.phoneNumber || ''
        },
        employmentStatus: (profile.employmentStatus || 'employed') as 'employed' | 'self-employed' | 'student' | 'unemployed' | 'retired',
        employer: profile.employer || '',
        jobTitle: profile.jobTitle || '',
        monthlyIncome: profile.monthlyIncome || 0,
        preferences: {
          preferredLocation: profile.preferences?.preferredLocation || [],
          maxBudget: profile.preferences?.maxBudget || 0,
          minBedrooms: profile.preferences?.minBedrooms || 1,
          maxBedrooms: profile.preferences?.maxBedrooms || 3,
          preferredPropertyType: profile.preferences?.preferredPropertyType || [],
          moveInDate: profile.preferences?.moveInDate || '',
          leaseDuration: profile.preferences?.leaseDuration || '12 months',
          petOwner: profile.preferences?.petOwner || false,
          smokingPreference: (profile.preferences?.smokingPreference || 'non-smoker') as 'non-smoker' | 'smoker' | 'occasional'
        },
        documents: {
          proofOfEmployment: profile.documents?.proofOfEmployment || null,
          proofOfIncome: profile.documents?.proofOfIncome || null,
          guarantorLetter: profile.documents?.guarantorLetter || null,
          governmentId: profile.documents?.governmentId || null
        }
      })
    }
  }, [profile])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await updateProfile(localProfile)
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof typeof localProfile, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (section: keyof typeof localProfile, field: string, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      [section]: {
        ...((prev[section] as any) || {}),
        [field]: value
      }
    }))
  }

  const updatePreferences = (field: string, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const updateDocuments = (field: string, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: value
      }
    }))
  }

  const handleFileUpload = async (file: File, documentType: string) => {
    // Mock file upload - in real app, this would upload to Firebase Storage
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://storage.firebase.com/documents/${user?.uid}/${documentType}_${Date.now()}.pdf`
        resolve(mockUrl)
      }, 1000)
    })
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'bg-blue-500' },
    { id: 'employment', label: 'Employment', icon: Briefcase, color: 'bg-green-500' },
    { id: 'preferences', label: 'Preferences', icon: Home, color: 'bg-purple-500' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'bg-orange-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p className="text-gray-600">Loading rental profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tenant" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold mb-2">Rental Profile</h1>
                <p className="text-indigo-200">Complete your profile to apply for properties faster</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{getCompletionPercentage()}%</div>
              <div className="text-indigo-200 text-sm">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="bg-white/20 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-indigo-600" />
                  Profile Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                        activeSection === section.id 
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${section.color} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{section.label}</span>
                      {activeSection === section.id && (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'personal' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-6 w-6 mr-2 text-blue-600" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your basic personal details for property applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={localProfile.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          placeholder="your@email.com"
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={localProfile.phoneNumber}
                          onChange={(e) => updateField('phoneNumber', e.target.value)}
                          placeholder="+234 xxx xxx xxxx"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={localProfile.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="currentAddress">Current Address</Label>
                        <Textarea
                          id="currentAddress"
                          value={localProfile.currentAddress}
                          onChange={(e) => updateField('currentAddress', e.target.value)}
                          placeholder="Enter your current residential address"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-600" />
                          Emergency Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyName">Name</Label>
                            <Input
                              id="emergencyName"
                              value={localProfile.emergencyContact.name}
                              onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                              placeholder="Emergency contact name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyRelationship">Relationship</Label>
                            <Input
                              id="emergencyRelationship"
                              value={localProfile.emergencyContact.relationship}
                              onChange={(e) => updateNestedField('emergencyContact', 'relationship', e.target.value)}
                              placeholder="e.g., Mother, Brother"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Phone Number</Label>
                            <Input
                              id="emergencyPhone"
                              value={localProfile.emergencyContact.phoneNumber}
                              onChange={(e) => updateNestedField('emergencyContact', 'phoneNumber', e.target.value)}
                              placeholder="+234 xxx xxx xxxx"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'employment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-6 w-6 mr-2 text-green-600" />
                      Employment Information
                    </CardTitle>
                    <CardDescription>
                      Provide employment details to strengthen your rental application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="employmentStatus">Employment Status</Label>
                        <Select
                          value={localProfile.employmentStatus}
                          onValueChange={(value) => updateField('employmentStatus', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self-employed">Self-Employed</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Monthly Income (NGN)</Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={localProfile.monthlyIncome}
                          onChange={(e) => updateField('monthlyIncome', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employer">Employer/Company</Label>
                        <Input
                          id="employer"
                          value={localProfile.employer}
                          onChange={(e) => updateField('employer', e.target.value)}
                          placeholder="Company name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={localProfile.jobTitle}
                          onChange={(e) => updateField('jobTitle', e.target.value)}
                          placeholder="Your job title"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'preferences' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Home className="h-6 w-6 mr-2 text-purple-600" />
                      Rental Preferences
                    </CardTitle>
                    <CardDescription>
                      Tell us what you're looking for in your ideal rental property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="maxBudget">Maximum Budget (NGN/month)</Label>
                        <Input
                          id="maxBudget"
                          type="number"
                          value={localProfile.preferences.maxBudget}
                          onChange={(e) => updatePreferences('maxBudget', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={localProfile.preferences.moveInDate}
                          onChange={(e) => updatePreferences('moveInDate', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minBedrooms">Minimum Bedrooms</Label>
                        <Select
                          value={localProfile.preferences.minBedrooms.toString()}
                          onValueChange={(value) => updatePreferences('minBedrooms', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Bedroom</SelectItem>
                            <SelectItem value="2">2 Bedrooms</SelectItem>
                            <SelectItem value="3">3 Bedrooms</SelectItem>
                            <SelectItem value="4">4+ Bedrooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leaseDuration">Lease Duration</Label>
                        <Select
                          value={localProfile.preferences.leaseDuration}
                          onValueChange={(value) => updatePreferences('leaseDuration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6 months">6 Months</SelectItem>
                            <SelectItem value="12 months">12 Months</SelectItem>
                            <SelectItem value="24 months">24 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="petOwner" className="flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-pink-500" />
                            Pet Owner
                          </Label>
                          <Switch
                            id="petOwner"
                            checked={localProfile.preferences.petOwner}
                            onCheckedChange={(checked) => updatePreferences('petOwner', checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smokingPreference">Smoking Preference</Label>
                          <Select
                            value={localProfile.preferences.smokingPreference}
                            onValueChange={(value) => updatePreferences('smokingPreference', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="non-smoker">Non-Smoker</SelectItem>
                              <SelectItem value="smoker">Smoker</SelectItem>
                              <SelectItem value="occasional">Occasional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'documents' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-6 w-6 mr-2 text-orange-600" />
                      Document Management
                    </CardTitle>
                    <CardDescription>
                      Upload your documents for rental applications. These will be shared with landlords upon request.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Proof of Employment */}
                      <div className="space-y-3">
                        <Label className="flex items-center text-base font-semibold">
                          <Briefcase className="h-4 w-4 mr-2 text-green-600" />
                          Proof of Employment *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          {localProfile.documents.proofOfEmployment ? (
                            <div className="space-y-3">
                              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                              <p className="text-sm text-green-700 font-medium">Document uploaded</p>
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => updateDocuments('proofOfEmployment', null)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Upload employment letter or contract</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = '.pdf,.doc,.docx,.jpg,.png'
                                  input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                      const url = await handleFileUpload(file, 'proof_employment')
                                      updateDocuments('proofOfEmployment', url)
                                      toast.success('Employment document uploaded successfully!')
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Upload File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Proof of Income */}
                      <div className="space-y-3">
                        <Label className="flex items-center text-base font-semibold">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          Proof of Income *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          {localProfile.documents.proofOfIncome ? (
                            <div className="space-y-3">
                              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                              <p className="text-sm text-green-700 font-medium">Document uploaded</p>
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => updateDocuments('proofOfIncome', null)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Upload pay slips or bank statements</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = '.pdf,.doc,.docx,.jpg,.png'
                                  input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                      const url = await handleFileUpload(file, 'proof_income')
                                      updateDocuments('proofOfIncome', url)
                                      toast.success('Income document uploaded successfully!')
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Upload File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Government ID */}
                      <div className="space-y-3">
                        <Label className="flex items-center text-base font-semibold">
                          <Shield className="h-4 w-4 mr-2 text-blue-600" />
                          Government ID/Driver's License *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          {localProfile.documents.governmentId ? (
                            <div className="space-y-3">
                              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                              <p className="text-sm text-green-700 font-medium">Document uploaded</p>
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => updateDocuments('governmentId', null)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Upload NIN, driver's license, or passport</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = '.pdf,.jpg,.png'
                                  input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                      const url = await handleFileUpload(file, 'government_id')
                                      updateDocuments('governmentId', url)
                                      toast.success('ID document uploaded successfully!')
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Upload File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Guarantor Letter (Optional) */}
                      <div className="space-y-3">
                        <Label className="flex items-center text-base font-semibold">
                          <Users className="h-4 w-4 mr-2 text-purple-600" />
                          Guarantor Letter
                          <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          {localProfile.documents.guarantorLetter ? (
                            <div className="space-y-3">
                              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                              <p className="text-sm text-green-700 font-medium">Document uploaded</p>
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => updateDocuments('guarantorLetter', null)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Upload guarantor support letter</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = '.pdf,.doc,.docx,.jpg,.png'
                                  input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                      const url = await handleFileUpload(file, 'guarantor_letter')
                                      updateDocuments('guarantorLetter', url)
                                      toast.success('Guarantor letter uploaded successfully!')
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Upload File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Document Status Summary */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Document Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${localProfile.documents.proofOfEmployment ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Proof of Employment</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${localProfile.documents.proofOfIncome ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Proof of Income</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${localProfile.documents.governmentId ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Government ID</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${localProfile.documents.guarantorLetter ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Guarantor Letter</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add save button */}
              <div className="flex justify-end mt-8">
                <Button
                  onClick={saveProfile}
                  disabled={saving || loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}