'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import {
  Users,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Check,
  X,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Shield,
  MessageSquare,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react'

// Mock admin data - in real app, this would come from Firebase Analytics
const adminStats = {
  totalUsers: 2847,
  totalLandlords: 623,
  totalTenants: 2224,
  totalProperties: 1456,
  activeListings: 1203,
  pendingApproval: 89,
  totalApplications: 3621,
  monthlyRevenue: 2850000,
  featuredListingsRevenue: 1470000,
  conversionRate: 23.4,
  averagePropertyPrice: 485000
}

const recentActivities = [
  { id: 1, type: 'property', action: 'New property listed', user: 'John Landlord', time: '2 minutes ago' },
  { id: 2, type: 'application', action: 'Application submitted', user: 'Sarah Tenant', time: '5 minutes ago' },
  { id: 3, type: 'payment', action: 'Featured listing payment', user: 'Mike Property Owner', time: '10 minutes ago' },
  { id: 4, type: 'user', action: 'New user registered', user: 'Alice Johnson', time: '15 minutes ago' },
  { id: 5, type: 'report', action: 'Property reported', user: 'Anonymous', time: '22 minutes ago' }
]

const pendingProperties = [
  { id: 1, title: '3-Bedroom House in Lekki', landlord: 'John Adebayo', submitted: '2024-01-15', price: 750000 },
  { id: 2, title: 'Studio Apartment in VI', landlord: 'Sarah Okonkwo', submitted: '2024-01-14', price: 320000 },
  { id: 3, title: '2-Bedroom Flat in Ikeja', landlord: 'Michael Okafor', submitted: '2024-01-13', price: 480000 }
]

const reportedContent = [
  { id: 1, type: 'Property', title: 'Misleading photos', reported: 'Property ID: P123', severity: 'Medium' },
  { id: 2, type: 'User', title: 'Spam messages', reported: 'User: fake_landlord@email.com', severity: 'High' },
  { id: 3, type: 'Property', title: 'Fake listing', reported: 'Property ID: P567', severity: 'High' }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('7d')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePropertyApproval = (propertyId: number, action: 'approve' | 'reject') => {
    // Mock approval action
    console.log(`${action} property ${propertyId}`)
  }

  const handleContentModeration = (contentId: number, action: 'resolve' | 'escalate') => {
    // Mock moderation action
    console.log(`${action} content ${contentId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-300 mt-2">Platform management and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
                    <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Properties</p>
                    <p className="text-3xl font-bold">{adminStats.activeListings.toLocaleString()}</p>
                    <p className="text-green-100 text-xs mt-1">+8% from last month</p>
                  </div>
                  <Building className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Monthly Revenue</p>
                    <p className="text-3xl font-bold">{formatCurrency(adminStats.monthlyRevenue)}</p>
                    <p className="text-purple-100 text-xs mt-1">+15% from last month</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold">{adminStats.conversionRate}%</p>
                    <p className="text-orange-100 text-xs mt-1">+2.1% from last month</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest platform activities and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'property' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'application' ? 'bg-green-100 text-green-600' :
                          activity.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                          activity.type === 'user' ? 'bg-orange-100 text-orange-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {activity.type === 'property' && <Building className="h-4 w-4" />}
                          {activity.type === 'application' && <FileText className="h-4 w-4" />}
                          {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                          {activity.type === 'user' && <Users className="h-4 w-4" />}
                          {activity.type === 'report' && <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.user} · {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Quick Statistics
                  </CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Landlords</span>
                      <span className="text-lg font-bold text-blue-600">{adminStats.totalLandlords}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Tenants</span>
                      <span className="text-lg font-bold text-green-600">{adminStats.totalTenants}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Total Applications</span>
                      <span className="text-lg font-bold text-purple-600">{adminStats.totalApplications}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Avg. Property Price</span>
                      <span className="text-lg font-bold text-orange-600">{formatCurrency(adminStats.averagePropertyPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Pending Property Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve new property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-sm text-gray-600">
                          by {property.landlord} · {formatCurrency(property.price)}/month
                        </p>
                        <p className="text-xs text-gray-500">Submitted: {property.submitted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handlePropertyApproval(property.id, 'approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handlePropertyApproval(property.id, 'reject')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>Search and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="tenant">Tenants</SelectItem>
                      <SelectItem value="landlord">Landlords</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Search</h3>
                  <p className="text-gray-600">Enter search criteria to find and manage users</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Content Moderation
                </CardTitle>
                <CardDescription>Review reported content and user complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              report.severity === 'High' ? 'bg-red-100 text-red-800' :
                              report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {report.severity}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.reported}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Investigate
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleContentModeration(report.id, 'resolve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          onClick={() => handleContentModeration(report.id, 'escalate')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Featured Listings</span>
                      <span className="font-bold">{formatCurrency(adminStats.featuredListingsRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Commission</span>
                      <span className="font-bold">{formatCurrency(adminStats.monthlyRevenue - adminStats.featuredListingsRevenue)}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total Revenue</span>
                        <span>{formatCurrency(adminStats.monthlyRevenue)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">Detailed analytics and reporting tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}