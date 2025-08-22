'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useRentalProfile } from '@/hooks/use-rental-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Briefcase, 
  Home, 
  Clock,
  FileText,
  Zap,
  Edit
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { FirebaseProperty } from '@/types/firebase-schema'
import Header from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import ContextualHelp from '@/components/help-bubbles/contextual-help'
import RentalAdviceWizard from '@/components/ai-wizard/rental-advice-wizard'

interface ApplicationData {
  fullName: string
  email: string
  phone: string
  currentAddress: string
  moveInDate: string
  monthlyIncome: string
  employmentStatus: string
  companyName: string
  additionalNotes: string
}

export default function PropertyApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { 
    profile, 
    loading: profileLoading, 
    isProfileComplete, 
    getProfileStatus, 
    getMissingFields 
  } = useRentalProfile()
  
  const [property, setProperty] = useState<FirebaseProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [useProfile, setUseProfile] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    currentAddress: '',
    moveInDate: '',
    monthlyIncome: '',
    employmentStatus: '',
    companyName: '',
    additionalNotes: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyRef = doc(db, 'properties', params.id as string)
        const propertySnap = await getDoc(propertyRef)
        
        if (propertySnap.exists()) {
          setProperty({
            id: propertySnap.id,
            ...propertySnap.data()
          } as FirebaseProperty)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  useEffect(() => {
    if (profile && useProfile) {
      setApplicationData({
        fullName: profile.fullName || '',
        email: user?.email || '',
        phone: profile.phoneNumber || '',
        currentAddress: profile.currentAddress || '',
        moveInDate: profile.preferences?.moveInDate || '',
        monthlyIncome: profile.monthlyIncome?.toString() || '',
        employmentStatus: profile.employmentStatus || '',
        companyName: profile.employer || '',
        additionalNotes: ''
      })
    }
  }, [profile, useProfile])

  const handleUseProfile = () => {
    if (!isProfileComplete()) {
      toast.error('Please complete your rental profile first')
      router.push('/dashboard/tenant/rental-profile')
      return
    }
    setUseProfile(true)
    toast.success('Profile data loaded successfully!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !property) return

    setSubmitting(true)
    try {
      const applicationDoc = {
        propertyId: property.id,
        propertyTitle: property.propertyTitle || `${property.propertyType} in ${property.city}`,
        propertyPrice: property.price,
        landlordId: property.ownerId,
        tenantId: user.uid,
        tenantEmail: user.email,
        
        // Application data
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        currentAddress: applicationData.currentAddress,
        moveInDate: applicationData.moveInDate,
        monthlyIncome: parseFloat(applicationData.monthlyIncome) || 0,
        employmentStatus: applicationData.employmentStatus,
        companyName: applicationData.companyName,
        additionalNotes: applicationData.additionalNotes,
        
        // Application metadata
        status: 'pending',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        usedRentalProfile: useProfile,
        profileComplete: isProfileComplete()
      }

      await addDoc(collection(db, 'applications'), applicationDoc)
      
      toast.success('Application submitted successfully!')
      router.push('/dashboard/tenant/applications')
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application form...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
            <p className="text-gray-600 mb-4">The property you're trying to apply for doesn't exist.</p>
            <Button onClick={() => router.push('/properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Apply for Property</h1>
                  <p className="text-gray-600">{property.propertyTitle || `${property.propertyType} in ${property.city}`}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowWizard(true)}
                className="text-lavender-600 border-lavender-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                Get AI Advice
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Application Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Application Method
                  </CardTitle>
                  <CardDescription>
                    Choose how you'd like to fill out your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isProfileComplete() ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Use Rental Profile</p>
                          <p className="text-sm text-green-700">Your profile is complete and verified</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleUseProfile}
                        disabled={useProfile}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {useProfile ? 'Profile Loaded' : 'Use Profile'}
                      </Button>
                    </div>
                  ) : (
                    <ContextualHelp helpKey="application-process">
                      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-900">Complete Rental Profile</p>
                            <p className="text-sm text-yellow-700">
                              {getMissingFields().length} fields missing - complete for faster applications
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/dashboard/tenant/rental-profile')}
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Complete Profile
                        </Button>
                      </div>
                    </ContextualHelp>
                  )}

                  <div className="text-center text-gray-500">
                    <span className="text-sm">or</span>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Fill Manually</p>
                        <p className="text-sm text-gray-600">Enter your information manually below</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Form */}
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={applicationData.fullName}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                          disabled={useProfile}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applicationData.email}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          disabled={useProfile}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          disabled={useProfile}
                        />
                      </div>
                      <div>
                        <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={applicationData.moveInDate}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, moveInDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currentAddress">Current Address *</Label>
                      <Input
                        id="currentAddress"
                        value={applicationData.currentAddress}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, currentAddress: e.target.value }))}
                        required
                        disabled={useProfile}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Employment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employmentStatus">Employment Status *</Label>
                        <Input
                          id="employmentStatus"
                          value={applicationData.employmentStatus}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                          required
                          disabled={useProfile}
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={applicationData.companyName}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                          disabled={useProfile}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        value={applicationData.monthlyIncome}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                        required
                        disabled={useProfile}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="additionalNotes"
                        value={applicationData.additionalNotes}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder="Any additional information you'd like to share with the landlord..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-lavender-600 hover:bg-lavender-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Property Summary */}
              <ContextualHelp helpKey="property-price">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{property.propertyType} in {property.city}</p>
                      <p className="text-sm text-gray-600">{property.address}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Rent</span>
                      <span className="font-semibold text-lavender-600">${property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bedrooms</span>
                      <span className="font-medium">{property.bedroomCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bathrooms</span>
                      <span className="font-medium">{property.toiletCount}</span>
                    </div>
                  </CardContent>
                </Card>
              </ContextualHelp>

              {/* Application Tips */}
              <ContextualHelp helpKey="rental-timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="h-5 w-5 mr-2" />
                      Application Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Complete profile increases approval chances</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Applications are reviewed within 1-3 days</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">You'll receive email updates on status</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">Direct messaging available with landlord</p>
                    </div>
                  </CardContent>
                </Card>
              </ContextualHelp>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* AI Advice Wizard */}
      <RentalAdviceWizard 
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        propertyData={property}
      />
    </div>
  )
}