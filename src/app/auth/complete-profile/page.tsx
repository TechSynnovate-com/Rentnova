'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Building, User, Phone, Calendar, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    dateOfBirth: '',
    nin: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // If profile is already complete, redirect to dashboard
    if (user.phoneNumber && user.dateOfBirth) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('emergencyContact.')) {
      const contactField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const validateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  const validateNIN = (nin: string) => {
    // Basic NIN validation - 11 digits
    return /^\d{11}$/.test(nin)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check user authentication first
      if (!user || !user.id) {
        toast.error('Please sign in to complete your profile')
        setIsLoading(false)
        return
      }

      // Validation
      if (!validateAge(formData.dateOfBirth)) {
        toast.error('You must be at least 18 years old')
        setIsLoading(false)
        return
      }

      if (!validateNIN(formData.nin)) {
        toast.error('Please enter a valid 11-digit NIN')
        setIsLoading(false)
        return
      }

      if (!formData.phoneNumber || !formData.emergencyContact.name) {
        toast.error('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      await updateUserProfile(formData)
      toast.success('Profile completed successfully!')
      
      // Redirect based on user role
      if (user?.role === 'landlord') {
        router.push('/dashboard/landlord')
      } else {
        router.push('/dashboard/tenant')
      }
    } catch (error: any) {
      console.error('Complete profile error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-lavender-600 border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-lavender-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">RentNova</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Help us verify your identity and set up your account properly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>
              This information is required for account verification and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nin" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  National Identification Number (NIN) *
                </Label>
                <Input
                  id="nin"
                  type="text"
                  placeholder="Enter your 11-digit NIN"
                  value={formData.nin}
                  onChange={(e) => handleInputChange('nin', e.target.value)}
                  maxLength={11}
                  required
                />
                <p className="text-xs text-gray-500">
                  Your NIN is required for identity verification and will be kept secure
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      type="text"
                      placeholder="Full name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="emergencyRelationship">Relationship *</Label>
                  <Input
                    id="emergencyRelationship"
                    type="text"
                    placeholder="e.g., Mother, Father, Sibling, Friend"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Completing Profile...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}