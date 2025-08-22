'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload, Download, Trash2, Eye, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

// Mock data - will be replaced with Firebase Storage
const mockDocuments = [
  {
    id: '1',
    name: 'National ID Card',
    type: 'id-verification',
    fileName: 'national_id_front.jpg',
    fileSize: '2.1 MB',
    uploadDate: new Date('2024-01-15'),
    status: 'verified',
    url: '/api/placeholder/400/300'
  },
  {
    id: '2',
    name: 'Passport Photo Page',
    type: 'id-verification',
    fileName: 'passport_photo.jpg',
    fileSize: '1.8 MB',
    uploadDate: new Date('2024-01-15'),
    status: 'verified',
    url: '/api/placeholder/400/300'
  },
  {
    id: '3',
    name: 'Employment Letter',
    type: 'income-proof',
    fileName: 'employment_letter.pdf',
    fileSize: '1.2 MB',
    uploadDate: new Date('2024-01-16'),
    status: 'pending',
    url: '/api/placeholder/400/300'
  },
  {
    id: '4',
    name: 'Bank Statement - January',
    type: 'bank-statements',
    fileName: 'bank_statement_jan.pdf',
    fileSize: '856 KB',
    uploadDate: new Date('2024-01-16'),
    status: 'verified',
    url: '/api/placeholder/400/300'
  }
]

const documentCategories = [
  {
    id: 'id-verification',
    name: 'ID Verification',
    description: 'National ID, International Passport, or Driver\'s License',
    required: true,
    icon: FileText,
    acceptedTypes: '.jpg,.jpeg,.png,.pdf'
  },
  {
    id: 'income-proof',
    name: 'Proof of Income',
    description: 'Employment letter, salary slip, or business registration',
    required: true,
    icon: FileText,
    acceptedTypes: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'bank-statements',
    name: 'Bank Statements',
    description: 'Last 3 months bank statements',
    required: true,
    icon: FileText,
    acceptedTypes: '.pdf'
  },
  {
    id: 'references',
    name: 'References',
    description: 'Previous landlord or employer references',
    required: false,
    icon: FileText,
    acceptedTypes: '.pdf,.jpg,.jpeg,.png'
  }
]

export default function TenantDocumentsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [uploading, setUploading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryStatus = (categoryId: string) => {
    const categoryDocs = mockDocuments.filter(doc => doc.type === categoryId)
    const verifiedDocs = categoryDocs.filter(doc => doc.status === 'verified')
    const pendingDocs = categoryDocs.filter(doc => doc.status === 'pending')
    
    if (verifiedDocs.length > 0) return 'verified'
    if (pendingDocs.length > 0) return 'pending'
    return 'missing'
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Document uploaded successfully!')
      
      // Reset file input
      event.target.value = ''
    } catch (error) {
      toast.error('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Document deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tenant">
                <Button variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
                <p className="text-gray-600">Manage your rental application documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                Profile: {Math.round((mockDocuments.filter(d => d.status === 'verified').length / documentCategories.filter(c => c.required).length) * 100)}% Complete
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {documentCategories.map((category) => {
            const status = getCategoryStatus(category.id)
            const Icon = category.icon
            
            return (
              <Card key={category.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-sm">{category.name}</CardTitle>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                  {category.required && (
                    <Badge variant="outline" className="text-xs w-fit">
                      Required
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(status)} variant="secondary">
                      {status === 'verified' ? 'Complete' : status === 'pending' ? 'Pending' : 'Missing'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {mockDocuments.filter(d => d.type === category.id).length} file(s)
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Upload New Document */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Choose the document type and upload your file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Document Category</Label>
                <select 
                  id="category"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select category...</option>
                  {documentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="file">Choose File</Label>
                <Input
                  id="file"
                  type="file"
                  className="mt-1"
                  accept={documentCategories.find(c => c.id === selectedCategory)?.acceptedTypes || '*'}
                  onChange={(e) => handleFileUpload(e, selectedCategory)}
                  disabled={!selectedCategory || uploading}
                />
              </div>
            </div>
            {selectedCategory && (
              <p className="text-sm text-gray-600 mt-2">
                Accepted formats: {documentCategories.find(c => c.id === selectedCategory)?.acceptedTypes}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              View and manage all your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(document.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{document.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{document.fileName}</span>
                          <span>{document.fileSize}</span>
                          <span>Uploaded {document.uploadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(document.status)} variant="secondary">
                      {document.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                <p className="text-gray-600 mb-4">
                  Start by uploading your identification documents
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}