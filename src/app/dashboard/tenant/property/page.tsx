'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Home, MapPin, DollarSign, Calendar, FileText, MessageSquare, Phone, Mail, AlertCircle, CreditCard, Settings, Wrench } from 'lucide-react'
import Image from 'next/image'

// Mock data - will be replaced with Firebase data
const mockProperty = {
  id: 'prop-1',
  title: 'Modern 2-Bedroom Apartment',
  address: '123 Victoria Island, Lagos',
  landlord: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    avatar: '/api/placeholder/60/60'
  },
  lease: {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    monthlyRent: 450000,
    securityDeposit: 900000,
    status: 'active'
  },
  payments: [
    {
      id: '1',
      month: 'January 2024',
      amount: 450000,
      dueDate: new Date('2024-01-01'),
      paidDate: new Date('2023-12-28'),
      status: 'paid',
      method: 'Bank Transfer'
    },
    {
      id: '2',
      month: 'February 2024',
      amount: 450000,
      dueDate: new Date('2024-02-01'),
      paidDate: null,
      status: 'due',
      method: null
    }
  ],
  maintenanceRequests: [
    {
      id: '1',
      title: 'Kitchen Faucet Leak',
      description: 'The kitchen faucet has been leaking for the past few days',
      category: 'plumbing',
      priority: 'medium',
      status: 'in-progress',
      submittedDate: new Date('2024-01-15'),
      photos: ['/api/placeholder/300/200']
    },
    {
      id: '2',
      title: 'Air Conditioning Not Working',
      description: 'The AC unit in the living room stopped cooling',
      category: 'hvac',
      priority: 'high',
      status: 'completed',
      submittedDate: new Date('2024-01-10'),
      completedDate: new Date('2024-01-12'),
      photos: []
    }
  ]
}

export default function TenantPropertyPage() {
  const { user } = useAuth()
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'due':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmitMaintenanceRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit maintenance request logic here
    console.log('Submitting maintenance request:', newMaintenanceRequest)
    setNewMaintenanceRequest({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Home className="h-6 w-6 mr-2" />
                My Property
              </h1>
              <p className="text-gray-600">{mockProperty.title}</p>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {mockProperty.address}
              </div>
            </div>
            <Badge className={getStatusColor(mockProperty.lease.status)} variant="secondary">
              {mockProperty.lease.status.charAt(0).toUpperCase() + mockProperty.lease.status.slice(1)} Lease
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lease Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Lease Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Lease Start</Label>
                    <p className="text-gray-900">{mockProperty.lease.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Lease End</Label>
                    <p className="text-gray-900">{mockProperty.lease.endDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Monthly Rent</Label>
                    <p className="text-gray-900 font-semibold text-lg">{formatPrice(mockProperty.lease.monthlyRent)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Security Deposit</Label>
                    <p className="text-gray-900">{formatPrice(mockProperty.lease.securityDeposit)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="mr-2">
                    <FileText className="h-4 w-4 mr-2" />
                    View Lease Document
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Lease Renewal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment History
                  </CardTitle>
                  <Button size="sm">
                    Pay Rent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProperty.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.month}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Due: {payment.dueDate.toLocaleDateString()}</span>
                          {payment.paidDate && <span>Paid: {payment.paidDate.toLocaleDateString()}</span>}
                          {payment.method && <span>Method: {payment.method}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatPrice(payment.amount)}</div>
                        </div>
                        <Badge className={getStatusColor(payment.status)} variant="secondary">
                          {payment.status}
                        </Badge>
                        {payment.status === 'due' && (
                          <Button size="sm">Pay Now</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    Maintenance Requests
                  </CardTitle>
                  <Button size="sm">
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {mockProperty.maintenanceRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-600">{request.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(request.priority)} variant="secondary">
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)} variant="secondary">
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {request.category}</span>
                        <span>Submitted: {request.submittedDate.toLocaleDateString()}</span>
                        {request.completedDate && (
                          <span>Completed: {request.completedDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Maintenance Request Form */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Submit New Maintenance Request</h4>
                  <form onSubmit={handleSubmitMaintenanceRequest} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select 
                          id="category"
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          value={newMaintenanceRequest.category}
                          onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, category: e.target.value }))}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="electrical">Electrical</option>
                          <option value="hvac">HVAC</option>
                          <option value="appliances">Appliances</option>
                          <option value="structural">Structural</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select 
                          id="priority"
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          value={newMaintenanceRequest.priority}
                          onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, priority: e.target.value }))}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={newMaintenanceRequest.title}
                        onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24"
                        placeholder="Detailed description of the maintenance issue"
                        value={newMaintenanceRequest.description}
                        onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit">Submit Request</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Landlord Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {mockProperty.landlord.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{mockProperty.landlord.name}</h4>
                    <p className="text-sm text-gray-600">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {mockProperty.landlord.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {mockProperty.landlord.phone}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Landlord
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Rent
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="h-4 w-4 mr-2" />
                  Request Maintenance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Inspection
                </Button>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-yellow-800">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  Your next rent payment is due on February 1st, 2024. 
                  Please ensure payment is made on time to avoid late fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}