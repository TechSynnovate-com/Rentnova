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
  CreditCard,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  Smartphone,
  Building2,
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PaymentRecord {
  id: string
  type: 'rent' | 'security_deposit' | 'service_charge' | 'late_fee' | 'utilities'
  amount: number
  dueDate: Date
  paidDate?: Date
  status: 'pending' | 'paid' | 'overdue' | 'failed'
  paymentMethod?: string
  transactionId?: string
  description: string
  propertyTitle: string
  receiptUrl?: string
}

// Mock payment data - in real app, this would come from Firebase
const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    type: 'rent',
    amount: 450000,
    dueDate: new Date('2024-02-01'),
    paidDate: new Date('2024-01-28'),
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN123456789',
    description: 'Monthly rent payment for February 2024',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    receiptUrl: 'https://example.com/receipt1.pdf'
  },
  {
    id: '2',
    type: 'rent',
    amount: 450000,
    dueDate: new Date('2024-03-01'),
    status: 'pending',
    description: 'Monthly rent payment for March 2024',
    propertyTitle: '2-Bedroom Apartment in Victoria Island'
  },
  {
    id: '3',
    type: 'service_charge',
    amount: 25000,
    dueDate: new Date('2024-01-15'),
    paidDate: new Date('2024-01-15'),
    status: 'paid',
    paymentMethod: 'Card Payment',
    transactionId: 'TXN987654321',
    description: 'Monthly service charge',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    receiptUrl: 'https://example.com/receipt2.pdf'
  },
  {
    id: '4',
    type: 'security_deposit',
    amount: 900000,
    dueDate: new Date('2023-12-01'),
    paidDate: new Date('2023-11-28'),
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN456789012',
    description: 'Security deposit for apartment lease',
    propertyTitle: '2-Bedroom Apartment in Victoria Island',
    receiptUrl: 'https://example.com/receipt3.pdf'
  },
  {
    id: '5',
    type: 'utilities',
    amount: 15000,
    dueDate: new Date('2024-01-20'),
    status: 'overdue',
    description: 'Electricity bill for January 2024',
    propertyTitle: '2-Bedroom Apartment in Victoria Island'
  }
]

const paymentMethods = [
  { id: 'card', name: 'Debit/Credit Card', icon: CreditCard },
  { id: 'transfer', name: 'Bank Transfer', icon: Building2 },
  { id: 'ussd', name: 'USSD Banking', icon: Smartphone }
]

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rent': return 'bg-blue-100 text-blue-800'
      case 'security_deposit': return 'bg-purple-100 text-purple-800'
      case 'service_charge': return 'bg-orange-100 text-orange-800'
      case 'utilities': return 'bg-teal-100 text-teal-800'
      case 'late_fee': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePayment = async (paymentId: string, method: string) => {
    try {
      // Mock payment processing - in real app, this would integrate with payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { 
                ...payment, 
                status: 'paid', 
                paidDate: new Date(),
                paymentMethod: method,
                transactionId: `TXN${Date.now()}`
              }
            : payment
        )
      )
      
      toast.success('Payment completed successfully!')
      setShowPaymentModal(false)
      setSelectedPayment(null)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    }
  }

  const downloadReceipt = (payment: PaymentRecord) => {
    if (payment.receiptUrl) {
      // Mock receipt download - in real app, this would download from storage
      toast.success('Receipt downloaded successfully!')
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payment Center</h1>
              <p className="text-green-200 mt-2">Manage your rent payments and transaction history</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
                <div className="text-sm text-green-200">Total Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
                <div className="text-sm text-green-200">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalOverdue)}</div>
                <div className="text-sm text-green-200">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Modal */}
        {showPaymentModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Make Payment
                </CardTitle>
                <CardDescription>
                  Complete your payment for {selectedPayment.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Amount Due:</span>
                    <span className="text-xl font-bold">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm font-medium">{selectedPayment.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Payment Method:</label>
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{method.name}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handlePayment(selectedPayment.id, selectedPaymentMethod)}
                    disabled={!selectedPaymentMethod}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Pay {formatCurrency(selectedPayment.amount)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Next Payment Due</p>
                  <p className="text-2xl font-bold">{formatCurrency(450000)}</p>
                  <p className="text-blue-100 text-xs">Due: March 1, 2024</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
              <Button 
                className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => {
                  const nextPayment = payments.find(p => p.status === 'pending')
                  if (nextPayment) {
                    setSelectedPayment(nextPayment)
                    setShowPaymentModal(true)
                  }
                }}
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Payment History</p>
                  <p className="text-2xl font-bold">{payments.filter(p => p.status === 'paid').length}</p>
                  <p className="text-gray-500 text-xs">Completed payments</p>
                </div>
                <Receipt className="h-8 w-8 text-green-500" />
              </div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPending + totalOverdue)}</p>
                  <p className="text-gray-500 text-xs">Total amount due</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search payments..."
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
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
                <p className="text-gray-600">No payments match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{payment.description}</h3>
                          <Badge className={getTypeColor(payment.type)}>
                            {payment.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {payment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {payment.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {payment.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{payment.propertyTitle}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Due: {payment.dueDate.toLocaleDateString()}</span>
                          {payment.paidDate && (
                            <span>Paid: {payment.paidDate.toLocaleDateString()}</span>
                          )}
                          {payment.paymentMethod && (
                            <span>via {payment.paymentMethod}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <div className="text-2xl font-bold">{formatCurrency(payment.amount)}</div>
                          {payment.transactionId && (
                            <div className="text-xs text-gray-500">ID: {payment.transactionId}</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {payment.status === 'pending' || payment.status === 'overdue' ? (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setShowPaymentModal(true)
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay Now
                            </Button>
                          ) : (
                            payment.receiptUrl && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => downloadReceipt(payment)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            )
                          )}
                        </div>
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