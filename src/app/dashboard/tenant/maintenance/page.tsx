'use client'

/**
 * Tenant Maintenance Request Management
 * Interface for tenants to submit and track maintenance requests
 * 
 * Features:
 * - New request submission with photo upload
 * - Request tracking with status updates
 * - Priority level assignment
 * - Communication with landlord/service providers
 * - Request history and filtering
 * 
 * @author RentNova Development Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Plus,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Star,
  Filter,
  Search
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled'
  propertyId: string
  propertyTitle: string
  tenantId: string
  landlordId: string
  submittedAt: Date
  updatedAt: Date
  scheduledDate?: Date
  completedAt?: Date
  assignedTo?: string
  estimatedCost?: number
  images: string[]
  landlordNotes?: string
  tenantFeedback?: {
    rating: number
    comment: string
  }
}

// Mock data - in real app, this would come from Firebase
const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Leaking Kitchen Faucet',
    description: 'The kitchen faucet has been leaking for the past few days. Water keeps dripping even when fully closed.',
    category: 'plumbing',
    priority: 'medium',
    status: 'in_progress',
    propertyId: 'prop1',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    tenantId: 'tenant1',
    landlordId: 'landlord1',
    submittedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    scheduledDate: new Date('2024-01-18'),
    assignedTo: 'John Plumber Services',
    estimatedCost: 15000,
    images: ['https://example.com/faucet1.jpg', 'https://example.com/faucet2.jpg'],
    landlordNotes: 'Plumber scheduled for Thursday morning'
  },
  {
    id: '2',
    title: 'Air Conditioning Not Working',
    description: 'The AC in the living room stopped working yesterday. It turns on but no cold air is coming out.',
    category: 'hvac',
    priority: 'high',
    status: 'acknowledged',
    propertyId: 'prop1',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    tenantId: 'tenant1',
    landlordId: 'landlord1',
    submittedAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    images: [],
    landlordNotes: 'HVAC technician will be contacted'
  },
  {
    id: '3',
    title: 'Broken Bathroom Tile',
    description: 'One of the tiles in the bathroom shower area has cracked and is loose.',
    category: 'general',
    priority: 'low',
    status: 'completed',
    propertyId: 'prop1',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    tenantId: 'tenant1',
    landlordId: 'landlord1',
    submittedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    assignedTo: 'Metro Tile Works',
    estimatedCost: 8000,
    images: ['https://example.com/tile.jpg'],
    tenantFeedback: {
      rating: 5,
      comment: 'Excellent work, very professional service'
    }
  }
]

const CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'hvac', label: 'HVAC/Cooling', icon: '❄️' },
  { value: 'appliances', label: 'Appliances', icon: '🏠' },
  { value: 'structural', label: 'Structural', icon: '🏗️' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'general', label: 'General Maintenance', icon: '🔨' },
  { value: 'other', label: 'Other', icon: '📝' }
]

export default function MaintenancePage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    images: [] as string[]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const handleImageUpload = async (file: File) => {
    // Mock image upload - in real app, this would upload to Firebase Storage
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://storage.firebase.com/maintenance/${user?.id}/${Date.now()}_${file.name}`
        resolve(mockUrl)
      }, 1000)
    })
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      for (const file of files) {
        const url = await handleImageUpload(file)
        setNewRequest(prev => ({
          ...prev,
          images: [...prev.images, url]
        }))
        toast.success('Image uploaded successfully!')
      }
    }
    input.click()
  }

  const submitRequest = async () => {
    if (!newRequest.title || !newRequest.description || !newRequest.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const requestData = {
        ...newRequest,
        tenantId: user?.id,
        propertyId: 'current_property_id', // This would come from user's current property
        propertyTitle: '2-Bedroom Apartment in Victoria Island', // This would come from property data
        landlordId: 'landlord_id', // This would come from property data
        status: 'submitted',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, 'maintenance_requests'), requestData)
      toast.success('Maintenance request submitted successfully!')
      
      // Reset form
      setNewRequest({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        images: []
      })
      setShowNewRequestForm(false)
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request. Please try again.')
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Maintenance Requests</h1>
              <p className="text-teal-200 mt-2">Submit and track maintenance requests for your rental property</p>
            </div>
            <Button
              onClick={() => setShowNewRequestForm(true)}
              className="bg-white text-teal-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Request Modal */}
        {showNewRequestForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Submit Maintenance Request
                </CardTitle>
                <CardDescription>
                  Describe the issue and we'll coordinate with your landlord to resolve it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newRequest.category} onValueChange={(value) => setNewRequest(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={newRequest.priority} onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait</SelectItem>
                        <SelectItem value="medium">Medium - Should be fixed soon</SelectItem>
                        <SelectItem value="high">High - Needs attention</SelectItem>
                        <SelectItem value="urgent">Urgent - Safety concern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about the issue, when it started, and any relevant details..."
                    rows={4}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {newRequest.images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {newRequest.images.map((image, index) => (
                          <div key={index} className="relative">
                            <Image src={image} alt={`Upload ${index + 1}`} width={300} height={80} className="w-full h-20 object-cover rounded" />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => setNewRequest(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload photos to help explain the issue</p>
                      </div>
                    )}
                    <Button type="button" variant="outline" onClick={addImage} className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitRequest} className="bg-teal-600 hover:bg-teal-700">
                    Submit Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search maintenance requests..."
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
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Requests</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any maintenance requests yet.</p>
                <Button onClick={() => setShowNewRequestForm(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Submitted: {request.submittedAt.toLocaleDateString()}
                          </span>
                          {request.scheduledDate && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Scheduled: {request.scheduledDate.toLocaleDateString()}
                            </span>
                          )}
                          {request.estimatedCost && (
                            <span className="flex items-center">
                              <span className="mr-1">💰</span>
                              Est. Cost: {formatCurrency(request.estimatedCost)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {request.status === 'in_progress' && (
                          <div className="flex items-center text-purple-600 mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            In Progress
                          </div>
                        )}
                        {request.status === 'completed' && request.tenantFeedback && (
                          <div className="flex items-center text-yellow-600">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            {request.tenantFeedback.rating}/5
                          </div>
                        )}
                      </div>
                    </div>

                    {request.landlordNotes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-1">Landlord Update:</h4>
                        <p className="text-blue-800 text-sm">{request.landlordNotes}</p>
                        {request.assignedTo && (
                          <p className="text-blue-700 text-xs mt-2">Assigned to: {request.assignedTo}</p>
                        )}
                      </div>
                    )}

                    {request.images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Photos:</h4>
                        <div className="flex space-x-2">
                          {request.images.map((image, index) => (
                            <Image
                              key={index}
                              src={image}
                              alt={`Issue photo ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Category: <span className="font-medium capitalize">{request.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Landlord
                        </Button>
                        {request.status === 'completed' && !request.tenantFeedback && (
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Service
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}