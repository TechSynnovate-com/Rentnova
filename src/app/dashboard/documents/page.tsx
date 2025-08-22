'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Download, Eye, Trash2, CheckCircle, Clock, AlertCircle, Plus, File } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'National ID (NIN)', type: 'Identity', status: 'verified', uploadDate: '2024-01-15', size: '2.3 MB', format: 'PDF' },
    { id: 2, name: 'Bank Statement', type: 'Financial', status: 'pending', uploadDate: '2024-01-20', size: '1.8 MB', format: 'PDF' },
    { id: 3, name: 'Employment Letter', type: 'Income', status: 'verified', uploadDate: '2024-01-18', size: '856 KB', format: 'PDF' },
    { id: 4, name: 'Utility Bill', type: 'Address', status: 'rejected', uploadDate: '2024-01-10', size: '1.2 MB', format: 'PDF' },
    { id: 5, name: 'Passport Photo', type: 'Identity', status: 'verified', uploadDate: '2024-01-12', size: '245 KB', format: 'JPG' }
  ])

  const getStatusBadge = (status: string) => {
    const styles = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const icons = {
      verified: CheckCircle,
      pending: Clock,
      rejected: AlertCircle
    }
    const Icon = icons[status as keyof typeof icons]
    
    return (
      <Badge className={`${styles[status as keyof typeof styles]} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    )
  }

  const documentTypes = [
    { name: 'Identity Documents', count: 2, color: 'bg-blue-500', icon: FileText },
    { name: 'Financial Records', count: 1, color: 'bg-green-500', icon: FileText },
    { name: 'Income Verification', count: 1, color: 'bg-purple-500', icon: FileText },
    { name: 'Address Proof', count: 1, color: 'bg-orange-500', icon: FileText }
  ]

  const handleFileUpload = () => {
    toast.success('File upload feature coming soon!')
  }

  const handleDownload = (docName: string) => {
    toast.success(`Downloading ${docName}...`)
  }

  const handleDelete = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    toast.success('Document deleted successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-6 rounded-full">
                <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              My Documents
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-6">
              Manage your verification documents and important files
            </p>
            <Button
              onClick={handleFileUpload}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Document Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {documentTypes.map((type, index) => {
            const IconComponent = type.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${type.color} text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-2xl font-bold text-gray-800">{type.count}</p>
                  <p className="text-sm text-gray-600">Documents</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Documents List */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center">
                <File className="mr-3 h-6 w-6" />
                All Documents
              </CardTitle>
              <Button
                onClick={handleFileUpload}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-lg mr-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.format}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Viewing document...')}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc.name)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Card className="mt-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
            <CardTitle className="text-2xl">Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Accepted File Types</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• PDF documents (.pdf)</li>
                  <li>• Image files (.jpg, .jpeg, .png)</li>
                  <li>• Document scans (high quality)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Maximum file size: 5MB</li>
                  <li>• Clear, readable text</li>
                  <li>• No watermarks or stamps</li>
                  <li>• Original documents preferred</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}