'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Send,
  Home,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  Star
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { showApplicationError } from '@/components/ui/error-toast'
import { useAuth } from '@/contexts/auth-context'
import { useRentalProfile } from '@/hooks/use-rental-profile'
import { useCountry } from '@/contexts/country-context'
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FIREBASE_COLLECTIONS, FirebaseApplication } from '@/types/firebase-schema'

interface QuickApplyWorkflowProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  landlordId: string
  onComplete?: () => void
  onCancel?: () => void
}

export default function QuickApplyWorkflow({
  propertyId,
  propertyTitle,
  propertyPrice,
  landlordId,
  onComplete,
  onCancel
}: QuickApplyWorkflowProps) {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useRentalProfile()
  const { formatPrice } = useCountry()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    moveInDate: '',
    leaseDuration: '12 months',
    additionalNotes: ''
  })

  const profileCompletion = profile ? profile.completionPercentage || 0 : 0
  const canProceed = profileCompletion >= 70

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const submitApplication = async () => {
    if (!user || !profile) {
      showApplicationError({ code: 'profile/incomplete' })
      return
    }

    if (!applicationData.coverLetter.trim()) {
      showApplicationError({ code: 'application/missing-cover-letter', message: 'Cover letter is required' })
      return
    }

    if (!applicationData.moveInDate) {
      showApplicationError({ code: 'application/missing-move-date', message: 'Move-in date is required' })
      return
    }

    try {
      setSubmitting(true)

      const application: Omit<FirebaseApplication, 'id'> = {
        propertyId,
        applicantId: user.id,
        landlordId,
        
        // Personal information
        personalInfo: {
          fullName: profile.fullName,
          email: user.email,
          phone: profile.phoneNumber,
          dateOfBirth: new Date(profile.dateOfBirth)
        },
        
        // Employment information
        employmentInfo: {
          employer: profile.employer || '',
          position: profile.jobTitle || '',
          monthlyIncome: profile.monthlyIncome
        },
        
        // Rental history
        rentalHistory: {
          ...(profile.rentalHistory?.previousAddress && { previousAddress: profile.rentalHistory.previousAddress }),
          ...(profile.rentalHistory?.landlordName && { previousLandlord: profile.rentalHistory.landlordName }),
          ...(profile.rentalHistory?.reasonForLeaving && { reasonForLeaving: profile.rentalHistory.reasonForLeaving })
        },
        
        // Documents
        documents: {},
        
        // Application fee
        applicationFee: {
          amount: 0,
          paid: false
        },
        
        // Status and metadata
        status: 'submitted',
        submittedAt: serverTimestamp() as any
      }

      await addDoc(collection(db, FIREBASE_COLLECTIONS.APPLICATIONS), application)
      
      toast.success('Application submitted successfully! The landlord will review your application.')
      onComplete?.()
    } catch (error) {
      console.error('Error submitting application:', error)
      showApplicationError(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (profileLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-blue-600" />
          <span>Apply for {propertyTitle}</span>
        </CardTitle>
        <CardDescription>
          Complete your application in 3 easy steps
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, title: 'Profile Check', icon: User },
            { step: 2, title: 'Application Details', icon: FileText },
            { step: 3, title: 'Review & Submit', icon: Send }
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {title}
              </span>
              {step < 3 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Profile Check */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Readiness Check</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <Badge variant={canProceed ? "default" : "secondary"}>
                    {profileCompletion}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>

              {!canProceed ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Profile Incomplete</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        You need at least 70% profile completion to apply. Please complete your rental profile first.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => window.open('/dashboard/tenant/rental-profile', '_blank')}
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Profile Ready</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your profile is complete enough to submit applications. Ready to proceed!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property</span>
                  <span className="font-medium">{propertyTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-medium text-blue-600">{formatPrice(propertyPrice)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!canProceed}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Application Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    placeholder="Tell the landlord why you'd be a great tenant..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={applicationData.moveInDate}
                      onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaseDuration">Lease Duration</Label>
                    <select
                      id="leaseDuration"
                      value={applicationData.leaseDuration}
                      onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 px-3 mt-1"
                    >
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                      <option value="18 months">18 months</option>
                      <option value="24 months">24 months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={applicationData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)}
                disabled={!applicationData.coverLetter || !applicationData.moveInDate}
              >
                Review Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Application</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property</span>
                      <span className="font-medium">{propertyTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Move-in Date</span>
                      <span className="font-medium">{applicationData.moveInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lease Duration</span>
                      <span className="font-medium">{applicationData.leaseDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium">{profile?.fullName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium">{profile?.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Income</span>
                      <span className="font-medium">{formatPrice(profile?.monthlyIncome || 0)}</span>
                    </div>
                  </div>
                </div>

                {applicationData.coverLetter && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-700">{applicationData.coverLetter}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button 
                onClick={submitApplication}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}