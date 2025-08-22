'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  User,
  FileText,
  Eye,
  Check,
  X,
  Clock,
  MessageSquare,
  Download,
  Star,
  Building,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface Application {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  submittedAt: Date
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  monthlyIncome: number
  employmentStatus: string
  employer: string
  moveInDate: string
  documents: {
    proofOfEmployment: boolean
    proofOfIncome: boolean
    governmentId: boolean
    guarantorLetter: boolean
  }
  score: number
  notes?: string
}

// Mock data - in real app, this would come from Firebase
const mockApplications: Application[] = [
  {
    id: '1',
    propertyId: 'prop1',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    propertyAddress: '15 Adeola Odeku Street, Victoria Island, Lagos',
    tenantId: 'tenant1',
    tenantName: 'John Adebayo',
    tenantEmail: 'john.adebayo@email.com',
    tenantPhone: '+234 803 123 4567',
    submittedAt: new Date('2024-01-15'),
    status: 'submitted',
    monthlyIncome: 450000,
    employmentStatus: 'employed',
    employer: 'Tech Company Ltd',
    moveInDate: '2024-02-01',
    documents: {
      proofOfEmployment: true,
      proofOfIncome: true,
      governmentId: true,
      guarantorLetter: false
    },
    score: 85
  },
  {
    id: '2',
    propertyId: 'prop2',
    propertyTitle: '3-Bedroom House in Lekki',
    propertyAddress: '23 Chevron Drive, Lekki Phase 1, Lagos',
    tenantId: 'tenant2',
    tenantName: 'Sarah Okonkwo',
    tenantEmail: 'sarah.okonkwo@email.com',
    tenantPhone: '+234 802 987 6543',
    submittedAt: new Date('2024-01-14'),
    status: 'under_review',
    monthlyIncome: 680000,
    employmentStatus: 'self-employed',
    employer: 'Digital Marketing Agency',
    moveInDate: '2024-02-15',
    documents: {
      proofOfEmployment: true,
      proofOfIncome: true,
      governmentId: true,
      guarantorLetter: true
    },
    score: 92
  },
  {
    id: '3',
    propertyId: 'prop1',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    propertyAddress: '15 Adeola Odeku Street, Victoria Island, Lagos',
    tenantId: 'tenant3',
    tenantName: 'Michael Okafor',
    tenantEmail: 'michael.okafor@email.com',
    tenantPhone: '+234 701 456 7890',
    submittedAt: new Date('2024-01-13'),
    status: 'approved',
    monthlyIncome: 520000,
    employmentStatus: 'employed',
    employer: 'Banking Institution',
    moveInDate: '2024-01-25',
    documents: {
      proofOfEmployment: true,
      proofOfIncome: true,
      governmentId: true,
      guarantorLetter: true
    },
    score: 88
  }
]

export default function LandlordApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string, notes?: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus as Application['status'], notes }
          : app
      )
    )
    toast.success(`Application ${newStatus} successfully!`)
  }

  const requestDocuments = async (applicationId: string, documentTypes: string[]) => {
    // Mock document request - in real app, this would send a notification to tenant
    toast.success(`Document request sent to tenant for: ${documentTypes.join(', ')}`)
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = applications.filter(app => app.status === 'submitted').length
  const reviewingCount = applications.filter(app => app.status === 'under_review').length
  const approvedCount = applications.filter(app => app.status === 'approved').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rental Applications</h1>
              <p className="text-purple-200 mt-2">Review and manage tenant applications for your properties</p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-sm text-purple-200">New</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{reviewingCount}</div>
                <div className="text-sm text-purple-200">Reviewing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{approvedCount}</div>
                <div className="text-sm text-purple-200">Approved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by tenant name or property..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="submitted">New Applications</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications Cards */}
          <div className="lg:col-span-2 space-y-6">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600">No applications match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`cursor-pointer transition-all ${
                    selectedApplication?.id === application.id ? 'ring-2 ring-purple-500' : ''
                  }`} onClick={() => setSelectedApplication(application)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.tenantName}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mb-2">
                            <Building className="h-4 w-4 mr-1" />
                            {application.propertyTitle}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {application.propertyAddress}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(application.status)} mb-2`}>
                            {application.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className={`text-lg font-bold ${getScoreColor(application.score)}`}>
                            {application.score}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Income:</span>
                          <div className="font-medium">{formatPrice(application.monthlyIncome)}</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Move-in:</span>
                          <div className="font-medium">{new Date(application.moveInDate).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Employment:</span>
                          <div className="font-medium">{application.employmentStatus}</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Submitted:</span>
                          <div className="font-medium">{application.submittedAt.toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Document Status */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-sm text-gray-600">Documents:</div>
                        {Object.entries(application.documents).map(([doc, available]) => (
                          <div key={doc} className="flex items-center">
                            {available ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {application.status === 'submitted' && (
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusUpdate(application.id, 'under_review')
                            }}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Application Detail Panel */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tenant Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Tenant Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {selectedApplication.tenantName}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {selectedApplication.tenantEmail}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {selectedApplication.tenantPhone}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                        {selectedApplication.employer}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold mb-3">Documents Status</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedApplication.documents).map(([doc, available]) => (
                        <div key={doc} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{doc.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center space-x-2">
                            {available ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => requestDocuments(selectedApplication.id, [doc])}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Request
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Actions</h4>
                    {selectedApplication.status === 'submitted' || selectedApplication.status === 'under_review' ? (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Application
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {selectedApplication.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Tenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                  <p className="text-gray-600">Click on an application to view detailed information and take actions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}