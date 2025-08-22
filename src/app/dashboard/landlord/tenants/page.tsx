'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLandlordProfile, useLandlordTenants } from '@/lib/queries/landlord-queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  MapPin,
  MessageSquare,
  FileText,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function LandlordTenantsPage() {
  const { user } = useAuth()
  const { data: landlordProfile } = useLandlordProfile(user?.id || '')
  const { data: tenants = [], isLoading } = useLandlordTenants(landlordProfile?.id || '')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getLeaseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'terminated': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusIcon = (tenant: any) => {
    const now = new Date()
    const dueDate = new Date(tenant.paymentInfo.nextPaymentDue)
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

    if (tenant.paymentInfo.outstandingBalance > 0) {
      return <AlertCircle className="h-5 w-5 text-red-500" />
    } else if (daysDifference <= 3) {
      return <Clock className="h-5 w-5 text-yellow-500" />
    } else {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getPaymentStatusText = (tenant: any) => {
    const now = new Date()
    const dueDate = new Date(tenant.paymentInfo.nextPaymentDue)
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

    if (tenant.paymentInfo.outstandingBalance > 0) {
      return `Overdue: ${formatPrice(tenant.paymentInfo.outstandingBalance)}`
    } else if (daysDifference <= 3) {
      return `Due in ${daysDifference} days`
    } else {
      return 'Up to date'
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tenant.leaseInfo.leaseStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your tenants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/90 to-indigo-800/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/landlord" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Users className="h-8 w-8 mr-3 text-purple-300" />
                  Manage Tenants
                </h1>
                <p className="text-purple-200 mt-1">
                  Manage your {tenants.length} tenants and track rent payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tenants by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by lease status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                <SelectItem value="active">Active Lease</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tenants Grid */}
        {filteredTenants.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              {tenants.length === 0 ? 'No tenants yet' : 'No tenants match your search'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {tenants.length === 0 
                ? 'Tenants will appear here when they sign lease agreements for your properties'
                : 'Try adjusting your search terms or filters'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant, index) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Header with Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{tenant.personalInfo.fullName}</h3>
                          <Badge className={getLeaseStatusColor(tenant.leaseInfo.leaseStatus)}>
                            {tenant.leaseInfo.leaseStatus}
                          </Badge>
                        </div>
                      </div>
                      {getPaymentStatusIcon(tenant)}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        {tenant.personalInfo.email}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {tenant.personalInfo.phone}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Property ID: {tenant.propertyId}
                      </div>
                    </div>

                    {/* Lease Information */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-white mb-3">Lease Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Monthly Rent:</span>
                          <span className="font-medium text-purple-300">{formatPrice(tenant.leaseInfo.monthlyRent)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Lease End:</span>
                          <span>{new Date(tenant.leaseInfo.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Security Deposit:</span>
                          <span>{formatPrice(tenant.leaseInfo.securityDeposit)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Payment Status</h4>
                        {getPaymentStatusIcon(tenant)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Next Due Date:</span>
                          <span>{new Date(tenant.paymentInfo.nextPaymentDue).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Status:</span>
                          <span className={tenant.paymentInfo.outstandingBalance > 0 ? 'text-red-400' : 'text-green-400'}>
                            {getPaymentStatusText(tenant)}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Total Paid:</span>
                          <span>{formatPrice(tenant.paymentInfo.totalPaid)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <FileText className="h-4 w-4 mr-1" />
                        Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}