'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, MapPin, DollarSign, Clock, MessageSquare, Upload, Eye } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with Firebase data
const mockApplications = [
  {
    id: '1',
    propertyId: 'prop-1',
    propertyTitle: 'Modern 2-Bedroom Apartment',
    propertyAddress: '123 Victoria Island, Lagos',
    monthlyRent: 450000,
    status: 'under-review',
    appliedDate: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-16'),
    landlordName: 'John Doe',
    documents: {
      idVerification: 'uploaded',
      incomeProof: 'uploaded',
      bankStatements: 'uploaded',
      references: 'pending'
    },
    notes: 'Application is being reviewed. Landlord may contact you for additional information.',
    nextSteps: 'Wait for landlord response'
  },
  {
    id: '2',
    propertyId: 'prop-2',
    propertyTitle: 'Luxury 3-Bedroom House',
    propertyAddress: '456 Ikoyi, Lagos',
    monthlyRent: 850000,
    status: 'approved',
    appliedDate: new Date('2024-01-10'),
    lastUpdated: new Date('2024-01-18'),
    landlordName: 'Jane Smith',
    documents: {
      idVerification: 'uploaded',
      incomeProof: 'uploaded',
      bankStatements: 'uploaded',
      references: 'uploaded'
    },
    notes: 'Congratulations! Your application has been approved. Please proceed with lease signing.',
    nextSteps: 'Sign lease agreement'
  },
  {
    id: '3',
    propertyId: 'prop-3',
    propertyTitle: 'Cozy Studio Apartment',
    propertyAddress: '789 Lekki Phase 1, Lagos',
    monthlyRent: 280000,
    status: 'rejected',
    appliedDate: new Date('2024-01-05'),
    lastUpdated: new Date('2024-01-12'),
    landlordName: 'Mike Johnson',
    documents: {
      idVerification: 'uploaded',
      incomeProof: 'uploaded',
      bankStatements: 'missing',
      references: 'uploaded'
    },
    notes: 'Application was not successful. Thank you for your interest.',
    nextSteps: 'Apply to other properties'
  }
]

export default function TenantApplicationsPage() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'under-review':
        return 'Under Review'
      case 'rejected':
        return 'Rejected'
      case 'draft':
        return 'Draft'
      default:
        return 'Unknown'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredApplications = mockApplications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track your rental applications and their status</p>
            </div>
            <Link href="/properties">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Apply to More Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
              size="sm"
            >
              All ({mockApplications.length})
            </Button>
            <Button
              variant={selectedStatus === 'under-review' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('under-review')}
              size="sm"
            >
              Under Review ({mockApplications.filter(a => a.status === 'under-review').length})
            </Button>
            <Button
              variant={selectedStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('approved')}
              size="sm"
            >
              Approved ({mockApplications.filter(a => a.status === 'approved').length})
            </Button>
            <Button
              variant={selectedStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('rejected')}
              size="sm"
            >
              Rejected ({mockApplications.filter(a => a.status === 'rejected').length})
            </Button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{application.propertyTitle}</CardTitle>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.propertyAddress}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatPrice(application.monthlyRent)} per month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Applied {application.appliedDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Updated {application.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Application Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Application Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{application.nextSteps}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{application.notes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ID Verification</span>
                        <Badge variant={application.documents.idVerification === 'uploaded' ? 'default' : 'secondary'}>
                          {application.documents.idVerification === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Income Proof</span>
                        <Badge variant={application.documents.incomeProof === 'uploaded' ? 'default' : 'secondary'}>
                          {application.documents.incomeProof === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Bank Statements</span>
                        <Badge variant={application.documents.bankStatements === 'uploaded' ? 'default' : 'secondary'}>
                          {application.documents.bankStatements === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">References</span>
                        <Badge variant={application.documents.references === 'uploaded' ? 'default' : 'secondary'}>
                          {application.documents.references === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Property
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Landlord
                  </Button>
                  {application.status === 'approved' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Sign Lease
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'all' 
                ? "You haven't applied to any properties yet." 
                : `No applications with status: ${selectedStatus}`}
            </p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}