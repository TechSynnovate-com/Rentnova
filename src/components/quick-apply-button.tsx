'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useRentalProfile } from '@/hooks/use-rental-profile'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  AlertCircle, 
  CheckCircle, 
  User, 
  FileText,
  Clock
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { FIREBASE_COLLECTIONS } from '@/types/firebase-schema'
import { toast } from 'react-hot-toast'

interface QuickApplyButtonProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  landlordId: string
  className?: string
}

export default function QuickApplyButton({ 
  propertyId, 
  propertyTitle, 
  propertyPrice, 
  landlordId,
  className 
}: QuickApplyButtonProps) {
  const { user } = useAuth()
  const { profile, loading, isProfileComplete, getProfileStatus, getMissingFields } = useRentalProfile()
  const router = useRouter()
  const [applying, setApplying] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleQuickApply = async () => {
    if (!user) {
      toast.error('Please login to apply')
      router.push('/auth/login')
      return
    }

    if (!isProfileComplete()) {
      setShowDialog(true)
      return
    }

    setApplying(true)
    try {
      // Submit application using complete rental profile
      const applicationData = {
        propertyId,
        propertyTitle,
        propertyPrice,
        tenantId: user.uid,
        tenantEmail: user.email,
        tenantName: user.displayName,
        landlordId,
        
        // Use data from rental profile
        applicantName: profile?.fullName || user.displayName,
        applicantEmail: user.email,
        applicantPhone: profile?.phoneNumber || '',
        monthlyIncome: profile?.monthlyIncome || 0,
        employmentStatus: profile?.employmentStatus || '',
        jobTitle: profile?.jobTitle || '',
        companyName: profile?.companyName || '',
        preferredMoveInDate: profile?.moveInDate || '',
        numberOfOccupants: profile?.numberOfOccupants || 1,
        emergencyContact: {
          name: profile?.emergencyContactName || '',
          phone: profile?.emergencyContactPhone || '',
          relationship: profile?.emergencyContactRelationship || ''
        },
        
        applicationMethod: 'quick_apply',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, FIREBASE_COLLECTIONS.APPLICATIONS), applicationData)
      
      toast.success('Application submitted successfully!')
      router.push('/dashboard/tenant/applications')
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleManualApply = () => {
    router.push(`/properties/${propertyId}/apply`)
  }

  const handleCompleteProfile = () => {
    router.push('/dashboard/tenant/rental-profile')
  }

  if (loading) {
    return (
      <Button disabled className={className}>
        <Clock className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <>
      <Button 
        onClick={handleQuickApply}
        disabled={applying}
        className={className}
      >
        {applying ? (
          <>
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            {isProfileComplete() ? 'Quick Apply' : 'Apply Now'}
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Complete Your Rental Profile
            </DialogTitle>
            <DialogDescription>
              To apply for properties, you need to complete your rental profile first.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Your profile status:</h4>
              <div className="flex items-center space-x-2">
                {isProfileComplete() ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="default">Complete</Badge>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <Badge variant="secondary">Incomplete</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Choose an option:</h4>
              
              <Button 
                onClick={handleCompleteProfile}
                className="w-full justify-start"
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                Complete Rental Profile (Recommended)
              </Button>
              
              <Button 
                onClick={handleApplyAnyway}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Fill Application Manually
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Why complete your rental profile?</strong>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Apply to properties with one click</li>
                <li>Auto-fill application forms</li>
                <li>Faster landlord responses</li>
                <li>Professional appearance</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}