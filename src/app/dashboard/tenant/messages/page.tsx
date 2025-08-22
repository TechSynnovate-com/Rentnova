'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MessageSquare, Search, Plus, Send, Paperclip, MoreVertical, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - will be replaced with Firebase data
const mockConversations = [
  {
    id: '1',
    landlordId: 'landlord-1',
    landlordName: 'John Doe',
    landlordAvatar: '/api/placeholder/40/40',
    propertyTitle: 'Modern 2-Bedroom Apartment',
    propertyAddress: '123 Victoria Island, Lagos',
    lastMessage: 'Thank you for your application. I would like to schedule a viewing.',
    lastMessageTime: new Date('2024-01-18T10:30:00'),
    unreadCount: 2,
    status: 'active'
  },
  {
    id: '2',
    landlordId: 'landlord-2',
    landlordName: 'Jane Smith',
    landlordAvatar: '/api/placeholder/40/40',
    propertyTitle: 'Luxury 3-Bedroom House',
    propertyAddress: '456 Ikoyi, Lagos',
    lastMessage: 'Congratulations! Your application has been approved.',
    lastMessageTime: new Date('2024-01-17T15:45:00'),
    unreadCount: 0,
    status: 'active'
  },
  {
    id: '3',
    landlordId: 'landlord-3',
    landlordName: 'Mike Johnson',
    landlordAvatar: '/api/placeholder/40/40',
    propertyTitle: 'Cozy Studio Apartment',
    propertyAddress: '789 Lekki Phase 1, Lagos',
    lastMessage: 'We need additional documentation for your application.',
    lastMessageTime: new Date('2024-01-16T09:15:00'),
    unreadCount: 1,
    status: 'pending'
  }
]

const mockMessages = [
  {
    id: '1',
    senderId: 'landlord-1',
    senderName: 'John Doe',
    message: 'Hello! Thank you for your interest in my property.',
    timestamp: new Date('2024-01-18T09:00:00'),
    type: 'text'
  },
  {
    id: '2',
    senderId: 'tenant-1',
    senderName: 'You',
    message: 'Hi! I would love to schedule a viewing. When would be convenient?',
    timestamp: new Date('2024-01-18T09:15:00'),
    type: 'text'
  },
  {
    id: '3',
    senderId: 'landlord-1',
    senderName: 'John Doe',
    message: 'I have availability this weekend. Saturday or Sunday afternoon works best for me.',
    timestamp: new Date('2024-01-18T10:00:00'),
    type: 'text'
  },
  {
    id: '4',
    senderId: 'landlord-1',
    senderName: 'John Doe',
    message: 'Thank you for your application. I would like to schedule a viewing.',
    timestamp: new Date('2024-01-18T10:30:00'),
    type: 'text'
  }
]

export default function TenantMessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = mockConversations.filter(conv =>
    conv.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    
    // Add message logic here
    console.log('Sending message:', messageText)
    setMessageText('')
  }

  const getTotalUnreadCount = () => {
    return mockConversations.reduce((total, conv) => total + conv.unreadCount, 0)
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
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Communicate with landlords about your applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getTotalUnreadCount() > 0 && (
                <Badge variant="secondary">
                  {getTotalUnreadCount()} unread message{getTotalUnreadCount() > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedConversation.id === conversation.id
                        ? 'border-lavender-600 bg-lavender-50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.landlordName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate mb-1">
                          {conversation.propertyTitle}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedConversation.landlordName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.propertyTitle}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'tenant-1' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'tenant-1'
                              ? 'bg-lavender-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'tenant-1' ? 'text-lavender-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}